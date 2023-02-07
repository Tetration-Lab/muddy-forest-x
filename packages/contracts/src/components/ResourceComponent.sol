// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/Component.sol";
import { Math64 } from "../libraries/LibMath.sol";

uint256 constant ID = uint256(keccak256("component.Resource"));

contract ResourceComponent is Component {
  struct Resource {
    uint64 value;
    uint64 cap;
    uint64 rpb; // regen per block
    uint32 lrb; // latest regen block
    uint32 bases;
  }

  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](5);
    values = new LibTypes.SchemaValue[](5);

    keys[0] = "value";
    values[0] = LibTypes.SchemaValue.UINT64;

    keys[1] = "cap";
    values[1] = LibTypes.SchemaValue.UINT64;

    keys[2] = "regen";
    values[2] = LibTypes.SchemaValue.UINT64;

    keys[3] = "latestRegenBlock";
    values[3] = LibTypes.SchemaValue.UINT32;

    keys[4] = "bases";
    values[4] = LibTypes.SchemaValue.UINT32;
  }

  function set(uint256 entity, Resource memory value) public virtual {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view virtual returns (Resource memory) {
    return abi.decode(getRawValue(entity), (Resource));
  }

  function getEntitiesWithValue(Resource memory value) public view virtual returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(value));
  }

  function regen(uint256 entity) public virtual {
    if (has(entity)) {
      Resource memory r = getValue(entity);
      r.value = Math64.min(r.rpb * (uint32(block.number) - r.lrb), r.cap);
      r.lrb = uint32(block.number);
      set(entity, r);
    }
  }
}
