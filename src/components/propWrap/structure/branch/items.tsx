import React from 'react'
import { Text, Box } from '@chakra-ui/react'

import BranchItem from './branchItem'
import { BranchProps } from '../../../../types'
import { useBuilder } from '../../../../provider/builder'
import { update as updateBlock } from '../../../../api/block'

type BranchItemsProps = {
  branches: BranchProps[]
  saveBranch: Function
}
const Branches = (props: BranchItemsProps) => {
  const {branches, saveBranch} = props
  const {builderState, dispatch} = useBuilder()

  const removeAddedBranch = async (branch: BranchProps) => {
    let addedBranch = branch?.data?.filter.replace('...', '')
    if (branch?.data?.value)
      addedBranch += ' ' + branch?.data?.value
    if (branch?.data?.units)
      addedBranch += ' ' + branch?.data?.units
    const updateBlocks = builderState?.blocks?.filter((block) => block?.fields?.added_branch === addedBranch)
    await Promise.all(updateBlocks.map(async (block) => {
      await updateBlock({
        records: [{
          id: block.id,
          fields: {
            added_branch: 'N'
          }
        }]
      })
    }))
    const tmp = builderState?.blocks?.map((block) => {
      block.fields.added_branch = 'N'
      return block
    })
    dispatch({ type: 'SET', settingName: 'blocks', settingData: tmp })
  }
  const handleDeleteBranch = (id: number) => {
    const selectedBranchs = branches.filter(branch => branch.id === id)
    removeAddedBranch(selectedBranchs[0])
    const newBranches = [...branches]
    const resultBranches = newBranches.filter(branch => branch.id !== id)
    saveBranch(resultBranches)
  }

  return (
    <>
      {branches.length > 0 && (
        <Box mt="4">
          <Text className="inputlabel">Define branches: </Text>
          {branches.map(branch => {
            return (
              <BranchItem
                key={branch.id}
                data={branch}
                deleteBranch={handleDeleteBranch}
              />
            )
          })}
        </Box>
      )}
    </>
  )
}
export default Branches
