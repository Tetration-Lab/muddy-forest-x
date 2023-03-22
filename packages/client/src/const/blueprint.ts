import { Blueprint } from '../types/item'
import { MATERIALS_BY_NAME } from './materials'
import { ENERGY_ID } from './resources'

export const BASE_BLUEPRINT: {
  [key: number]: Blueprint
} = {
  0x101: {
    name: 'Satellite',
    description: 'A normal satellite',
    imageUrl: '/assets/svg/buildings/build-item2.svg',
    level: 1,
    materials: {
      [ENERGY_ID]: 10000,
      [MATERIALS_BY_NAME['Stellar Prism']]: 200,
    },
    bonus: {
      attack: 500, // additional 5%
      defense: 0,
      resources: {
        [ENERGY_ID]: {
          cap: 0,
          rpb: 1000,
        },
      },
    },
  },
  0x102: {
    name: 'Transmitter',
    description: 'A normal transmitter',
    imageUrl: '/assets/svg/buildings/build-item1.svg',
    level: 1,
    materials: {
      [ENERGY_ID]: 10000,
      [MATERIALS_BY_NAME['Astral Nebula']]: 200,
    },
    bonus: {
      attack: 0, // additional 5%
      defense: 500,
      resources: {
        [ENERGY_ID]: {
          cap: 5000,
          rpb: 500,
        },
      },
    },
  },
}
