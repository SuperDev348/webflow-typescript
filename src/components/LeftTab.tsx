import React, { useEffect, useState } from 'react'
import {
  ThemeProvider,
  CSSReset,
  Box,
  Heading,
  Image,
  Input,
  Divider,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  IconButton,
} from '@chakra-ui/react'

import siteConfig from '../config/site.config'
import LeftCard from './LeftCard'
import {
  CardList_Actions,
  CardList_Triggers,
  CardList_Structures,
  CardList_Connects,
} from '../Globals'
import theme from '../styles/theme'
import { LeftCardProps } from '../types'

type LeftTabPropsType = {
  onOpenChange: (isOpen: boolean) => void
}

export default function LeftTab(props: LeftTabPropsType) {
  const { onOpenChange } = props
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const [triggersList, setTriggersList] = useState<LeftCardProps[]>([])
  const [actionsList, setActionsList] = useState<LeftCardProps[]>([])
  const [structuresList, setStructuresList] = useState<LeftCardProps[]>([])
  const [connectsList, setConnectsList] = useState<LeftCardProps[]>([])

  const handleOpen = () => {
    setOpen(!open)
    onOpenChange(!open)
  }

  const handleChange = (newValue: number) => {
    setValue(newValue)
  }

  const handleTextChange = event => {
    setSearchValue(event.target.value)
  }

  useEffect(() => {
    setTriggersList(
      CardList_Triggers.filter(
        trigger =>
          trigger.name.toUpperCase().includes(searchValue.toUpperCase()) ||
          trigger.desc.toUpperCase().includes(searchValue.toUpperCase()),
      ),
    )
    setActionsList(
      CardList_Actions.filter(
        action =>
          action.name.toUpperCase().includes(searchValue.toUpperCase()) ||
          action.desc.toUpperCase().includes(searchValue.toUpperCase()),
      ),
    )
    setStructuresList(
      CardList_Structures.filter(
        structure =>
          structure.name.toUpperCase().includes(searchValue.toUpperCase()) ||
          structure.desc.toUpperCase().includes(searchValue.toUpperCase()),
      ),
    )
    setConnectsList(
      CardList_Connects.filter(
        connect =>
          connect.name.toUpperCase().includes(searchValue.toUpperCase()) ||
          connect.desc.toUpperCase().includes(searchValue.toUpperCase()),
      ),
    )
  }, [searchValue])

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Box
        id="lefttab"
        w={open ? '380px' : '96px'}
        bg="#FFF"
        box-sizing="border-box"
        position="absolute"
        style={{ zIndex: 2 }}
      >
        {open ? (
          <Box id="closecard" pt="10px">
            <IconButton
              colorScheme="white"
              aria-label="delete"
              size="large"
              onClick={() => handleOpen()}
            >
              <img src={`${siteConfig.baseUrl}/assets/closeleft.svg`} alt="NO" />
            </IconButton>
          </Box>
        ) : (
          <Box ml="12px" mt="40px">
            <IconButton
              aria-label="delete"
              size="large"
              onClick={() => handleOpen()}
            >
              <img src={`${siteConfig.baseUrl}/assets/openright.svg`} alt="NO" />
            </IconButton>
          </Box>
        )}

        {open && (
          <Box pt="4" h="100%">
            <Box w="100%" mt="2">
              <Heading as="h2" size="md">
                Blocks
              </Heading>
              <Box id="search" mt="4">
                <Image src={`${siteConfig.baseUrl}/assets/search.svg`} alt="Search" />
                <Input
                  width="calc(100% - 32px)"
                  type="text"
                  placeholder="Search blocks"
                  onChange={handleTextChange}
                />
              </Box>
            </Box>
            <Box
              w="100%"
              mt="16px"
              pl="4px"
              pt="32px"
              h="calc(100% - 120px)"
              overflowY="auto"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                size="sm"
                variant="soft-rounded"
              >
                <TabList>
                  <Tab>Trigger</Tab>
                  <Tab>Action</Tab>
                  <Tab>Structure</Tab>
                  <Tab>Connect</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel value={value} index={0}>
                    <Box id="blocklist">
                      {triggersList.map(trigger => {
                        return (
                          <LeftCard
                            key={trigger.id}
                            data={trigger}
                            open={open}
                          />
                        )
                      })}
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Box id="blocklist">
                      {actionsList.map(trigger => {
                        return (
                          <LeftCard
                            key={trigger.id}
                            data={trigger}
                            open={open}
                          />
                        )
                      })}
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Box id="blocklist">
                      {structuresList.map(trigger => {
                        return (
                          <LeftCard
                            key={trigger.id}
                            data={trigger}
                            open={open}
                          />
                        )
                      })}
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Box id="blocklist">
                      {connectsList.map(contact => {
                        return (
                          <LeftCard
                            key={contact.id}
                            data={contact}
                            open={open}
                          />
                        )
                      })}
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        )}
        {!open && (
          <Box id="blocklist" maxHeight="calc(100% - 120px)" overflow="scroll">
            {CardList_Triggers.map(trigger => {
              return <LeftCard key={trigger.id} data={trigger} open={open} />
            })}
            <Divider
              style={{ width: '40px', marginLeft: '9px', marginTop: '10px' }}
            />
            {CardList_Actions.map(trigger => {
              return <LeftCard key={trigger.id} data={trigger} open={open} />
            })}
            <Divider
              style={{ width: '40px', marginLeft: '9px', marginTop: '10px' }}
            />
            {CardList_Structures.map(trigger => {
              return <LeftCard key={trigger.id} data={trigger} open={open} />
            })}
            <Divider
              style={{ width: '40px', marginLeft: '9px', marginTop: '10px' }}
            />
            {CardList_Connects.map(connect => {
              return <LeftCard key={connect.id} data={connect} open={open} />
            })}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  )
}
