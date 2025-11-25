export enum ImpactLevel {
  NEGLIGIBLE = 'Negligible',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
  CATASTROPHIC = 'Catastrophic',
}

export enum RecoveryTimeObjective {
  RTO_1H = '1 Hour',
  RTO_4H = '4 Hours',
  RTO_24H = '24 Hours',
  RTO_48H = '48 Hours',
  RTO_1W = '1 Week',
  RTO_2W = '2 Weeks',
  RTO_1M = '1 Month',
}

export enum RecoveryPointObjective {
  RPO_0 = '0 Minutes (Real-time)',
  RPO_1H = '1 Hour',
  RPO_4H = '4 Hours',
  RPO_24H = '24 Hours',
}

export interface Resource {
  id: string;
  name: string;
  type: 'People' | 'IT System' | 'Facility' | 'Equipment' | 'Vendor';
  description: string;
}

export interface ImpactAssessment {
  timeframe: string; // e.g., "4 Hours", "24 Hours"
  financialImpact: ImpactLevel;
  operationalImpact: ImpactLevel;
  reputationalImpact: ImpactLevel;
  legalImpact: ImpactLevel;
  description: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  department: string;
  priority: ImpactLevel;
  rto: RecoveryTimeObjective;
  rpo: RecoveryPointObjective;
  mtpd: string; // Maximum Tolerable Period of Disruption
  resources: string[]; // IDs of linked resources
  impacts: ImpactAssessment[];
}

export interface BIASettings {
  organizationName: string;
  standard: string;
  currency: string;
  reviewCycleMonths: number;
}

// --- Risk Management Types ---

export enum RiskCategory {
  TECHNOLOGY = 'Technology',
  PERSONNEL = 'Personnel',
  PHYSICAL = 'Physical/Facility',
  SUPPLY_CHAIN = 'Supply Chain',
  REGULATORY = 'Regulatory',
  REPUTATIONAL = 'Reputational',
}

export interface Risk {
  id: string;
  description: string;
  category: RiskCategory;
  likelihood: 1 | 2 | 3 | 4 | 5; // 1=Rare, 5=Almost Certain
  impact: 1 | 2 | 3 | 4 | 5; // 1=Negligible, 5=Catastrophic
  relatedActivityIds: string[];
  existingControls: string;
  treatment: 'Accept' | 'Mitigate' | 'Transfer' | 'Avoid';
}

// --- Recovery Strategy Types ---

export interface RecoveryStrategy {
  id: string;
  activityId: string;
  name: string; // e.g. "Manual Workaround"
  description: string;
  cost: 'Low' | 'Medium' | 'High';
  feasibility: 'Low' | 'Medium' | 'High';
  rtoAchievable: RecoveryTimeObjective;
  isSelected: boolean; // Is this the chosen strategy?
}

// For AI Generation
export interface AIAnalysisResult {
  suggestedDescription: string;
  suggestedRTO: RecoveryTimeObjective;
  suggestedRPO: RecoveryPointObjective;
  impactNarrative: string;
  suggestedResources: string[]; // Names of resources
}