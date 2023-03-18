import { ReactNode } from 'react'

export const BASIC_HELP: {
  title: string
  logo: string
  description: {
    image: string
    text: ReactNode[]
  }
}[] = [
  {
    title: 'Spaceship Action',
    logo: 'assets/sprite/ai-ship.png',
    description: {
      image: 'assets/images/help.png',
      text: [
        <>
          Every player owned a spaceship. The first actions that a player can do are to{' '}
          <span style={{ color: '#4BB543' }}>"move"</span> and <span style={{ color: '#D6432F' }}>"attack"</span>
          entities. The player can move to their desired position and is also able to attack entities to expand their
          fractions and be the first on the leaderboard.
        </>,
      ],
    },
  },
  {
    title: 'Attack & Planet Invasion',
    logo: 'assets/svg/attack-icon.svg',
    description: {
      image: 'assets/images/help.png',
      text: [
        <>
          The player can build and upgrade their own planets and faction planets by using{' '}
          <span style={{ color: '#FFD700' }}>"materials"</span> that can be gathered from planets. Each planet can
          generate varying materials, which is why the player has to conquer as many planets as possible.
        </>,
      ],
    },
  },
  {
    title: 'Interstellar Transportation',
    logo: 'assets/svg/transfer-icon.svg',
    description: {
      image: 'assets/images/help.png',
      text: [
        <>
          Since planets can generate materials and use them to upgrade themselves, planet upgrading may use materials
          that the planet cannot generate. So, <span style={{ color: '#4BB543' }}>"interstellar transportation"</span>{' '}
          is the key to transferring materials between planets and spaceships.
        </>,
      ],
    },
  },
]
