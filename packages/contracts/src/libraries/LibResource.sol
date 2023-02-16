// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { Math64 } from "./LibMath.sol";
import { BASE_ENERGY, BASE, MAX_BASE, ADVANCED, MAX_ADVANCED } from "../constants/resources.sol";

library Resource {
  function getResource(
    IUint256Component components,
    uint256 entity,
    uint256 resourceId
  ) public returns (ResourceComponent.Resource memory) {
    uint256 id = getResourceEntity(entity, BASE_ENERGY);
    ResourceComponent(getAddressById(components, RID)).getValue(entity);
  }

  function isInBaseResource(uint256 resourceId) public returns (bool) {
    return resourceId > BASE && resourceId <= MAX_BASE;
  }

  function isInAdvancedResource(uint256 resourceId) public returns (bool) {
    return resourceId > ADVANCED && resourceId <= MAX_ADVANCED;
  }

  function isContainResource(uint256 location, uint256 resourceId) public returns (bool) {
    return (location ^ resourceId) % 5 > 3;
  }

  function moveEnergyCost(uint64 distance) public pure returns (uint64 cost) {
    return 100 + (20 * distance);
  }

  function sendEnergyCost(
    uint64 distance,
    uint64 weight,
    uint64 upgrade
  ) public pure returns (uint64 cost) {
    return 100 + 10 * distance + (weight * distance) / (50 + upgrade);
  }

  function attackEnergyCost(uint64 distance) public pure returns (uint64 cost) {
    return 100 + distance**2;
  }

  function deductEnergy(
    IUint256Component components,
    uint256 entity,
    uint64 energy
  ) public {
    ResourceComponent r = ResourceComponent(getAddressById(components, RID));
    uint256 id = getResourceEntity(entity, BASE_ENERGY);
    r.regen(id);
    ResourceComponent.Resource memory resource = r.getValue(id);
    require(energy > resource.value, "Not enough energy");
    resource.value -= energy;
    r.set(id, resource);
  }

  function deductEnergyCap(
    IUint256Component components,
    uint256 entity,
    uint64 energy
  ) public {
    ResourceComponent r = ResourceComponent(getAddressById(components, RID));
    uint256 id = getResourceEntity(entity, BASE_ENERGY);
    r.regen(id);
    ResourceComponent.Resource memory resource = r.getValue(id);
    if (energy > resource.value) {
      resource.value = 0;
    } else {
      resource.value -= energy;
    }
    r.set(id, resource);
  }

  function increaseEnergy(
    IUint256Component components,
    uint256 entity,
    uint64 energy
  ) public {
    ResourceComponent r = ResourceComponent(getAddressById(components, RID));
    uint256 id = getResourceEntity(entity, BASE_ENERGY);
    r.regen(id);
    ResourceComponent.Resource memory resource = r.getValue(id);
    resource.value = Math64.min(resource.value + energy, resource.cap);
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
