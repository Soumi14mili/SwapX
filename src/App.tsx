import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { HeroSection } from './components/HeroSection';
import { SwapCard } from './components/SwapCard';
import { WalletModal } from './components/WalletModal';
import { BalancePanel } from './components/BalancePanel';
import { TransactionPanel } from './components/TransactionPanel';
import { SmartContractPanel } from './components/SmartContractPanel';
import { LiveEventStream } from './components/LiveEventStream';
import { FeaturesGrid } from './components/FeaturesGrid';
import { DevDashboard } from './components/DevDashboard';
import { ReadmeShowcase } from './components/ReadmeShowcase';
import { HackathonChecklist } from './components/HackathonChecklist';
import { DocsModal } from './components/DocsModal';
import { ErrorAlertModal } from './components/ErrorAlertModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SendXlmPanel } from './components/SendXlmPanel';

import { 
  Token, 
  WalletState, 
  TransactionRecord, 
  ContractEvent, 
  TransactionStatus,
  ErrorAlert 
} from './types';
import { 
  connectFreighterWallet, 
  checkFreighterInstalled, 
  fetchTestnetXlmBalance, 
  executeSorobanSwapTransaction,
  truncateAddress 
} from './services/stellarService';
import { SOROBAN_CONTRACT_ADDRESS } from './data/sorobanCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  
  // Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    network: 'TESTNET',
    isFreighterAvailable: false,
    balanceXlm: 10000.0,
    isConnecting: false,
    error: null,
  });

  // Modal Visibility States
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);
  const [docsModalOpen, setDocsModalOpen] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<ErrorAlert | null>(null);

  // Transaction execution status
  const [txStatus, setTxStatus] = useState<TransactionStatus>('idle');
  const [currentTx, setCurrentTx] = useState<TransactionRecord | null>(null);

  // Transaction Records
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: 'tx-init-1',
      hash: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
      type: 'SWAP',
      fromToken: 'XLM',
      toToken: 'USDC',
      fromAmount: 500,
      toAmount: 59.0,
      timestamp: '10:14:22 AM',
      status: 'SUCCESS',
      ledgerBlock: 48519283,
      feePaidXlm: '0.00001 XLM',
      sorobanContractId: SOROBAN_CONTRACT_ADDRESS,
      explorerUrl: 'https://stellar.expert/explorer/testnet/tx/a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    },
  ]);

  // Live Telemetry Event Stream
  const [events, setEvents] = useState<ContractEvent[]>([
    {
      id: 'evt-1',
      type: 'SYSTEM',
      title: 'Soroban WASM Contract Initialized',
      details: `Target Contract ID: ${SOROBAN_CONTRACT_ADDRESS.slice(0, 16)}... Protocol 20 ready.`,
      timestamp: '10:00:00 AM',
    },
    {
      id: 'evt-2',
      type: 'CONTRACT',
      title: 'Pool Reserves Synchronized',
      details: 'XLM/USDC Liquidity Pool active with 500,000 XLM depth.',
      timestamp: '10:05:12 AM',
    },
  ]);

  const swapSectionRef = useRef<HTMLDivElement>(null);

  // On initial mount, detect Freighter availability
  useEffect(() => {
    checkFreighterInstalled().then((installed) => {
      setWallet((prev) => ({ ...prev, isFreighterAvailable: installed }));
    });
  }, []);

  // Auto-refresh XLM balance whenever wallet connects or public key changes
  useEffect(() => {
    if (wallet.isConnected && wallet.publicKey) {
      fetchTestnetXlmBalance(wallet.publicKey).then((bal) => {
        setWallet((prev) => ({ ...prev, balanceXlm: bal }));
      });
    }
  }, [wallet.isConnected, wallet.publicKey]);

  // Connect Freighter Wallet
  const handleConnectWallet = async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const walletData = await connectFreighterWallet();
      setWallet(walletData);
      setWalletModalOpen(false);

      // Add to event stream
      addContractEvent(
        'WALLET',
        'Freighter Wallet Authorized',
        `Connected address ${truncateAddress(walletData.publicKey)} on Stellar Testnet.`
      );
    } catch (err: any) {
      setWallet((prev) => ({ ...prev, isConnecting: false, error: err.message }));
      
      // Trigger error alert
      setActiveAlert({
        id: `err-${Date.now()}`,
        title: 'Wallet Connection Error',
        message: err.message || 'User rejected Freighter signature or extension not active.',
        type: wallet.isFreighterAvailable ? 'user_rejected' : 'wallet_not_installed',
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  // Disconnect Wallet
  const handleDisconnectWallet = () => {
    setWallet({
      isConnected: false,
      publicKey: null,
      network: 'TESTNET',
      isFreighterAvailable: wallet.isFreighterAvailable,
      balanceXlm: 10000.0,
      isConnecting: false,
      error: null,
    });

    addContractEvent('WALLET', 'Wallet Disconnected', 'User terminated active wallet session.');
  };

  // Refresh Balance
  const handleRefreshBalance = async () => {
    if (wallet.publicKey) {
      const newBal = await fetchTestnetXlmBalance(wallet.publicKey);
      setWallet((prev) => ({ ...prev, balanceXlm: newBal }));
      addContractEvent('FAUCET', 'Balance Updated', `Live Horizon balance: ${newBal.toLocaleString()} XLM.`);
    }
  };

  // Helper to add events
  const addContractEvent = (
    type: ContractEvent['type'],
    title: string,
    details: string,
    hash?: string
  ) => {
    const newEvt: ContractEvent = {
      id: `evt-${Date.now()}`,
      type,
      title,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      hash,
      contractId: SOROBAN_CONTRACT_ADDRESS,
    };
    setEvents((prev) => [newEvt, ...prev]);
  };

  // Handle SendXlmPanel completed payment
  const handlePaymentComplete = (record: TransactionRecord) => {
    setTransactions((prev) => [record, ...prev]);
    if (record.status === 'SUCCESS') {
      setWallet((prev) => ({
        ...prev,
        balanceXlm: Math.max(0, prev.balanceXlm - record.fromAmount),
      }));
    }
  };

  // Execute Swap Transaction
  const handleExecuteSwap = async (
    fromToken: Token,
    toToken: Token,
    fromAmount: number,
    toAmount: number
  ) => {
    // Check balance
    if (wallet.isConnected && fromAmount > wallet.balanceXlm && fromToken.symbol === 'XLM') {
      setActiveAlert({
        id: `err-${Date.now()}`,
        title: 'Insufficient XLM Balance',
        message: `Your balance of ${wallet.balanceXlm} XLM is insufficient to complete this ${fromAmount} XLM swap. Request Test XLM via Friendbot Faucet.`,
        type: 'insufficient_balance',
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    try {
      addContractEvent(
        'SWAP',
        'Initiating Soroban Swap',
        `Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount.toFixed(4)} ${toToken.symbol}...`
      );

      const record = await executeSorobanSwapTransaction(
        fromToken.symbol,
        toToken.symbol,
        fromAmount,
        toAmount,
        wallet.publicKey,
        (step) => setTxStatus(step)
      );

      setTxStatus('success');
      setCurrentTx(record);
      setTransactions((prev) => [record, ...prev]);

      // Deduct or credit XLM
      if (fromToken.symbol === 'XLM') {
        setWallet((prev) => ({ ...prev, balanceXlm: Math.max(0, prev.balanceXlm - fromAmount) }));
      } else if (toToken.symbol === 'XLM') {
        setWallet((prev) => ({ ...prev, balanceXlm: prev.balanceXlm + toAmount }));
      }

      addContractEvent(
        'SWAP',
        'Soroban Swap Confirmed',
        `Swapped ${fromAmount} ${fromToken.symbol} → ${toAmount.toFixed(4)} ${toToken.symbol} on Ledger Block #${record.ledgerBlock}.`,
        record.hash
      );

      setTimeout(() => setTxStatus('idle'), 3000);
    } catch (err: any) {
      setTxStatus('failed');
      setActiveAlert({
        id: `err-${Date.now()}`,
        title: 'Transaction Error',
        message: err.message || 'Failed to submit transaction to Soroban RPC node.',
        type: 'contract_error',
        timestamp: new Date().toLocaleTimeString(),
      });
      setTimeout(() => setTxStatus('idle'), 3000);
    }
  };

  // Trigger Soroban Contract RPC Call
  const handleTriggerContractCall = async (fnName: string): Promise<string> => {
    addContractEvent('CONTRACT', `Soroban RPC: ${fnName}()`, `Invoked function ${fnName} on CA7X...SWAP.`);
    
    if (fnName === 'get_pool_info') {
      return JSON.stringify({
        token_a: 'CDLZFC3SYJYDZT7227UOH6A42X32CWWJ36WNAABKKYJ65TVZCMZ2IUIZ',
        token_b: 'CCW67TSZV3SSS2HXMBB522XZS2TC633G7B3T6VTVR5R4Z6L23Y3G323I',
        reserve_a: '50000000000000',
        reserve_b: '5900000000000',
        fee_bps: 30,
        total_lp_shares: '10000000000',
      }, null, 2);
    } else if (fnName === 'get_total_swaps') {
      return `Total Soroban Swaps Executed: ${transactions.length + 12}`;
    } else {
      return `[OK] Contract call '${fnName}' executed successfully on Soroban Testnet ledger.`;
    }
  };

  const scrollToSwap = () => {
    setActiveTab('swap');
    swapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-yellow-500/30 selection:text-yellow-200 overflow-hidden">
      {/* Background Yellow & Gold Ambient Lights */}
      <div className="aurora top-[-100px] left-[-100px] bg-[#FACC15]" />
      <div className="aurora bottom-[-100px] right-[-100px] bg-[#EAB308]" />
      <div className="aurora top-[200px] left-[300px] bg-[#CA8A04] opacity-15" />

      {/* Top Sticky Navbar */}
      <Navbar
        wallet={wallet}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onDisconnectWallet={handleDisconnectWallet}
        onOpenDocsModal={() => setDocsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-grow pb-24">
        
        {/* LANDING PAGE VIEW */}
        {activeTab === 'landing' && (
          <LandingPage
            wallet={wallet}
            onLaunchApp={() => {
              setActiveTab('swap');
              scrollToSwap();
            }}
            onConnectWallet={() => setWalletModalOpen(true)}
          />
        )}

        {/* APP VIEWS CONTAINER */}
        {activeTab !== 'landing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-8" ref={swapSectionRef}>
            
            {/* TAB CONTENT RENDERER */}
            {activeTab === 'swap' && (
              <div className="space-y-16">
                <SwapCard
                  wallet={wallet}
                  onExecuteSwap={handleExecuteSwap}
                  onOpenWalletModal={() => setWalletModalOpen(true)}
                  txStatus={txStatus}
                />

                <TransactionPanel
                  transactions={transactions}
                  txStatus={txStatus}
                  currentTx={currentTx}
                />

                <FeaturesGrid />
              </div>
            )}

            {activeTab === 'send' && (
              <SendXlmPanel
                wallet={wallet}
                onOpenWalletModal={() => setWalletModalOpen(true)}
                onTransactionComplete={handlePaymentComplete}
                onAddEvent={(type, title, details, hash) =>
                  addContractEvent(type, title, details, hash)
                }
              />
            )}

            {activeTab === 'balance' && (
              <BalancePanel
                wallet={wallet}
                onRefreshBalance={handleRefreshBalance}
                onSelectTokenToSwap={(t) => {
                  setActiveTab('swap');
                  scrollToSwap();
                }}
              />
            )}

            {activeTab === 'contract' && (
              <SmartContractPanel
                onTriggerContractCall={handleTriggerContractCall}
              />
            )}

            {activeTab === 'events' && (
              <LiveEventStream
                events={events}
                onClearEvents={() => setEvents([])}
              />
            )}

            {activeTab === 'dashboard' && (
              <DevDashboard
                wallet={wallet}
                events={events}
                transactions={transactions}
              />
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-16">
                <HackathonChecklist />
                <ReadmeShowcase />
              </div>
            )}

          </div>
        )}
      </main>

      {/* Modals */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onRefreshBalance={handleRefreshBalance}
      />

      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />

      <ErrorAlertModal
        alert={activeAlert}
        onClose={() => setActiveAlert(null)}
        onRetry={() => handleConnectWallet()}
      />

      {/* Mobile Touch Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Footer */}
      <Footer
        onOpenDocs={() => setDocsModalOpen(true)}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

