pub mod utils;
pub mod wasm;

use ark_ff::PrimeField;
use ark_r1cs_std::{
    fields::fp::FpVar,
    prelude::{AllocVar, EqGadget, FieldVar},
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

pub struct DistanceCircuit<F: PrimeField, HG: FieldHasherGadget<F>> {
    pub from_coord: [F; 2],
    pub from_location: F,
    pub target_coord: [F; 2],
    pub target_location: F,
    pub seed: F,
    pub max_distance: F,
    pub hasher: HG::Native,
}

impl<F: PrimeField, HG: FieldHasherGadget<F>> ConstraintSynthesizer<F> for DistanceCircuit<F, HG> {
    fn generate_constraints(
        self,
        cs: ark_relations::r1cs::ConstraintSystemRef<F>,
    ) -> ark_relations::r1cs::Result<()> {
        let hasher = HG::from_native(&mut cs.clone(), self.hasher)?;
        let seed = FpVar::new_input(cs.clone(), || Ok(self.seed))?;
        let max_distance = FpVar::new_input(cs.clone(), || Ok(self.max_distance))?;
        let from_coord_x = FpVar::new_witness(cs.clone(), || Ok(self.from_coord[0]))?;
        let from_coord_y = FpVar::new_witness(cs.clone(), || Ok(self.from_coord[1]))?;
        let from_location = FpVar::new_input(cs.clone(), || Ok(self.from_location))?;
        let target_coord_x = FpVar::new_witness(cs.clone(), || Ok(self.target_coord[0]))?;
        let target_coord_y = FpVar::new_witness(cs.clone(), || Ok(self.target_coord[1]))?;
        let target_location = FpVar::new_input(cs.clone(), || Ok(self.target_location))?;

        hasher
            .hash(&[from_coord_x.clone(), from_coord_y.clone(), seed.clone()])?
            .enforce_equal(&from_location)?;
        hasher
            .hash(&[target_coord_x.clone(), target_coord_y.clone(), seed])?
            .enforce_equal(&target_location)?;

        (max_distance.square()?
            - &(&(&from_coord_x - &target_coord_x).square()?
                + &(&from_coord_y - &target_coord_y).square()?))
            .enforce_smaller_or_equal_than_mod_minus_one_div_two()?;

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

    use crate::{utils::setup_poseidon, DistanceCircuit, LocationCircuit};

    #[test]
    fn location() {
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

    #[test]
    fn distance() {
        let poseidon = setup_poseidon::<Fr>();
        let rng = &mut test_rng();

        let x1: i128 = 1285;
        let y1: i128 = 192058;
        let x2: i128 = 8943760;
        let y2: i128 = 182;
        let dist_square = (x1 - x2).pow(2) + (y1 - y2).pow(2) - 100000;
        let seed = 128195;

        let seed = Fr::from(seed);
        let from_coord = [Fr::from(x1), Fr::from(y1)];
        let from_location = poseidon
            .hash(&[from_coord[0], from_coord[1], seed])
            .unwrap();
        let target_coord = [Fr::from(x2), Fr::from(y2)];
        let target_location = poseidon
            .hash(&[target_coord[0], target_coord[1], seed])
            .unwrap();
        let max_distance = Fr::from(dist_square);

        let (pk, vk) = Groth16::<Bn254>::setup(
            DistanceCircuit::<_, PoseidonGadget<Fr>> {
                from_coord,
                from_location,
                target_coord,
                target_location,
                seed,
                max_distance,
                hasher: poseidon.clone(),
            },
            rng,
        )
        .unwrap();

        let proof = Groth16::prove(
            &pk,
            DistanceCircuit::<_, PoseidonGadget<Fr>> {
                from_coord,
                from_location,
                target_coord,
                target_location,
                seed,
                max_distance,
                hasher: poseidon.clone(),
            },
            rng,
        )
        .unwrap();

        assert!(Groth16::verify(
            &vk,
            &[seed, max_distance, from_location, target_location],
            &proof
        )
        .unwrap());
    }
}
