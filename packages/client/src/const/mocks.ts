import { InventoryItemType, InventoryType } from '../component/game/GameActionBox/types/inventory'

export const MOCK_INVENTORY_ITEMS: InventoryItemType[] = [
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
