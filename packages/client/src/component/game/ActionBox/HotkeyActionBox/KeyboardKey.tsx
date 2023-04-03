import { Box, SxProps, Typography, useTheme } from '@mui/material'

export const KeyboardKey = ({ label, sx }: { label: string; sx?: SxProps }) => {
  const theme = useTheme()
  return (
    <Typography
      px={1}
      sx={{
        fontSize: 12,
        color: theme.palette.grayScale.soBlack,
        backgroundColor: theme.palette.grayScale.white,
        fontWeight: 700,
        borderRadius: '4px',
        ...sx,
      }}
    >
      {label.toLowerCase()}
    </Typography>
  )
}
