import React, { useState, useMemo, useContext } from 'react'
import {
  Button,
  Box,
  Heading,
  Flex,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import {
  Checklist,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import {
  getExpressionsForBlock,
  getCriteriaForBlock,
  getFilterById,
  getFilters,
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  hashCode,
  capitalize,
  evaluateCriteria,
  generateCriterionText,
} from './helpers'
import { decapitalize } from '../../stringHelpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import {
  CriterionDetail,
  Criterion,
  Criteria,
  ExpressionData,
  CriterionData,
  PatientType,
} from '../../types'

type FilterNodePropsType = {
  isContextualized: boolean
  blockId: string
  expressionIds: string[]
  filters: any
  isComplete: boolean
  onEvaluationResultChange: (result: boolean) => void
  onStateUpdate: ({ selectedKeys }) => void
  patientContext?: React.Context<PatientType>
  protocolState: any
  defaultToYes: boolean
}

export const FilterNode = (props: FilterNodePropsType) => {
  const {
    isContextualized,
    blockId,
    protocolState,
    isComplete,
    onEvaluationResultChange,
    onStateUpdate,
    patientContext,
    defaultToYes,
  } = props
  const patient = useContext(patientContext)
  const initialState = protocolState.filterNodeStates[blockId] ?? {
    selectedKeys: [],
  }

  const [expressions, setExpressions] = useState<ExpressionData[]>()
  const [criteria, setCriteria] = useState<Criteria>()
  const [evaluationResult, setEvaluationResult] =
    useState<boolean>(defaultToYes)
  const [numCriteriaWithUndefinedResults, setNumCriteriaWithUndefinedResults] =
    useState<number>()
  const [selectedKeys, setSelectedKeys] = useState<string[]>()
  const [isFullyDefined, setIsFullyDefined] = useState<boolean>()
  const [criteriaWithResults, setCriteriaWithResults] =
    useState<{ result; criterion }[]>()
  const [filterNodeState, setFilterNodeState] = useState<{ selectedKeys }>({
    selectedKeys: [],
  })
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)

  const updateFilterNodeState = currentSelectedKeys => {
    let newFilterNodeState = { ...(filterNodeState || initialState) }
    for (let currentSelectedKey of currentSelectedKeys) {
      if (!newFilterNodeState.selectedKeys.includes(currentSelectedKey)) {
        newFilterNodeState.selectedKeys =
          newFilterNodeState.selectedKeys.concat([currentSelectedKey])
      }
    }
    setFilterNodeState(newFilterNodeState)
    onStateUpdate({ selectedKeys: newFilterNodeState.selectedKeys })
  }

  useAsync(
    async () => {
      const blockExpressions = await getExpressionsForBlock(blockId)
      const blockCriteria = await getCriteriaForBlock(blockId)
      const criteriaFilters = await Promise.all(blockCriteria.map((c) => {
        return getFilterById(c.fields.filter[0])
      }))


      const initialCriteria: Criteria = blockCriteria.map(
        (criterion: CriterionData) => {

          const criterionId = criterion.id
          const expressionId = criterion.fields.expression[0]
          const filterId = criterion.fields.filter[0]

          const expression = blockExpressions.find((x: Parsed.Expression) => x.fields.id === expressionId)
          const filter: Parsed.Filter = criteriaFilters.find((x: Parsed.Filter) => x.id === filterId)

          const units = expression.fields.units ?? ''
          const operator = {
            id: filter.id,
            text: filter.fields.name
          }

          const filterText = filter.fields.name

          const name = expression.fields.system + ' → ' + (expression.fields.system == 'Calculators' ? expression.fields.component : decapitalize(expression.fields.component))
          const value = criterion.fields.value ?? ''

          const text = `${name} ${filterText} ${value} ${units}`

          const key = hashCode(`${expressionId}-${text}`)

          return { key, expressionId, text, name, operator, value, units }
        }
      )

      setCriteria(initialCriteria)

      return [expressions, initialCriteria]
    },
    ([expressions, initialCriteria]) => {
      const currentCriteriaWithResults = evaluateCriteria(
        initialCriteria,
        patient,
        protocolState,
      )

      setCriteriaWithResults(currentCriteriaWithResults)

      const currentNumCriteriaWithUndefinedResults =
        currentCriteriaWithResults.filter(
          criteriaWithResult => criteriaWithResult.result === undefined,
        ).length
      setNumCriteriaWithUndefinedResults(currentNumCriteriaWithUndefinedResults)

      const currentSelectedKeys = currentCriteriaWithResults
        .filter(
          criteriaWithResult =>
            criteriaWithResult.result === true ||
            (criteriaWithResult.result === undefined &&
              initialState.selectedKeys.includes(
                criteriaWithResult.criterion.key,
              )),
        )
        .map(criteriaWithResult => criteriaWithResult.criterion.key)

      setSelectedKeys(currentSelectedKeys)
      updateIsFullyDefined(currentSelectedKeys)
    },
    [patient, protocolState],
  )

  const updateIsFullyDefined = updatedSelectedKeys => {
    if (!criteriaWithResults) return

    let currentNumCriteriaWithUndefinedResults = criteriaWithResults.filter(
      criterionWithResult => {
        return (
          criterionWithResult.result === undefined &&
          !updatedSelectedKeys.includes(criterionWithResult.criterion.key)
        )
      },
    ).length

    setNumCriteriaWithUndefinedResults(currentNumCriteriaWithUndefinedResults)

    const currentIsFullyDefined: boolean =
      criteriaWithResults.length > 0 &&
      currentNumCriteriaWithUndefinedResults == 0

    setIsFullyDefined(currentIsFullyDefined)
  }

  const evaluateFilterResult = (selectedKeys: string[]) => {
    return criteria.every(
      (criterion: Criterion) =>
        selectedKeys.includes(criterion.key) ||
        protocolState.elicitNodeStates[blockId]?.selectedKeys.includes(
          criterion.key,
        ),
    )
  }

  const renderedCompletionStateBadge = useMemo(() => {
    return <CompletionStateBadge isComplete={isComplete || isFullyDefined} />
  }, [isComplete, isFullyDefined])

  const renderedEvidenceBadge = useMemo(() => {
    if (!blockId) return <></>
    return (
      <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
    )
  }, [isContextualized, blockId])

  const renderedFilters = useMemo(() => {
    if (!criteria || !selectedKeys) return <></>
    if (isContextualized) {
      return (
        <PathwayThemeProvider>
          <Checklist
            data={criteria}
            onSelectedKeysChange={updatedSelectedKeys => {
              setEvaluationResult(evaluateFilterResult(updatedSelectedKeys))
              onEvaluationResultChange(
                evaluateFilterResult(updatedSelectedKeys),
              )
              updateIsFullyDefined(updatedSelectedKeys)
              updateFilterNodeState(updatedSelectedKeys)
            }}
            keyExtractor={item => item.key}
            labelExtractor={item => item.text}
            initialSelectedKeys={selectedKeys}
          />
        </PathwayThemeProvider>
      )
    } else {
      return (
        <UnorderedList>
          {criteria.map(criterion => {
            return (
              <ListItem key={`${blockId}-${criterion.text}`}>
                {criterion.text}
              </ListItem>
            )
          })}
        </UnorderedList>
      )
    }
  }, [selectedKeys, criteria, protocolState])

  return isContextualized
    ? wrapInBox(
      <Box>
        {renderedCompletionStateBadge}
        <Heading size="md">Filter Criteria</Heading>
        <Box mt="16px">{renderedFilters}</Box>
        {renderedEvidenceBadge}
      </Box>,
    )
    : wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm">Assess for the following:</Heading>
        <Box mt="16px">{renderedFilters}</Box>
        <Flex mt="16px">
          <Button
            onClick={() => {
              setEvaluationResult(true)
              onEvaluationResultChange(true)
            }}
            colorScheme={evaluationResult === true ? 'blue' : 'gray'}
          >
            {criteria && criteria.length > 1 ? 'Yes to any' : 'Yes'}
          </Button>
          <Button
            ml="16px"
            onClick={() => {
              setEvaluationResult(false)
              onEvaluationResultChange(false)
            }}
            colorScheme={evaluationResult === false ? 'blue' : 'gray'}
          >
            {criteria && criteria.length > 1 ? 'No to all' : 'No'}
          </Button>
        </Flex>
        {renderedEvidenceBadge}
      </Box>,
    )
}
