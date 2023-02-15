import { createTheme } from '@mui/system'
declare module '@mui/material/styles' {
  interface Palette {
    gray?: Palette['primary']
    grayScale?: {
      soBlack: string
      black: string
      almostBlack: string
      darkGray: string
      almostDarkGray: string
      almostGray: string
      white: string
    }
  }

  interface PaletteOptions {
    gray?: PaletteOptions['primary']
    grayScale?: {
      soBlack: string
      black: string
      almostBlack: string
      darkGray: string
      almostDarkGray: string
      almostGray: string
      white: string
    }
  }

  interface SimplePaletteColorOptions {
    lighter?: string
    darker?: string
  }

  interface PaletteColor {
    lighter?: string
    darker?: string
  }
}

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    green: string
  }
}
