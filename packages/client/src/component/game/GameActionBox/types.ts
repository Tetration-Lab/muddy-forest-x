export enum InventoryType {
  Blueprint = 'Blueprint',
  Material = 'Material',
}

export type InventoryItemType = {
  id: string
  name: string
  imageUrl: string
  description: string
  type: InventoryType
}

export enum ItemVisibility {
  Visible = 'visible',
  Dimmed = 'dimmed',
}
