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
  Drug,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import { useAsync } from './helpers'
import { get as getResource } from '../../api/resource'

type MonographDrawerPropsType = {
  drugId: string
  isOpen: boolean
  onClose: () => void
}

export const MonographDrawer = (props: MonographDrawerPropsType) => {
  const { drugId, isOpen, onClose } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)

  useAsync(
    async () => {
      if (!drugId) return null
      const currentCollectedDb = await getResource('drug', drugId)
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
              {collectedDb.drugs[0].name}
              </Heading>
            </DrawerHeader>

            <DrawerBody>
              <PathwayThemeProvider>
                <DbProvider db={collectedDb}>
                  <Suspense fallback={null}>
                    <Drug drugId={drugId} />
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
