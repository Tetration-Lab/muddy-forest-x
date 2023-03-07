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
import { OwnerComponent, ID as OID } from "components/OwnerComponent.sol";
import { BaseBlueprintComponent } from "components/BaseBlueprintComponent.sol";
import { Stat } from "libraries/LibStat.sol";

library Spaceship {
  function initHQShip(
    IUint256Component components,
    uint256 entity,
    PositionComponent.Position memory position,
    uint256 owner
  ) public {
    {
      uint32 mult = Level.getHQShipEnergyLevelMultiplier(1);
      uint256 energyId = getResourceEntity(entity, BASE_ENERGY);
      LevelComponent(getAddressById(components, LID)).set(entity, LevelComponent.Level(1, 0, 0));
      ResourceComponent(getAddressById(components, RID)).set(
        energyId,
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
    OwnerComponent(getAddressById(components, OID)).set(entity, owner);
  }

  function initNewShip(
    IUint256Component components,
    uint256 entity,
    PositionComponent.Position memory position,
    BaseBlueprintComponent.Blueprint memory bp,
    uint256 owner
  ) public {
    {
      uint256 energyId = getResourceEntity(entity, BASE_ENERGY);
      LevelComponent(getAddressById(components, LID)).set(entity, LevelComponent.Level(bp.level, 0, 0));
      ResourceComponent(getAddressById(components, RID)).set(
        energyId,
        ResourceComponent.Resource(
          (bp.resources[0].cap) / 100,
          (bp.resources[0].cap) / 100,
          (bp.resources[0].rpb) / 100,
          uint32(block.number),
          0
        )
      );
    }
    TypeComponent(getAddressById(components, TID)).set(entity, uint32(EType.SPACESHIP));
    PositionComponent(getAddressById(components, PID)).set(entity, position);
    Stat.incrementAttackMult(components, entity, bp.attack);
    Stat.incrementDefenseMult(components, entity, bp.defense);
    OwnerComponent(getAddressById(components, OID)).set(entity, owner);
  }
}
