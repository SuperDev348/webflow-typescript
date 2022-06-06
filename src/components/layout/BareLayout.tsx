import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Box } from '@chakra-ui/react'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

function BareLayout({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions()

  return (
    <Box height={height}>
      <Head>
        <title key="title">Pathway</title>
        <meta
          key="viewport"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <link
          key="favicon"
          rel="shortcut icon"
          href="/favicon.png"
          type="image/x-icon"
        ></link>
      </Head>
      <Box width="100%" height="100%" mx="auto">
        {children}
      </Box>
    </Box>
  )
}
export default BareLayout
