pub mod utils;

#[cfg(test)]
mod tests {
    use ark_bn254::Fr;
    use ark_ff::{BigInteger, PrimeField};
    use arkworks_native_gadgets::poseidon::FieldHasher;

    use crate::utils::setup_poseidon;

    #[test]
    fn poseidon() {
        let poseidon = setup_poseidon::<Fr>();
        let result = poseidon
            .hash_two(&Fr::from(1), &Fr::from(2))
            .unwrap()
            .into_repr();

        println!("{:?}", result.to_bytes_le());
        println!("{:?}", result.to_bytes_be());

        let le = hex::encode(result.to_bytes_le());
        let be = hex::encode(result.to_bytes_be());

        println!("{}", le);
        println!("{}", be);
    }
}
