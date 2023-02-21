import { Box, ButtonBase, useTheme } from '@mui/material'
import { HiXMark } from 'react-icons/hi2'

export const CloseModalButton = () => {
  const theme = useTheme()
  return (
    <ButtonBase
      sx={{
        width: 28,
        height: 28,
        backgroundColor: theme.palette.grayScale.almostBlack,
        border: `2px solid ${theme.palette.grayScale.black}`,
        borderRadius: '4px',
      }}
    >
      <Box component={HiXMark} />
    </ButtonBase>
  )
}
