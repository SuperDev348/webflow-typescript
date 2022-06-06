import React, { useMemo, useState, Suspense } from 'react'

import { Box, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import {
  DifferentialDiagnosis,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import {
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  wrapError,
} from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import { groupBy, sortBy } from 'lodash'
import { get as getResource } from '../../api/resource'

type DifferentialNodePropsType = {
  isContextualized: boolean
  blockId: string
  presentationId: string
  isComplete: boolean
}

export const DifferentialNode = (props: DifferentialNodePropsType) => {
  const { isContextualized, blockId, presentationId, isComplete } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [presentation, setPresentation] = useState<Parsed.Presentation | null>(
    null,
  )
  const [finding, setFinding] = useState<Parsed.Finding | null>(null)
  const [diseases, setDiseases] = useState<Parsed.Disease | null>(null)
  const [diseaseCategoryNames, setDiseaseCategoryNames] = useState<{
    [diseaseId: string]: string
  } | null>(null)
  //const [isMonographDrawerOpen, setIsMonographDrawerOpen] =
  //  useState<boolean>(false)

  const defaultDiseaseCategoryName: string = 'Other diseases'

  useAsync(
    async () => {
      if (!presentationId) return [null, null]

      const currentCollectedDb: Database = await getResource(
        'differentialDiagnosis',
        presentationId,
      )

      const currentPresentation: Parsed.Presentation =
        currentCollectedDb.presentations.find(
          presentation => presentation.id == presentationId,
        )
      if (!currentPresentation) {
        throw new Error(
          'Collected database does not contain selected presentation.',
        )
      }

      const currentFinding: Parsed.Finding = currentCollectedDb.findings.find(
        finding => finding.id == currentPresentation.findingId,
      )

      if (!currentFinding) {
        throw new Error('Collected database does not contain selected finding.')
      }

      const currentDiseases: Parsed.Disease[] = currentCollectedDb.diseases
      currentCollectedDb.diseases.filter(disease =>
        disease.presentationIds.includes(presentationId),
      )

      if (currentDiseases.length === 0) {
        throw new Error(
          'Collected database does not contain selected diseases.',
        )
      }

      const currentDiseaseCategoryNames = currentDiseases.reduce(
        (a, currentDisease) => {
          const categoryId: string =
            currentDisease.categoryId ?? defaultDiseaseCategoryName
          const category: Parsed.Category = currentCollectedDb.categories.find(
            category => category.id === currentDisease.categoryId,
          )
          const categoryName: string = category
            ? category.name
            : defaultDiseaseCategoryName
          return { ...a, [categoryId]: categoryName }
        },
        {},
      )
      return [
        currentCollectedDb,
        currentPresentation,
        currentFinding,
        currentDiseases,
        currentDiseaseCategoryNames,
      ]
    },
    ([
      currentCollectedDb,
      currentPresentation,
      currentFinding,
      currentDiseases,
      currentDiseaseCategoryNames,
    ]) => {
      setCollectedDb(currentCollectedDb)
      setPresentation(currentPresentation)
      setFinding(currentFinding)
      setDiseases(currentDiseases)
      setDiseaseCategoryNames(currentDiseaseCategoryNames)
    },
  )

  const contextualizedRenderedBlock = useMemo(() => {
    if (collectedDb === null || presentation === null) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Differential Diagnosis</Heading>
        <Box mt="4">
          <PathwayThemeProvider>
            <DbProvider db={collectedDb}>
              <Suspense fallback={null}>
                {<DifferentialDiagnosis presentationId={presentation.id} />}
              </Suspense>
            </DbProvider>
          </PathwayThemeProvider>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, collectedDb, presentation])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (
      collectedDb === null ||
      presentation === null ||
      finding === null ||
      diseases === null ||
      diseaseCategoryNames === null
    )
      return <></>

    const groupedDiseases = groupBy(
      diseases,
      disease => disease.categoryId ?? defaultDiseaseCategoryName,
    )

    return wrapInBoxNonContextualized(
      <Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
        <Heading size="sm">
          Consider the following causes of {finding.entity.name}:
        </Heading>
        <Box mt="6">
          <PathwayThemeProvider>
            <DbProvider db={collectedDb}>
              <Suspense fallback={null}>
                {sortBy(
                  Object.keys(groupedDiseases),
                  categoryId => diseaseCategoryNames[categoryId],
                ).map(categoryId => {
                  return (
                    <Box key={categoryId} mb="4">
                      <Text fontWeight="bold">
                        {diseaseCategoryNames[categoryId]}
                      </Text>
                      <UnorderedList mt="16px">
                        {sortBy(
                          groupedDiseases[categoryId],
                          disease => disease.name,
                        ).map(disease => {
                          return (
                            <ListItem key={disease.id}>{disease.name}</ListItem>
                          )
                        })}
                      </UnorderedList>
                    </Box>
                  )
                })}
              </Suspense>
            </DbProvider>
          </PathwayThemeProvider>
        </Box>
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    collectedDb,
    presentation,
    diseases,
    diseaseCategoryNames,
  ])

  if (!presentationId) {
    return wrapInBox(wrapError('No presentation selected.'))
  } else if (collectedDb === null || presentation === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
