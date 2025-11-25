import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Risk, RiskCategory, Activity } from '../types';

interface RiskAssessmentProps {
  risks: Risk[];
  onSave: (risk: Risk) => void;
  onDelete: (id: string) => void;
  activities: Activity[];
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risks, onSave, onDelete, activities }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    description: '',
    category: RiskCategory.TECHNOLOGY,
    likelihood: 3,
    impact: 3,
    relatedActivityIds: [],
    existingControls: '',
    treatment: 'Mitigate'
  });

  const calculateRiskScore = (l: number, i: number) => l * i;

  const getRiskLevel = (score: number) => {
    if (score >= 15) return { label: 'Critical', color: 'bg-red-100 text-red-800 border-red-200' };
    if (score >= 10) return { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    if (score >= 5) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  const handleAdd = () => {
    if (newRisk.description && newRisk.category) {
      onSave({
        id: crypto.randomUUID(),
        description: newRisk.description,
        category: newRisk.category,
        likelihood: newRisk.likelihood as any,
        impact: newRisk.impact as any,
        relatedActivityIds: newRisk.relatedActivityIds || [],
        existingControls: newRisk.existingControls || '',
        treatment: newRisk.treatment as any
      } as Risk);
      setIsAdding(false);
      setNewRisk({
        description: '',
        category: RiskCategory.TECHNOLOGY,
        likelihood: 3,
        impact: 3,
        relatedActivityIds: [],
        existingControls: '',
        treatment: 'Mitigate'
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this risk?")) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Risk Assessment</h2>
          <p className="text-slate-500 mt-1">Identify and evaluate threats to business continuity (ISO 22301 Clause 8.2.3).</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Risk
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">New Risk Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Risk Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Ransomware attack on payroll server"
                  value={newRisk.description}
                  onChange={e => setNewRisk({ ...newRisk, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRisk.category}
                  onChange={e => setNewRisk({ ...newRisk, category: e.target.value as RiskCategory })}
                >
                  {Object.values(RiskCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Likelihood (1-5)</label>
                  <input
                    type="number" min="1" max="5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newRisk.likelihood}
                    onChange={e => setNewRisk({ ...newRisk, likelihood: parseInt(e.target.value) as any })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Impact (1-5)</label>
                  <input
                    type="number" min="1" max="5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newRisk.impact}
                    onChange={e => setNewRisk({ ...newRisk, impact: parseInt(e.target.value) as any })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Existing Controls</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="e.g., Daily backups, Antivirus installed"
                  value={newRisk.existingControls}
                  onChange={e => setNewRisk({ ...newRisk, existingControls: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Plan</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRisk.treatment}
                  onChange={e => setNewRisk({ ...newRisk, treatment: e.target.value as any })}
                >
                  <option value="Mitigate">Mitigate (Reduce)</option>
                  <option value="Accept">Accept</option>
                  <option value="Transfer">Transfer (Insurance)</option>
                  <option value="Avoid">Avoid</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">Save Risk</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Risk Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Score</th>
              <th className="px-6 py-4 text-center">Level</th>
              <th className="px-6 py-4">Controls & Treatment</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {risks.map((risk) => {
              const score = calculateRiskScore(risk.likelihood, risk.impact);
              const level = getRiskLevel(score);
              return (
                <tr key={risk.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{risk.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {risk.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-xs text-slate-500">
                      L:{risk.likelihood} × I:{risk.impact}
                    </div>
                    <div className="font-bold text-slate-900">{score}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${level.color}`}>
                      {level.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <p><span className="font-semibold text-slate-700">Controls:</span> {risk.existingControls}</p>
                      <p><span className="font-semibold text-slate-700">Treatment:</span> {risk.treatment}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(risk.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {risks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                  <ShieldAlert className="h-10 w-10 text-slate-300 mb-2" />
                  <p>No risks identified.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};