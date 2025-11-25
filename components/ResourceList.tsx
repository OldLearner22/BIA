import React, { useState } from 'react';
import { Plus, Server, Users, Building, HardDrive, Trash2, X } from 'lucide-react';
import { Resource } from '../types';

interface ResourceListProps {
  resources: Resource[];
  onSave: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources, onSave, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    name: '',
    type: 'IT System',
    description: ''
  });

  const handleAdd = () => {
    if (newResource.name && newResource.type) {
      onSave({
        id: crypto.randomUUID(),
        name: newResource.name,
        type: newResource.type as any,
        description: newResource.description || ''
      });
      setIsAdding(false);
      setNewResource({ name: '', type: 'IT System', description: '' });
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'People': return Users;
      case 'Facility': return Building;
      case 'IT System': return Server;
      default: return HardDrive;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resources Inventory</h2>
          <p className="text-slate-500 mt-1">Manage assets, systems, and personnel required for continuity.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-slate-800">New Resource</h3>
            <button onClick={() => setIsAdding(false)}><X className="h-5 w-5 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Resource Name (e.g., SAP ERP)"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newResource.name}
              onChange={e => setNewResource({ ...newResource, name: e.target.value })}
            />
            <select
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={newResource.type}
              onChange={e => setNewResource({ ...newResource, type: e.target.value as any })}
            >
              <option value="IT System">IT System</option>
              <option value="People">People</option>
              <option value="Facility">Facility</option>
              <option value="Equipment">Equipment</option>
              <option value="Vendor">Vendor</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newResource.description}
              onChange={e => setNewResource({ ...newResource, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Confirm Add
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => {
          const Icon = getIcon(resource.type);
          return (
            <div key={resource.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(resource.id)} className="text-slate-300 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-lg ${resource.type === 'IT System' ? 'bg-purple-100 text-purple-600' :
                    resource.type === 'People' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                  }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{resource.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    {resource.type}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500">{resource.description || "No description provided."}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};