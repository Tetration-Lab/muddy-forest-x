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
    gray: {
      main: '#ADB5BD',
      light: '#E9ECEF',
      lighter: '#F8F9FA',
    },
    common: {
      green: '#4BB543',
    },
    background: {
      paper: '#F8F9FA',
    },
    action: {
      disabledBackground: '#E9ECEF',
      disabled: '#ADB5BD',
    },
  },
  typography: {
    fontFamily: ['Fira Mono', 'Roboto', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 4,
  },
})
