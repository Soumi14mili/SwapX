import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X, ShieldAlert, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { ErrorAlert } from '../types';

interface ErrorAlertModalProps {
  alert: ErrorAlert | null;
  onClose: () => void;
  onRetry?: () => void;
}

export const ErrorAlertModal: React.FC<ErrorAlertModalProps> = ({
  alert,
  onClose,
  onRetry,
}) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="glass-card max-w-md w-full p-6 sm:p-7 rounded-3xl border border-rose-500/40 shadow-2xl relative overflow-hidden space-y-4"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-display">{alert.title}</h3>
              <p className="text-xs text-rose-300 font-mono">Stellar Web3 Error Notice</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-slate-200 leading-relaxed font-mono">
          {alert.message}
        </div>

        {alert.type === 'wallet_not_installed' && (
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Install Freighter Wallet Extension</span>
            <ExternalLink className="w-3.5 h-3.5 text-black" />
          </a>
        )}

        <div className="flex items-center gap-3 pt-2">
          {onRetry && (
            <button
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="flex-1 py-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Action</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs"
          >
            Dismiss Alert
          </button>
        </div>
      </motion.div>
    </div>
  );
};
