import React, {useEffect, useState} from 'react'
import { 
  Box, 
  Button,
  Flex,
  Heading,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure 
} from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import {PatientType} from '../../../types'
import Protocol from '../../Protocol'
import { getAll as getPatients } from '../../../api/patient'
import { formatAirtableResult } from '../../../service/common'

const Preview = (props) => {
  const { selProtocol } = props
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()
  const [patient, setPatient] = useState<PatientType>(null)
  const [isContextualized, setIsContextualized] = useState<boolean>(true)
  const PatientContext = React.createContext<PatientType | null>(null)
  const [patients, setPatients] = useState<PatientType[]>([])

  const changeSelectedPatient = (patientId: string) => {
    const patient = patients.find(x => x.id == patientId)
    setPatient(patient ?? null)
  }

  useEffect(() => {
    getPatients().then((res) => {
      let tmp = res.records
      tmp = tmp.map((p: PatientType) =>
        formatAirtableResult({ data: p }))
      setPatients(tmp)
    })
  }, [])
  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Preview
      </Button>
      <Modal
        size="xl"
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <ModalHeader mt="8" align="center">
            Protocol Preview
          </ModalHeader>
          <ModalBody pb={8} align="center">
            <Flex>
              {patients.length > 0 && (
                <Box w="50%" mx="auto">
                  <Heading size="sm" mt="8px" mb="8px">
                    Select a patient context:
                  </Heading>
                  <Select<PatientType>
                    options={patients}
                    values={[]}
                    onChange={value => {
                      changeSelectedPatient(value[0].id)
                    }}
                    labelField="lastName"
                    valueField="id"
                    style={{ width: '200px' }}
                  />
                </Box>
              )}
              <Box w="50%" mx="auto">
                <Heading size="sm" mt="8px" mb="8px">
                  Toggle protocol type
                </Heading>
                <Switch
                  size="lg"
                  onChange={() => {
                    setIsContextualized(!isContextualized)
                  }}
                />
              </Box>
            </Flex>
            <PatientContext.Provider value={patient}>
              {selProtocol && (
                <Protocol
                  protocolId={selProtocol.id}
                  isContextualized={isContextualized}
                  unfoldPaths={!isContextualized}
                  patientContext={PatientContext}
                />
              )}
            </PatientContext.Provider>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default Preview
