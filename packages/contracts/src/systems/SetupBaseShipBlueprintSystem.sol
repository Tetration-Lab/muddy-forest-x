// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { BaseBlueprintComponent, ID as BBID } from "components/BaseBlueprintComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { BlueprintTypeComponent, ID as BTID } from "components/BlueprintTypeComponent.sol";
import { EType } from "../constants/type.sol";
import { BASE_ENERGY } from "../constants/resources.sol";
import { BlueprintType } from "../constants/blueprint.sol";

uint256 constant ID = uint256(keccak256("system.SetupBaseShipBlueprint"));

contract SetupBaseShipBlueprintSystem is System {
  struct Args {
    BaseBlueprintComponent.Blueprint[] blueprints;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public onlyOwner returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    BaseBlueprintComponent bb = BaseBlueprintComponent(getAddressById(components, BBID));
    TypeComponent t = TypeComponent(getAddressById(components, TID));
    BlueprintTypeComponent bt = BlueprintTypeComponent(getAddressById(components, TID));

    for (uint256 i = 0; i < args.blueprints.length; ++i) {
      uint256 id = uint256(keccak256(abi.encode(BlueprintType.SHIP, args.blueprints[i])));
      require(args.blueprints[i].resources.length == 1, "Must specify resources");
      require(args.blueprints[i].resources[0].resourceId == BASE_ENERGY, "Resource must be energy");
      require(args.blueprints[i].resources[0].cap > 0, "Energy cap must be gt 0");
      require(args.blueprints[i].resources[0].rpb > 0, "Energy regen must be gt 0");
      require(!bb.has(id), "Duplicate blueprint");
      bb.set(id, args.blueprints[i]);
      t.set(id, uint32(EType.BLUEPRINT));
      bt.set(id, uint32(BlueprintType.SHIP));
    }
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
