use ark_ec::ProjectiveCurve;
use ark_ff::{Field, PrimeField};
use ark_r1cs_std::{fields::fp::FpVar, prelude::FieldVar};
use arkworks_native_gadgets::poseidon::{sbox::PoseidonSbox, Poseidon, PoseidonParameters};
use arkworks_utils::{
    bytes_matrix_to_f, bytes_vec_to_f, poseidon_params::setup_poseidon_params, Curve,
};

pub type ConstraintF<C> = <<C as ProjectiveCurve>::BaseField as Field>::BasePrimeField;

pub fn setup_poseidon<F: PrimeField>() -> Poseidon<F> {
    let pos_data = setup_poseidon_params(Curve::Bn254, 5, 4).unwrap();

    let mds_f = bytes_matrix_to_f(&pos_data.mds);
    let rounds_f = bytes_vec_to_f(&pos_data.rounds);

    Poseidon::new(PoseidonParameters {
        mds_matrix: mds_f,
        round_keys: rounds_f,
        full_rounds: pos_data.full_rounds,
        partial_rounds: pos_data.partial_rounds,
        sbox: PoseidonSbox(pos_data.exp),
        width: pos_data.width,
    })
}

pub fn const_fp<F: PrimeField>(v: u128) -> FpVar<F> {
    FpVar::constant(F::from(v))
}

pub fn const_fp_i32<F: PrimeField>(v: i32) -> FpVar<F> {
    let abs = F::from(v.abs_diff(0));
    match v.is_negative() {
        true => FpVar::constant(-abs),
        false => FpVar::constant(abs),
    }
}
