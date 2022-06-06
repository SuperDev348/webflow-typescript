import React from 'react'

import { Box, IconButton } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

type CompletionStateBadgePropsType = {
  isComplete: boolean
}

export const CompletionStateBadge = (props: CompletionStateBadgePropsType) => {
  const { isComplete } = props

  return (
    <Box ml="100%" mt="-40px">
      <IconButton
        aria-label=""
        colorScheme={isComplete ? 'green' : 'gray'}
        icon={<CheckCircleIcon />}
      ></IconButton>
    </Box>
  )
}
