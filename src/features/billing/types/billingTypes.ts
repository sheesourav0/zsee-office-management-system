
export interface Department {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTerm {
  id: string;
  description: string;
  percentage: number;
  milestone: string;
}

export interface WorkPlanStep {
  id: string;
  departmentId: string;
  departmentName: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
  // New fields for Gantt chart
  startDate: string;
  endDate: string;
  duration: number; // in days
  dependencies?: string[]; // Array of step IDs that this step depends on
  progress: number; // Percentage completion (0-100)
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string; // Person responsible
  estimatedHours?: number;
  actualHours?: number;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: 'pending' | 'completed' | 'delayed';
  isPaymentMilestone: boolean;
  paymentTermId?: string;
  dependencies?: string[];
}

export interface ProjectPayment {
  id: string;
  projectId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
  notes?: string;
  createdAt: string;
}

export interface BillingProject {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  projectOwner: 'PHED' | 'PWD' | 'Contractor' | 'Company' | 'Other';
  projectOwnerDetails?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  departments: string[]; // Array of department IDs
  paymentTerms: PaymentTerm[];
  workPlan: WorkPlanStep[];
  totalReceived: number;
  totalPending: number;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  expectedEndDate?: string;
  // New fields for Gantt chart
  milestones: ProjectMilestone[];
  projectPhases: ProjectPhase[];
  riskFactors: RiskFactor[];
  resources: ProjectResource[];
  overallProgress: number; // 0-100
  baselineDuration: number; // Original estimated duration in days
  actualDuration?: number; // Actual duration if completed
  projectManager: string;
  projectTeam: string[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  workPlanSteps: string[]; // Array of WorkPlanStep IDs
  dependencies?: string[]; // Array of phase IDs
}

export interface RiskFactor {
  id: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'identified' | 'mitigated' | 'occurred';
}

export interface ProjectResource {
  id: string;
  name: string;
  type: 'human' | 'equipment' | 'material' | 'financial';
  allocation: number; // Percentage or amount
  cost: number;
  availability: string;
  assignedSteps: string[]; // Array of WorkPlanStep IDs
}
