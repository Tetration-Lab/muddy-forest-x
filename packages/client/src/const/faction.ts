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
    signImg: string
    shipSpriteKey: string
  }
} = {
  10: {
    name: 'Ape',
    capitalPosition: {
      x: 0,
      y: -250,
    },
    capital: SPRITE.APE_APE_CAPITAL,
    ship: IMAGE.APE_SHIP,
    signSrc: '/assets/svg/faction-ape-ape.svg',
    color: '#5076C3',
    signImg: IMAGE.APE_APE_SIGN,
    shipSpriteKey: SPRITE.APE_SHIP,
  },
  11: {
    name: 'Alien Ape',
    capitalPosition: {
      x: 500,
      y: 500,
    },
    capital: SPRITE.APE_ALINE_CAPITAL,
    ship: IMAGE.ALIEN_SHIP,
    signSrc: '/assets/svg/faction-ape-alien.svg',
    color: '#BEF6AF',
    signImg: IMAGE.APE_ALIEN_SIGN,
    shipSpriteKey: SPRITE.ALIEN_SHIP,
  },
  12: {
    name: 'AI Ape',
    capitalPosition: {
      x: -500,
      y: 500,
    },
    capital: SPRITE.APE_AI_CAPITAL,
    ship: IMAGE.AI_SHIP,
    signSrc: '/assets/svg/faction-ape-ai.svg',
    color: '#F091C8',
    signImg: IMAGE.APE_AI_SIGN,
    shipSpriteKey: SPRITE.AI_SHIP,
  },
}
