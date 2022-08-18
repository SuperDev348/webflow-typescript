import React, { useState, useEffect, Suspense } from 'react'
import { Text, Box, Button, Heading } from '@chakra-ui/react'
import Select from 'react-dropdown-select'
import { Database } from '@pathwaymd/pathway-parser'
import {
  DbProvider,
  PathwayThemeProvider,
  Calculator,
} from '@pathwaymd/pathway-ui2'

import { AirtableRecord } from '../../../types'
import { toTitlecase } from '../../../service/string'
import siteConfig from '../../../config/site.config'
import { apiGetToken } from '../../../api/index'
import { get as getResource } from '../../../api/resource'
import { useBuilder } from '../../../provider/builder'

const Use = (props) => {
  const { changeBlock } = props
  const { builderState } = useBuilder()
  const [options, setOptions] = useState<AirtableRecord[]>([])
  const [selectedOptions, setSelectedOptions] = useState<AirtableRecord[]>([])
  const [filter, setFilter] = useState('')
  const [db, setDb] = useState<Database>(null)

  const handleSave = () => {
    const selectedBlock = builderState.blocks.find(
      block => block.id === builderState?.propertyData?.savedId,
    )
    if (!selectedBlock)
      return
    const selectedOptionIds = selectedOptions.map((option) => option.id)
    selectedBlock.fields.calculators = selectedOptionIds
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
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Calculators${formulaText}`
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
    setOptions(builderState.calculators)
  }, [builderState.calculators])
  useEffect(() => {
    (async () => {
      if (selectedOptions.length !== 0) {
        const calculatorRes = await getResource('calculator', selectedOptions[0].fields.calculator_id)
        setDb(calculatorRes)
      }
    })()
  }, [selectedOptions])
  return (
    <>
      <Text className="inputlabel" style={{ marginTop: '10px' }}>{builderState?.propertyData?.templateTitle}</Text>
      <Select
        className="addbranch Calculators"
        values={selectedOptions}
        options={options}
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
      <Box mt="24">
        <Heading as="h2" size="md">
          Preview
        </Heading>
        <Box mt="4" className="previewwrapper">
          <PathwayThemeProvider>
            {db && selectedOptions.length !== 0 && (
              <DbProvider db={db}>
                <Suspense fallback={null}>
                  <Calculator
                    calculatorId={
                      selectedOptions[0].fields.calculator_id
                    }
                    compactDisplay={true}
                    onStateChange={() => { }}
                  />
                </Suspense>
              </DbProvider>
            )}
          </PathwayThemeProvider>
        </Box>
      </Box>
    </>
  )
}
export default Use