// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { DestroyedComponent, ID as DID } from "components/DestroyedComponent.sol";
import { EType } from "../constants/type.sol";

library Type {
  function assertInit(IUint256Component components, uint256 entity) public {
    require(TypeComponent(getAddressById(components, TID)).has(entity), "Must be valid entity");
  }

  function assertNotDestroyed(IUint256Component components, uint256 entity) public {
    require(!DestroyedComponent(getAddressById(components, DID)).has(entity), "Must not be destroyed");
  }

  function assertNotDestroyedTuple(IUint256Component components, uint256 entityOne, uint256 entityTwo) public {
    DestroyedComponent d = DestroyedComponent(getAddressById(components, DID));
    require(!d.has(entityOne), "Must not be destroyed");
    require(!d.has(entityTwo), "Must not be destroyed");
  }

  function getType(IUint256Component components, uint256 entity) public returns (uint32) {
    return TypeComponent(getAddressById(components, TID)).getValue(entity);
  }
}
