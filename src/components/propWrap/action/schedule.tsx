import React, { useState, useEffect } from 'react'
import { Text, Box, Button } from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import { AirtableRecord, QualifierTypes } from '../../../types'
import { toTitlecase } from '../../../service/string'
import siteConfig from '../../../config/site.config'
import { apiGetToken } from '../../../api/index'
import { useBuilder } from '../../../provider/builder'

const Schedule = (props) => {
  const { changeBlock } = props
  const { builderState } = useBuilder()
  const [specialties, setSpecialties] = useState<AirtableRecord[]>([])
  const [selectedSpecialties, setSelectedSpecialties] = useState<AirtableRecord[]>([])
  const [periods, setPeriods] = useState<AirtableRecord[]>([])
  const [selectedPeriods, setSelectedPeriods] = useState<AirtableRecord[]>([])
  const [filter, setFilter] = useState('')

  const handleSave = () => {
    const selectedBlock = builderState.blocks.find(
      block => block.id === builderState?.propertyData?.savedId,
    )
    if (!selectedBlock)
      return
    const selectedDiseaseIds = selectedSpecialties.map((option) => option.id)
    selectedBlock.fields.specialties = selectedDiseaseIds
    const selectedQualifierIds = selectedPeriods.map((option) => option.id)
    selectedBlock.fields.periods = selectedQualifierIds
    changeBlock(selectedBlock)
  }
  const handleCancel = () => {
    setSelectedSpecialties(builderState?.propertyData?.selectedOptions)
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
      if (type === 'Specialties')
        setSpecialties(res.records)
      else if (type === 'Periods')
        setPeriods(res.records)
    })
    setFilter(state.search)
    return null
  }

  useEffect(() => {
    setSelectedSpecialties(builderState?.propertyData?.selectedOptions)
    setSelectedPeriods(builderState?.propertyData?.selectedOptionSecond)
  }, [builderState.propertyData])
  useEffect(() => {
    setSpecialties(builderState.specialties)
  }, [builderState.specialties])
  useEffect(() => {
    setPeriods(builderState.periods)
  }, [builderState.periods])
  return (
    <>
      <Text className="inputlabel" style={{ marginTop: '10px' }}>{builderState?.propertyData?.templateTitle}</Text>
      <Select
        className="addbranch Specialties"
        values={selectedSpecialties}
        options={specialties}
        multi
        searchable
        searchBy="fields.name"
        searchFn={onSearch}
        loading={specialties.length > 0 ? false : true}
        onChange={values => {
          setSelectedSpecialties(values)
        }}
        labelField="fields.name"
        valueField="id"
      />
      <Text className="inputlabel" style={{ marginTop: '10px' }}>
        Select a period:
      </Text>
      <Select
        className="addbranch Periods"
        values={selectedPeriods}
        options={periods}
        searchable
        searchBy="fields.name"
        searchFn={onSearch}
        loading={periods.length > 0 ? false : true}
        onChange={value => {
          setSelectedPeriods(value)
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
export default Schedule