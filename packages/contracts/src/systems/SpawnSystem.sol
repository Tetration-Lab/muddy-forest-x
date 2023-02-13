// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { NameComponent, ID as NID } from "components/NameComponent.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";
import { FactionComponent, ID as FID } from "components/FactionComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { EType } from "../constants/type.sol";
import { Faction } from "libraries/LibFaction.sol";
import { Spaceship } from "libraries/LibSpaceship.sol";

uint256 constant ID = uint256(keccak256("system.Spawn"));

contract SpawnSystem is System {
  struct Args {
    uint32 factionId;
    uint256 HQShipId;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    TypeComponent ty = TypeComponent(getAddressById(components, TID));
    FactionComponent fac = FactionComponent(getAddressById(components, FID));

    require(args.HQShipId > 2 ** 40, "Invalid hq ship id");
    require(!ty.has(args.HQShipId), "Duplicate hq ship id");
    require(!ty.has(addressToEntity(msg.sender)), "Player must not spawn before");
    require(!fac.has(addressToEntity(msg.sender)), "Player must not select faction before");
    require(ty.getValue(uint256(args.factionId)) == uint32(EType.FACTION), "Invalid faction id");

    ty.set(addressToEntity(msg.sender), uint32(EType.PLAYER));
    fac.set(addressToEntity(msg.sender), args.factionId);

    Spaceship.initHQShip(components, args.HQShipId, Faction.getCapitalPosition(components, args.factionId));
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
