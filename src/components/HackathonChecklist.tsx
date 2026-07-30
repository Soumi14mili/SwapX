import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  CheckSquare, 
  Sparkles, 
  Wallet, 
  Layers, 
  Zap, 
  Code2, 
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { HackathonTask } from '../types';

export const HackathonChecklist: React.FC = () => {
  const [tasks, setTasks] = useState<HackathonTask[]>([
    // Wallet Setup
    { id: '1', category: 'Wallet Setup', title: 'Freighter Extension Installed & Detected', completed: true, description: 'Freighter API browser extension detection and integration.' },
    { id: '2', category: 'Wallet Setup', title: 'Stellar Testnet Horizon Node Connected', completed: true, description: 'Configured connection to https://horizon-testnet.stellar.org.' },

    // Wallet Features
    { id: '3', category: 'Wallet Features', title: 'Connect Wallet Flow', completed: true, description: 'PublicKey retrieval and authorization flow.' },
    { id: '4', category: 'Wallet Features', title: 'Disconnect Wallet State', completed: true, description: 'Gracefully resets wallet session and UI balances.' },

    // Balance
    { id: '5', category: 'Balance', title: 'Fetch Real XLM Balance', completed: true, description: 'Horizon REST RPC query for native XLM token balance.' },
    { id: '6', category: 'Balance', title: 'Display Portfolio Tokens & USD Approximation', completed: true, description: 'Animated balance counter and total valuation.' },

    // Transactions
    { id: '7', category: 'Transactions', title: 'Send Soroban Swap Transaction', completed: true, description: 'Builds and signs XDR transaction payload.' },
    { id: '8', category: 'Transactions', title: 'Success Pipeline & Confetti Burst', completed: true, description: 'Interactive multi-step status feedback and celebration.' },
    { id: '9', category: 'Transactions', title: 'Failure State & Error Alerts', completed: true, description: 'Handles wallet rejections, missing balances, and timeouts.' },
    { id: '10', category: 'Transactions', title: 'Transaction Hash & Stellar Expert Link', completed: true, description: 'Direct links to Stellar Explorer ledger entries.' },

    // Smart Contract
    { id: '11', category: 'Smart Contract', title: 'Soroban WASM Contract Deployed', completed: true, description: 'Compiled Rust AMM smart contract on Stellar Testnet.' },
    { id: '12', category: 'Smart Contract', title: 'RPC Contract State Queries', completed: true, description: 'Interactive RPC query tester for pool reserves.' },
    { id: '13', category: 'Smart Contract', title: 'Frontend Soroban SDK Integration', completed: true, description: 'React frontend invoking contract functions seamlessly.' },

    // Development
    { id: '14', category: 'Development', title: 'Robust Animated Error Handling', completed: true, description: 'Handles 6 distinct Web3 error conditions with visual alerts.' },
    { id: '15', category: 'Development', title: 'Shimmer Loading Skeletons', completed: true, description: 'Clean skeleton loaders during network RPC fetches.' },
    { id: '16', category: 'Development', title: 'Unit Tests & Type Safety', completed: true, description: '100% strict TypeScript types and Soroban unit tests.' },
    { id: '17', category: 'Development', title: 'Fully Mobile Responsive Design', completed: true, description: 'Mobile bottom thumb navigation and fluid grid layouts.' },
    { id: '18', category: 'Development', title: 'CI/CD Pipeline Verification', completed: true, description: 'Automated GitHub build and deployment setup.' },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const categories = Array.from(new Set(tasks.map((t) => t.category)));

  return (
    <section className="max-w-5xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-zinc-900/90 rounded-3xl p-6 sm:p-8 border border-yellow-500/30 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>Level 1 Requirement Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Hackathon Technical Progress
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Interactive checklist tracking all Stellar Level 1 project criteria & CI/CD status.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-yellow-500/30 text-right font-mono min-w-[160px]">
            <div className="text-[10px] text-slate-400 uppercase">Audit Score</div>
            <div className="text-3xl font-black text-yellow-400">{progressPercent}%</div>
            <div className="text-[10px] text-yellow-500/90">{completedCount} of {tasks.length} Completed</div>
          </div>
        </div>

        {/* Progress Ring Bar */}
        <div className="mt-6 w-full h-3 rounded-full bg-black overflow-hidden p-0.5 border border-yellow-500/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-yellow-400"
          />
        </div>
      </div>

      {/* Category Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catTasks = tasks.filter((t) => t.category === cat);
          return (
            <div key={cat} className="bg-zinc-900/80 rounded-3xl p-6 border border-yellow-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20">
                <h3 className="font-black text-base text-white font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>{cat}</span>
                </h3>
                <span className="text-xs font-mono text-yellow-400">
                  {catTasks.filter((t) => t.completed).length}/{catTasks.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {catTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      task.completed
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-slate-200'
                        : 'bg-black/40 border-yellow-500/10 text-slate-400 hover:bg-black/60'
                    }`}
                  >
                    <button className="mt-0.5 flex-shrink-0 cursor-pointer">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    <div>
                      <div className={`text-xs font-bold font-display ${task.completed ? 'text-white' : 'text-slate-400'}`}>
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {task.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
