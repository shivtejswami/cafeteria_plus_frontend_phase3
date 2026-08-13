export type SubscriptionStatus =
  | 'Active'
  | 'Expiring'
  | 'In grace'
  | 'Read-only'
  | 'Deactivated';

export type CustomerType = 'District' | 'Standalone school';

export interface SchoolCovered {
  id: string;
  name: string;
  level: 'Elementary' | 'Middle' | 'High' | 'K-12';
  isActive: boolean;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  description: string;
  note?: string;
}

export interface OverrideItem {
  id: string;
  title: string;
  type: string;
  appliedBy: string;
  appliedDate: string;
  expiryDate?: string;
  notes?: string;
}

export interface SubscriptionItem {
  id: string;
  customer: string;
  type: CustomerType;
  schoolCount: number;
  schoolLimit?: number;
  status: SubscriptionStatus;
  termStart: string;
  termEnd: string;
  renewalDate: string;
  billingRef?: string;
  contactName?: string;
  contactEmail?: string;
  planName?: string;
  annualFee?: string;
  paymentMethod?: string;
  notes?: string;
  graceStartDate?: string;
  graceEndDate?: string;
  graceDaysWindow?: number;
  schoolsCovered?: SchoolCovered[];
  auditEvents?: AuditEvent[];
  overrides?: OverrideItem[];
}

export type TypeFilterOption = 'All' | 'District' | 'Standalone schools';

export type StatusFilterOption =
  | 'All'
  | 'Active'
  | 'Expiring'
  | 'Grace'
  | 'Read-only'
  | 'Deactivated';

export type RenewalFilterOption =
  | 'All'
  | 'Renews in 30 days'
  | 'Renews in 60 days'
  | 'Renews in 90 days';

export type SortFilterOption = 'renewal' | 'status' | 'customer';

export interface SubscriptionKpiSummary {
  active: number;
  expiring30Days: number;
  inGrace: number;
  readOnly: number;
  deactivated: number;
}
