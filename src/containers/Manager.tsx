import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Heading,
  Button,
  Box,
  Text,
  Grid,
  VStack,
  Link,
  Input,
  Image,
  Textarea,
} from '@chakra-ui/react'
import { compact } from 'lodash'
import { ThemeProvider, CSSReset, theme } from '@chakra-ui/react'
import { useParams, Link as RouteLink } from 'react-router-dom'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react'
import {
  RepeatClockIcon,
  EditIcon,
  LinkIcon,
  SearchIcon,
  TriangleDownIcon,
  PlusSquareIcon,
  RepeatIcon
} from '@chakra-ui/icons'

import { PatientType, UserType, NoteType, BundleHistoryType, BundleType, CriteriaTypes } from '../types'
import BareLayout from '../components/layout/BareLayout'
import ManagerHeader from '../components/headers/ManagerHeader'
import { customTheme } from '../theme'
import { formatAirtableResults, formatAirtableResult } from '../service/common'
import { get as getPatient } from '../api/patient'
import { get as getUser } from '../api/user'
import { getAll as getBundles } from '../api/bundle'
import { getFilter as getHistory, create as createHistory } from '../api/history'
import { getFilter as getCriterias } from '../api/criteria'
import { getFilter as getExpression } from '../api/expression'
import { getFilter } from '../api/filter'
import { getFilter as getNote } from '../api/note'

const PageContext = React.createContext({})
Date.prototype.toISOString = function () {
  var tzo = -this.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
    };
  return this.getFullYear() +
    '-' + pad(this.getMonth() + 1) +
    '-' + pad(this.getDate()) +
    'T' + pad(this.getHours()) +
    ':' + pad(this.getMinutes()) +
    ':' + pad(this.getSeconds()) +
    dif + pad(tzo / 60) +
    ':' + pad(tzo % 60);
}

export default function Manager({ patientId }: { patientId?: string }) {
  const userId = 'recaV7dSybHG1netm' // will come from session eventually
  const params = useParams()
  if (params.patientId) patientId = params.patientId

  const [selectedPatientId, setSelectedPatientId] = useState(patientId)
  const [patient, setPatient] = useState<PatientType>(null)
  const [user, setUser] = useState<UserType>(null)
  const [notes, setNotes] = useState<NoteType[]>([])
  const [bundles, setBundles] = useState<BundleType[]>([])
  const [bundleHistory, setBundleHistory] = useState<BundleHistoryType[]>([])

  const initPatient = (patientId: string) => {
    getPatient(patientId)
      .then((res: any) => {
        setPatient(formatAirtableResult(res))
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const initUser = (userId: string) => {
    getUser(userId)
      .then((res) => {
        setUser(formatAirtableResult(res))
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const initNotes = (patientId: string) => {
    getNote({ filterByFormula: `SEARCH("${patientId}",{patient})` })
      .then((res) => {
        setNotes(formatAirtableResults(res))
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const initBundles = () => {
    getBundles()
      .then((res) => {
        setBundles(res.records)
      })
      .catch((res) => {
        console.log(res)
      })
  }
  const initBundleHistory = (patientId: string) => {
    getHistory({ filterByFormula: `SEARCH("${patientId}",{patient})` })
      .then((res) => {
        setBundleHistory(formatAirtableResults(res))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (!selectedPatientId) {
      throw new Error('No patient selected.')
    }
    initPatient(selectedPatientId)
    initUser(userId)
    initNotes(selectedPatientId)
    initBundles()
    initBundleHistory(selectedPatientId)
  }, [selectedPatientId, userId])

  const [autosaved, setAutosaved] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const pageContextValue = useMemo(() => {
    return {
      user,
      patient,
      notes,
      bundleHistory,
    }
  }, [user, patient, notes, bundleHistory])

  const {
    isOpen: isBundleActionsOpen,
    onOpen: onBundleActionsOpen,
    onClose: onBundleActionsClose,
  } = useDisclosure()

  const {
    isOpen: isEditPatientOpen,
    onOpen: onEditPatientOpen,
    onClose: onEditPatientClose,
  } = useDisclosure()

  const {
    isOpen: isAddNoteOpen,
    onOpen: onAddNoteOpen,
    onClose: onAddNoteClose,
  } = useDisclosure()

  const [clickedBundleId, setClickedBundleId] = useState<string>()
  const [selectNewPatientId, setSelectNewPatientId] = useState<string>('')
  const [bundleEligibility, setBundleEligibility] = useState<{}>()

  const statusGroups = [
    { name: 'eligible', title: 'Eligible bundles', color: '#d9e7fd' },
    { name: 'inProgress', title: 'In progress', color: '#ffe6cd' },
    { name: 'completed', title: 'Completed', color: '#d4e7d7' },
    { name: 'ineligible', title: 'Ineligible bundles', color: '#f5f5f5' },
  ]

  function calcAge(dateString) {
    var birthday = +new Date(dateString)
    return ~~((Date.now() - birthday) / (31557600000))
  }

  const expressionValueAccessors = {
    'LOINC/Patient/Age': () => calcAge(patient.dateOfBirth),
    'LOINC/Patient/Sex': () => patient.sex
  }

  const onRefreshBundles = useCallback(async () => {
    let eligibleBundles = []
    let ineligibleBundles = []
    for (const bundle of bundles) {
      const { filters_inclusion, filters_exclusion } = bundle.fields
      const filtersInclusion = JSON.parse(filters_inclusion)
      const filtersExclusion = JSON.parse(filters_exclusion)
      const inclusionCriteria: CriteriaTypes[] = await Promise.all(
        (filtersInclusion ?? []).map(
          async ({ operands }) => compact(await Promise.all(
            operands.map(async (criterionId) => {
              const res = await getCriterias({ filterByFormula: `SEARCH("${criterionId}",{criterion_id})` })
              return res?.records[0] as CriteriaTypes
            })))))
      const exclusionCriteria: CriteriaTypes[] = await Promise.all(
        (filtersExclusion ?? []).map(
          async ({ operands }) => compact(await Promise.all(
            operands.map(async (criterionId) => {
              const res = await getCriterias({ filterByFormula: `SEARCH("${criterionId}",{criterion_id})` })
              return res?.records[0] as CriteriaTypes
            })))))
      const inclusionOperator = filtersInclusion[0]?.operator
      const exclusionOperator = filtersExclusion[0]?.operator
      let meetsInclusion: boolean = inclusionOperator === 'and'
      for (const criterion of inclusionCriteria) {
        let expression = await getExpression({ filterByFormula: `SEARCH("${criterion[0].fields.expression[0]}",{expression_id})` })
        expression = expression?.records[0]
        let filter = await getFilter({ filterByFormula: `SEARCH("${criterion[0].fields.filter[0]}",{local_id})` })
        filter = filter?.records[0]
        const expressionValueAccessor = expressionValueAccessors[expression.fields.name]
        if (expressionValueAccessor) {
          const expressionValue = expressionValueAccessor()
          const criterionValue = criterion[0].fields.value
          const filterSymbol = filter.fields.symbol
          const useQuotes = ['='].includes(filterSymbol)
          const expressionScript =
            (useQuotes ? `"${expressionValue}"` : expressionValue) +
            (filterSymbol == '=' ? ` == ` : ` ${filterSymbol} `) +
            (useQuotes ? `"${criterionValue}"` : criterionValue)
          const expressionResult = eval(expressionScript)
          if (inclusionOperator == 'and' && !expressionResult) {
            meetsInclusion = false
            break
          }
          if (inclusionOperator == 'or' && expressionResult) {
            meetsInclusion = true
            break
          }
        } else {
          console.log('Skip ' + expression.fields.name)
        }
      }
      if (meetsInclusion) {
        eligibleBundles.push(bundle.id)
      } else {
        ineligibleBundles.push(bundle.id)
      }
    }
    for (const eligibleBundleId of eligibleBundles) {
      if (bundleHistory.find(({ bundle }) => bundle[0] === eligibleBundleId)) {
        console.log('Already there')
      } else {
        console.log(bundleHistory)
        console.log('Creating', {
          patient: [patientId],
          bundle: [eligibleBundleId],
          status: 'eligible',
          eligible_date: new Date().toISOString().slice(0, 10)
        })
        await createHistory({
          fields: {
            patient: [patientId],
            bundle: [eligibleBundleId],
            status: 'eligible',
            eligible_date: new Date().toISOString().slice(0, 10)
          }
        })
      }
    }
    window.location.reload()
    setBundleEligibility({ eligibleBundles, ineligibleBundles })
    console.log({ eligibleBundles, ineligibleBundles })
  }, [bundles, patient])

  return (
    <PageContext.Provider
      value={{ user, patient, notes, bundleHistory, statusGroups }}
    >
      <BareLayout>
        <ThemeProvider theme={customTheme}>
          <Box pl="16px" pr="16px">
            <CSSReset />
            <ManagerHeader patient={patient} user={user} />
            <VStack spacing="8" mt="4">
              {patient && notes && (
                <Grid templateColumns="repeat(4, 1fr)" gap={6} width="100%">
                  <Box w="100%">
                    <Box display="flex" mb="4">
                      <Box>
                        <Heading as="h2" size="md">
                          Patient Information
                        </Heading>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box>
                        <Text fontWeight="bold">First name:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.firstName}</Text>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box>
                        <Text fontWeight="bold">Last name:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.lastName}</Text>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box>
                        <Text fontWeight="bold">Date of birth:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.dateOfBirth}</Text>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box>
                        <Text fontWeight="bold">Sex:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.sex}</Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box w="100%">
                    <Box display="flex" mt="10">
                      <Box>
                        <Text fontWeight="bold">Pronouns:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.pronouns}</Text>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box>
                        <Text fontWeight="bold">Phone:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.phoneNumber}</Text>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box>
                        <Text fontWeight="bold">Address:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.address}</Text>
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box>
                        <Text fontWeight="bold">City:&nbsp;</Text>
                      </Box>
                      <Box>
                        <Text>{patient.city}</Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box w="100%">
                    <Box display="flex" mb="4">
                      <Box>
                        <Heading as="h2" size="md">
                          Notes
                        </Heading>
                      </Box>
                    </Box>
                    {notes.length == 0 ? (
                      <Text>No notes yet.</Text>
                    ) : (
                      notes.map((note: any) => {
                        return (
                          <Box key={note.id}>
                            <Text fontWeight="bold">{note.date}</Text>
                            <Box display="flex">
                              <Text>{note.title}</Text>
                              <Link href={note.pdf[0].url} target="_blank">
                                <LinkIcon mt="1" ml="1" color="#4c6dcc" />
                              </Link>
                            </Box>
                          </Box>
                        )
                      })
                    )}
                  </Box>
                  <Box w="100%">
                    <Box display="flex" mb="16px">
                      <Box>
                        <Heading as="h2" size="md">
                          Actions
                        </Heading>
                      </Box>
                    </Box>
                    <Box>
                      <Link onClick={onEditPatientOpen}>
                        <Button
                          borderRadius="5"
                          width="100%"
                          height="10"
                          leftIcon={<EditIcon />}
                        >
                          <Text>Edit patient information</Text>
                        </Button>
                      </Link>
                    </Box>
                    <Box mt="16px">
                      <Link onClick={onAddNoteOpen}>
                        <Button
                          borderRadius="5"
                          width="100%"
                          height="10"
                          leftIcon={<PlusSquareIcon />}
                        >
                          <Text>Create a new note</Text>
                        </Button>
                      </Link>
                    </Box>
                    <Box mt="16px">
                      <Link onClick={onRefreshBundles}>
                        <Button
                          borderRadius="5"
                          width="100%"
                          height="10"
                          leftIcon={<RepeatIcon />}
                        >
                          <Text>Refresh bundles</Text>
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Grid>
              )}
              {bundleHistory && (
                <Grid templateColumns="repeat(4, 1fr)" gap={6} width="100%">
                  {statusGroups.map(group => {
                    return (
                      <Box w="100%" h="10" key={`bundle-group-${group.name}`}>
                        <Box>
                          <Box>
                            <Heading as="h2" size="md">
                              {group.title}
                            </Heading>
                          </Box>
                        </Box>
                        <Box mt="16px" mb="16px">
                          {bundleHistory.filter(
                            (b: any) => b.status == group.name,
                          ).length == 0 && (
                              <Box>
                                <Text>No bundles to show.</Text>
                              </Box>
                            )}
                          {bundleHistory
                            .filter((b: any) => b.status == group.name)
                            .map(bundle => {
                              if (!bundle) return <></>
                              return (
                                <Box
                                  key={`bundle-group-${group.name}-bundle-${bundle.bundleName}`}
                                  h="40"
                                  p="16px"
                                  mb="16px"
                                  borderRadius="5"
                                  border="1px solid #4c6dcc;"
                                >
                                  <Link
                                    onClick={() => {
                                      setClickedBundleId(bundle.bundle[0])
                                      onBundleActionsOpen()
                                    }}
                                  >
                                    <Box mb="16px">
                                      <Heading
                                        as="h3"
                                        size="sm"
                                        color="#4c6dcc"
                                      >
                                        {bundle.bundleName}
                                      </Heading>
                                    </Box>
                                  </Link>
                                  <Box>
                                    <Text fontSize="14px">
                                      {bundle.status == 'completed'
                                        ? `Completed on ${bundle.completedDate}. `
                                        : ''}
                                      {bundle.status == 'inProgress'
                                        ? `Started on ${bundle.startedDate}. `
                                        : ''}
                                      {bundle.status == 'eligible'
                                        ? `Never completed. Eligible since ${bundle.eligibleDate}. `
                                        : ''}
                                      {bundle.status == 'ineligible'
                                        ? `Not eligible. `
                                        : ''}
                                      {bundle.status == 'completed'
                                        ? bundle.expires
                                          ? `Expires ${bundle.expiresDate}. `
                                          : 'Never expires.'
                                        : ''}
                                    </Text>
                                  </Box>
                                </Box>
                              )
                            })}
                        </Box>
                        <Text></Text>
                      </Box>
                    )
                  })}
                </Grid>
              )}
              <Modal
                closeOnOverlayClick={false}
                isOpen={isBundleActionsOpen}
                onClose={onBundleActionsClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader mt="8">
                    What would you like to do with this bundle?
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={8} align="center">
                    <Box>
                      <RouteLink
                        to={`/patients/${patientId}/bundles/${clickedBundleId}`}
                      >
                        <Button
                          colorScheme="blue"
                          mt={4}
                          w={200}
                          leftIcon={<EditIcon />}
                        >
                          Work on it now
                        </Button>
                      </RouteLink>
                    </Box>
                    <Box>
                      <Button
                        colorScheme="orange"
                        mt={4}
                        w={200}
                        leftIcon={<RepeatClockIcon />}
                      >
                        Schedule for later
                      </Button>
                    </Box>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <Modal
                closeOnOverlayClick={false}
                isOpen={isEditPatientOpen}
                onClose={onEditPatientClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader mt="8">
                    Edit this patient's information
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={8} align="center">
                    <Box>
                      <Button
                        colorScheme="blue"
                        mt={4}
                        w={200}
                        leftIcon={<EditIcon />}
                      >
                        Save
                      </Button>
                    </Box>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <Modal
                closeOnOverlayClick={false}
                isOpen={isAddNoteOpen}
                onClose={onAddNoteClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader mt="8">Add a note</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={8} align="center">
                    <Textarea />
                    <Box>
                      <Button
                        colorScheme="blue"
                        mt={4}
                        w={200}
                        leftIcon={<EditIcon />}
                        onClick={onAddNoteClose}
                      >
                        Save
                      </Button>
                    </Box>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <Box position="absolute" bottom="32px" right="32px" width="200px">
                <RouteLink to="/builder">
                  <Button colorScheme="green" size="md" width="100%">
                    <Text>Open Protocol Editor</Text>
                  </Button>
                </RouteLink>
              </Box>
            </VStack>
          </Box>
        </ThemeProvider>
      </BareLayout>
    </PageContext.Provider>
  )
}
