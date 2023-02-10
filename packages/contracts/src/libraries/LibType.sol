// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { PLANET } from "../constants/type.sol";

library Type {
  function assertInit(IUint256Component components, uint256 entity) public {
    require(TypeComponent(getAddressById(components, TID)).has(entity), "Must be valid entity");
  }
}
