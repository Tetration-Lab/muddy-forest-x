// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { AttackComponent, ID as AID } from "components/AttackComponent.sol";
import { DefenseComponent, ID as DID } from "components/DefenseComponent.sol";

library Stat {
  function getAttackMult(IUint256Component components, uint256 entity) public returns (uint32) {
    return AttackComponent(getAddressById(components, AID)).getValue(entity);
  }

  function getDefenseMult(IUint256Component components, uint256 entity) public returns (uint32) {
    return DefenseComponent(getAddressById(components, DID)).getValue(entity);
  }

  function incrementAttackMult(IUint256Component components, uint256 entity, uint32 value) public {
    AttackComponent a = AttackComponent(getAddressById(components, AID));
    a.set(entity, a.getValue(entity) + value);
  }

  function incrementDefenseMult(IUint256Component components, uint256 entity, uint32 value) public {
    DefenseComponent d = DefenseComponent(getAddressById(components, DID));
    d.set(entity, d.getValue(entity) + value);
  }

  function calculateFinalEnergyReceived(
    IUint256Component components,
    uint256 attackEntity,
    uint256 defenseEntity,
    uint64 energy
  ) public returns (uint64) {
    uint32 attackMult = getAttackMult(components, attackEntity);
    uint32 defenseMult = getDefenseMult(components, defenseEntity);
    return ((energy * attackMult) / defenseMult);
  }
}
