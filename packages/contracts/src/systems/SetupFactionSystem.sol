// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { NameComponent, ID as NID } from "components/NameComponent.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { FactionComponent, ID as FID } from "components/FactionComponent.sol";
import { EType } from "../constants/type.sol";

uint256 constant ID = uint256(keccak256("system.SetupFaction"));

contract SetupFactionSystem is System {
  struct Args {
    uint32 id;
    string name;
    PositionComponent.Position capitalPosition;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    require(args.id >= 10, "Invalid faction id range");

    PositionComponent(getAddressById(components, PID)).set(uint256(args.id), args.capitalPosition);
    NameComponent(getAddressById(components, NID)).set(uint256(args.id), args.name);
    TypeComponent(getAddressById(components, TID)).set(uint256(args.id), uint32(EType.FACTION));
    FactionComponent(getAddressById(components, FID)).set(uint256(args.id), args.id);
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
