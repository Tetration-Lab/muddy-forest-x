// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

function PLANET_LEVEL(uint256 location) pure returns (uint32 level) {
  return uint32((location ^ 0xF0F0F0) % 10);
}
