import { ButtonBase, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Box, Stack } from '@mui/system'
import { useMemo, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { MOCK_INVENTORY_ITEMS } from '../../../../const/mocks'
import { ActionButton } from './ActionButton'
import { FilterButton } from './FilterButton'
import { GameItem } from '../../common/GameItem'
import { IInventoryItem, InventoryTabType, InventoryType, ItemVisibility } from './types'
import { TypeTag } from '../../common/LabelTag'

const InventoryTabs = ({
  activeTab,
  onChangeTab,
  items,
}: {
  activeTab: InventoryTabType
  onChangeTab: (tab: InventoryTabType) => void
  items: IInventoryItem[]
}) => {
  const theme = useTheme()

  const isInventoryActive = activeTab === InventoryTabType.Inventory
  const isCraftingActive = activeTab === InventoryTabType.Crafting

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
        onClick={() => onChangeTab(InventoryTabType.Inventory)}
        sx={{
          px: 2,
          py: '4px',
          borderBottom: `2px solid ${isInventoryActive ? theme.palette.grayScale.white : 'transparent'}`,
          borderTop: '2px solid transparent',
        }}
      >
        <Typography variant="body2">Inventory</Typography>
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
        onClick={() => onChangeTab(InventoryTabType.Crafting)}
        sx={{
          px: 2,
          py: '4px',
          borderBottom: `2px solid ${isCraftingActive ? theme.palette.grayScale.white : 'transparent'}`,
          borderTop: '2px solid transparent',
        }}
      >
        <Typography variant="body2">Crafting</Typography>
      </ButtonBase>
    </Stack>
  )
}

const InventoryFilters = ({
  activeFilters,
  onFilterChange,
}: {
  activeFilters: InventoryType[]
  onFilterChange: (filters: InventoryType[]) => void
}) => {
  const theme = useTheme()
  const isBlueprintActive = activeFilters?.some((value) => value === InventoryType.Blueprint)
  const isMaterialActive = activeFilters?.some((value) => value === InventoryType.Material)

  const handleClickFilter = (filter: InventoryType) => {
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
          text="Blueprint"
          active={isBlueprintActive}
          onClick={() => handleClickFilter(InventoryType.Blueprint)}
        />
        <FilterButton
          text="Material"
          active={isMaterialActive}
          onClick={() => handleClickFilter(InventoryType.Material)}
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

const InventoryItemList = ({
  items,
  selectedItemId,
  onClickItem,
  activeFilters,
}: {
  items: IInventoryItem[]
  selectedItemId?: string
  onClickItem: (itemId: string) => void
  activeFilters: InventoryType[]
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

const IInventoryItemWIthName = ({ item }: { item: IInventoryItem }) => {
  const theme = useTheme()
  return (
    <Stack direction="row" spacing="12px" sx={{ p: 2, backgroundColor: theme.palette.grayScale.darkGray }}>
      <GameItem imageUrl={item.imageUrl} />
      <Stack>
        <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{item.name}</Typography>
        <TypeTag type={item.type} />
      </Stack>
    </Stack>
  )
}

export const InventoryBox = () => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<InventoryTabType>(InventoryTabType.Inventory)
  const [activeFilters, setActiveFilters] = useState<InventoryType[]>([InventoryType.Material])
  const [selectedItemId, setSelectedItemId] = useState<string>()
  // TODO: fetch items
  const [items] = useState<IInventoryItem[]>(MOCK_INVENTORY_ITEMS)
  const [craftCounterNumber, setCraftCounterNumber] = useState(1)

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
        <InventoryTabs activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} items={items} />
        <InventoryFilters activeFilters={activeFilters} onFilterChange={(filters) => setActiveFilters(filters)} />
        <InventoryItemList
          items={MOCK_INVENTORY_ITEMS}
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
            <IInventoryItemWIthName item={selectedItem} />
            <Stack sx={{ mt: 3, px: 2 }} flex={1}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Usage:
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: '12px',
                  fontWeight: 400,
                  color: theme.palette.grayScale.almostGray,
                }}
              >
                {selectedItem.description}
              </Typography>
            </Stack>
            <Box
              sx={{
                backgroundColor: theme.palette.grayScale.almostDarkGray,
                borderRadius: '8px 8px 0 0',
                py: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stack direction="row">
                <Stack direction="row">
                  <ButtonBase
                    onClick={() => setCraftCounterNumber((n) => Math.max(n - 1, 1))}
                    disabled={craftCounterNumber <= 1}
                    sx={{
                      height: 32,
                      width: 32,
                      backgroundColor: theme.palette.grayScale.black,
                      border: `1px solid ${theme.palette.grayScale.darkGray}`,
                      borderRadius: '4px 0 0 4px',
                      '&:is(:disabled)': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <Box component={FaMinus} sx={{ fontSize: 18 }} />
                  </ButtonBase>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.grayScale.white,
                      color: theme.palette.grayScale.black,
                      width: 36,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{craftCounterNumber}</Typography>
                  </Box>
                  <ButtonBase
                    onClick={() => setCraftCounterNumber((n) => n + 1)}
                    sx={{
                      height: 32,
                      width: 32,
                      backgroundColor: theme.palette.grayScale.black,
                      border: `1px solid ${theme.palette.grayScale.darkGray}`,
                      borderRadius: '0 4px 4px 0',
                    }}
                  >
                    <Box component={FaPlus} sx={{ fontSize: 18 }} />
                  </ButtonBase>
                </Stack>
                <ActionButton>
                  <Typography variant="body2">Craft</Typography>
                </ActionButton>
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Stack>
  )
}
