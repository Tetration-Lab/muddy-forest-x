import { formatEntityID } from '@latticexyz/network'
import { solidityKeccak256 } from 'ethers/lib/utils'
import _ from 'lodash'

export const ENERGY_ID = '0xa7517d8398dfc2d794fbfb432372ce447c16514ec7de96d333a137d677415f43'

export const ADVANCED_ID = '0x9f56a1af35c8caed4f9734f6062d93735763f6799f9a273891339650060de838'
export const ADVANCED_CNT = 2
export const ALL_ADVANCED_RESOURCE_ID = _.range(1, ADVANCED_CNT + 1).map((e) => {
  const id = (BigInt(ADVANCED_ID) + BigInt(e)).toString(16)
  return formatEntityID(`0x${id}`)
})

export const BASE_ENERGY_CAP = 5000
export const BASE_ENERGY_REGEN = 80
export const ADVANCED_CAP = 500
export const ADVANCED_REGEN = 2

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
  return Math.floor(100 + 10 * distance + (weight * distance) / (50 + 0))
}

export const attackEnergyCost = (distance: number) => {
  return 100 + distance ** 2
}

export const getLevelResourceStorageMultiplier = (level: number) => {
  return level * 10 + 100
}

export const isContainResource = (location: string, resourceId: string) => {
  return Number((BigInt(location) ^ BigInt(resourceId)) % BigInt(5)) > 3
}
