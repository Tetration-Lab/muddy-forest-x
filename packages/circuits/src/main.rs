use std::{error::Error, fs};

use ark_bn254::{Bn254, Fr};
use ark_crypto_primitives::CircuitSpecificSetupSNARK;
use ark_ff::Zero;
use ark_groth16::Groth16;
use ark_relations::r1cs::ConstraintSynthesizer;
use ark_serialize::CanonicalSerialize;
use ark_std::rand::thread_rng;
use arkworks_mimc::{
    params::{
        mimc_7_91_bn254::{MIMC_7_91_BN254_PARAMS, MIMC_7_91_BN254_ROUND_KEYS},
        round_keys_contants_to_vec,
    },
    MiMC,
};
use arkworks_solidity_verifier::SolidityVerifier;
use circuits::{DistanceCircuit, LocationCircuit};

fn generate<C: ConstraintSynthesizer<Fr>>(circuit: C, label: &str) -> Result<(), Box<dyn Error>> {
    println!("Generating keys for {}", label);
    let (pk, vk) = Groth16::<Bn254>::setup(circuit, &mut thread_rng())?;
    let manifest_dir = env!("CARGO_MANIFEST_DIR");

    let mut pk_bytes = vec![];
    let mut vk_bytes = vec![];

    println!("Serializing keys for {}", label);
    pk.serialize_uncompressed(&mut pk_bytes)?;
    vk.serialize_uncompressed(&mut vk_bytes)?;

    println!("Writing keys for {}", label);
    fs::write(format!("{}/out/{}_pk.bin", manifest_dir, label), pk_bytes)?;
    fs::write(format!("{}/out/{}_vk.bin", manifest_dir, label), vk_bytes)?;

    println!("Exporting verifier for {}", label);
    let verifier = Groth16::export(&vk);

    println!("Writing verifier for {}", label);
    fs::write(
        format!("{}/out/{}_verifier.sol", manifest_dir, label),
        verifier,
    )?;

    Ok(())
}

fn main() -> Result<(), Box<dyn Error>> {
    let dir = format!("{}/out", env!("CARGO_MANIFEST_DIR"));
    if let Err(_) = fs::read_dir(&dir) {
        fs::create_dir(&dir)?;
    }

    let hasher = MiMC::<Fr, MIMC_7_91_BN254_PARAMS>::new(
        1,
        Fr::zero(),
        round_keys_contants_to_vec(&MIMC_7_91_BN254_ROUND_KEYS),
    );

    generate(
        LocationCircuit {
            coord: [Fr::zero(); 2],
            result: Fr::zero(),
            hasher: hasher.clone(),
        },
        "location",
    )?;

    generate(
        DistanceCircuit {
            from_coord: [Fr::zero(); 2],
            from_location: Fr::zero(),
            target_coord: [Fr::zero(); 2],
            target_location: Fr::zero(),
            max_distance: Fr::zero(),
            hasher: hasher.clone(),
        },
        "distance",
    )?;

    Ok(())
}
