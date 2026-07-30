import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, X, Code2, ShieldCheck, Zap, Layers, ExternalLink, Terminal, Copy, CheckCircle2 } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card max-w-3xl w-full max-h-[85vh] p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white font-display">Soroban & Stellar DEX Docs</h3>
              <p className="text-xs text-slate-400">Technical Architecture & Integration Manual</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="mt-6 space-y-6 overflow-y-auto pr-2 flex-grow text-xs text-slate-300 leading-relaxed">
          
          {/* Section 1: Overview */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-sm text-cyan-300 font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>1. Constant Product AMM Math</span>
            </h4>
            <p>
              SwapX utilizes the standard Constant Product invariant formula $x \cdot y = k$ popularized by Uniswap V2 and Soroban AMM pools. Every swap deducts a 0.3% basis point fee (30 BPS) distributed to liquidity providers.
            </p>
            <div className="p-3 rounded-xl bg-black/60 font-mono text-cyan-300 text-[11px] border border-white/5">
              amount_out = (amount_in_with_fee * reserve_out) / (reserve_in + amount_in_with_fee)
            </div>
          </div>

          {/* Section 2: Freighter Wallet */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-sm text-purple-300 font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>2. Freighter Wallet API Integration</span>
            </h4>
            <p>
              To initiate transactions on Stellar Testnet, SwapX connects via <code className="text-cyan-300">@stellar/freighter-api</code>. User keys stay securely inside Freighter extension.
            </p>
            
            <div className="relative">
              <pre className="p-3 rounded-xl bg-black/60 font-mono text-slate-300 text-[11px] border border-white/5 overflow-x-auto">
{`import { isConnected, getPublicKey, signTransaction } from "@stellar/freighter-api";

// Connect wallet
if (await isConnected()) {
  const publicKey = await getPublicKey();
  console.log("Connected Stellar Address:", publicKey);
}`}
              </pre>
            </div>
          </div>

          {/* Section 3: Stellar Horizon REST API */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-sm text-emerald-300 font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>3. Stellar Horizon REST RPC & Friendbot</span>
            </h4>
            <p>
              Balances are fetched from Horizon REST endpoints (<code className="text-cyan-300">https://horizon-testnet.stellar.org/accounts/&#123;address&#125;</code>). Testnet funding uses Stellar Friendbot.
            </p>
          </div>

          {/* Section 4: Soroban CLI Commands */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-sm text-amber-300 font-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>4. Deploying Soroban WASM via CLI</span>
            </h4>
            <pre className="p-3 rounded-xl bg-black/60 font-mono text-slate-300 text-[11px] border border-white/5 overflow-x-auto">
{`# Build Soroban WASM contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to Stellar Testnet
soroban contract deploy \\
  --wasm target/wasm32-unknown-unknown/release/swapx.wasm \\
  --source alice \\
  --network testnet`}
            </pre>
          </div>

        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between flex-shrink-0">
          <a
            href="https://soroban.stellar.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Official Soroban Developer Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all"
          >
            Close Documentation
          </button>
        </div>
      </motion.div>
    </div>
  );
};
