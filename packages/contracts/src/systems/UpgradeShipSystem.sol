// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { BaseBlueprintComponent, ID as BBID } from "components/BaseBlueprintComponent.sol";
import { Type } from "libraries/LibType.sol";
import { Stat } from "libraries/LibStat.sol";
import { Resource } from "libraries/LibResource.sol";
import { EType } from "../constants/type.sol";
import { BlueprintType } from "../constants/blueprint.sol";
import { Blueprint } from "libraries/LibBlueprint.sol";
import { Upgrade } from "libraries/LibUpgrade.sol";

uint256 constant ID = uint256(keccak256("system.UpgradeShip"));

contract UpgradeShipSystem is System {
  struct Args {
    uint256 shipEntityId;
    uint256 upgradeId;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    // Check for valid planet
    {
      uint32 ty = Type.getType(components, args.shipEntityId);
      require(ty == uint32(EType.SPACESHIP) || ty == uint32(EType.HQSHIP), "Not ship");
    }
    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.shipEntityId) != addressToEntity(msg.sender),
      "Not ship owner"
    );

    // Check for valid blueprint
    BaseBlueprintComponent bb = BaseBlueprintComponent(getAddressById(components, BBID));
    require(bb.has(args.upgradeId), "Blueprint not found");
    require(
      Blueprint.getBlueprintType(components, args.upgradeId) == uint32(BlueprintType.SHIP_UPGRADE),
      "Invalid blueprint type"
    );
    BaseBlueprintComponent.Blueprint memory blueprint = bb.getValue(args.upgradeId);

    // Deduct upgrade cost
    for (uint256 i = 0; i < blueprint.cost.length; ++i) {
      Resource.deduct(components, args.shipEntityId, blueprint.cost[i].resourceId, (blueprint.cost[i].value) / 10000);
    }

    if (blueprint.attack > 0) {
      Stat.incrementAttackMult(components, args.shipEntityId, blueprint.attack / 10000);
    }

    if (blueprint.defense > 0) {
      Stat.incrementDefenseMult(components, args.shipEntityId, blueprint.defense / 10000);
    }

    // Increment resources cap and/or regen
    {
      ResourceComponent r = ResourceComponent(getAddressById(components, RID));
      for (uint256 i = 0; i < blueprint.resources.length; ++i) {
        BaseBlueprintComponent.Resource memory rA = blueprint.resources[i];
        uint256 id = getResourceEntity(args.shipEntityId, rA.resourceId);
        if (r.has(id) && (rA.cap > 0 || rA.rpb > 0)) {
          r.regen(id);
          ResourceComponent.Resource memory resource = r.getValue(id);
          resource.cap += rA.cap / 10000;
          resource.rpb += rA.rpb / 10000;
          r.set(id, resource);
        }
      }
    }

    // Increment upgrade count
    Upgrade.incrementUpgradeCount(components, args.shipEntityId);
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
