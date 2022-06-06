import React, { useState, forwardRef, useImperativeHandle } from 'react'
import {
  Box,
  Button,
  Text,
  Heading,
  Input,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { NotificationManager } from 'react-notifications'

import FilterItem from '../../../FilterItem'
import AddCondition from './addCondition'
import { FilterProps } from '../../../../types'
import { extractBundleFields } from '../../../../service/common'
import { useBuilder } from '../../../../provider/builder'
import { getAll as getCriterias } from '../../../../api/criteria'
import { getAll as getBundles, create as createBundle } from '../../../../api/bundle'

type CreateProps = {
  isShow: boolean
  setIsShow: Function
  showInit: Function
  saveExpressions: Function
}
export interface CreateFunctionInterface {
  save(): void;
}
const Create = forwardRef<CreateFunctionInterface, CreateProps>((props, ref) => {
  const { isShow, setIsShow, showInit, saveExpressions } = props
  const { dispatch } = useBuilder()
  const [name, setName] = useState('')
  const [inclusionFilters, setInclusionFilters] = useState<FilterProps[]>([])
  const [exclusionFilters, setExclusionFilters] = useState<FilterProps[]>([])

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
  const handleAdd = () => {
    showInit()
    setIsShow(!isShow)
  }

  useImperativeHandle(ref, () => ({
    async save() {
      if (name === '') {
        NotificationManager.warning('warning', 'Please input name', 3000);
        return
      }
      initCriterias()
      const fields = extractBundleFields(name, inclusionFilters, exclusionFilters)
      await createBundle({
        records: [{ fields: fields }]
      })
      initBundles()
    }
  }))
  return (
    <>
      <Button w="100%" colorScheme="blue" onClick={handleAdd}>
        <AddIcon />
        <Text ml="4">Create a new bundle</Text>
      </Button>
      {isShow &&
        <>
          <Box
            h="1px"
            w="100%"
            borderBottom="1px solid lightgray"
            mt="32px"
          ></Box>
          <Heading size="md" mb="16px" mt="24px">
            Create bundle
          </Heading>
          <Box mt="8px">
            <Box>
              <Text className="inputlabel">Name: </Text>
              <Input
                mt="8px"
                type="text"
                className="createbundlename"
                value={name}
                onChange={event =>
                  setName(event.target.value)
                }
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
              <Text className="inputlabel" style={{ marginTop: 16 }}>Exclusion criteria:</Text>
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
        </>
      }
    </>
  )
})
export default Create
