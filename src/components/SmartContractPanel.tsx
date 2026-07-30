import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Copy, 
  CheckCircle2, 
  Play, 
  Terminal, 
  Cpu, 
  ExternalLink, 
  Layers, 
  Sparkles,
  ShieldCheck,
  FileCode
} from 'lucide-react';
import { 
  SOROBAN_CONTRACT_ADDRESS, 
  SOROBAN_CONTRACT_VERSION, 
  SOROBAN_SMART_CONTRACT_RUST_CODE 
} from '../data/sorobanCode';

interface SmartContractPanelProps {
  onTriggerContractCall: (fnName: string) => Promise<string>;
}

export const SmartContractPanel: React.FC<SmartContractPanelProps> = ({
  onTriggerContractCall,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [callingFn, setCallingFn] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'code' | 'invoker'>('overview');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SOROBAN_SMART_CONTRACT_RUST_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAddr = () => {
    navigator.clipboard.writeText(SOROBAN_CONTRACT_ADDRESS);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCall = async (fnName: string) => {
    setCallingFn(fnName);
    setLastResult(null);
    try {
      const res = await onTriggerContractCall(fnName);
      setLastResult(res);
    } catch (e: any) {
      setLastResult(`Error: ${e.message}`);
    } finally {
      setCallingFn(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
              <Code2 className="w-4 h-4" />
              <span>Soroban WebAssembly Smart Contract</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Soroban Token Swap Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Compiled WebAssembly smart contract deployed on Stellar Testnet for trustless automated token exchanges.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {(['overview', 'invoker', 'code'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedTab === tab
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'invoker' ? 'RPC Invoker' : tab === 'code' ? 'Rust Contract Code' : 'Overview'}
              </button>
            ))}
          </div>
        </div>

        {/* Contract Info Grid */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-slate-400 text-[10px]">Contract Status</div>
            <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active on Testnet</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-slate-400 text-[10px]">Soroban Version</div>
            <div className="font-bold text-cyan-300 mt-1">{SOROBAN_CONTRACT_VERSION}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-slate-400 text-[10px]">Deployment Target</div>
            <div className="font-bold text-purple-300 mt-1">Stellar Futurenet/Testnet</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-slate-400 text-[10px]">Fee Basis Points</div>
            <div className="font-bold text-white mt-1">30 BPS (0.3%)</div>
          </div>
        </div>
      </div>

      {/* Contract Address Card */}
      <div className="glass-card rounded-2xl p-4 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-hidden w-full">
          <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span className="text-slate-400">Contract ID:</span>
          <span className="text-cyan-300 font-bold truncate">{SOROBAN_CONTRACT_ADDRESS}</span>
        </div>

        <button
          onClick={handleCopyAddr}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 flex-shrink-0 transition-all cursor-pointer"
        >
          {copiedAddr ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAddr ? 'Copied' : 'Copy ID'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Contract Capabilities</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-cyan-300">Constant Product AMM (x * y = k)</div>
                <div className="text-slate-400">
                  Calculates slippage-protected swap amounts dynamically with fee distribution to liquidity providers.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-purple-300">Soroban Token Client Transfers</div>
                <div className="text-slate-400">
                  Integrates natively with Stellar Asset Contracts (SAC) and custom Soroban token standards.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-emerald-300">Ledger Event Publishing</div>
                <div className="text-slate-400">
                  Emits on-chain events for every swap, liquidity addition, and pool creation for real-time indexing.
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <span>Quick Testnet Call Test</span>
            </h3>

            <p className="text-xs text-slate-300">
              Trigger a test RPC invocation directly on Soroban Testnet endpoints to inspect live response state.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCall('get_pool_info')}
                disabled={callingFn === 'get_pool_info'}
                className="p-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs text-left transition-all"
              >
                <div className="text-[10px] text-slate-400 font-mono">fn query</div>
                <div>get_pool_info()</div>
              </button>

              <button
                onClick={() => handleCall('get_total_swaps')}
                disabled={callingFn === 'get_total_swaps'}
                className="p-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs text-left transition-all"
              >
                <div className="text-[10px] text-slate-400 font-mono">fn query</div>
                <div>get_total_swaps()</div>
              </button>
            </div>

            {lastResult && (
              <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 space-y-1">
                <div className="text-[10px] text-slate-400">Invocation Result:</div>
                <pre className="whitespace-pre-wrap overflow-x-auto">{lastResult}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE RPC INVOKER */}
      {selectedTab === 'invoker' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6">
          <div>
            <h3 className="text-xl font-bold font-display text-white">Interactive Soroban RPC Console</h3>
            <p className="text-xs text-slate-400">Simulate Soroban WASM contract execution parameters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { fn: 'initialize', label: 'initialize(admin)', desc: 'Setup contract state' },
              { fn: 'create_pool', label: 'create_pool(token_a, token_b)', desc: 'Deploy new AMM pair' },
              { fn: 'swap_tokens', label: 'swap_tokens(...)', desc: 'Perform token swap' },
              { fn: 'add_liquidity', label: 'add_liquidity(...)', desc: 'Provide LP liquidity' },
              { fn: 'get_pool_info', label: 'get_pool_info()', desc: 'Query reserves' },
              { fn: 'get_total_swaps', label: 'get_total_swaps()', desc: 'Get swap counter' },
            ].map((item) => (
              <button
                key={item.fn}
                onClick={() => handleCall(item.fn)}
                disabled={callingFn === item.fn}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-left transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300">{item.label}</span>
                  <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </button>
            ))}
          </div>

          {lastResult && (
            <div className="p-4 rounded-2xl bg-black/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
              <div className="text-slate-400 text-[10px] mb-1">Soroban RPC Simulation Log:</div>
              <pre className="whitespace-pre-wrap">{lastResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RUST SOURCE CODE */}
      {selectedTab === 'code' && (
        <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-sm text-white font-mono">soroban_token_swap.rs</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition-all cursor-pointer"
            >
              {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Rust Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#060810] border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
            <code>{SOROBAN_SMART_CONTRACT_RUST_CODE}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
