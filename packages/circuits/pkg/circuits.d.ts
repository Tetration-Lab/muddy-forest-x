/* tslint:disable */
/* eslint-disable */
/**
*/
export class Hasher {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} v
* @returns {string}
*/
  hash_one(v: string): string;
/**
* @param {string} v1
* @param {string} v2
* @returns {string}
*/
  hash_two(v1: string, v2: string): string;
/**
* @param {string} v1
* @param {string} v2
* @param {string} v3
* @returns {string}
*/
  hash_three(v1: string, v2: string, v3: string): string;
/**
* @param {bigint} v
* @returns {string}
*/
  hash_one_i(v: bigint): string;
/**
* @param {bigint} v1
* @param {bigint} v2
* @returns {string}
*/
  hash_two_i(v1: bigint, v2: bigint): string;
/**
* @param {bigint} v1
* @param {bigint} v2
* @param {bigint} v3
* @returns {string}
*/
  hash_three_i(v1: bigint, v2: bigint, v3: bigint): string;
}
