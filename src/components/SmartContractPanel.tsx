import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2, Copy, CheckCircle2, Play, Terminal, Cpu,
  ExternalLink, Layers, ShieldCheck, FileCode,
  RefreshCw, XCircle, Coins, Globe2, AlertTriangle
} from 'lucide-react';
import {
  SOROBAN_CONTRACT_ADDRESS,
  SOROBAN_CONTRACT_VERSION,
  SOROBAN_SMART_CONTRACT_RUST_CODE,
  XLM_SAC_CONTRACT_ID,
  XLM_SAC_EXPLORER_URL,
  SOROBAN_RPC_URL,
} from '../data/sorobanCode';
import { callSorobanSacBalance, callSorobanSacMeta, SorobanCallResult } from '../services/stellarService';
import { WalletState } from '../types';

interface SmartContractPanelProps {
  wallet: WalletState;
  onTriggerContractCall: (fnName: string) => Promise<string>;
}

export const SmartContractPanel: React.FC<SmartContractPanelProps> = ({
  wallet,
  onTriggerContractCall,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'sac' | 'overview' | 'code'>('sac');

  // SAC Query state
  const [queryAddress, setQueryAddress] = useState(wallet.publicKey || '');
  const [sacResult, setSacResult] = useState<SorobanCallResult | null>(null);
  const [sacLoading, setSacLoading] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // DEX invoker state
  const [callingFn, setCallingFn] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SOROBAN_SMART_CONTRACT_RUST_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAddr = () => {
    navigator.clipboard.writeText(XLM_SAC_CONTRACT_ID);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // ── Real Soroban RPC call against XLM native SAC ──
  const handleSacQuery = async (fnName: 'balance' | 'name' | 'symbol' | 'decimals') => {
    const caller = wallet.publicKey || 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN';
    setSacLoading(fnName);
    setSacResult(null);
    try {
      let result: SorobanCallResult;
      if (fnName === 'balance') {
        const target = queryAddress.trim() || caller;
        result = await callSorobanSacBalance(target, caller);
      } else {
        result = await callSorobanSacMeta(fnName, caller);
      }
      setSacResult(result);
    } catch (err: any) {
      setSacResult({
        success: false,
        functionName: fnName,
        contractId: XLM_SAC_CONTRACT_ID,
        rawScVal: '',
        parsedValue: '',
        error: err?.message || 'RPC call failed',
      });
    } finally {
      setSacLoading(null);
    }
  };

  // ── Simulated DEX invocations ──
  const handleDexCall = async (fnName: string) => {
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

  const tabs = [
    { id: 'sac', label: 'Live SAC Query', icon: Globe2 },
    { id: 'overview', label: 'DEX Overview', icon: Cpu },
    { id: 'code', label: 'Rust Code', icon: FileCode },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
              <Code2 className="w-4 h-4" />
              <span>Soroban WebAssembly Smart Contract</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Soroban Contract Explorer
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Make real Soroban RPC calls to the XLM Native Stellar Asset Contract (SAC) deployed on Stellar Testnet.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    selectedTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          {[
            { label: 'XLM SAC Status', value: 'Live on Testnet', color: 'text-emerald-400', dot: true },
            { label: 'Soroban RPC', value: 'soroban-testnet.stellar.org', color: 'text-cyan-300' },
            { label: 'SAC Standard', value: 'SEP-0041 Token Interface', color: 'text-purple-300' },
            { label: 'DEX Fee', value: '30 BPS (0.3%)', color: 'text-white' },
          ].map(item => (
            <div key={item.label} className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 text-[10px]">{item.label}</div>
              <div className={`font-bold mt-1 flex items-center gap-1.5 ${item.color}`}>
                {item.dot && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                <span className="truncate">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB 1: LIVE SAC QUERY ── */}
      <AnimatePresence mode="wait">
        {selectedTab === 'sac' && (
          <motion.div key="sac" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">

            {/* Contract address card */}
            <div className="glass-card rounded-2xl p-4 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
                <span>XLM Native SAC — Real Deployed Soroban Contract</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-slate-400 flex-shrink-0">Contract ID:</span>
                  <span className="text-cyan-300 font-bold break-all">{XLM_SAC_CONTRACT_ID}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleCopyAddr}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
                  >
                    {copiedAddr ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedAddr ? 'Copied' : 'Copy'}
                  </button>
                  <a
                    href={XLM_SAC_EXPLORER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Explorer
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300">
                This is the <span className="text-cyan-300 font-semibold">Stellar Asset Contract (SAC)</span> for XLM — automatically deployed by the Stellar protocol on Testnet.
                Address is derived deterministically via <code className="bg-white/10 px-1 rounded">Asset.native().contractId(Networks.TESTNET)</code>.
              </div>
            </div>

            {/* balance() query card */}
            <div className="glass-card rounded-3xl p-6 border border-purple-500/30 space-y-5">
              <div>
                <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  <span>Real Soroban RPC Invocation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Calls are simulated (read-only) via <code className="bg-white/10 px-1 rounded text-cyan-300">SorobanRpc.Server.simulateTransaction()</code> — no gas required.
                </p>
              </div>

              {/* balance(address) query */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-300">fn balance(address: Address) → i128</div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={queryAddress}
                    onChange={e => setQueryAddress(e.target.value)}
                    placeholder="Enter Stellar address (G...)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => handleSacQuery('balance')}
                    disabled={sacLoading === 'balance'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-bold text-xs transition-all cursor-pointer flex-shrink-0"
                  >
                    {sacLoading === 'balance'
                      ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      : <Play className="w-3.5 h-3.5" />}
                    {sacLoading === 'balance' ? 'Querying...' : 'Query balance()'}
                  </button>
                </div>
              </div>

              {/* Meta function buttons */}
              <div className="grid grid-cols-3 gap-3">
                {(['name', 'symbol', 'decimals'] as const).map(fn => (
                  <button
                    key={fn}
                    onClick={() => handleSacQuery(fn)}
                    disabled={sacLoading === fn}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-left transition-all group"
                  >
                    <div className="text-[10px] text-slate-500 font-mono">fn call</div>
                    <div className="font-mono text-xs font-bold text-cyan-300 flex items-center justify-between mt-1">
                      {fn}()
                      {sacLoading === fn
                        ? <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                        : <Play className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      }
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {fn === 'name' ? '→ "native"' : fn === 'symbol' ? '→ "XLM"' : '→ 7'}
                    </div>
                  </button>
                ))}
              </div>

              {/* ── Transaction Status during RPC call ── */}
              {sacLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3"
                >
                  <RefreshCw className="w-5 h-5 text-purple-400 animate-spin flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white">Calling <code className="text-purple-300">{sacLoading}()</code> on XLM SAC</div>
                    <div className="text-xs text-slate-400 mt-0.5">Sending simulation tx to Soroban RPC → awaiting ScVal response...</div>
                  </div>
                </motion.div>
              )}

              {/* ── Result Display ── */}
              <AnimatePresence>
                {sacResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-2xl border p-4 space-y-3 text-xs font-mono ${
                      sacResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-rose-500/10 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 font-bold text-sm ${sacResult.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {sacResult.success
                          ? <CheckCircle2 className="w-4 h-4" />
                          : <XCircle className="w-4 h-4" />
                        }
                        {sacResult.success ? 'RPC Call Successful' : 'RPC Call Failed'}
                      </div>
                      {sacResult.ledger && (
                        <span className="text-slate-400">Ledger #{sacResult.ledger.toLocaleString()}</span>
                      )}
                    </div>

                    {sacResult.success ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Function:</span>
                          <span className="text-cyan-300">{sacResult.functionName}()</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Raw ScVal:</span>
                          <span className="text-yellow-300">{sacResult.rawScVal}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Parsed Result:</span>
                          <span className="text-emerald-300 font-bold">{sacResult.parsedValue}</span>
                        </div>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-slate-400">
                          <span>Contract:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-cyan-400 truncate max-w-[180px]">{sacResult.contractId}</span>
                            <button onClick={() => handleCopyHash(sacResult.contractId)} className="p-0.5 hover:text-white">
                              {copiedHash ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-rose-300">
                        <div className="text-[10px] text-slate-400">Error:</div>
                        <div className="break-words">{sacResult.error}</div>
                        <div className="text-[10px] text-slate-500 mt-2">
                          Tip: Make sure the address is a valid Stellar G... address funded on Testnet.
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RPC endpoint info */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Soroban RPC:</span>
                <span className="text-cyan-300">{SOROBAN_RPC_URL}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Method:</span>
                <span className="text-yellow-300">simulateTransaction</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Auth:</span>
                <span className="text-emerald-300">None (read-only)</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 2: DEX OVERVIEW ── */}
        {selectedTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {/* DEX contract address */}
            <div className="glass-card rounded-2xl p-4 border border-yellow-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono mb-6">
              <div className="flex items-center gap-2 overflow-hidden w-full">
                <ShieldCheck className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-400">SwapX DEX Contract:</span>
                <span className="text-yellow-300 font-bold truncate">{SOROBAN_CONTRACT_ADDRESS}</span>
              </div>
              <span className="px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 flex-shrink-0">
                {SOROBAN_CONTRACT_VERSION}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4">
                <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Contract Capabilities</span>
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { title: 'Constant Product AMM (x * y = k)', desc: 'Calculates slippage-protected swap amounts with fee distribution.', color: 'text-cyan-300' },
                    { title: 'Soroban Token Client Transfers', desc: 'Integrates with SAC and custom Soroban token standards.', color: 'text-purple-300' },
                    { title: 'Ledger Event Publishing', desc: 'Emits on-chain events for every swap, LP action, and pool creation.', color: 'text-emerald-300' },
                  ].map(item => (
                    <div key={item.title} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <div className={`font-bold ${item.color}`}>{item.title}</div>
                      <div className="text-slate-400">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4">
                <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  <span>DEX Function Invoker</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { fn: 'get_pool_info', label: 'get_pool_info()', color: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' },
                    { fn: 'get_total_swaps', label: 'get_total_swaps()', color: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
                  ].map(item => (
                    <button
                      key={item.fn}
                      onClick={() => handleDexCall(item.fn)}
                      disabled={callingFn === item.fn}
                      className={`p-3 rounded-2xl border font-bold text-xs text-left transition-all ${item.color} ${callingFn === item.fn ? 'opacity-50' : 'hover:opacity-80'}`}
                    >
                      <div className="text-[10px] text-slate-400 font-mono">fn query</div>
                      <div className="flex items-center justify-between mt-1">
                        <span>{item.label}</span>
                        {callingFn === item.fn ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
                {lastResult && (
                  <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 space-y-1">
                    <div className="text-[10px] text-slate-400">Result:</div>
                    <pre className="whitespace-pre-wrap overflow-x-auto">{lastResult}</pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 3: RUST CODE ── */}
        {selectedTab === 'code' && (
          <motion.div key="code" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
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
                  {copiedCode ? 'Copied' : 'Copy Rust Code'}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#060810] border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
                <code>{SOROBAN_SMART_CONTRACT_RUST_CODE}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
