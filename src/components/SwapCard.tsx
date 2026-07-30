import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowDownUp, 
  Settings, 
  RefreshCw, 
  Zap, 
  Info, 
  ChevronDown, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Token, WalletState, TransactionStatus } from '../types';
import { STELLAR_TOKENS } from '../data/tokens';

interface SwapCardProps {
  wallet: WalletState;
  onExecuteSwap: (
    fromToken: Token,
    toToken: Token,
    fromAmount: number,
    toAmount: number
  ) => Promise<void>;
  onOpenWalletModal: () => void;
  txStatus: TransactionStatus;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  wallet,
  onExecuteSwap,
  onOpenWalletModal,
  txStatus,
}) => {
  const [tokens, setTokens] = useState<Token[]>(STELLAR_TOKENS);
  const [fromToken, setFromToken] = useState<Token>(tokens[0]); // XLM
  const [toToken, setToToken] = useState<Token>(tokens[1]);     // USDC

  const [fromAmount, setFromAmount] = useState<string>('100');
  const [toAmount, setToAmount] = useState<string>('');

  const [slippage, setSlippage] = useState<number>(0.5); // 0.5%
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);

  // Sync wallet balance to XLM token
  useEffect(() => {
    if (wallet.isConnected && wallet.balanceXlm > 0) {
      setTokens((prev) =>
        prev.map((t) => (t.symbol === 'XLM' ? { ...t, balance: wallet.balanceXlm } : t))
      );
    }
  }, [wallet.isConnected, wallet.balanceXlm]);

  // Recalculate estimated output amount whenever inputs or rates change
  useEffect(() => {
    const numericFrom = parseFloat(fromAmount) || 0;
    if (numericFrom <= 0) {
      setToAmount('');
      return;
    }
    const fromUsdVal = numericFrom * fromToken.priceUsd;
    const estimatedTo = fromUsdVal / toToken.priceUsd;
    setToAmount(estimatedTo.toFixed(4));
  }, [fromAmount, fromToken, toToken]);

  // Swap Token Selection direction flip
  const handleFlipTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    if (toAmount) {
      setFromAmount(toAmount);
    }
  };

  // Max Button handler
  const handleMaxClick = () => {
    if (fromToken.symbol === 'XLM') {
      const maxVal = Math.max(0, fromToken.balance - 1); // reserve 1 XLM for gas
      setFromAmount(maxVal.toString());
    } else {
      setFromAmount(fromToken.balance.toString());
    }
  };

  // Trigger Swap Execution
  const handleSwapClick = async () => {
    const numFrom = parseFloat(fromAmount) || 0;
    const numTo = parseFloat(toAmount) || 0;

    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }

    if (numFrom <= 0) return;

    await onExecuteSwap(fromToken, toToken, numFrom, numTo);

    // Launch celebratory confetti burst on success
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00E5FF', '#4F7CFF', '#8A5CFF', '#10B981'],
    });
  };

  // Validations
  const parsedFromAmount = parseFloat(fromAmount) || 0;
  const isInsufficientBalance = wallet.isConnected && parsedFromAmount > fromToken.balance;
  const isSwapDisabled = 
    !wallet.isConnected 
      ? false 
      : parsedFromAmount <= 0 || isInsufficientBalance || txStatus !== 'idle';

  // Calculate Exchange Rate string
  const rate = (fromToken.priceUsd / toToken.priceUsd).toFixed(4);

  return (
    <div className="relative max-w-lg mx-auto w-full">
      {/* Background Neon Glow Behind Card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-purple-600/30 rounded-3xl blur-2xl opacity-60 animate-pulse-slow" />

      {/* Main Glassmorphic Swap Card */}
      <div className="relative glass-card rounded-3xl p-5 sm:p-7 border border-white/15 shadow-2xl overflow-visible">
        
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Swap Tokens</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Rates */}
            <button
              onClick={() => {
                const randVariation = 0.99 + Math.random() * 0.02;
                setFromToken((prev) => ({ ...prev, priceUsd: prev.priceUsd * randVariation }));
              }}
              title="Refresh Live Exchange Rates"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Slippage Settings Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all relative"
            >
              <Settings className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-cyan-500 text-[9px] font-bold text-black rounded-full">
                {slippage}%
              </span>
            </button>
          </div>
        </div>

        {/* ================= YOU PAY INPUT ================= */}
        <div className="token-input p-4 transition-all mb-2">
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span className="font-semibold text-white/60 uppercase tracking-wider">You Pay</span>
            <div className="flex items-center gap-2">
              <span>
                Balance:{' '}
                <span className="font-mono font-medium text-slate-200">
                  {fromToken.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
              </span>
              {wallet.isConnected && (
                <button
                  onClick={handleMaxClick}
                  className="px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all uppercase"
                >
                  Max
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Amount Input */}
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-white focus:outline-none placeholder:text-white/20"
            />

            {/* Token Selector Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFromDropdown(!showFromDropdown);
                  setShowToDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all whitespace-nowrap cursor-pointer"
              >
                <span className="text-xl">{fromToken.icon}</span>
                <span className="font-bold text-sm font-display">{fromToken.symbol}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* From Token Select Modal */}
              {showFromDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card p-2 shadow-2xl border border-white/20 z-50">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase">Select Token</div>
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      disabled={token.symbol === toToken.symbol}
                      onClick={() => {
                        setFromToken(token);
                        setShowFromDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        token.symbol === fromToken.symbol
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : token.symbol === toToken.symbol
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{token.icon}</span>
                        <div className="text-left">
                          <div className="font-bold">{token.symbol}</div>
                          <div className="text-[10px] text-slate-400">{token.name}</div>
                        </div>
                      </div>
                      <div className="font-mono text-[11px]">
                        ${token.priceUsd < 0.01 ? token.priceUsd.toFixed(4) : token.priceUsd.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 text-xs text-white/40 font-mono">
            ≈ ${(parsedFromAmount * fromToken.priceUsd).toFixed(2)} USD
          </div>
        </div>

        {/* ================= FLIP SWAP DIRECTION ARROW ================= */}
        <div className="relative flex justify-center -my-3.5 z-20">
          <motion.button
            whileHover={{ scale: 1.15, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFlipTokens}
            className="w-10 h-10 rounded-xl bg-[#06070A] border border-white/10 hover:border-[#4F7CFF] text-[#4F7CFF] shadow-xl flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowDownUp className="w-5 h-5" />
          </motion.button>
        </div>

        {/* ================= YOU RECEIVE INPUT ================= */}
        <div className="token-input p-4 transition-all mt-2">
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span className="font-semibold text-white/60 uppercase tracking-wider">You Receive (Est.)</span>
            <span>
              Balance:{' '}
              <span className="font-mono font-medium text-slate-200">
                {toToken.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Amount Output */}
            <input
              type="text"
              readOnly
              value={toAmount}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-[#00E5FF] focus:outline-none placeholder:text-white/20"
            />

            {/* Token Selector Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowToDropdown(!showToDropdown);
                  setShowFromDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all whitespace-nowrap cursor-pointer"
              >
                <span className="text-xl">{toToken.icon}</span>
                <span className="font-bold text-sm font-display">{toToken.symbol}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* To Token Select Modal */}
              {showToDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card p-2 shadow-2xl border border-white/20 z-50">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase">Select Token</div>
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      disabled={token.symbol === fromToken.symbol}
                      onClick={() => {
                        setToToken(token);
                        setShowToDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        token.symbol === toToken.symbol
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : token.symbol === fromToken.symbol
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{token.icon}</span>
                        <div className="text-left">
                          <div className="font-bold">{token.symbol}</div>
                          <div className="text-[10px] text-slate-400">{token.name}</div>
                        </div>
                      </div>
                      <div className="font-mono text-[11px]">
                        ${token.priceUsd < 0.01 ? token.priceUsd.toFixed(4) : token.priceUsd.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 text-xs text-white/40 font-mono">
            ≈ ${((parseFloat(toAmount) || 0) * toToken.priceUsd).toFixed(2)} USD
          </div>
        </div>

        {/* ================= SWAP DETAILS METRICS ================= */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exchange Rate</span>
            </span>
            <span className="font-mono font-semibold text-white">
              1 {fromToken.symbol} = {rate} {toToken.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Price Impact</span>
            <span className="font-mono font-medium text-emerald-400">&lt; 0.05%</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Estimated Gas Fee</span>
            <span className="font-mono font-medium text-slate-200">0.0000100 XLM</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Route</span>
            <span className="font-mono text-[11px] text-cyan-300 flex items-center gap-1">
              <span>{fromToken.symbol}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Soroban AMM
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span>{toToken.symbol}</span>
            </span>
          </div>
        </div>

        {/* Insufficient Balance Alert */}
        {isInsufficientBalance && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Insufficient {fromToken.symbol} balance for this swap.</span>
          </div>
        )}

        {/* ================= MAIN ACTION BUTTON ================= */}
        <div className="mt-5">
          {!wallet.isConnected ? (
            <button
              onClick={onOpenWalletModal}
              className="w-full py-4 rounded-2xl font-bold text-base uppercase tracking-widest text-white btn-neon cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-white fill-white" />
              <span>Connect Wallet to Swap</span>
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: isSwapDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isSwapDisabled ? 1 : 0.98 }}
              disabled={isSwapDisabled}
              onClick={handleSwapClick}
              className={`w-full py-4 rounded-2xl font-bold text-base uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSwapDisabled
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none'
                  : 'btn-neon text-white'
              }`}
            >
              {txStatus !== 'idle' ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="capitalize">{txStatus}...</span>
                </>
              ) : isInsufficientBalance ? (
                <span>Insufficient {fromToken.symbol} Balance</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>Confirm Swap</span>
                </>
              )}
            </motion.button>
          )}
        </div>

      </div>

      {/* Slippage Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-950 max-w-sm w-full p-6 rounded-3xl border border-yellow-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 mb-5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-lg text-white font-display">Transaction Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-xl bg-zinc-900 border border-yellow-500/20 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {/* Slippage Controls */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-200">
                    Slippage Tolerance
                  </label>
                  <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/30">
                    {slippage.toFixed(1)}%
                  </span>
                </div>

                {/* Preset Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[0.1, 0.5, 1.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSlippage(val)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        slippage === val
                          ? 'bg-yellow-500 text-black border border-yellow-400 shadow-lg shadow-yellow-500/20 font-black'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-slate-300 border border-yellow-500/20'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>

                {/* Interactive Slider */}
                <div className="space-y-2 p-3 rounded-2xl bg-zinc-900/80 border border-yellow-500/20">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Low (0.1%)</span>
                    <span>High (5.0%)</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer bg-zinc-800 h-2 rounded-lg"
                  />
                  {slippage > 3.0 && (
                    <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>High slippage tolerance may result in unfavorable rates.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Deadline */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  Transaction Deadline
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue="20"
                    min="1"
                    max="180"
                    className="w-24 px-3 py-2 rounded-xl bg-black border border-yellow-500/20 text-xs font-mono text-yellow-400 focus:outline-none focus:border-yellow-500"
                  />
                  <span className="text-xs text-slate-400">minutes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="mt-6 w-full py-3.5 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
            >
              Save & Apply Settings
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
