import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Wallet, 
  ChevronDown, 
  Menu, 
  X, 
  CheckCircle2, 
  LogOut, 
  Code2, 
  BookOpen, 
  Activity, 
  Github,
  Layers,
  BarChart3,
  Globe2,
  Wifi,
  BatteryCharging,
  Signal,
  Sparkles,
  SendHorizonal
} from 'lucide-react';
import { WalletState } from '../types';
import { truncateAddress } from '../services/stellarService';

interface NavbarProps {
  wallet: WalletState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onOpenDocsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  activeTab,
  setActiveTab,
  onOpenWalletModal,
  onDisconnectWallet,
  onOpenDocsModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41');
  const [islandExpanded, setIslandExpanded] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Globe2 },
    { id: 'swap', label: 'Swap', icon: Zap },
    { id: 'send', label: 'Send XLM', icon: SendHorizonal },
    { id: 'balance', label: 'Assets', icon: Layers },
    { id: 'contract', label: 'Soroban', icon: Code2 },
    { id: 'events', label: 'Events', icon: Activity },
    { id: 'dashboard', label: 'Dev Deck', icon: BarChart3 },
    { id: 'checklist', label: 'Audit', icon: CheckCircle2 },
  ];

  const currentTabObj = navItems.find(item => item.id === activeTab) || navItems[1];

  return (
    <header className="sticky top-0 z-50 w-full pt-2 pb-2 px-3 sm:px-6">
      
      {/* iPhone Top Status Bar Strip */}
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 px-4 mb-1.5 selection:bg-none">
        {/* iOS Clock */}
        <div className="flex items-center gap-1.5 text-yellow-400">
          <span className="font-sans font-black tracking-tight">{currentTime}</span>
          <span className="text-[9px] px-1.5 py-0.2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full font-sans uppercase">iOS 20</span>
        </div>

        {/* Dynamic Island Capsule Component */}
        <motion.div 
          onClick={() => setIslandExpanded(!islandExpanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer bg-black/90 hover:bg-black border border-yellow-500/30 rounded-full px-3.5 py-1 flex items-center gap-2.5 shadow-xl shadow-yellow-500/5 backdrop-blur-2xl transition-all"
        >
          {/* Camera / Sensor Pill Graphic */}
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
          <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-200">
            <span className="text-yellow-400 font-mono">Dynamic Island:</span>
            <span className="capitalize text-white">{currentTabObj.label} Mode</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </motion.div>

        {/* iOS Cellular, Wi-Fi & Battery Indicators */}
        <div className="hidden sm:flex items-center gap-2.5 text-slate-400">
          <Signal className="w-3.5 h-3.5 text-yellow-400" />
          <Wifi className="w-3.5 h-3.5 text-yellow-400" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-300">100%</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Expanded Dynamic Island Drawer Banner */}
      <AnimatePresence>
        {islandExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="max-w-xl mx-auto mb-3 bg-zinc-950/95 border border-yellow-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-3xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-yellow-500/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Dynamic Island System Control</span>
              </div>
              <button 
                onClick={() => setIslandExpanded(false)}
                className="p-1 rounded-lg bg-zinc-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-yellow-500/20">
                <div className="text-[10px] text-slate-400 uppercase">Network</div>
                <div className="font-bold text-yellow-400 font-mono mt-0.5">Stellar Testnet</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-yellow-500/20">
                <div className="text-[10px] text-slate-400 uppercase">WASM Engine</div>
                <div className="font-bold text-white font-mono mt-0.5">Soroban v20</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-yellow-500/20 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase">Status</div>
                <div className="font-bold text-emerald-400 font-mono mt-0.5">100% Operational</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating iPhone Glass Capsule Navigation Island Bar */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-950/85 border border-yellow-500/30 rounded-full px-3 py-2 shadow-2xl shadow-yellow-500/10 backdrop-blur-3xl flex items-center justify-between">
          
          {/* iOS App Brand Button */}
          <div 
            className="flex items-center gap-3 group cursor-pointer select-none pl-2" 
            onClick={() => setActiveTab('landing')}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-600 p-[1px] shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div>
              <span className="font-display text-lg font-black tracking-wider text-white group-hover:text-yellow-400 transition-colors">
                Swap<span className="text-gradient-gold">X</span>
              </span>
            </div>
          </div>

          {/* Desktop iOS Segmented Tab Bar Pill */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/70 p-1 rounded-full border border-yellow-500/20 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-300 relative cursor-pointer select-none ${
                    isActive
                      ? 'text-black'
                      : 'text-slate-300 hover:text-white hover:bg-yellow-500/10'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="iosActivePill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 shadow-lg shadow-yellow-500/30"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 z-10 ${isActive ? 'text-black fill-black/20' : 'text-yellow-400'}`} />
                  <span className="z-10 text-[11px] uppercase tracking-wider">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 pr-1">
            {/* Quick Link Buttons */}
            <button
              onClick={onOpenDocsModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-200 bg-zinc-900/90 hover:bg-zinc-800 border border-yellow-500/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
              <span>Docs</span>
            </button>

            <a
              href="https://github.com/stellar/soroban-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-200 bg-zinc-900/90 hover:bg-zinc-800 border border-yellow-500/20 transition-all cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 text-yellow-400" />
              <span>GitHub</span>
            </a>

            {/* Wallet Button / iOS User Control */}
            {!wallet.isConnected ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenWalletModal}
                className="btn-neon px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider text-black flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
              >
                <Wallet className="w-3.5 h-3.5 text-black" />
                <span>Connect</span>
              </motion.button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-yellow-500/30 text-white transition-all cursor-pointer shadow-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center text-[10px] font-black text-black">
                    XL
                  </div>
                  <span className="text-xs font-bold font-mono text-yellow-400 hidden sm:inline">
                    {truncateAddress(wallet.publicKey)}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl bg-zinc-950/95 backdrop-blur-2xl p-3 shadow-2xl border border-yellow-500/30 z-50">
                    <div className="px-3 py-2 border-b border-yellow-500/20 mb-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Connected Wallet</div>
                      <div className="text-xs font-mono font-bold text-yellow-400 truncate mt-0.5">
                        {wallet.publicKey}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                        <span className="text-[10px] text-yellow-400 font-bold">Stellar Testnet Connected</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('balance');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold text-slate-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all text-left cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-yellow-400" />
                      <span>View Testnet Assets</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold text-slate-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all text-left cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-amber-400" />
                      <span>Developer Dashboard</span>
                    </button>

                    <div className="my-1.5 border-t border-yellow-500/20" />

                    <button
                      onClick={() => {
                        onDisconnectWallet();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-zinc-900 border border-yellow-500/30 text-yellow-400 cursor-pointer ml-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* iOS Mobile Action Sheet Menu Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="lg:hidden mt-3 max-w-lg mx-auto bg-zinc-950/95 backdrop-blur-3xl border border-yellow-500/30 rounded-3xl p-5 shadow-2xl space-y-3"
        >
          {/* iOS Grab Bar Indicator */}
          <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-2" />

          <div className="text-[10px] font-black uppercase tracking-widest text-yellow-400 text-center mb-2">
            iPhone Navigation Menu
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                      : 'bg-zinc-900/80 text-slate-300 border border-yellow-500/10 hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-yellow-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-yellow-500/20 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                onOpenDocsModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-yellow-400 font-bold cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Soroban WASM Docs</span>
            </button>
          </div>
        </motion.div>
      )}

    </header>
  );
};

