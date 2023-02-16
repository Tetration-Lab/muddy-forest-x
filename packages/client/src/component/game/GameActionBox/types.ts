/* -------------- Inventory -------------- */
export enum InventoryTabType {
  Inventory = 'inventory',
  Crafting = 'crafting',
}

export enum InventoryType {
  Blueprint = 'Blueprint',
  Material = 'Material',
}

export interface IInventoryItem {
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

/* -------------- Build -------------- */
export enum BuildTabType {
  Build = 'build',
  Upgrade = 'upgrade',
}

export enum BuildItemType {
  Available = 'available',
  NotAvailable = 'not available',
}

export interface IBuildItem {
  id: string
  name: string
  imageUrl: string
  description: string
  type: BuildItemType
}
