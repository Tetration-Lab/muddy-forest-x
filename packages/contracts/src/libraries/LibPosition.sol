// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";
import { Math } from "./LibMath.sol";

library Position {
  function distance(
    PositionComponent.Position memory a,
    PositionComponent.Position memory b
  ) public pure returns (uint64) {
    return uint64(Math.sqrt(uint256(int256(a.x - b.x) ** 2) + uint256(int256(a.y - b.y) ** 2)));
  }
}
