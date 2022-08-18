import React, { useState, useRef } from 'react'
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react'

import BundleItems from './items'
import Create, { CreateFunctionInterface } from './create'
import Edit, { EditFunctionInterface } from './edit'

type BundleProps = {
  saveExpressions: Function
}
const Bundle = (props: BundleProps) => {
  const { saveExpressions } = props
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()
  const createRef = useRef<CreateFunctionInterface>()
  const editRef = useRef<EditFunctionInterface>()
  const [isCreate, setIsCreate] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selBundleId, setSelBundleId] = useState<string>('')

  const showInit = () => {
    setIsEdit(false)
  }
  const handleEdit = (id) => {
    setIsCreate(false)
    setIsEdit(true)
    setSelBundleId(id)
  }
  const handleOpen = () => {
    setSelBundleId('')
    setIsCreate(false)
    setIsEdit(false)
    onOpen()
  }
  const handleCancel = () => {
    setSelBundleId('')
    setIsCreate(false)
    setIsEdit(false)
    onClose()
  }
  const handleSave = () => {
    if (isEdit) {
      editRef.current.save()
    }
    else if (isCreate) {
      createRef.current.save()
    }
    onClose()
  }

  return (
    <>
      <Button p="16px" ml="16px" onClick={handleOpen}>
        <Text>Edit pathways</Text>
      </Button>
      <Modal
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="64px" align="left">
            <Box>
              <BundleItems bundleEdit={handleEdit} />
              <Box mt="4">
                {isEdit &&
                  <Edit ref={editRef} bundleId={selBundleId} saveExpressions={saveExpressions} />
                }
                <Create ref={createRef} isShow={isCreate} setIsShow={setIsCreate} showInit={showInit} saveExpressions={saveExpressions} />
              </Box>
            </Box>
            <Box
              h="1px"
              w="100%"
              borderBottom="1px solid lightgray"
              mt="40px"
            ></Box>
            <Box display="flex" float="right" mt="16px" mb="0">
              <Button colorScheme="gray" onClick={handleCancel}>
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
export default Bundle
