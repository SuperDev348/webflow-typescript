import React, { useState, useEffect } from 'react'
import { Text, Box, Button } from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import { AirtableRecord, QualifierTypes } from '../../../types'
import { toTitlecase } from '../../../service/string'
import siteConfig from '../../../config/site.config'
import { apiGetToken } from '../../../api/index'
import { useBuilder } from '../../../provider/builder'

const Record = (props) => {
  const { changeBlock } = props
  const { builderState } = useBuilder()
  const [diseases, setDiseases] = useState<AirtableRecord[]>([])
  const [selectedDiseases, setSelectedDiseases] = useState<AirtableRecord[]>([])
  const [qualifiers, setQualifiers] = useState<QualifierTypes[]>([])
  const [selectedQualifiers, setSelectedQualifiers] = useState<QualifierTypes[]>([])
  const [filter, setFilter] = useState('')

  const handleSave = () => {
    const selectedBlock = builderState.blocks.find(
      block => block.id === builderState?.propertyData?.savedId,
    )
    if (!selectedBlock)
      return
    const selectedDiseaseIds = selectedDiseases.map((option) => option.id)
    selectedBlock.fields.diseases = selectedDiseaseIds
    const selectedQualifierIds = selectedQualifiers.map((option) => option.id)
    selectedBlock.fields.qualifiers = selectedQualifierIds
    changeBlock(selectedBlock)
  }
  const handleCancel = () => {
    setSelectedDiseases(builderState?.propertyData?.selectedOptions)
  }
  const onSearch = ({ props, state }) => {
    const type = props.className.split(' ')[1]
    if (filter === state.search)
      return
    state.search = toTitlecase(state.search)
    const formulaText = `?filterByFormula=${encodeURIComponent(
      `FIND('${state.search}',{name})`,
    )}`
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/${type}${formulaText}`
    apiGetToken(url).then((res) => {
      if (type === 'Diseases')
        setDiseases(res.records)
      else if (type === 'Qualifiers')
        setQualifiers(res.records)
    })
    setFilter(state.search)
    return null
  }

  useEffect(() => {
    setSelectedDiseases(builderState?.propertyData?.selectedOptions)
    setSelectedQualifiers(builderState?.propertyData?.selectedQualifiers)
  }, [builderState.propertyData])
  useEffect(() => {
    setDiseases(builderState.diseases)
  }, [builderState.diseases])
  useEffect(() => {
    setQualifiers(builderState.qualifiers)
  }, [builderState.qualifiers])
  return (
    <>
      <Text className="inputlabel" style={{ marginTop: '10px' }}>{builderState?.propertyData?.templateTitle}</Text>
      <Select
        className="addbranch Diseases"
        values={selectedDiseases}
        options={diseases}
        multi
        searchable
        searchBy="fields.name"
        searchFn={onSearch}
        loading={diseases.length > 0 ? false : true}
        onChange={values => {
          setSelectedDiseases(values)
        }}
        labelField="fields.name"
        valueField="id"
      />
      <Text className="inputlabel" style={{ marginTop: '10px' }}>
        Select one or more qualifiers:
      </Text>
      <Select
        className="addbranch Qualifiers"
        values={selectedQualifiers}
        options={qualifiers}
        multi
        searchable
        searchBy="fields.name"
        searchFn={onSearch}
        loading={qualifiers.length > 0 ? false : true}
        onChange={value => {
          setSelectedQualifiers(value)
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
export default Record