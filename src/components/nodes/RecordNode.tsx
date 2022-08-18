import React, { useMemo, useState, Suspense } from 'react'
import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'

import {
  DbProvider,
  PathwayThemeProvider,
  ClinicalImpression,
  ButtonStates,
} from '@pathwaymd/pathway-ui2'

import {
  useAsync,
  wrapInBox,
  wrapError,
  wrapInBoxNonContextualized,
} from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import { get as getResource } from '../../api/resource'

type RecordNodeStateType = {
  diseaseId: string
  impression?: string
}

type RecordNodePropsType = {
  isContextualized: boolean
  blockId: string
  diseaseId: string
  isComplete: boolean
  onStateUpdate: (newNodeState: RecordNodeStateType) => void
}

export const RecordNode = (props: RecordNodePropsType) => {
  const { blockId, isContextualized, isComplete, diseaseId, onStateUpdate } =
    props
  const [nodeState, setNodeState] = useState<RecordNodeStateType>({
    diseaseId,
    impression: undefined,
  })
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [disease, setDisease] = useState<Parsed.Disease | null>(null)
  const [asyncError, setAsyncError] = useState<Error | null>(null)

  useAsync(
    async () => {
      if (!diseaseId) {
        setAsyncError(new Error('No disease selected.'))
        return [null, null]
      }
      const currentCollectedDb = await getResource(
        'clinicalImpression',
        diseaseId,
      )
      if (currentCollectedDb.diseases.includes(null)) {
        setAsyncError(new Error('Disease not found.'))
        return [null, null]
      }
      const currentDisease = currentCollectedDb.diseases.find(
        disease => disease.id == diseaseId,
      )
      return [currentCollectedDb, currentDisease]
    },
    ([currentCollectedDb, currentDisease]) => {
      setCollectedDb(currentCollectedDb)
      setDisease(currentDisease)
    },
  )

  const probabilityTextValues = [
    'confirmed',
    'possible',
    'unlikely',
    'ruled out',
  ]

  const contextualizedRenderedBlock = useMemo(() => {
    if (!disease || !collectedDb) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Record Diagnosis</Heading>
        <Box mt="4">
          <PathwayThemeProvider>
            <DbProvider db={collectedDb}>
              <Suspense fallback={null}>
                <ClinicalImpression
                  diseaseId={disease.id}
                  initialState={{}}
                  onButtonStatesChange={(state: ButtonStates) => {
                    const newState = {
                      diseaseId,
                      impression: probabilityTextValues[0],
                    }
                    setNodeState(newState)
                    onStateUpdate(newState)
                  }}
                />
              </Suspense>
            </DbProvider>
          </PathwayThemeProvider>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, diseaseId, disease, collectedDb])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (!disease || !collectedDb) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm">Consider the following diagnosis:</Heading>
        <UnorderedList mt="4">
          <ListItem>{disease.name}</ListItem>
        </UnorderedList>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, diseaseId, disease, collectedDb])

  if (asyncError) {
    return wrapInBox(wrapError(asyncError.message))
  } else if (disease === null || collectedDb === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
