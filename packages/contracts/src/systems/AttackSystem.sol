// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { PerlinComponent, ID as PLID } from "components/PerlinComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Level } from "libraries/LibLevel.sol";
import { Planet } from "libraries/LibPlanet.sol";
import { BASE_ENERGY } from "../constants/resources.sol";

uint256 constant ID = uint256(keccak256("system.Attack"));

contract AttackSystem is System {
  struct Args {
    uint256 entity;
    uint256 targetEntity;
    uint32 targetPerlin;
    uint64 energy;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.entity) != addressToEntity(msg.sender),
      "Not owner"
    );

    {
      // Deduct energy cost of attacking
      uint64 energyCost = Resource.sendEnergyCost(args.range);
      Resource.deductEnergy(components, args.entity, energyCost);
    }

    if (!TypeComponent(getAddressById(components, SID)).has(args.targetEntity)) {
      // Planet

      // Not init
      {
        // Init planet first
        Planet.initPlanet(components, args.targetEntity, args.targetPerlin);
      }

      // Already Init
      // Deduct energy from attack
      Resource.deductEnergy(args.entity, args.energy);
      Resource.deductEnergyCap(args.targetEntity, args.energy);
      {
        // If target energy = 0; capture
        ResourceComponent.Resource energy = Resource.getResource(components, args.targetEntity, BASE_ENERGY);
        if (energy.value == 0) {
          OwnerComponent(getAddressById(components, OID)).set(args.targetEntity, addressToEntity(msg.sender));
        }
      }
    } else {
      uint32 ty = TypeComponent(getAddressById(components, SID)).getValue(args.entity);
      // Other entity
      // Deduct energy from attack
      Resource.deductEnergy(args.entity, args.energy);
      Resource.deductEnergyCap(args.targetEntity, args.energy);
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
