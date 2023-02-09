import { useFormik } from 'formik'
import { get } from 'lodash'

export const getFieldProps = (
  formik: ReturnType<typeof useFormik>,
  name: string,
  transform?: (value: string) => string,
) => {
  const initialValue = ''
  const isTouched = get(formik.touched, name)
  const errorMessage = get(formik.errors, name, '')
  const value = get(formik.values, name, initialValue) ?? ''

  return {
    name,
    value,
    onChange: (e) => {
      formik.handleChange(e)

      if (transform) {
        const value = e.target.value || ''
        const newValue = transform(value)
        formik.setFieldValue(name, newValue)
      }
    },
    onBlur: () => {
      formik.setFieldTouched(name, true)
    },
    error: isTouched && !!errorMessage,
    helperText: isTouched ? (errorMessage as string) : '',
  }
}
