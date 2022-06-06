import React, { useState } from 'react'
import { Box, Heading, Switch, Text } from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import {
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  getPeriod,
} from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import { PeriodData } from '../../types'

type TriggerRepeatTimerNodePropsType = {
  isContextualized: boolean
  blockId: string
  periodId: string
  isComplete: boolean
}

export const TriggerRepeatTimerNode = (
  props: TriggerRepeatTimerNodePropsType,
) => {
  const { isContextualized, blockId, periodId, isComplete } = props

  const [periodName, setPeriodName] = useState<string | null>(null)

  useAsync(
    async () => {
      if (!periodId) return null
      const currentPeriod = await getPeriod(periodId)
      return currentPeriod
    },
    (currentPeriod: any) => {
      setPeriodName(currentPeriod?.fields.name)
    },
  )

  if (!periodName) {
    return <></>
  }

  return isContextualized
    ? wrapInBox(
        <Box>
          <CompletionStateBadge isComplete={isComplete} />
          <Heading size="md">Repeat Timer</Heading>
          <Box mt="4">
            <Text>Trigger this protocol every {periodName}.</Text>
          </Box>
          <Box mt="4">
            <Switch colorScheme="teal" size="lg" defaultChecked={true} />
          </Box>
          <EvidenceBadge
            isContextualized={isContextualized}
            blockId={blockId}
          />
        </Box>,
      )
    : wrapInBoxNonContextualized(
        <Box>
          <EvidenceBadge
            isContextualized={isContextualized}
            blockId={blockId}
          />
          <Box>
            <Heading mb="4" size="sm">
              Repeating process
            </Heading>
            <Text>Repeat this care process every {periodName}.</Text>
          </Box>
        </Box>,
      )
}
