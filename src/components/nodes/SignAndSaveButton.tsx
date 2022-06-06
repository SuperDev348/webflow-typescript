import React, { useState, useContext } from 'react'
import {
  useDisclosure,
  Button,
  ButtonGroup,
  Box,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Spinner,
  Text,
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
} from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'

import { getBundle, getProtocol, useAsync } from './helpers'
import { CompletionStateBadge } from './CompletionStateBadge'
import { BundleType, ProtocolType, PatientType } from '../../types'
import ProtocolReport from '../ProtocolReport'

type SignAndSaveButtonPropsType = {
  patientContext: React.Context<PatientType | null>
  protocolId: string
  protocolState: any
}

export const SignAndSaveButton = (props: SignAndSaveButtonPropsType) => {
  const userId = 'recaV7dSybHG1netm'
  const { protocolId, protocolState, patientContext } = props
  const [protocol, setProtocol] = useState<ProtocolType>()
  const [bundle, setBundle] = useState<BundleType>()
  const patient = useContext(patientContext)

  useAsync(
    async () => {
      const protocol: ProtocolType = await getProtocol(protocolId)
      const bundle: BundleType = await getBundle(protocol.fields.bundles[0])
      return [protocol, bundle]
    },
    ([protocol, bundle]) => {
      setProtocol(protocol)
      setBundle(bundle)
    },
  )

  const { onOpen, onClose, isOpen } = useDisclosure()
  const inputRef = React.useRef(null)

  const [name, setName] = useState<string>('')
  const isConfirmDisabled = name.length <= 2

  const [signed, setSigned] = useState<boolean>(false)

  const api = {}

  /*
  const saveProtocolReport = () => {

    const data = {
      fields: {
        patient: [patient.id],
        title: bundle.name + '/' + protocol.name,
        user: [userId],
        date: Date.now().toString(),
        pdf: 
      }
    }
    axios.post(`${AIRTABLE_CARE_MANAGER_BASE_URL}/Notes`, data, options)
      .then((res: any) => {

      })
      .catch((err: any) => {
        console.log(err);
      });

  }*/

  return (
    <>
      {signed && (
        <>
          <Portal>
            <Box
              position="fixed"
              zIndex={999}
              top={0}
              right={0}
              bottom={0}
              left={0}
              bg="rgba(255, 255, 255, 0.85)"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <ProtocolReport
                patientContext={patientContext}
                signName={name}
                date={new Date()}
                bundle={bundle}
                protocol={protocol}
                api={api}
                protocolState={protocolState}
              >
                {({ blob, url, loading, error }) => {
                  if (url) {
                    window.open(url, '_blank')
                    return null
                  } else if (error) {
                    return (
                      <Text>
                        Something went wrong.{' '}
                        <a href="#" onClick={() => setSigned(false)}>
                          Close
                        </a>
                      </Text>
                    )
                  } else {
                    return <Spinner size="xl" zIndex={9999} />
                  }
                }}
              </ProtocolReport>
            </Box>
          </Portal>
        </>
      )}

      <Popover
        placement="auto-end"
        closeOnBlur={true}
        isOpen={isOpen}
        initialFocusRef={inputRef}
        onOpen={onOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button colorScheme="green" size="lg" isDisabled={patient == null}>
            Sign
          </Button>
        </PopoverTrigger>

        <PopoverContent
          background="white"
          zIndex={1}
          style={{
            border: '1px solid lightgray',
          }}
        >
          <PopoverHeader
            style={{
              borderBottom: '1px solid lightgray',
            }}
            fontWeight="semibold"
          >
            Enter your full name
          </PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody
            style={{
              border: '0px',
            }}
          >
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="sign_name">Full name</FormLabel>
                <Input
                  ref={inputRef}
                  id="sign_name"
                  onChange={e => setName(e.target.value)}
                  defaultValue={name}
                />
              </FormControl>
            </Stack>
          </PopoverBody>

          <PopoverFooter
            style={{
              borderTop: '1px solid lightgray',
            }}
            display="flex"
            justifyContent="flex-end"
          >
            <ButtonGroup size="sm">
              <Button variant="outline">Cancel</Button>

              <Button
                colorScheme="green"
                isDisabled={isConfirmDisabled}
                onClick={() => setSigned(true)}
              >
                Confirm
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  )
}
