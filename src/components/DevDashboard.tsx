import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Cpu, 
  Wallet, 
  Layers, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Flame,
  Zap,
  Server
} from 'lucide-react';
import { WalletState, ContractEvent, TransactionRecord } from '../types';
import { SOROBAN_CONTRACT_ADDRESS, SOROBAN_CONTRACT_VERSION } from '../data/sorobanCode';

interface DevDashboardProps {
  wallet: WalletState;
  events: ContractEvent[];
  transactions: TransactionRecord[];
}

export const DevDashboard: React.FC<DevDashboardProps> = ({
  wallet,
  events,
  transactions,
}) => {
  const totalGasStroops = transactions.length * 100; // 100 stroops = 0.00001 XLM per tx

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Developer & Investor Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Soroban System Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time telemetry, memory gas metrics, and smart contract health indicators.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Node Health 100%</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Wallet Status</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-display text-white">
            {wallet.isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <div className="text-[11px] text-cyan-300 font-mono truncate">
            {wallet.publicKey || 'GDKX... (Demo Mode)'}
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Network</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-display text-purple-300">
            {wallet.network}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Horizon RPC Node v20.2
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Swaps Processed</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {transactions.length + 12} Operations
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Sub-second settlement
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Soroban Gas Consumed</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400">
            {totalGasStroops + 1200} Stroops
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            ≈ 0.000120 XLM Total
          </div>
        </div>

      </div>

      {/* Contract & Telemetry Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contract Deployment Specs */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-6 border border-white/15 space-y-4">
          <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Contract Specifications</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 text-[10px]">WASM Contract ID</div>
              <div className="text-cyan-300 font-bold truncate mt-0.5">{SOROBAN_CONTRACT_ADDRESS}</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 text-[10px]">Soroban Runtime Version</div>
              <div className="text-white font-bold mt-0.5">{SOROBAN_CONTRACT_VERSION}</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 text-[10px]">Deployment Status</div>
              <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified On-Chain</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 text-[10px]">Protocol Version</div>
              <div className="text-purple-300 font-bold mt-0.5">Stellar Core Protocol 20</div>
            </div>
          </div>
        </div>

        {/* Right Column: Latest System Events */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/15 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span>Latest Telemetry Logs</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{events.length} Events Logged</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {events.slice(0, 8).map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white">{evt.title}</span>
                  <span className="text-slate-400 truncate max-w-[200px]">{evt.details}</span>
                </div>

                <span className="text-slate-500 text-[10px]">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
