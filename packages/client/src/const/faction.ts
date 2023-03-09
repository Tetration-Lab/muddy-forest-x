import { IMAGE, SPRITE } from '../layer/phaser/constant/resource'

type ValueOf<T> = T[keyof T]

export const FACTION: {
  [key in number]: {
    name: string
    capitalPosition: {
      x: number
      y: number
    }
    capital: ValueOf<typeof SPRITE>
    ship: ValueOf<typeof IMAGE>
    signSrc: string
    color: string
  }
} = {
  10: {
    name: 'Ape Ape',
    capitalPosition: {
      x: 0,
      y: -250,
    },
    capital: SPRITE.APE_APE_CAPITAL,
    ship: IMAGE.APE_SHIP,
    signSrc: '/assets/images/ape_ape_sign.png',
    color: '#5076C3',
  },
  11: {
    name: 'Alien Ape',
    capitalPosition: {
      x: 500,
      y: 500,
    },
    capital: SPRITE.APE_ALINE_CAPITAL,
    ship: IMAGE.ALIEN_SHIP,
    signSrc: '/assets/images/ape_alien_sign.png',
    color: '#BEF6AF',
  },
  12: {
    name: 'AI Ape',
    capitalPosition: {
      x: -500,
      y: 500,
    },
    capital: SPRITE.APE_AI_CAPITAL,
    ship: IMAGE.AI_SHIP,
    signSrc: '/assets/images/ai_ape_sign.png',
    color: '#F091C8',
  },
}
