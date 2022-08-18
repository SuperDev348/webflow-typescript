import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import {
  Box,
  Text,
  Heading,
  Input,
} from '@chakra-ui/react'

import FilterItem from '../../../FilterItem'
import AddCondition from './addCondition'
import { FilterProps } from '../../../../types'
import { useBuilder } from '../../../../provider/builder'
import { extractBundleFields } from '../../../../service/common'
import { getAll as getCriterias } from '../../../../api/criteria'
import { getAll as getBundles, update as updateBundle } from '../../../../api/bundle'

type EditProps = {
  bundleId: string
  saveExpressions: Function
}
export interface EditFunctionInterface {
  save(): void;
}
const Edit = forwardRef<EditFunctionInterface, EditProps>((props, ref) => {
  const { bundleId, saveExpressions } = props
  const { builderState, dispatch } = useBuilder()
  const [name, setName] = useState('')
  const [inclusionFilters, setInclusionFilters] = useState<FilterProps[]>([])
  const [exclusionFilters, setExclusionFilters] = useState<FilterProps[]>([])

  const getFilters = (filterString: string): FilterProps[] => {
    const tmp = JSON.parse(filterString)
    let tmpFilters = []
    for (let i = 0; i < tmp[0].operands.length; i++) {
      let tempCriteria = builderState.criterias.find(
        ({ id }) => id === tmp[0].operands[i],
      )
      if (tempCriteria) {
        tmpFilters.push({
          condition: i === 0 ? 'Where' : 'and',
          system: tempCriteria._expression_name[0].split('/')[1],
          variable: tempCriteria._expression_name[0].split('/')[2],
          filter: tempCriteria._filter_name[0],
          value: tempCriteria.value,
          units: tempCriteria._expression_units,
          criteria_id: tempCriteria.criterion_id,
        })
      }
    }
    for (let i = 0; i < tmp[1].operands.length; i++) {
      let tempCriteria = builderState.criterias.find(
        ({ id }) => id === tmp[1].operands[i],
      )
      if (tempCriteria) {
        tmpFilters.push({
          condition: 'or',
          system: tempCriteria._expression_name[0].split('/')[1],
          variable: tempCriteria._expression_name[0].split('/')[2],
          filter: tempCriteria._filter_name[0],
          value: tempCriteria.value,
          units: tempCriteria._expression_units,
          criteria_id: tempCriteria.criterion_id,
        })
      }
    }
    let res: FilterProps[] = []
    for (let i = 0; i < tmpFilters.length; i++) {
      res.push({
        id: i + 1,
        data: {
          condition: tmpFilters[i].condition,
          system: tmpFilters[i].system,
          variable: tmpFilters[i].variable,
          filter: tmpFilters[i].filter,
          value: tmpFilters[i].value,
          units: tmpFilters[i].units
            ? tmpFilters[i].units
            : '',
          criteria_id: tmpFilters[i].criteria_id,
        },
      })
    }
    return res
  }
  const initCriterias = async () => {
    const res = await getCriterias()
    let tmp = res?.records
    tmp = tmp.map((item) => {
      return item?.fields
    })
    dispatch({ type: 'SET', settingName: 'criterias', settingData: tmp })
  }
  const initBundles = async () => {
    const res = await getBundles()
    dispatch({ type: 'SET', settingName: 'bundles', settingData: res.records })
  }
  const deleteFilter = (id: number, type: string) => {
    if (type === 'Inclusion') {
      const newFilters = [...inclusionFilters]
      const resultFilters = newFilters.filter(filter => filter.id !== id)
      setInclusionFilters(resultFilters)
    } else if (type === 'Exclusion') {
      const newFilters = [...exclusionFilters]
      const resultFilters = newFilters.filter(filter => filter.id !== id)
      setExclusionFilters(resultFilters)
    }
  }

  useImperativeHandle(ref, () => ({
    async save() {
      initCriterias()
      const fields = extractBundleFields(name, inclusionFilters, exclusionFilters)
      await updateBundle({
        records: [{ id: bundleId, fields: fields }]
      })
      initBundles()
    }
  }))
  useEffect(() => {
    if (bundleId !== '') {
      const bundle = builderState.bundles.find(({ id }) => id === bundleId)
      if (!bundle)
        return
      setName(bundle.fields.name)
      setInclusionFilters(getFilters(bundle.fields.filters_inclusion))
      setExclusionFilters(getFilters(bundle.fields.filters_exclusion))
    }
  }, [bundleId])
  return (
    <>
      <Box
        h="1px"
        w="100%"
        borderBottom="1px solid lightgray"
        mt="32px"
      ></Box>
      <Heading size="md" mb="16px" mt="24px">
        Edit pathway
      </Heading>
      <Box mt="8px">
        <Box>
          <Text className="inputlabel">Name: </Text>
          <Input
            mt="8px"
            type="text"
            className="createbundlename"
            value={name}
            onChange={event => setName(event.target.value)}
            border="1px solid lightgray"
          />
        </Box>
        <Box mt="16px">
          <Text className="inputlabel">Inclusion criteria:</Text>
          <Box>
            {inclusionFilters.length > 0 &&
              inclusionFilters.map(filter => {
                return (
                  <FilterItem
                    key={filter.id}
                    type="Inclusion"
                    data={filter}
                    deleteFilter={deleteFilter}
                  />
                )
              })}
          </Box>
          <AddCondition filters={inclusionFilters} setFilters={setInclusionFilters} saveExpressions={saveExpressions} />
          <Text className="inputlabel">Exclusion criteria:</Text>
          <Box>
            {exclusionFilters.length > 0 &&
              exclusionFilters.map(filter => {
                return (
                  <FilterItem
                    key={filter.id}
                    type="Exclusion"
                    data={filter}
                    deleteFilter={deleteFilter}
                  />
                )
              })}
          </Box>
          <AddCondition filters={exclusionFilters} setFilters={setExclusionFilters} saveExpressions={saveExpressions} />
        </Box>
      </Box>
      <Box
        h="1px"
        w="100%"
        borderBottom="1px solid lightgray"
        mt="40px"
      ></Box>
    </>
  )
})
export default Edit
