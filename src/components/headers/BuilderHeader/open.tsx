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
import Select from 'react-dropdown-select'
import { TriangleDownIcon } from '@chakra-ui/icons'

import { BundleType, ProtocolType } from '../../../types'
import { useBuilder } from '../../../provider/builder'

type OpenProps = {
  selBundle: BundleType | undefined
  selProtocol: ProtocolType | undefined
}
const Open = (props: OpenProps) => {
  const { selBundle, selProtocol } = props
  const { builderState } = useBuilder()
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()
  const [bundle, setBundle] = useState<BundleType>()
  const [selectableProtocols, setSelectableProtocols] = useState<ProtocolType[]>([])
  const [protocol, setProtocol] = useState<ProtocolType>()

  const handleOpen = () => {
    onClose()
    if (protocol) {
      window.location.href = `/builder/${protocol.id}/bundles/${bundle.id}`
    }
  }
  const changeSelectedBundle = (value: BundleType) => {
    setBundle(value)
    setProtocol(null)
    setSelectableProtocols(builderState.protocols.filter(protocol =>
      protocol.fields.bundles?.includes(value.id),
    ))
  }

  useEffect(() => {
    setBundle(selBundle)
    setProtocol(selProtocol)
    setSelectableProtocols(builderState.protocols.filter(protocol =>
      protocol.fields.bundles?.includes(selBundle?.id),
    ))
  }, [builderState.protocols, selProtocol, selBundle])
  return (
    <>
      <IconButton
        aria-label=""
        icon={<TriangleDownIcon />}
        onClick={onOpen}
        ml="1"
      ></IconButton>
      <Modal
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt="8">Open a bundle</ModalHeader>
          <ModalBody pb={8} align="left">
            <Box style={{ margin: '10px 0px' }}>
              <span className="inputlabel">Pathway: </span>
              {builderState.bundles.length > 0 && (
                <Select
                  className="addbranch"
                  options={builderState.bundles}
                  values={bundle ? [bundle] : []}
                  onChange={value => {
                    changeSelectedBundle(value[0])
                  }}
                  labelField="fields.name"
                  valueField="id"
                />
              )}
            </Box>
            <Box style={{ margin: '10px 0px' }}>
              <span className="inputlabel">Bundle: </span>
              {
                <Select
                  className="addbranch"
                  options={selectableProtocols}
                  values={protocol ? [protocol] : []}
                  onChange={value => {
                    setProtocol(value[0])
                  }}
                  labelField="fields.name"
                  valueField="id"
                />
              }
            </Box>
            <Box display="flex" float="right" mt="4">
              <Button colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" ml="4" onClick={handleOpen}>
                Open
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default Open
