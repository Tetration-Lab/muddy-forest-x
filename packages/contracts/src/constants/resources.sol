// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

uint256 constant BASE = uint256(keccak256("resource.base"));
uint256 constant MAX_BASE = BASE + 1;

uint256 constant ADVANCED = uint256(keccak256("resource.advanced"));
uint256 constant ADVANCED_CNT = 2;
uint256 constant MAX_ADVANCED = ADVANCED + ADVANCED_CNT;

uint256 constant BASE_ENERGY = BASE + 1;
uint64 constant BASE_ENERGY_CAP = 5000;
uint32 constant BASE_ENERGY_REGEN = 80;

uint64 constant ADVANCED_CAP = 500;
uint32 constant ADVANCED_REGEN = 2;
