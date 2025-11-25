import React, { useState } from 'react';
import { Activity, Risk, RecoveryStrategy, ImpactLevel } from '../types';
import { PieChart, BarChart2, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { ImpactChart } from './ImpactChart';

interface DashboardProps {
  activities: Activity[];
  risks: Risk[];
  strategies: RecoveryStrategy[];
}

export const Dashboard: React.FC<DashboardProps> = ({ activities, risks, strategies }) => {
  const [showReport, setShowReport] = useState(false);

  const criticalCount = activities.filter(a => a.priority === ImpactLevel.CRITICAL).length;
  const highRiskCount = risks.filter(r => (r.likelihood * r.impact) >= 10).length;
  const coveredActivities = new Set(strategies.filter(s => s.isSelected).map(s => s.activityId)).size;
  const coveragePercent = activities.length > 0 ? Math.round((coveredActivities / activities.length) * 100) : 0;

  // Risk Heatmap Data
  const heatmap = Array(5).fill(0).map(() => Array(5).fill(0));
  risks.forEach(r => {
    heatmap[5 - r.impact][r.likelihood - 1]++;
  });

  if (showReport) {
    return (
      <div className="bg-white min-h-screen p-8 max-w-4xl mx-auto shadow-2xl">
        <div className="flex justify-between items-start mb-8 border-b border-slate-900 pb-6">
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Business Continuity Report</h1>
             <p className="text-slate-500 mt-1">ISO 22301 Compliance Summary</p>
          </div>
          <div className="text-right">
             <p className="text-sm text-slate-500">Generated on</p>
             <p className="font-medium">{new Date().toLocaleDateString()}</p>
             <button onClick={() => setShowReport(false)} className="mt-4 text-xs text-blue-600 hover:underline print:hidden">Back to Dashboard</button>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-200 pb-1">1. Executive Summary</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
             <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center">
               <div className="text-2xl font-bold text-slate-900">{activities.length}</div>
               <div className="text-xs text-slate-500 uppercase">Total Activities</div>
             </div>
             <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center">
               <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
               <div className="text-xs text-slate-500 uppercase">Critical Risks</div>
             </div>
             <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center">
               <div className="text-2xl font-bold text-blue-600">{coveragePercent}%</div>
               <div className="text-xs text-slate-500 uppercase">Strategy Coverage</div>
             </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            This report summarizes the organization's Business Impact Assessment (BIA) and Risk Assessment findings. 
            Currently, {criticalCount} activities are identified as Critical. Recovery strategies have been defined for {coveredActivities} out of {activities.length} business activities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-200 pb-1">2. Critical Activities & Strategies</h2>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700">
               <tr>
                 <th className="p-2">Activity</th>
                 <th className="p-2">RTO</th>
                 <th className="p-2">Selected Strategy</th>
                 <th className="p-2">Est. Recovery Time</th>
               </tr>
            </thead>
            <tbody>
               {activities.filter(a => a.priority === ImpactLevel.CRITICAL || a.priority === ImpactLevel.HIGH).map(act => {
                 const strat = strategies.find(s => s.activityId === act.id && s.isSelected);
                 return (
                   <tr key={act.id} className="border-b border-slate-100">
                      <td className="p-2 font-medium">{act.name}</td>
                      <td className="p-2">{act.rto}</td>
                      <td className="p-2 text-slate-600">{strat ? strat.name : <span className="text-red-500 italic">None selected</span>}</td>
                      <td className="p-2">{strat ? strat.rtoAchievable : '-'}</td>
                   </tr>
                 );
               })}
            </tbody>
          </table>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-200 pb-1">3. Risk Register Highlights</h2>
          <ul className="space-y-2 text-sm">
            {risks.filter(r => r.likelihood * r.impact >= 10).map(r => (
              <li key={r.id} className="flex items-start gap-2">
                 <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                 <span className="text-slate-700"><span className="font-semibold">{r.category}:</span> {r.description} (Score: {r.likelihood * r.impact})</span>
              </li>
            ))}
            {risks.length === 0 && <li className="text-slate-500 italic">No risks recorded.</li>}
          </ul>
        </section>

        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
           <p className="text-xs text-slate-400">End of Report - Confidential</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Executive Dashboard</h2>
          <p className="text-slate-500 mt-1">Overview of BCM program status and health.</p>
        </div>
        <button 
          onClick={() => setShowReport(true)}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <FileText className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><PieChart className="h-5 w-5" /></div>
             <span className="text-sm font-medium text-slate-600">BIA Completion</span>
           </div>
           <div className="text-2xl font-bold text-slate-900">{activities.length > 0 ? '100%' : '0%'}</div>
           <p className="text-xs text-slate-500 mt-1">{activities.length} Activities Analyzed</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle className="h-5 w-5" /></div>
             <span className="text-sm font-medium text-slate-600">Critical Risks</span>
           </div>
           <div className="text-2xl font-bold text-slate-900">{highRiskCount}</div>
           <p className="text-xs text-slate-500 mt-1">Requires Mitigation</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle className="h-5 w-5" /></div>
             <span className="text-sm font-medium text-slate-600">Strategy Coverage</span>
           </div>
           <div className="text-2xl font-bold text-slate-900">{coveragePercent}%</div>
           <p className="text-xs text-slate-500 mt-1">Activities with Plans</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Download className="h-5 w-5" /></div>
             <span className="text-sm font-medium text-slate-600">Last Audit</span>
           </div>
           <div className="text-xl font-bold text-slate-900">Pending</div>
           <p className="text-xs text-slate-500 mt-1">Review due in 30 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Heatmap */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Risk Heatmap</h3>
          <div className="flex">
            {/* Y Axis Label */}
            <div className="flex flex-col justify-center mr-4">
               <span className="text-xs font-bold text-slate-400 -rotate-90 whitespace-nowrap">IMPACT</span>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-rows-5 gap-1 mb-2">
                {heatmap.map((row, yIndex) => (
                  <div key={yIndex} className="grid grid-cols-5 gap-1 h-12">
                    {row.map((count, xIndex) => {
                       // Coloring logic: Top Right is Red, Bottom Left Green
                       const impact = 5 - yIndex;
                       const likelihood = xIndex + 1;
                       const score = impact * likelihood;
                       
                       let colorClass = 'bg-green-100';
                       if (score >= 15) colorClass = 'bg-red-200';
                       else if (score >= 10) colorClass = 'bg-orange-200';
                       else if (score >= 5) colorClass = 'bg-yellow-100';

                       return (
                         <div key={xIndex} className={`${colorClass} rounded flex items-center justify-center text-sm font-bold text-slate-700 border border-white hover:brightness-95 transition-all relative group`}>
                            {count > 0 && count}
                            {count > 0 && (
                              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                {count} Risks (Imp: {impact}, Lik: {likelihood})
                              </div>
                            )}
                         </div>
                       );
                    })}
                  </div>
                ))}
              </div>
              {/* X Axis Label */}
               <div className="text-center">
                 <span className="text-xs font-bold text-slate-400">LIKELIHOOD</span>
               </div>
            </div>
          </div>
        </div>

        {/* Activity Criticality (Reused) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <h3 className="font-semibold text-slate-800 mb-4">Impact Distribution</h3>
           <div className="flex-1 min-h-[200px]">
             <ImpactChart activities={activities} />
           </div>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-300 rounded-xl p-6 flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-lg">ISO 22301 Readiness</h3>
          <p className="text-sm mt-1 text-slate-400">Based on current data population and configuration.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-400">
            {Math.min(100, Math.round(((activities.length > 0 ? 40 : 0) + (risks.length > 0 ? 30 : 0) + (strategies.some(s => s.isSelected) ? 30 : 0))))}%
          </div>
          <div className="text-xs uppercase font-semibold tracking-wider">Completion Score</div>
        </div>
      </div>
    </div>
  );
};