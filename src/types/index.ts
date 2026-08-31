export interface Token {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  priceUsd: number;
  balance: number;
  contractId: string;
  decimals: number;
  isNative?: boolean;
}

export type NetworkType = 'TESTNET' | 'PUBLIC' | 'FUTURENET';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  network: NetworkType;
  isFreighterAvailable: boolean;
  balanceXlm: number;
  isConnecting: boolean;
  error: string | null;
}

export type TransactionStatus = 
  | 'idle' 
  | 'preparing' 
  | 'signing' 
  | 'submitting' 
  | 'confirming' 
  | 'success' 
  | 'failed';

export interface TransactionRecord {
  id: string;
  hash: string;
  /** Transaction type — SWAP for DEX swaps, PAYMENT for direct XLM sends */
  type?: 'SWAP' | 'PAYMENT';
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  ledgerBlock: number;
  feePaidXlm: string;
  sorobanContractId: string;
  explorerUrl: string;
  /** Human-readable error detail when status is FAILED */
  errorMessage?: string;
  /** Optional recipient address for PAYMENT transactions */
  recipientAddress?: string;
}

export interface ContractEvent {
  id: string;
  type: 'SWAP' | 'WALLET' | 'CONTRACT' | 'FAUCET' | 'SYSTEM' | 'PAYMENT';
  title: string;
  details: string;
  timestamp: string;
  hash?: string;
  contractId?: string;
}

export interface HackathonTask {
  id: string;
  category: 'Wallet Setup' | 'Wallet Features' | 'Balance' | 'Transactions' | 'Smart Contract' | 'Development';
  title: string;
  completed: boolean;
  description: string;
}

export interface ErrorAlert {
  id: string;
  title: string;
  message: string;
  type: 'wallet_not_installed' | 'user_rejected' | 'network_mismatch' | 'insufficient_balance' | 'timeout' | 'contract_error';
  timestamp: string;
}
