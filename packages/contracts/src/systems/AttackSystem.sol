// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { DestroyedComponent, ID as DID } from "components/DestroyedComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Level } from "libraries/LibLevel.sol";
import { Planet } from "libraries/LibPlanet.sol";
import { BASE_ENERGY } from "../constants/resources.sol";
import { EType } from "../constants/type.sol";
import { Type } from "libraries/LibType.sol";
import { Stat } from "libraries/LibStat.sol";

uint256 constant ID = uint256(keccak256("system.Attack"));

contract AttackSystem is System {
  struct Args {
    uint256 entity;
    uint256 targetEntity;
    uint64 energy;
    uint32 range;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    Type.assertNotDestroyedTuple(components, args.entity, args.targetEntity);
    Type.assertInit(components, args.entity);

    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.entity) == addressToEntity(msg.sender),
      "Not owner"
    );

    {
      // If planet = -> assert location
      if (Type.getType(components, args.entity) == uint32(EType.PLANET)) Planet.assertPlanetLocation(args.entity);
    }

    {
      // Deduct energy cost of attacking
      uint64 energyCost = Resource.attackEnergyCost(args.range);
      require(args.energy >= energyCost, "Too little energy to attack");
      Resource.deductEnergy(components, args.entity, args.energy);

      // Not init
      if (!TypeComponent(getAddressById(components, TID)).has(args.targetEntity)) {
        // Init planet first
        Planet.initPlanet(components, args.targetEntity);
      }

      // Already Init
      // Deduct energy from attack
      ResourceComponent.Resource memory energy = Resource.deductEnergyCap(
        components,
        args.targetEntity,
        Stat.calculateFinalEnergyReceived(components, args.entity, args.targetEntity, args.energy - energyCost)
      );

      uint32 targetTy = Type.getType(components, args.targetEntity);

      // If target energy = 0;
      if (energy.value == 0) {
        if (targetTy == uint32(EType.SPACESHIP)) {
          // If spaceship = destroy
          DestroyedComponent(getAddressById(components, DID)).set(args.targetEntity);
        } else if (targetTy == uint32(EType.PLANET)) {
          // If planet = capture
          OwnerComponent(getAddressById(components, OID)).set(args.targetEntity, addressToEntity(msg.sender));
        }
      }
    }
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }

  function executeTypedMulti(Args[] memory args) public returns (bytes[] memory output) {
    for (uint256 i = 0; i < args.length; ++i) {
      output[i] = execute(abi.encode(args[i]));
    }
  }
}
