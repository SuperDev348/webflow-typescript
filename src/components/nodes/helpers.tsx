import React, { useEffect } from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

import {
  TestData,
  CriterionDetail,
} from '../../types'
import { decapitalize } from '../../stringHelpers'
import { get as getExpressionApi, getAll as getExpressionsApi, getFilter as getExpressionFilterApi } from '../../api/expression'
import { get as getBlockApi, getFilter as getBlockFilterApi } from '../../api/block'
import { get as getPeriodApi } from '../../api/period'
import { getAll as getTestsApi } from '../../api/test'
import { get as getFilterApi, getFilter as getFilterFilterApi } from '../../api/filter'
import { getFilter as getCriteriasApi } from '../../api/criteria'
import { get as getBundleApi } from '../../api/bundle'
import { get as getProtocolApi } from '../../api/protocol'
import { get as getSpecialtyApi } from '../../api/specialty'

export const useAsync = (asyncFn: any, onSuccess: any, watched?: any[]) => {
  useEffect(() => {
    let isActive = true
    asyncFn().then((data: any) => {
      if (isActive) onSuccess(data)
    })
    return () => {
      isActive = false
    }
  }, watched ?? [])
}
export const wrapInBox = (child: JSX.Element) => {
  return (
    <Box
      m="75"
      p="75"
      border="1px solid lightgray"
      textAlign="left"
      borderRadius="6px"
    >
      {child}
    </Box>
  )
}
export const wrapInBoxNonContextualized = (child: JSX.Element) => {
  return (
    <Box
      m="75"
      p="25"
      border="1px solid lightgray"
      textAlign="left"
      borderRadius="6px"
    >
      {child}
    </Box>
  )
}
export const wrapError = (message: string) => {
  return (
    <Box
      w="300px"
      p="16px"
      bg="#FFFAF0"
      border="1px solid #C05621"
      textAlign="left"
      borderRadius="6px"
    >
      <Heading size="md" color="#652B19">
        Error
      </Heading>
      <Text mt="4" color="#652B19">
        {message}
      </Text>
    </Box>
  )
}
export const hashCode = (str: string) => {
  return Math.abs(
    Array.from(str).reduce(
      (hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
      0,
    ),
  ).toString()
}
export const getExpression = async (expressionId: string) => {
  try {
    const res = await getExpressionApi(expressionId)
    return res
  } catch (err) {
    throw err
  }
}
export const getBranches = async blockId => {
  try {
    const res = await getBlockFilterApi({
      filterByFormula : `SEARCH("${blockId}",{block_id})`
    })
    const record = JSON.parse(res.records[0]?.fields?.branches)
    return record
  } catch (err) {
    throw err
  }
}
export const getBlock = async (blockId: string) => {
  try {
    const res = await getBlockApi(blockId)
    return res
  } catch (err) {
    throw err
  }
}
export const getPeriod = async (periodId: string) => {
  try {
    const res = await getPeriodApi(periodId)
    return res
  } catch (err) {
    throw err
  }
}
export const getTests = async (testIds: string[]) => {
  try {
    const res = await getTestsApi()
    const records: TestData[] = res.records
    const filteredRecords = records.filter((record: TestData) =>
      testIds.includes(record.id),
    )
    return filteredRecords
  } catch (err) {
    throw err
  }
}
export const getFilterById = async (filterId) => {
  try {
    const res = await getFilterApi(filterId)
    return res
  } catch (err) {
    throw err
  }
}
export const getCriteriaForBlock = async (blockId) => {
  try {
    const res = await getCriteriasApi({
      filterByFormula: `FIND('${blockId}', {blocks})`
    })
    const records = res.records
    return records
  } catch (err) {
    throw err
  }
}
export const getExpressionsForBlock = async (blockId) => {
  try {
    const res = await getExpressionFilterApi({
      filterByFormula: `FIND('${blockId}', {blocks})`
    })
    const records = res.records
    return records
  } catch (err) {
    throw err
  }
}
export const getExpressions = async () => {
  try {
    const res = await getExpressionsApi()
    const records = res.records
    return records
  } catch (err) {
    throw err
  }
}
export const getFilters = async blockId => {
  try {
    const res = await getFilterFilterApi({
      filterByFormula: `SEARCH("${blockId}",{block_id})`
    })
    let record = ''
    if (res.records.length !== 0)
      record = JSON.parse(res.records[0]?.fields?.filters)
    return record
  } catch (err) {
    throw err
  }
}
export const getBundle = async bundleId => {
  try {
    const res = await getBundleApi(bundleId)
    return res
  } catch (err) {
    throw err
  }
}
export const getProtocol = async protocolId => {
  try {
    const res = await getProtocolApi(protocolId)
    return res
  } catch (err) {
    throw err
  }
}
export const getSpecialty = async specialtyId => {
  try {
    const res = await getSpecialtyApi(specialtyId)
    return res
  } catch (err) {
    throw err
  }
}
export const getBlocks = async (protocolId: string) => {
  try {
    const res = await getBlockFilterApi({
      filterByFormula: `SEARCH("${protocolId}",{protocol})&view=Grid%20view`
    })
    return res.records
  } catch (err) {
    throw err
  }
}
export const capitalize = (s: string) => {
  if (s.length == 0) return ''
  return s[0].toUpperCase() + (s.length > 1 ? s.slice(1) : '')
}
const yearsSinceNow = dateOld => {
  const dateNew = Date.now()
  function date2ymd(d) {
    const w = new Date(d)
    return [w.getFullYear(), w.getMonth(), w.getDate()]
  }
  function ymd2N(y) {
    return (((y[0] << 4) + y[1]) << 5) + y[2]
  } // or 60 and 60 // or 13 and 32 // or 25 and 40 //// with ...
  function date2N(d) {
    return ymd2N(date2ymd(d))
  }
  return (date2N(dateNew) - date2N(dateOld)) >> 9
}
export const evaluateCriteria = (
  initialInclusionCriteria,
  patient,
  protocolState,
) => {
  return initialInclusionCriteria.map(inclusionCriterion => {
    let { name, operator, value } = inclusionCriterion
    const operatorName = operator.name
    const isIncludesOperator = ['includes', 'contains'].includes(operatorName)
    const isNotIncludesOperator = [
      'does not include',
      'does not contain',
    ].includes(operatorName)
    const isEqualOperator = ['is', '=', '=='].includes(operatorName)
    const isGteOperator = ['≥', '>='].includes(operatorName)
    const isLteOperator = ['≤', '<='].includes(operatorName)
    const isCompOperator = ['>', '<'].includes(operatorName)
    const isNotEqualOperator = ['≠', 'is not'].includes(operatorName)
    const isRangeOperator = ['is in range'].includes(operatorName)
    const isNotRangeOperator = ['is not in range'].includes(operatorName)
    const splitValue = value.split(' to ').map(x => parseInt(x))
    if (splitValue.length == 2 && splitValue[0] == splitValue[1]) {
      value = splitValue[0].toString()
    }
    let compared: any
    if (name == 'age') {
      if (!(patient || {}).dateOfBirth) {
        return {
          result: undefined,
          name: name,
          criterion: inclusionCriterion,
        }
      }
      const age = yearsSinceNow((patient || {}).dateOfBirth)
      compared = age
      if (isRangeOperator || isNotRangeOperator) {
        value = value.split(' to ').map(x => parseInt(x))
      }
    } else if (name == 'past medical history') {
      const elicitNodeStateCollection = isIncludesOperator
        ? 'positiveFindingIds'
        : 'negativeFindingIds'
      compared =
        Object.values(protocolState.elicitNodeStates).length > 0
          ? JSON.stringify(
            Array.from(
              Object.values(protocolState.elicitNodeStates)
                .map((x: any) => x[elicitNodeStateCollection])
                .reduce((a, b) => a.concat(b)) as string[],
            ),
          )
          : JSON.stringify([])
      value = `History of ${value}`
    } else if (isRangeOperator || isNotRangeOperator) {
      value = value.split(' to ').map(x => parseInt(x))
    } else if ((patient || {})[name] === undefined) {
      return {
        result: undefined,
        name: name,
        criterion: inclusionCriterion,
      }
    } else {
      compared = (patient || {})[name]
    }
    let exp: string
    if (isEqualOperator) {
      exp = `"${compared}" == "${value}"`
    } else if (isNotEqualOperator) {
      exp = `!("${compared}" == "${value}")`
    } else if (isGteOperator) {
      exp = `${compared} > ${value} || ${compared} == ${value}`
    } else if (isLteOperator) {
      exp = `${compared} < ${value} || ${compared} == ${value}`
    } else if (isCompOperator) {
      exp = `${compared} ${operatorName} ${value}`
      // not an error, check above
    } else if (isIncludesOperator || isNotIncludesOperator) {
      exp = `${compared}.includes("${value}")`
    } else if (isRangeOperator) {
      const minVal = Math.min(value[0], value[1])
      const maxVal = Math.max(value[0], value[1])
      exp = `(${compared} > ${minVal} || ${compared} == ${minVal}) && 
               (${compared} < ${maxVal} || ${compared} == ${maxVal})`
    } else if (isNotRangeOperator) {
      const minVal = Math.min(value[0], value[1])
      const maxVal = Math.max(value[0], value[1])
      exp = `${compared} < ${minVal} && ${compared} > ${maxVal}`
    } else {
      exp = `"${compared}" ${operatorName} "${value}"`
    }
    console.log('Evaluating expression', exp)
    console.log('Expression result', eval(exp))
    return { result: eval(exp), criterion: inclusionCriterion }
  })
}
export const generateCriterionText = (
  criterionDetail: CriterionDetail,
  type,
  isContextualized,
) => {
  let text = ''
  const object = criterionDetail.units
    ? `${criterionDetail.value} ${criterionDetail.units}`
    : criterionDetail.value
  const operatorSymbol = criterionDetail.operator.symbol
  const operatorName = criterionDetail.operator.name
  if (isContextualized && type == 'filter') {
    const subject = `${criterionDetail.name} of patient`
    let verb = {
      'is': 'is',
      '=': 'is',
      '≠': 'is not',
      'is not': ['is', 'not'],
      '>': 'is greater than',
      '<': 'is less than',
      '≥': 'is greater than or equal to',
      '≤': 'is less than or equal to',
      'contains': 'includes',
      'does not contain': 'does not include',
      'is between': ['is', 'between'],
      'is in range': ['is', 'between'],
      'is not in range': ['is', 'not between'],
    }[operatorSymbol.toString()]

    if (verb === 'is' && criterionDetail.name[criterionDetail.name.length - 1] == 's') {
      verb = 'are'
    }

    const verbText = Array.isArray(verb) ? verb.join(' ') : verb
    text = `${subject} ${verbText} ${object}`
  } else {

    if (operatorSymbol === undefined) {
      throw new Error("Operator is undefined for " + operatorName)
    }

    const dict = {
      'is': ['is', ''],
      '=': ['is', ''],
      '≠': ['is', 'not'],
      'is not': ['is', 'not'],
      '>': ['is', 'greater than'],
      '<': ['is', 'less than'],
      '≥': ['is', 'greater than or equal to'],
      '≤': ['is', 'less than or equal to'],
      'contains': ['does', 'include'],
      'does not contain': ['does', 'not include'],
      'is between': ['is', 'between'],
      'is in range': ['is', 'between'],
      'is not in range': ['is', 'not between'],
    }
    let verb = dict[operatorSymbol][0]
    const adverb = dict[operatorSymbol][1]
    if (verb === 'is' && criterionDetail.name[criterionDetail.name.length - 1] == 's') {
      verb = 'are'
    }

    if (type == 'filter') {
      text = `${verb} the patient's ${decapitalize(
        criterionDetail.name,
      )} ${adverb} ${object}?`
    } else {
      text = `${adverb} ${object}`
    }
    text = text.replace(' to ', ' and ')
  }
  const capitalizedText = capitalize(text.trim())
  return capitalizedText.trim()
}
