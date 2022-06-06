import React, { useMemo, useState, Suspense } from 'react'
import { Box, Heading } from '@chakra-ui/react'
import { Database, Parsed } from '@pathwaymd/pathway-parser'

import {
  Calculator,
  DbProvider,
  PathwayThemeProvider,
} from '@pathwaymd/pathway-ui2'

import {
  useAsync,
  wrapError,
  wrapInBox,
  wrapInBoxNonContextualized,
} from './helpers'
import { get as getResource } from '../../api/resource'
import { EvidenceBadge } from './EvidenceBadge'
import { CompletionStateBadge } from './CompletionStateBadge'

type CalculatorNodePropsType = {
  isContextualized: boolean
  blockId: string
  calculatorId: string
  isComplete: boolean
}

export const CalculatorNode = (props: CalculatorNodePropsType) => {
  const { isContextualized, blockId, calculatorId, isComplete } = props
  const [collectedDb, setCollectedDb] = useState<Database | null>(null)
  const [calculator, setCalculator] = useState<Parsed.Calculator | null>(null)

  useAsync(
    async () => {
      if (!calculatorId) return [null, null]
      const currentCollectedDb = await getResource(
        'calculator',
        calculatorId,
      )
      const currentCalculator = currentCollectedDb.calculators.find(
        calculator => calculator.id == calculatorId,
      )

      return [currentCollectedDb, currentCalculator]
    },
    ([currentCollectedDb, currentCalculator]) => {
      setCollectedDb(currentCollectedDb)
      setCalculator(currentCalculator)
    },
  )

  const renderedCalculatorComponent = useMemo(() => {
    return (
      <Box mt="4">
        <PathwayThemeProvider>
          <DbProvider db={collectedDb}>
            <Suspense fallback={null}>
              <Calculator
                calculatorId={calculatorId}
                onStateChange={x => {
                  console.log(x)
                }}
                omitReference={true}
              />
            </Suspense>
          </DbProvider>
        </PathwayThemeProvider>
      </Box>
    )
  }, [collectedDb, calculatorId])

  const contextualizedRenderedBlock = useMemo(() => {
    if (collectedDb === null || calculator === null) return <></>
    return wrapInBox(
      <Box>
        <CompletionStateBadge isComplete={isComplete} />
        <Heading size="md">{calculator.name}</Heading>
        {renderedCalculatorComponent}
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    calculatorId,
    calculator,
    collectedDb,
  ])

  const nonContextualizedRenderedBlock = useMemo(() => {
    if (collectedDb === null || calculator === null) return <></>
    return wrapInBoxNonContextualized(
      <Box>
        <Heading size="md">{calculator.name}</Heading>
        {renderedCalculatorComponent}
        <EvidenceBadge isContextualized={isContextualized} blockId={blockId} />
      </Box>,
    )
  }, [
    blockId,
    isContextualized,
    isComplete,
    calculatorId,
    calculator,
    collectedDb,
  ])

  if (!calculatorId) {
    return wrapInBox(wrapError('No calculator specified.'))
  } else {
    return isContextualized
      ? contextualizedRenderedBlock
      : nonContextualizedRenderedBlock
  }
}
