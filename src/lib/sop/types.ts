import type { UserRole } from "@/types/user";

export interface SopDocument {
  id: string;
  title: string;
  organization: string;
  version: string;
  lastUpdated: string;
  eventTypes: string[];
  roles: UserRole[];
  source: string;
  highPriorityActions: string[];
  mediumPriorityActions: string[];
  monitoringActions: string[];
  doNotDo: string[];
  rawContent?: string;
}
