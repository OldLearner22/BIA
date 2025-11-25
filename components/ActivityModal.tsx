import React, { useState, useEffect } from 'react';
import { X, Wand2, Loader2, Save, AlertTriangle } from 'lucide-react';
import { Activity, ImpactLevel, RecoveryTimeObjective, RecoveryPointObjective, Resource } from '../types';
import { generateBIAAnalysis } from '../services/geminiService';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  initialActivity?: Activity | null;
  resources: Resource[];
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSave, initialActivity, resources }) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    department: '',
    description: '',
    priority: ImpactLevel.MEDIUM,
    rto: RecoveryTimeObjective.RTO_24H,
    rpo: RecoveryPointObjective.RPO_24H,
    mtpd: '48 Hours',
    resources: [],
    impacts: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (initialActivity) {
      setFormData(initialActivity);
    } else {
      // Reset form for new entry
      setFormData({
        name: '',
        department: '',
        description: '',
        priority: ImpactLevel.MEDIUM,
        rto: RecoveryTimeObjective.RTO_24H,
        rpo: RecoveryPointObjective.RPO_24H,
        mtpd: '48 Hours',
        resources: [],
        impacts: []
      });
    }
  }, [initialActivity, isOpen]);

  const handleGenerateAI = async () => {
    if (!formData.name || !formData.department) {
      setAiError("Please enter Activity Name and Department first.");
      return;
    }
    setAiError(null);
    setIsGenerating(true);

    try {
      const result = await generateBIAAnalysis(formData.name, formData.department);
      if (result) {
        setFormData(prev => ({
          ...prev,
          description: result.suggestedDescription,
          rto: result.suggestedRTO,
          rpo: result.suggestedRPO,
          // We append the narrative to description for now, or could have a separate field
          mtpd: result.suggestedRTO === RecoveryTimeObjective.RTO_4H ? '8 Hours' : '1 Week', // Simple heuristic for demo
        }));
      }
    } catch (e) {
      setAiError("Failed to generate analysis. Please check API key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (formData.name && formData.department) {
      onSave({
        id: initialActivity?.id || crypto.randomUUID(),
        ...formData
      } as Activity);
      onClose();
    }
  };

  const toggleResource = (resId: string) => {
    const current = formData.resources || [];
    if (current.includes(resId)) {
      setFormData({ ...formData, resources: current.filter(id => id !== resId) });
    } else {
      setFormData({ ...formData, resources: [...current, resId] });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialActivity ? 'Edit Activity' : 'New Business Activity'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* AI Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start justify-between">
            <div className="flex gap-3">
              <Wand2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">AI Assistant Available</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Enter the activity name and department, then click "Auto-Analyze" to generate ISO 22301 compliant suggestions.
                </p>
                {aiError && <p className="text-xs text-red-600 mt-2 font-medium">{aiError}</p>}
              </div>
            </div>
            <button 
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
              Auto-Analyze
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Payroll Processing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input 
                  type="text" 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Human Resources"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Impact / Priority</label>
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as ImpactLevel})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {Object.values(ImpactLevel).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">MTPD (Max Tolerable Disruption)</label>
                <input 
                  type="text" 
                  value={formData.mtpd}
                  onChange={(e) => setFormData({...formData, mtpd: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description & Business Impact</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Describe the activity and the consequences of failure..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Recovery Time Objective (RTO)
              </label>
              <select 
                value={formData.rto}
                onChange={(e) => setFormData({...formData, rto: e.target.value as RecoveryTimeObjective})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                {Object.values(RecoveryTimeObjective).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <p className="text-xs text-slate-500 mt-1">Target time to resume activity.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Recovery Point Objective (RPO)
              </label>
              <select 
                value={formData.rpo}
                onChange={(e) => setFormData({...formData, rpo: e.target.value as RecoveryPointObjective})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                {Object.values(RecoveryPointObjective).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <p className="text-xs text-slate-500 mt-1">Max data loss tolerance.</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Dependent Resources</h3>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2">
              {resources.map(res => (
                <label key={res.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.resources?.includes(res.id)}
                    onChange={() => toggleResource(res.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">{res.name}</span>
                    <span className="text-xs text-slate-400 ml-1">({res.type})</span>
                  </div>
                </label>
              ))}
              {resources.length === 0 && <p className="text-xs text-slate-400 p-2">No resources defined. Go to Resources tab to add.</p>}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <Save className="h-4 w-4" />
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
};