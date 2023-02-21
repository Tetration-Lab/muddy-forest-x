import { useTheme } from '@mui/material/styles'
import { ButtonBase, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { ResearchAndDiscoveryTabType } from './types'

export const ResearchAndDiscoveryTabs = ({
  activeTab,
  onChangeTab,
}: {
  activeTab: ResearchAndDiscoveryTabType
  onChangeTab: (tab: ResearchAndDiscoveryTabType) => void
}) => {
  const theme = useTheme()

  const isBuildActive = activeTab === ResearchAndDiscoveryTabType.Inventory
  const isUpgradeActive = activeTab === ResearchAndDiscoveryTabType.Discovered

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{
        backgroundColor: theme.palette.grayScale.almostBlack,
        py: 0.5,
      }}
    >
      <ButtonBase
        onClick={() => onChangeTab(ResearchAndDiscoveryTabType.Inventory)}
        sx={{
          px: 2,
          py: '4px',
          borderBottom: `2px solid ${isBuildActive ? theme.palette.grayScale.white : 'transparent'}`,
          borderTop: '2px solid transparent',
        }}
      >
        <Typography variant="body2">Inventory</Typography>
      </ButtonBase>
      <ButtonBase
        onClick={() => onChangeTab(ResearchAndDiscoveryTabType.Discovered)}
        sx={{
          px: 2,
          py: '4px',
          borderBottom: `2px solid ${isUpgradeActive ? theme.palette.grayScale.white : 'transparent'}`,
          borderTop: '2px solid transparent',
        }}
      >
        <Typography variant="body2">Discovered</Typography>
      </ButtonBase>
    </Stack>
  )
}
