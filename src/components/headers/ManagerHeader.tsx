import React, { useState } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import {
  useDisclosure,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react'

import { SearchIcon, TriangleDownIcon, ViewIcon, SunIcon, StarIcon } from '@chakra-ui/icons'
import Header from './Header'
import { PatientType, UserType } from '../../types'

type ManagerHeaderPropsType = {
  patient: PatientType
  user: UserType
}
function ManagerHeader(props: ManagerHeaderPropsType) {
  const { patient, user } = props
  const [newSelectedPatientId, setNewSelectedPatientId] = useState<string>()
  const headerHeight = '43px'
  const {
    isOpen: isSelectPatientOpen,
    onOpen: onSelectPatientOpen,
    onClose: onSelectPatientClose,
  } = useDisclosure()

  const {
    isOpen: isUserOptionsOpen,
    onOpen: onUserOptionsOpen,
    onClose: onUserOptionsClose,
  } = useDisclosure()

  const handleChangeSelectNewPatientId = (event: any) => {
    setNewSelectedPatientId(event.target.value)
  }
  const onSelectPatientSubmit = () => {
    onSelectPatientClose()
    setTimeout(() => window.location.reload(), 500)
  }

  const onViewAnalytics = () => {
    onUserOptionsClose()
    setTimeout(() => window.location.reload(), 500)
  }

  const onViewUserStats = () => {
    onUserOptionsClose()
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <>
      {!(patient && user) ? (
        <Header title="Care Manager" />
      ) : (
        <Header
          title="Care Manager"
          left={
            <Flex>
              <Box mr="16px">
                <Heading as="h3" size="sm">
                  {patient.lastName
                    ? `${patient.lastName}, ${patient.firstName}`
                    : ''}
                </Heading>
                <Text>{patient.id}</Text>
              </Box>
              <Link onClick={onSelectPatientOpen}>
                <IconButton
                  aria-label=""
                  icon={<TriangleDownIcon />}
                ></IconButton>
              </Link>
            </Flex>
          }
          right={
            <Flex>
              <Text lineHeight={headerHeight} noOfLines={1}>
                User: {user.name}, {user.title} ({user.licenseNumber})
              </Text>
              <Link ml="8" onClick={onUserOptionsOpen}>
                <IconButton
                  aria-label=""
                  icon={<ViewIcon />}
                ></IconButton>
              </Link>
            </Flex>
          }
        />
      )}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isUserOptionsOpen}
        onClose={onUserOptionsClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt="8" alignSelf="center">
            Analytics and reports
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8} align="center">
            <Box>
              <RouteLink to={`/stats`}>
                <Button
                  colorScheme="blue"
                  mt={4}
                  w={300}
                  leftIcon={<StarIcon />}
                  onClick={onViewUserStats}
                >
                  My statistics report
                </Button>
              </RouteLink>
            </Box>
            <Box>
              <RouteLink to={`/analytics`}>
                <Button
                  colorScheme="blue"
                  mt={4}
                  w={300}
                  leftIcon={<SunIcon />}
                  onClick={onViewAnalytics}
                >
                  Organization dashboard
                </Button>
              </RouteLink>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSelectPatientOpen}
        onClose={onSelectPatientClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt="8">Enter a patient identifier: </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8} align="center">
            <Box>
              <Input
                value={newSelectedPatientId}
                onChange={handleChangeSelectNewPatientId}
              />
              <RouteLink to={`/patients/${newSelectedPatientId}`}>
                <Button
                  colorScheme="blue"
                  mt={4}
                  w={200}
                  leftIcon={<SearchIcon />}
                  onClick={onSelectPatientSubmit}
                >
                  Lookup patient
                </Button>
              </RouteLink>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default ManagerHeader
