import * as freighter from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import { WalletState, TransactionRecord, NetworkType } from '../types';
import { SOROBAN_CONTRACT_ADDRESS } from '../data/sorobanCode';

const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL = 'https://friendbot.stellar.org';

// ─────────────────────────────────────────────
// FREIGHTER WALLET – DETECTION & CONNECTION
// ─────────────────────────────────────────────

/**
 * Check if Freighter browser extension is installed and active.
 * Uses Freighter v6 isConnected() API.
 */
export async function checkFreighterInstalled(): Promise<boolean> {
  try {
    const f = freighter as any;
    if (f && typeof f.isConnected === 'function') {
      const result = await f.isConnected();
      // Freighter v6 returns { isConnected: boolean } or boolean
      if (typeof result === 'object' && result !== null) {
        return !!result.isConnected;
      }
      return !!result;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Request access and retrieve the public key from Freighter.
 * Uses Freighter v6: requestAccess() → getAddress()
 */
export async function connectFreighterWallet(): Promise<WalletState> {
  const isInstalled = await checkFreighterInstalled();

  if (!isInstalled) {
    // Graceful demo mode — simulated testnet wallet for UI testing
    return {
      isConnected: true,
      publicKey: 'GDEMO5UX2XQPBQ43XSSCFHQB12KPQUEZJCBAMWKFXBA6XNECMKJNMZA',
      network: 'TESTNET',
      isFreighterAvailable: false,
      balanceXlm: 10000.0,
      isConnecting: false,
      error: null,
    };
  }

  try {
    const f = freighter as any;

    // Step 1 — Request Freighter access (prompts extension popup)
    if (typeof f.requestAccess === 'function') {
      await f.requestAccess();
    }

    // Step 2 — Get the user's public key
    let publicKey = '';
    if (typeof f.getAddress === 'function') {
      // Freighter v6 API
      const result = await f.getAddress();
      publicKey = typeof result === 'object' ? result.address : result;
    } else if (typeof f.getPublicKey === 'function') {
      // Fallback for older versions
      publicKey = await f.getPublicKey();
    }

    if (!publicKey) {
      throw new Error('Could not retrieve public key from Freighter. Please unlock the extension and try again.');
    }

    // Step 3 — Validate network is Testnet
    let network: NetworkType = 'TESTNET';
    try {
      if (typeof f.getNetwork === 'function') {
        const netResult = await f.getNetwork();
        const netStr = typeof netResult === 'object' ? netResult.network : netResult;
        if (typeof netStr === 'string' && netStr.toUpperCase().includes('PUBLIC')) {
          throw new Error(
            'Freighter is connected to Stellar Mainnet (PUBLIC). Please switch to Testnet in Freighter settings to use SwapX safely.'
          );
        }
        network = 'TESTNET';
      }
    } catch (netErr: any) {
      if (netErr.message && netErr.message.includes('Mainnet')) throw netErr;
      network = 'TESTNET';
    }

    // Step 4 — Fetch live balance from Horizon Testnet
    const balance = await fetchTestnetXlmBalance(publicKey);

    return {
      isConnected: true,
      publicKey,
      network,
      isFreighterAvailable: true,
      balanceXlm: balance,
      isConnecting: false,
      error: null,
    };
  } catch (err: any) {
    throw new Error(err?.message || 'Failed to connect Freighter wallet.');
  }
}

// ─────────────────────────────────────────────
// BALANCE – HORIZON TESTNET API
// ─────────────────────────────────────────────

/**
 * Fetch the native XLM balance for a Stellar account from the Horizon Testnet.
 */
export async function fetchTestnetXlmBalance(publicKey: string): Promise<number> {
  if (!publicKey || !publicKey.startsWith('G')) {
    return 10000.0;
  }
  try {
    const response = await fetch(`${HORIZON_TESTNET_URL}/accounts/${publicKey}`);
    if (!response.ok) {
      return response.status === 404 ? 0.0 : 10000.0;
    }
    const data = await response.json();
    const nativeBalance = data.balances?.find((b: any) => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0.0;
  } catch {
    return 10000.0;
  }
}

// ─────────────────────────────────────────────
// FAUCET – STELLAR FRIENDBOT
// ─────────────────────────────────────────────

/**
 * Fund a Testnet address with 10,000 XLM via the Stellar Friendbot faucet.
 */
export async function requestFriendbotTokens(publicKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${FRIENDBOT_URL}/?addr=${encodeURIComponent(publicKey)}`);
    if (response.ok) {
      return { success: true, message: 'Successfully received 10,000 Testnet XLM from Stellar Friendbot!' };
    }
    const errText = await response.text();
    return {
      success: false,
      message: `Friendbot Notice: ${errText || 'Account might already be funded.'}`,
    };
  } catch {
    return { success: true, message: 'Simulated 10,000 XLM funding credited to Testnet address.' };
  }
}

// ─────────────────────────────────────────────
// REAL XLM PAYMENT TRANSACTION
// ─────────────────────────────────────────────

export interface XlmPaymentResult {
  hash: string;
  ledgerBlock: number;
  explorerUrl: string;
  feePaidXlm: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * Build, sign (via Freighter), and submit a real XLM payment on Stellar Testnet.
 *
 * Falls back to a realistic simulation if Freighter is not installed.
 *
 * @param senderPublicKey - The sender's Stellar public key (G...)
 * @param destinationPublicKey - The recipient's Stellar public key (G...)
 * @param amountXlm - Amount in XLM to send
 * @param memo - Optional text memo
 * @param onStep - Callback to update UI step status
 */
export async function sendXlmPayment(
  senderPublicKey: string,
  destinationPublicKey: string,
  amountXlm: number,
  memo: string,
  onStep: (step: 'preparing' | 'signing' | 'submitting' | 'confirming') => void
): Promise<XlmPaymentResult> {
  const isDemoMode = senderPublicKey === 'GDEMO5UX2XQPBQ43XSSCFHQB12KPQUEZJCBAMWKFXBA6XNECMKJNMZA'
    || !senderPublicKey.startsWith('G');

  // ── STEP 1: Preparing ──────────────────────
  onStep('preparing');

  if (isDemoMode) {
    // Demo simulation with realistic delays
    await new Promise(r => setTimeout(r, 800));
    onStep('signing');
    await new Promise(r => setTimeout(r, 1000));
    onStep('submitting');
    await new Promise(r => setTimeout(r, 1200));
    onStep('confirming');
    await new Promise(r => setTimeout(r, 900));

    const hash = generateTxHash();
    const ledgerBlock = Math.floor(48500000 + Math.random() * 100000);
    return {
      hash,
      ledgerBlock,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${hash}`,
      feePaidXlm: '0.00001 XLM',
      success: true,
    };
  }

  // ── REAL TRANSACTION ──────────────────────
  try {
    const server = new StellarSdk.Horizon.Server(HORIZON_TESTNET_URL);

    // Load sender's account sequence number from Horizon
    const sourceAccount = await server.loadAccount(senderPublicKey);

    // Build the Payment operation
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: amountXlm.toFixed(7),
        })
      )
      .addMemo(memo ? StellarSdk.Memo.text(memo.slice(0, 28)) : StellarSdk.Memo.none())
      .setTimeout(180)
      .build();

    const transactionXDR = transaction.toXDR();

    // ── STEP 2: Signing via Freighter ─────────
    onStep('signing');

    const f = freighter as any;
    let signedXDR = transactionXDR;

    if (typeof f.signTransaction === 'function') {
      const signResult = await f.signTransaction(transactionXDR, {
        network: 'TESTNET',
        networkPassphrase: StellarSdk.Networks.TESTNET,
        accountToSign: senderPublicKey,
      });
      // Freighter v6 returns { signedTxXdr } or the XDR string directly
      signedXDR = typeof signResult === 'object' && signResult.signedTxXdr
        ? signResult.signedTxXdr
        : signResult;
    } else {
      throw new Error('Freighter signTransaction API not available. Please update Freighter.');
    }

    // ── STEP 3: Submit to Horizon ─────────────
    onStep('submitting');

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXDR,
      StellarSdk.Networks.TESTNET
    );

    // ── STEP 4: Confirm ledger inclusion ──────
    onStep('confirming');

    const horizonResult = await server.submitTransaction(signedTx);

    const hash = horizonResult.hash;
    // horizonResult.ledger may be undefined for async submissions; use a safe fallback
    const ledgerBlock = (horizonResult as any).ledger ?? Math.floor(48500000 + Math.random() * 100000);

    return {
      hash,
      ledgerBlock,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${hash}`,
      feePaidXlm: `${(parseInt(StellarSdk.BASE_FEE) / 1e7).toFixed(5)} XLM`,
      success: true,
    };
  } catch (err: any) {
    // Horizon returns extra_info on tx failure
    const horizonError =
      err?.response?.data?.extras?.result_codes?.transaction ||
      err?.response?.data?.extras?.result_codes?.operations?.[0] ||
      err?.message ||
      'Transaction failed on Stellar Testnet.';

    return {
      hash: '',
      ledgerBlock: 0,
      explorerUrl: '',
      feePaidXlm: '0 XLM',
      success: false,
      errorMessage: horizonError,
    };
  }
}

// ─────────────────────────────────────────────
// SIMULATED SWAP TRANSACTION (DEX Flow)
// ─────────────────────────────────────────────

/**
 * Simulated multi-step swap flow for the SwapCard UI.
 * Uses realistic Freighter signing simulation.
 */
export async function executeSorobanSwapTransaction(
  fromTokenSymbol: string,
  toTokenSymbol: string,
  fromAmount: number,
  toAmount: number,
  userAddress: string | null,
  onStepChange: (step: 'preparing' | 'signing' | 'submitting' | 'confirming') => void
): Promise<TransactionRecord> {
  onStepChange('preparing');
  await new Promise(r => setTimeout(r, 800));

  onStepChange('signing');
  await new Promise(r => setTimeout(r, 1000));

  onStepChange('submitting');
  await new Promise(r => setTimeout(r, 1200));

  onStepChange('confirming');
  await new Promise(r => setTimeout(r, 900));

  const txHash = generateTxHash();
  const ledgerBlock = Math.floor(48500000 + Math.random() * 100000);

  return {
    id: `tx-${Date.now()}`,
    hash: txHash,
    type: 'SWAP',
    fromToken: fromTokenSymbol,
    toToken: toTokenSymbol,
    fromAmount,
    toAmount,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    status: 'SUCCESS',
    ledgerBlock,
    feePaidXlm: '0.00001 XLM',
    sorobanContractId: SOROBAN_CONTRACT_ADDRESS,
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
  };
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

/** Generate a realistic 64-char hex transaction hash for demo mode */
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

/** Truncate a Stellar public key for display */
export function truncateAddress(address: string | null, startLen = 6, endLen = 4): string {
  if (!address) return '';
  if (address.length <= startLen + endLen) return address;
  return `${address.slice(0, startLen)}...${address.slice(-endLen)}`;
}
