use std::marker::PhantomData;

use ark_ff::PrimeField;
use ark_r1cs_std::{fields::fp::FpVar, prelude::EqGadget, select::CondSelectGadget};
use ark_relations::r1cs::SynthesisError;

use crate::utils::const_fp;

pub struct SelectorGadget<F: PrimeField> {
    _f: PhantomData<F>,
}

impl<F: PrimeField> SelectorGadget<F> {
    pub fn select_at_index<T: CondSelectGadget<F>>(
        index: &FpVar<F>,
        vec: &[T],
        default: T,
    ) -> Result<T, SynthesisError> {
        let mut selected = default;
        for (i, v) in vec.iter().enumerate() {
            selected = const_fp(i as u128).is_eq(&index)?.select(v, &selected)?;
        }
        Ok(selected)
    }

    pub fn select_at_index_nested_vec<T: CondSelectGadget<F>>(
        index: &FpVar<F>,
        vec: &[Vec<T>],
        default: Vec<T>,
    ) -> Result<Vec<T>, SynthesisError> {
        let mut selected = default;
        for (i, v) in vec.iter().enumerate() {
            let is_eq = const_fp(i as u128).is_eq(&index)?;
            for (j, nv) in v.iter().enumerate() {
                selected[j] = is_eq.select(nv, &selected[j])?;
            }
        }
        Ok(selected)
    }

    pub fn select_at_index_nested_slice<const N: usize, T: CondSelectGadget<F>>(
        index: &FpVar<F>,
        vec: &[[T; N]],
        default: [T; N],
    ) -> Result<[T; N], SynthesisError> {
        let mut selected = default;
        for (i, v) in vec.iter().enumerate() {
            let is_eq = const_fp(i as u128).is_eq(&index)?;
            for (j, nv) in v.iter().enumerate() {
                selected[j] = is_eq.select(nv, &selected[j])?;
            }
        }
        Ok(selected)
    }
}
