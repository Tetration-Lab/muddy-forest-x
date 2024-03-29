// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// if location (hash) < this value = have location
// Maximum value is Fr modulo of BN254 (Rarity = 1) = 21888242871839275222246405745257275088548364400416034343698204186575808495617
uint256 constant RARITY = 6888242871839275222246405745257275088548364400416034343698204186575808495; // 1/1000

// Maximum building of the planet
function MAX_BUILDING_PER_LEVEL(uint32 level) pure returns (uint32) {
  return level / 2 + 1;
}
