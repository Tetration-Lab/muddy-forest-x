// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "std-contracts/components/Uint32Component.sol";

uint256 constant ID = uint256(keccak256("component.Cooldown"));

function getCooldownEntity(uint256 baseEntity, uint256 cooldownId) pure returns (uint256) {
  return uint256(keccak256(abi.encode(baseEntity, cooldownId)));
}

contract CooldownComponent is Uint32Component {
  constructor(address world) Uint32Component(world, ID) {}
}
