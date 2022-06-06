import React, { useState, useEffect } from 'react'
import { Text, Box } from '@chakra-ui/react'
import Select from 'react-dropdown-select'

import Branches from './items'
import Create from './create'
import { FilterTypes, SystemTypes, TableData, BranchProps, BlockData } from '../../../../types'
import { toTitlecase } from '../../../../service/string'
import siteConfig from '../../../../config/site.config'
import { apiGetToken } from '../../../../api/index'
import { getFilter as getBlocks, update as updateBlock } from '../../../../api/block'
import { getAll as getCriterias } from '../../../../api/criteria'
import { useBuilder } from '../../../../provider/builder'
import { Filter_System } from '../../../../data'
import { getLabel } from '../../../../service/string'

type BranchPropertyProps = {
  saveExpressions: Function
}
const Branch = (props: BranchPropertyProps) => {
  const { saveExpressions } = props
  const { builderState, dispatch } = useBuilder()
  const [selectedSystem, setSelectedSystem] = useState<SystemTypes[]>([])
  const [variables, setVariables] = useState<TableData[]>([])
  const [selectedVariables, setSelectedVariables] = useState<TableData[]>([])
  const [searchFilter, setSearchFilter] = useState('')
  const [filterTypes, setFilterTypes] = useState<FilterTypes[]>([])
  const [unit, setUnit] = useState<string>('')
  const [branches, setBranches] = useState<BranchProps[]>([])

  const insertLabel = (items) => {
    const res = items.map((item) => {
      item.fields.label = getLabel(item.fields.COMPONENT, item.fields.EXAMPLE_UNITS)
      return item
    })
    return res
  }
  const changeVariables = async (value) => {
    if (!value || value.length <= 0)
      return
    const table = Filter_System.find(({ name }) => name === value[0]?.name)?.name
    if (!table)
      return
    const url = `${siteConfig.airtableUrl}/${siteConfig.ioincId}/${table}`
    const res = await apiGetToken(url)
    setVariables(insertLabel(res.records))
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
  const initCriterias = async () => {
    const res = await getCriterias()
    let tmp = res?.records
    tmp = tmp.map((item) => {
      return item?.fields
    })
    dispatch({ type: 'SET', settingName: 'criterias', settingData: tmp })
  }
  const initBlocks = async () => {
    const res = await getBlocks({
      filterByFormula: `SEARCH("${builderState.protocolId}",{protocol})`
    })
    dispatch({ type: 'SET', settingName: 'blocks', settingData: res.records as BlockData[] })
  }
  const updateBranchBlocks = async (element: BlockData, actions: BranchProps[]) => {
    if (!actions || !element) 
      return
    initCriterias()
    const criteria = actions.map((action) => {
      return action?.data?.criteria_id
    })
    await updateBlock({
      records: [
        {
          id: element.id,
          fields: {
            branches: JSON.stringify(criteria),
            criteria: criteria,
          },
        },
      ]
    })
    initBlocks()
  }
  const saveBranch = (action: BranchProps[]) => {
    setBranches(action)
    if (builderState.blocks.length === 0) 
      return
    let newCards = [...builderState.cards]
    newCards = newCards.map((card) => {
      if (card.id === builderState.propertyData.id) {
        card.selectedBranches = action
        card.template = ''
        action.forEach((item) => {
          card.template += `${item.data.system}, `
        })
        if (card.template.length > 2)
          card.template = card.template.slice(0, -2)
      }
      return card
    })
    dispatch({ type: 'SET', settingName: 'cards', settingData: newCards })
    const newBlocks = [...builderState.blocks]
    const selectedBlock = newBlocks.find(
      ({ id }) => id === builderState.propertyData.savedId,
    )
    if (!selectedBlock) 
      return
    updateBranchBlocks(selectedBlock, action)
  }
  const onSearch = ({ state }) => {
    if (searchFilter === state.search)
      return
    if (selectedSystem.length <= 0)
      return
    state.search = toTitlecase(state.search)
    const formulaText = `?filterByFormula=${encodeURIComponent(
      `FIND('${state.search}',{COMPONENT})`,
    )}`
    const url = `${siteConfig.airtableUrl}/${siteConfig.ioincId}/${selectedSystem[0].name}${formulaText}`
    apiGetToken(url).then((res) => {
      setVariables(insertLabel(res.records))
    })
    setSearchFilter(state.search)
    return null
  }
  const handleChangeSystem = (value) => {
    setSelectedSystem(value)
    changeVariables(value)
  }
  const handleChangeVariable = (value) => {
    if ( selectedVariables?.length !== 0 && value?.length !== 0 && selectedVariables[0].id === value[0].id) {
      return
    }
    setSelectedVariables(value)
    changeFilter(value)
    if (selectedSystem[0])
      saveExpressions(selectedSystem[0], value[0])
  }

  useEffect(() => {
    setSelectedSystem(builderState.propertyData.selectedBranchPoint)
    changeFilter(builderState.propertyData.selectedBranchVariable)
    setSelectedVariables(insertLabel(builderState.propertyData.selectedBranchVariable))
    setBranches(builderState.propertyData.selectedBranches)
  }, [builderState.propertyData])
  return (
    <>
      <Text className="inputlabel" style={{ marginTop: '10px' }}>{builderState?.propertyData?.templateTitle}</Text>
      <Box className="select-condition">
        <span style={{ width: '75px' }}>System: </span>
        <Select
          className="addfilterselect"
          style={{ width: '260px' }}
          options={Filter_System}
          values={selectedSystem}
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
          values={selectedVariables}
          disabled={selectedSystem?.length > 0 ? false : true}
          searchable
          searchBy="fields.label"
          searchFn={onSearch}
          placeholder={
            selectedSystem?.length > 0 &&
              variables?.length > 0
              ? "Select..."
              : "Loading..."
          }
          onChange={handleChangeVariable}
          labelField="fields.label"
          valueField="id"
        />
      </Box>
      <Branches branches={branches} saveBranch={saveBranch} />
      <Create 
        filterTypes={filterTypes} 
        selectedSystem={selectedSystem} 
        variables={variables}
        selectedVariables={selectedVariables}
        unit={unit} 
        branches={branches}
        saveBranch={saveBranch} 
      />
    </>
  )
}
export default Branch