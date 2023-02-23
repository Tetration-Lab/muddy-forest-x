import { createPerlin } from '@latticexyz/noise'
import { createWorld } from '@latticexyz/recs'
import { createActionSystem, setupMUDNetwork, SetupContractConfig } from '@latticexyz/std-client'
import { defineNumberComponent } from '@latticexyz/std-client'

import { SystemTypes } from 'contracts/types/SystemTypes'
import { SystemAbis } from 'contracts/types/SystemAbis.mjs'
import { GodID } from '@latticexyz/network'
import { Wallet } from 'ethers'

export async function createNetworkLayer(config: SetupContractConfig) {
  const perlin = await createPerlin()

  // --- WORLD ----------------------------------------------------------------------
  const world = createWorld()
  const uniqueWorldId = config.chainId + config.worldAddress
  const singletonIndex = world.registerEntity({ id: GodID })

  // --- COMPONENTS -----------------------------------------------------------------
  const _components = {
    Counter: defineNumberComponent(world, {
      metadata: {
        contractId: 'component.Counter',
      },
    }),
  }
  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders, components } = await setupMUDNetwork<
    typeof _components,
    SystemTypes
  >(config, world, _components, SystemAbis)

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$)
  // --- API ------------------------------------------------------------------------

  const increment = () => {
    systems['system.Increment'].executeTyped('0x00')
  }

  const setupFaction = async () => {
    const w = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
    const system = await systems['system.SetupFaction'].connect(w)

    system.executeTyped({
      capitalPosition: {
        x: 100,
        y: 100,
      },
      name: 'Ape Ape',
      id: 10, // random
    })
  }
  // FOR DEV
  const w = window as any
  w.increment = increment
  w.setupFaction = setupFaction

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
    api: {
      setupFaction,
    },
    singletonIndex,
  }

  return context
}
