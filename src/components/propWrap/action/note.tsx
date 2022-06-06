import React, { useState, useEffect } from 'react'
import { Text, Textarea, Box, Button } from '@chakra-ui/react'

import { useBuilder } from '../../../provider/builder'

const Note = (props) => {
  const { changeBlock } = props
  const { builderState } = useBuilder()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const handleSave = () => {
    const selectedBlock = builderState.blocks.find(
      block => block.id === builderState?.propertyData?.savedId,
    )
    if (!selectedBlock)
      return
    selectedBlock.fields.note = JSON.stringify({
      title: title,
      placeholder: text,
    })
    changeBlock(selectedBlock)
  }
  const handleCancel = () => {
    setTitle(builderState?.propertyData?.selectedTitle)
    setText(builderState?.propertyData?.selectedText)
  }

  useEffect(() => {
    setTitle(builderState?.propertyData?.selectedTitle)
    setText(builderState?.propertyData?.selectedText)
  }, [builderState.propertyData])
  return (
    <>
      <Text className="inputlabel">Title: </Text>
      <Textarea
        className="inputcomponent"
        aria-label="minimum height"
        minrows={3}
        placeholder="Write custom text here..."
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
      <Text className="inputlabel">Placeholder: </Text>
      <Textarea
        className="inputcomponent"
        aria-label="minimum height"
        minrows={3}
        placeholder="Write custom text here..."
        value={text}
        onChange={event => setText(event.target.value)}
      />
      <Box display="flex" float="right" mt="4">
        <Button colorScheme="gray" onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button colorScheme="blue" ml="4" onClick={() => handleSave()}>
          Save
        </Button>
      </Box>
    </>
  )
}
export default Note