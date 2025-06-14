
export type UserRole = 
  | "administrator" 
  | "admin" 
  | "hr" 
  | "account" 
  | "project-manager" 
  | "project-coordinator" 
  | "team-lead" 
  | "engineer" 
  | "technician" 
  | "helper" 
  | "supervisor" 
  | "sales" 
  | "labor" 
  | "office-boy" 
  | "others";

export type WorkPlanPeriod = "daily" | "weekly" | "monthly";
export type WorkPlanStatus = "upcoming" | "current" | "completed" | "overdue";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  teamLeadId?: string;
  isActive: boolean;
  joinDate: string;
}

export interface WorkPlan {
  id: string;
  memberId: string;
  title: string;
  description: string;
  location: string;
  period: WorkPlanPeriod;
  startDate: string;
  endDate: string;
  status: WorkPlanStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  progress: number;
}

export interface WorkPlanComment {
  id: string;
  workPlanId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  type: "comment" | "question" | "feedback";
  createdAt: string;
  isRead: boolean;
}
