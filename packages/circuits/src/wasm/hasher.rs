use std::panic;

use ark_bn254::Fr;
use ark_ff::Zero;
use arkworks_mimc::{
    params::{
        mimc_7_91_bn254::{MIMC_7_91_BN254_PARAMS, MIMC_7_91_BN254_ROUND_KEYS},
        round_keys_contants_to_vec,
    },
    MiMC,
};
use arkworks_native_gadgets::poseidon::FieldHasher;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::wasm::{bf, fr};

use super::fri;

#[wasm_bindgen]
#[allow(dead_code)]
pub struct Hasher {
    hasher: MiMC<Fr, MIMC_7_91_BN254_PARAMS>,
}

#[wasm_bindgen]
impl Hasher {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        panic::set_hook(Box::new(console_error_panic_hook::hook));
        Self {
            hasher: MiMC::new(
                1,
                Fr::zero(),
                round_keys_contants_to_vec(&MIMC_7_91_BN254_ROUND_KEYS),
            ),
        }
    }

    pub fn hash_one(&self, v: &str) -> String {
        bf(self.hasher.permute_non_feistel(vec![fr(v)])[0])
    }

    pub fn hash_two(&self, v1: &str, v2: &str) -> String {
        bf(self.hasher.permute_non_feistel(vec![fr(v1), fr(v2)])[0])
    }

    pub fn hash_three(&self, v1: &str, v2: &str, v3: &str) -> String {
        bf(self
            .hasher
            .permute_non_feistel(vec![fr(v1), fr(v2), fr(v3)])[0])
    }

    pub fn hash_one_i(&self, v: i64) -> String {
        bf(self.hasher.permute_non_feistel(vec![fri(v)])[0])
    }

    pub fn hash_two_i(&self, v1: i64, v2: i64) -> String {
        bf(self.hasher.permute_non_feistel(vec![fri(v1), fri(v2)])[0])
    }

    pub fn hash_three_i(&self, v1: i64, v2: i64, v3: i64) -> String {
        bf(self
            .hasher
            .permute_non_feistel(vec![fri(v1), fri(v2), fri(v3)])[0])
    }
}
