import { ButtonBase, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Box, Stack } from '@mui/system'
import { useMemo, useState } from 'react'
import { MOCK_BUILD_ITEMS } from '../../../../const/mocks'
import { ActionButton } from './ActionButton'
import { FilterButton } from './FilterButton'
import { GameItem } from '../../common/GameItem'
import { GameItemRow } from './GameItemRow'
import { BuildItemType, BuildTabType, IBuildItem, ItemVisibility } from './types'
import { TypeTag } from '../../common/LabelTag'

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
          withBadge={item.type === BuildItemType.Available}
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
  const [items] = useState<IBuildItem[]>(MOCK_BUILD_ITEMS)

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedItemId), [selectedItemId, items])

  const handleSelectItem = (itemId: string) => {
    if (itemId === selectedItemId) {
      setSelectedItemId('')
    } else {
      setSelectedItemId(itemId)
    }
  }

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
          onClickItem={handleSelectItem}
          activeFilters={activeFilters}
        />
      </Stack>

      {selectedItem ? (
        <Stack spacing={2} sx={{ flex: 4 }}>
          <Stack
            sx={{
              borderRadius: '4px',
              border: `2px solid ${theme.palette.common.black}`,
              backgroundColor: theme.palette.grayScale.almostBlack,
              px: 1,
              py: 0.5,
              alignItems: 'center',
            }}
            direction="row"
            spacing={1}
          >
            <Box
              component="img"
              src="/assets/empty-build.png"
              sx={{
                width: 48,
                height: 48,
              }}
            />
            <Stack alignItems="flex-start">
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Lorem ipsum.</Typography>
              <TypeTag type="RESOURCE" />
            </Stack>
          </Stack>
          <Stack
            sx={{
              flex: 1,
              borderRadius: '4px',
              border: `2px solid ${theme.palette.common.black}`,
              backgroundColor: theme.palette.grayScale.black,
            }}
          >
            <Stack sx={{ flex: 1, p: 2 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <GameItem imageUrl={selectedItem.imageUrl} />
                <Stack>
                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Item Name </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: theme.palette.grayScale.almostGray }}>
                    Item description
                  </Typography>
                </Stack>
              </Stack>
              <Stack mt={2} spacing={0.5}>
                <Typography sx={{ fontSize: 12, fontWeight: 400 }}>Require items:</Typography>
                {selectedItem.requireItems?.map((requireItem) => (
                  <GameItemRow
                    key={requireItem.id}
                    name={requireItem.name}
                    imageUrl={requireItem.imageUrl}
                    num1={1}
                    num2={2}
                  />
                ))}
              </Stack>
            </Stack>
            <Box
              sx={{
                backgroundColor: theme.palette.grayScale.almostDarkGray,
                py: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 54,
              }}
            >
              <ActionButton>
                <Typography variant="body2">Build</Typography>
              </ActionButton>
            </Box>
          </Stack>
        </Stack>
      ) : (
        <Stack
          sx={{
            borderRadius: '4px',
            border: `2px solid ${theme.palette.common.black}`,
            flex: 4,
            backgroundColor: theme.palette.grayScale.black,
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grayScale.almostBlack,
            }}
          >
            <Box
              component="img"
              src="/assets/empty-build.png"
              sx={{
                width: 128,
                height: 128,
              }}
            />
          </Box>
          <Stack mt="12px" px={2} alignItems="flex-start" spacing="4px" flex={1}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Lorem ipsum.</Typography>
            <TypeTag type="RESOURCE" />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                lineHeight: '14px',
                color: theme.palette.grayScale.almostGray,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
          </Stack>
          <Box
            sx={{
              m: 2,
              backgroundColor: theme.palette.grayScale.almostBlack,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100px',
              flexShrink: 0,
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='${encodeURIComponent(
                  theme.palette.grayScale.white,
                )}' stroke-width='6' stroke-dasharray='12%2c12' stroke-dashoffset='3' stroke-linecap='round'/%3e%3c/svg%3e");`,
              },
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 400, whiteSpace: 'pre-wrap' }}>
              {'Select any infrastructure\nto build / upgrade'}
            </Typography>
          </Box>
        </Stack>
      )}
    </Stack>
  )
}
