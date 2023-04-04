# Client

Muddy Forest client is written using Vite, React, MUI, and Phaser.

## ENV

There's some parameters configurable using Vite's env in `.env`.

```
VITE_INITIAL_GAS_PRICE=
VITE_RPC=
VITE_WS=
VITE_CHAIN_ID=
VITE_SNAPSHOT=
VITE_INITIAL_BLOCK_NUMBER=
VITE_WORLD=
VITE_DEV=
VITE_FAUCET=
```

Additionally, there's `.env` files for multiple deployment types.

- `.env.loc` for local deployment.
- `.env.staging` and `.env.lattice` for staging build using contracts in Lattice chain.
- `.env.prod` for production build using contracts in Lattice chain.

## Project Directory

```
├── public
│   └── assets
│       ├── audio // Audio
│       ├── bg // Background Image
│       ├── images // Images
│       │   ├── help
│       │   └── intro
│       ├── sprite // In-game sprites
│       ├── svg // Icons
│       │   ├── buildings
│       │   ├── materials
│       │   └── medal
│       └── ui
└── src
    ├── @types
    ├── component
    │   ├── ToolButton
    │   ├── common
    │   └── game
    │       ├── ActionBox
    │       ├── Modals
    │       ├── Profile
    │       └── common
    ├── const
    ├── css
    ├── hook
    ├── layer
    │   ├── network // MUD layer
    │   ├── phaser // Phaser layer
    │   │   ├── anim
    │   │   ├── config
    │   │   ├── constant
    │   │   ├── gameobject
    │   │   ├── scene
    │   │   └── utils
    │   └── ui // React-MUI layer
    ├── miner // Hashing-related functions and workers
    ├── page
    │   └── Intro
    ├── router
    ├── store
    ├── system
    ├── themes
    ├── types
    └── utils
```

## Game Assets

All game assets are in `public/assets/` directory.
