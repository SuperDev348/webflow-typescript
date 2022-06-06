import React, { useState, useEffect } from 'react'
import { Text, Box, Button } from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import { AirtableRecord } from '../../../types'
import { toTitlecase } from '../../../service/string'
import siteConfig from '../../../config/site.config'
import { apiGetToken } from '../../../api/index'
import { useBuilder } from '../../../provider/builder'

const RepeatTimer = (props) => {
  const { changeBlock } = props
  const { builderState } = useBuilder()
  const [options, setOptions] = useState<AirtableRecord[]>([])
  const [selectedOptions, setSelectedOptions] = useState<AirtableRecord[]>([])
  const [filter, setFilter] = useState('')

  const handleSave = () => {
    const selectedBlock = builderState.blocks.find(
      block => block.id === builderState?.propertyData?.savedId,
    )
    if (!selectedBlock)
      return
    const selectedOptionIds = selectedOptions.map((option) => option.id)
    selectedBlock.fields.periods = selectedOptionIds
    changeBlock(selectedBlock)
  }
  const handleCancel = () => {
    setSelectedOptions(builderState?.propertyData?.selectedOptions)
  }
  const onSearch = ({ state }) => {
    if (filter === state.search)
      return
    state.search = toTitlecase(state.search)
    const formulaText = `?filterByFormula=${encodeURIComponent(
      `FIND('${state.search}',{name})`,
    )}`
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Periods${formulaText}`
    apiGetToken(url).then((res) => {
      setOptions(res.records)
    })
    setFilter(state.search)
    return null
  }

  useEffect(() => {
    setSelectedOptions(builderState?.propertyData?.selectedOptions)
  }, [builderState.propertyData])
  useEffect(() => {
    setOptions(builderState.periods)
  }, [builderState.periods])
  return (
    <>
      <Text className="inputlabel" style={{ marginTop: '10px' }}>{builderState?.propertyData?.templateTitle}</Text>
      <Select
        className="addbranch Periods"
        values={selectedOptions}
        options={options}
        multi
        searchable
        searchBy="fields.name"
        searchFn={onSearch}
        loading={options.length > 0 ? false : true}
        onChange={values => {
          setSelectedOptions(values)
        }}
        labelField="fields.name"
        valueField="id"
      />
      <Box display="flex" float="right" mt="4">
        <Button colorScheme="gray" onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button colorScheme="blue" ml="4" onClick={() => handleSave()}>
          Save
        </Button>
      </Box>
    </>
  )
}
export default RepeatTimer