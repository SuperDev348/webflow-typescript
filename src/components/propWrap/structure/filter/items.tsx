import React from 'react'

import FilterItem from '../../../FilterItem'
import { FilterProps } from '../../../../types'

type FilterItemsProps = {
  filters: FilterProps[]
  saveFilter: Function
}
const Filters = (props: FilterItemsProps) => {
  const {filters, saveFilter} = props

  const deleteFilter = (id: number) => {
    const newFilters = [...filters]
    const resultFilters = newFilters.filter(filter => filter.id !== id)
    saveFilter(resultFilters)
  }
  return (
    <>
      {filters.length > 0 &&
        filters.map(filter => {
          return (
            <FilterItem
              key={filter.id}
              type=""
              data={filter}
              deleteFilter={deleteFilter}
              maxWidth={370}
            />
          )
        })}
    </>
  )
}
export default Filters
