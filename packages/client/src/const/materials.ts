import { Material } from '../types/item'

export const MATERIALS: { [key in string]: Material } = {
  '0x9f56a1af35c8caed4f9734f6062d93735763f6799f9a273891339650060de839': {
    name: 'Iridium',
    imageUrl: './assets/svg/materials/item1.svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  '0x9f56a1af35c8caed4f9734f6062d93735763f6799f9a273891339650060de83a': {
    name: 'Plutonium',
    imageUrl: './assets/svg/materials/item2.svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}