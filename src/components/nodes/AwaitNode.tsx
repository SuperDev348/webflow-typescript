import React, { useMemo, useState } from 'react'

import {
  Box,
  Heading,
  Flex,
  Select,
  Text,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { CompletionStateBadge } from './CompletionStateBadge'
import { EvidenceBadge } from './EvidenceBadge'
import {
  getTests,
  useAsync,
  wrapError,
  wrapInBox,
  wrapInBoxNonContextualized,
} from './helpers'

import { TestData } from '../../types'

type AwaitNodeStateType = {
  resultedTestIds: string[]
  notResultedTestIds: string[]
  unknownResultedTestIds: string[]
}

type AwaitNodePropsType = {
  isContextualized: boolean
  blockId: string
  testIds: string[]
  isComplete: boolean
  onStateUpdate?: (newState: AwaitNodeStateType) => void
}

export const AwaitNode = (props: AwaitNodePropsType) => {
  const { isContextualized, blockId, testIds, isComplete } = props
  const [nodeState, setNodeState] = useState<AwaitNodeStateType>({
    resultedTestIds: [],
    notResultedTestIds: [],
    unknownResultedTestIds: []
  })

  const [collectedDb, setCollectedDb] = useState<Database>()
  const [tests, setTests] = useState<TestData[] | null>(null)

  useAsync(
    async () => {
      if (!testIds || testIds.length == 0) return null
      const currentTests = await getTests(testIds)
      return currentTests
    },
    currentTests => {
      setTests(currentTests)
    },
  )

  const contextualizedRenderedBlock = useMemo(() => {
    if (tests === null) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Await Results</Heading>
        <Box mt="4">
          <Flex>
            <Text fontWeight="bold">
              Wait for the results of the following tests:
            </Text>
          </Flex>

          <UnorderedList>
            {tests.map(test => {
              return (
                <ListItem key={`${blockId}-${test.id}`}>
                  {test.fields.name}
                </ListItem>
              )
            })}
          </UnorderedList>

          <Box mt="16px" mb="8px">
            <Text fontWeight="bold">
              Remind me if results not back within:&nbsp;
            </Text>
          </Box>

          <Select
            style={{ border: '1px solid gray' }}
            placeholder="Select time delay"
          >
            <option value="option2">2 weeks</option>
            <option value="option3">1 month</option>
            <option value="option4">2 months</option>
            <option value="option5">3 months</option>
            <option value="option6">6 months</option>
            <option value="option7">12 months</option>
          </Select>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [isContextualized, isComplete, blockId, tests])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (tests === null) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm">Await the following test results:</Heading>
        <Box mt="4">
          <UnorderedList>
            {tests.map(test => {
              return (
                <ListItem key={`${blockId}-${test.id}`}>
                  {test.fields.name}
                </ListItem>
              )
            })}
          </UnorderedList>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [isContextualized, isComplete, blockId, tests])

  if (!testIds || testIds.length == 0) {
    return wrapInBox(wrapError('No tests specified.'))
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
