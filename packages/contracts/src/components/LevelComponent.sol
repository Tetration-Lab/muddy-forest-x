// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/Component.sol";

uint256 constant ID = uint256(keccak256("component.Level"));

contract LevelComponent is Component {
  struct Level {
    uint32 level; //start at lvl 0
    uint32 tier; //start at tier 0
    uint32 multiplier; // base 100 + 100 -> mul 1 = 101%
  }

  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](3);
    values = new LibTypes.SchemaValue[](3);

    keys[0] = "level";
    values[0] = LibTypes.SchemaValue.UINT32;

    keys[1] = "tier";
    values[1] = LibTypes.SchemaValue.UINT32;

    keys[2] = "multiplier";
    values[2] = LibTypes.SchemaValue.UINT32;
  }

  function set(uint256 entity, Level calldata value) public virtual {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view virtual returns (Level memory) {
    bytes memory rawValue = getRawValue(entity);
    if (rawValue.length > 0) {
      return abi.decode(rawValue, (Level));
    } else {
      return Level(0, 0, 0);
    }
  }

  function getEntitiesWithValue(Level calldata level) public view virtual returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(level));
  }
}
