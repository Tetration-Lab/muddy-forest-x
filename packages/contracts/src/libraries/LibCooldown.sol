// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { CooldownComponent, ID as CID, getCooldownEntity } from "components/CooldownComponent.sol";

library Cooldown {
  function assertCooldown(IUint256Component components, uint256 entity, uint256 cooldownId) public {
    require(
      CooldownComponent(getAddressById(components, CID)).getValue(
        block.timestamp >= getCooldownEntity(entity, cooldownId),
        "Cooldown for this action not met"
      )
    );
  }

  function setCooldown(IUint256Component components, uint256 entity, uint256 cooldownId, uint256 cooldown) public {
    CooldownComponent(getAddressById(components, CID)).set(
      getCooldownEntity(entity, cooldownId),
      block.timestamp + cooldown
    );
  }
}
