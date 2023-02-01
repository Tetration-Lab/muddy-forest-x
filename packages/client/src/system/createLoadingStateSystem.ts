import { SyncState } from '@latticexyz/network'
import { defineComponentSystem } from '@latticexyz/recs'
import { NetworkLayer } from '../layer/network/types'


export function createLoadingStateSystem(network: NetworkLayer, cb: () => void) {
  const {
    world,
    components: { LoadingState },
  } = network

  defineComponentSystem(world, LoadingState, (update) => {
    console.log('==> LoadingState system: ', update.value[0])
    if (update.value[0]?.state === SyncState.LIVE) {
      cb()
    }
  })
}
