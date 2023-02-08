// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { Math64 } from "./LibMath.sol";
import { BASE_ENERGY } from "../constants/resources.sol";

library Resource {
  function moveEnergyCost(uint64 distance) public pure returns (uint64 cost) {
    return 100 + 10 * distance;
  }

  function sendEnergyCost(uint64 distance) public pure returns (uint64 cost) {
    return 100 + 10 * distance;
  }

  function deductEnergy(IUint256Component components, uint256 entity, uint64 energy) public {
    ResourceComponent r = ResourceComponent(getAddressById(components, RID));
    uint256 id = getResourceEntity(entity, BASE_ENERGY);
    r.regen(id);
    ResourceComponent.Resource memory resource = r.getValue(id);
    require(energy > resource.value, "Not enough energy");
    resource.value -= energy;
    r.set(id, resource);
  }

  function transfer(
    IUint256Component components,
    uint256 senderEntity,
    uint256 targetEntity,
    uint256 resourceId,
    uint64 amount
  ) public {
    ResourceComponent r = ResourceComponent(getAddressById(components, RID));
    uint256 senderId = getResourceEntity(senderEntity, resourceId);
    uint256 targetId = getResourceEntity(targetEntity, resourceId);
    require(r.has(senderId), "Resource do not exsist on sender");
    require(r.has(targetId), "Resource do not exsist on target");
    r.regen(senderId);
    r.regen(targetId);
    ResourceComponent.Resource memory senderR = r.getValue(senderId);
    ResourceComponent.Resource memory targetR = r.getValue(targetId);
    require(amount > senderR.value, "Not enough resource amount");
    senderR.value -= amount;
    targetR.value = Math64.min(targetR.cap, targetR.value + amount);
    r.set(senderId, senderR);
    r.set(targetId, targetR);
  }
}
