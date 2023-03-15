import { Button, ButtonProps } from '@mui/material'

export const MainButton = (props: ButtonProps) => {
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
        ...props.sx,
      }}
    />
  )
}
