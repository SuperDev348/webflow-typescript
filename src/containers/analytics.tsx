import React, { useCallback, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  CSSReset,
  ThemeProvider,
} from '@chakra-ui/react'
import UserHeader from '../components/headers/UserHeader'

import { Styles } from './style/builderStyle'
import BareLayout from '../components/layout/BareLayout'
import { get as getUser } from '../api/user'
import { customTheme } from '../theme'
import { UserType } from '../types'
import { formatAirtableResult } from '../service/common'

export const Analytics = () => {
  const userId = 'recaV7dSybHG1netm'
  const [user, setUser] = useState<UserType>(null)

  const initUser = (userId: string) => {
    getUser(userId)
      .then((res) => {
        setUser(formatAirtableResult(res))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    initUser(userId)
  })

  return (
    <Styles>
      <Box className="builder">
        <ThemeProvider theme={customTheme}>
          <CSSReset />
          <BareLayout>
            <Box>
              <Box>
                <UserHeader pageTitle="Organization dashboard" user={user} />
              </Box>
              Hello
            </Box>
          </BareLayout>

        </ThemeProvider>
      </Box>
    </Styles>
  )
}
export default Analytics
