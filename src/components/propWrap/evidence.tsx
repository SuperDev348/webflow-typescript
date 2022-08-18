import React, { useState, useEffect } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import { useBuilder } from '../../provider/builder'
import { AirtableRecord } from '../../types'
import { toTitlecase } from '../../service/string'
import siteConfig from '../../config/site.config'
import { apiGetToken } from '../../api/index'

type EvidenceProps = {
  changeBlock: Function
}
const Evidence = (props: EvidenceProps) => {
  const { changeBlock } = props
  const { builderState, dispatch } = useBuilder()
  const [references, setReferences] = useState<AirtableRecord[]>([])
  const [selectedReferences, setSelectedReferences] = useState<AirtableRecord[]>([])
  const [keypoints, setKeypoints] = useState<AirtableRecord[]>([])
  const [selectedKeypoints, setSelectedKeypoints] = useState<AirtableRecord[]>([])
  const [searchFilter, setSearchFilter] = useState('')

  const saveCard = (
    actionReference: AirtableRecord[],
    actionKeypoint: AirtableRecord[],
  ) => {
    let newCards = [...builderState.cards]
    newCards = newCards.map((card) => {
      if (card.id === builderState.propertyData.id) {
        card.selectedReferences = actionReference
        card.selectedKeypoints = actionKeypoint
      }
      return card
    })
    dispatch({ type: 'SET', settingName: 'cards', settingData: newCards })
  }
  const onSearch = ({ props, state }) => {
    const type = props.className.split(' ')[1]
    if (!type) return
    if (searchFilter === state.search)
      return
    state.search = toTitlecase(state.search)
    const formulaText = `?filterByFormula=${encodeURIComponent(
      `FIND('${state.search}',{name})`,
    )}`
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/${type}${formulaText}`
    apiGetToken(url).then((res) => {
      if (type === 'References')
        setReferences(res.records)
      else if (type === 'Keypoints')
        setKeypoints(res.records)
    })
    setSearchFilter(state.search)
    return null
  }
  const handleCancel = () => {
    setSelectedReferences(builderState.propertyData.selectedReferences)
    setSelectedKeypoints(builderState.propertyData.selectedKeypoints)
  }
  const handleSave = () => {
    const selectedBlock = builderState.blocks.find(
      block => block.id === builderState?.propertyData?.savedId,
    )
    if (!selectedBlock)
      return
    selectedBlock.fields.references = selectedReferences.map((item) => item.id)
    selectedBlock.fields.keypoints = selectedKeypoints.map((item) => item.id)
    changeBlock(selectedBlock)
    saveCard(selectedReferences, selectedKeypoints)
  }

  useEffect(() => {
    setReferences(builderState.references)
    setSelectedReferences(builderState.propertyData.selectedReferences)
    setKeypoints(builderState.keypoints)
    setSelectedKeypoints(builderState.propertyData.selectedKeypoints)
  }, [builderState])
  return (
    <>
      {!(
        builderState.propertyData?.name === 'Start' ||
        builderState.propertyData?.name === 'End' ||
        builderState.propertyData?.name === 'Custom' ||
        builderState.propertyData?.name === 'Apply'
      ) && (
          <Box id="evidence" style={{ marginTop: '50px' }}>
            <Text className="header2" style={{ marginBottom: '10px' }}>
              Evidence
            </Text>
            <Box className="evidencelist">
              <Text className="inputlabel">Select a reference: </Text>
              <Select
                className="addbranch References"
                values={selectedReferences}
                options={references}
                multi
                searchable
                searchBy="fields.name"
                searchFn={onSearch}
                loading={references.length > 0 ? false : true}
                onChange={values => {
                  setSelectedReferences(values)
                }}
                labelField="fields.name"
                valueField="id"
              />
              <Text className="inputlabel" style={{ marginTop: '10px' }}>
                Select a keypoint:{' '}
              </Text>
              <Select
                className="addbranch Keypoints"
                values={selectedKeypoints}
                options={keypoints}
                multi
                searchable
                searchBy="fields.name"
                searchFn={onSearch}
                loading={keypoints.length > 0 ? false : true}
                onChange={values => {
                  setSelectedKeypoints(values)
                }}
                labelField="fields.name"
                valueField="id"
              />
              <Box display="flex" float="right" mt="4">
                <Button colorScheme="gray" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  ml="4"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        )}
    </>
  )
}
export default Evidence
