import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  AlertTriangle,
  Wallet,
  ArrowRight,
  Zap,
  Clock,
  Info
} from 'lucide-react';
import { WalletState, TransactionRecord, TransactionStatus } from '../types';
import { sendXlmPayment, truncateAddress } from '../services/stellarService';
import { SOROBAN_CONTRACT_ADDRESS } from '../data/sorobanCode';

interface SendXlmPanelProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onTransactionComplete: (record: TransactionRecord) => void;
  onAddEvent: (type: 'PAYMENT', title: string, details: string, hash?: string) => void;
}

const TX_STEPS = [
  { key: 'preparing', label: 'Preparing', desc: 'Building Stellar payment operation' },
  { key: 'signing',   label: 'Signing',   desc: 'Awaiting Freighter authorization' },
  { key: 'submitting',label: 'Submitting', desc: 'Broadcasting to Horizon Testnet' },
  { key: 'confirming',label: 'Confirming', desc: 'Waiting for ledger inclusion' },
];

function isValidStellarAddress(addr: string): boolean {
  return /^G[A-Z0-9]{55}$/.test(addr.trim());
}

export const SendXlmPanel: React.FC<SendXlmPanelProps> = ({
  wallet,
  onOpenWalletModal,
  onTransactionComplete,
  onAddEvent,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount]       = useState('');
  const [memo, setMemo]           = useState('');
  const [txStatus, setTxStatus]   = useState<TransactionStatus>('idle');
  const [lastTx, setLastTx]       = useState<TransactionRecord | null>(null);
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const recipientValid = isValidStellarAddress(recipient);
  const amountNum = parseFloat(amount);
  const amountValid = !isNaN(amountNum) && amountNum > 0;
  const hasEnough = wallet.balanceXlm >= (amountNum || 0) + 0.5; // keep 0.5 XLM reserve
  const canSubmit =
    wallet.isConnected &&
    recipientValid &&
    amountValid &&
    hasEnough &&
    txStatus === 'idle';

  const handleSend = async () => {
    if (!canSubmit || !wallet.publicKey) return;

    setTxStatus('preparing');
    setErrorMsg(null);
    setLastTx(null);

    onAddEvent('PAYMENT', 'Initiating XLM Payment', `Sending ${amountNum} XLM to ${truncateAddress(recipient)}...`);

    try {
      const result = await sendXlmPayment(
        wallet.publicKey,
        recipient.trim(),
        amountNum,
        memo.trim(),
        (step) => setTxStatus(step)
      );

      if (result.success) {
        const record: TransactionRecord = {
          id: `pay-${Date.now()}`,
          hash: result.hash,
          type: 'PAYMENT',
          fromToken: 'XLM',
          toToken: 'XLM',
          fromAmount: amountNum,
          toAmount: amountNum,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: 'SUCCESS',
          ledgerBlock: result.ledgerBlock,
          feePaidXlm: result.feePaidXlm,
          sorobanContractId: SOROBAN_CONTRACT_ADDRESS,
          explorerUrl: result.explorerUrl,
          recipientAddress: recipient.trim(),
        };

        setLastTx(record);
        setTxStatus('success');
        onTransactionComplete(record);
        onAddEvent(
          'PAYMENT',
          'XLM Payment Confirmed ✓',
          `Sent ${amountNum} XLM → ${truncateAddress(recipient)} · Hash: ${result.hash.slice(0, 12)}...`,
          result.hash
        );

        // Reset inputs after success
        setRecipient('');
        setAmount('');
        setMemo('');
      } else {
        throw new Error(result.errorMessage || 'Transaction failed on Stellar Testnet.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Payment failed. Check your balance or Freighter approval.';
      setErrorMsg(msg);
      setTxStatus('failed');
      onAddEvent('PAYMENT', 'XLM Payment Failed ✗', msg);
    }

    // Reset to idle after 6 seconds
    setTimeout(() => {
      setTxStatus('idle');
      setErrorMsg(null);
    }, 6000);
  };

  const handleCopyHash = () => {
    if (lastTx?.hash) {
      navigator.clipboard.writeText(lastTx.hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const isBusy = ['preparing', 'signing', 'submitting', 'confirming'].includes(txStatus);
  const currentStepIdx = TX_STEPS.findIndex(s => s.key === txStatus);

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Panel Header ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-yellow-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-1">
            <Send className="w-4 h-4" />
            <span>Stellar Testnet · Real XLM Payment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Send XLM
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Send native XLM to any Stellar Testnet address via the Horizon API.
            {wallet.isFreighterAvailable
              ? ' Transactions are signed by your Freighter wallet and submitted on-chain.'
              : ' Running in demo mode — install Freighter for real on-chain transactions.'}
          </p>
        </div>
      </div>

      {/* ── Wallet Not Connected ── */}
      {!wallet.isConnected && (
        <div className="glass-card rounded-3xl p-8 border border-yellow-500/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-lg font-bold font-display text-white">Connect Your Wallet First</h3>
          <p className="text-sm text-slate-400">
            You need to connect a Stellar Testnet wallet before sending XLM payments.
          </p>
          <button
            onClick={onOpenWalletModal}
            className="btn-neon px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-black inline-flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Freighter</span>
          </button>
        </div>
      )}

      {/* ── Send Form (when connected) ── */}
      {wallet.isConnected && (
        <>
          {/* Balance Info Strip */}
          <div className="flex items-center justify-between px-1">
            <div className="text-xs text-slate-400 font-mono">
              Available:{' '}
              <span className="text-yellow-400 font-bold">
                {wallet.balanceXlm.toLocaleString(undefined, { maximumFractionDigits: 4 })} XLM
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Info className="w-3.5 h-3.5" />
              <span>Minimum reserve: 0.5 XLM</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-yellow-500/20 space-y-5">

            {/* Recipient Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Recipient Address
              </label>
              <div className={`relative rounded-2xl border transition-all ${
                recipient && !recipientValid
                  ? 'border-rose-500/60 bg-rose-500/5'
                  : recipient && recipientValid
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-yellow-500/20 bg-black/50'
              }`}>
                <input
                  id="send-recipient"
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="G... (Stellar Testnet address)"
                  disabled={isBusy}
                  className="w-full bg-transparent px-4 py-3.5 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none rounded-2xl pr-10"
                />
                {recipient && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {recipientValid
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : <XCircle className="w-4 h-4 text-rose-400" />}
                  </div>
                )}
              </div>
              {recipient && !recipientValid && (
                <p className="text-xs text-rose-400 pl-1">
                  Must be a valid Stellar address starting with G (56 characters)
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Amount (XLM)
              </label>
              <div className={`relative rounded-2xl border transition-all ${
                amount && (!amountValid || !hasEnough)
                  ? 'border-rose-500/60 bg-rose-500/5'
                  : amount && amountValid && hasEnough
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-yellow-500/20 bg-black/50'
              }`}>
                <input
                  id="send-amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.0000001"
                  step="0.1"
                  disabled={isBusy}
                  className="w-full bg-transparent px-4 py-3.5 text-lg font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none rounded-2xl pr-20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <span className="text-sm font-bold text-yellow-400">XLM</span>
                  <button
                    onClick={() => setAmount((wallet.balanceXlm - 0.5).toFixed(4))}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-yellow-500/20 text-yellow-400 font-bold hover:bg-yellow-500/30 cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
              </div>
              {amount && !amountValid && (
                <p className="text-xs text-rose-400 pl-1">Please enter a valid amount greater than 0</p>
              )}
              {amount && amountValid && !hasEnough && (
                <p className="text-xs text-rose-400 pl-1">
                  Insufficient balance. You need at least {(amountNum + 0.5).toFixed(4)} XLM (including 0.5 XLM reserve).
                </p>
              )}
              {amount && amountValid && hasEnough && (
                <p className="text-xs text-slate-400 pl-1 font-mono">
                  ≈ ${(amountNum * 0.118).toFixed(4)} USD · Remaining after send:{' '}
                  <span className="text-yellow-400 font-bold">
                    {(wallet.balanceXlm - amountNum).toFixed(4)} XLM
                  </span>
                </p>
              )}
            </div>

            {/* Memo Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Memo <span className="text-slate-500 font-normal normal-case">(optional · max 28 chars)</span>
              </label>
              <input
                id="send-memo"
                type="text"
                value={memo}
                onChange={e => setMemo(e.target.value.slice(0, 28))}
                placeholder="e.g. Payment for services"
                disabled={isBusy}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-yellow-500/50 transition-all"
              />
              <div className="text-right text-[10px] text-slate-500 font-mono pr-1">
                {memo.length}/28
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="send-xlm-submit"
              onClick={handleSend}
              disabled={!canSubmit || isBusy}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                canSubmit && !isBusy
                  ? 'btn-neon text-black'
                  : 'bg-zinc-800 text-slate-500 border border-zinc-700 cursor-not-allowed'
              }`}
            >
              {isBusy ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send {amount ? `${amountNum} XLM` : 'XLM'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* ── Transaction Progress Stepper ── */}
          <AnimatePresence>
            {isBusy && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass-card rounded-3xl p-6 border border-yellow-500/30 neon-glow-yellow"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-display">Stellar Payment Pipeline</h4>
                    <p className="text-xs text-slate-400">Submitting real transaction to Horizon Testnet</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TX_STEPS.map((step, idx) => {
                    const isDone = idx < currentStepIdx || txStatus === 'success';
                    const isCurrent = step.key === txStatus;
                    return (
                      <div
                        key={step.key}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-yellow-500/20 border-yellow-400 text-white'
                            : isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            0{idx + 1}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </div>
                        <div className="text-xs font-bold">{step.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Success Banner ── */}
          <AnimatePresence>
            {txStatus === 'success' && lastTx && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white font-display">Payment Confirmed! 🎉</h4>
                      <p className="text-xs text-emerald-400 font-mono">
                        Transaction included in Ledger Block #{lastTx.ledgerBlock.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20">
                      <div className="text-slate-400 mb-0.5">Amount Sent</div>
                      <div className="font-bold text-white font-mono text-base">
                        {lastTx.fromAmount} XLM
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20">
                      <div className="text-slate-400 mb-0.5">Network Fee</div>
                      <div className="font-bold text-emerald-400 font-mono">{lastTx.feePaidXlm}</div>
                    </div>
                  </div>

                  {/* Tx Hash */}
                  <div className="p-3 rounded-2xl bg-black/60 border border-emerald-500/20">
                    <div className="text-xs text-slate-400 mb-1.5">Transaction Hash</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-emerald-300 truncate">
                        {lastTx.hash}
                      </span>
                      <button
                        onClick={handleCopyHash}
                        className="flex-shrink-0 p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 cursor-pointer"
                        title="Copy hash"
                      >
                        {copiedHash ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Explorer Link */}
                  {lastTx.explorerUrl && (
                    <a
                      href={lastTx.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-sm font-bold transition-all"
                    >
                      <span>View on Stellar Expert Explorer</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Failure Banner ── */}
          <AnimatePresence>
            {txStatus === 'failed' && errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="glass-card rounded-3xl p-6 border border-rose-500/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                      <XCircle className="w-7 h-7 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white font-display">Transaction Failed</h4>
                      <p className="text-xs text-rose-400 font-mono">Stellar Horizon Testnet rejected the payment</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-200 leading-relaxed font-mono">{errorMsg}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Common causes: insufficient balance, invalid recipient address, Freighter request rejected, or network error. 
                    Check your balance and try again.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};
