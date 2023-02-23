import { createPerlin } from '@latticexyz/noise'
import { createWorld } from '@latticexyz/recs'
import { createActionSystem, setupMUDNetwork, SetupContractConfig } from '@latticexyz/std-client'
import { SystemTypes } from 'contracts/types/SystemTypes'
import { SystemAbis } from 'contracts/types/SystemAbis.mjs'
import { GodID } from '@latticexyz/network'
import { setupComponents } from './components'

export async function createNetworkLayer(config: SetupContractConfig) {
  const perlin = await createPerlin()

  // --- WORLD ----------------------------------------------------------------------
  const world = createWorld()
  const uniqueWorldId = config.chainId + config.worldAddress
  const singletonIndex = world.registerEntity({ id: GodID })

  // --- COMPONENTS -----------------------------------------------------------------
  const _components = setupComponents(world)
  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders, components } = await setupMUDNetwork<
    typeof _components,
    SystemTypes
  >(config, world, _components, SystemAbis)

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$)
  // --- API ------------------------------------------------------------------------

  const setupFaction = async () => {
    await systems['system.SetupFaction'].executeTyped({
      capitalPosition: {
        x: 100,
        y: 100,
      },
      name: 'Ape Ape',
      id: 10,
    })
    await systems['system.SetupFaction'].executeTyped({
      capitalPosition: {
        x: 100,
        y: -100,
      },
      name: 'AI Ape',
      id: 11,
    })

    await systems['system.SetupFaction'].executeTyped({
      capitalPosition: {
        x: -100,
        y: 100,
      },
      name: 'Alien Ape',
      id: 12,
    })
  }

  const debug = async () => {}
  // FOR DEV
  const w = window as any
  w.setupFaction = setupFaction
  w.debug = debug

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
