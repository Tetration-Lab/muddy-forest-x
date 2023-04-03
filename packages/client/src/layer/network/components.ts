import { defineComponent, Type, World } from '@latticexyz/recs'
import {
  defineBoolComponent,
  defineCoordComponent,
  defineNumberComponent,
  defineStringComponent,
} from '@latticexyz/std-client'

export type Components = ReturnType<typeof setupComponents>

export const setupComponents = (world: World) => {
  return {
    Type: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.Type',
      },
    }),
    Position: defineComponent(
      world,
      {
        x: Type.String,
        y: Type.String,
      },
      {
        metadata: {
          contractId: 'component.Position',
        },
      },
    ),
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
    Faction: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.Faction',
      },
    }),
    Attack: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.Attack',
      },
    }),
    Defense: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.Defense',
      },
    }),
    //BaseBlueprint: defineComponent(
    //world,
    //{
    //level: Type.Number,
    //attack: Type.Number,
    //defense: Type.Number,
    //resources: Type.StringArray,
    //cost: Type.StringArray,
    //},
    //{
    //metadata: {
    //contractId: 'component.BaseBlueprint',
    //},
    //},
    //),
    BaseBlueprint: defineStringComponent(world, {
      metadata: {
        contractId: 'component.BaseBlueprint',
      },
    }),
    Blueprint: defineStringComponent(world, {
      metadata: {
        contractId: 'component.Blueprint',
      },
    }),
    BlueprintType: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.BlueprintType',
      },
    }),
    Building: defineComponent(
      world,
      {
        value: Type.StringArray,
      },
      {
        metadata: {
          contractId: 'component.Building',
        },
      },
    ),
    Cooldown: defineStringComponent(world, {
      metadata: {
        contractId: 'component.Cooldown',
      },
    }),
    Destroyed: defineBoolComponent(world, {
      metadata: {
        contractId: 'component.Destroyed',
      },
    }),
    Inventor: defineStringComponent(world, {
      metadata: {
        contractId: 'component.Inventor',
      },
    }),

    Level: defineComponent(
      world,
      {
        level: Type.Number,
        tier: Type.Number,
        multiplier: Type.Number,
      },
      {
        metadata: {
          contractId: 'component.Level',
        },
      },
    ),
    Research: defineComponent(
      world,
      {
        posMult: Type.Number,
        negMult: Type.Number,
      },
      {
        metadata: {
          contractId: 'component.Research',
        },
      },
    ),
    ResearchCount: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.ResearchCount',
      },
    }),
    Resource: defineComponent(
      world,
      {
        value: Type.Number,
        cap: Type.Number,
        rpb: Type.Number,
        lrt: Type.Number,
      },
      {
        metadata: {
          contractId: 'component.Resource',
        },
      },
    ),
    UpgradeCount: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.UpgradeCount',
      },
    }),
  }
}
