// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { ResearchCountComponent, ID as RCID } from "components/ResearchCountComponent.sol";
import { ResearchComponent, ID as RID } from "components/ResearchComponent.sol";
import { InventorComponent, ID as IID } from "components/InventorComponent.sol";
import { Math32 } from "./LibMath.sol";

library Research {
  function getResearchCount(IUint256Component components, uint256 entity) public view returns (uint32) {
    return ResearchCountComponent(getAddressById(components, RCID)).getValue(entity);
  }

  function incrementResearchCount(IUint256Component components, uint256 entity) public {
    ResearchCountComponent r = ResearchCountComponent(getAddressById(components, RCID));
    r.set(entity, r.getValue(entity) + 1);
  }

  function getResearch(
    IUint256Component components,
    uint256 entity
  ) public view returns (ResearchComponent.Research memory) {
    return ResearchComponent(getAddressById(components, RCID)).getValue(entity);
  }

  function getInventor(IUint256Component components, uint256 entity) public view returns (uint256) {
    return InventorComponent(getAddressById(components, IID)).getValue(entity);
  }

  // 10000 = 100%
  // 50 - 200%
  function getPositiveMultiplier(uint32 count, uint256 randomness) public pure returns (uint32) {
    uint32 rand = uint32(randomness ^ 0x2F01189EB498B10CF6D1069EA03FF3C04E53984EBF57F9A7D1FAF1A18C7788F ^ count) %
      25000;
    return Math32.between(5000, 20000, rand);
  }

  // 10000 = 100%
  // 50 - 200%
  function getNegativeMultiplier(uint32 count, uint256 randomness) public pure returns (uint32) {
    uint32 rand = uint32(randomness ^ 0x0D004A3EC16148A06E4327024D35DA4596668851B471E9E85623AB712940117E ^ count) %
      25000;
    return Math32.between(5000, 20000, rand);
  }

  // Flat 10000;
  function getResearchSuccess(uint32 count, uint256 randomness) public pure returns (bool) {
    return (randomness ^ (0x2DCF45F84EA32723C456A183C827DB2BE4FBF1E26C526FFECB3DC598161280E5 / count)) % 10000 <= 5000;
  }
}
