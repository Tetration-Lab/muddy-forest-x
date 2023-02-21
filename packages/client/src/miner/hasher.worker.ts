export const getWasmInstance = async () => {
  return await import('circuits/circuits')
}

export const createHasher = async () => {
  const instance = await getWasmInstance()
  const hasher = new instance.Hasher()
  return hasher
}

type Pos = {
  x: number
  y: number
}

export interface HashTwoRespItem {
  val: string
  x: number
  y: number
}
export const HashTwo = async (chunk: Pos[]) => {
  const hash = await createHasher()
  const res = [] as HashTwoRespItem[]
  for (const c of chunk) {
    const val = hash.hash_two_i(BigInt(c.x), BigInt(c.y))
    res.push({
      val: val.toString(),
      x: c.x,
      y: c.y,
    })
  }
  return res
}
