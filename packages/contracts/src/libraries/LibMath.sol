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

library Math32 {
  function min(uint32 a, uint32 b) public pure returns (uint32) {
    return a > b ? b : a;
  }

  function max(uint32 a, uint32 b) public pure returns (uint32) {
    return a > b ? a : b;
  }

  function between(uint32 _min, uint32 _max, uint32 value) public pure returns (uint32) {
    return min(max(value, _max), _min);
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
