// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { ShipBlueprintComponent, ID as SBID } from "components/ShipBlueprintComponent.sol";
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

uint256 constant ID = uint256(keccak256("system.BuildShip"));

contract BuildShipSystem is System {
  struct Args {
    uint256 blueprintId;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));
    uint32 faction = Faction.getFaction(components, msg.sender);

    ShipBlueprintComponent sb = ShipBlueprintComponent(getAddressById(components, SBID));
    TypeComponent ty = TypeComponent(getAddressById(components, TID));
    FactionComponent fac = FactionComponent(getAddressById(components, FID));

    require(sb.has(args.blueprintId), "Blueprint not found");
    ShipBlueprintComponent.ShipBlueprint memory blueprint = sb.getValue(args.blueprintId);

    // for (uint256 i = 0; i < blueprint.cost.length; ++i) {
    //   Resource.deduct(components, args.planetEntity, blueprint.cost[i].resourceId, blueprint.cost[i].value);
    // }
    uint256 newEntity = world.getUniqueEntityId();
    ty.set(newEntity, uint32(EType.SPACESHIP));
    fac.set(newEntity, faction);

    Spaceship.initNewShip(components, newEntity, Faction.getCapitalPosition(components, faction), blueprint);
    OwnerComponent(getAddressById(components, OID)).set(newEntity, addressToEntity(msg.sender));
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
