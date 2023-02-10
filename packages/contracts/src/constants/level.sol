// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

function PLANET_LEVEL(uint256 location, uint32 perlin) pure returns (uint32 level) {
  return uint32(location) ^ perlin % 10;
}
