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
      darker: '#1E1E1E',
      main: '#ADB5BD',
      light: '#E9ECEF',
      lighter: '#F8F9FA',
    },
    grayScale: {
      soBlack: '#1E1E1E',
      black: '#212529',
      almostBlack: '#343A40',
      darkGray: '#495057',
      almostDarkGray: '#6C757D',
      almostGray: '#ADB5BD',
      white: '#F8F9FA',
    },
    common: {
      green: '#4BB543',
      gold: '#FFD700',
      orange: '#D67D2F',
    },
    background: {
      paper: '#F8F9FA',
    },
    action: {
      disabledBackground: '#E9ECEF',
      disabled: '#ADB5BD',
    },
    error: {
      main: '#D6432F',
    },
    success: {
      main: '#4BB543',
    },
    ranking: {
      first: '#AF9500',
      second: '#B4B4B4',
      third: '#6A3805',
    },
  },
  typography: {
    fontFamily: ['Fira Mono', 'Roboto', 'sans-serif'].join(','),
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        componentsProps: {
          tooltip: {
            sx: {
              backgroundColor: '#171923',
              '& .MuiTooltip-arrow': {
                color: '#171923',
              },
            },
          },
        },
      },
    },
  },
  // shape: {
  //   borderRadius: 4,
  // },
})
