import React, { useMemo, useState, Suspense } from 'react'
import { Box, Heading } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'

import {
  Pathway,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import {
  useAsync,
  wrapError,
  wrapInBox,
  wrapInBoxNonContextualized,
} from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import { get as getResource } from '../../api/resource'

type LinkNodePropsType = {
  blockId: string
  isContextualized: boolean
  isComplete: boolean
  protocolId: string
}

export const LinkNode = (props: LinkNodePropsType) => {
  const { isContextualized, blockId, protocolId, isComplete } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [protocolName, setProtocolName] = useState<string | null>(null)

  useAsync(
    async () => {
      if (!protocolId) return [null, null]
      const currentCollectedDb = await getResource('pathway', protocolId)
      const currentProtocol = currentCollectedDb.pathways.find(
        protocol => protocol.id == protocolId,
      )
      const currentProtocolName = currentProtocol.name
      return [currentCollectedDb, currentProtocolName]
    },
    ([currentCollectedDb, currentProtocolName]) => {
      setCollectedDb(currentCollectedDb)
      setProtocolName(currentProtocolName)
    },
  )

  const renderedProtocolComponent = useMemo(() => {
    return (
      <Box mt="4">
        <PathwayThemeProvider>
          <DbProvider db={collectedDb}>
            <Suspense fallback={null}>
              {/* <Pathway pathwayId={protocolId} /> */}
            </Suspense>
          </DbProvider>
        </PathwayThemeProvider>
      </Box>
    )
  }, [collectedDb, protocolId])

  const contextualizedRenderedBlock = useMemo(() => {
    if (!protocolName || !collectedDb) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">{protocolName}</Heading>
        {renderedProtocolComponent}
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    protocolId,
    protocolName,
    collectedDb,
  ])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (!protocolName || !collectedDb) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="md">{protocolName}</Heading>
        {renderedProtocolComponent}
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    protocolId,
    protocolName,
    collectedDb,
  ])

  if (!protocolId) {
    return wrapInBox(wrapError('No protocol specified.'))
  } else if (collectedDb === null || protocolName === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
