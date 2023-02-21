// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { BaseBlueprintComponent, ID as BBID } from "components/BaseBlueprintComponent.sol";
import { BuildingComponent, ID as BID } from "components/BuildingComponent.sol";
import { Type } from "libraries/LibType.sol";
import { Stat } from "libraries/LibStat.sol";
import { Level } from "libraries/LibLevel.sol";
import { Resource } from "libraries/LibResource.sol";
import { EType } from "../constants/type.sol";
import { MAX_BUILDING_PER_LEVEL } from "../constants/planet.sol";
import { Faction } from "../libraries/LibFaction.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { FactionComponent, ID as FID } from "components/FactionComponent.sol";
import { Spaceship } from "libraries/LibSpaceship.sol";
import { BlueprintType } from "../constants/blueprint.sol";
import { Blueprint } from "libraries/LibBlueprint.sol";

uint256 constant ID = uint256(keccak256("system.BuildShip"));

contract BuildShipSystem is System {
  struct Args {
    uint256 blueprintId;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));
    uint32 faction = Faction.getFaction(components, msg.sender);

    BaseBlueprintComponent bb = BaseBlueprintComponent(getAddressById(components, BBID));

    require(bb.has(args.blueprintId), "Blueprint not found");
    require(
      Blueprint.getBlueprintType(components, args.blueprintId) == uint32(BlueprintType.SHIP),
      "Invalid blueprint type"
    );

    // for (uint256 i = 0; i < blueprint.cost.length; ++i) {
    //   Resource.deduct(components, args.planetEntity, blueprint.cost[i].resourceId, blueprint.cost[i].value);
    // }
    uint256 newEntity = world.getUniqueEntityId();
    TypeComponent(getAddressById(components, TID)).set(newEntity, uint32(EType.SPACESHIP));
    // FactionComponent fac = FactionComponent(getAddressById(components, FID));
    // fac.set(newEntity, faction);

    Spaceship.initNewShip(
      components,
      newEntity,
      Faction.getCapitalPosition(components, faction),
      bb.getValue(args.blueprintId),
      addressToEntity(msg.sender)
    );
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
