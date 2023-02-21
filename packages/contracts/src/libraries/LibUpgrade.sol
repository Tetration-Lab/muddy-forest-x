// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { UpgradeCountComponent, ID as UCID } from "components/UpgradeCountComponent.sol";

library Upgrade {
  function incrementUpgradeCount(IUint256Component components, uint256 entity) public {
    UpgradeCountComponent uc = UpgradeCountComponent(getAddressById(components, UCID));
    uc.set(entity, uc.getValue(entity) + 1);
  }
}
