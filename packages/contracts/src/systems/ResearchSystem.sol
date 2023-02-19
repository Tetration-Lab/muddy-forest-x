// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { ResearchComponent, ID as RID } from "components/ResearchComponent.sol";
import { BlueprintComponent, ID as BID } from "components/BlueprintComponent.sol";
import { InventorComponent, ID as IID } from "components/InventorComponent.sol";
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { ResearchCountComponent, ID as RCID } from "components/ResearchCountComponent.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { EType } from "../constants/type.sol";
import { RESEARCH_ID, RESEARCH_COOLDOWN } from "../constants/cooldown.sol";
import { Type } from "libraries/LibType.sol";
import { Research } from "libraries/LibResearch.sol";
import { Cooldown } from "libraries/LibCooldown.sol";
import { Faction } from "libraries/LibFaction.sol";

uint256 constant ID = uint256(keccak256("system.Research"));

contract ResearchSystem is System {
  struct Args {
    uint256 blueprintId;
  }

  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public onlyOwner returns (bytes memory) {
    Args memory args = abi.decode(arguments, (Args));

    Cooldown.assertCooldown(components, addressToEntity(msg.sender), RESEARCH_ID);
    Cooldown.setCooldown(components, addressToEntity(msg.sender), RESEARCH_ID, RESEARCH_COOLDOWN);

    require(Type.getType(components, args.blueprintId) == uint32(EType.BLUEPRINT), "Must research on blueprint");

    uint32 faction = Faction.getFaction(components, msg.sender);
    uint32 researchCount = Research.getResearchCount(components, faction);

    bool isSuccessful = Research.getResearchSuccess(researchCount, uint256(blockhash(block.number)));
    if (isSuccessful) {
      uint256 researchId = uint256(keccak256(abi.encode(faction, researchCount, msg.sender)));
      ResearchComponent(getAddressById(components, RID)).set(
        researchId,
        ResearchComponent.Research(
          Research.getPositiveMultiplier(researchCount, uint256(blockhash(block.number))),
          Research.getNegativeMultiplier(researchCount, uint256(blockhash(block.number)))
        )
      );
      BlueprintComponent(getAddressById(components, BID)).set(researchId, args.blueprintId);
      InventorComponent(getAddressById(components, IID)).set(researchId, addressToEntity(msg.sender));
      OwnerComponent(getAddressById(components, OID)).set(researchId, faction);
      TypeComponent(getAddressById(components, TID)).set(researchId, uint32(EType.RESEARCH));
    }

    Research.incrementResearchCount(components, faction);

    // TODO: Add energy consumption on research
  }

  function executeTyped(Args memory args) public returns (bytes memory) {
    return execute(abi.encode(args));
  }
}
