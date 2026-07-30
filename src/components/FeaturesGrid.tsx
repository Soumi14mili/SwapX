import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Globe2, 
  Activity, 
  Code2, 
  Github, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const featureList = [
    {
      icon: Zap,
      title: '⚡ Stellar DEX',
      subtitle: 'Native Liquidity Pools',
      description: 'Trade directly against Stellar decentralised exchange orderbooks and automated liquidity pools with optimal routing.',
      color: 'from-yellow-500/20 to-amber-500/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
    },
    {
      icon: ShieldCheck,
      title: '🔐 Secure Wallet',
      subtitle: 'Freighter Key Management',
      description: 'Non-custodial cryptographic signing powered by Freighter API. Your private keys never leave your browser.',
      color: 'from-amber-500/20 to-yellow-600/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
    },
    {
      icon: Globe2,
      title: '💸 Lightning Speed',
      subtitle: 'Sub-Second Settlement',
      description: 'Finality achieved in 1-2 seconds with near-zero gas fees (~0.00001 XLM per transaction).',
      color: 'from-yellow-400/20 to-amber-600/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
    },
    {
      icon: Activity,
      title: '📡 Live Events',
      subtitle: 'Real-Time Telemetry',
      description: 'Sub-millisecond event telemetry tracking liquidity updates, swaps, and smart contract ledger state.',
      color: 'from-amber-500/20 to-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
    },
    {
      icon: Code2,
      title: '📜 Soroban WASM',
      subtitle: 'Stellar Smart Contracts',
      description: 'Next-gen WebAssembly smart contracts compiled with Rust for fast, safe, and cost-effective execution.',
      color: 'from-yellow-500/20 to-amber-500/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
    },
    {
      icon: Github,
      title: '🌍 Open Source',
      subtitle: 'Audited & Public',
      description: 'Fully open-source codebase built with React 19, TypeScript, Tailwind CSS, and Soroban SDK.',
      color: 'from-amber-400/20 to-yellow-600/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Infrastructure</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
          Why Trade on Swap<span className="text-gradient-gold">X</span>?
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Built for high-frequency decentralized trading with industrial-grade Stellar blockchain technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className={`p-6 rounded-3xl glass-card border ${item.borderColor} glass-card-hover relative group overflow-hidden`}
            >
              <div className={`absolute -right-10 -bottom-10 w-36 h-36 bg-gradient-to-br ${item.color} blur-2xl pointer-events-none`} />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center ${item.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white font-display">{item.title}</h3>
                  <div className="text-xs font-mono text-yellow-300 mt-0.5">{item.subtitle}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

