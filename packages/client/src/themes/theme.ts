import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#212529',
    },
    secondary: {
      main: '#343A40',
    },
  },
  typography: {
    fontFamily: ['Fira Mono', 'Roboto', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 4,
  },
})
