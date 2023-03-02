import { createPerlin } from '@latticexyz/noise'
import { createWorld, EntityIndex } from '@latticexyz/recs'
import { createActionSystem, setupMUDNetwork, SetupContractConfig } from '@latticexyz/std-client'
import { SystemTypes } from 'contracts/types/SystemTypes'
import { SystemAbis } from 'contracts/types/SystemAbis.mjs'
import { createFaucetService, formatEntityID, GodID } from '@latticexyz/network'
import { setupComponents } from './components'
import { ethers, utils, Wallet } from 'ethers'
import { faucetUrl, initialGasPrice } from '../../config'

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
  >(config, world, _components, SystemAbis, { initialGasPrice, fetchSystemCalls: true })
  const connectedAddress = network.connectedAddress.get()
  const playerIndex = world.registerEntity({ id: formatEntityID(network.connectedAddress.get()) })

  // --- FAUCET SETUP ---
  const faucetIfBroke = async () => {
    if (faucetUrl) {
      const faucet = createFaucetService(faucetUrl)
      const playerIsBroke = (await network.signer.get()?.getBalance())?.lte(utils.parseEther('0.005'))
      if (playerIsBroke) {
        console.info('[Dev Faucet] Dripping funds to player')
        const address = network.connectedAddress.get()
        address && (await faucet?.dripDev({ address }))
      } else {
        console.info('[Dev Faucet] player not broke')
      }
    }
  }
  faucetIfBroke()

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
      entity: network.connectedAddress.get(),
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
    connectedAddress,
  }

  return context
}
