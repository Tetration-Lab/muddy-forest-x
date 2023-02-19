// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/Component.sol";

uint256 constant ID = uint256(keccak256("component.Research"));

contract ResearchComponent is Component {
  struct Research {
    // Blueprint Id
    uint256 blueprintId;
    // Positive Multiplier
    uint32 posMult; // 10000 = 100%
    // Negative Multiplier
    uint32 negMult; // 10000 = 100%
  }

  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](3);
    values = new LibTypes.SchemaValue[](3);

    keys[0] = "blueprintId";
    values[0] = LibTypes.SchemaValue.UINT256;

    keys[1] = "posMult";
    values[1] = LibTypes.SchemaValue.UINT32;

    keys[2] = "posMult";
    values[2] = LibTypes.SchemaValue.UINT32;
  }

  function set(uint256 entity, Research calldata value) public virtual {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view virtual returns (Research memory) {
    return abi.decode(getRawValue(entity), (Research));
  }

  function getEntitiesWithValue(Research calldata research) public view virtual returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(research));
  }
}
