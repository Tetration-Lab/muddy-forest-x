import { createPerlin } from '@latticexyz/noise'
import { createWorld, EntityIndex } from '@latticexyz/recs'
import { createActionSystem, setupMUDNetwork, SetupContractConfig } from '@latticexyz/std-client'
import { SystemTypes } from 'contracts/types/SystemTypes'
import { SystemAbis } from 'contracts/types/SystemAbis.mjs'
import { createFaucetService, formatEntityID, GodID } from '@latticexyz/network'
import { setupComponents } from './components'
import { ethers, utils, Wallet } from 'ethers'
import { faucetUrl, initialGasPrice } from '../../config'
import { FACTION } from '../../const/faction'
import { enqueueSnackbar } from 'notistack'
import { parseEtherError } from '../../utils/utils'

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
    Object.entries(FACTION).forEach(async (e) => {
      await systems['system.SetupFaction'].executeTyped({
        capitalPosition: e[1].capitalPosition,
        name: e[1].name,
        id: Number(e[0]),
      })
    })
  }

  const setupName = async (entity: string, name: string) => {
    await systems['system.Name'].executeTyped({
      entity: entity,
      name,
    })
  }

  const move = async (entity: string, x: number, y: number) => {
    try {
      const tx = await systems['system.Move'].executeTyped({
        entity: entity,
        position: {
          x,
          y,
        },
      })

      enqueueSnackbar(`Move Queued`)
      tx.wait().then((_) => enqueueSnackbar(`Move successfully to ${x}, ${y}`))
      return tx
    } catch (err) {
      enqueueSnackbar(parseEtherError(err), { variant: 'error' })
      throw err
    }
  }

  const attack = async (entity: string, targetEntity: string, energy: number, range: number) => {
    console.log(targetEntity)
    try {
      const tx = await systems['system.Attack'].executeTyped({
        entity: entity,
        targetEntity,
        energy,
        range,
      })
      enqueueSnackbar(`Attack Queued`)
      tx.wait().then((_) => enqueueSnackbar(`Attack successfully with energy ${energy}`))
      return tx
    } catch (err) {
      enqueueSnackbar(parseEtherError(err), { variant: 'error' })
      throw err
    }
  }

  const spawn = async (factionId: number, name: string) => {
    await setupName(network.connectedAddress.get(), name)
    await systems['system.Spawn'].executeTyped({
      factionId: factionId,
      HQShipId: ethers.BigNumber.from(ethers.utils.randomBytes(32)),
    })
  }

  const debug = async () => {}
  // FOR DEV
  const w = window as any
  w.setupFaction = setupFaction
  w.debug = debug
  w.spawn = spawn
  w.move = move

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
      move,
      attack,
    },
    singletonIndex,
    playerIndex,
    connectedAddress,
  }

  return context
}
