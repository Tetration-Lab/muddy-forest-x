// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { BlueprintTypeComponent, ID as BTID } from "components/BlueprintTypeComponent.sol";

library Blueprint {
  function getBlueprintType(IUint256Component components, uint256 entity) public view returns (uint32) {
    return BlueprintTypeComponent(getAddressById(components, BTID)).getValue(entity);
  }
}
