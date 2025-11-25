import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ActivityList } from './components/ActivityList';
import { ResourceList } from './components/ResourceList';
import { RiskAssessment } from './components/RiskAssessment';
import { RecoveryStrategies } from './components/RecoveryStrategies';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Activity, Resource, Risk, RecoveryStrategy, ImpactLevel, RecoveryTimeObjective, RecoveryPointObjective, RiskCategory } from './types';
import {
  initDB,
  getActivities, saveActivity, deleteActivity,
  getResources, saveResource, deleteResource,
  getRisks, saveRisk, deleteRisk,
  getStrategies, saveStrategy, deleteStrategy
} from './services/database';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [resources, setResources] = useState<Resource[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [strategies, setStrategies] = useState<RecoveryStrategy[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await initDB();

      const [dbActivities, dbResources, dbRisks, dbStrategies] = await Promise.all([
        getActivities(),
        getResources(),
        getRisks(),
        getStrategies()
      ]);

      if (dbActivities.length === 0 && dbResources.length === 0) {
        // Seed initial data
        const initialResources: Resource[] = [
          { id: 'res-1', name: 'AWS Cloud Infrastructure', type: 'IT System', description: 'Core hosting environment for all apps' },
          { id: 'res-2', name: 'Customer Support Team', type: 'People', description: 'Level 1 and 2 support agents (24/7)' },
          { id: 'res-3', name: 'HQ Office - New York', type: 'Facility', description: 'Primary office location, 500 seats' },
          { id: 'res-4', name: 'Payroll SaaS', type: 'IT System', description: 'Third party payroll provider' },
        ];

        const initialActivities: Activity[] = [
          {
            id: 'act-1',
            name: 'Customer Ticket Resolution',
            department: 'Support',
            description: 'Handling incoming customer issues via email and phone.',
            priority: ImpactLevel.HIGH,
            rto: RecoveryTimeObjective.RTO_4H,
            rpo: RecoveryPointObjective.RPO_1H,
            mtpd: '24 Hours',
            resources: ['res-2', 'res-1'],
            impacts: []
          },
          {
            id: 'act-2',
            name: 'Monthly Payroll Run',
            department: 'HR',
            description: 'Processing employee salaries and tax deductions.',
            priority: ImpactLevel.CRITICAL,
            rto: RecoveryTimeObjective.RTO_1W,
            rpo: RecoveryPointObjective.RPO_24H,
            mtpd: '5 Days',
            resources: ['res-4'],
            impacts: []
          }
        ];

        const initialRisks: Risk[] = [
          {
            id: 'risk-1',
            description: 'Ransomware attack encrypting customer database',
            category: RiskCategory.TECHNOLOGY,
            likelihood: 3,
            impact: 5,
            relatedActivityIds: ['act-1'],
            existingControls: 'Daily immutable backups, Endpoint protection',
            treatment: 'Mitigate'
          },
          {
            id: 'risk-2',
            description: 'Key personnel unavailability during flu season',
            category: RiskCategory.PERSONNEL,
            likelihood: 4,
            impact: 3,
            relatedActivityIds: ['act-1', 'act-2'],
            existingControls: 'Cross-training program',
            treatment: 'Accept'
          }
        ];

        const initialStrategies: RecoveryStrategy[] = [
          {
            id: 'strat-1',
            activityId: 'act-1',
            name: 'Remote Work Activation',
            description: 'Shift all support agents to work-from-home via VPN.',
            cost: 'Low',
            feasibility: 'High',
            rtoAchievable: RecoveryTimeObjective.RTO_1H,
            isSelected: true
          },
          {
            id: 'strat-2',
            activityId: 'act-1',
            name: 'Outsource Spillover',
            description: 'Route calls to 3rd party BPO vendor.',
            cost: 'High',
            feasibility: 'Medium',
            rtoAchievable: RecoveryTimeObjective.RTO_4H,
            isSelected: false
          }
        ];

        // Save to DB
        await Promise.all([
          ...initialResources.map(saveResource),
          ...initialActivities.map(saveActivity),
          ...initialRisks.map(saveRisk),
          ...initialStrategies.map(saveStrategy)
        ]);

        setResources(initialResources);
        setActivities(initialActivities);
        setRisks(initialRisks);
        setStrategies(initialStrategies);
      } else {
        setResources(dbResources);
        setActivities(dbActivities);
        setRisks(dbRisks);
        setStrategies(dbStrategies);
      }
    };

    loadData();
  }, []);

  // --- Handlers ---

  const handleSaveActivity = async (activity: Activity) => {
    await saveActivity(activity);
    setActivities(prev => {
      const index = prev.findIndex(a => a.id === activity.id);
      if (index >= 0) {
        const newActivities = [...prev];
        newActivities[index] = activity;
        return newActivities;
      }
      return [...prev, activity];
    });
  };

  const handleDeleteActivity = async (id: string) => {
    await deleteActivity(id);
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveResource = async (resource: Resource) => {
    await saveResource(resource);
    setResources(prev => {
      const index = prev.findIndex(r => r.id === resource.id);
      if (index >= 0) {
        const newResources = [...prev];
        newResources[index] = resource;
        return newResources;
      }
      return [...prev, resource];
    });
  };

  const handleDeleteResource = async (id: string) => {
    await deleteResource(id);
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveRisk = async (risk: Risk) => {
    await saveRisk(risk);
    setRisks(prev => {
      const index = prev.findIndex(r => r.id === risk.id);
      if (index >= 0) {
        const newRisks = [...prev];
        newRisks[index] = risk;
        return newRisks;
      }
      return [...prev, risk];
    });
  };

  const handleDeleteRisk = async (id: string) => {
    await deleteRisk(id);
    setRisks(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveStrategy = async (strategy: RecoveryStrategy) => {
    await saveStrategy(strategy);
    setStrategies(prev => {
      const index = prev.findIndex(s => s.id === strategy.id);
      if (index >= 0) {
        const newStrategies = [...prev];
        newStrategies[index] = strategy;
        return newStrategies;
      }
      return [...prev, strategy];
    });
  };

  const handleDeleteStrategy = async (id: string) => {
    await deleteStrategy(id);
    setStrategies(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'dashboard' && (
              <Dashboard
                activities={activities}
                risks={risks}
                strategies={strategies}
              />
            )}
            {activeTab === 'activities' && (
              <ActivityList
                activities={activities}
                onSave={handleSaveActivity}
                onDelete={handleDeleteActivity}
                resources={resources}
              />
            )}
            {activeTab === 'risks' && (
              <RiskAssessment
                risks={risks}
                onSave={handleSaveRisk}
                onDelete={handleDeleteRisk}
                activities={activities}
              />
            )}
            {activeTab === 'strategies' && (
              <RecoveryStrategies
                activities={activities}
                strategies={strategies}
                onSave={handleSaveStrategy}
                onDelete={handleDeleteStrategy}
              />
            )}
            {activeTab === 'resources' && (
              <ResourceList
                resources={resources}
                onSave={handleSaveResource}
                onDelete={handleDeleteResource}
              />
            )}
            {activeTab === 'settings' && (
              <Settings />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;