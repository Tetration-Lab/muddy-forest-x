import { BigNumber } from 'ethers'

export const PLANET_RARITY = BigInt('6888242871839275222246405745257275088548364400416034343698204186575808495')
export const PLANET_NAME_LENGTH = 2

export const planetLevel = (location: string) => {
  return BigNumber.from(location).xor(BigNumber.from('0xF0F0F0')).mod(BigNumber.from(10)).toNumber()
}

export const maxBuildingPerLevel = (level: number) => {
  return Math.floor(level / 2) + 1
}
