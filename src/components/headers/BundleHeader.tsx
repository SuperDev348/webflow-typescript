import React, { useEffect, useState, useRef, Suspense } from 'react'
import { useNavigate, Link as RouteLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  Text,
} from '@chakra-ui/react'
import { ArrowLeftIcon } from '@chakra-ui/icons'
import Header from './Header'
import { PatientType, UserType, BundleType } from '../../types'

type BundleHeaderPropsType = {
  patient: PatientType
  user: UserType
  bundle: BundleType
}

function BundleHeader(props: BundleHeaderPropsType) {
  const { patient, user, bundle } = props
  const headerHeight = '43px'

  return !(patient && user && bundle) ? (
    <Header title="Bundle Viewer" />
  ) : (
    <Header
      title="Bundle Viewer"
      left={
        <Flex mr="16px">
          <Box mr="16px">
            <Heading as="h3" size="sm">
              {patient.lastName
                ? `${patient.lastName}, ${patient.firstName}`
                : ''}
            </Heading>
            <Text>{patient.id}</Text>
          </Box>

          <RouteLink to={`/patients/${patient.id}`}>
            <IconButton aria-label="" icon={<ArrowLeftIcon />}></IconButton>
          </RouteLink>
        </Flex>
      }
      middle={
        <Flex>
          <Heading as="h2" size="md" lineHeight={headerHeight} noOfLines={1}>
            {bundle.fields.name}
          </Heading>
        </Flex>
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

export default BundleHeader
