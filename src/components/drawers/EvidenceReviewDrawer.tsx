import React, { Suspense } from 'react'

// import { PathwayThemeProvider } from '../../../theme'
// import { Box } from '../../Box'

/* import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '../../Drawer'*/
// import { Evidence } from '../../Evidence'
// import { Text } from '../../Text'

type EvidenceReviewDrawerPropsType = {
  recommendationId: string
  isOpen: boolean
  onClose: () => void
}

export const EvidenceReviewDrawer = (props: EvidenceReviewDrawerPropsType) => {
  const { recommendationId, isOpen, onClose } = props

  return (
    <></>
  ) /* !recommendationId ? (
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
              <Text variant="title1">Evidence Review</Text>
            </DrawerHeader>

            <DrawerBody>
              <PathwayThemeProvider>
                <Suspense fallback={null}>
                  <Evidence
                    recommendationIds={[recommendationId]}
                    currentRecommendationId={recommendationId}
                  />
                </Suspense>
              </PathwayThemeProvider>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )*/
}
