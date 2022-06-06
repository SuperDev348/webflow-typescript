import React, {useState} from 'react'
import { Text, Box, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import Select from 'react-dropdown-select'

import { FilterTypes, BranchProps, SystemTypes, TableData } from '../../../../types'
import { useBuilder } from '../../../../provider/builder'
import { create as createCriteria } from '../../../../api/criteria'

type AddConditionProps = {
  filterTypes: FilterTypes[]
  selectedSystem: SystemTypes[]
  variables: TableData[]
  selectedVariables: TableData[]
  unit: string
  branches: BranchProps[]
  saveBranch: Function
}
const AddCondition = (props: AddConditionProps) => {
  const {filterTypes, selectedSystem, variables, selectedVariables, unit, branches, saveBranch} = props
  const {builderState} = useBuilder()
  const [isShow, setIsShow] = useState<boolean>(false)
  const [filterType, setFilterType] = useState<FilterTypes[]>([])
  const [value, setValue] = useState<string>('')
  const [secondeValue, setSecondValue] = useState<string>('')

  const handleCancel = () => {
    setFilterType([])
    setValue('')
    setSecondValue('')
    setIsShow(false)
  }
  const handleSave = async () => {
    if (selectedSystem.length === 0 || variables.length === 0 || filterTypes.length === 0)
      return
    const newBranches = [...branches]
    const lastId = newBranches.length === 0 ? 0 : newBranches[newBranches.length - 1].id
    const tempBranch: BranchProps = {
      id: lastId + 1,
      data: {
        system: selectedSystem[0].name,
        variable: selectedVariables[0].fields.COMPONENT,
        filter: filterType[0].fields.name,
        value: `${value}${secondeValue === '' ? '' : ` - ${secondeValue}`}`,
        units: unit,
        criteria_id: '',
      },
    }
    let tempCriteria = {
      expression: [],
      filter: [filterType[0].id],
      value: tempBranch.data.value,
    }
    for (let i = 0; i < builderState.expressions.length; i++) {
      if (
        builderState.expressions[i].system === tempBranch.data.system &&
        builderState.expressions[i].component === tempBranch.data.variable
      ) {
        tempCriteria.expression.push(builderState.expressions[i].id)
        break
      }
    }
    if (tempCriteria.expression.length === 0)
      return
    const res = await createCriteria({ records: [{ fields: tempCriteria }] })
    tempBranch.data.criteria_id = res.records[0].id
    setFilterType([])
    setValue('')
    setSecondValue('')
    setIsShow(false)
    saveBranch([...newBranches, tempBranch])
  }
  
  return (
    <>
      <Box mt="4">
        <Button
          style={{ width: '100%' }}
          colorScheme="blue"
          onClick={() => setIsShow(!isShow)}
        >
          <AddIcon />
          <Text ml="4">Add a new condition</Text>
        </Button>
      </Box>
      {isShow && (
        <>
          <Box className="select-condition">
            <span style={{ width: '75px' }}>Filter: </span>
            <Select
              className="addfilterselect"
              style={{ width: '260px' }}
              options={filterTypes}
              values={filterType}
              disabled={
                selectedSystem.length > 0 &&
                  filterTypes.length > 0
                  ? false
                  : true
              }
              onChange={value => {
                setFilterType(value)
              }}
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
                        onChange={event =>
                          setValue(event.target.value)
                        }
                      ></input>
                      <span style={{ padding: '3px' }}>&nbsp;to</span>
                      <input
                        type="text"
                        style={{ width: '115px', padding: '3px' }}
                        onChange={event =>
                          setSecondValue(
                            event.target.value,
                          )
                        }
                      ></input>
                    </>
                  ) : (
                    <input
                      type="text"
                      style={{ width: '260px', padding: '5px' }}
                      onChange={event =>
                        setValue(event.target.value)
                      }
                    ></input>
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
          <Box display="flex" float="right" mt="4">
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
