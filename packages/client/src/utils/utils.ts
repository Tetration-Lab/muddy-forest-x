export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(''), ms))
}

export function hexToInt(hex: string) {
  // if start with negative sign
  if (hex[0] === '-') {
    return -parseInt(hex.slice(1), 16)
  }
  return parseInt(hex, 16)
}
