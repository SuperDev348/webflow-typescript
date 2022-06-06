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

import {
  getSpecialty,
  useAsync,
  wrapError,
  wrapInBox,
  wrapInBoxNonContextualized,
} from './helpers'

import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'

type ScheduleNodePropsType = {
  isContextualized: boolean
  blockId: string
  specialtyId: string
  isComplete: boolean
}

export const ScheduleNode = (props: ScheduleNodePropsType) => {
  const { isContextualized, blockId, specialtyId, isComplete } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [specialty, setSpecialty] = useState<Parsed.Specialty | null>(null)

  useAsync(
    async () => {
      if (!specialtyId) return null
      const currentSpecialty = await getSpecialty(specialtyId)
      if (!currentSpecialty) {
        throw new Error(`Could not find specialty ID ${specialtyId}.`)
      }
      return currentSpecialty
    },
    currentSpecialty => {
      setSpecialty(currentSpecialty)
    },
  )

  const contextualizedRenderedBlock = useMemo(() => {
    if (specialty === null) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Schedule Visit</Heading>
        <Box mt="4">
          <Flex>
            <Text fontWeight="bold">Clinic:&nbsp;</Text>
            <Text>{specialty.fields.name}</Text>
          </Flex>

          <Box mt="16px" mb="8px">
            <Text fontWeight="bold">Time frame:&nbsp;</Text>
          </Box>

          <Select
            style={{ border: '1px solid gray' }}
            placeholder="Select time delay"
          >
            <option value="option1">Urgent - As soon as possible</option>
            <option value="option2">Within 2 weeks</option>
            <option value="option3">Within 1 month</option>
            <option value="option4">Within 2 months</option>
            <option value="option5">Within 3 months</option>
            <option value="option6">Within 6 months</option>
            <option value="option7">Within 12 months</option>
          </Select>
        </Box>

        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, specialty])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (specialty === null) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <Box>
          <Heading size="sm">Schedule follow-up with:</Heading>
          <UnorderedList mt="4">
            <ListItem>{specialty.fields.name}</ListItem>
          </UnorderedList>

          <Box mt="16px" mb="8px">
            <Heading size="sm">Within:</Heading>
          </Box>

          <UnorderedList mt="4">
            <ListItem>2 months</ListItem>
          </UnorderedList>
        </Box>

        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, specialty])

  if (!specialtyId) {
    return wrapInBox(wrapError('No specialty specified.'))
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
