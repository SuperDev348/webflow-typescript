import React from 'react'
import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { DeleteIcon, DragHandleIcon } from '@chakra-ui/icons'

import { FilterProps } from '../types'
import { decapitalize } from '../stringHelpers'

type FilterItemProps = {
  type: string
  data: FilterProps
  deleteFilter: Function
  maxWidth?: number
}
const FilterItem = (props: FilterItemProps) => {
  const { data, type, maxWidth } = props

  const deleteFilter = () => {
    props.deleteFilter(data.id, type)
  }

  return (
    <Flex className="filterlist" maxWidth={maxWidth ?? null} justifyContent="space-between">
      <Flex justifyContent="flex-start">
        <Box className="filterlistdesc">
          <Text>{decapitalize(data.data.system)}&nbsp;</Text>
        </Box>
        <Box className="filterlistdesc">
          <Text className="addfilter-static">
            {decapitalize(data.data.variable)}
            &nbsp;
          </Text>
        </Box>
        <Box className="filterlistdesc">
          <Text>
            {decapitalize(data.data.filter)}
            &nbsp;
          </Text>
        </Box>
        <Box className="filterlistdesc">
          <Text>
            {`${decapitalize(data.data.value)} ${data.data.units ? data.data.units : ''
              }`}
          </Text>
        </Box>
      </Flex>
      <Box
        className="filterlistdesc"
        style={{ justifyContent: 'flex-end', marginLeft: '16px' }}
      >
        <IconButton
          aria-label=""
          size="sm"
          icon={<DeleteIcon size="sm" />}
          onClick={deleteFilter}
        ></IconButton>
        <IconButton
          aria-label=""
          size="sm"
          ml="2"
          icon={<DragHandleIcon size="sm" />}
          onClick={deleteFilter}
        ></IconButton>
      </Box>
    </Flex>
  )
}
export default FilterItem
