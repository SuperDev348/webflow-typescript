import React, { useMemo, useState } from 'react'
import { Box, Heading, Textarea } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { wrapInBox, wrapInBoxNonContextualized } from './helpers'
import { CompletionStateBadge } from './CompletionStateBadge'

type NoteNodePropsType = {
  isContextualized: boolean
  blockId: string
  title: string
  placeholder: string
  isComplete: boolean
}

export const NoteNode = (props: NoteNodePropsType) => {
  const { isContextualized, blockId, title, placeholder, isComplete } = props

  const contextualizedRenderedBlock = useMemo(() => {
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">{title}</Heading>
        <Box mt="4">
          <Textarea
            style={{ border: '1px solid gray' }}
            placeholder={placeholder}
          ></Textarea>
        </Box>
      </Box>,
    )
  }, [isComplete])

  const nonContextualizedRenderedBlock = useMemo(() => {
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm">{title}</Heading>
        <Box mt="4">
          <Textarea
            style={{ border: '1px solid gray' }}
            placeholder={placeholder}
          ></Textarea>
        </Box>
      </Box>,
    )
  }, [isComplete, title, placeholder])

  return isContextualized
    ? contextualizedRenderedBlock
    : nonContextualizedRenderedBlock
}
