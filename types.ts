
export type Category = 
  | 'Governance & Standards' 
  | 'Sovereign Infrastructure' 
  | 'Capital & Risk' 
  | 'Market Design' 
  | 'Talent & Education' 
  | 'Narrative & Influence' 
  | 'Frontier / Radical';

export type OrganisationType = 
  | 'Government & Intergovernmental Agencies'
  | 'Think Tanks & Policy Institutes'
  | 'Academic & Research Institutions'
  | 'Industry & Consulting Reports'
  | 'Tech Firm'
  | 'Manufacturer';

export type TechCategory = 
  | 'Cloud'
  | 'Productivity'
  | 'AI/ML'
  | 'Security'
  | 'Chips'
  | 'Quantum'
  | 'Satellite';

export interface Delegate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export interface User {
  id: string;
  name: string;
  password?: string; // Added for mock login validation
  role: 'Corporate' | 'Regulator' | 'Academic' | 'Investor' | 'Policymaker';
  organization: string;
  avatar: string;
  points: number; // reputation_score
  isAdmin?: boolean; // Distinguish administrative access
}

export interface Organisation {
  id: string;
  name: string;
  type: OrganisationType;
  techCategories: TechCategory[];
  description: string;
  location: string;
  avatar: string;
  memberCount: number;
  verified: boolean;
  website?: string;
  delegates?: Delegate[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'vote' | 'comment' | 'event' | 'system';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  replies?: Comment[];
}

export interface Task {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  assignee?: string;
}

export interface SimulationResult {
  scenarioName: string;
  resilienceScore: number;
  metrics: {
    continuity: number;
    security: number;
    adaptability: number;
  };
  analysis: string;
  mitigationSteps: string[];
}

export interface DiplomaticCritique {
  blocName: string;
  personaTitle: string;
  stance: 'Supportive' | 'Neutral' | 'Opposed' | 'Adversarial';
  critique: string;
  strategicLeverage: string;
}

export interface DiplomaticSimulationResult {
  overallFriction: number; // 0-100
  critiques: DiplomaticCritique[];
  geopoliticalSummary: string;
  recommendedDiplomaticApproach: string;
}

export interface FinancialProjection {
  year: number;
  roi: number;
  sovereigntyGain: number;
  cost: number;
}

export interface IPRecord {
  id: string;
  ideaId: string;
  ownerName: string;
  organization: string;
  timestamp: number;
  action: 'Created' | 'Modified' | 'Licensed' | 'Secured';
  signature: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: Category;
  authorId: string;
  authorName: string;
  timestamp: number;
  updatedAt?: number;
  status: 'Proposed' | 'Under Review' | 'Approved' | 'Active Working Group' | 'Implemented' | 'Archived';
  
  // Scoring
  impactScore: number;
  feasibilityScore: number;
  revenueScore: number;
  sovereigntyScore: number;
  
  // Voting
  votes: {
    up: number;
    down: number;
  };
  
  comments: Comment[];
  tags: string[];
  
  // Versioning & Relationships
  version: number;
  parentIdeaId?: string;
  
  // Kinetic Workspace data (optional)
  tasks?: Task[];
  workingGroup?: string[]; // user IDs
}

export interface DashboardStats {
  categoryDistribution: { name: string; value: number }[];
  votingTrends: { date: string; votes: number }[];
  impactHeatmap: { x: number; y: number; z: number; name: string }[];
}

// Messaging Types
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'idea' | 'event';
  title: string;
  lastMessage?: string;
  timestamp: number;
  unreadCount: number;
  participants: string[]; // User IDs
  relatedId?: string; // Idea or Event ID
  avatar?: string;
}
