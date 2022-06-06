import React, { useMemo, useState } from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { wrapError, wrapInBox, wrapInBoxNonContextualized } from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'

type CustomNodePropsType = {
  isContextualized: boolean
  blockId: string
  title: string
  text: string
  isComplete: boolean
}

export const CustomNode = (props: CustomNodePropsType) => {
  const { isContextualized, blockId, title, text, isComplete } = props

  const contextualizedRenderedBlock = useMemo(() => {
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">{title}</Heading>
        <Box mt="4">
          <Text>{text}</Text>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, title, text])

  const nonContextualizedRenderedBlock = useMemo(() => {
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm">{title}</Heading>
        <Box mt="4">
          <Text>{text}</Text>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, title, text])

  if (!title || !text) {
    return wrapInBox(wrapError('No title or no text specified.'))
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
