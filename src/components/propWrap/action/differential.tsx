import React, { useState, useEffect, Suspense } from 'react'
import { Text, Box, Button, Heading } from '@chakra-ui/react'
import Select from 'react-dropdown-select'
import { Database } from '@pathwaymd/pathway-parser'
import {
  DbProvider,
  PathwayThemeProvider,
  DifferentialDiagnosis,
} from '@pathwaymd/pathway-ui2'

import { AirtableRecord } from '../../../types'
import { toTitlecase } from '../../../service/string'
import siteConfig from '../../../config/site.config'
import { apiGetToken } from '../../../api/index'
import { get as getResource } from '../../../api/resource'
import { useBuilder } from '../../../provider/builder'

const Differential = (props) => {
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
    selectedBlock.fields.presentations = selectedOptionIds
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
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Presentations${formulaText}`
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
    setOptions(builderState.presentations)
  }, [builderState.presentations])
  useEffect(() => {
    (async () => {
      if (selectedOptions.length !== 0) {
        const res = await getResource('differentialDiagnosis', selectedOptions[0].fields.presentation_id)
        setDb(res)
      }
    })()
  }, [selectedOptions])
  return (
    <>
      <Text className="inputlabel" style={{ marginTop: '10px' }}>{builderState?.propertyData?.templateTitle}</Text>
      <Select
        className="addbranch Presentations"
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
      <Box mt="24">
        <Heading as="h2" size="md">
          Preview
        </Heading>
        <Box className="previewwrapper" mt="4">
          <PathwayThemeProvider>
            {db && (
              <DbProvider db={db}>
                <Suspense fallback={null}>
                  {db.presentations && db.presentations[0] &&
                    <DifferentialDiagnosis
                      presentationId={db.presentations[0].id}
                    />
                  }
                </Suspense>
              </DbProvider>
            )}
          </PathwayThemeProvider>
        </Box>
      </Box>
    </>
  )
}
export default Differential