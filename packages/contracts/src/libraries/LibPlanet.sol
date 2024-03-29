// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { LevelComponent, ID as LID } from "components/LevelComponent.sol";
import { LocationComponent, ID as LTID } from "components/LocationComponent.sol";
import { PLANET_LEVEL } from "../constants/level.sol";
import { EType } from "../constants/type.sol";
import { RARITY } from "../constants/planet.sol";
import { Level } from "./LibLevel.sol";
import { BASE_ENERGY, BASE_ENERGY_REGEN, BASE_ENERGY_CAP } from "../constants/resources.sol";

library Planet {
  function assertPlanetLocation(uint256 location) public {
    require(location <= RARITY, "Invalid location, must lteq rarity");
  }

  function assertNonPlanetLocation(uint256 location) public {
    require(location > RARITY, "Invalid location, must gt rarity");
  }

  function initPlanet(IUint256Component components, uint256 location) public {
    {
      uint32 level = PLANET_LEVEL(location);
      uint32 mult = Level.getEnergyLevelMultiplier(level);
      uint256 energyId = getResourceEntity(location, BASE_ENERGY);
      LevelComponent(getAddressById(components, LID)).set(location, LevelComponent.Level(level, 0, 0));
      ResourceComponent(getAddressById(components, RID)).set(
        energyId,
        ResourceComponent.Resource(
          (BASE_ENERGY_CAP * mult) / 100,
          (BASE_ENERGY_CAP * mult) / 100,
          (BASE_ENERGY_REGEN * mult) / 100,
          uint64(block.timestamp)
        )
      );
    }
    TypeComponent(getAddressById(components, TID)).set(location, uint32(EType.PLANET));
    LocationComponent(getAddressById(components, LTID)).set(location, location);
  }
}
