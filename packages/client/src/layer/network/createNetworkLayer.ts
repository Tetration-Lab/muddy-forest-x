import { createPerlin } from '@latticexyz/noise'
import { createWorld } from '@latticexyz/recs'
import { createActionSystem, setupMUDNetwork, SetupContractConfig } from '@latticexyz/std-client'
import { defineNumberComponent } from '@latticexyz/std-client'

import { SystemTypes } from 'contracts/types/SystemTypes'
import { SystemAbis } from 'contracts/types/SystemAbis.mjs'

export async function createNetworkLayer(config: SetupContractConfig) {
  const perlin = await createPerlin()

  // --- WORLD ----------------------------------------------------------------------
  const world = createWorld()
  const uniqueWorldId = config.chainId + config.worldAddress

  // --- COMPONENTS -----------------------------------------------------------------
  const components = {
    Counter: defineNumberComponent(world, {
        metadata: {
          contractId: "component.Counter",
        },
      }),
  }
  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders } = await setupMUDNetwork<
    typeof components,
    SystemTypes
  >(config, world, components, SystemAbis)

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$)
  

  // --- API ------------------------------------------------------------------------

  const increment = () =>{
    systems["system.Increment"].executeTyped("0x00");
  }
  // FOR DEV
  const w = window as any
  w.increment = increment

  // --- CONTEXT --------------------------------------------------------------------
  const context = {
    perlin,
    uniqueWorldId,
    world,
    components,
    txQueue,
    systems,
    txReduced$,
    startSync,
    network,
    encoders,
    actions,
    api: { },
  }

  return context
}
