import { ReactNode } from 'react'

export const BASIC_HELP: {
  title: string
  logo: string
  description: {
    src: string
    text: ReactNode[]
  }
}[] = [
  {
    title: 'Spaceship Action',
    logo: 'assets/sprite/ai_ship.png',
    description: {
      src: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGZjNWZhODAxMzMzNzU1MzllNzFiYTllYjFlNDVlYmJlYTNlNjEzYiZjdD1n/ykHafvudkzhvyWbAnP/giphy.gif',
      text: [
        <>
          Every player owned a spaceship. The first actions that a player can do are to{' '}
          <span style={{ color: '#4BB543' }}>"move"</span> and <span style={{ color: '#D6432F' }}>"attack"</span>{' '}
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
      src: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTkwODdjNzE4ODYwNTg0MjllZmY4NTY0OTRhODg0MmYwYjkwMzJlOSZjdD1n/Sinx4UCCIVkEOhOsZl/giphy.gif',
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
      src: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzdiZjMyOGYwOTljNGNiYmFhMDE1NWI3MWQxY2JjYjc3Njk5Mjg4ZSZjdD1n/BpdMWCTWZyYr6yck52/giphy.gif',
      text: [
        <>
          Since planets can generate materials and use them to upgrade themselves, planet upgrading may use materials
          that the planet cannot generate. So, <span style={{ color: '#4BB543' }}>"interstellar transportation"</span>{' '}
          is the key to transferring materials between planets and spaceships.
        </>,
      ],
    },
  },
  {
    title: 'Extra Energy',
    logo: 'assets/svg/item-energy-icon.svg',
    description: {
      src: 'assets/images/help/energy.png',
      text: [
        <>
          A player can invade a low-level planet using a spaceship or another planet. On planets of a higher level, its
          energy capacity will be too strong to defeat. The player can transfer energy from their own planet to their
          spaceship and use the <span style={{ color: '#6395DB' }}>"extra energy"</span> to invade high-level planets,
          however the energy of the spaceship cannot regenerate itself.
        </>,
      ],
    },
  },
]
