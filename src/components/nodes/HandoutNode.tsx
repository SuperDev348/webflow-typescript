import React, { useContext, useMemo, useState, Suspense } from 'react'

import { Box, Heading, Button, ListItem, UnorderedList } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import {
  Checklist,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'
import { HandoutDrawer } from './HandoutDrawer'
import { PatientType } from '../../types'

import {
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  wrapError,
} from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import { DrawerBadge } from './DrawerBadge'
import { get as getResource } from '../../api/resource'

type HandoutNodePropsType = {
  isContextualized: boolean
  blockId: string
  handoutId: string
  isComplete: boolean
  patientContext?: React.Context<PatientType>
}

export const HandoutNode = (props: HandoutNodePropsType) => {
  const { isContextualized, blockId, handoutId, isComplete, patientContext } =
    props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [handout, setHandout] = useState<Parsed.Handout | null>(null)
  const [isHandoutDrawerOpen, setIsHandoutDrawerOpen] = useState<boolean>(false)
  const patient = useContext(patientContext)

  useAsync(
    async () => {
      if (!handoutId) return [null, null]

      const currentCollectedDb: Database = await getResource(
        'handout',
        handoutId,
      )
      const currentHandout: Parsed.Handout = currentCollectedDb.handouts.find(
        handout => handout.id == handoutId,
      )
      if (!currentHandout) {
        throw new Error('Collected database does not contain selected handout.')
      }

      return [currentCollectedDb, currentHandout]
    },
    ([currentCollectedDb, currentHandout]) => {
      setCollectedDb(currentCollectedDb)
      setHandout(currentHandout)
    },
  )

  const renderedHandoutDrawer = useMemo(() => {
    if (!collectedDb || !handout) {
      return <></>
    }
    return (
      <Box zIndex={1900}>
        <PathwayThemeProvider>
          <DbProvider db={collectedDb}>
            <Suspense fallback={null}>
              <HandoutDrawer
                handoutId={handout.id}
                isOpen={isHandoutDrawerOpen}
                onClose={() => setIsHandoutDrawerOpen(false)}
              />
            </Suspense>
          </DbProvider>
        </PathwayThemeProvider>
      </Box>
    )
  }, [handout, collectedDb, isHandoutDrawerOpen])

  const contextualizedRenderedBlock = useMemo(() => {
    if (collectedDb === null || handout === null) return <></>

    const phoneNumberParts: string[] = (patient?.phoneNumber ?? '').split('-')
    const censoredPhoneNumber = phoneNumberParts
      .map((phoneNumberPart: string, partIndex: number) => {
        return !(partIndex == phoneNumberParts.length - 1)
          ? phoneNumberPart
          : 'X'.repeat(phoneNumberPart.length)
      })
      .join('-')

    const emailParts: string[] = (patient?.email ?? '').split('@')
    const censoredEmail = emailParts
      .map((emailPart: string, partIndex: number) => {
        return partIndex == 0
          ? emailPart.slice(0, 3) +
              'X'.repeat(Math.min(Math.abs(emailPart.length - 6), 4)) +
              emailPart.slice(-3)
          : emailPart
      })
      .join('@')

    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Educational Material</Heading>
        <Box mt="4">
          <UnorderedList mt="16px">
            <ListItem>{handout.name} (Patient education)</ListItem>
          </UnorderedList>
        </Box>
        {patient && (
          <Box>
            <Heading size="md" mt="8">
              Share Via
            </Heading>
            <Box mt="4">
              <PathwayThemeProvider>
                <Checklist
                  data={[
                    {
                      key: 'sms',
                      text: `Send secure link by text message at ${censoredPhoneNumber}`,
                    },
                    {
                      key: 'email',
                      text: `Send secure link by e-mail at ${censoredEmail}`,
                    },
                  ]}
                  onSelectedKeysChange={updatedSelectedKeys => {}}
                  keyExtractor={item => item.key}
                  labelExtractor={item => item.text}
                  initialSelectedKeys={[]}
                />
              </PathwayThemeProvider>
            </Box>
          </Box>
        )}
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
        <DrawerBadge
          isContextualized={isContextualized}
          drawerType={'handout'}
          resourceId={handout.id}
          onClick={() => {
            setIsHandoutDrawerOpen(true)
          }}
        />
        {renderedHandoutDrawer}
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    collectedDb,
    handout,
    patient,
    isHandoutDrawerOpen,
  ])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (collectedDb === null || handout === null) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <DrawerBadge
          isContextualized={isContextualized}
          drawerType={'handout'}
          resourceId={handout.id}
          onClick={() => {
            setIsHandoutDrawerOpen(true)
          }}
        />
        <Heading size="sm">Provide educational material:</Heading>
        <Box mt="6">
          <UnorderedList mt="16px">
            <ListItem>{handout.name} (Patient education)</ListItem>
          </UnorderedList>
        </Box>
        {renderedHandoutDrawer}
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    collectedDb,
    handout,
    isHandoutDrawerOpen,
  ])

  if (!handoutId) {
    return wrapInBox(wrapError('No dosage/drug selected.'))
  } else if (collectedDb === null || handout === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
