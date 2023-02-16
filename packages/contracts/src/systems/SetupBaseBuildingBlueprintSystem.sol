// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { BuildingBlueprintComponent, ID as BBID } from "components/BuildingBlueprintComponent.sol";

uint256 constant ID = uint256(keccak256("system.SetupFaction"));

contract SetupFactionSystem is System {
  struct Args {
    BuildingBlueprintComponent.BuildingBlueprint[] blueprints;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public onlyOwner returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    BuildingBlueprintComponent bb = BuildingBlueprintComponent(getAddressById(components, BBID));

    for (uint256 i = 0; i < args.blueprints.length; ++i) {
      uint256 id = uint256(keccak256(abi.encode(args.blueprints[i])));
      require(!bb.has(id), "Duplicate blueprint");
      bb.set(id, args.blueprints[i]);
    }
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
