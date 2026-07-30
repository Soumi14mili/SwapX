import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  RefreshCw, 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Token, WalletState } from '../types';
import { STELLAR_TOKENS } from '../data/tokens';
import { requestFriendbotTokens } from '../services/stellarService';

interface BalancePanelProps {
  wallet: WalletState;
  onRefreshBalance: () => Promise<void>;
  onSelectTokenToSwap: (token: Token) => void;
}

export const BalancePanel: React.FC<BalancePanelProps> = ({
  wallet,
  onRefreshBalance,
  onSelectTokenToSwap,
}) => {
  const [tokens, setTokens] = useState<Token[]>(STELLAR_TOKENS);
  const [refreshing, setRefreshing] = useState(false);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update XLM balance in list
  const currentTokens = tokens.map((t) =>
    t.symbol === 'XLM' && wallet.isConnected ? { ...t, balance: wallet.balanceXlm } : t
  );

  const totalUsdValuation = currentTokens.reduce(
    (acc, token) => acc + token.balance * token.priceUsd,
    0
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefreshBalance();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleFaucet = async () => {
    if (!wallet.publicKey) return;
    setFaucetLoading(true);
    try {
      await requestFriendbotTokens(wallet.publicKey);
      await onRefreshBalance();
    } finally {
      setFaucetLoading(false);
    }
  };

  const filteredTokens = currentTokens.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>Stellar Testnet Assets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Portfolio & Balances
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live token balances synchronized with Stellar Horizon Testnet RPC nodes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Balances</span>
            </button>

            {wallet.isConnected && (
              <button
                onClick={handleFaucet}
                disabled={faucetLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{faucetLoading ? 'Funding...' : 'Friendbot Faucet'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Total USD Valuation Hero metric */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs text-slate-400">Total Asset Valuation</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-1">
              ${totalUsdValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>Stellar Horizon Testnet API</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs text-slate-400">Native Stellar XLM</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {wallet.balanceXlm.toLocaleString()} XLM
            </div>
            <div className="text-[10px] text-cyan-300 mt-1 font-mono">
              ≈ ${(wallet.balanceXlm * 0.118).toFixed(2)} USD
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs text-slate-400">Active Testnet Address</div>
            <div className="text-xs font-mono text-slate-200 mt-2 truncate font-semibold">
              {wallet.publicKey || 'GDKX...XLM (Not Connected)'}
            </div>
            <div className="text-[10px] text-purple-400 mt-1 font-mono">
              {wallet.isConnected ? 'Connected via Freighter' : 'Demo Testnet Mode'}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Table Card */}
      <div className="glass-card rounded-3xl p-6 border border-white/15">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <h3 className="text-lg font-bold font-display text-white">Supported Tokens</h3>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search token or symbol..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Tokens List */}
        <div className="space-y-3">
          {filteredTokens.map((token) => {
            const tokenUsdVal = token.balance * token.priceUsd;
            return (
              <motion.div
                key={token.symbol}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border"
                    style={{ backgroundColor: `${token.color}15`, borderColor: `${token.color}40` }}
                  >
                    {token.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base font-display">{token.symbol}</span>
                      {token.isNative && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                          Native
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{token.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-white text-sm">
                    {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
                  </div>
                  <div className="font-mono text-xs text-slate-400">
                    ${tokenUsdVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </div>
                </div>

                <button
                  onClick={() => onSelectTokenToSwap(token)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all ml-4"
                >
                  <span>Swap</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
