// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "std-contracts/components/Uint32Component.sol";

uint256 constant ID = uint256(keccak256("component.Attack"));

contract AttackComponent is Uint32Component {
  constructor(address world) Uint32Component(world, ID) {}

  // 10000 == 100%
  function getValue(uint256 entity) public view virtual override returns (uint32) {
    bytes memory rawValue = getRawValue(entity);
    if (rawValue.length > 0) {
      return abi.decode(rawValue, (uint32));
    } else {
      return 10000;
    }
  }
}
