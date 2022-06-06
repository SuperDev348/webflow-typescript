import React from 'react'

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
// import { Text } from '../../Text'

import * as Parsed from '@pathwaymd/pathway-parser/src/parsed'
import { suspend } from 'suspend-react'

type ReferenceDrawerPropsType = {
  referenceId: string
  isOpen: boolean
  onClose: () => void
}

export const ReferenceDrawer = (props: ReferenceDrawerPropsType) => {
  // const { getReferencesById } = useDb()
  // const { referenceId, isOpen, onClose } = props

  // const {
  //   reference,
  // }: { reference: Parsed.Reference | null } = suspend(async () => {
  //   return {
  //     reference: !referenceId ? null : getReferencesById(referenceId) ?? null,
  //   }
  // }, [referenceId])

  // if (reference === null) {
  //   return <></>
  // }
  return (
    <></>
  ) /* (
    <Box zIndex="2">
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose()
        }}
        size="md"
      >
        <DrawerOverlay zIndex="2" bg="white">
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Text variant="title2">{reference.name}</Text>
            </DrawerHeader>
            <DrawerBody>
              <Text>
                {reference.authors} ({reference.year})
              </Text>
              <Box marginTop="xl" width="90%" height="90%">
                <iframe width="100%" height="100%" src={reference.url} />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )*/
}
