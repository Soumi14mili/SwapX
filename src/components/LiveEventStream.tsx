import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Zap, 
  Wallet, 
  Code2, 
  Layers, 
  Filter, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { ContractEvent } from '../types';

interface LiveEventStreamProps {
  events: ContractEvent[];
  onClearEvents: () => void;
}

export const LiveEventStream: React.FC<LiveEventStreamProps> = ({
  events,
  onClearEvents,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEvents = events.filter((e) => {
    if (filterType === 'ALL') return true;
    return e.type === filterType;
  });

  const getEventBadgeClass = (type: ContractEvent['type']) => {
    switch (type) {
      case 'SWAP':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'WALLET':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'CONTRACT':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'FAUCET':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getEventIcon = (type: ContractEvent['type']) => {
    switch (type) {
      case 'SWAP':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'WALLET':
        return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'CONTRACT':
        return <Code2 className="w-4 h-4 text-purple-400" />;
      case 'FAUCET':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Event Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <Activity className="w-4 h-4" />
              <span>Real-time On-Chain Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Soroban Live Event Stream
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Streaming real-time ledger execution logs and Soroban event subscriptions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Streaming RPC</span>
            </span>

            <button
              onClick={onClearEvents}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-white transition-all"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Event Filter Chips */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {['ALL', 'SWAP', 'WALLET', 'CONTRACT', 'FAUCET'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all ${
                filterType === type
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="glass-card rounded-3xl p-6 border border-white/15">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <Activity className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No events found in stream</p>
            <p className="text-xs text-slate-500">Events will populate automatically when swaps or wallet actions occur.</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            <AnimatePresence>
              {filteredEvents.map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#0D1224] border-2 border-cyan-400 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] group-hover:bg-white/10 border border-white/10 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEventIcon(evt.type)}
                        <span className="font-bold text-white text-sm font-display">{evt.title}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getEventBadgeClass(evt.type)}`}>
                          {evt.type}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">{evt.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 font-mono leading-relaxed">{evt.details}</p>

                    {evt.hash && (
                      <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span>TX Hash:</span>
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${evt.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 truncate"
                        >
                          <span>{evt.hash}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
