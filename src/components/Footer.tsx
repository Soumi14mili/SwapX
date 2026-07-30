import React from 'react';
import { Zap, Github, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, setActiveTab }) => {
  return (
    <footer className="border-t border-yellow-500/20 bg-[#040406] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-500 p-[1px]">
                <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                </div>
              </div>
              <span className="font-display text-xl font-black text-white tracking-wider">
                Swap<span className="text-gradient-gold">X</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-fast, production-ready Web3 Token Swap Interface powered by Stellar Blockchain & Soroban WASM Smart Contracts.
            </p>

            <div className="text-[10px] text-yellow-400 font-mono">
              Stellar Testnet Protocol 20
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-400 font-display">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-yellow-400 transition-colors cursor-pointer">
                  Landing Page
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('swap')} className="hover:text-yellow-400 transition-colors cursor-pointer">
                  Swap DEX
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('balance')} className="hover:text-yellow-400 transition-colors cursor-pointer">
                  Asset Balances
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contract')} className="hover:text-yellow-400 transition-colors cursor-pointer">
                  Soroban Contract
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} className="hover:text-yellow-400 transition-colors cursor-pointer">
                  Live Event Stream
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 transition-colors cursor-pointer">
                  Developer Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Ecosystem Resources */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-400 font-display">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenDocs} className="hover:text-yellow-400 transition-colors cursor-pointer">
                  Soroban Documentation
                </button>
              </li>
              <li>
                <a
                  href="https://stellar.expert/explorer/testnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Stellar Expert Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Freighter Wallet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://soroban.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Soroban Smart Contracts</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Github & Open Source */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-400 font-display">Source Code</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open source under Apache-2.0 license. Built for Stellar Hackathon.
            </p>

            <a
              href="https://github.com/stellar/soroban-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-yellow-500/30 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <Github className="w-4 h-4 text-yellow-400" />
              <span>Public Repository</span>
            </a>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-8 border-t border-yellow-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © 2026 SwapX DEX Protocol. All rights reserved.
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>on Stellar Blockchain</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

