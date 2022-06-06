import React, { DragEvent } from 'react'
import {
  ThemeProvider,
  IconButton,
  Box,
  Input,
  Image,
  Text,
} from '@chakra-ui/react'

import siteConfig from '../config/site.config'
import { LeftCardProps } from '../types'
import theme from '../styles/theme'

type CardProps = {
  data: LeftCardProps,
  open: boolean
}

const LeftCard = (props: CardProps) => {
  const { data, open } = props
  const { id, lefticon, name, desc } = data

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('activeCard', JSON.stringify({ id }))
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        className="blockelem create-flowy noselect"
        draggable={true}
        onDragStart={handleDragStart}
        style={{ width: `${open && '318px'}` }}
      >
        {open ? (
          <Box>
            <Input
              type="hidden"
              name="blockelemtype"
              className="blockelemtype"
              value="1"
            />
            <Box className="grabme" mt="12px">
              <Image src={`${siteConfig.baseUrl}/assets/grabme.svg`} alt="NO" />
            </Box>
            <Box className="blockin">
              <IconButton aria-label="">
                <Image src={lefticon} alt="NO" width="24px" height="24px" />
              </IconButton>
              <Box className="blocktext">
                <Text className="blocktitle">{name}</Text>
                <Text className="blockdesc">{desc}</Text>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box className="blockin">
              <Box className="blockico">
                <Text></Text>
                <Image src={lefticon} alt="NO" style={{ width: '24px' }} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  )
}
export default LeftCard
