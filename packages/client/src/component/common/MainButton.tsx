import { Button, ButtonProps } from '@mui/material'

export const MainButton = (props: ButtonProps) => {
  return (
    <Button
      color="secondary"
      variant="contained"
      {...props}
      sx={{
        boxShadow: 0,
        maxWidth: 400,
        ...props.sx,
      }}
    />
  )
}
