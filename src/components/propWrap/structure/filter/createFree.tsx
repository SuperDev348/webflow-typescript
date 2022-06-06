import React, { useState } from 'react'
import { Text, Box, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

const AddFreeCondition = () => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')

  const handleCancel = () => {

  }
  const handleSave = () => {

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
          <Text ml="4">Add a new free condition</Text>
        </Button>
      </Box>
      {isShow && (
        <>
          <Box className="selectgroup">
            <span style={{ width: '75px' }}>Value: </span>
            <input
              type="text"
              style={{ width: '260px', padding: '5px' }}
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </Box>
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
export default AddFreeCondition
