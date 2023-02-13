// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { IUint256Component } from "solecs/interfaces/IUint256Component.sol";
import { TypeComponent, ID as TID } from "components/TypeComponent.sol";
import { ResourceComponent, ID as RID, getResourceEntity } from "components/ResourceComponent.sol";
import { LevelComponent, ID as LID } from "components/LevelComponent.sol";
import { PLANET_LEVEL } from "../constants/level.sol";
import { EType } from "../constants/type.sol";
import { Level } from "./LibLevel.sol";
import { BASE_ENERGY, BASE_ENERGY_REGEN, BASE_ENERGY_CAP } from "../constants/resources.sol";
import { PositionComponent, ID as PID } from "components/PositionComponent.sol";

library Spaceship {
  function initHQShip(IUint256Component components, uint256 entity, PositionComponent.Position memory position) public {
    {
      uint32 mult = Level.getHQShipEnergyLevelMultiplier(1);
      LevelComponent(getAddressById(components, LID)).set(entity, LevelComponent.Level(1, 0, 0));
      ResourceComponent(getAddressById(components, RID)).set(
        entity,
        ResourceComponent.Resource(
          (BASE_ENERGY_CAP * mult) / 100,
          (BASE_ENERGY_CAP * mult) / 100,
          (BASE_ENERGY_REGEN * mult) / 100,
          uint32(block.number),
          0
        )
      );
    }
    TypeComponent(getAddressById(components, TID)).set(entity, uint32(EType.HQSHIP));
    PositionComponent(getAddressById(components, PID)).set(entity, position);
  }
}
