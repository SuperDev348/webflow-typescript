import React, {useState, useEffect} from 'react'
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
import { 
  EditIcon } from '@chakra-ui/icons'
import Select from 'react-dropdown-select'
import { NotificationManager } from 'react-notifications'

import { BundleType, ProtocolType } from '../../../types'
import { create as createProtocol, update as updateProtocol } from '../../../api/protocol'
import { useBuilder } from '../../../provider/builder'

type EditProps = {
  selBundle: BundleType | undefined
  selProtocol: ProtocolType | undefined
}
const Edit = (props: EditProps) => {
  const { selBundle, selProtocol } = props
  const { builderState } = useBuilder()
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()
  const [bundle, setBundle] = useState<BundleType>()
  const [protocolName, setProtocolName] = useState<string>('')

  const create = async (_bundle: BundleType, _protocolName: string) => {
    const res = await createProtocol({
      records: [
        {
          fields: {
            name: _protocolName,
            bundles: [_bundle.id],
          },
        },
      ],
    })
    window.location.href = `/builder/${res.records[0].id}/bundles/${_bundle.id}`
  }
  const update = async (_bundle: BundleType, _protocol: ProtocolType) => {
    const res = await updateProtocol({
      records: [
        {
          id: _protocol.id,
          fields: {
            bundles: [..._protocol.fields.bundles, _bundle.id],
          },
        },
      ],
    })
    window.location.href = `/builder/${res.records[0].id}/bundles/${_bundle.id}`
  }
  const handleOpen = () => {
    setProtocolName(selProtocol?.fields.name)
    setBundle(selBundle)
    onOpen()
  }
  const handleSave = () => {
    if (protocolName === '') {
      NotificationManager.warning("Warning", "Please enter the new protocol name", 3000)
      return
    }
    if (protocolName === selProtocol?.fields.name ) {
      if (selBundle.fields.protocols?.includes(selProtocol.id))
        return
      else {
        update(selBundle, selProtocol)
      }
    } else {
      for (let i = 0; i < builderState.protocols.length; i++) {
        if (protocolName === builderState.protocols[i].fields.name ) {
          if (selBundle.fields.protocols?.includes(builderState.protocols[i].id)) {
            break
          } else {
            update(selBundle, builderState.protocols[i])
            break
          }
        } else if (i === builderState.protocols.length - 1) {
          create(selBundle, protocolName)
        }
      }
    }
  }

  useEffect(() => {
    setBundle(selBundle)
    setProtocolName(selProtocol?.fields.name)
  }, [selProtocol, selBundle])
  return (
    <>
      <IconButton
        aria-label=""
        icon={<EditIcon />}
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
          <ModalHeader mt="8">Edit current protocol</ModalHeader>
          <ModalBody pb={8} align="left">
            <Box style={{ margin: '10px 0px' }}>
              <span className="inputlabel">Bundle: </span>
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
            <Box style={{ margin: '10px 0px' }}>
              <span className="inputlabel">Protocol: </span>
              <input
                type="text"
                value={protocolName ?? ''}
                className="addprotocol"
                onChange={event => setProtocolName(event.target.value)}
              />
            </Box>
            <Box display="flex" float="right" mt="4">
              <Button colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" ml="4" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default Edit
