import { useTheme } from '@mui/material/styles'
import { Stack } from '@mui/system'
import { useState } from 'react'
import { ResearchAndDiscoverInventoryFilters } from './ResearchAndDiscoverInventoryFilters'
import { ResearchAndDiscoveryTabs } from './ResearchAndDiscoveryTabs'
import { InventoryType, ResearchAndDiscoveryTabType } from './types'

export const ResearchBox = () => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<ResearchAndDiscoveryTabType>(ResearchAndDiscoveryTabType.Inventory)
  const [activeFilters, setActiveFilters] = useState<InventoryType[]>([InventoryType.Material])

  return (
    <Stack direction="row" spacing={0} width="100%" height="100%">
      <Stack
        sx={{
          border: `1px solid ${theme.palette.common.black}`,
          flex: 9,
          flexGrow: 'none',
          backgroundColor: theme.palette.grayScale.black,
        }}
      >
        <ResearchAndDiscoveryTabs activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />
        <ResearchAndDiscoverInventoryFilters
          activeFilters={activeFilters}
          onFilterChange={(filters) => setActiveFilters(filters)}
        />
      </Stack>
      <Stack
        sx={{
          border: `2px solid ${theme.palette.common.black}`,
          flex: 12,
          backgroundColor: theme.palette.grayScale.black,
        }}
      ></Stack>
    </Stack>
  )
}
