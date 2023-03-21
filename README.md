# Muddy forest
![image](https://user-images.githubusercontent.com/11013287/216083359-0c5f49f3-0291-4417-b95d-21ea5e7c7906.png)

Welcome to Muddy forest the MMO RTS game repo. you can check out the game [here](https://dev-muddy.tetrationlab.com/)

## Table of content
- Usage
- Repo structure
- ECS
- Contribution

## Usage
```
yarn
yarn dev
```

## Repo structure
```
└── packages
    ├── circuits - ZK circuits
    │ ├── pkg
    │ └── src
    ├── client - Front end
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

## ECS
MUD and Entity Component System is the main idea of this repo. if you not familier with it you can read more [here](https://mud.dev/)

### Component
Component is main game data. read from preexisting component is recommended under this paradigm. writing into component would require careful consideration since it might break others part of the game.
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
ideally longer term we want this project to be open, composable, and permissionless (on some level). but in this early stage anyone can open PR into this repo to contribute to any part of the game. We will consider merge request in similar way to if this project is fully on chain with governance system.

- System that doesn't require write access to component that you're not the author will be merge without question. (similar to if you directly compose into the game after there's proper system RBAC)
- System that require write access to component that you're not the author will require concent from component author. (similar to RBAC too.)
- change to front end that user can turn on will be merge with out question. (similar to alternative FE or plugin)
- change to front end that effect every user will subject to some common sense check.
- Bug, Doc, Chore will be treat like others open source project.
 
follow [conventional commit specification](https://www.conventionalcommits.org/en/v1.0.0/) is recommended but not require.