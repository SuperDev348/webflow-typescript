import React from 'react'
import { Heading } from '@chakra-ui/react'

import BundleList from '../../BundleList'
import { getAll as getBundles, remove as removeBundle } from '../../../../api/bundle'
import { useBuilder } from '../../../../provider/builder'

const Items = (props) => {
  const { bundleEdit } = props
  const {builderState, dispatch} = useBuilder()

  const handleEdit = (id) => {
    bundleEdit(id)
  }
  const handleDelete = async (id) => {
    await removeBundle(id)
    const res = await getBundles()
    dispatch({ type: 'SET', settingName: 'bundles', settingData: res.records })
  }
  return (
    <>
      <Heading size="md" mb="24px">
        List of bundles
      </Heading>
      {builderState.bundles.map(bundle => (
        <BundleList
          key={bundle.id}
          data={bundle}
          editBundle={handleEdit}
          deleteBundle={handleDelete}
        />
      ))}
    </>
  )
}
export default Items
