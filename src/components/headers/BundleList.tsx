import React from 'react'
import { IconButton, Box, Flex, Text } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

import { BundleType } from '../../types'

type BundleListProps = {
  data: BundleType
  editBundle: Function
  deleteBundle: Function
}
const BundleList = (props: BundleListProps) => {
  const { data } = props

  const deleteBundle = () => {
    props.deleteBundle(data.id)
  }
  const editBundle = () => {
    props.editBundle(data.id)
  }

  return (
    <Box mt="8px">
      <Flex w="100%">
        <Box>
          <Text>{data.fields.name}</Text>
        </Box>
        <Box ml="auto">
          <IconButton
            size="sm"
            aria-label=""
            padding="1"
            marginRight="2"
            icon={<DeleteIcon />}
            onClick={deleteBundle}
          ></IconButton>
          <IconButton
            size="sm"
            aria-label=""
            padding="1"
            icon={<EditIcon />}
            onClick={editBundle}
          ></IconButton>
        </Box>
      </Flex>
    </Box>
  )
}
export default BundleList
