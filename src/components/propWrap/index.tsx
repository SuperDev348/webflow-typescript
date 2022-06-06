import React, { useEffect, useState } from 'react'
import {
  ThemeProvider,
  CSSReset,
  Button,
  Box,
  IconButton,
  Image,
  Text,
  Textarea,
} from '@chakra-ui/react'

import AwaitResult from './trigger/awaitResult'
import RepeatTimer from './trigger/repeatTimer'
import Educate from './connect/educate'
import Contact from './connect/contact'
import Custom from './action/custom'
import Note from './action/note'
import Prescribe from './action/prescribe'
import Differential from './action/differential'
import Order from './action/order'
import Elicit from './action/elicit'
import Apply from './action/apply'
import Record from './action/record'
import Schedule from './action/schedule'
import Link from './action/link'
import Use from './action/use'
import Branch from './structure/branch/index'
import Filter from './structure/filter/index'
import Evidence from './evidence'
import theme from '../../styles/theme'
import { useBuilder } from '../../provider/builder'
import siteConfig from '../../config/site.config'

type PropWrapProps = {
  data: boolean
  isChangeProp: boolean
  onChangeProp: Function
  onDelete: Function
  onCloseProperties: Function
  changeBlock: Function
  saveExpressions: Function
}
const PropWrap = (props: PropWrapProps) => {
  const { builderState } = useBuilder()
  const [open, setOpen] = useState(false)
  const [inputData, setInputData] = useState('')

  const handleClose = () => {
    setOpen(false)
    props.onCloseProperties()
  }
  const handleDeleteBlock = () => {
    props.onDelete()
  }

  useEffect(() => {
    setOpen(props.data)
  }, [props.data])
  useEffect(() => {
    if (props.isChangeProp) {
      props.onChangeProp(false)
    }
  }, [props.isChangeProp])
  useEffect(() => {
    if (!builderState.propertyData) {
      setOpen(false)
      return
    }
    setInputData(builderState.propertyData.template)
  }, [builderState.propertyData])

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Box id="propwrap" className={`${open ? 'expanded' : 'collapsed'}`}>
        <Box
          id="properties"
          style={{
            height: !(
              builderState.propertyData?.name === 'Start' ||
              builderState.propertyData?.name === 'End' ||
              builderState.propertyData?.name === 'Custom' ||
              builderState.propertyData?.name === 'Apply'
            )
              ? 'calc(100% - 418px)'
              : 'calc(100% - 130px)',
          }}
        >
          <Box id="close">
            <IconButton aria-label="delete" size="sm" onClick={handleClose}>
              <Image src={`${siteConfig.baseUrl}/assets/close.svg`} alt="NO" />
            </IconButton>
          </Box>
          <Text className="header2">Properties</Text>
          <Box className="proplist">
            <Box style={{ margin: 10, marginLeft: 0 }}>
              <span className="inputlabel">Type: </span>
              {builderState.propertyData?.name === 'Branch' ? (
                <span className="inputlabelValue">Filter</span>
              ) : (
                <span className="inputlabelValue">{builderState.propertyData?.name}</span>
              )}
            </Box>
            <Box style={{ margin: 10, marginLeft: 0 }}>
              <span className="inputlabel">Description: </span>
              <span className="inputlabelValue">{builderState.propertyData?.desc}</span>
            </Box>
            {builderState.propertyData.name === 'Custom' && (
              <Custom changeBlock={props.changeBlock} />
            )}
            {builderState.propertyData.name === 'Note' && (
              <Note changeBlock={props.changeBlock} />
            )}
            {builderState.propertyData?.hasTextInput && (
              <Textarea
                className="inputcomponent"
                aria-label="minimum height"
                minrows={3}
                placeholder="Write custom text here..."
                value={inputData}
                onChange={event => setInputData(event.target.value)}
              />
            )}
            {/* Triggers */}
            {builderState.propertyData.name === 'Await result' ? (
              <AwaitResult changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Repeat timer' ? (
              <RepeatTimer changeBlock={props.changeBlock} />
              // Connects
            ) : builderState.propertyData.name === 'Educate' ? (
              <Educate changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Contact' ? (
              <Contact changeBlock={props.changeBlock} />
              // Actions
            ) : builderState.propertyData.name === 'Prescribe' ? (
              <Prescribe changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Differential' ? (
              <Differential changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Order' ? (
              <Order changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Elicit' ? (
              <Elicit changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Apply' ? (
              <Apply changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Record' ? (
              <Record changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Schedule' ? (
              <Schedule changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Link' ? (
              <Link changeBlock={props.changeBlock} />
            ) : builderState.propertyData.name === 'Use' ? (
              <Use changeBlock={props.changeBlock} />
              // Structures
            ) : builderState.propertyData.name === 'Branch' ? (
              <Branch saveExpressions={props.saveExpressions} />
            ) : builderState.propertyData.name === 'Filter' && (
              <Filter saveExpressions={props.saveExpressions} />
            )}
          </Box>
        </Box>
        <Evidence changeBlock={props.changeBlock} />
        <Box className="removeblockwrapper">
          <Text className="header2">Delete this block</Text>
          <Box id="removeblock" mt="4">
            <Button variant="text" onClick={() => handleDeleteBlock()}>
              Delete block
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
export default PropWrap
