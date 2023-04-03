# Muddy forest

![image](https://user-images.githubusercontent.com/11013287/216083359-0c5f49f3-0291-4417-b95d-21ea5e7c7906.png)

Welcome to Muddy forest the MMO RTS game repo. you can check out the game [here](https://muddyforest.tetrationlab.com/)

## Project Directory Structure

```
└── packages
    ├── circuits - ZK circuits written by Rust using Arkworks
    │ ├── pkg - WASM binding package
    │ ├── out - Circuit's PK, VK, and Solidity verifier
    │ └── src - Circuit's source code
    ├── client - TS Front end
    │ ├── nginx
    │ ├── public
    │ └── src
    └── contracts - Core game logic
        ├── src
        ├── cache
        ├── out
        ├── abi
        └── types
```

Currently, the zk verifier of our game is yet implemented in the contracts, so all of the actions in-game is not validated with verifier.

Checkout

- [Circuit README](/packages/circuits/README.md) for more information about ZK circuits, crypto primitive, and proving system we used and instructions to regenerate keys or modify circuits.

## Usage

### ENVs

Do this when initilizing the project or if you want to switch the deployment mode.

#### Local

```
cp packages/client/.env.loc packages/client/.env
```

#### Production (Lattice-chain contracts)

```
cp packages/client/.env.prod packages/client/.env
```

### Running Nodes And Clients

```
yarn
yarn dev
```

## ECS

MUD and Entity Component System is the main idea of this repo. if you not familier with it you can read more [here](https://mud.dev/)

### Component

Component is main game data. Read from preexisting component is recommended under this paradigm. Writing into component would require careful consideration since it might break others part of the game.

```
Attack
Cooldown
Level
Research
BaseBlueprint
Defense
Location
ResearchCount
Blueprint
Destroyed
Name
Resource
BlueprintType
Faction
Owner
Type
Building
Inventor
Position
UpgradeCount
```

### System

```
AttackSystem
NameSystem
SetupBaseShipBlueprintSystem
BuildBuildingSystem
SetupBaseShipUpgradeBlueprintSystem
BuildShipSystem
ResearchSystem
SetupFactionSystem
InitResourceSystem
SendSystem
SpawnSystem
MoveSystem
SetupBaseBuildingBlueprintSystem
UpgradeShipSystem
```

### Contribution

Ideally longer term we want this project to be open, composable, and permissionless (on some level). But in this early stage anyone can open PR into this repo to contribute to any part of the game. We will consider merge request in similar way to if this project is fully on chain with governance system.

- System that doesn't require write access to component that you're not the author will be merge without question. (similar to if you directly compose into the game after there's proper system RBAC)
- System that require write access to component that you're not the author will require concent from component author. (similar to RBAC too.)
- Change to front end that user can turn on will be merge with out question. (similar to alternative FE or plugin)
- Change to front end that effect every user will subject to some common sense check.
- Bug, Doc, Chore will be treat like others open source project.

follow [conventional commit specification](https://www.conventionalcommits.org/en/v1.0.0/) is recommended but not required.
