// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { LevelComponent, ID as LID } from "components/LevelComponent.sol";
import { Math64 } from "./LibMath.sol";

library Level {
  function getLevelResourceStorageMultiplier(IUint256Component components, uint256 entity) public returns (uint32) {
    LevelComponent.Level memory lvl = LevelComponent(getAddressById(components, LID)).getValue(entity);
    return ((lvl.level * 10) * (lvl.tier + 1) * lvl.multiplier) / 100;
  }
}
