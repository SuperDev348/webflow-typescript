import React, { useState, useMemo } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { Database } from '@pathwaymd/pathway-parser'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { useAsync } from './helpers'
import { get as getResource } from '../../api/resource'

type DrawerBadgePropsType = {
  isContextualized: boolean
  drawerType: 'monograph' | 'handout'
  resourceId: string
  onClick: () => void
}

export const DrawerBadge = (props: DrawerBadgePropsType) => {
  const { isContextualized, drawerType, resourceId, onClick } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)

  useAsync(
    async () => {
      if (drawerType == 'monograph') {
        const currentCollectedDb = await getResource('drug', resourceId)
        return currentCollectedDb
      }

      if (drawerType == 'handout') {
        const currentCollectedDb = await getResource('handout', resourceId)
        return currentCollectedDb
      }
    },

    currentCollectedDb => {
      setCollectedDb(currentCollectedDb)
    },
  )

  const contextualizedRenderedBadge = <Box></Box>

  const nonContextualizedRenderedBadge = useMemo(() => {
    return (
      <Box position="relative" float="right" mt="-4px">
        <IconButton
          aria-label=""
          onClick={onClick}
          colorScheme={'gray'}
          icon={<ExternalLinkIcon />}
        ></IconButton>
      </Box>
    )
  }, [isContextualized, collectedDb])

  if (collectedDb === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBadge
      : nonContextualizedRenderedBadge
  }
}
