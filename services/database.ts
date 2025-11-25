import Dexie, { Table } from 'dexie';
import { Activity, Resource, Risk, RecoveryStrategy } from '../types';

class BIADatabase extends Dexie {
  resources!: Table<Resource>;
  activities!: Table<Activity>;
  risks!: Table<Risk>;
  strategies!: Table<RecoveryStrategy>;

  constructor() {
    super('BIADatabase');
    this.version(1).stores({
      resources: 'id, name, type',
      activities: 'id, name, department, priority',
      risks: 'id, category, likelihood, impact',
      strategies: 'id, activityId, isSelected'
    });
  }
}

export const db = new BIADatabase();

export const initDB = async () => {
  // Dexie opens automatically on first query, but we can explicitly open to check connection
  try {
    await db.open();
    console.log('Dexie DB opened successfully');
  } catch (err) {
    console.error('Failed to open Dexie DB', err);
  }
};

// --- Resources ---

export const getResources = async (): Promise<Resource[]> => {
  return await db.resources.toArray();
};

export const saveResource = async (resource: Resource) => {
  await db.resources.put(resource);
};

export const deleteResource = async (id: string) => {
  await db.resources.delete(id);
};

// --- Activities ---

export const getActivities = async (): Promise<Activity[]> => {
  return await db.activities.toArray();
};

export const saveActivity = async (activity: Activity) => {
  await db.activities.put(activity);
};

export const deleteActivity = async (id: string) => {
  await db.activities.delete(id);
};

// --- Risks ---

export const getRisks = async (): Promise<Risk[]> => {
  return await db.risks.toArray();
};

export const saveRisk = async (risk: Risk) => {
  await db.risks.put(risk);
};

export const deleteRisk = async (id: string) => {
  await db.risks.delete(id);
};

// --- Strategies ---

export const getStrategies = async (): Promise<RecoveryStrategy[]> => {
  return await db.strategies.toArray();
};

export const saveStrategy = async (strategy: RecoveryStrategy) => {
  await db.strategies.put(strategy);
};

export const deleteStrategy = async (id: string) => {
  await db.strategies.delete(id);
};
