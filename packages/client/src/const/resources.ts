import { formatEntityID } from '@latticexyz/network'
import { solidityKeccak256 } from 'ethers/lib/utils'

export const ENERGY_ID = '0xa7517d8398dfc2d794fbfb432372ce447c16514ec7de96d333a137d677415f43'
export const BASE_ENERGY_CAP = 5000
export const BASE_ENERGY_REGEN = 80

export const getEnergyLevelMultiplier = (level: number) => {
  return 100 + 50 * level ** 2
}

export const getResourceEntityId = (entity: string, resourceId: string) => {
  return formatEntityID(solidityKeccak256(['uint256', 'uint256'], [entity, resourceId]))
}

export const getEnergyEntityId = (entity: string) => {
  return getResourceEntityId(entity, ENERGY_ID)
}
