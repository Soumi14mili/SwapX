# SwapX — Soroban Contracts

This directory contains all Soroban (Stellar smart-contract) source code for the SwapX DEX.

## Directory Structure

```
contracts/
├── hello_world/            # Primary SwapX DEX contract
│   ├── src/
│   │   └── lib.rs          # Contract source — AMM logic + hello() entry point
│   └── Cargo.toml          # Crate manifest (soroban-sdk dependency)
├── scripts/
│   └── build_and_deploy.sh # One-shot build → test → deploy → invoke helper
Cargo.toml                  # Workspace manifest (project root)
rust-toolchain.toml         # Pins stable Rust + wasm32 target
.soroban/
└── network.toml            # Stellar CLI network config (testnet RPC URL)
```

## Prerequisites

| Tool | Install command |
|------|----------------|
| Rust + Cargo | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| WASM target  | `rustup target add wasm32-unknown-unknown` |
| Stellar CLI  | `cargo install --locked stellar-cli --features opt` |

## Quick Start

```bash
# 1. Build WASM binary
cargo build --release \
  --target wasm32-unknown-unknown \
  --manifest-path contracts/hello_world/Cargo.toml

# 2. Run unit tests
cargo test \
  --manifest-path contracts/hello_world/Cargo.toml \
  --features testutils

# 3. Deploy to Testnet (requires DEPLOYER_SECRET env var)
export DEPLOYER_SECRET="S..."        # your testnet secret key
bash contracts/scripts/build_and_deploy.sh deploy

# 4. Invoke hello() on the deployed contract
bash contracts/scripts/build_and_deploy.sh invoke

# --- Or run everything at once ---
bash contracts/scripts/build_and_deploy.sh all
```

## Contract Functions

### `hello(to: Vec<String>) → Vec<String>`
Classic hello-world entry point.  
Returns `["Hello", ...to]`.

### `initialize(admin: Address)`
Bootstrap the contract — sets admin address and zeroes the swap counter.  
Panics if called more than once.

### `create_pool(creator, token_a, token_b, fee_bps) → bool`
Register a new XY = K liquidity pool for a token pair.  
`fee_bps = 30` means a 0.30 % swap fee.

### `add_liquidity(provider, token_a, token_b, amount_a, amount_b) → i128`
Deposit tokens and receive LP shares.

### `remove_liquidity(provider, token_a, token_b, lp_shares) → (i128, i128)`
Burn LP shares and withdraw proportional underlying tokens.

### `swap_tokens(trader, token_in, token_out, amount_in, min_amount_out) → i128`
Constant-product AMM swap.  
Reverts if slippage exceeds `min_amount_out`.

### `get_pool_info(token_a, token_b) → LiquidityPool`
Read-only pool state (reserves, fee, LP shares outstanding).

### `get_total_swaps() → u64`
Lifetime swap counter.

### `get_lp_balance(user, token_a, token_b) → i128`
LP share balance for a specific user + pool combination.

## On-Chain Events

| Event topic | Payload | When emitted |
|-------------|---------|--------------|
| `(init, swapx)` | `admin: Address` | `initialize()` |
| `(pool_new, token_a)` | `token_b: Address` | `create_pool()` |
| `(lp_add, provider)` | `lp_minted: i128` | `add_liquidity()` |
| `(lp_rm, provider)` | `(amount_a, amount_b)` | `remove_liquidity()` |
| `(swap, trader)` | `(amount_in, amount_out)` | `swap_tokens()` |

The SwapX frontend subscribes to these events through the **LiveEventStream** component.

## Adding a New Contract

1. Create `contracts/<name>/src/lib.rs` with your contract code.
2. Create `contracts/<name>/Cargo.toml` (use `hello_world/Cargo.toml` as template).
3. Add `"contracts/<name>"` to the `members` array in the root `Cargo.toml`.
4. Update `contracts/scripts/build_and_deploy.sh` if needed.
