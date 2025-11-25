import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Plus, Check, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Activity, RecoveryStrategy, ImpactLevel, RecoveryTimeObjective } from '../types';

interface RecoveryStrategiesProps {
  activities: Activity[];
  strategies: RecoveryStrategy[];
  onSave: (strategy: RecoveryStrategy) => void;
  onDelete: (id: string) => void;
}

export const RecoveryStrategies: React.FC<RecoveryStrategiesProps> = ({ activities, strategies, onSave, onDelete }) => {
  // Only show high/critical priority activities for strategy planning usually, but showing all is fine
  const prioritizedActivities = activities.sort((a, b) => {
    const priorities = { [ImpactLevel.CRITICAL]: 4, [ImpactLevel.HIGH]: 3, [ImpactLevel.MEDIUM]: 2, [ImpactLevel.LOW]: 1, [ImpactLevel.NEGLIGIBLE]: 0, [ImpactLevel.CATASTROPHIC]: 5 };
    return priorities[b.priority] - priorities[a.priority];
  });

  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const [newStrat, setNewStrat] = useState<Partial<RecoveryStrategy>>({
    name: '',
    description: '',
    cost: 'Medium',
    feasibility: 'Medium',
    rtoAchievable: RecoveryTimeObjective.RTO_24H
  });

  const [editingStratId, setEditingStratId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
    // Reset edit state when switching activities
    if (expandedActivityId !== id) {
      setEditingStratId(null);
      setNewStrat({ name: '', description: '', cost: 'Medium', feasibility: 'Medium', rtoAchievable: RecoveryTimeObjective.RTO_24H });
    }
  };

  const handleSaveStrategy = (activityId: string) => {
    if (newStrat.name) {
      onSave({
        id: editingStratId || crypto.randomUUID(),
        activityId,
        name: newStrat.name,
        description: newStrat.description || '',
        cost: newStrat.cost as any,
        feasibility: newStrat.feasibility as any,
        rtoAchievable: newStrat.rtoAchievable as any,
        isSelected: false // Reset selection on edit? Maybe keep it. Let's keep it simple for now.
      });
      setNewStrat({ name: '', description: '', cost: 'Medium', feasibility: 'Medium', rtoAchievable: RecoveryTimeObjective.RTO_24H });
      setEditingStratId(null);
    }
  };

  const handleEditClick = (e: React.MouseEvent, strat: RecoveryStrategy) => {
    e.stopPropagation();
    setEditingStratId(strat.id);
    setNewStrat(strat);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this strategy?')) {
      onDelete(id);
      if (editingStratId === id) {
        setEditingStratId(null);
        setNewStrat({ name: '', description: '', cost: 'Medium', feasibility: 'Medium', rtoAchievable: RecoveryTimeObjective.RTO_24H });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingStratId(null);
    setNewStrat({ name: '', description: '', cost: 'Medium', feasibility: 'Medium', rtoAchievable: RecoveryTimeObjective.RTO_24H });
  };

  const selectStrategy = (stratId: string, activityId: string) => {
    strategies.forEach(s => {
      if (s.activityId === activityId) {
        const newIsSelected = s.id === stratId;
        if (s.isSelected !== newIsSelected) {
          onSave({ ...s, isSelected: newIsSelected });
        }
      }
    });
  };

  const getStrategiesForActivity = (id: string) => strategies.filter(s => s.activityId === id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Recovery Strategies</h2>
        <p className="text-slate-500 mt-1">Define and select recovery options for critical activities (ISO 22301 Clause 8.3).</p>
      </div>

      <div className="space-y-4">
        {prioritizedActivities.map(activity => {
          const actStrategies = getStrategiesForActivity(activity.id);
          const isExpanded = expandedActivityId === activity.id;
          const selectedStrat = actStrategies.find(s => s.isSelected);

          return (
            <div key={activity.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div
                onClick={() => toggleExpand(activity.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-1 rounded-full ${activity.priority === ImpactLevel.CRITICAL ? 'bg-red-500' : activity.priority === ImpactLevel.HIGH ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{activity.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">RTO: {activity.rto}</span>
                      {selectedStrat ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Strategy Selected: {selectedStrat.name}
                        </span>
                      ) : (
                        <span className="text-orange-500">No strategy selected</span>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-6">

                  {/* Strategy List */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {actStrategies.map(strat => (
                      <div
                        key={strat.id}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all group ${strat.isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                          }`}
                        onClick={() => selectStrategy(strat.id, activity.id)}
                      >
                        {strat.isSelected && (
                          <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-1 rounded-full shadow-sm">
                            <Check className="h-4 w-4" />
                          </div>
                        )}

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={(e) => handleEditClick(e, strat)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, strat.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                        </div>

                        <h4 className="font-bold text-slate-800 pr-16">{strat.name}</h4>
                        <p className="text-sm text-slate-600 mt-1 mb-3">{strat.description}</p>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <div className="flex items-center gap-1 text-slate-500">
                            <DollarSign className="h-3 w-3" /> Cost: <span className="text-slate-700">{strat.cost}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Layers className="h-3 w-3" /> Feasibility: <span className="text-slate-700">{strat.feasibility}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="h-3 w-3" /> Est. RTO: <span className="text-slate-700">{strat.rtoAchievable}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add/Edit Form */}
                    <div className={`p-4 rounded-lg border border-dashed ${editingStratId ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 bg-slate-50'} flex flex-col gap-3`}>
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-slate-700">
                          {editingStratId ? 'Edit Strategy' : 'Add Recovery Option'}
                        </h4>
                        {editingStratId && (
                          <button onClick={handleCancelEdit} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                        )}
                      </div>
                      <input
                        className="text-sm px-3 py-2 rounded border border-slate-300"
                        placeholder="Strategy Name (e.g. Secondary Site)"
                        value={newStrat.name}
                        onChange={e => setNewStrat({ ...newStrat, name: e.target.value })}
                      />
                      <textarea
                        className="text-sm px-3 py-2 rounded border border-slate-300 h-20 resize-none"
                        placeholder="Description of the strategy..."
                        value={newStrat.description}
                        onChange={e => setNewStrat({ ...newStrat, description: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          className="text-sm px-2 py-2 rounded border border-slate-300 bg-white"
                          value={newStrat.cost}
                          onChange={e => setNewStrat({ ...newStrat, cost: e.target.value as any })}
                        >
                          <option value="Low">Cost: Low</option>
                          <option value="Medium">Cost: Medium</option>
                          <option value="High">Cost: High</option>
                        </select>
                        <select
                          className="text-sm px-2 py-2 rounded border border-slate-300 bg-white"
                          value={newStrat.feasibility}
                          onChange={e => setNewStrat({ ...newStrat, feasibility: e.target.value as any })}
                        >
                          <option value="Low">Feasibility: Low</option>
                          <option value="Medium">Feasibility: Medium</option>
                          <option value="High">Feasibility: High</option>
                        </select>
                      </div>
                      <button
                        onClick={() => handleSaveStrategy(activity.id)}
                        className={`mt-auto w-full py-2 text-white text-sm font-medium rounded transition-colors ${editingStratId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                      >
                        {editingStratId ? 'Update Option' : 'Add Option'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {prioritizedActivities.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No activities defined yet. Go to the Activities tab to create one.
          </div>
        )}
      </div>
    </div>
  );
};