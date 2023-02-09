use std::marker::PhantomData;

use ark_ff::PrimeField;
use ark_r1cs_std::fields::fp::FpVar;
use ark_relations::r1cs::SynthesisError;
use arkworks_r1cs_gadgets::poseidon::FieldHasherGadget;

use crate::utils::{const_fp, const_fp_i32};

use super::{random::RandomGadget, selector::SelectorGadget};

const VECS: &[&[i32]] = &[
    &[1000, 0],
    &[923, 382],
    &[707, 707],
    &[382, 923],
    &[0, 1000],
    &[-383, 923],
    &[-708, 707],
    &[-924, 382],
    &[-1000, 0],
    &[-924, -383],
    &[-708, -708],
    &[-383, -924],
    &[-1, -1000],
    &[382, -924],
    &[707, -708],
    &[923, -383],
];

pub struct GradientGadget<F: PrimeField, HG: FieldHasherGadget<F>> {
    _f: PhantomData<F>,
    _hg: PhantomData<HG>,
}

impl<F: PrimeField, HG: FieldHasherGadget<F>> GradientGadget<F, HG> {
    // input: three field elements x, y, scale (all absolute value < 2^32)
    // output: (NUMERATORS) a random unit vector in one of 16 directions
    pub fn at(
        hasher: &HG,
        x: &FpVar<F>,
        y: &FpVar<F>,
        seed: &FpVar<F>,
    ) -> Result<[FpVar<F>; 2], SynthesisError> {
        let mut vecs = Vec::<[FpVar<F>; 2]>::new();
        for i in VECS {
            vecs.push([const_fp_i32(i[0]), const_fp_i32(i[1])]);
        }

        let rand = RandomGadget::random(hasher, x, y, seed)?;
        let selected =
            SelectorGadget::select_at_index_nested_slice(&rand, &vecs, [const_fp(0), const_fp(0)])?;

        Ok(selected)
    }
}
