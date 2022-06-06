import React, { useState, useEffect } from 'react'
import { 
  Text, 
  Box, 
  Button, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure 
} from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import { AirtableRecord } from '../../../types'
import { toTitlecase } from '../../../service/string'
import siteConfig from '../../../config/site.config'
import { apiGetToken } from '../../../api/index'
import { useBuilder } from '../../../provider/builder'

const Apply = (props) => {
  const { changeBlock } = props
  const { builderState } = useBuilder()
  const [options, setOptions] = useState<AirtableRecord[]>([])
  const [selectedOptions, setSelectedOptions] = useState<AirtableRecord[]>([])
  const [filter, setFilter] = useState('')
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()

  const handleSave = () => {
    const selectedBlock = builderState.blocks.find(
      block => block.id === builderState?.propertyData?.savedId,
    )
    if (!selectedBlock)
      return
    const selectedOptionIds = selectedOptions.map((option) => option.id)
    selectedBlock.fields.diseases = selectedOptionIds
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
    const url = `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Diseases${formulaText}`
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
    setOptions(builderState.diseases)
  }, [builderState.diseases])
  return (
    <>
      <Text className="inputlabel" style={{ marginTop: '10px' }}>Select a disease:</Text>
      <Select
        className="addbranch Diseases"
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
      <Box mt="4">
        <Button
          style={{ width: '100%' }}
          colorScheme="blue"
          onClick={onOpen}
        >
          <Text ml="4">Pick recommendation</Text>
        </Button>
      </Box>
      <Box display="flex" float="right" mt="4">
        <Button colorScheme="gray" onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button colorScheme="blue" ml="4" onClick={() => handleSave()}>
          Save
        </Button>
      </Box>
      <Modal
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt="8">Select a recommendation</ModalHeader>
          <ModalBody pb={8} align="left">
            
            <Box display="flex" float="right" mt="4">
              <Button colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" ml="4" onClick={onClose}>
                Save
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default Apply