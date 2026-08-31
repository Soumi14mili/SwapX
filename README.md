# SwapX — Stellar Testnet DEX & XLM Wallet Interface

> A next-generation token swap and XLM payment interface built on the **Stellar Testnet** with real Freighter wallet integration, live Horizon balance fetching, and on-chain transaction submission.

---

## 🚀 Live Demo

Deployed on Vercel: **[https://swap-x-pink.vercel.app](https://swap-x-pink.vercel.app)**

GitHub Repository: **[https://github.com/Soumi14mili/SwapX](https://github.com/Soumi14mili/SwapX)**

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + Custom Glass UI |
| Blockchain | Stellar Testnet (Horizon API) |
| Wallet | Freighter Browser Extension v6 |
| SDK | `@stellar/stellar-sdk` v16 |
| Animations | Motion (Framer Motion) |

---

## 🔑 1. Wallet Setup — Freighter on Stellar Testnet

SwapX integrates with the **Freighter** non-custodial browser wallet extension.

### Install Freighter
1. Visit [https://www.freighter.app/](https://www.freighter.app/)
2. Install the extension for Chrome, Brave, or Firefox
3. Create a new wallet or import an existing seed phrase
4. **Switch to Testnet**: Open Freighter → Settings → Network → Select **Testnet**

### How Detection Works
```ts
// src/services/stellarService.ts
export async function checkFreighterInstalled(): Promise<boolean> {
  const f = freighter as any;
  if (f && typeof f.isConnected === 'function') {
    const result = await f.isConnected();
    return typeof result === 'object' ? !!result.isConnected : !!result;
  }
  return false;
}
```

> **Demo Mode**: If Freighter is not installed, SwapX automatically switches to demo mode with a simulated testnet address so you can explore the full UI.

---

## 🔌 2. Wallet Connect & Disconnect

### Connect
Click **"Connect"** in the navbar or **"Authorize Freighter Wallet"** in the wallet modal.

```ts
// Uses Freighter v6 requestAccess + getAddress API
export async function connectFreighterWallet(): Promise<WalletState> {
  await f.requestAccess();                   // prompts extension popup
  const result = await f.getAddress();       // returns { address: "G..." }
  const balance = await fetchTestnetXlmBalance(publicKey);
  return { isConnected: true, publicKey, network: 'TESTNET', balanceXlm: balance, ... };
}
```

Network validation ensures Freighter is on **Testnet** — if connected to Mainnet, an error is thrown with instructions to switch.

### Disconnect
Click your address in the navbar → **Disconnect Wallet**, or use the wallet modal's disconnect button. This clears all wallet state locally.

---

## 💰 3. XLM Balance Handling

Balances are fetched live from the **Stellar Horizon Testnet API**:

```ts
export async function fetchTestnetXlmBalance(publicKey: string): Promise<number> {
  const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
  const data = await response.json();
  const native = data.balances?.find((b: any) => b.asset_type === 'native');
  return native ? parseFloat(native.balance) : 0.0;
}
```

- **Auto-refresh** on wallet connect and when navigating to the Assets tab
- **Manual refresh** button in the wallet modal and BalancePanel
- **Friendbot Faucet** — request 10,000 free Testnet XLM via one click

---

## ✉️ 4. XLM Transaction Flow — Send Panel

Navigate to **"Send XLM"** tab to send a real XLM payment on the Stellar Testnet.

### 4-Step Pipeline
```
[01 Preparing] → [02 Signing] → [03 Submitting] → [04 Confirming]
```

| Step | What Happens |
|---|---|
| **Preparing** | Loads sender account sequence from Horizon, builds `PaymentOperation` |
| **Signing** | Calls `freighter.signTransaction(xdr, { network: 'TESTNET' })` — user approves in extension |
| **Submitting** | Posts signed XDR to `https://horizon-testnet.stellar.org/transactions` |
| **Confirming** | Waits for ledger inclusion, extracts real hash + ledger number |

### Success Feedback
```
✅ Payment Confirmed!
Transaction Hash: 3f4a9b...e7c2
Ledger Block: #48,612,033
→ View on Stellar Expert Explorer
```

### Failure Handling
```
❌ Transaction Failed
Error: tx_insufficient_balance | User rejected | Network error
```

### Core Implementation
```ts
// src/services/stellarService.ts
const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(StellarSdk.Operation.payment({
    destination: destinationPublicKey,
    asset: StellarSdk.Asset.native(),
    amount: amountXlm.toFixed(7),
  }))
  .addMemo(StellarSdk.Memo.text(memo))
  .setTimeout(180)
  .build();

const signedXDR = await f.signTransaction(transactionXDR, { network: 'TESTNET' });
const result = await server.submitTransaction(signedTx);
// result.hash = real on-chain transaction hash
```

---

## 🏗 Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/Soumi14mili/SwapX.git
cd SwapX

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
# App available at http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── WalletModal.tsx       # Freighter connect/disconnect + setup guide
│   ├── SendXlmPanel.tsx      # Real XLM payment with 4-step progress UI
│   ├── BalancePanel.tsx      # Live Horizon balance + token portfolio
│   ├── TransactionPanel.tsx  # History with SWAP/PAYMENT type + FAILED state
│   ├── SwapCard.tsx          # Token swap interface (Soroban DEX)
│   └── Navbar.tsx            # Navigation including Send XLM tab
├── services/
│   └── stellarService.ts     # Freighter v6 API + Horizon + real tx submission
├── types/
│   └── index.ts              # WalletState, TransactionRecord, ContractEvent
└── data/
    └── tokens.ts             # Stellar token definitions
```

---

## 📋 Hackathon Checklist

| Requirement | Status |
|---|---|
| Freighter wallet setup & install guide | ✅ |
| Wallet connect (Freighter v6 API) | ✅ |
| Wallet disconnect | ✅ |
| Fetch XLM balance (Horizon Testnet API) | ✅ |
| Display balance in UI | ✅ |
| Send XLM transaction on Testnet | ✅ |
| Transaction success state + hash | ✅ |
| Transaction failure state + error | ✅ |
| Stellar Testnet network only | ✅ |
| 10+ meaningful git commits | ✅ (13 commits) |
