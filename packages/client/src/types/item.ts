export interface Material {
  name: string
  imageUrl: string
  description: string
}

export interface Blueprint {
  name: string
  imageUrl: string
  description: string
  level: number
  materials: {
    [key in string]: number
  }
  bonus: {
    defense: number
    attack: number
    resources: {
      [key in string]: {
        cap: number
        rpb: number
      }
    }
  }
}
