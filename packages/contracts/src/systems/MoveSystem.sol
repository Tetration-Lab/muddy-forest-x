// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";
import { Resource } from "libraries/LibResource.sol";
import { Position } from "libraries/LibPosition.sol";
import { Type } from "libraries/LibType.sol";
import { Cooldown } from "libraries/LibCooldown.sol";
import { MOVE_ID, MOVE_COOLDOWN } from "../constants/cooldown.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  struct Args {
    uint256 entity;
    PositionComponent.Position position;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    Type.assertNotDestroyed(components, args.entity);
    Cooldown.assertCooldown(components, args.entity, MOVE_ID);

    PositionComponent positionComp = PositionComponent(getAddressById(components, PID));

    require(
      OwnerComponent(getAddressById(components, OID)).getValue(args.entity) == addressToEntity(msg.sender),
      "Not owner"
    );
    require(positionComp.has(args.entity), "This entity cannot move");

    {
      uint64 energyCost = Resource.moveEnergyCost(Position.distance(args.position, positionComp.getValue(args.entity)));
      Resource.deductEnergy(components, args.entity, energyCost);
    }

    positionComp.set(args.entity, args.position);
    Cooldown.setCooldown(components, args.entity, MOVE_ID, MOVE_COOLDOWN);
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
