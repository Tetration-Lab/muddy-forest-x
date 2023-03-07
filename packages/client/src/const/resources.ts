import { formatEntityID } from '@latticexyz/network'
import { solidityKeccak256 } from 'ethers/lib/utils'

export const ENERGY_ID = '0xa7517d8398dfc2d794fbfb432372ce447c16514ec7de96d333a137d677415f43'

export const getResourceEntityId = (entity: string, resourceId: string) => {
  return formatEntityID(solidityKeccak256(['uint256', 'uint256'], [entity, resourceId]))
}

export const getEnergyEntityId = (entity: string) => {
  return getResourceEntityId(entity, ENERGY_ID)
}
