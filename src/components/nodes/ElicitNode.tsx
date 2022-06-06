import React, { useState, useMemo, Suspense } from 'react'
import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'

import {
  Elicit,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import {
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  wrapError,
} from './helpers'
import { get as getResource } from '../../api/resource'

import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'

type ElicitNodePropsType = {
  isContextualized: boolean
  blockId: string
  findingIds: string[]
  isComplete: boolean
  onStateUpdate: ({
    positiveFindingIds,
    negativeFindingIds,
    untouchedFindingIds,
  }) => void
}

export const ElicitNode = (props: ElicitNodePropsType) => {
  const { isContextualized, blockId, findingIds, isComplete, onStateUpdate } =
    props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [nodeState, setNodeState] = useState<{
    positiveFindingIds
    negativeFindingIds
    untouchedFindingIds
  }>({
    positiveFindingIds: new Set(),
    negativeFindingIds: new Set(),
    untouchedFindingIds: new Set(),
  })

  useAsync(
    async () => {
      if (findingIds.length == 0) {
        return null
      } else {
        const collectedDb = await getResource(
          'elicit',
          findingIds.join(','),
        )
        return collectedDb
      }
    },
    (collectedDb: Database | null) => {
      setCollectedDb(collectedDb)
    },
  )

  const renderedContextualizedElicit = useMemo(() => {
    if (!collectedDb || !findingIds) return <></>
    return (
      <PathwayThemeProvider>
        <DbProvider db={collectedDb}>
          <Suspense fallback={null}>
            <Elicit
              findingIds={findingIds}
              onButtonStateChange={event => {
                let newNodeState = { ...nodeState }
                for (const sectionId in event) {
                  for (const findingId of findingIds) {
                    const findingName = collectedDb.findings.find(
                      f => f.id == findingId,
                    ).name
                    switch (event[sectionId][findingId]) {
                      case 1: // name for now, id later
                        newNodeState.positiveFindingIds.add(findingName)
                        newNodeState.negativeFindingIds.delete(findingName)
                        newNodeState.untouchedFindingIds.delete(findingName)
                        break
                      case 2:
                        newNodeState.positiveFindingIds.delete(findingName)
                        newNodeState.negativeFindingIds.add(findingName)
                        newNodeState.untouchedFindingIds.delete(findingName)
                        break
                      default:
                        newNodeState.positiveFindingIds.delete(findingName)
                        newNodeState.negativeFindingIds.delete(findingName)
                        newNodeState.untouchedFindingIds.add(findingName)
                    }
                  }
                }
                setNodeState(newNodeState)
                onStateUpdate(newNodeState)
              }}
            />
          </Suspense>
        </DbProvider>
      </PathwayThemeProvider>
    )
  }, [collectedDb, findingIds])

  const renderedNonContextualizedElicit = useMemo(() => {
    if (!collectedDb || !findingIds) return <></>
    return (
      <UnorderedList mt="16px">
        {collectedDb.findings.map(finding => {
          return (
            <ListItem key={`${blockId}-${finding.id}`}>{finding.name}</ListItem>
          )
        })}
      </UnorderedList>
    )
  }, [collectedDb, findingIds])

  const contextualizedRenderedBlock = useMemo(() => {
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Elicit Findings</Heading>
        <Box mt="4">{renderedContextualizedElicit}</Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, findingIds, collectedDb])

  const nonContextualizedRenderedBlock = useMemo(() => {
    return wrapInBoxNonContextualized(
      <Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
        <Heading size="sm">Elicit the following:</Heading>
        {renderedNonContextualizedElicit}
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, findingIds, collectedDb])

  if (findingIds.length == 0) {
    return wrapInBox(wrapError('No findings selected.'))
  } else if (collectedDb === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
