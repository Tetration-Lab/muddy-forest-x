import { Hasher } from 'circuits/circuits'

export const getWasmInstance = async () => {
  return await import('circuits/circuits')
}

export const CreateHasher = async () => {
  const instance = await getWasmInstance()
  const hasher = new instance.Hasher()
  return hasher
}

export class HasherInstance {
  public instance: Hasher | null
  async init() {
    this.instance = await CreateHasher()
  }
}

export const HashTwo = async (a, b: string) => {
  const hash = await CreateHasher()
  return hash.hash_two(a, b)
}
