import { formatEntityID } from '@latticexyz/network'
import { solidityKeccak256 } from 'ethers/lib/utils'

export const COOLDOWN_MOVE_ID = '0x1'
export const COOLDOWN_RESEARCH_ID = '0x2'

export const getCooldownEntityId = (entity: string) => {
  return formatEntityID(solidityKeccak256(['uint256', 'uint256'], []))
}

export const getMoveCooldownEntityId = (entity: string) => {
  return formatEntityID(solidityKeccak256(['uint256', 'uint256'], [entity, COOLDOWN_MOVE_ID]))
}

export const getResearchCooldownEntityId = (entity: string) => {
  return formatEntityID(solidityKeccak256(['uint256', 'uint256'], [entity, COOLDOWN_RESEARCH_ID]))
}
