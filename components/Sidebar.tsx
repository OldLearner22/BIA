import React from 'react';
import { Activity, Database, Settings, ShieldAlert, PieChart, Layers, FileText } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'activities', label: 'BIA Activities', icon: Activity },
    { id: 'resources', label: 'Resources', icon: Database },
    { id: 'risks', label: 'Risk Assessment', icon: ShieldAlert },
    { id: 'strategies', label: 'Recovery Strategies', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <FileText className="text-white h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg tracking-tight">BIA Manager</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ISO 22301</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-xs font-medium text-slate-400 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm text-emerald-400 font-semibold">Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};