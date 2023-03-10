// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { LevelComponent, ID as LID } from "components/LevelComponent.sol";
import { Math64 } from "./LibMath.sol";

library Level {
  function getLevel(IUint256Component components, uint256 entity) public returns (LevelComponent.Level memory) {
    return LevelComponent(getAddressById(components, LID)).getValue(entity);
  }

  function getLevelResourceStorageMultiplier(IUint256Component components, uint256 entity) public returns (uint32) {
    LevelComponent.Level memory lvl = LevelComponent(getAddressById(components, LID)).getValue(entity);
    return lvl.level * 10 + 100;
  }

  function getEnergyLevelMultiplier(uint32 level) public returns (uint32) {
    return 100 + (50 * (level ** 2));
  }

  function getHQShipEnergyLevelMultiplier(uint32 level) public returns (uint32) {
    return 100 + (75 * (level ** 2));
  }

  function getShipEnergyLevelMultiplier(uint32 level) public returns (uint32) {
    return 100 + (50 * (level ** 2));
  }
}
