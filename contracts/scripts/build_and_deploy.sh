#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# SwapX — Soroban Contract Build & Deploy Helper
#
# Prerequisites:
#   - Rust + Cargo installed  (https://rustup.rs)
#   - wasm32 target added:    rustup target add wasm32-unknown-unknown
#   - Stellar CLI installed:  cargo install --locked stellar-cli --features opt
#   - DEPLOYER_SECRET env var set to your testnet secret key
#
# Usage (PowerShell):
#   bash contracts/scripts/build_and_deploy.sh [command]
#
# Commands:
#   build    — compile the hello_world contract to WASM
#   test     — run contract unit tests
#   deploy   — build + deploy to Stellar Testnet
#   invoke   — call hello("SwapX") on the deployed contract
#   all      — build → test → deploy → invoke
# ─────────────────────────────────────────────────────────────────────────────

set -e

NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
CONTRACT_NAME="hello-world"
WASM_PATH="target/wasm32-unknown-unknown/release/hello_world.wasm"

# ── Helpers ──────────────────────────────────────────────────────────────────

info()  { echo -e "\033[1;36m[SwapX]\033[0m $*"; }
ok()    { echo -e "\033[1;32m[OK]\033[0m $*"; }
fail()  { echo -e "\033[1;31m[ERR]\033[0m $*"; exit 1; }

require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "Missing: $1. Please install it first."; }

# ── Commands ─────────────────────────────────────────────────────────────────

cmd_build() {
    info "Building $CONTRACT_NAME → WASM …"
    cargo build --release \
        --target wasm32-unknown-unknown \
        --manifest-path contracts/hello_world/Cargo.toml
    ok "WASM output: $WASM_PATH"
}

cmd_test() {
    info "Running unit tests for $CONTRACT_NAME …"
    cargo test \
        --manifest-path contracts/hello_world/Cargo.toml \
        --features testutils -- --nocapture
    ok "All tests passed."
}

cmd_deploy() {
    require_cmd stellar
    [[ -z "$DEPLOYER_SECRET" ]] && fail "Set DEPLOYER_SECRET env var to your testnet secret key."

    cmd_build

    info "Deploying $CONTRACT_NAME to Stellar $NETWORK …"
    CONTRACT_ID=$(stellar contract deploy \
        --wasm "$WASM_PATH" \
        --source "$DEPLOYER_SECRET" \
        --network "$NETWORK" \
        --rpc-url "$RPC_URL" \
        --network-passphrase "$NETWORK_PASSPHRASE")

    echo "$CONTRACT_ID" > .soroban/contract_id.txt
    ok "Deployed! Contract ID: $CONTRACT_ID"
    info "Explorer: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
}

cmd_invoke() {
    require_cmd stellar
    [[ ! -f .soroban/contract_id.txt ]] && fail "No deployed contract ID found. Run 'deploy' first."
    CONTRACT_ID=$(cat .soroban/contract_id.txt)

    info "Invoking hello('SwapX', 'Testnet') on $CONTRACT_ID …"
    stellar contract invoke \
        --id "$CONTRACT_ID" \
        --source "$DEPLOYER_SECRET" \
        --network "$NETWORK" \
        --rpc-url "$RPC_URL" \
        --network-passphrase "$NETWORK_PASSPHRASE" \
        -- hello \
        --to '["SwapX","Testnet"]'
}

# ── Entry-point ───────────────────────────────────────────────────────────────

CMD="${1:-all}"
case "$CMD" in
    build)  cmd_build ;;
    test)   cmd_test ;;
    deploy) cmd_deploy ;;
    invoke) cmd_invoke ;;
    all)
        cmd_build
        cmd_test
        cmd_deploy
        cmd_invoke
        ;;
    *) fail "Unknown command: $CMD. Use: build | test | deploy | invoke | all" ;;
esac
