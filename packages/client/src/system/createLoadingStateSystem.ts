import { SyncState } from '@latticexyz/network'
import { defineComponentSystem } from '@latticexyz/recs'
import { NetworkLayer } from '../layer/network/types'

type CallbackFunction = (_state: number, _msg: string, _percentage: number) => void

export function createLoadingStateSystem(network: NetworkLayer, cb: CallbackFunction) {
  const {
    world,
    components: { LoadingState },
  } = network

  defineComponentSystem(world, LoadingState, (update) => {
    const { state, msg, percentage } = update.value[0]
    const _s = state as number
    cb(_s, msg, percentage)
  })
}
