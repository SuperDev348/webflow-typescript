import React, { useState, useMemo, Suspense } from 'react'
import { Box, Heading, IconButton, Flex } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import sha1 from 'sha1'

import {
  Badge,
  Reference,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import { InfoOutlineIcon } from '@chakra-ui/icons'

// import { Grading } from '@pathwaymd/pathway-ui2/src/components/Recommendations/Components/Grading'
import { Recommendation } from '@pathwaymd/pathway-ui2/src/components/TopicGroups/Components/Recommendation'
import { useDb } from '@pathwaymd/pathway-ui2/src/components/DbProvider/DbProvider'

import { useAsync, getBlock } from './helpers'
import { EvidenceReviewDrawer } from './EvidenceReviewDrawer'
import { ReferenceDrawer } from './ReferenceDrawer'
import { get as getResource } from '../../api/resource'

type EvidenceBadgePropsType = {
  blockId: string
  isContextualized: boolean
  isNaked?: boolean
}

export const EvidenceBadge = (props: EvidenceBadgePropsType) => {
  const { blockId, isContextualized, isNaked } = props

  // To be selected in UI
  const recommendationIndex = 0

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [evidenceType, setEvidenceType] = useState<string | null>(null)
  const [recommendation, setRecommendation] =
    useState<Parsed.Recommendation | null>(null)
  const [reference, setReference] = useState<Parsed.Reference | null>(null)

  useAsync(
    async () => {
      const block = await getBlock(blockId)

      if (!block) {
        throw new Error(`Could not get block ${blockId}.`)
      }
      const keypointId: string = (block.fields.keypoints_mke || [''])[0]
      const referenceId: string = (block.fields.references_mke || [''])[0]
      const currentEvidenceType: string = keypointId
        ? 'recommendation'
        : referenceId
          ? 'reference'
          : null

      if (currentEvidenceType == 'recommendation') {
        const currentCollectedDb = await getResource(
          'evidence',
          'pid' + sha1(`${keypointId}-true-${recommendationIndex}`).slice(0, 14),
        )
        const currentKeypoint = currentCollectedDb.keypoints.find(
          keypoint => keypoint.id == keypointId,
        )
        if (!currentKeypoint) {
          throw new Error('Collected DB does not include requested keypoint.')
        }

        const currentRecommendation = currentCollectedDb.recommendations[0]

        return [
          currentEvidenceType,
          currentCollectedDb,
          currentRecommendation,
          null,
        ]
      } else if (currentEvidenceType == 'reference') {
        const currentCollectedDb = await getResource(
          'reference',
          referenceId,
        )
        const currentReference = currentCollectedDb.references.find(
          reference => reference.id == referenceId,
        )
        return [currentEvidenceType, currentCollectedDb, null, currentReference]
      } else {
        return [null, null, null, null]
      }
    },

    ([
      currentEvidenceType,
      currentCollectedDb,
      currentRecommendation,
      currentReference,
    ]) => {
      setEvidenceType(currentEvidenceType)
      setCollectedDb(currentCollectedDb)
      setRecommendation(currentRecommendation)
      setReference(currentReference)
    },
  )

  const renderedEvidenceDrawer = useMemo(() => {
    if (evidenceType == 'recommendation' && !recommendation) return <></>
    if (evidenceType == 'reference' && !reference) return <></>
    if (evidenceType == 'recommendation') {
      return (
        <Box zIndex={1900}>
          <EvidenceReviewDrawer
            recommendationId={recommendation.id}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </Box>
      )
    }
    if (evidenceType == 'reference') {
      return (
        <Box zIndex={1900}>
          <ReferenceDrawer
            referenceId={reference.id}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </Box>
      )
    }
  }, [evidenceType, collectedDb, isDrawerOpen])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (evidenceType == 'recommendation' && !recommendation) return <></>
    if (evidenceType == 'reference' && !reference) return <></>

    return (
      <PathwayThemeProvider>
        <DbProvider db={collectedDb}>
          <Suspense fallback={null}>
            {evidenceType == 'recommendation' && (
              <>
                <Box position="relative" float="right" mt="-50px">
                  <IconButton
                    aria-label=""
                    colorScheme={'gray'}
                    icon={<InfoOutlineIcon />}
                    onClick={() => {
                      setIsDrawerOpen(true)
                    }}
                  ></IconButton>
                </Box>
                <Box mt="4px" ml="8px" mr="8px">
                  <Recommendation
                    recommendation={recommendation}
                    prependText={''}
                    prependTopicPrependText={false}
                    indentation={0}
                    prependTopicTitle={false}
                    topicTitle={''}
                  />
                </Box></>
            )}
            {evidenceType == 'reference' && (
              <Box position="relative" float="right" mt="-4px">
                <IconButton
                  aria-label=""
                  colorScheme={'gray'}
                  icon={<InfoOutlineIcon />}
                  onClick={() => {
                    setIsDrawerOpen(true)
                  }}
                ></IconButton>
              </Box>
            )}
            {renderedEvidenceDrawer}
          </Suspense>
        </DbProvider>
      </PathwayThemeProvider>
    )
  }, [
    isContextualized,
    reference,
    evidenceType,
    recommendation,
    collectedDb,
    renderedEvidenceDrawer,
  ])

  const _contextualizedRenderedBlock = useMemo(() => {
    if (!collectedDb) return <></>
    if (evidenceType == 'recommendation' && !recommendation) return <></>
    if (evidenceType == 'reference' && !reference) return <></>
    return (
      <PathwayThemeProvider>
        <DbProvider db={collectedDb}>
          <Suspense fallback={null}>
            {evidenceType == 'recommendation' && (
              <Box mt="4px" ml="8px" mr="8px">
                <Recommendation
                  recommendation={recommendation}
                  prependText={''}
                  prependTopicPrependText={false}
                  indentation={0}
                  prependTopicTitle={false}
                  topicTitle={''}
                />
              </Box>
            )}
            {evidenceType == 'reference' && (
              <Box>
                <Reference
                  id={reference.id}
                  short={!isContextualized}
                  onOpenUrlRequest={(url: string) =>
                    (window.location.href = url)
                  }
                />
              </Box>
            )}
          </Suspense>
        </DbProvider>
      </PathwayThemeProvider>
    )
  }, [isContextualized, reference, evidenceType, recommendation, collectedDb])

  const contextualizedRenderedBlock = useMemo(() => {
    if (
      evidenceType !== 'recommendation' ||
      recommendation === null ||
      collectedDb === null
    ) {
      return <></>
    }
    return (
      <Box>
        {isNaked ? (
          _contextualizedRenderedBlock
        ) : (
          <Box mt="32px" mb="-32px">
            <Box border="1px solid lightgray" p="16px" borderRadius="6px">
              <Heading size="sm" mb="16px">
                Supporting Evidence
              </Heading>
              {_contextualizedRenderedBlock}
            </Box>
          </Box>
        )}
        {renderedEvidenceDrawer}
      </Box>
    )
  }, [
    reference,
    recommendation,
    evidenceType,
    collectedDb,
    renderedEvidenceDrawer,
  ])

  if (collectedDb === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
