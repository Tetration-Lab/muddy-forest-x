// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { NameComponent, ID as NID } from "components/NameComponent.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";

uint256 constant ID = uint256(keccak256("system.Name"));

contract NameSystem is System {
  struct Args {
    uint256 entity;
    string name;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));
    NameComponent c = NameComponent(getAddressById(components, NID));

    require(
      args.entity == addressToEntity(msg.sender) ||
        OwnerComponent(getAddressById(components, OID)).getValue(args.entity) != addressToEntity(msg.sender),
      "Not owner"
    );
    NameComponent(getAddressById(components, NID)).set(args.entity, args.name);
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
