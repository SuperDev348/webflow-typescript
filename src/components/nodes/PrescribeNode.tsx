import React, { useMemo, useState, Suspense } from 'react'

import { Box, Heading } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'
import { DbProvider, PathwayThemeProvider } from '@pathwaymd/pathway-ui2'
import { DosageSection } from '@pathwaymd/pathway-ui2/src/components/Drug/Sections/DosageSection'

import {
  useAsync,
  wrapInBox,
  wrapInBoxNonContextualized,
  wrapError,
} from './helpers'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'
import { DrawerBadge } from './DrawerBadge'
import { MonographDrawer } from './MonographDrawer'
import { get as getResource } from '../../api/resource'

type PrescribeNodePropsType = {
  isContextualized: boolean
  blockId: string
  dosageId: string
  isComplete: boolean
}

export const PrescribeNode = (props: PrescribeNodePropsType) => {
  const { isContextualized, blockId, dosageId, isComplete } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [drug, setDrug] = useState<Parsed.Drug | null>(null)
  const [isMonographDrawerOpen, setIsMonographDrawerOpen] =
    useState<boolean>(false)

  let dosage

  useAsync(
    async () => {
      if (!dosageId) return [null, null]

      const currentCollectedDb: Database = await getResource(
        'dosage',
        dosageId,
      )
      const currentDosage: Parsed.Dosage = currentCollectedDb.dosages.find(
        dosage => dosage.id == dosageId,
      )
      if (!currentDosage) {
        throw new Error('Collected database does not contain selected dosage.')
      }

      const currentDrug: Parsed.Drug = currentCollectedDb.drugs.find(
        drug => drug.id == currentDosage.drugId,
      )
      if (!currentDrug) {
        throw new Error('Collected database does not contain selected drug.')
      }
      return [currentCollectedDb, currentDrug]
    },
    ([currentCollectedDb, currentDrug]) => {
      setCollectedDb(currentCollectedDb)
      setDrug(currentDrug)
    },
  )

  const renderedMonographDrawer = useMemo(() => {
    if (!collectedDb || !drug) {
      return <></>
    }
    return (
      <Box zIndex={1900}>
        <PathwayThemeProvider>
          <DbProvider db={collectedDb}>
            <Suspense fallback={null}>
              <MonographDrawer
                drugId={drug.id}
                isOpen={isMonographDrawerOpen}
                onClose={() => setIsMonographDrawerOpen(false)}
              />
            </Suspense>
          </DbProvider>
        </PathwayThemeProvider>
      </Box>
    )
  }, [drug, collectedDb, isMonographDrawerOpen])

  const contextualizedRenderedBlock = useMemo(() => {
    if (collectedDb === null || drug === null) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">Medication Order</Heading>
        <Box mt="4">
          <PathwayThemeProvider>
            <DbProvider db={collectedDb}>
              <Suspense fallback={null}>
                <Heading size="sm" mt="8px" mb="8px">
                  {drug.name}
                </Heading>
                <DosageSection title="" dosageIds={[dosageId]} />
              </Suspense>
            </DbProvider>
          </PathwayThemeProvider>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
        <DrawerBadge
          isContextualized={isContextualized}
          drawerType={'monograph'}
          resourceId={drug.id}
          onClick={() => {
            setIsMonographDrawerOpen(true)
          }}
        />
        {renderedMonographDrawer}
      </Box>,
    )
  }, [blockId, isContextualized, isComplete, collectedDb, drug])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (collectedDb === null || drug === null) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <DrawerBadge
          isContextualized={isContextualized}
          drawerType={'monograph'}
          resourceId={drug.id}
          onClick={() => {
            setIsMonographDrawerOpen(true)
          }}
        />
        <Heading size="sm">Administer the following:</Heading>
        <Box mt="6">
          <PathwayThemeProvider>
            <DbProvider db={collectedDb}>
              <Suspense fallback={null}>
                <Heading size="sm" mt="8px">
                  {drug.name}
                </Heading>
                <Box mt="-16px" ml="-4px">
                  <DosageSection title="" dosageIds={[dosageId]} />
                </Box>
              </Suspense>
            </DbProvider>
          </PathwayThemeProvider>
        </Box>
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />

        {renderedMonographDrawer}
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    collectedDb,
    drug,
    isMonographDrawerOpen,
  ])

  if (!dosageId) {
    return wrapInBox(wrapError('No dosage/drug selected.'))
  } else if (collectedDb === null || drug === null) {
    return <></>
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
