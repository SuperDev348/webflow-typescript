import React, { Suspense } from 'react'

// import { PathwayThemeProvider } from '../../../theme'
// import { Box } from '../../Box'
// import { useDb } from '../../DbProvider/DbProvider'

/* import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '../../Drawer'*/
// import { Drug } from '../../Drug'
// import { Text } from '../../Text'

import * as Parsed from '@pathwaymd/pathway-parser/src/parsed'

type MonographDrawerPropsType = {
  drugId: string
  isOpen: boolean
  onClose: () => void
}

export const MonographDrawer = (props: MonographDrawerPropsType) => {
  // const { getDrugsById } = useDb()
  // const { drugId, isOpen, onClose } = props
  // const drug: Parsed.Drug | null = getDrugsById(drugId)

  return (
    <></>
  ) /* !drug ? (
    <></>
  ) : (
    <Box zIndex="2">
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose()
        }}
        size="md"
      >
        <DrawerOverlay zIndex="2" backgroundColor="white">
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Text variant="title2">{drug.name}</Text>
            </DrawerHeader>

            <DrawerBody>
              <PathwayThemeProvider>
                <Suspense fallback={null}>
                  <Drug drugId={drugId} />
                </Suspense>
              </PathwayThemeProvider>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )*/
}
