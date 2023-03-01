import { createPerlin } from '@latticexyz/noise'
import { createWorld, EntityIndex, EntityIndex } from '@latticexyz/recs'
import { createActionSystem, setupMUDNetwork, SetupContractConfig } from '@latticexyz/std-client'
import { SystemTypes } from 'contracts/types/SystemTypes'
import { SystemAbis } from 'contracts/types/SystemAbis.mjs'
import { formatEntityID, GodID } from '@latticexyz/network'
import { setupComponents } from './components'
import { ethers, Wallet } from 'ethers'

export async function createNetworkLayer(config: SetupContractConfig) {
  console.log(config, 'config')
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
  const playerIndex = world.registerEntity({ id: formatEntityID(network.connectedAddress.get()) })

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$)
  // --- API ------------------------------------------------------------------------

  const setupFaction = async () => {
    await systems['system.SetupFaction'].executeTyped({
      capitalPosition: {
        x: 0,
        y: -250,
      },
      name: 'Ape Ape',
      id: 10,
    })
    await systems['system.SetupFaction'].executeTyped({
      capitalPosition: {
        x: -500,
        y: 500,
      },
      name: 'AI Ape',
      id: 11,
    })

    await systems['system.SetupFaction'].executeTyped({
      capitalPosition: {
        x: 500,
        y: 500,
      },
      name: 'Alien Ape',
      id: 12,
    })
  }
  const setupName = async (name: string) => {
    await systems['system.Name'].executeTyped({
      entityId: playerIndex,
      name,
    })
  }

  const spawn = async (factionId: number, HQShipId: ethers.BigNumber) => {
    console.log(systems)
    await systems['system.Spawn'].executeTyped({
      factionId: factionId,
      HQShipId: HQShipId.toBigInt(),
    })
  }

  const debug = async () => {}
  // FOR DEV
  const w = window as any
  w.setupFaction = setupFaction
  w.debug = debug
  w.spawn = spawn

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
      spawn,
      setupName,
    },
    singletonIndex,
    playerIndex,
  }

  return context
}
