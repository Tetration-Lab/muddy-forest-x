import { createFaucetService, formatEntityID, GodID } from '@latticexyz/network'
import { createPerlin } from '@latticexyz/noise'
import { createWorld } from '@latticexyz/recs'
import { createActionSystem, DecodedSystemCall, SetupContractConfig, setupMUDNetwork } from '@latticexyz/std-client'
import { SystemAbis } from 'contracts/types/SystemAbis.mjs'
import { SystemTypes } from 'contracts/types/SystemTypes'
import { ethers, utils } from 'ethers'
import { enqueueSnackbar } from 'notistack'
import { Subject } from 'rxjs'
import { faucetUrl, initialGasPrice } from '../../config'
import { BASE_BLUEPRINT } from '../../const/blueprint'
import { FACTION } from '../../const/faction'
import { parseEtherError } from '../../utils/utils'
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
  const { txQueue, systems, txReduced$, network, startSync, encoders, components, systemCallStreams } =
    await setupMUDNetwork<typeof _components, SystemTypes>(config, world, _components, SystemAbis, {
      initialGasPrice,
      fetchSystemCalls: true,
    })
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

  const setupBuildingBlueprint = async () => {
    await systems['system.SetupBaseBuildingBlueprint'].executeTyped({
      ids: Object.keys(BASE_BLUEPRINT).map((e) => +e),
      blueprints: Object.values(BASE_BLUEPRINT).map((e) => ({
        level: e.level,
        attack: e.bonus.attack,
        defense: e.bonus.defense,
        resources: Object.entries(e.bonus.resources).map((bonus) => ({
          resourceId: bonus[0],
          value: 0,
          cap: bonus[1].cap,
          rpb: bonus[1].rpb,
        })),
        cost: Object.entries(e.materials).map((mat) => ({
          resourceId: mat[0],
          value: mat[1],
          cap: 0,
          rpb: 0,
        })),
      })),
    })
  }

  const setupName = async (entity: string, name: string) => {
    return await systems['system.Name'].executeTyped({
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
    try {
      const tx = await systems['system.Attack'].executeTyped({
        entity: entity,
        targetEntity,
        energy,
        range,
      })
      enqueueSnackbar(`Attack Queued`)
      await tx.wait()
      enqueueSnackbar(`Attack successfully with energy ${energy}`)
      return tx
    } catch (err) {
      enqueueSnackbar(parseEtherError(err), { variant: 'error' })
      throw err
    }
  }

  const spawn = async (factionId: number, name: string) => {
    const nameTx = await setupName(network.connectedAddress.get(), name)
    const spawnTx = await systems['system.Spawn'].executeTyped({
      factionId: factionId,
      HQShipId: ethers.BigNumber.from(ethers.utils.randomBytes(32)),
    })
    return Promise.all([nameTx.wait(), spawnTx.wait()])
  }

  const initResources = async (entity: string, resources: string[]) => {
    await systems['system.InitResource'].executeTypedMulti(
      resources.map((e) => ({
        entity,
        resourceId: e,
      })),
    )
  }

  const send = async (
    entity: string,
    targetEntity: string,
    distance: number,
    resources: { amount: number; id: string }[],
  ) => {
    try {
      const tx = await systems['system.Send'].executeTyped({
        entity,
        targetEntity,
        range: distance,
        resources,
      })
      enqueueSnackbar(`Send Queued`)
      await tx.wait()
      enqueueSnackbar(`Send Successfully`)
      return tx
    } catch (err) {
      enqueueSnackbar(parseEtherError(err), { variant: 'error' })
      throw err
    }
  }

  const build = async (entity: string, researchId: string | number) => {
    try {
      console.log(entity, researchId)
      const tx = await systems['system.BuildBuilding'].executeTyped({
        planetEntity: entity,
        researchId,
      })
      enqueueSnackbar(`Build Queued`)
      await tx.wait()
      enqueueSnackbar(`Build Successfully`)
      return tx
    } catch (err) {
      enqueueSnackbar(parseEtherError(err), { variant: 'error' })
      throw err
    }
  }

  // FOR DEV
  const w = window as any
  w.setup = () => {
    setupFaction()
    setupBuildingBlueprint()
  }

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
      initResources,
      send,
      build,
    },
    singletonIndex,
    playerIndex,
    connectedAddress,
    systemCallStreams: systemCallStreams as Record<
      keyof SystemTypes,
      Subject<DecodedSystemCall<{ [key in keyof SystemTypes]: ethers.Contract }, typeof components>>
    >,
  }

  return context
}
