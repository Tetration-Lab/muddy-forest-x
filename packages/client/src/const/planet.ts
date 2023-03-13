export const PLANET_RARITY = BigInt('6888242871839275222246405745257275088548364400416034343698204186575808495')
export const PLANET_NAME_LENGTH = 2

export const planetLevel = (location: string) => {
  return Math.abs((Number(BigInt(location) % BigInt(4294967295)) ^ 0xf0f0f0) % 10)
}

export const maxBuildingPerLevel = (level: number) => {
  return Math.floor(level / 2) + 1
}
