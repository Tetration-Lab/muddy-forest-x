// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { PerlinComponent, ID as PLID } from "components/PerlinComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Level } from "libraries/LibLevel.sol";
import { Type } from "libraries/LibType.sol";
import { ADVANCED_CAP_REGEN } from "../constants/resources.sol";
import { PLANET } from "../constants/type.sol";

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
    Type.assertInit(components, args.entity);
    uint32 ty = Type.getType(components, args.entity);

    ResourceComponent rC = ResourceComponent(getAddressById(components, RID));
    uint256 id = getResourceEntity(args.entity, args.resourceId);
    require(!rC.has(id), "Should not init before");

    uint32 mult = Level.getLevelResourceStorageMultiplier(components, args.entity);
    (uint64 baseCap, uint32 baseRegen) = ADVANCED_CAP_REGEN(args.resourceId);

    if (ty == PLANET) {
      // Storage
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
      rC.set(
        args.entity,
        ResourceComponent.Resource(0, (baseCap * mult) / 100, (baseRegen * mult) / 100, uint32(block.timestamp), 0)
      );
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
