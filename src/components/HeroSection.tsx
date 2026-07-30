import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, ArrowRight, BookOpen, ExternalLink, Sparkles, Cpu, Layers } from 'lucide-react';
import { WalletState } from '../types';

interface HeroSectionProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onOpenDocsModal: () => void;
  onScrollToSwap: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  wallet,
  onOpenWalletModal,
  onOpenDocsModal,
  onScrollToSwap,
}) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-20 overflow-hidden bg-grid-pattern">
      {/* Aurora Ambient Lighting Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-yellow-500/15 via-amber-500/10 to-yellow-600/15 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-yellow-500/10 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating 3D Stellar Token Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Stellar 3D Logo Orb */}
        <motion.div 
          animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 right-10 lg:right-24 w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-zinc-900/90 p-1 backdrop-blur-2xl border border-yellow-500/30 shadow-2xl flex items-center justify-center shadow-yellow-500/10"
        >
          <div className="text-center">
            <span className="text-4xl sm:text-5xl">🚀</span>
            <div className="text-[10px] font-extrabold text-yellow-400 font-mono mt-1">XLM Native</div>
          </div>
        </motion.div>

        {/* USDC Floating Coin */}
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-20 left-6 sm:left-16 w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-zinc-900/90 p-1 backdrop-blur-2xl border border-yellow-500/30 shadow-2xl flex items-center justify-center shadow-yellow-500/10"
        >
          <div className="text-center">
            <span className="text-3xl sm:text-4xl">💵</span>
            <div className="text-[10px] font-extrabold text-amber-400 font-mono mt-1">USDC Soroban</div>
          </div>
        </motion.div>

        {/* AQUA Water Token */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 left-4 lg:left-20 -translate-y-1/2 w-20 h-20 rounded-2xl bg-zinc-900/80 p-1 backdrop-blur-xl border border-yellow-500/20 hidden md:flex items-center justify-center"
        >
          <span className="text-2xl">🌊</span>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Hackathon Header Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-yellow-500/30 backdrop-blur-xl mb-6 shadow-lg shadow-yellow-500/5"
        >
          <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-semibold text-slate-200">
            Powered by <span className="text-gradient-gold font-bold">Soroban WASM Smart Contracts</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] font-display"
        >
          Swap Tokens Instantly on <span className="text-gradient-gold">Stellar</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Lightning-fast decentralized token swaps powered by Stellar DEX liquidity pools & Soroban Smart Contracts.
        </motion.p>

        {/* Primary & Secondary CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          {!wallet.isConnected ? (
            <button
              onClick={onOpenWalletModal}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black btn-neon cursor-pointer"
            >
              <Zap className="w-5 h-5 text-black fill-black" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <button
              onClick={onScrollToSwap}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black btn-neon cursor-pointer"
            >
              <Zap className="w-5 h-5 text-black fill-black" />
              <span>Launch Instant Swap</span>
            </button>
          )}

          <button
            onClick={onOpenDocsModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-200 bg-zinc-900/90 hover:bg-zinc-800 border border-yellow-500/20 backdrop-blur-xl transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-yellow-400" />
            <span>Documentation</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </motion.div>

        {/* Live Testnet Metrics Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-zinc-950/80 border border-yellow-500/20 max-w-3xl mx-auto shadow-2xl"
        >
          <div className="p-3 text-center border-r border-yellow-500/10 last:border-r-0">
            <div className="text-2xl font-black font-mono text-yellow-400">&lt; 0.001s</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>Soroban Speed</span>
            </div>
          </div>

          <div className="p-3 text-center border-r border-yellow-500/10 last:border-r-0">
            <div className="text-2xl font-black font-mono text-amber-400">0.00001 XLM</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Minimal Gas Fee</span>
            </div>
          </div>

          <div className="p-3 text-center border-r border-yellow-500/10 last:border-r-0">
            <div className="text-2xl font-black font-mono text-yellow-500">100% On-Chain</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Cpu className="w-3 h-3 text-yellow-400" />
              <span>Soroban WASM</span>
            </div>
          </div>

          <div className="p-3 text-center">
            <div className="text-2xl font-black font-mono text-yellow-400">Stellar Testnet</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3 text-yellow-400" />
              <span>Horizon Network</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
