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
      val: val.toLowerCase(),
      x: c.x,
      y: c.y,
    })
  }
  return res
}

export const HashChunk = async (
  CHUNK_WIDTH_SIZE: number,
  CHUNK_HEIGHT_SIZE: number,
  currentChunkX: number,
  currentChunkY: number,
) => {
  const positions = []
  for (let height = 0; height < CHUNK_HEIGHT_SIZE; height++) {
    for (let width = 0; width < CHUNK_WIDTH_SIZE; width++) {
      positions.push({
        x: CHUNK_WIDTH_SIZE * currentChunkX + width,
        y: CHUNK_HEIGHT_SIZE * currentChunkY + height,
      })
    }
  }
  return await HashTwo(positions)
}
