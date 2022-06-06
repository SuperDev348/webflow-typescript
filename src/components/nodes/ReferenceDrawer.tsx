import React, { useState } from 'react'
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Heading,
  Text,
} from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { Reference } from '@pathwaymd/pathway-ui2/src/components/Reference'

import { useAsync } from './helpers'
import { get as getResource } from '../../api/resource'

type ReferenceDrawerPropsType = {
  referenceId: string
  isOpen: boolean
  onClose: () => void
}

export const ReferenceDrawer = (props: ReferenceDrawerPropsType) => {
  const { referenceId, isOpen, onClose } = props

  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [reference, setReference] = useState<Parsed.Reference | null>(null)

  useAsync(
    async () => {
      if (!referenceId) return null
      const currentCollectedDb = await getResource(
        'reference',
        referenceId,
      )
      const currentReference = currentCollectedDb.references.find(
        _reference => {
          return _reference.id == referenceId
        },
      )
      if (!currentReference) {
        throw new Error('Could not find reference.')
      }
      return [currentCollectedDb, currentReference]
    },
    ([currentCollectedDb, currentReference]) => {
      setCollectedDb(currentCollectedDb)
      setReference(currentReference)
    },
  )

  return !collectedDb || !reference ? (
    <></>
  ) : (
    <Box zIndex={1500}>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose()
        }}
        size="md"
      >
        <DrawerOverlay zIndex={1500}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading size="md">{reference.name}</Heading>
            </DrawerHeader>
            <DrawerBody>
              <Reference id={reference.id} onOpenUrlRequest={(url) => window.open(url, '_blank')}>
              </Reference>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )
}
