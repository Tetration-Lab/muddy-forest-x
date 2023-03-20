// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/Component.sol";
import { Math64 } from "libraries/LibMath.sol";

uint256 constant ID = uint256(keccak256("component.Resource"));

function getResourceEntity(uint256 baseEntity, uint256 resourceId) pure returns (uint256) {
  return uint256(keccak256(abi.encode(baseEntity, resourceId)));
}

contract ResourceComponent is Component {
  struct Resource {
    uint64 value;
    uint64 cap;
    uint64 rpb; // regen per block
    uint64 lrt; // latest regen time
  }

  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](4);
    values = new LibTypes.SchemaValue[](4);

    keys[0] = "value";
    values[0] = LibTypes.SchemaValue.UINT64;

    keys[1] = "cap";
    values[1] = LibTypes.SchemaValue.UINT64;

    keys[2] = "rpb";
    values[2] = LibTypes.SchemaValue.UINT64;

    keys[3] = "lrt";
    values[3] = LibTypes.SchemaValue.UINT32;
  }

  function set(uint256 entity, Resource memory value) public virtual {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view virtual returns (Resource memory) {
    bytes memory rawValue = getRawValue(entity);
    if (rawValue.length > 0) {
      return abi.decode(rawValue, (Resource));
    } else {
      return Resource(0, 0, 0, 0);
    }
  }

  function getEntitiesWithValue(Resource memory value) public view virtual returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(value));
  }

  function regen(uint256 entity) public virtual {
    if (has(entity)) {
      Resource memory r = getValue(entity);
      if (r.value < r.cap) r.value = Math64.min(r.value + r.rpb * (uint64(block.timestamp) - r.lrt), r.cap);
      r.lrt = uint64(block.timestamp);
      set(entity, r);
    }
  }
}
