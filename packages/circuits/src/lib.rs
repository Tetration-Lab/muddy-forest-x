pub mod utils;
pub mod wasm;

use ark_ff::PrimeField;
use ark_r1cs_std::{
    fields::fp::FpVar,
    prelude::{AllocVar, EqGadget, FieldVar},
};
use ark_relations::r1cs::ConstraintSynthesizer;
use arkworks_mimc::{constraints::MiMCVar, MiMC, MiMCParameters};

pub struct LocationCircuit<F: PrimeField, MP: MiMCParameters> {
    pub coord: [F; 2],
    pub result: F,
    pub hasher: MiMC<F, MP>,
}

impl<F: PrimeField, MP: MiMCParameters> ConstraintSynthesizer<F> for LocationCircuit<F, MP> {
    fn generate_constraints(
        self,
        cs: ark_relations::r1cs::ConstraintSystemRef<F>,
    ) -> ark_relations::r1cs::Result<()> {
        let k = FpVar::new_input(cs.clone(), || Ok(self.hasher.k))?;
        let rounds = Vec::<FpVar<F>>::new_constant(cs.clone(), self.hasher.round_keys)?;
        let mimc_var = MiMCVar::<F, MP>::new(1, k, rounds);

        let coord_x = FpVar::new_witness(cs.clone(), || Ok(self.coord[0]))?;
        let coord_y = FpVar::new_witness(cs.clone(), || Ok(self.coord[1]))?;
        let result = FpVar::new_input(cs.clone(), || Ok(self.result))?;

        mimc_var.permute_non_feistel(vec![coord_x, coord_y])[0].enforce_equal(&result)?;

        Ok(())
    }
}

pub struct DistanceCircuit<F: PrimeField, MP: MiMCParameters> {
    pub from_coord: [F; 2],
    pub from_location: F,
    pub target_coord: [F; 2],
    pub target_location: F,
    pub max_distance: F,
    pub hasher: MiMC<F, MP>,
}

impl<F: PrimeField, MP: MiMCParameters> ConstraintSynthesizer<F> for DistanceCircuit<F, MP> {
    fn generate_constraints(
        self,
        cs: ark_relations::r1cs::ConstraintSystemRef<F>,
    ) -> ark_relations::r1cs::Result<()> {
        let k = FpVar::new_input(cs.clone(), || Ok(self.hasher.k))?;
        let rounds = Vec::<FpVar<F>>::new_constant(cs.clone(), self.hasher.round_keys)?;
        let mimc_var = MiMCVar::<F, MP>::new(1, k, rounds);

        let max_distance = FpVar::new_input(cs.clone(), || Ok(self.max_distance))?;
        let from_coord_x = FpVar::new_witness(cs.clone(), || Ok(self.from_coord[0]))?;
        let from_coord_y = FpVar::new_witness(cs.clone(), || Ok(self.from_coord[1]))?;
        let from_location = FpVar::new_input(cs.clone(), || Ok(self.from_location))?;
        let target_coord_x = FpVar::new_witness(cs.clone(), || Ok(self.target_coord[0]))?;
        let target_coord_y = FpVar::new_witness(cs.clone(), || Ok(self.target_coord[1]))?;
        let target_location = FpVar::new_input(cs.clone(), || Ok(self.target_location))?;

        (max_distance.square()?
            - &(&(&from_coord_x - &target_coord_x).square()?
                + &(&from_coord_y - &target_coord_y).square()?))
            .enforce_smaller_or_equal_than_mod_minus_one_div_two()?;
        mimc_var.permute_non_feistel(vec![from_coord_x, from_coord_y])[0]
            .enforce_equal(&from_location)?;
        mimc_var.permute_non_feistel(vec![target_coord_x, target_coord_y])[0]
            .enforce_equal(&target_location)?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use ark_bn254::{Bn254, Fr};
    use ark_crypto_primitives::{CircuitSpecificSetupSNARK, SNARK};
    use ark_groth16::Groth16;
    use ark_std::test_rng;
    use arkworks_mimc::{
        params::{
            mimc_7_91_bn254::{MIMC_7_91_BN254_PARAMS, MIMC_7_91_BN254_ROUND_KEYS},
            round_keys_contants_to_vec,
        },
        MiMC,
    };

    use crate::{DistanceCircuit, LocationCircuit};

    #[test]
    fn location() {
        let x = 0;
        let y = 0;
        let k = 0;

        let coord = [Fr::from(x), Fr::from(y)];
        let k = Fr::from(k);
        let mimc = MiMC::new(
            1,
            k,
            round_keys_contants_to_vec(&MIMC_7_91_BN254_ROUND_KEYS),
        );
        let rng = &mut test_rng();
        let result = mimc.permute_non_feistel(vec![coord[0], coord[1]])[0];

        let (pk, vk) = Groth16::<Bn254>::setup(
            LocationCircuit::<_, MIMC_7_91_BN254_PARAMS> {
                coord,
                result,
                hasher: mimc.clone(),
            },
            rng,
        )
        .unwrap();

        let proof = Groth16::prove(
            &pk,
            LocationCircuit::<_, MIMC_7_91_BN254_PARAMS> {
                coord,
                result,
                hasher: mimc,
            },
            rng,
        )
        .unwrap();

        assert!(Groth16::verify(&vk, &[k, result], &proof).unwrap());
    }

    #[test]
    fn distance() {
        let rng = &mut test_rng();

        let x1: i128 = 1285;
        let y1: i128 = 192058;
        let x2: i128 = 8943760;
        let y2: i128 = 182;
        let k = 1;

        let k = Fr::from(k);
        let mimc = MiMC::new(
            1,
            k,
            round_keys_contants_to_vec(&MIMC_7_91_BN254_ROUND_KEYS),
        );

        let dist_square = (x1 - x2).pow(2) + (y1 - y2).pow(2) - 100000;
        let from_coord = [Fr::from(x1), Fr::from(y1)];
        let from_location = mimc.permute_non_feistel(from_coord.to_vec())[0];
        let target_coord = [Fr::from(x2), Fr::from(y2)];
        let target_location = mimc.permute_non_feistel(target_coord.to_vec())[0];
        let max_distance = Fr::from(dist_square);

        let (pk, vk) = Groth16::<Bn254>::setup(
            DistanceCircuit::<_, MIMC_7_91_BN254_PARAMS> {
                from_coord,
                from_location,
                target_coord,
                target_location,
                max_distance,
                hasher: mimc.clone(),
            },
            rng,
        )
        .unwrap();

        let proof = Groth16::prove(
            &pk,
            DistanceCircuit::<_, MIMC_7_91_BN254_PARAMS> {
                from_coord,
                from_location,
                target_coord,
                target_location,
                max_distance,
                hasher: mimc.clone(),
            },
            rng,
        )
        .unwrap();

        assert!(Groth16::verify(
            &vk,
            &[k, max_distance, from_location, target_location],
            &proof
        )
        .unwrap());
    }
}
