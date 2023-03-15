// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID } from "components/ResourceComponent.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Position } from "libraries/LibPosition.sol";
import { Type } from "libraries/LibType.sol";

uint256 constant ID = uint256(keccak256("system.Send"));

contract SendSystem is System {
  struct SentResource {
    uint256 id;
    uint64 amount;
  }

  struct Args {
    uint256 entity;
    uint256 targetEntity;
    uint64 range;
    SentResource[] resources;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    Type.assertNotDestroyedTuple(components, args.entity, args.targetEntity);

    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.entity) == addressToEntity(msg.sender),
      "Not owner"
    );

    {
      uint64 weight = 0;
      for (uint256 i = 0; i < args.resources.length; ++i) {
        SentResource memory sr = args.resources[i];
        if (Resource.isInAdvancedResource(sr.id)) {
          weight += sr.amount;
        }
      }
      // no upgrade system for now
      uint64 energyCost = Resource.sendEnergyCost(args.range, weight, 0);
      Resource.deductEnergy(components, args.entity, energyCost);
    }

    for (uint256 i = 0; i < args.resources.length; ++i) {
      SentResource memory sr = args.resources[i];
      Resource.transfer(components, args.entity, args.targetEntity, sr.id, sr.amount);
    }
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }

  function executeTypedMulti(Args[] memory args) public returns (bytes[] memory output) {
    for (uint256 i = 0; i < args.length; ++i) {
      execute(abi.encode(args[i]));
    }
  }
}
