import { Material } from '../types/item'
import { ENERGY_ID } from './resources'

export const MATERIALS: { [key in string]: Material } = {
  '0x9f56a1af35c8caed4f9734f6062d93735763f6799f9a273891339650060de839': {
    name: 'Stellar Prism',
    imageUrl: '/assets/svg/materials/item1.svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  '0x9f56a1af35c8caed4f9734f6062d93735763f6799f9a273891339650060de83a': {
    name: 'Astral Nebula',
    imageUrl: '/assets/svg/materials/item2.svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}

export const ALL_MATERIALS: { [key in string]: Material } = {
  [ENERGY_ID]: {
    name: 'Energy',
    imageUrl: '/assets/svg/item-energy-icon.svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  ...MATERIALS,
}

export const MATERIALS_BY_NAME = {
  'Stellar Prism': '0x9f56a1af35c8caed4f9734f6062d93735763f6799f9a273891339650060de839',
  'Astral Nebula': '0x9f56a1af35c8caed4f9734f6062d93735763f6799f9a273891339650060de83a',
}
