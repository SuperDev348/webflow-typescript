import React, { Suspense } from 'react'
import * as Parsed from '@pathwaymd/pathway-parser/src/parsed'

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
// import { Handout } from '../../Handout'
// import { Text } from '../../Text'


type HandoutDrawerPropsType = {
  handoutId: string
  isOpen: boolean
  onClose: () => void
}

export const HandoutDrawer = (props: HandoutDrawerPropsType) => {
  // const { getHandoutsById } = useDb()
  // const { handoutId, isOpen, onClose } = props

  // const handout: Parsed.Handout | null = getHandoutsById(handoutId) ?? null

  return (
    <></>
  ) /* handout === null ? (
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
              <Text>{handout.name}</Text>
            </DrawerHeader>

            <DrawerBody>
              <PathwayThemeProvider>
                <Suspense fallback={null}>
                  <Handout handoutId={handoutId} />
                </Suspense>
              </PathwayThemeProvider>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  ) */
}
