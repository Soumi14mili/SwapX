import React from 'react';
import { Home, Zap, Layers, Code2, Activity, BarChart3, SendHorizonal } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'swap', label: 'Swap', icon: Zap },
    { id: 'send', label: 'Send', icon: SendHorizonal },
    { id: 'balance', label: 'Assets', icon: Layers },
    { id: 'events', label: 'Stream', icon: Activity },
    { id: 'dashboard', label: 'Dev', icon: BarChart3 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050507]/95 backdrop-blur-2xl border-t border-yellow-500/20 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-yellow-400 font-bold bg-yellow-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : 'text-slate-400'}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

