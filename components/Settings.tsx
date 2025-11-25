import React from 'react';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">BIA Configuration</h2>
        <p className="text-slate-500 mt-1">Configure standard parameters for the Business Continuity Management System.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">General Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
              <input type="text" defaultValue="Acme Corp" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Standard</label>
              <select disabled className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 text-sm">
                <option>ISO 22301:2019</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Review Cycle</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <div className="text-sm text-slate-700">Default Review Period</div>
               <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                 <option>Every 6 Months</option>
                 <option>Annually</option>
                 <option>Bi-Annually</option>
               </select>
            </div>
            <div className="flex items-center justify-between">
               <div className="text-sm text-slate-700">Automated Reminders</div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Risk Appetite</h3>
          <p className="text-sm text-slate-500 mb-4">Define the default threshold for critical impact alerts.</p>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
            <div className="bg-orange-500 h-2.5 rounded-full" style={{width: '70%'}}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
             <span>Conservative</span>
             <span>Aggressive</span>
          </div>
        </div>

        <div className="pt-4">
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Save className="h-4 w-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};