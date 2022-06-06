import React, { useState, Suspense } from 'react'

import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react'

import { Database, Parsed } from '@pathwaymd/pathway-parser'

import {
  Evidence,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import { useAsync } from './helpers'
import { get as getResource } from '../../api/resource'

type EvidenceReviewDrawerPropsType = {
  recommendationId: string
  isOpen: boolean
  onClose: () => void
}

export const EvidenceReviewDrawer = (props: EvidenceReviewDrawerPropsType) => {
  const { recommendationId, isOpen, onClose } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)

  useAsync(
    async () => {
      if (!recommendationId) return null
      const currentCollectedDb = await getResource(
        'evidence',
        recommendationId,
      )
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
            <DrawerHeader>Evidence Review</DrawerHeader>

            <DrawerBody>
              <PathwayThemeProvider>
                <DbProvider db={collectedDb}>
                  <Suspense fallback={null}>
                    {/* <Evidence
                      recommendationId={recommendationId}
                      currentRecommendationId={recommendationId}
                    /> */}
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
