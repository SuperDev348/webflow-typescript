import React, { useMemo } from 'react'

import { Box, Heading, Switch, Text } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { wrapInBox, wrapInBoxNonContextualized } from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'

type TriggerNewActionNodePropsType = {
  isContextualized: boolean
  blockId: string
  isComplete: boolean
}

export const TriggerNewActionNode = (
  props: TriggerNewActionNodePropsType,
) => {
  const { isContextualized, blockId, isComplete } = props

  const contextualizedRenderedBlock = useMemo(() => {
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">New Action</Heading>
        <Box mt="4">
          <Text>
            Trigger this care process every time the following action occurs.
          </Text>
        </Box>
        <Box mt="4">
          <Switch colorScheme="teal" size="lg" defaultChecked={true} />
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete])

  const nonContextualizedRenderedBlock = useMemo(() => {
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm">When this action is performed:</Heading>
        <Box mt="4">
          <Text>Trigger this care process.</Text>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete])

  return isContextualized
    ? contextualizedRenderedBlock
    : nonContextualizedRenderedBlock
}
