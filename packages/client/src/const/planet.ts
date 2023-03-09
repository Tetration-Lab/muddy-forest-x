export const PLANET_RARITY = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495')
export const PLANET_NAME_LENGTH = 2

export const planetLevel = (location: string) => {
  return Number(BigInt(location) % BigInt(4294967295)) ^ 0xffffff % 10
}
