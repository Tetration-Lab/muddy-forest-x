// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { NameComponent, ID as NID } from "components/NameComponent.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";

uint256 constant ID = uint256(keccak256("system.SetupFaction"));

contract SetupFactionSystem is System {
  struct Args {
    uint32 id;
    string name;
    PositionComponent.Position HQPosition;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public onlyOwner returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    PositionComponent(getAddressById(components, PID)).set(uint256(args.id), args.HQPosition);
    NameComponent(getAddressById(components, NID)).set(uint256(args.id), args.name);
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
