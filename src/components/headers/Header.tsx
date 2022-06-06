import React from 'react'
import { Flex, Heading, Image } from '@chakra-ui/react'

import siteConfig from '../../config/site.config'

type HeaderPropsType = {
  title: string
  left?: React.ReactElement
  middle?: React.ReactElement
  right?: React.ReactElement
}
function Header(props: HeaderPropsType) {
  const { title, left, middle, right } = props

  return (
    <Flex
      w="100%"
      minWidth="900px"
      p="16px"
      height="76px"
      borderBottom="1px solid lightgray"
    >
      <Flex w="350px">
        <Image
          src={`${siteConfig.baseUrl}/assets/logo_small.png`}
          width="40px"
          height="37px"
          mt="2px"
          alt="Logo"
        />
        <Heading as="h1" size="lg" ml="16px" lineHeight="43px" noOfLines={1}>
          {title}
        </Heading>
      </Flex>
      <Flex width={middle ? '250px' : '500px'}>{left}</Flex>
      {middle && <Flex>{middle}</Flex>}
      <Flex ml="auto">{right}</Flex>
    </Flex>
  )
}

export default Header
