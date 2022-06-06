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
  Radiolist,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import { AIRTABLE_CARE_MANAGER_BASE_URL } from '../../Globals'
import { decapitalize } from '../../stringHelpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import {
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  hashCode,
  getExpression,
  getBranches,
  capitalize,
  evaluateCriteria,
  generateCriterionText,
} from './helpers'
import {
  PatientType,
  Criteria,
  Criterion,
  CriterionDetail,
  ExpressionData,
  CriterionData,
} from '../../types'
import { apiGetToken } from '../../api/index'

type BranchNodePropsType = {
  isContextualized: boolean
  blockId: string
  expressionId: string
  isComplete: boolean
  patientContext?: React.Context<PatientType>
  protocolState: any
  onEvaluationResultChange: (result: any) => void
}

export const BranchNode = (props: BranchNodePropsType) => {
  const {
    blockId,
    isContextualized,
    isComplete,
    expressionId,
    patientContext,
    protocolState,
    onEvaluationResultChange,
  } = props

  const patient = useContext(patientContext)
  const [collectedDb, setCollectedDb] = useState<Database>()
  const [expression, setExpression] = useState<ExpressionData>()
  const [criteria, setCriteria] = useState<Criteria>()
  const [evaluationResult, setEvaluationResult] = useState<any>()
  const [selectedKey, setSelectedKey] = useState<string>()

  const getCriterion = async (criterionId) => {
    const res = await apiGetToken(
        encodeURI(
          `${AIRTABLE_CARE_MANAGER_BASE_URL}/Criteria?filterByFormula=SEARCH("${criterionId}",{criterion_id})`,
        )
      )
    return res.data?.records[0]
  }

  const getFilter = async (filterId) => {
    const res = await apiGetToken(
        encodeURI(
          `${AIRTABLE_CARE_MANAGER_BASE_URL}/Filters?filterByFormula=SEARCH("${filterId}",{local_id})`,
        )
      )
    return res.data?.records[0]
  }
  useAsync(
    async () => {
      const currentExpression: ExpressionData = await getExpression(
        expressionId,
      )
      const currentBranches: CriterionData = await getBranches(blockId)
      return [currentExpression, currentBranches]
    },
    async ([currentExpression, currentBranches]) => {
      setExpression(currentExpression)
      const currentBranchCriteria: Criteria = await Promise.all(currentBranches.map(
        async (branchCriterionId: CriterionData) => {
          const expressionId = currentExpression.id
          const expression = await getExpression(expressionId)
          const criterion = await getCriterion(branchCriterionId)
          const filter = await getFilter(criterion.fields.filter[0])
          //const filter = await getFilter()
          console.log(expression, criterion, filter)
          const name = expression.fields.component
          const value = criterion.fields.value
          const units = expression.fields.units
          const filterId = filter.id
          const filterSymbol = filter.fields.symbol
          const filterName = filter.fields.name
          const operator = {
            id: filterId, symbol: filterSymbol, name: filterName
          }
          const text = generateCriterionText(
            { name, operator, value, units },
            'branch',
            isContextualized,
          )
          const key = hashCode(`${expressionId}-${text}`)
          return { key, name, operator, value, units, expressionId, text }
        },
      ))
      const initialSelected = evaluateCriteria(
        currentBranchCriteria,
        patient,
        protocolState,
      )
      const trueResult = initialSelected.filter(
        evaluatedCriterion => evaluatedCriterion.result == true,
      )
      if (trueResult.length > 0) {
        if (trueResult.length == 1) {
          setSelectedKey(trueResult[0].criterion.key)
        } else {
          throw new Error('Criteria are not mutually exclusive.')
        }
      }
      setCriteria(currentBranchCriteria)
    },
  )
  const evaluateCriterion = (selectedKey: string) => {
    if (!criteria) return { index: 0, text: '' }
    const selectedCriterionIndex: number = criteria.findIndex(
      (criterion: Criterion) => criterion.key == selectedKey,
    )
    const selectedCriterion = criteria[selectedCriterionIndex]
    return {
      index: selectedCriterionIndex,
      text: selectedCriterion.text,
    }
  }
  const component = expression?.fields.component ?? ''
  const isPlural = component[component.length - 1] === 's'
  const question = `What ${isPlural ? 'are' : 'is'} the patient's ${decapitalize(expression?.fields.component)}?`
  const renderedBranch = useMemo(() => {
    if (!criteria || !expression) return <></>
    return isContextualized ? (
      <Box>
        <Heading
          size="sm"
          mt="4"
        >{question}</Heading>
        <Box mt="4">
          <PathwayThemeProvider>
            <Radiolist
              data={criteria}
              onSelectedKeyChange={(selectedKeys: string[]) => {
                if (selectedKeys.length == 0) return
                const evaluatedResult = evaluateCriterion(selectedKeys[0])
                setEvaluationResult(evaluatedResult)
                onEvaluationResultChange(evaluatedResult)
              }}
              keyExtractor={item => item.key}
              labelExtractor={item => capitalize(item.text)}
              initialSelectedKey={selectedKey ? [selectedKey] : []}
            />
          </PathwayThemeProvider>
        </Box>
      </Box>
    ) : (
      <Box>
        <Heading size="sm">{question}</Heading>
        <Box mt="4">
          <PathwayThemeProvider>
            <Radiolist
              data={criteria}
              onSelectedKeyChange={(selectedKeys: string[]) => {
                if (selectedKeys.length == 0) return
                const evaluatedResult = evaluateCriterion(selectedKeys[0])
                setEvaluationResult(evaluatedResult)
                onEvaluationResultChange(evaluatedResult)
              }}
              keyExtractor={item => item.key}
              labelExtractor={item => capitalize(item.text)}
            />
          </PathwayThemeProvider>
        </Box>
      </Box>
    )
  }, [expression, isComplete, criteria])

  return !expression ? (
    <></>
  ) : isContextualized ? (
    wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Decision Point</Heading>
        {renderedBranch}
      </Box>,
    )
  ) : (
    wrapInBoxNonContextualized(<Box>{renderedBranch}</Box>)
  )
}
