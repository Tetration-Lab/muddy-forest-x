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
