import React, { useState } from 'react';
import { Plus, Search, FileText, AlertCircle } from 'lucide-react';
import { Activity, ImpactLevel, Resource } from '../types';
import { ActivityModal } from './ActivityModal';
import { ImpactChart } from './ImpactChart';

interface ActivityListProps {
  activities: Activity[];
  onSave: (activity: Activity) => void;
  onDelete: (id: string) => void;
  resources: Resource[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onSave, onDelete, resources }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [search, setSearch] = useState('');

  const handleSave = (activity: Activity) => {
    onSave(activity);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      onDelete(id);
    }
  };

  const filteredActivities = activities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.department.toLowerCase().includes(search.toLowerCase())
  );

  const getPriorityBadge = (level: ImpactLevel) => {
    switch (level) {
      case ImpactLevel.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case ImpactLevel.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case ImpactLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats / Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Criticality Distribution</h2>
          <ImpactChart activities={activities} />
        </div>
        <div className="md:w-72 bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-50 mb-1">Total Activities</h2>
            <span className="text-4xl font-bold tracking-tight">{activities.length}</span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-blue-200 mb-1">Critical Functions</p>
            <div className="w-full bg-blue-900/50 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${(activities.filter(a => a.priority === ImpactLevel.CRITICAL).length / (activities.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search activities or departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <button
          onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}
          className="w-full md:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Activity Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">RTO</th>
              <th className="px-6 py-4">Resources</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{activity.name}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]">{activity.description}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{activity.department}</td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{activity.rto}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <FileText className="h-3 w-3" />
                    {activity.resources.length} linked
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(activity.priority)}`}>
                    {activity.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(activity)} className="text-slate-400 hover:text-blue-600 font-medium mr-3 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(activity.id)} className="text-slate-400 hover:text-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                  <AlertCircle className="h-10 w-10 text-slate-300 mb-2" />
                  <p>No activities found.</p>
                  <p className="text-xs mt-1">Create a new activity to get started.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialActivity={editingActivity}
        resources={resources}
      />
    </div>
  );
};