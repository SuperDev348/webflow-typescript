import React, { useState, useEffect } from 'react'
import Select from 'react-dropdown-select'
import { Box, Text, Textarea } from '@chakra-ui/react'

import {
  AIRTABLE_URL,
  BASE_ID,
  TABLES_LOINC,
  TABLES_CAREBUNDLES,
} from '../Globals'
import { apiGetToken } from '../api/index'

type BaseIDType = {
  id: string
  name: string
}
type FieldType = {
  id: string
  name: string
}
type TableType = {
  id: string
  name: string
  fields: FieldType[]
}
const CustomSelect = () => {
  const [selectedBase, setSelectedBase] = useState<BaseIDType[]>([])
  const [selectedTable, setSelectedTable] = useState<TableType[]>([])
  const [selectedField, setSelectedField] = useState<FieldType[]>([])
  const [maxRecords, setMaxRecords] = useState<string>('')
  const [pageSize, setPageSize] = useState<string>('')
  const [formulaFilter, setFormulaFilter] = useState<string>('')
  const [selectableTables, setSelectableTables] = useState<TableType[]>([])
  const [selectableFields, setSelectableFields] = useState<FieldType[]>([])
  const [backendApiURL, setBackendApiURL] = useState<string>('')

  const changeBaseID = (value: BaseIDType[]) => {
    if (!value) return

    setSelectedBase(value)
    if (value[0].name === 'LOINC') {
      setSelectableTables(TABLES_LOINC)
    } else if (value[0].name === 'Care Bundles') {
      setSelectableTables(TABLES_CAREBUNDLES)
    }
  }

  const changeTable = (value: TableType[]) => {
    if (!value) return
    if (!selectedBase) return

    setSelectedTable(value)
    if (selectedBase[0].name === 'LOINC') {
      setSelectableFields(
        TABLES_LOINC.find(table => table?.id === value[0]?.id)?.fields,
      )
    } else if (selectedBase[0].name === 'AirTable') {
      setSelectableFields(
        TABLES_CAREBUNDLES.find(table => table?.id === value[0]?.id)?.fields,
      )
    }
  }

  const searchResult = async () => {
    if (!selectedBase[0] || !selectedTable[0]) return

    let baseURL = `${AIRTABLE_URL}/${selectedBase[0].id}/${selectedTable[0].id}`

    let addedURL: string[] = []
    if (formulaFilter !== '') {
      const filterByFormula = `FIND("${formulaFilter}", {COMPONENT})`
      let addUrl = `filterByFormula=${encodeURIComponent(filterByFormula)}`;
      if (selectedBase[0].name === 'LOINC')
        addUrl += "&view=Grid%20view";
      addedURL.push(addUrl)
    }
    if (selectedField.length > 0) {
      let tempFields = ''
      for (let i = 0; i < selectedField.length; i++) {
        tempFields += `fields%5B%5D=${selectedField[i].name}&`
      }
      tempFields = tempFields.slice(0, -1)
      addedURL.push(tempFields)
    }
    if (maxRecords !== '') {
      addedURL.push(`maxRecords=${maxRecords}`)
    }
    if (pageSize !== '') {
      addedURL.push(`pageSize=${pageSize}`)
    }

    if (addedURL.length > 0) {
      baseURL += '?' + addedURL.join('&')
    }

    setBackendApiURL(baseURL)
    await apiGetToken(baseURL)
      .then((res: any) => {
        console.log(res.data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  useEffect(() => {
    setSelectedTable([])
  }, [selectedBase])

  useEffect(() => {
    searchResult()
  }, [
    selectedBase,
    selectedTable,
    selectedField,
    formulaFilter,
    maxRecords,
    pageSize,
  ])

  return (
    <Box pt="50px" pb="50px" pl="300px" pr="300px">
      <Text>Base Id</Text>
      <Select
        className="custom-select"
        options={BASE_ID}
        values={selectedBase}
        onChange={value => {
          changeBaseID(value)
        }}
        labelField="name"
        valueField="id"
      />
      <Text>Table</Text>
      <Select
        className="custom-select"
        options={selectableTables}
        values={selectedTable}
        onChange={value => {
          changeTable(value)
        }}
        labelField="name"
        valueField="id"
      />
      <Text>Filter...</Text>
      <Textarea
        style={{ width: '100%' }}
        minrows={3}
        placeholder="Write custom text here..."
        value={formulaFilter}
        onChange={event => setFormulaFilter(event.target.value)}
      ></Textarea>
      <Text>Fields</Text>
      <Select
        className="custom-select"
        options={selectableFields}
        values={selectedField}
        multi
        onChange={value => {
          setSelectedField(value)
        }}
        labelField="name"
        valueField="id"
      />
      <Text>Max Records</Text>
      <input
        type="text"
        onChange={event => {
          setMaxRecords(event.target.value)
        }}
      />
      <Text>Page Size</Text>
      <input
        type="text"
        onChange={event => {
          setPageSize(event.target.value)
        }}
      />
      <Text>{backendApiURL}</Text>
    </Box>
  )
}

export default CustomSelect
