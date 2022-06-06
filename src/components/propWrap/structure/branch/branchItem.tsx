import React, { DragEvent } from 'react'
import { Box, IconButton } from '@chakra-ui/react'

import { ReactComponent as DeleteIcon } from '../../../../icons/delete_icon.svg'
import { ReactComponent as DragIcon } from '../../../../icons/drag_icon.svg'
import { BranchProps } from '../../../../types'

type BranchItemProps = {
  data: BranchProps
  deleteBranch: Function
}
const BranchItem = (props: BranchItemProps) => {
  const { data, deleteBranch } = props

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('activeBranch', JSON.stringify(data))
  }
  const handleDeleteBranch = () => {
    deleteBranch(data.id)
  }

  return (
    <Box className="branches" draggable={true} onDragStart={handleDragStart}>
      <IconButton
        aria-label=""
        icon={<DragIcon width="24px" height="24px" />}
      ></IconButton>
      <IconButton
        aria-label=""
        style={{ marginRight: '5px', height: 'auto' }}
        icon={<DeleteIcon width="24px" height="24px" />}
        onClick={handleDeleteBranch}
      ></IconButton>
      <span className="branchname">Branch {data.id} : </span>
      <span className="branchoperator">{data.data.filter}</span>
      <span className="branchvalue">{`${
        data.data.value ? data.data.value : ''
      } ${data.data.units ? data.data.units : ''}`}</span>
    </Box>
  )
}
export default BranchItem
