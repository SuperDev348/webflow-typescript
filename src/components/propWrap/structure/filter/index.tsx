import React, {useEffect, useState} from 'react'
import { Text } from '@chakra-ui/react'

import Filters from './items'
import Create from './create'
import CreateFree from './createFree'
import { FilterProps, BlockData } from '../../../../types'
import { useBuilder } from '../../../../provider/builder'
import { getFilter as getBlocks, update as updateBlock } from '../../../../api/block'
import { getAll as getCriterias } from '../../../../api/criteria'

type FilterPropertyProps = {
  saveExpressions: Function
}
const Filter = (props: FilterPropertyProps) => {
  const { saveExpressions } = props
  const {builderState, dispatch} = useBuilder() 
  const [filters, setFilters] = useState<FilterProps[]>([])

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
  const updateFilterBlocks = async (element: BlockData, actions: FilterProps[]) => {
    if (!actions || !element) 
      return
    initCriterias()
    const actionsForAnd = actions.filter((action) =>
      action?.data?.condition === 'Where' || action?.data?.condition === 'and'
    )
    const operandsForAnd = actionsForAnd.map((action) => action?.data?.criteria_id)
    const actionsForOr = actions.filter((action) =>
      action?.data?.condition === 'or'
    )
    const operandsForOr = actionsForOr.map((action) => action?.data?.criteria_id)
    await updateBlock({
      records: [
        {
          id: element.id,
          fields: {
            filters: JSON.stringify([
              { operation: 'and', operands: operandsForAnd },
              { operation: 'or', operands: operandsForOr }
            ]),
            criteria: operandsForAnd.concat(operandsForOr),
          },
        },
      ],
    })
    initBlocks()
  }
  const saveFilter = (action: FilterProps[]) => {
    setFilters(action)
    if (builderState.blocks.length === 0) 
      return
    let newCards = [...builderState.cards]
    newCards = newCards.map((card) => {
      if (card.id === builderState.propertyData.id) {
        card.selectedFilters = action
        card.template = ''
        action.forEach((item, i) => {
          card.template += `${i === 0 ? '' : item?.data?.condition} ${item?.data?.system
            } \u2192 ${item?.data?.variable}/${item?.data?.value} `
        })
        card.template = card.template.replace('...', '')
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
    updateFilterBlocks(selectedBlock, action)
  }

  useEffect(() => {
    setFilters(builderState.propertyData.selectedFilters)
  }, [builderState.propertyData])
  return (
    <>
      <Text className="inputlabel">
        Add one or more conditions:{' '}
      </Text>
      <Filters filters={filters} saveFilter={saveFilter} />
      <Create filters={filters} saveFilter={saveFilter} saveExpressions={saveExpressions} />
      <CreateFree />
    </>
  )
}
export default Filter
