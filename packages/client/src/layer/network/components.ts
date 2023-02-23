import { World } from '@latticexyz/recs'
import { defineCoordComponent, defineNumberComponent, defineStringComponent } from '@latticexyz/std-client'

export const setupComponents = (world: World) => {
  return {
    Type: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.Type',
      },
    }),
    Position: defineCoordComponent(world, {
      metadata: {
        contractId: 'component.Position',
      },
    }),
    Name: defineStringComponent(world, {
      metadata: {
        contractId: 'component.Name',
      },
    }),
    Owner: defineStringComponent(world, {
      metadata: {
        contractId: 'component.Owner',
      },
    }),
  }
}
