import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useParams, Link as RouteLink } from 'react-router-dom'
import {
  Button,
  Box,
  Heading,
  Text,
  Badge,
} from '@chakra-ui/react'

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react'

const drawerComponents = {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
}

import { ArrowForwardIcon, ArrowLeftIcon } from '@chakra-ui/icons'
import { ThemeProvider, CSSReset, theme, Link } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { Protocol, DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'
import { DemographicsPatientState, NormativeUserState } from '@pathwaymd/pathway-ui2/src/components/Protocol/Protocol.StateSliceTypes'

import { Styles } from './style/bundleStyle'
import { BundleType, PatientType, UserType, ProtocolType } from '../types'
import BareLayout from '../components/layout/BareLayout'
//import Protocol from '../components/Protocol'
import BundleHeader from '../components/headers/BundleHeader'
import { customTheme } from '../theme'
import { formatAirtableResult } from '../service/common'
import { get as getResource } from '../api/resource'
import { get as getPatient } from '../api/patient'
import { get as getUser } from '../api/user'
import { get as getBundle } from '../api/bundle'
import { getFilter as getProtocols } from '../api/protocol'
import { sortBy } from 'lodash'
import { userInfo } from 'os'

type ProtocolStateType = {
  isComplete: boolean
  nodeStates: {
    calculators: any[]
  }
}
const PageContext = React.createContext({})
function useAsync(asyncFn: any, onSuccess: any) {
  useEffect(() => {
    let isActive = true
    asyncFn().then((data: any) => {
      if (isActive) onSuccess(data)
    })
    return () => {
      isActive = false
    }
  }, [])
}
type ProtocolStateBadgePropsType = {
  protocolState: any
}

function ProtocolStateBadge(props: ProtocolStateBadgePropsType) {
  const { protocolState = {} } = props

  if (protocolState.isComplete) {
    return (
      <Badge variant="solid" colorScheme="green" mt="0.5rem">
        Complete
      </Badge>
    )
  } else if (protocolState.isInitiated) {
    return (
      <Badge variant="outline" colorScheme="green" mt="0.5rem">
        In progress
      </Badge>
    )
  } else {
    return <></>
  }
}

/*
function ResetDialog({
  openState,
  onReset,
}: {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onReset: () => void
}) {
  const [isOpen, setIsOpen] = openState
  const cancel = () => setIsOpen(false)
  const cancelRef = useRef(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={cancel}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Reset Pathway
        </AlertDialogHeader>

        <AlertDialogBody>
          Are you sure? You can't undo this action afterwards.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={cancel}>
            Cancel
          </Button>

          <Button
            colorScheme="red"
            onClick={() => {
              setIsOpen(false)
              onReset()
            }}
            ml={3}
          >
            Reset
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

*/
interface Autosaved {
  [id: string]: any
}

type BundleProtocolListPropsType = {
  patientId: string
  bundleId: string
  selectedProtocolId: string
  protocolStates: any
  protocols: ProtocolType[]
}

function BundleProtocolList(props: BundleProtocolListPropsType) {
  let {
    bundleId,
    protocolId,
    patientId,
  }: { bundleId: string; protocolId: string; patientId: string } =
    useParams() as { bundleId: string; protocolId: string; patientId: string }

  const { selectedProtocolId, protocols, protocolStates } = props

  return (
    <Box
      w="calc(100% - 16px)"
      pt="4"
      pl="4"
      pr="4"
      overflowX="auto"
      overflowY="hidden"
      whiteSpace="nowrap"
    >
      {sortBy(protocols, (p) => p.fields.name).map((protocol: ProtocolType, i: number) => (
        <Box
          key={protocol.id}
          display="inline-flex"
          ml={i > 0 ? '0.5rem' : '0'}
        >
          <Box>
            <RouteLink
              to={`/patients/${patientId}/bundles/${bundleId}/protocols/${protocol.id}`}
            >
              <Button
                as="a"
                display="flex"
                colorScheme="pathway"
                size="sm"
                variant={
                  protocol.id === selectedProtocolId ? 'solid' : 'outline'
                }
                color={
                  protocol.id === selectedProtocolId ? 'white' : 'pathway.400'
                }
                justifyContent="space-between"
                py="0.75rem"
                rightIcon={<ArrowForwardIcon />}
                height="auto"
                width="24rem"
                whiteSpace="normal"
              >
                <Box>
                  <Text display="block" fontWeight="normal">
                    Bundle #{i + 1}
                  </Text>
                  <Heading as="h3" display="block" fontSize="md" mt="0.15em">
                    {protocol.fields?.name}
                  </Heading>
                </Box>
              </Button>
            </RouteLink>
            <ProtocolStateBadge protocolState={protocolStates[protocol.id]} />
          </Box>
        </Box>
      ))}
    </Box>
  )
}
type ContextualizedProtocolPropsType = {
  protocolId: string
  patient: PatientType
  user: UserType
  onStateChange: (protocolId: string, protocolState: any) => void
}

function ContextualizedProtocol(props: ContextualizedProtocolPropsType) {
  const PatientContext = React.createContext<PatientType | null>(null)
  const ProtocolContext = React.createContext<ProtocolStateType | null>(null)
  const { protocolId, patient, user, onStateChange } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)

  useAsync(
    async () => {
      if (!protocolId) return [null, null]
      const currentCollectedDb = await getResource(
        'protocol',
        protocolId,
      )
      return currentCollectedDb
    },
    (currentCollectedDb) => {
      setCollectedDb(currentCollectedDb)
    },
  )
  const demographicsPatientStates: {
    [id: string]: DemographicsPatientState
  } = {}
  demographicsPatientStates[patient.id] = patient

  const normativeUserStates: {
    [id: string]: NormativeUserState
  } = {}
  normativeUserStates[user.id] = user

  return collectedDb && (
    <Box pl="xl" pb="32px">
      <PathwayThemeProvider>

        <DbProvider db={collectedDb}>
          <Suspense fallback={null}>
            <Protocol
              isContextualized={true}
              showNoteLogger={true}
              unfoldPaths={false}
              patientId={patient.id}
              protocolId={protocolId}
              userId={user.id}
              initialPatientStates={{
                demographicsPatientStates
              }}
              initialUserStates={{
                normativeUserStates
              }}
              drawerComponents={drawerComponents}
              stickyHeightOffset={Math.min(25, 150 - document.documentElement.scrollTop)}
            />
          </Suspense>
        </DbProvider>

      </PathwayThemeProvider>
    </Box>
  )
}

const Bundle = () => {
  let {
    bundleId,
    protocolId,
    patientId,
  }: { bundleId: string; protocolId: string; patientId: string } =
    useParams() as { bundleId: string; protocolId: string; patientId: string }

  const generateStorageKey = id => `protocol-v11-${id}-autosaved`
  const userId = 'recaV7dSybHG1netm' // will come from session eventually
  const [bundle, setBundle] = useState<BundleType>()
  const [protocols, setProtocols] = useState<ProtocolType[]>([])
  const [protocol, setProtocol] = useState<ProtocolType>()
  const [defaultProtocolId, setDefaultProtocolId] = useState<string>()
  const [evidence, setEvidence] = useState(null)
  const [storageKey, setStorageKey] = useState<string>(
    generateStorageKey(protocolId),
  )
  const [autosaved, setAutosaved] = useState<Autosaved>({})
  const [loaded, setLoaded] = useState(false)
  const [patient, setPatient] = useState<PatientType>(null)
  const [user, setUser] = useState<UserType>(null)
  const [lastResetTime, setLastResetTime] = useState(Date.now())
  const getProtocolsWithBundle = async (bundleId: string) => {
    const res = await getProtocols({
      filterByFormula: `FIND('${bundleId}',{bundles})`
    })
    const records: ProtocolType[] = res.records
    const protocols = records.filter((record: ProtocolType) =>
      record.fields.bundles.includes(bundleId),
    )
    return protocols
  }
  const save = (pathwayState: any) => {
    const value = { ...(autosaved ?? {}), [protocolId]: pathwayState }
    localStorage.setItem(storageKey, JSON.stringify(value))
    setAutosaved(value)
  }
  const reset = () => {
    save(null)
    setLastResetTime(Date.now())
  }
  useAsync(
    async () => {
      let tmp = await getPatient(patientId)
      const selectedPatient = formatAirtableResult(tmp)
      tmp = await getUser(userId)
      const selectedUser = formatAirtableResult(tmp)
      const selectedBundle = await getBundle(bundleId)
      const selectedProtocols = await getProtocolsWithBundle(bundleId)

      if (selectedProtocols.length == 0) {
        setDefaultProtocolId(null)
        return [
          selectedPatient,
          selectedUser,
          selectedBundle,
          selectedProtocols,
          null
        ]
      }

      const defaultProtocolId = sortBy(selectedProtocols, (p) => p.fields.name)[0].id
      setDefaultProtocolId(defaultProtocolId)
      const selectedProtocol = selectedProtocols.find(
        x => x.id == (protocolId ?? defaultProtocolId),
      )
      return [
        selectedPatient,
        selectedUser,
        selectedBundle,
        selectedProtocols,
        selectedProtocol,
      ]
    },
    ([
      selectedPatient,
      selectedUser,
      selectedBundle,
      selectedProtocols,
      selectedProtocol,
    ]: [PatientType, UserType, BundleType, ProtocolType[], ProtocolType]) => {
      setPatient(selectedPatient)
      setUser({ id: userId, ...selectedUser })
      setBundle(selectedBundle)
      setProtocols(selectedProtocols)
      setProtocol(selectedProtocol)
    },
  )
  const [protocolStates, setProtocolStates] = useState<Object>({})
  const onProtocolStateChange = (protocolId, protocolState) => {
    let newProtocolStates = { ...protocolStates }
    newProtocolStates[protocolId] = protocolState
    setProtocolStates(newProtocolStates)
  }
  //const resetDialogOpenState = useState(false)
  //const [isResetDialogOpen, setResetDialogOpen] = resetDialogOpenState

  const renderedProtocol = useMemo(() => {

    if (!protocol && !!patient) {
      return <Box p={8} pt={4}><Text>
        <Link color="#5672c1" href={`/builder`}>Add a protocol</Link> to this bundle to use it with this patient.
      </Text></Box>
    }

    if (!user) {
      return <Box p={8} pt={4}><Text>
        Loading...
      </Text></Box>
    }

    console.log(user)
    return (
      <ContextualizedProtocol
        protocolId={protocolId ?? defaultProtocolId}
        patient={patient}
        user={user}
        onStateChange={onProtocolStateChange}
      />
    )
  }, [protocolId, protocol, patient, user])


  const renderedBundleList = useMemo(() => {

    if (protocols.length == 0) {
      return <Box p={8} pb={4}><Text fontStyle="italic">
        This bundle does not contain any protocol(s).
      </Text></Box>
    }

    return (
      <BundleProtocolList
        patientId={patientId}
        bundleId={bundleId}
        selectedProtocolId={protocolId ?? defaultProtocolId}
        protocolStates={protocolStates}
        protocols={protocols}
      />
    )
  }, [patientId, protocolId, bundleId, protocols, protocolStates])


  return !patient ? (
    <>Loading...</>
  ) : (
    <Styles>
      <BareLayout>
        <ThemeProvider theme={customTheme}>
          <CSSReset />
          <BundleHeader patient={patient} user={user} bundle={bundle} />
          {/*<ResetDialog openState={resetDialogOpenState} onReset={reset} />*/}

          {renderedBundleList}
          <Box height={4} borderBottom="1px solid lightgray">
          </Box>
          <Box height={6}>
          </Box>
          <Box>
            {renderedProtocol}
          </Box>
        </ThemeProvider>
      </BareLayout>
    </Styles>
  )
}

export default Bundle
