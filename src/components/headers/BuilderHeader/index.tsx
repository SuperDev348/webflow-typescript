import React, {
  useEffect,
  useState,
} from 'react'
import {
  ThemeProvider,
  CSSReset,
  Box,
  Flex,
  Text,
  Heading,
} from '@chakra-ui/react'

import Header from '../Header'
import Open from './open'
import Edit from './edit'
import Create from './create'
import Preview from './preview'
import Bundle from './bundle/index'
import {
  BundleType,
  ProtocolType,
} from '../../../types'
import theme from '../../../styles/theme'
import { useBuilder } from '../../../provider/builder'

type BuilderHeaderPropsType = {
  selBundle: BundleType | undefined
  selProtocol: ProtocolType | undefined
  saveExpressions: Function
}
const BuilderHeader = (props: BuilderHeaderPropsType) => {
  const { selBundle, selProtocol, saveExpressions } = props
  const { builderState } = useBuilder()
  const [title, setTitle] = useState<string>('')
  const [subTitle, setSubTitle] = useState<string>('')

  useEffect(() => {
    if (builderState.bundles.length !== 0)
      setTitle(selBundle ? selBundle.fields.name : builderState.bundles[0]?.fields?.name)
    if (builderState.protocols.length !== 0)
      setSubTitle(
        selProtocol ? selProtocol.fields.name : builderState.protocols[0]?.fields?.name,
      )
  }, [builderState.protocols, selProtocol, builderState.bundles, selBundle])

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Box bg="white" position="relative" style={{ zIndex: 5 }}>
        <Header
          title="Pathway Editor"
          left={
            <Flex>
              {selProtocol ? (
                <Box mr="4">
                  <Heading as="h3" size="sm" noOfLines={1}>
                    {title}
                  </Heading>
                  <Text noOfLines={1}>{subTitle}</Text>
                </Box>
              ) : (
                <Box mr="4">
                  <Heading as="h3" size="sm" noOfLines={1} lineHeight="43px">
                    Open a bundle
                  </Heading>
                </Box>
              )}
              <Open
                selBundle={selBundle}
                selProtocol={selProtocol}
              />
              {selProtocol && (
                <Edit
                  selBundle={selBundle}
                  selProtocol={selProtocol}
                />
              )}
              <Create
                selBundle={selBundle}
              />
              <Bundle
                saveExpressions={saveExpressions}
              />
            </Flex>
          }
          right={
            <Box ml="4" mr="4">
              {selBundle && selProtocol && selBundle.id && selProtocol.id && (
                <Preview selProtocol={selProtocol} />
              )}
            </Box>
          }
        />
      </Box>
    </ThemeProvider>
  )
}

export default BuilderHeader