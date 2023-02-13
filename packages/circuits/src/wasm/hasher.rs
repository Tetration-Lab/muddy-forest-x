use std::panic;

use ark_bn254::Fr;
use arkworks_native_gadgets::poseidon::{FieldHasher, Poseidon};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{
    utils::setup_poseidon,
    wasm::{bf, fr},
};

#[wasm_bindgen]
#[allow(dead_code)]
pub struct Hasher {
    hasher: Poseidon<Fr>,
}

#[wasm_bindgen]
impl Hasher {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        panic::set_hook(Box::new(console_error_panic_hook::hook));
        Self {
            hasher: setup_poseidon(),
        }
    }

    pub fn hash_one(&self, v: &str) -> String {
        bf(self.hasher.hash(&[fr(v)]).unwrap())
    }

    pub fn hash_two(&self, v1: &str, v2: &str) -> String {
        bf(self.hasher.hash(&[fr(v1), fr(v2)]).unwrap())
    }

    pub fn hash_three(&self, v1: &str, v2: &str, v3: &str) -> String {
        bf(self.hasher.hash(&[fr(v1), fr(v2), fr(v3)]).unwrap())
    }
}
