pub mod utils;
pub mod wasm;

use ark_ff::PrimeField;
use ark_r1cs_std::{
    fields::fp::FpVar,
    prelude::{AllocVar, EqGadget},
};
use ark_relations::r1cs::ConstraintSynthesizer;
use arkworks_r1cs_gadgets::poseidon::FieldHasherGadget;

pub struct LocationCircuit<F: PrimeField, HG: FieldHasherGadget<F>> {
    pub coord: [F; 2],
    pub seed: F,
    pub result: F,
    pub hasher: HG::Native,
}

impl<F: PrimeField, HG: FieldHasherGadget<F>> ConstraintSynthesizer<F> for LocationCircuit<F, HG> {
    fn generate_constraints(
        self,
        cs: ark_relations::r1cs::ConstraintSystemRef<F>,
    ) -> ark_relations::r1cs::Result<()> {
        let hasher = HG::from_native(&mut cs.clone(), self.hasher)?;
        let coord_x = FpVar::new_witness(cs.clone(), || Ok(self.coord[0]))?;
        let coord_y = FpVar::new_witness(cs.clone(), || Ok(self.coord[1]))?;
        let seed = FpVar::new_input(cs.clone(), || Ok(self.seed))?;
        let result = FpVar::new_input(cs.clone(), || Ok(self.result))?;

        hasher
            .hash(&[coord_x, coord_y, seed])?
            .enforce_equal(&result)?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use ark_bn254::{Bn254, Fr};
    use ark_crypto_primitives::{CircuitSpecificSetupSNARK, SNARK};
    use ark_groth16::Groth16;
    use ark_std::test_rng;
    use arkworks_native_gadgets::poseidon::FieldHasher;
    use arkworks_r1cs_gadgets::poseidon::PoseidonGadget;

    use crate::{utils::setup_poseidon, LocationCircuit};

    #[test]
    fn poseidon() {
        let x = 0;
        let y = 0;
        let seed = 0;

        let coord = [Fr::from(x), Fr::from(y)];
        let seed = Fr::from(seed);
        let poseidon = setup_poseidon::<Fr>();
        let rng = &mut test_rng();
        let result = poseidon.hash(&[coord[0], coord[1], seed]).unwrap();

        let (pk, vk) = Groth16::<Bn254>::setup(
            LocationCircuit::<_, PoseidonGadget<Fr>> {
                coord,
                seed,
                result,
                hasher: poseidon.clone(),
            },
            rng,
        )
        .unwrap();

        let proof = Groth16::prove(
            &pk,
            LocationCircuit::<_, PoseidonGadget<Fr>> {
                coord,
                seed,
                result,
                hasher: poseidon.clone(),
            },
            rng,
        )
        .unwrap();

        assert!(Groth16::verify(&vk, &[seed, result], &proof).unwrap());
    }
}
