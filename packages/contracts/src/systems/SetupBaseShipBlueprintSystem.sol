// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { ShipBlueprintComponent, ID as SBID } from "components/ShipBlueprintComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { EType } from "../constants/type.sol";

uint256 constant ID = uint256(keccak256("system.SetupBaseShipBlueprint"));

contract SetupBaseShipBlueprintSystem is System {
  struct Args {
    ShipBlueprintComponent.ShipBlueprint[] blueprints;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public onlyOwner returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    ShipBlueprintComponent sb = ShipBlueprintComponent(getAddressById(components, SBID));
    TypeComponent t = TypeComponent(getAddressById(components, TID));

    for (uint256 i = 0; i < args.blueprints.length; ++i) {
      uint256 id = uint256(keccak256(abi.encode(args.blueprints[i])));
      require(!sb.has(id), "Duplicate blueprint");
      sb.set(id, args.blueprints[i]);
      t.set(id, uint32(EType.SHIP_BLUEPRINT));
    }
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
