import React from 'react'

import { Box, Heading, Text } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { wrapInBox, wrapInBoxNonContextualized } from './helpers'
import { CompletionStateBadge } from './CompletionStateBadge'

type EndNodePropsType = {
  isContextualized: boolean
  blockId: string
  isComplete: boolean
}

export const EndNode = (props: EndNodePropsType) => {
  const { isContextualized, blockId, isComplete } = props

  return isContextualized
    ? wrapInBox(
        <Box>
          <CompletionStateBadge isComplete={true} />
          <Heading size="md">End Point</Heading>
          <Box mt="4">
            <Text>This care process ends here.</Text>
          </Box>
        </Box>,
      )
    : wrapInBoxNonContextualized(
        <Box>
          <Heading size="sm">End of protocol</Heading>
          <Box mt="4">
            <Text>Continue management and follow-up as appropriate.</Text>
          </Box>
        </Box>,
      )
}
