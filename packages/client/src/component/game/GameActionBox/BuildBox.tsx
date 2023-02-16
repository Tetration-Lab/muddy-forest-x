import { ButtonBase, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Box, Stack } from '@mui/system'
import { useMemo, useState } from 'react'
import { MOCK_BUILD_ITEMS } from '../../../const/mocks'
import { FilterButton } from './FilterButton'
import { GameItem } from './GameItem'
import { BuildItemType, BuildTabType, IBuildItem, ItemVisibility } from './types'

const BuildTabs = ({
  activeTab,
  onChangeTab,
  items = [],
}: {
  activeTab: BuildTabType
  onChangeTab: (tab: BuildTabType) => void
  items?: IBuildItem[]
}) => {
  const theme = useTheme()

  const isBuildActive = activeTab === BuildTabType.Build
  const isUpgradeActive = activeTab === BuildTabType.Upgrade

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
        onClick={() => onChangeTab(BuildTabType.Build)}
        sx={{
          px: 2,
          py: '4px',
          borderBottom: `2px solid ${isBuildActive ? theme.palette.grayScale.white : 'transparent'}`,
          borderTop: '2px solid transparent',
        }}
      >
        <Typography variant="body2">Build</Typography>
        <Box
          sx={{
            ml: 1,
            borderRadius: '4px',
            width: 18,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.error.main,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{items.length}</Typography>
        </Box>
      </ButtonBase>
      <ButtonBase
        onClick={() => onChangeTab(BuildTabType.Upgrade)}
        sx={{
          px: 2,
          py: '4px',
          borderBottom: `2px solid ${isUpgradeActive ? theme.palette.grayScale.white : 'transparent'}`,
          borderTop: '2px solid transparent',
        }}
      >
        <Typography variant="body2">Upgrade</Typography>
      </ButtonBase>
    </Stack>
  )
}

const BuildFilters = ({
  activeFilters,
  onFilterChange,
}: {
  activeFilters: BuildItemType[]
  onFilterChange: (filters: BuildItemType[]) => void
}) => {
  const theme = useTheme()
  const isAvailableActive = activeFilters?.some((value) => value === BuildItemType.Available)
  const isNotAvailableActive = activeFilters?.some((value) => value === BuildItemType.NotAvailable)

  const handleClickFilter = (filter: BuildItemType) => {
    let newActiveFilters = []
    if (activeFilters.includes(filter)) {
      newActiveFilters = activeFilters.filter((f) => f !== filter)
    } else {
      newActiveFilters = [...activeFilters, filter]
    }
    onFilterChange(newActiveFilters)
  }

  return (
    <Stack px={2} py={0.5} direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={0.5}>
        <FilterButton
          text="Available"
          active={isAvailableActive}
          onClick={() => handleClickFilter(BuildItemType.Available)}
        />
        <FilterButton
          text="Not Available"
          active={isNotAvailableActive}
          onClick={() => handleClickFilter(BuildItemType.NotAvailable)}
        />
      </Stack>
      <ButtonBase
        sx={{
          height: 32,
          backgroundColor: theme.palette.grayScale.darkGray,
          borderRadius: '10px',
          px: 1,
        }}
      >
        <Typography variant="body2">Sort By</Typography>
      </ButtonBase>
    </Stack>
  )
}

const BuildItemList = ({
  items,
  selectedItemId,
  onClickItem,
  activeFilters,
}: {
  items: IBuildItem[]
  selectedItemId?: string
  onClickItem: (itemId: string) => void
  activeFilters: BuildItemType[]
}) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={0.5} px="12px">
      {items.map((item) => (
        <GameItem
          key={item.id}
          imageUrl={item.imageUrl}
          onClick={() => onClickItem(item.id)}
          active={item.id === selectedItemId}
          visibility={activeFilters.includes(item.type) ? ItemVisibility.Visible : ItemVisibility.Dimmed}
        />
      ))}
    </Box>
  )
}

export const BuildBox = () => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<BuildTabType>(BuildTabType.Build)
  const [activeFilters, setActiveFilters] = useState<BuildItemType[]>([BuildItemType.Available])
  const [selectedItemId, setSelectedItemId] = useState<string>()
  // TODO: fetch items
  const [items] = useState<IBuildItem[]>(MOCK_BUILD_ITEMS)

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedItemId), [selectedItemId, items])

  return (
    <Stack direction="row" spacing={2} width="100%" height="100%">
      <Stack
        sx={{
          borderRadius: '4px',
          border: `2px solid ${theme.palette.common.black}`,
          flex: 6,
          flexGrow: 'none',
          backgroundColor: theme.palette.grayScale.black,
        }}
      >
        <BuildTabs activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} items={items} />
        <BuildFilters activeFilters={activeFilters} onFilterChange={(filters) => setActiveFilters(filters)} />
        <BuildItemList
          items={MOCK_BUILD_ITEMS}
          selectedItemId={selectedItemId}
          onClickItem={(itemId) => setSelectedItemId(itemId)}
          activeFilters={activeFilters}
        />
      </Stack>
      <Stack
        sx={{
          borderRadius: '4px',
          border: `2px solid ${theme.palette.common.black}`,
          flex: 4,
          backgroundColor: theme.palette.grayScale.black,
        }}
      >
        {selectedItem && (
          <>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.grayScale.almostBlack,
                p: 2,
              }}
            >
              <Box
                component="img"
                src={selectedItem.imageUrl}
                sx={{
                  width: 128,
                  height: 120,
                }}
              />
            </Box>
          </>
        )}
      </Stack>
    </Stack>
  )
}
