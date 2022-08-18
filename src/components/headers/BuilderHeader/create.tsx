import React, { useState, useEffect } from 'react'
import {
  IconButton,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import Select from 'react-dropdown-select'

import { BundleType } from '../../../types'
import { create as createProtocol } from '../../../api/protocol'
import { useBuilder } from '../../../provider/builder'

type CreateProps = {
  selBundle: BundleType | undefined
}
const Create = (props: CreateProps) => {
  const { selBundle } = props
  const { builderState } = useBuilder()
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()
  const [bundle, setBundle] = useState<BundleType>()
  const [protocolName, setProtocolName] = useState<string>('')

  const handleOpen = () => {
    setBundle(selBundle)
    setProtocolName('')
    onOpen()
  }
  const handleCreate = async () => {
    onClose()
    const _selectedBundle = bundle ?? builderState.bundles[0]
    if (_selectedBundle && protocolName !== '') {
      const res = await createProtocol({
        records: [
          {
            fields: {
              name: protocolName,
              bundles: [_selectedBundle.id],
            },
          },
        ],
      })
      window.location.href = `/builder/${res.records[0].id}/bundles/${_selectedBundle.id}`
    }
  }

  useEffect(() => {
    setBundle(selBundle)
  }, [selBundle])
  return (
    <>
      <IconButton
        aria-label=""
        icon={<AddIcon />}
        onClick={handleOpen}
        ml="1"
      ></IconButton>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt="8">Create a new bundle</ModalHeader>
          <ModalBody pb={8} align="left">
            <Box style={{ margin: '10px 0px' }}>
              <span className="inputlabel bundlewithadd">Pathway: </span>
              {builderState.bundles.length > 0 && (
                <Select
                  className="addbranch"
                  options={builderState.bundles}
                  values={bundle ? [bundle] : [builderState.bundles[0]]}
                  onChange={value => {
                    setBundle(value[0])
                  }}
                  labelField="fields.name"
                  valueField="id"
                />
              )}
            </Box>
            <Box style={{ margin: '10px 0px', display: 'inline-block' }}>
              <span className="inputlabel">Bundle name: </span>
              <input
                type="text"
                className="addprotocol"
                value={protocolName ?? ''}
                style={{ border: 'solid 2px #5b7fe5', borderRadius: 4 }}
                onChange={event => setProtocolName(event.target.value)}
              />
            </Box>
            <Box display="flex" float="right" mt="4">
              <Button colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" ml="4" onClick={handleCreate}>
                Create
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default Create
