import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TransactionRecord, TransactionStatus } from '../types';

interface TransactionPanelProps {
  transactions: TransactionRecord[];
  txStatus: TransactionStatus;
  currentTx: TransactionRecord | null;
}

export const TransactionPanel: React.FC<TransactionPanelProps> = ({
  transactions,
  txStatus,
  currentTx,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(hash);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stepsList = [
    { key: 'preparing', title: 'Preparing Transaction', desc: 'Building Soroban XDR Operation' },
    { key: 'signing', title: 'Signing via Freighter', desc: 'Awaiting cryptographic authorization' },
    { key: 'submitting', title: 'Submitting to Stellar Testnet', desc: 'Broadcasting to Horizon RPC nodes' },
    { key: 'confirming', title: 'Confirming Ledger Block', desc: 'Awaiting Soroban execution consensus' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Active Pipeline Stepper */}
      {txStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/40 neon-glow-cyan shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-display">Soroban Transaction Pipeline</h3>
                <p className="text-xs text-slate-400">Executing Stellar Smart Contract Operation</p>
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 capitalize">
              Status: {txStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stepsList.map((step, idx) => {
              const stepKeys = ['preparing', 'signing', 'submitting', 'confirming'];
              const currentIndex = stepKeys.indexOf(txStatus);
              const isDone = currentIndex > idx || txStatus === 'success';
              const isCurrent = step.key === txStatus;

              return (
                <div
                  key={step.key}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold">Step 0{idx + 1}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="font-bold text-xs">{step.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{step.desc}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Transaction History Log */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold font-display text-white">Stellar Transaction History</h3>
            <p className="text-xs text-slate-400">Verified on-chain Soroban DEX executions</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            {transactions.length} Total Swaps
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No transactions recorded yet</p>
            <p className="text-xs text-slate-500 mt-1">Execute a token swap above to generate Stellar Testnet transactions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/10 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          Swapped {tx.fromAmount} {tx.fromToken} → {tx.toAmount.toFixed(4)} {tx.toToken}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Ledger Block #{tx.ledgerBlock} • Fee: {tx.feePaidXlm}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">{tx.timestamp}</span>
                  </div>
                </div>

                {/* Hash Details & Explorer Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-500">Hash:</span>
                    <span className="text-cyan-400 truncate max-w-[200px] sm:max-w-[320px]">{tx.hash}</span>
                    <button
                      onClick={() => handleCopy(tx.hash)}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                      title="Copy Transaction Hash"
                    >
                      {copiedId === tx.hash ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <a
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all"
                  >
                    <span>Stellar Expert Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
