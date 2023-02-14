pub mod hasher;

use std::str::FromStr;

use ark_bn254::{Fq, Fr};
use ark_ff::{BigInteger256, PrimeField};

pub fn fr(s: &str) -> Fr {
    Fr::from_repr(bi(s)).unwrap()
}

pub fn fri(i: i64) -> Fr {
    Fr::from(i)
}

pub fn fq(s: &str) -> Fq {
    Fq::from_repr(bi(s)).unwrap()
}

pub fn bi(s: &str) -> BigInteger256 {
    BigInteger256::new(ethereum_types::U256::from_str(s).unwrap().0)
}

pub fn bf(f: impl PrimeField) -> String {
    format!("0x{}", f.into_repr())
}
