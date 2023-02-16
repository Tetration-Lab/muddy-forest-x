// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/Component.sol";

uint256 constant ID = uint256(keccak256("component.BuildingBlueprint"));

contract BuildingBlueprintComponent is Component {
  struct Resource {
    uint256 resourceId;
    uint64 value;
    uint64 cap;
    uint64 rbp;
  }

  struct BuildingBlueprint {
    // Upgrade
    uint32 attack;
    uint32 defense;
    Resource[] resources;
    // Cost
    Resource[] cost;
  }

  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](4);
    values = new LibTypes.SchemaValue[](4);

    keys[0] = "attack";
    values[0] = LibTypes.SchemaValue.UINT32;

    keys[1] = "defense";
    values[1] = LibTypes.SchemaValue.UINT32;

    keys[2] = "resources";
    values[2] = LibTypes.SchemaValue.BYTES_ARRAY;

    keys[3] = "resources";
    values[3] = LibTypes.SchemaValue.BYTES_ARRAY;
  }

  function set(uint256 entity, BuildingBlueprint calldata value) public virtual {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view virtual returns (BuildingBlueprint memory) {
    return abi.decode(getRawValue(entity), (BuildingBlueprint));
  }

  function getEntitiesWithValue(
    BuildingBlueprint calldata buildingBlueprint
  ) public view virtual returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(buildingBlueprint));
  }
}
