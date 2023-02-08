// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

uint256 constant BASE = uint256(keccak256("resource.base"));
uint256 constant MAX_BASE = BASE + 1;

uint256 constant ADVANCED = uint256(keccak256("resource.advanced"));
uint256 constant ADVANCED_CNT = 2;
uint256 constant MAX_ADVANCED = ADVANCED + ADVANCED_CNT;

uint256 constant BASE_ENERGY = BASE + 1;
uint64 constant BASE_ENERGY_CAP = 5000;
uint32 constant BASE_ENERGY_REGEN = 80;

function ADVANCED_CAP_REGEN(uint256 id) pure returns (uint64 cap, uint32 regen) {
  if (id == 1) {
    return (1000, 4);
  }

  return (500, 2);
}
