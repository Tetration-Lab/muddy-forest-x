import { formatEntityID } from '@latticexyz/network'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { setNestedObjectValues } from 'formik'

export const ENERGY_ID = '0xa7517d8398dfc2d794fbfb432372ce447c16514ec7de96d333a137d677415f43'
export const BASE_ENERGY_CAP = 5000
export const BASE_ENERGY_REGEN = 80

export const getResourceEntityId = (entity: string, resourceId: string) => {
  return formatEntityID(solidityKeccak256(['uint256', 'uint256'], [entity, resourceId]))
}

export const getEnergyEntityId = (entity: string) => {
  return getResourceEntityId(entity, ENERGY_ID)
}

export const getEnergyLevelMultiplier = (level: number) => {
  return 100 + 50 * level ** 2
}

export const moveEnergyCost = (distance: number) => {
  return 100 + 20 * distance
}

/**
 * @param distance distance between sender and receiver
 * @param weight total amount of advanced resource sent
 * @returns energy cost
 **/
export const sendEnergyCost = (distance: number, weight: number) => {
  return 100 + 10 * distance + (weight * distance) / (50 + 0)
}

export const attackEnergyCost = (distance: number) => {
  return 100 + distance ** 2
}
