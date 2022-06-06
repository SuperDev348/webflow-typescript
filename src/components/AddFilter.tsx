import React, { useState } from 'react'
import Select from 'react-dropdown-select'
import { Box, Button } from '@chakra-ui/react'
import {
  FilterProps,
  SelectTypes,
  ExpressionTypes,
  FilterTypes,
} from '../types'
import { Filter_Conditions } from '../data'

type AddFilterProps = {
  filters: FilterProps[]
  expressions: ExpressionTypes[]
  qn_filters: FilterTypes[]
  nom_filters: FilterTypes[]
  date_filters: FilterTypes[]
  set_filters: FilterTypes[]
  ord_filters: FilterTypes[]
  onFilterSave: Function
}

const AddFilter = (props: AddFilterProps) => {
  const {
    filters,
    expressions,
    qn_filters,
    nom_filters,
    date_filters,
    set_filters,
    ord_filters,
  } = props
  const [selectedFilterCondition, setSelectedFilterCondition] = useState<
    SelectTypes[]
  >([])
  const [selectedFilterName, setSelectedFilterName] =
    useState<ExpressionTypes[]>()
  const [selectedFilterFilter, setSelectedFilterFilter] = useState<
    FilterTypes[]
  >([])
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>('')
  const [selectedFilterSecondValue, setSelectedFilterSecondValue] =
    useState<string>('')
  const [selectableFilters, setSelectableFilters] = useState<FilterTypes[]>([])

  const changeBranchPoint = (value: any) => {
    setSelectedFilterFilter([])
    if (value && value.length > 0) {
      switch (value[0].type) {
        case 'float':
          setSelectableFilters(qn_filters)
          break
        case 'integer':
          setSelectableFilters(qn_filters)
          break
        case 'string':
          setSelectableFilters(nom_filters)
          break
        case 'time':
          setSelectableFilters(date_filters)
          break
        case 'array':
          setSelectableFilters(set_filters)
          break
        default:
          setSelectableFilters([])
      }
    }
  }

  const onFilterCancel = () => {
    setSelectedFilterCondition([])
    setSelectedFilterName([])
    setSelectedFilterFilter([])
    setSelectedFilterValue('')
    setSelectedFilterSecondValue('')
  }

  const onFilterSave = () => {
    if (
      selectedFilterName === [] ||
      selectedFilterFilter === [] ||
      selectedFilterValue === '' ||
      (selectedFilterFilter[0].fields.name.includes('between') &&
        selectedFilterSecondValue === '')
    ) {
      return
    }
    props.onFilterSave(
      selectedFilterCondition,
      selectedFilterName,
      selectedFilterFilter,
      selectedFilterValue,
      selectedFilterSecondValue,
    )
    setSelectedFilterCondition([])
    setSelectedFilterName([])
    setSelectedFilterFilter([])
    setSelectedFilterValue('')
    setSelectedFilterSecondValue('')
  }

  return (
    <>
      <Box className="selectgroup">
        {filters.length === 0 ? (
          <span className="addfilterstatic">Where</span>
        ) : (
          <Select
            className="addfilterselect"
            style={{ width: '53px' }}
            options={Filter_Conditions}
            values={selectedFilterCondition}
            onChange={value => {
              setSelectedFilterCondition(value)
            }}
            labelField="name"
            valueField="id"
          />
        )}
        <Select
          className="addfilterselect"
          style={{ width: '119px' }}
          options={expressions}
          values={selectedFilterName}
          onChange={value => {
            setSelectedFilterName(value)
            changeBranchPoint(value)
          }}
          labelField="name"
          valueField="expression_id"
        />
        <Select
          className="addfilterselect"
          style={{ width: '110px' }}
          options={selectableFilters}
          values={selectedFilterFilter}
          onChange={value => {
            setSelectedFilterFilter(value)
          }}
          labelField="name"
          valueField="id"
        />
        {selectedFilterFilter[0]?.fields.name?.includes('between') ? (
          <>
            <input
              type="text"
              style={{ width: '60px' }}
              onChange={event => setSelectedFilterValue(event.target.value)}
            />
            <input
              type="text"
              style={{ width: '60px' }}
              onChange={event =>
                setSelectedFilterSecondValue(event.target.value)
              }
            />
          </>
        ) : (
          <input
            type="text"
            style={{ width: '120px' }}
            onChange={event => setSelectedFilterValue(event.target.value)}
          />
        )}
      </Box>
      <Box display="flex" float="right" mt="4">
        <Button colorScheme="gray" onClick={onFilterCancel}>
          Cancel
        </Button>
        <Button colorScheme="blue" ml="4" onClick={onFilterSave}>
          Save
        </Button>
      </Box>
    </>
  )
}

export default AddFilter
