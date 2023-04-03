import { Box, useTheme } from '@mui/system'
import { FaPlus } from 'react-icons/fa'

export const BuildingItem = ({
  isBuildable = false,
  onClick,
  imageSrc,
}: {
  isBuildable?: boolean
  onClick?: () => void
  imageSrc?: string
}) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        backgroundColor: theme.palette.grayScale.almostBlack,
        borderRadius: '8px',
        border: `3px dashed ${theme.palette.grayScale.darkGray}`,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {imageSrc && <img src={imageSrc} style={{ width: 24, height: 24 }} />}
      {isBuildable && <FaPlus size={14} color={theme.palette.grayScale.black} />}
    </Box>
  )
}
