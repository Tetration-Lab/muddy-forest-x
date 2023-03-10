// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Level } from "libraries/LibLevel.sol";
import { Type } from "libraries/LibType.sol";
import { ADVANCED_CAP, ADVANCED_REGEN } from "../constants/resources.sol";
import { EType } from "../constants/type.sol";

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
      OwnerComponent(getAddressById(components, OID)).getValue(args.entity) == addressToEntity(msg.sender),
      "Not owner"
    );
    require(Resource.isInAdvancedResource(args.resourceId), "Not in advanced resource id");
    Type.assertInit(components, args.entity);
    uint32 ty = Type.getType(components, args.entity);

    ResourceComponent rC = ResourceComponent(getAddressById(components, RID));
    uint256 id = getResourceEntity(args.entity, args.resourceId);

    uint32 mult = Level.getLevelResourceStorageMultiplier(components, args.entity);

    if (ty == uint32(EType.PLANET)) {
      // Storage
      rC.regen(args.entity);
      ResourceComponent.Resource memory r = rC.getValue(args.entity);
      if (Resource.isContainResource(args.entity, args.resourceId)) r.rpb = (ADVANCED_REGEN * mult) / 200;
      r.cap = (ADVANCED_CAP * mult) / 100;
      rC.set(args.entity, r);
    } else if (ty == uint32(EType.SPACESHIP) || ty == uint32(EType.HQSHIP)) {
      // Non storage
      ResourceComponent.Resource memory r = rC.getValue(args.entity);
      rC.regen(args.entity);
      r.cap = (ADVANCED_CAP * mult) / 100;
      rC.set(args.entity, r);
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
