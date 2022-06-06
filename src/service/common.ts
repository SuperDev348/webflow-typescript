import { FilterProps } from "../types"

export const extractBundleFields = (actionName: string, actionInclusion: FilterProps[], actionExclusion: FilterProps[]) => {
  const actionsForAndIn = actionInclusion.filter((action) =>
    action?.data?.condition === 'Where' || action?.data?.condition === 'and'
  )
  const operandsForAndIn = actionsForAndIn.map((action) => action?.data?.criteria_id)
  const actionsForOrIn = actionInclusion.filter((action) =>
    action?.data?.condition === 'or'
  )
  const operandsForOrIn = actionsForOrIn.map((action) => action?.data?.criteria_id)
  const actionsForAndEx = actionExclusion.filter((action) =>
    action?.data?.condition === 'Where' || action?.data?.condition === 'and'
  )
  const operandsForAndEx = actionsForAndEx.map((action) => action?.data?.criteria_id)
  const actionsForOrEx = actionExclusion.filter((action) =>
    action?.data?.condition === 'or'
  )
  const operandsForOrEx = actionsForOrEx.map((action) => action?.data?.criteria_id)
  const fields = {
    name: actionName,
    protocols: [],
    // expressions_inclusion: tempInclusionExpression,
    // expressions_exclusion: tempExclusionExpression,
    filters_inclusion: JSON.stringify([
      { operator: 'and', operands: operandsForAndIn },
      { operator: 'or', operands: operandsForOrIn }
    ]),
    filters_exclusion: JSON.stringify([
      { operator: 'and', operands: operandsForAndEx },
      { operator: 'or', operands: operandsForOrEx }
    ]),
  }
  return fields
}
export const formatAirtableResults = (data: any) => {
  return data.records.map((item: any) => {
    return formatAirtableResult(item)
  })
}
export const formatAirtableResult = (data: any) => {
  const { id, fields } = data
  let formatted: any = { id }
  const capitalize = (s: string) => {
    if (s.length == 0) return ''
    return s[0].toUpperCase() + (s.length > 1 ? s.slice(1) : '')
  }
  for (let key in fields) {
    const camelCaseKey = key
      .split('_')
      .map((x, i) => (i ? capitalize(x) : x))
      .join('')
    formatted[camelCaseKey] = fields[key]
  }
  return formatted
}