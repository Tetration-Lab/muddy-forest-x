// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Math64 {
  function min(uint64 a, uint64 b) public pure returns (uint64) {
    return a > b ? b : a;
  }

  function max(uint64 a, uint64 b) public pure returns (uint64) {
    return a > b ? a : b;
  }
}

library Math {
  function sqrt(uint256 y) public pure returns (uint256 z) {
    if (y > 3) {
      z = y;
      uint x = y / 2 + 1;
      while (x < z) {
        z = x;
        x = (y / x + x) / 2;
      }
    } else if (y != 0) {
      z = 1;
    }
  }
}
