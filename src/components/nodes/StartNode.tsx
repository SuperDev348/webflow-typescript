import React, { useMemo } from 'react'

import { Box, Heading, Text } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { wrapInBox, wrapInBoxNonContextualized } from './helpers'
import { CompletionStateBadge } from './CompletionStateBadge'

type StartNodePropsType = {
  isContextualized: boolean
  blockId: string
  isComplete: boolean
}

export const StartNode = (props: StartNodePropsType) => {
  const { isContextualized, blockId, isComplete } = props

  const contextualizedRenderedBlock = useMemo(() => {
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Starting Point</Heading>
        <Box mt="4">
          <Text>This care process begins here.</Text>
        </Box>
      </Box>,
    )
  }, [isComplete])

  const nonContextualizedRenderedBlock = useMemo(() => {
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm">Starting point</Heading>
        <Box mt="4">
          <Text>This care process begins here.</Text>
        </Box>
      </Box>,
    )
  }, [isComplete])

  return isContextualized
    ? contextualizedRenderedBlock
    : nonContextualizedRenderedBlock
}
