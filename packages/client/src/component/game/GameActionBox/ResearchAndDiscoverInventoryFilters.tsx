import { ButtonBase } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Stack } from '@mui/system'
import { FaBars } from 'react-icons/fa'
import { FilterButton } from './FilterButton'
import { InventoryType } from './types'

export const ResearchAndDiscoverInventoryFilters = ({
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
          px: 1.5,
        }}
      >
        <FaBars />
      </ButtonBase>
    </Stack>
  )
}
