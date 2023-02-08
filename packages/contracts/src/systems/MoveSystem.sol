// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Position } from "libraries/LibPosition.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  struct Args {
    uint256 entity;
    PositionComponent.Position position;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    PositionComponent positionComp = PositionComponent(getAddressById(components, PID));

    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.entity) != addressToEntity(msg.sender),
      "Not owner"
    );
    require(positionComp.has(args.entity), "This entity cannot move");

    {
      uint64 energyCost = Resource.moveEnergyCost(Position.distance(args.position, positionComp.getValue(args.entity)));
      Resource.deductEnergy(components, args.entity, energyCost);
    }

    positionComp.set(args.entity, args.position);
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
