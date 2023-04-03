# Circuits

Muddy Forest uses zkSNARK and hashed coordinates counterparts to hide the actual coordinates in space map (similarly to Dark Forest).

We specifically use Groth16 on BN254 because of its speed and easiness of circuit development. And we choose [Arkworks](https://github.com/arkworks-rs/) to be our SNARK framework due to the generic interfaces using Rust language that makes the interoperability with future proving systems, curves, crypto primitives (hashing function) straightforward and effortless.

## Directory Structure

```
├── Cargo.toml
├── out // Pre-generated PK, VK, and Solidity verifier
│   ├── distance_pk.bin
│   ├── distance_verifier.sol
│   ├── distance_vk.bin
│   ├── location_pk.bin
│   ├── location_verifier.sol
│   └── location_vk.bin
├── pkg // WASM binding package
└── src
    ├── lib.rs // Circuits and tests
    ├── main.rs // Out-files generation
    ├── perlin
    │   ├── gradient.rs
    │   ├── random.rs
    │   └── selector.rs
    ├── perlin.rs // Perlin-related (not used atm)
    ├── utils.rs
    ├── wasm
    │   └── hasher.rs
    └── wasm.rs // Wasm-related
```

## Circuit List

- Location Circuit - Prove that we know $A=H(x,y)$
  - $A$ is public input
  - $x,y$ are coordinates and are private inputs
  - $H$ is Non-fiestel $x^7$ MiMC hashing function
- Distance Circuit - Prove that we know $A=H(x_1,y_1)$, $B=H(x_2,y_2)$, $R^2=(y_2-y_1)^2$, and $D-R\le\frac{p-1}{2}$.
  - $D$ is the maximum range, and is public input
  - $A,B$ are result locations and are public inputs
  - $x,y$ are coordinates and are private inputs
  - $H$ is Non-fiestel $x^7$ MiMC hashing function

## Key And Solidity Verifier Generation

All of the out-files, including proving key, verifying key, and solidity verifier are generated from `./src/main.rs` file.

If circuits are added or modified, those out-files are needed to be regenerated as well by editing circuit initialisation and setup in `./src/main.rs` and then run `cargo run`.

## WASM Bindgen Package

The client package can access hashing function, zk prover, and other Rust functions through WASM bindgen in `./src/wasm.rs` file.

If more functions are added or modified, the package can be rebuilt using `wasm-pack build`.
