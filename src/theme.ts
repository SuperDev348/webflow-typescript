import { theme } from '@chakra-ui/react'

export const customTheme = {
    ...theme,
    fonts: {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      mono: 'Menlo, monospace',
    },
    colors: {
      ...theme.colors,
      pathway: {
        50: '#e6f2ff',
        100: '#c1d3f3',
        200: '#9bb3e6',
        300: '#7390d9',
        400: '#4c6dcc',
        500: '#335cb3',
        600: '#264f8c',
        700: '#1a3d65',
        800: '#0d2940',
        900: '#02111b',
      },
    },
}