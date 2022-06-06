import React, { useMemo, useState } from 'react'
import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import {
  Checklist,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import {
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  wrapError,
  getTests,
} from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import { TestData } from '../../types'

type OrderNodeProps = {
  isContextualized: boolean
  blockId: string
  testIds: string[]
  selectOne: boolean
  isComplete: boolean
}

export const OrderNode = (props: OrderNodeProps) => {
  const { isContextualized, blockId, testIds, selectOne, isComplete } = props
  const [tests, setTests] = useState<TestData[] | null>(null)

  useAsync(
    async () => {
      if (!testIds) return null
      const currentTests = await getTests(testIds)
      return currentTests
    },
    (currentTests: TestData[] | null) => {
      setTests(currentTests)
    },
  )

  const contextualizedRenderedBlock = useMemo(() => {
    if (tests === null) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Order Tests</Heading>
        <Box mt="4">
          {tests.length > 0 ? (
            <PathwayThemeProvider>
              <Checklist
                data={tests}
                onSelectedKeysChange={selectedKeys => {}}
                keyExtractor={(item: TestData) => item.id}
                labelExtractor={(item: TestData) => item.fields.name}
              />
            </PathwayThemeProvider>
          ) : (
            wrapError('No tests selected.')
          )}
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, tests])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (tests === null) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
        <Heading size="sm">Order the following tests:</Heading>
        <Box mt="4">
          {tests.length > 0 ? (
            <UnorderedList>
              {tests.map(test => {
                return (
                  <ListItem key={`${blockId}-${test.id}`}>
                    {test.fields.name}
                  </ListItem>
                )
              })}
            </UnorderedList>
          ) : (
            wrapError('No tests selected.')
          )}
        </Box>
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, tests])

  if (testIds.length == 0) {
    return wrapInBox(wrapError('No tests selected.'))
  } else if (tests == null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
