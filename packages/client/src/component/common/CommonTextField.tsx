import { TextField, TextFieldProps, useTheme } from '@mui/material'
import { useFormik } from 'formik'
import { getFieldProps } from '../../utils/getFieldProps'

interface CommonTextFieldProps {
  formik: ReturnType<typeof useFormik>
  path: string
  placeholder?: string
}

export const CommonTextField = (props: CommonTextFieldProps & TextFieldProps) => {
  const theme = useTheme()
  const { formik, path, placeholder, ...restProps } = props
  return (
    <TextField
      {...restProps}
      {...getFieldProps(formik, path)}
      sx={{
        boxSizing: 'border-box',
        '& fieldset': {
          borderColor: `${theme.palette.gray.light}`,
          borderWidth: '1px !important',
        },
        // '&:hover fieldset': {
        //   borderColor: `${theme.palette.gray.main} !important`,
        // },
        ...restProps.sx,
      }}
      placeholder={placeholder}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        sx: {
          height: 40,
          fontSize: 14,
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.common.white,
          borderRadius: 1,
        },
      }}
    />
  )
}
