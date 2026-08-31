import React from 'react';
import { motion } from 'motion/react';
import {
  X, Download, ExternalLink, RefreshCw,
  ShieldAlert, Coins, Globe2, Code2, AlertTriangle,
} from 'lucide-react';
import { ErrorAlert } from '../types';

interface ErrorAlertModalProps {
  alert: ErrorAlert | null;
  onClose: () => void;
  onRetry?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-type configuration: icon, color palette, title override, and CTA
// This implements the 3+ distinct error types required for Level 2.
// ─────────────────────────────────────────────────────────────────────────────
const ERROR_TYPE_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    borderColor: string;
    bgGlow: string;
    iconBg: string;
    iconColor: string;
    label: string;
    badgeColor: string;
  }
> = {
  // Error Type 1 — Wallet Not Installed
  wallet_not_installed: {
    icon: Download,
    borderColor: 'border-blue-500/40',
    bgGlow: 'bg-blue-500/10',
    iconBg: 'bg-blue-500/20 border-blue-500/30',
    iconColor: 'text-blue-400',
    label: 'Extension Missing',
    badgeColor: 'bg-blue-500/20 text-blue-300',
  },
  // Error Type 2 — User Rejected Freighter Popup
  user_rejected: {
    icon: ShieldAlert,
    borderColor: 'border-amber-500/40',
    bgGlow: 'bg-amber-500/10',
    iconBg: 'bg-amber-500/20 border-amber-500/30',
    iconColor: 'text-amber-400',
    label: 'Action Rejected',
    badgeColor: 'bg-amber-500/20 text-amber-300',
  },
  // Error Type 3 — Insufficient XLM Balance
  insufficient_balance: {
    icon: Coins,
    borderColor: 'border-rose-500/40',
    bgGlow: 'bg-rose-500/10',
    iconBg: 'bg-rose-500/20 border-rose-500/30',
    iconColor: 'text-rose-400',
    label: 'Insufficient Balance',
    badgeColor: 'bg-rose-500/20 text-rose-300',
  },
  // Error Type 4 — Wrong Network (Mainnet instead of Testnet)
  network_mismatch: {
    icon: Globe2,
    borderColor: 'border-purple-500/40',
    bgGlow: 'bg-purple-500/10',
    iconBg: 'bg-purple-500/20 border-purple-500/30',
    iconColor: 'text-purple-400',
    label: 'Network Mismatch',
    badgeColor: 'bg-purple-500/20 text-purple-300',
  },
  // Error Type 5 — Soroban Contract / RPC Error
  contract_error: {
    icon: Code2,
    borderColor: 'border-cyan-500/40',
    bgGlow: 'bg-cyan-500/10',
    iconBg: 'bg-cyan-500/20 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    label: 'Contract Error',
    badgeColor: 'bg-cyan-500/20 text-cyan-300',
  },
};

const DEFAULT_CONFIG = {
  icon: AlertTriangle,
  borderColor: 'border-rose-500/40',
  bgGlow: 'bg-rose-500/10',
  iconBg: 'bg-rose-500/20 border-rose-500/30',
  iconColor: 'text-rose-400',
  label: 'Error',
  badgeColor: 'bg-rose-500/20 text-rose-300',
};

export const ErrorAlertModal: React.FC<ErrorAlertModalProps> = ({ alert, onClose, onRetry }) => {
  if (!alert) return null;

  const cfg = ERROR_TYPE_CONFIG[alert.type] ?? DEFAULT_CONFIG;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className={`glass-card max-w-md w-full p-6 sm:p-7 rounded-3xl border ${cfg.borderColor} shadow-2xl relative overflow-hidden space-y-5`}
      >
        {/* Glow background */}
        <div className={`absolute top-0 right-0 w-48 h-48 ${cfg.bgGlow} blur-3xl pointer-events-none`} />

        {/* ── Header ── */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${cfg.iconBg}`}>
              <Icon className={`w-6 h-6 ${cfg.iconColor}`} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-display">{alert.title}</h3>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${cfg.badgeColor}`}>
                {cfg.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Error Message ── */}
        <div className={`p-4 rounded-2xl border text-xs text-slate-200 leading-relaxed font-mono ${cfg.bgGlow} ${cfg.borderColor}`}>
          {alert.message}
        </div>

        {/* ── Type-specific CTA buttons ── */}

        {/* Error Type 1: wallet_not_installed → Install Freighter */}
        {alert.type === 'wallet_not_installed' && (
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Install Freighter Wallet Extension</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Error Type 2: user_rejected → Retry button */}
        {alert.type === 'user_rejected' && onRetry && (
          <button
            onClick={() => { onClose(); onRetry(); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again — Approve in Freighter</span>
          </button>
        )}

        {/* Error Type 3: insufficient_balance → Friendbot faucet */}
        {alert.type === 'insufficient_balance' && (
          <a
            href="https://friendbot.stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <Coins className="w-4 h-4" />
            <span>Get Free Testnet XLM via Stellar Friendbot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Error Type 4: network_mismatch → Switch guide */}
        {alert.type === 'network_mismatch' && (
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1.5">
            <div className="font-bold text-purple-300">How to switch Freighter to Testnet:</div>
            {['Open the Freighter extension', 'Click Settings (⚙) → Network', 'Select "Testnet" from the list', 'Return to SwapX and connect again'].map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error Type 5: contract_error → Stellar Expert link */}
        {alert.type === 'contract_error' && (
          <a
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Code2 className="w-4 h-4" />
            <span>View on Stellar Expert Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* ── Dismiss row ── */}
        <div className="flex items-center gap-3">
          {onRetry && alert.type !== 'user_rejected' && (
            <button
              onClick={() => { onClose(); onRetry(); }}
              className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs cursor-pointer transition-all"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  );
};
