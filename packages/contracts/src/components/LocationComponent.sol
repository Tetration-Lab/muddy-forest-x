// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "std-contracts/components/Uint256Component.sol";

uint256 constant ID = uint256(keccak256("component.Location"));

contract LocationComponent is Uint256Component {
  constructor(address world) Uint256Component(world, ID) {}
}
