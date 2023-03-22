// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { BaseBlueprintComponent, ID as BBID } from "components/BaseBlueprintComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { BlueprintTypeComponent, ID as BTID } from "components/BlueprintTypeComponent.sol";
import { ResearchComponent, ID as RID } from "components/ResearchComponent.sol";
import { BlueprintComponent, ID as BID } from "components/BlueprintComponent.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { EType } from "../constants/type.sol";
import { BlueprintType, BLUEPRINT_ID_START, BLUEPRINT_ID_END } from "../constants/blueprint.sol";

uint256 constant ID = uint256(keccak256("system.SetupBaseBuildingBlueprint"));

contract SetupBaseBuildingBlueprintSystem is System {
  struct Args {
    uint256[] ids;
    BaseBlueprintComponent.Blueprint[] blueprints;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    BaseBlueprintComponent bb = BaseBlueprintComponent(getAddressById(components, BBID));
    TypeComponent t = TypeComponent(getAddressById(components, TID));
    BlueprintTypeComponent bt = BlueprintTypeComponent(getAddressById(components, TID));
    ResearchComponent r = ResearchComponent(getAddressById(components, RID));
    BlueprintComponent b = BlueprintComponent(getAddressById(components, BID));
    OwnerComponent o = OwnerComponent(getAddressById(components, OID));

    require(args.ids.length == args.blueprints.length, "Invalid id and blueprint length");

    for (uint256 i = 0; i < args.blueprints.length; ++i) {
      uint256 id = args.ids[i];
      require(id > BLUEPRINT_ID_START && id <= BLUEPRINT_ID_END, "Invalid blueprint id");
      require(!bb.has(id), "Duplicate blueprint");
      bb.set(id, args.blueprints[i]);
      t.set(id, uint32(EType.BLUEPRINT));
      bt.set(id, uint32(BlueprintType.BUILDING));
      r.set(id, ResearchComponent.Research(10000, 10000));
      b.set(id, id);
      o.set(id, 0);
    }
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
