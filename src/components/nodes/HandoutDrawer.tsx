import React, { useState, Suspense } from 'react'

import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Heading,
} from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'

import {
  Handout,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import { useAsync } from './helpers'
import { get as getResource } from '../../api/resource'

type HandoutDrawerPropsType = {
  handoutId: string
  isOpen: boolean
  onClose: () => void
}

export const HandoutDrawer = (props: HandoutDrawerPropsType) => {
  const { handoutId, isOpen, onClose } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)

  useAsync(
    async () => {
      if (!handoutId) return null
      const currentCollectedDb = await getResource('handout', handoutId)
      return currentCollectedDb
    },
    (currentCollectedDb: Database) => {
      setCollectedDb(currentCollectedDb)
    },
  )

  return !collectedDb ? (
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
              <Heading>
              {collectedDb.handouts[0].name}
              </Heading>
            </DrawerHeader>

            <DrawerBody>
              <PathwayThemeProvider>
                <DbProvider db={collectedDb}>
                  <Suspense fallback={null}>
                    <Handout handoutId={handoutId} />
                  </Suspense>
                </DbProvider>
              </PathwayThemeProvider>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )
}
