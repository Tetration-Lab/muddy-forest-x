// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { FactionComponent, ID as FID } from "components/FactionComponent.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";

library Faction {
  function getFaction(IUint256Component components, address player) public returns (uint32) {
    FactionComponent f = FactionComponent(getAddressById(components, FID));
    require(f.has(addressToEntity(player)), "Invalid player faction");
    return f.getValue(addressToEntity(player));
  }

  function getFaction(IUint256Component components, uint256 entity) public returns (uint32) {
    return FactionComponent(getAddressById(components, FID)).getValue(entity);
  }

  function getCapitalPosition(
    IUint256Component components,
    uint32 factionId
  ) public returns (PositionComponent.Position memory) {
    return PositionComponent(getAddressById(components, PID)).getValue(uint256(factionId));
  }

  function getPlayerCapitalPosition(
    IUint256Component components,
    address player
  ) public returns (PositionComponent.Position memory) {
    return PositionComponent(getAddressById(components, PID)).getValue(uint256(getFaction(components, player)));
  }
}
