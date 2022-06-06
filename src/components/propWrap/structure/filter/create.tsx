import React, { useState } from 'react'
import { Text, Box, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import Select from 'react-dropdown-select'

import siteConfig from '../../../../config/site.config'
import { Filter_Conditions, Filter_System } from '../../../../data'
import { FilterTypes, SelectTypes, SystemTypes, TableData, FilterProps } from '../../../../types'
import { useBuilder } from '../../../../provider/builder'
import { getLabel, toTitlecase } from '../../../../service/string'
import { apiGetToken } from '../../../../api/index'
import { create as createCriteria } from '../../../../api/criteria'

type AddConditionProps = {
  filters: FilterProps[]
  saveFilter: Function
  saveExpressions: Function
}
const AddCondition = (props: AddConditionProps) => {
  const { filters, saveFilter, saveExpressions } = props
  const { builderState } = useBuilder()
  const [isShow, setIsShow] = useState<boolean>(false)
  const [condition, setCondition] = useState<SelectTypes[]>([])
  const [system, setSystem] = useState<SystemTypes[]>([])
  const [filterTypes, setFilterTypes] = useState<FilterTypes[]>([])
  const [filterType, setFilterType] = useState<FilterTypes[]>([])
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [variables, setVariables] = useState<TableData[]>([])
  const [variable, setVariable] = useState<TableData[]>([])
  const [unit, setUnit] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [secondValue, setSecondValue] = useState<string>('')

  const changeVariables = async (value: any) => {
    setFilterTypes([])
    if (!value || value.length <= 0)
      return
    const tableURL = Filter_System.find(({ name }) => name === value[0]?.name)?.name
    if (!tableURL)
      return
    const url = `${siteConfig.airtableUrl}/${siteConfig.ioincId}/${tableURL}`
    const res = await apiGetToken(url)
    let selectOptions = res.records
    selectOptions = selectOptions.map((item) => {
      item.fields.label = getLabel(item.fields.COMPONENT, item.fields.EXAMPLE_UNITS)
      return item
    })
    setVariables(selectOptions)
  }
  const changeFilter = (value: any) => {
    if (!value || value.length <= 0) {
      setFilterTypes([])
      setUnit('')
    } else {
      setUnit(value[0].fields.EXAMPLE_UNITS)
      if (value[0].fields.SCALE_TYP === 'Nom') {
        setFilterTypes(builderState.filters.nom)
      } else if (value[0].fields.SCALE_TYP === 'Set') {
        setFilterTypes(builderState.filters.set)
      } else if (value[0].fields.SCALE_TYP === '-') {
        setFilterTypes(builderState.filters.set)
      } else if (value[0].fields.SCALE_TYP === 'Qn') {
        if (value[0].fields.PROPERTY === 'Date') {
          setFilterTypes(builderState.filters.date)
        } else {
          setFilterTypes(builderState.filters.qn)
        }
      } else if (value[0].fields.SCALE_TYP === 'Ord') {
        setFilterTypes(builderState.filters.ord)
      }
    }
  }
  const onSearch = ({ state }) => {
    if (searchFilter === state.search)
      return
    if (system.length <= 0)
      return
    state.search = toTitlecase(state.search)
    const formulaText = `?filterByFormula=${encodeURIComponent(
      `FIND('${state.search}',{COMPONENT})`,
    )}`
    const url = `${siteConfig.airtableUrl}/${siteConfig.ioincId}/${system[0].name}${formulaText}`
    apiGetToken(url).then((res) => {
      let tmpVariables = res.records
      tmpVariables = tmpVariables.map((item) => {
        item.fields.label = getLabel(item.fields.COMPONENT, item.fields.EXAMPLE_UNITS)
        return item
      }).sort((a, b) => {
        return a.fields.label.length - b.fields.label.length
      })
      setVariables(tmpVariables)
    })
    setSearchFilter(state.search)
    return null
  }
  const init = () => {
    setCondition([])
    setSystem([])
    setFilterType([])
    setVariable([])
    setVariables([])
    setValue('')
    setSecondValue('')
    setUnit('')
    setIsShow(false)
  }
  const handleChangeSystem = (value) => {
    setSystem(value)
    changeVariables(value)
  }
  const handleChangeVariable = (value) => {
    if (variable?.length !== 0 && value?.length !== 0 && variable[0].id === value[0].id) {
      return
    }
    setVariable(value)
    changeFilter(value)
    if (system[0])
      saveExpressions(system[0], value[0])
  }
  const handleCancel = () => {
    init()
  }
  const handleSave = async () => {
    if (
      (filters.length > 0 && condition.length === 0) ||
      system.length === 0 ||
      variable.length === 0 ||
      filterType.length === 0
    ) {
      return
    }
    const tempFilter: FilterProps = {
      id: filters.length + 1,
      data: {
        condition: condition[0]
          ? condition[0].name
          : 'Where',
        system: system[0].name,
        variable: variable[0].fields.COMPONENT,
        filter: filterType[0].fields.name,
        value: `${value}${secondValue === '' ? '' : ` - ${secondValue}`}`,
        units: unit,
        criteria_id: '',
      },
    }
    let tempCriteria = {
      expression: [],
      filter: [filterType[0].id],
      value: tempFilter.data.value,
    }
    for (let i = 0; i < builderState.expressions.length; i++) {
      if (
        builderState.expressions[i].system === tempFilter.data.system &&
        builderState.expressions[i].component === tempFilter.data.variable
      ) {
        tempCriteria.expression.push(builderState.expressions[i].id)
        break
      }
    }
    if (tempCriteria.expression.length === 0)
      return
    const data = {
      records: [
        {
          fields: tempCriteria,
        },
      ],
    }
    const res = await createCriteria({ records: [{ fields: tempCriteria }] })
    tempFilter.data.criteria_id = res.records[0].id
    init()
    saveFilter([...filters, tempFilter])
  }

  return (
    <>
      <Box mt="4">
        <Button
          style={{ width: '100%' }}
          colorScheme="blue"
          onClick={() => setIsShow(!isShow)}
        >
          <AddIcon size="md" />
          <Text ml="4">Add a new condition</Text>
        </Button>
      </Box>
      {isShow && (
        <>
          {filters.length > 0 && (
            <Box className="select-condition">
              <span style={{ width: '75px' }}>Condition: </span>
              <Select
                className="addfilterselect"
                style={{ width: '260px' }}
                options={Filter_Conditions}
                values={condition}
                onChange={value => { setCondition(value) }}
                labelField="name"
                valueField="id"
              />
            </Box>
          )}
          <Box className="select-condition">
            <span style={{ width: '75px' }}>System: </span>
            <Select
              className="addfilterselect"
              style={{ width: '260px' }}
              options={Filter_System}
              values={system}
              onChange={handleChangeSystem}
              labelField="name"
              valueField="id"
            />
          </Box>
          <Box className="select-condition">
            <span style={{ width: '75px' }}>Variable: </span>
            <Select
              className="bs Variable"
              style={{
                width: '260px',
                height: '100%',
                marginLeft: '8px',
              }}
              options={variables}
              values={variable}
              disabled={
                system.length > 0 ? false : true
              }
              searchable
              searchBy="fields.label"
              searchFn={onSearch}
              placeholder={
                variables.length > 0
                  ? "Select..."
                  : "Loading..."
              }
              onChange={value => handleChangeVariable(value)}
              labelField="fields.label"
              valueField="id"
            />
          </Box>
          <Box className="select-condition">
            <span style={{ width: '75px' }}>Filter: </span>
            <Select
              className="addfilterselect"
              style={{ width: '260px' }}
              options={filterTypes}
              values={filterType}
              disabled={
                system.length > 0 ? false : true
              }
              onChange={value => { setFilterType(value) }}
              labelField="fields.name"
              valueField="id"
            />
          </Box>
          <Box className="selectgroup">
            {!filterType[0]?.fields.scale_types?.includes(
              'Ord',
            ) && (
                <>
                  <span style={{ width: '75px' }}>Value: </span>
                  {filterType[0]?.fields.name?.includes(
                    'between',
                  ) ? (
                    <>
                      <input
                        type="text"
                        style={{ width: '115px', padding: '3px' }}
                        onChange={event => setValue(event.target.value)}
                      />
                      <span style={{ padding: '3px' }}>&nbsp;to</span>
                      <input
                        type="text"
                        style={{ width: '115px', padding: '3px' }}
                        onChange={event => setSecondValue(event.target.value)}
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      style={{ width: '260px', padding: '5px' }}
                      onChange={event => setValue(event.target.value)}
                    />
                  )}
                </>
              )}
          </Box>
          {!filterType[0]?.fields.scale_types?.includes(
            'Ord',
          ) &&
            unit !== '' && (
              <Box className="select-condition">
                <span style={{ width: '75px' }}>Units: </span>
                <Text p="5px">{unit}</Text>
              </Box>
            )}
          <Box display="flex" float="right" my="4">
            <Button
              colorScheme="gray"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              ml="4"
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </>
      )}
    </>
  )
}
export default AddCondition
