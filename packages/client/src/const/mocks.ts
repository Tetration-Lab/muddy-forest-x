import {
  BuildItemType,
  IBuildItem,
  IInventoryItem,
  InventoryType,
} from '../component/game/ActionBox/GameActionBox/types'

export const MOCK_INVENTORY_ITEMS: IInventoryItem[] = [
  {
    id: '1',
    name: 'item1',
    imageUrl: './assets/svg/mock-items/item1.svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    type: InventoryType.Material,
  },
  {
    id: '2',
    name: 'item2',
    imageUrl: './assets/svg/mock-items/item2.svg',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
    type: InventoryType.Material,
  },
  {
    id: '3',
    name: 'item3',
    imageUrl: './assets/svg/mock-items/item3.svg',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
    type: InventoryType.Blueprint,
  },
  {
    id: '4',
    name: 'item4',
    imageUrl: './assets/svg/mock-items/item4.svg',
    description: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias.',
    type: InventoryType.Blueprint,
  },
  {
    id: '5',
    name: 'item5',
    imageUrl: './assets/svg/mock-items/item5.svg',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    type: InventoryType.Blueprint,
  },
  {
    id: '6',
    name: 'item6',
    imageUrl: './assets/svg/mock-items/item6.svg',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    type: InventoryType.Blueprint,
  },
]

export const MOCK_BUILD_ITEMS: IBuildItem[] = [
  {
    id: '1',
    name: 'build item1',
    imageUrl: './assets/svg/mock-items/build-item1.svg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    type: BuildItemType.Available,
    requireItems: [
      {
        ...MOCK_INVENTORY_ITEMS[0],
        amount: 1,
      },
      {
        ...MOCK_INVENTORY_ITEMS[1],
        amount: 1,
      },
      {
        ...MOCK_INVENTORY_ITEMS[2],
        amount: 2,
      },
    ],
  },
  {
    id: '2',
    name: 'build item2',
    imageUrl: './assets/svg/mock-items/build-item2.svg',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
    type: BuildItemType.Available,
  },
  {
    id: '3',
    name: 'build item3',
    imageUrl: './assets/svg/mock-items/build-item3.svg',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
    type: BuildItemType.Available,
  },
  {
    id: '4',
    name: 'build item4',
    imageUrl: './assets/svg/mock-items/build-item4.svg',
    description: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias.',
    type: BuildItemType.Available,
  },
  {
    id: '5',
    name: 'build item5',
    imageUrl: './assets/svg/mock-items/build-item5.svg',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    type: BuildItemType.NotAvailable,
  },
  {
    id: '6',
    name: 'build item6',
    imageUrl: './assets/svg/mock-items/build-item6.svg',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    type: BuildItemType.NotAvailable,
  },
  {
    id: '7',
    name: 'build item7',
    imageUrl: './assets/svg/mock-items/build-item7.svg',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    type: BuildItemType.NotAvailable,
  },
]
