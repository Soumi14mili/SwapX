import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Globe2, 
  Lock, 
  Cpu, 
  Coins, 
  CheckCircle2, 
  ExternalLink,
  Wallet,
  Sparkles,
  Layers,
  ChevronRight,
  ArrowRightLeft,
  Sliders,
  Code2,
  GitBranch,
  Terminal
} from 'lucide-react';
import { WalletState } from '../types';

interface LandingPageProps {
  wallet: WalletState;
  onLaunchApp: () => void;
  onConnectWallet: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  wallet,
  onLaunchApp,
  onConnectWallet,
}) => {
  const [simFromAmount, setSimFromAmount] = useState<string>('250');
  const [selectedTokenFrom, setSelectedTokenFrom] = useState<'XLM' | 'USDC'>('XLM');
  const [selectedTokenTo, setSelectedTokenTo] = useState<'USDC' | 'AQUA'>('USDC');

  const simValue = parseFloat(simFromAmount) || 0;
  const rate = selectedTokenFrom === 'XLM' ? 0.1242 : 8.05;
  const simToAmount = (simValue * rate).toFixed(2);

  const stats = [
    { label: 'Total Volume', value: '$14.8M+', change: '+24% this week', icon: TrendingUp },
    { label: 'Soroban Swaps Executed', value: '142,850+', change: '100% Verified WASM', icon: Cpu },
    { label: 'Avg Block Settlement', value: '< 1.8s', change: 'Instant Finality', icon: Zap },
    { label: 'Network Fee per Swap', value: '0.00001 XLM', change: 'Near Zero Gas', icon: ShieldCheck },
  ];

  const features = [
    {
      title: 'Soroban WASM Engine',
      desc: 'Executed natively inside Rust-compiled WebAssembly smart contracts on Stellar Protocol 20.',
      icon: Cpu,
      tag: 'Rust WASM',
      color: 'from-yellow-500/20 to-amber-500/5'
    },
    {
      title: 'Freighter Wallet Integration',
      desc: 'Connect seamlessly with browser wallet extensions for instant non-custodial transaction signing.',
      icon: Lock,
      tag: 'Web3 Auth',
      color: 'from-amber-500/20 to-yellow-600/5'
    },
    {
      title: 'Sub-2 Second Finality',
      desc: 'Experience lightning-fast decentralized token swaps powered by Stellar Horizon RPC nodes.',
      icon: Zap,
      tag: 'Speed',
      color: 'from-yellow-400/20 to-amber-500/5'
    },
    {
      title: '0.3% Constant Product AMM',
      desc: 'Fair market maker math deducting 30 BPS to reward liquidity pool providers automatically.',
      icon: Coins,
      tag: 'Liquidity',
      color: 'from-amber-400/20 to-yellow-500/5'
    },
  ];

  const marketTicker = [
    { pair: 'XLM / USDC', price: '$0.1242', change: '+5.4%', isPositive: true },
    { pair: 'XLM / AQUA', price: '14.82 AQUA', change: '+11.2%', isPositive: true },
    { pair: 'USDC / EURC', price: '0.924 EURC', change: '+0.1%', isPositive: true },
    { pair: 'XLM / BTC', price: '0.0000018 BTC', change: '-1.2%', isPositive: false },
  ];

  return (
    <div className="space-y-20 py-4 bg-black text-white">
      
      {/* Live Market Ticker Strip */}
      <div className="w-full bg-zinc-950/90 border-y border-yellow-500/20 py-3 px-4 overflow-hidden backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 text-xs font-mono">
          <div className="flex items-center gap-2 text-yellow-400 font-black uppercase tracking-widest flex-shrink-0">
            <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span>Stellar Testnet Live Ticker</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-0.5">
            {marketTicker.map((item) => (
              <div key={item.pair} className="flex items-center gap-2.5 whitespace-nowrap bg-zinc-900/90 px-3.5 py-1.5 rounded-xl border border-yellow-500/20 shadow-sm">
                <span className="text-slate-300 font-bold">{item.pair}</span>
                <span className="text-white font-mono font-bold">{item.price}</span>
                <span className={`font-mono text-[11px] font-black ${item.isPositive ? 'text-yellow-400' : 'text-rose-400'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px] font-mono flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <span className="text-yellow-400 font-bold">Ledger #482,910</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Headline & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-yellow-500/30 text-yellow-400 text-xs font-black uppercase tracking-widest shadow-lg shadow-yellow-500/5"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Stellar Protocol 20 • Soroban WASM DEX</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.05]"
          >
            Decentralized <br />
            <span className="text-gradient-gold">Liquidity.</span> <br />
            Instant Settlement.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans"
          >
            SwapX brings high-frequency token exchange to Stellar via native Soroban WASM smart contracts. Swap XLM, USDC, and custom tokens with sub-2 second finality.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-neon font-black text-xs uppercase tracking-widest text-black flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-yellow-500/20"
            >
              <Zap className="w-5 h-5 text-black fill-black" />
              <span>Launch DEX Application</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>

            {!wallet.isConnected ? (
              <button
                onClick={onConnectWallet}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-yellow-500/30 text-yellow-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:border-yellow-400"
              >
                <Wallet className="w-4 h-4 text-yellow-400" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div className="px-5 py-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                <span>Wallet Connected</span>
              </div>
            )}
          </motion.div>

          {/* Value Props Row */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300 font-medium border-t border-yellow-500/15">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="font-bold">Non-Custodial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="font-bold">Sub-2s Finality</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="font-bold">Minimal Gas Fee</span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive DEX Live Simulator Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="bg-zinc-950 p-6 sm:p-7 rounded-3xl border border-yellow-500/30 shadow-2xl relative overflow-hidden space-y-5 backdrop-blur-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                  <Zap className="w-5 h-5 fill-yellow-400" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white font-display">Instant Swap Preview</h3>
                  <p className="text-[10px] text-yellow-400 font-mono uppercase tracking-wider">Soroban WASM Engine</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase">
                0.3% Fee BPS
              </span>
            </div>

            {/* Token Inputs */}
            <div className="space-y-3">
              {/* From */}
              <div className="p-3.5 rounded-2xl bg-black border border-yellow-500/20 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>You Pay</span>
                  <span>Balance: {wallet.balanceXlm.toLocaleString(undefined, { maximumFractionDigits: 1 })} XLM</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    value={simFromAmount}
                    onChange={(e) => setSimFromAmount(e.target.value)}
                    className="bg-transparent text-2xl font-black font-mono text-white focus:outline-none w-1/2"
                  />
                  <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-yellow-500/30 text-yellow-400 font-bold text-xs uppercase">
                    <span>🚀</span>
                    <span>XLM</span>
                  </div>
                </div>
              </div>

              {/* Swap Switch Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <button 
                  onClick={() => {
                    setSelectedTokenFrom(selectedTokenFrom === 'XLM' ? 'USDC' : 'XLM');
                    setSelectedTokenTo(selectedTokenTo === 'USDC' ? 'AQUA' : 'USDC');
                  }}
                  className="p-2 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 transition-transform hover:rotate-180 duration-300 shadow-md cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* To */}
              <div className="p-3.5 rounded-2xl bg-black border border-yellow-500/20 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>You Receive</span>
                  <span>Estimated Output</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-2xl font-black font-mono text-yellow-400 truncate">
                    {simToAmount}
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-yellow-500/30 text-yellow-400 font-bold text-xs uppercase">
                    <span>💵</span>
                    <span>{selectedTokenTo}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Stats */}
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-yellow-500/20 text-xs text-slate-300 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Rate:</span>
                <span className="text-yellow-400 font-bold">1 XLM ≈ {rate} {selectedTokenTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Slippage Tolerance:</span>
                <span className="text-white font-bold">0.5%</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onLaunchApp}
              className="w-full py-3.5 rounded-2xl btn-neon font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-yellow-500/20"
            >
              <span>Launch App to Execute</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </motion.div>

      </div>

      {/* Ecosystem Bento Metrics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-zinc-950 p-6 rounded-3xl border border-yellow-500/20 space-y-3 hover:border-yellow-500/40 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider">{s.label}</span>
                  <Icon className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-3xl font-black font-display text-gradient-gold">{s.value}</div>
                <div className="text-[11px] text-yellow-400 font-mono font-bold flex items-center gap-1">
                  <span>{s.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Soroban Technical Architecture Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-black uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Smart Contract Stack</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
            Architected for Soroban WASM
          </h2>
          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Engineered natively for Protocol 20 with Rust smart contracts, constant product AMMs, and instant transaction simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div 
                key={f.title} 
                className="bg-zinc-950 p-6 rounded-3xl border border-yellow-500/20 space-y-4 hover:border-yellow-500/50 transition-all shadow-xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-yellow-500/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase">
                    {f.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-base text-white font-display mb-1.5">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CI/CD & Developer Verification Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 rounded-3xl p-6 sm:p-8 border border-yellow-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black border border-yellow-500/30 flex items-center justify-center text-yellow-400 flex-shrink-0">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white font-display">CI/CD Pipeline Verified</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">Passing</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated Vite production build & GitHub Pages deployment workflow in <code className="text-yellow-400 font-mono">.github/workflows/deploy.yml</code>.
              </p>
            </div>
          </div>

          <button
            onClick={onLaunchApp}
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-yellow-500/30 text-yellow-400 font-black text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all"
          >
            <span>Launch Application</span>
          </button>
        </div>
      </div>

      {/* Bottom Launch Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-zinc-950 rounded-3xl p-8 sm:p-12 border border-yellow-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
              Ready to Swap on Stellar Testnet?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Connect your Freighter extension wallet or test with real Stellar Horizon nodes immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchApp}
              className="px-8 py-4 rounded-2xl btn-neon font-black text-xs uppercase tracking-widest text-black flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-yellow-500/20"
            >
              <Zap className="w-5 h-5 text-black fill-black" />
              <span>Launch DEX Application</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

