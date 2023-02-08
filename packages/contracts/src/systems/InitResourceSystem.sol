// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { StorageComponent, ID as SID } from "components/StorageComponent.sol";
import { PerlinComponent, ID as PLID } from "components/PerlinComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Level } from "libraries/LibLevel.sol";
import { ADVANCED_CAP_REGEN } from "../constants/resources.sol";

uint256 constant ID = uint256(keccak256("system.InitResource"));

contract InitResourceSystem is System {
  struct Args {
    uint256 entity;
    uint256 resourceId;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.entity) != addressToEntity(msg.sender),
      "Not owner"
    );
    require(Resource.isInAdvancedResource(args.resourceId), "Not in advanced resource id");

    ResourceComponent rC = ResourceComponent(getAddressById(components, RID));
    uint256 id = getResourceEntity(args.entity, args.resourceId);
    require(!rC.has(id), "Should not init before");

    if (StorageComponent(getAddressById(components, SID)).has(args.entity)) {
      // Storage
      uint32 mult = Level.getLevelResourceStorageMultiplier(components, args.entity);
      (uint64 baseCap, uint32 baseRegen) = ADVANCED_CAP_REGEN(args.resourceId);
      rC.regen(args.entity);
      ResourceComponent.Resource memory r = rC.getValue(args.entity);
      r.cap = (baseCap * mult) / 100;
      r.rpb = (baseRegen * mult) / 100;
    } else {
      // Non storage
      require(
        Resource.isContainResource(
          args.entity,
          PerlinComponent(getAddressById(components, PLID)).getValue(args.entity),
          args.resourceId
        ),
        "Resource not contained in this entity"
      );
      (uint64 baseCap, uint32 baseRegen) = ADVANCED_CAP_REGEN(args.resourceId);
      rC.set(args.entity, ResourceComponent.Resource(0, baseCap, baseRegen, uint32(block.timestamp), 0));
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
