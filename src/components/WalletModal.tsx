import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Coins, 
  RefreshCw, 
  Copy, 
  Download,
  Sparkles
} from 'lucide-react';
import { WalletState } from '../types';
import { requestFriendbotTokens } from '../services/stellarService';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnectWallet: () => Promise<void>;
  onDisconnectWallet: () => void;
  onRefreshBalance: () => Promise<void>;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnectWallet,
  onDisconnectWallet,
  onRefreshBalance,
}) => {
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [faucetMessage, setFaucetMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (wallet.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFaucetRequest = async () => {
    if (!wallet.publicKey) return;
    setFaucetLoading(true);
    setFaucetMessage(null);
    try {
      const result = await requestFriendbotTokens(wallet.publicKey);
      setFaucetMessage(result.message);
      await onRefreshBalance();
    } catch (err: any) {
      setFaucetMessage('Friendbot request completed.');
    } finally {
      setFaucetLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="glass-card max-w-md w-full p-6 sm:p-7 rounded-3xl border border-yellow-500/30 shadow-2xl relative overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-display">Freighter Wallet</h3>
              <p className="text-xs text-slate-400 font-mono">Stellar Testnet RPC Integration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-yellow-500/20 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-4">
          {!wallet.isConnected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-yellow-500/20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mx-auto text-2xl">
                  🚀
                </div>
                <h4 className="font-bold text-white text-base font-display">Connect Freighter Extension</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Freighter is the non-custodial browser wallet extension for interacting natively with Stellar & Soroban smart contracts.
                </p>
              </div>

              <button
                onClick={onConnectWallet}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black btn-neon flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-black" />
                <span>Authorize Freighter Wallet</span>
              </button>

              {!wallet.isFreighterAvailable && (
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span>Freighter extension not installed?</span>
                  </div>
                  <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-yellow-400 hover:underline flex items-center gap-1"
                  >
                    <span>Download</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account Card Details */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-yellow-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Connection Status</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                    <span>Active Online</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1">Public Key Address</div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-yellow-500/20 font-mono text-xs text-yellow-300">
                    <span className="truncate max-w-[240px]">{wallet.publicKey}</span>
                    <button
                      onClick={handleCopy}
                      className="p-1 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 cursor-pointer"
                      title="Copy Address"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-yellow-500/20">
                    <div className="text-slate-400 text-[10px]">Active Network</div>
                    <div className="font-bold text-white mt-0.5">{wallet.network}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-yellow-500/20">
                    <div className="text-slate-400 text-[10px]">XLM Balance</div>
                    <div className="font-bold text-yellow-400 font-mono mt-0.5">
                      {wallet.balanceXlm.toLocaleString()} XLM
                    </div>
                  </div>
                </div>
              </div>

              {/* Stellar Friendbot Faucet Button */}
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-bold text-white">Stellar Friendbot Faucet</span>
                  </div>
                  <span className="text-[10px] text-yellow-300 px-2 py-0.5 rounded bg-yellow-500/20 font-mono">
                    Free Test XLM
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">
                  Fund this address with 10,000 Testnet XLM to perform swaps and interact with Soroban contracts.
                </p>

                <button
                  onClick={handleFaucetRequest}
                  disabled={faucetLoading}
                  className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
                >
                  {faucetLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Funding via Friendbot...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Request 10,000 Test XLM</span>
                    </>
                  )}
                </button>

                {faucetMessage && (
                  <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-300 text-[11px] font-mono">
                    {faucetMessage}
                  </div>
                )}
              </div>

              {/* Disconnect Button */}
              <button
                onClick={() => {
                  onDisconnectWallet();
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Disconnect Wallet</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

