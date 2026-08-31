<div align="center">

# ⚡ SwapX

### Next-Generation Token Swap & XLM Wallet on Stellar Testnet

[![Stellar](https://img.shields.io/badge/Network-Stellar_Testnet-00E5FF?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contract-Soroban_SAC-7C3AED?style=for-the-badge)](https://soroban.stellar.org)
[![Freighter](https://img.shields.io/badge/Wallet-Freighter_v6-FACC15?style=for-the-badge)](https://www.freighter.app/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

**[🚀 Live Demo](https://swap-x-4qde.vercel.app/)** · **[📁 Repository](https://github.com/Soumi14mili/SwapX)**

</div>

---

## 📋 Project Description

**SwapX** is a full-featured Stellar Testnet DeFi interface that combines a **Soroban DEX token swap** with a **real XLM payment panel** and a **live Soroban Smart Contract Explorer** — all connected to a live Freighter browser wallet. Built with React 19, TypeScript, and `@stellar/stellar-sdk` v16, it demonstrates end-to-end blockchain interaction from wallet authentication to on-chain transaction submission, real Soroban RPC simulation calls, and structured error handling.

---

## 🏛️ Level 2 Requirements Implementation

### 1. Contract Deployed on Testnet
SwapX calls the **XLM Native Stellar Asset Contract (SAC)** — a real Soroban smart contract permanently deployed on Stellar Testnet by the Stellar protocol.
- **Contract Address:** `CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA`
- **Explorer Link:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA)
- **Deterministic derivation:** Computed via `StellarSdk.Asset.native().contractId(Networks.TESTNET)`

### 2. Contract Called from Frontend
The frontend executes real, read-only Soroban RPC simulation calls to the deployed contract using `StellarSdk.rpc.Server`:
- `balance(address)` → Queries XLM balance for any account, returns ScVal `i128`
- `name()` → Returns asset name (`"native"`)
- `symbol()` → Returns asset symbol (`"XLM"`)
- `decimals()` → Returns precision (`7`)

```ts
import * as StellarSdk from '@stellar/stellar-sdk';

const server = new StellarSdk.rpc.Server('https://soroban-testnet.stellar.org');
const contract = new StellarSdk.Contract(XLM_SAC_CONTRACT_ID);

const tx = new StellarSdk.TransactionBuilder(sourceAccount, { fee: '100', networkPassphrase: Networks.TESTNET })
  .addOperation(contract.call('balance', addressArg))
  .setTimeout(30).build();

const simulation = await server.simulateTransaction(tx);
const balanceStroops = StellarSdk.scValToNative(simulation.result.retval);
```

### 3. 5 Handled Error Types with Unique UI & Actions

SwapX defines typed errors (`WalletError`) and renders a customized modal (`ErrorAlertModal`) with type-specific icons, color themes, badges, and Call-to-Action (CTA) buttons:

| Error Type | Trigger | UI Theme | Icon | Action Button |
|---|---|---|---|---|
| `wallet_not_installed` | Freighter extension missing | 🟦 Blue | `Download` | **Install Freighter →** (External Link) |
| `user_rejected` | User dismisses Freighter popup | 🟧 Amber | `ShieldAlert` | **Try Again** (Re-opens Freighter) |
| `insufficient_balance` | Balance < send amount + reserve | 🟥 Rose | `Coins` | **Get Free Testnet XLM** (Friendbot) |
| `network_mismatch` | Wallet connected to Mainnet | 🟪 Purple | `Globe2` | **Switch to Testnet Guide** (4 steps) |
| `contract_error` | Soroban RPC call failure | 🟩 Cyan | `Code2` | **View on Stellar Expert** |

### 4. Transaction Status Visible
Every transaction displays a live 4-step progress stepper:
`[01 Preparing]` → `[02 Signing]` → `[03 Submitting]` → `[04 Confirming]`
- **Success:** Displays real transaction hash, ledger block number, network fee, and Stellar Expert explorer link.
- **Failure:** Displays Horizon error codes and human-readable explanation.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 + Custom Glassmorphism |
| Blockchain SDK | `@stellar/stellar-sdk` v16 |
| Soroban RPC | `https://soroban-testnet.stellar.org` |
| Wallet | `@stellar/freighter-api` v6 |
| Deployment | Vercel |

---

## 🚀 Setup & Run Locally

### Prerequisites
- **Node.js** 18 or later
- **npm** 9+ or **bun**
- **Freighter browser extension** — [download here](https://www.freighter.app/)

### 1 · Clone & Install

```bash
git clone https://github.com/Soumi14mili/SwapX.git
cd SwapX
npm install
```

### 2 · Configure Freighter for Testnet

> ⚠️ Open Freighter extension → Settings (⚙) → Network → Select **Testnet**.

### 3 · Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 4 · Run Verification Commands

```bash
npm run lint     # TypeScript type-check (0 errors)
npm run build    # Production build
```

---

## 📸 Screenshots

### 1 · Wallet Connected State
![Wallet Connected State](assets/screenshot_wallet_connected.png)

---

### 2 · XLM Balance Displayed
![Balance Panel](assets/screenshot_balance_panel.png)

---

### 3 · Transaction Status Visible (in Progress)
![Transaction In Progress](assets/screenshot_transaction_sending.png)

---

### 4 · Transaction Result Shown to User
![Transaction Success](assets/screenshot_transaction_success.png)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── SmartContractPanel.tsx # Live Soroban RPC query tab (balance, name, symbol)
│   ├── ErrorAlertModal.tsx    # 5 distinct error types with custom icons, colors & CTAs
│   ├── SendXlmPanel.tsx       # Real XLM payment — 4-step pipeline + result banners
│   ├── WalletModal.tsx        # Freighter connect/disconnect + 4-step setup guide
│   ├── BalancePanel.tsx       # Live Horizon balance + portfolio table
│   ├── TransactionPanel.tsx   # History with SWAP/PAYMENT badges & FAILED state
│   ├── SwapCard.tsx           # Token swap interface (Soroban DEX)
│   └── Navbar.tsx             # Navigation with Send XLM & Soroban tabs
├── services/
│   └── stellarService.ts      # Freighter v6 API + Soroban RPC simulation + payment
├── types/
│   └── index.ts               # WalletState, TransactionRecord, ContractEvent, ErrorAlert
└── data/
    └── sorobanCode.ts         # Real XLM SAC contract ID & Soroban Rust contract code
```

---

## 📋 Level 2 Requirement Checklist

| Requirement | Implementation Details | Status |
|---|---|---|
| **Contract deployed on testnet** | XLM Native SAC (`CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA`) | ✅ |
| **Contract called from frontend** | `callSorobanSacBalance()` & `callSorobanSacMeta()` via `StellarSdk.rpc.Server` | ✅ |
| **3+ error types handled** | 5 typed errors (`wallet_not_installed`, `user_rejected`, `insufficient_balance`, `network_mismatch`, `contract_error`) | ✅ |
| **Transaction status visible** | 4-step animated pipeline + hash, block #, explorer link & fail banners | ✅ |
| **10+ meaningful commits** | 20+ commits on main branch | ✅ |

---

## 🔗 Links

- **Live App:** [https://swap-x-4qde.vercel.app](https://swap-x-4qde.vercel.app/)
- **GitHub Repository:** [https://github.com/Soumi14mili/SwapX](https://github.com/Soumi14mili/SwapX)
- **Stellar Testnet Explorer:** [https://stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet)
- **Freighter Wallet:** [https://www.freighter.app](https://www.freighter.app)
