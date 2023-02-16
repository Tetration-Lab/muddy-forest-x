// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { BuildingBlueprintComponent, ID as BBID } from "components/BuildingBlueprintComponent.sol";
import { BuildingComponent, ID as BID } from "components/BuildingComponent.sol";
import { Type } from "libraries/LibType.sol";
import { Stat } from "libraries/LibStat.sol";
import { Level } from "libraries/LibLevel.sol";
import { Resource } from "libraries/LibResource.sol";
import { EType } from "../constants/type.sol";
import { MAX_BUILDING_PER_LEVEL } from "../constants/planet.sol";

uint256 constant ID = uint256(keccak256("system.BuildBuilding"));

contract BuildBuildingSystem is System {
  struct Args {
    uint256 planetEntity;
    uint256 blueprintId;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    require(Type.getType(components, args.planetEntity) == uint32(EType.PLANET), "Not planet");
    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.planetEntity) != addressToEntity(msg.sender),
      "Not owner"
    );

    BuildingBlueprintComponent bb = BuildingBlueprintComponent(getAddressById(components, BBID));
    require(bb.has(args.blueprintId), "Blueprint not found");
    BuildingBlueprintComponent.BuildingBlueprint memory blueprint = bb.getValue(args.blueprintId);

    for (uint256 i = 0; i < blueprint.cost.length; ++i) {
      Resource.deduct(components, args.planetEntity, blueprint.cost[i].resourceId, blueprint.cost[i].value);
    }

    if (blueprint.attack > 0) {
      Stat.incrementAttackMult(components, args.planetEntity, blueprint.attack);
    }

    if (blueprint.defense > 0) {
      Stat.incrementDefenseMult(components, args.planetEntity, blueprint.defense);
    }

    {
      ResourceComponent r = ResourceComponent(getAddressById(components, RID));
      for (uint256 i = 0; i < blueprint.resources.length; ++i) {
        BuildingBlueprintComponent.Resource memory rA = blueprint.resources[i];
        uint256 id = getResourceEntity(args.planetEntity, rA.resourceId);
        if (r.has(id)) {
          r.regen(id);
          ResourceComponent.Resource memory resource = r.getValue(id);
          resource.cap += rA.cap;
          resource.rpb += rA.rpb;
          r.set(id, resource);
        }
      }
    }

    {
      BuildingComponent b = BuildingComponent(getAddressById(components, BID));
      uint256[] memory buildings = b.getValue(args.planetEntity);
      uint32 maxBuilding = MAX_BUILDING_PER_LEVEL(Level.getLevel(components, args.planetEntity).level);
      require(buildings.length < maxBuilding, "Maximum building reached");

      uint256[] memory newBuildings = new uint256[](buildings.length + 1);
      for (uint256 i = 0; i < buildings.length; ++i) {
        newBuildings[i] = buildings[i];
      }
      newBuildings[buildings.length] = args.blueprintId;

      b.set(args.planetEntity, buildings);
    }
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
