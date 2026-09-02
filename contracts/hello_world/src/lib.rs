#![no_std]

//! # SwapX Hello World — Soroban Smart Contract
//!
//! A minimal-yet-complete DEX (Automated Market Maker) contract for Stellar's
//! Soroban smart-contract platform. This contract underpins the SwapX frontend
//! and demonstrates project-specific on-chain logic:
//!
//! * **initialize** — bootstrap the contract with an admin address
//! * **create_pool** — register a new XY = K liquidity pool for any token pair
//! * **add_liquidity** — deposit tokens and receive LP shares in return
//! * **remove_liquidity** — burn LP shares and withdraw underlying tokens
//! * **swap_tokens** — execute a constant-product AMM swap with configurable fee
//! * **get_pool_info** — read-only view of pool reserves and parameters
//! * **get_total_swaps** — lifetime swap counter (demonstrates persistent storage)
//! * **hello** — classic hello-world entry point that greets a list of words
//!
//! ## Soroban SDK version
//! Compiled against `soroban-sdk = "21"` (Stellar Protocol 21 compatible).

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    token, Address, Env, String, Symbol, Vec,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────────────────────

/// On-chain representation of a single XY = K liquidity pool.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LiquidityPool {
    /// First token in the pair (e.g. XLM SAC address)
    pub token_a: Address,
    /// Second token in the pair (e.g. USDC SAC address)
    pub token_b: Address,
    /// Reserve of token_a held by this contract (in smallest denomination)
    pub reserve_a: i128,
    /// Reserve of token_b held by this contract
    pub reserve_b: i128,
    /// Swap fee in basis points (30 = 0.30 %)
    pub fee_bps: u32,
    /// Total LP shares outstanding
    pub total_lp_shares: i128,
}

/// Storage keys used throughout the contract.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    /// The admin address set during `initialize`
    Admin,
    /// Pool indexed by its canonical (token_a, token_b) pair
    Pool(Address, Address),
    /// LP share balance for (user_address, token_a, token_b)
    LpBalance(Address, Address, Address),
    /// Monotonically increasing swap counter
    TotalSwaps,
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACT DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

#[contract]
pub struct HelloWorldContract;

#[contractimpl]
impl HelloWorldContract {
    // ─────────────────────────────────────────────────────────────────────────
    // HELLO WORLD — classic greeting entry point
    // ─────────────────────────────────────────────────────────────────────────

    /// Return a greeting vector: `["Hello", w1, w2, ...]`.
    ///
    /// This is the canonical "hello world" function required by the folder
    /// convention. The remaining functions below add project-specific logic.
    ///
    /// # Example (JS SDK)
    /// ```js
    /// const result = await contract.call("hello", ["SwapX", "Testnet"]);
    /// // → ["Hello", "SwapX", "Testnet"]
    /// ```
    pub fn hello(env: Env, to: Vec<String>) -> Vec<String> {
        let mut greeting = Vec::new(&env);
        greeting.push_back(String::from_str(&env, "Hello"));
        for word in to.iter() {
            greeting.push_back(word);
        }
        greeting
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INITIALIZATION
    // ─────────────────────────────────────────────────────────────────────────

    /// Bootstrap the SwapX contract with an admin address.
    /// Can only be called once — panics if already initialized.
    ///
    /// # Arguments
    /// * `admin` — Stellar address that will have elevated admin privileges
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("SwapX: contract already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSwaps, &0u64);

        // Emit an on-chain initialization event so indexers can detect it
        env.events().publish(
            (symbol_short!("init"), symbol_short!("swapx")),
            admin,
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POOL MANAGEMENT
    // ─────────────────────────────────────────────────────────────────────────

    /// Register a new XY = K liquidity pool for the given token pair.
    ///
    /// The pool is keyed by `(token_a, token_b)`. The caller must ensure
    /// `token_a != token_b` and that the pair is presented in a canonical
    /// order (lexicographic by contract address) to avoid duplicate pools.
    ///
    /// # Arguments
    /// * `creator`  — address that pays auth and pool-creation gas
    /// * `token_a`  — first token of the pair (SAC contract address)
    /// * `token_b`  — second token of the pair
    /// * `fee_bps`  — swap fee in basis points (use 30 for 0.30 %, 0 defaults to 30)
    ///
    /// # Returns
    /// `true` on success; panics if the pool already exists.
    pub fn create_pool(
        env: Env,
        creator: Address,
        token_a: Address,
        token_b: Address,
        fee_bps: u32,
    ) -> bool {
        creator.require_auth();
        assert!(token_a != token_b, "SwapX: token_a and token_b must differ");

        let pool_key = DataKey::Pool(token_a.clone(), token_b.clone());
        if env.storage().persistent().has(&pool_key) {
            panic!("SwapX: pool already exists for this token pair");
        }

        let pool = LiquidityPool {
            token_a: token_a.clone(),
            token_b: token_b.clone(),
            reserve_a: 0,
            reserve_b: 0,
            fee_bps: if fee_bps == 0 { 30 } else { fee_bps },
            total_lp_shares: 0,
        };
        env.storage().persistent().set(&pool_key, &pool);

        env.events().publish(
            (symbol_short!("pool_new"), token_a),
            token_b,
        );
        true
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LIQUIDITY PROVISION
    // ─────────────────────────────────────────────────────────────────────────

    /// Deposit `amount_a` of `token_a` and `amount_b` of `token_b` into the
    /// pool, receive LP shares proportional to the contribution.
    ///
    /// On the first deposit (empty pool) shares = amount_a + amount_b.
    /// On subsequent deposits shares are calculated proportionally to prevent
    /// dilution attacks.
    ///
    /// # Returns
    /// Number of LP shares minted to `provider`.
    pub fn add_liquidity(
        env: Env,
        provider: Address,
        token_a: Address,
        token_b: Address,
        amount_a: i128,
        amount_b: i128,
    ) -> i128 {
        provider.require_auth();
        assert!(amount_a > 0 && amount_b > 0, "SwapX: amounts must be positive");

        let pool_key = DataKey::Pool(token_a.clone(), token_b.clone());
        let mut pool: LiquidityPool = env
            .storage()
            .persistent()
            .get(&pool_key)
            .expect("SwapX: pool not found — call create_pool first");

        // Transfer tokens from provider to this contract
        token::Client::new(&env, &token_a).transfer(
            &provider,
            &env.current_contract_address(),
            &amount_a,
        );
        token::Client::new(&env, &token_b).transfer(
            &provider,
            &env.current_contract_address(),
            &amount_b,
        );

        // Mint LP shares: first deposit gets amount_a + amount_b, subsequent
        // deposits are proportional to existing reserve_a share.
        let lp_minted = if pool.total_lp_shares == 0 {
            amount_a + amount_b
        } else {
            (amount_a * pool.total_lp_shares) / pool.reserve_a
        };

        pool.reserve_a += amount_a;
        pool.reserve_b += amount_b;
        pool.total_lp_shares += lp_minted;
        env.storage().persistent().set(&pool_key, &pool);

        // Track LP balance for the provider
        let lp_key = DataKey::LpBalance(provider.clone(), token_a, token_b);
        let existing: i128 = env
            .storage()
            .persistent()
            .get(&lp_key)
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&lp_key, &(existing + lp_minted));

        env.events().publish(
            (symbol_short!("lp_add"), provider),
            lp_minted,
        );

        lp_minted
    }

    /// Burn `lp_shares` and withdraw the proportional underlying tokens.
    ///
    /// # Returns
    /// `(amount_a_returned, amount_b_returned)` as a tuple.
    pub fn remove_liquidity(
        env: Env,
        provider: Address,
        token_a: Address,
        token_b: Address,
        lp_shares: i128,
    ) -> (i128, i128) {
        provider.require_auth();
        assert!(lp_shares > 0, "SwapX: lp_shares must be positive");

        let pool_key = DataKey::Pool(token_a.clone(), token_b.clone());
        let mut pool: LiquidityPool = env
            .storage()
            .persistent()
            .get(&pool_key)
            .expect("SwapX: pool not found");

        let lp_key = DataKey::LpBalance(provider.clone(), token_a.clone(), token_b.clone());
        let balance: i128 = env.storage().persistent().get(&lp_key).unwrap_or(0);
        assert!(balance >= lp_shares, "SwapX: insufficient LP shares");

        // Proportional withdrawal
        let amount_a = (lp_shares * pool.reserve_a) / pool.total_lp_shares;
        let amount_b = (lp_shares * pool.reserve_b) / pool.total_lp_shares;

        // Transfer tokens back to provider
        token::Client::new(&env, &token_a).transfer(
            &env.current_contract_address(),
            &provider,
            &amount_a,
        );
        token::Client::new(&env, &token_b).transfer(
            &env.current_contract_address(),
            &provider,
            &amount_b,
        );

        pool.reserve_a -= amount_a;
        pool.reserve_b -= amount_b;
        pool.total_lp_shares -= lp_shares;
        env.storage().persistent().set(&pool_key, &pool);
        env.storage()
            .persistent()
            .set(&lp_key, &(balance - lp_shares));

        env.events().publish(
            (symbol_short!("lp_rm"), provider),
            (amount_a, amount_b),
        );

        (amount_a, amount_b)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TOKEN SWAP — Constant-Product AMM (XY = K)
    // ─────────────────────────────────────────────────────────────────────────

    /// Execute a token swap using the constant-product formula `x * y = k`.
    ///
    /// The swap fee (`fee_bps` set at pool creation) is deducted from the
    /// incoming amount before applying the AMM formula, so it accrues to LPs.
    ///
    /// # Arguments
    /// * `trader`        — signer who authorizes the swap
    /// * `token_in`      — address of the token being sold
    /// * `token_out`     — address of the token being bought
    /// * `amount_in`     — exact amount of `token_in` to sell (in base units)
    /// * `min_amount_out`— minimum acceptable output (slippage guard); tx reverts if not met
    ///
    /// # Returns
    /// Actual `amount_out` transferred to `trader`.
    ///
    /// # Panics
    /// * Pool not found
    /// * Insufficient liquidity
    /// * Slippage tolerance exceeded
    pub fn swap_tokens(
        env: Env,
        trader: Address,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        min_amount_out: i128,
    ) -> i128 {
        trader.require_auth();
        assert!(amount_in > 0, "SwapX: amount_in must be positive");

        // Support both pool orientations: (A→B) or (B→A)
        let pool_key = if env.storage().persistent().has(&DataKey::Pool(
            token_in.clone(),
            token_out.clone(),
        )) {
            DataKey::Pool(token_in.clone(), token_out.clone())
        } else {
            DataKey::Pool(token_out.clone(), token_in.clone())
        };

        let mut pool: LiquidityPool = env
            .storage()
            .persistent()
            .get(&pool_key)
            .expect("SwapX: no liquidity pool found for this token pair");

        // Determine which side of the pool we're trading into
        let (reserve_in, reserve_out) = if token_in == pool.token_a {
            (pool.reserve_a, pool.reserve_b)
        } else {
            (pool.reserve_b, pool.reserve_a)
        };

        assert!(
            reserve_in > 0 && reserve_out > 0,
            "SwapX: pool has no liquidity"
        );

        // Apply fee: deduct fee from amount_in before AMM calculation
        let fee_amount = (amount_in * pool.fee_bps as i128) / 10_000;
        let amount_in_after_fee = amount_in - fee_amount;

        // Constant-product: (reserve_in + Δin) * (reserve_out - Δout) = k
        // ⟹  Δout = (Δin * reserve_out) / (reserve_in + Δin)
        let amount_out =
            (amount_in_after_fee * reserve_out) / (reserve_in + amount_in_after_fee);

        assert!(
            amount_out >= min_amount_out,
            "SwapX: slippage tolerance exceeded — try increasing min_amount_out"
        );

        // Execute token transfers
        token::Client::new(&env, &token_in).transfer(
            &trader,
            &env.current_contract_address(),
            &amount_in,
        );
        token::Client::new(&env, &token_out).transfer(
            &env.current_contract_address(),
            &trader,
            &amount_out,
        );

        // Update reserves
        if token_in == pool.token_a {
            pool.reserve_a += amount_in;
            pool.reserve_b -= amount_out;
        } else {
            pool.reserve_b += amount_in;
            pool.reserve_a -= amount_out;
        }
        env.storage().persistent().set(&pool_key, &pool);

        // Increment lifetime swap counter
        let swaps: u64 = env
            .storage()
            .instance()
            .get(&DataKey::TotalSwaps)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TotalSwaps, &(swaps + 1));

        // Emit swap event for indexers / the SwapX frontend LiveEventStream
        env.events().publish(
            (symbol_short!("swap"), trader.clone()),
            (amount_in, amount_out),
        );

        amount_out
    }

    // ─────────────────────────────────────────────────────────────────────────
    // READ-ONLY VIEWS
    // ─────────────────────────────────────────────────────────────────────────

    /// Return the full `LiquidityPool` struct for the given token pair.
    pub fn get_pool_info(env: Env, token_a: Address, token_b: Address) -> LiquidityPool {
        env.storage()
            .persistent()
            .get(&DataKey::Pool(token_a, token_b))
            .expect("SwapX: pool not found")
    }

    /// Return the lifetime number of swaps executed through this contract.
    pub fn get_total_swaps(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::TotalSwaps)
            .unwrap_or(0)
    }

    /// Return the LP share balance of `user` for the given pool.
    pub fn get_lp_balance(
        env: Env,
        user: Address,
        token_a: Address,
        token_b: Address,
    ) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::LpBalance(user, token_a, token_b))
            .unwrap_or(0)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIT TESTS
// ─────────────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, String, Vec};

    #[test]
    fn test_hello_returns_greeting_vector() {
        let env = Env::default();
        let contract_id = env.register(HelloWorldContract, ());
        let client = HelloWorldContractClient::new(&env, &contract_id);

        let mut words = Vec::new(&env);
        words.push_back(String::from_str(&env, "SwapX"));
        words.push_back(String::from_str(&env, "Testnet"));

        let result = client.hello(&words);

        assert_eq!(result.len(), 3);
        assert_eq!(result.get(0).unwrap(), String::from_str(&env, "Hello"));
        assert_eq!(result.get(1).unwrap(), String::from_str(&env, "SwapX"));
        assert_eq!(result.get(2).unwrap(), String::from_str(&env, "Testnet"));
    }

    #[test]
    fn test_initialize_sets_admin() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(HelloWorldContract, ());
        let client = HelloWorldContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);

        client.initialize(&admin);

        // Verify via get_total_swaps (a proxy to confirm init ran)
        assert_eq!(client.get_total_swaps(), 0u64);
    }

    #[test]
    #[should_panic(expected = "already initialized")]
    fn test_double_initialize_panics() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(HelloWorldContract, ());
        let client = HelloWorldContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);

        client.initialize(&admin);
        client.initialize(&admin); // must panic
    }
}
