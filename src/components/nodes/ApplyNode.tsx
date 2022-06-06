import React, { useMemo, useState, ChangeEvent } from 'react'

import { Box, Checkbox, Heading } from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { CompletionStateBadge } from './CompletionStateBadge'
import { EvidenceBadge } from './EvidenceBadge'
import { wrapError, wrapInBox, wrapInBoxNonContextualized } from './helpers'

type ApplyNodeStateType = {
  isChecked: boolean
}

type ApplyNodePropsType = {
  isContextualized: boolean
  blockId: string
  keypointId: string
  isComplete: boolean
  onStateUpdate: (newState: ApplyNodeStateType) => void
}

export const ApplyNode = (props: ApplyNodePropsType) => {
  const { blockId, isContextualized, isComplete, keypointId, onStateUpdate } =
    props
  const [nodeState, setNodeState] = useState<ApplyNodeStateType>({
    isChecked: false,
  })

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked: boolean = event.target.checked
    const newState: ApplyNodeStateType = { isChecked }
    setNodeState(newState)
    onStateUpdate(newState)
  }

  const contextualizedRenderedBlock = useMemo(() => {
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete || nodeState.isChecked} />
        <Heading size="md" mb="32px">
          Apply Recommendation
        </Heading>
        <Checkbox
          colorScheme="gray"
          borderColor="gray"
          size="lg"
          onChange={onCheckboxChange}
        >
          <EvidenceBadge
            isContextualized={isContextualized}
            isNaked={true}
            blockId={blockId}
          />
        </Checkbox>
      </Box>,
    )
  }, [isContextualized, blockId, isComplete, nodeState])

  const nonContextualizedRenderedBlock = useMemo(() => {
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="sm" mb="16px">
          Apply the following recommendation:
        </Heading>
        <Box>
          <EvidenceBadge
            isContextualized={isContextualized}
            isNaked={true}
            blockId={blockId}
          />
        </Box>
      </Box>,
    )
  }, [isContextualized, blockId, isComplete, nodeState])

  if (!keypointId) {
    return wrapInBox(wrapError('No recommendation selected.'))
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
