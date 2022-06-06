import React, { useState, useEffect } from 'react'
import { Text, Textarea, Box, Button } from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import { AirtableRecord } from '../../../types'
import { toTitlecase } from '../../../service/string'
import siteConfig from '../../../config/site.config'
import { apiGetToken } from '../../../api/index'
import { useBuilder } from '../../../provider/builder'

const Custom = (props) => {
  const { changeBlock } = props
  const { builderState } = useBuilder()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
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
    selectedBlock.fields.references = selectedOptionIds
    selectedBlock.fields.custom = JSON.stringify({
      title: title,
      text: text,
    })
    changeBlock(selectedBlock)
  }
  const handleCancel = () => {
    setTitle(builderState?.propertyData?.selectedTitle)
    setText(builderState?.propertyData?.selectedText)
    setSelectedOptions(builderState?.propertyData?.selectedOptions)
  }
  const onSearch = ({ state }) => {
    if (filter === state.search)
      return
    state.search = toTitlecase(state.search)
    const formulaText = `?filterByFormula=${encodeURIComponent(
      `FIND('${state.search}',{name})`,
    )}`
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/References${formulaText}`
    apiGetToken(url).then((res) => {
      setOptions(res.records)
    })
    setFilter(state.search)
    return null
  }

  useEffect(() => {
    setTitle(builderState?.propertyData?.selectedTitle)
    setText(builderState?.propertyData?.selectedText)
    setSelectedOptions(builderState?.propertyData?.selectedOptions)
  }, [builderState.propertyData])
  useEffect(() => {
    setOptions(builderState.references)
  }, [builderState.references])
  return (
    <>
      <Text className="inputlabel">Title: </Text>
      <Textarea
        className="inputcomponent"
        aria-label="minimum height"
        minrows={3}
        placeholder="Write custom text here..."
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
      <Text className="inputlabel">Text: </Text>
      <Textarea
        className="inputcomponent"
        aria-label="minimum height"
        minrows={3}
        placeholder="Write custom text here..."
        value={text}
        onChange={event => setText(event.target.value)}
      />
      <Text className="inputlabel" style={{ marginTop: '10px' }}>{builderState?.propertyData?.templateTitle}</Text>
      <Select
        className="addbranch References"
        values={selectedOptions}
        options={options}
        searchable
        searchBy="fields.name"
        searchFn={onSearch}
        loading={options.length > 0 ? false : true}
        onChange={(values) => {
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
export default Custom