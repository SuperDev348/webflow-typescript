import React, { useEffect, useState, useRef, Suspense } from 'react'
import { useNavigate, Link as RouteLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { ArrowLeftIcon } from '@chakra-ui/icons'
import Header from './Header'
import { UserType } from '../../types'

type UserHeaderPropsType = {
  user: UserType
  pageTitle: string
}

function UserHeader(props: UserHeaderPropsType) {
  const { user, pageTitle } = props
  const headerHeight = '43px'

  return !user ? (
    <Header title="Reports" />
  ) : (
    <Header
      title="Reports"
      left={
        <Flex>
          <Heading as="h2" size="md" lineHeight={headerHeight} noOfLines={1}>
            {pageTitle}
          </Heading>
        </Flex>
      }
      middle={
        <></>
      }
      right={
        <Flex>
          <Text lineHeight={headerHeight} noOfLines={1}>
            User: {user.name}, {user.title} ({user.licenseNumber})
          </Text>
        </Flex>
      }
    />
  )
}

export default UserHeader
