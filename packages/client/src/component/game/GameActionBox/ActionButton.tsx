import { ButtonBase, ButtonBaseProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const ActionButton = (props: ButtonBaseProps) => {
  const theme = useTheme()

  return (
    <ButtonBase
      {...props}
      sx={{
        height: 32,
        backgroundColor: theme.palette.grayScale.darkGray,
        borderRadius: '10px',
        px: 1,
        ml: 3,
        mt: '-2px',
        transition: 'margin .1s, box-shadow .1s',
        boxShadow: `0 4px 0 0 ${theme.palette.grayScale.soBlack}`,
        '&:active': {
          mt: '0px',
          boxShadow: `0 2px 0 0 ${theme.palette.grayScale.soBlack}`,
        },
        ...props.sx,
      }}
    />
  )
}
