import { createTheme } from '@mui/system'
declare module '@mui/material/styles' {
  interface Palette {
    gray?: Palette['primary']
  }

  interface PaletteOptions {
    gray?: PaletteOptions['primary']
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
