import React, {useRef} from 'react'
import {InputGroup, Button} from '@chakra-ui/react'

type FileUploadProps = {
  onChange: (event: any) => void
  accept: string
  buttonText: string
}
const FileUpload = (props: FileUploadProps) => {
  const { accept, onChange, buttonText } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = (event: any) => {
    inputRef?.current?.click()
    event.stopPropagation()
  }
  const onChangeWrapper = (event: any) => {
    onChange(event)
    event.stopPropagation()
  }
  return (
    <InputGroup onClick={handleClick}>
      <input
        accept={accept}
        type={'file'}
        multiple={false}
        hidden
        onChange={onChangeWrapper}
        ref={inputRef}
      />
      <Button onClick={handleClick}>{buttonText}</Button>
    </InputGroup>
  )
}
export default FileUpload
