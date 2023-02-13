use std::marker::PhantomData;

use ark_ff::PrimeField;
use ark_r1cs_std::{fields::fp::FpVar, ToBitsGadget};
use ark_relations::r1cs::SynthesisError;
use arkworks_r1cs_gadgets::poseidon::FieldHasherGadget;

use crate::utils::const_fp;

#[derive(Debug, Clone, Copy)]
pub struct RandomGadget<F: PrimeField, HG: FieldHasherGadget<F>> {
    _f: PhantomData<F>,
    _hg: PhantomData<HG>,
}

impl<F: PrimeField, HG: FieldHasherGadget<F>> RandomGadget<F, HG> {
    /// input: three field elements: x, y, scale (all absolute value < 2^32)
    /// output: pseudorandom integer in [0, 15]
    pub fn random(
        hasher: &HG,
        x: &FpVar<F>,
        y: &FpVar<F>,
        seed: &FpVar<F>,
    ) -> Result<FpVar<F>, SynthesisError> {
        Ok(hasher
            .hash(&[x.clone(), y.clone(), seed.clone()])?
            .to_bits_le()?
            .iter()
            .take(4)
            .enumerate()
            .map(|(i, e)| -> Result<_, SynthesisError> {
                e.select(&const_fp(2u128.pow(i as u32)), &const_fp(0))
            })
            .collect::<Result<Vec<_>, _>>()?
            .iter()
            .sum())
    }
}
