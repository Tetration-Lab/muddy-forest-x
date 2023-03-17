import { getComponentValue } from '@latticexyz/recs'
import { NetworkLayer } from '../layer/network/types'

export interface CreateCheckFractionSystemParam {
  network: NetworkLayer
  gotoGame: () => void
  gotoIntroPage: () => void
}

export function createCheckFractionSystem({ network, gotoGame, gotoIntroPage }: CreateCheckFractionSystemParam) {
  const {
    components: { Faction },
  } = network

  const fraction = getComponentValue(Faction, network.playerIndex)
  console.log('fraction', fraction, fraction != null)
  if (fraction) {
    gotoGame()
  } else {
    gotoIntroPage()
  }
}
