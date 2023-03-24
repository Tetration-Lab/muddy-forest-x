import { Button, ButtonProps, useTheme } from '@mui/material'

export const MainButton = (props: ButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      color="secondary"
      variant="contained"
      disableElevation
      {...props}
      sx={{
        boxShadow: 0,
        maxWidth: 400,
        textTransform: 'none',
        '&:disabled': {
          opacity: 0.3,
        },
        '&.MuiButton-outlined': {
          color: theme.palette.grayScale.white,
          border: `1px solid ${theme.palette.grayScale.white}`,
          '&:hover': {
            opacity: 0.8,
          },
        },
        ...props.sx,
      }}
    />
  )
}
