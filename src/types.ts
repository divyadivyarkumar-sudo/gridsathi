export type IncidentStatus =
  | 'New'
  | 'Crew assigned'
  | 'On site'
  | 'Repairing'
  | 'Restored';

export type IncidentPriority = 'High' | 'Medium' | 'Low';

export type CrewAvailability = 'Available' | 'En route' | 'On site';

export type AppView = 'operations' | 'customer';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface AreaInfo {
  id: string;
  name: string;
  shortName: string;
  streetHint: string;
  center: LatLng;
  feederId: string;
  transformerId: string;
}

export interface FeederLine {
  id: string;
  name: string;
  areaId: string;
  path: LatLng[];
}

export interface TransformerNode {
  id: string;
  code: string;
  name: string;
  areaId: string;
  position: LatLng;
}

export interface RepairCrew {
  id: string;
  name: string;
  lead: string;
  status: CrewAvailability;
  assignedIncidentId: string | null;
  areaLabel: string;
  homeBase: LatLng;
  currentPosition: LatLng;
}

export interface TimelineEntry {
  id: string;
  timeLabel: string;
  message: string;
}

export interface Incident {
  id: string;
  areaId: string;
  areaName: string;
  streetSummary: string;
  center: LatLng;
  radiusMeters: number;
  reportedAtLabel: string;
  updatedAtLabel: string;
  reportCount: number;
  estimatedCustomers: number;
  priority: IncidentPriority;
  status: IncidentStatus;
  equipmentLabel: string;
  transformerId: string;
  feederId: string;
  assignedCrewId: string | null;
  timeline: TimelineEntry[];
}

export interface CustomerReportPayload {
  areaId: string;
  customStreet: string;
  issueType: string;
  note: string;
}
