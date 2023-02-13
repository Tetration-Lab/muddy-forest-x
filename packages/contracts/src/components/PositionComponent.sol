// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/Component.sol";

uint256 constant ID = uint256(keccak256("component.Position"));

contract PositionComponent is Component {
  struct Position {
    int128 x;
    int128 y;
  }

  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](2);
    values = new LibTypes.SchemaValue[](2);

    keys[0] = "x";
    values[0] = LibTypes.SchemaValue.INT128;

    keys[1] = "y";
    values[1] = LibTypes.SchemaValue.INT128;
  }

  function set(uint256 entity, Position calldata value) public virtual {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view virtual returns (Position memory) {
    (int32 x, int32 y) = abi.decode(getRawValue(entity), (int32, int32));
    return Position(x, y);
  }

  function getEntitiesWithValue(Position calldata position) public view virtual returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(position));
  }
}
