export type Language = 'en' | 'si' | 'ta';

export type TrainClass = '1st Class AC' | '1st Class Observation' | '1st Class Sleeper' | '2nd Class Reserved' | '2nd Class Unreserved' | '3rd Class Reserved' | '3rd Class Unreserved';

export type TrainStatus = 'On Time' | 'Delayed' | 'Cancelled' | 'Scheduled' | 'Platform Changed';

export type TrainDirection = 'to_badulla' | 'to_colombo' | 'to_kandy' | 'all';

export interface Train {
  id: string;
  trainNumber: string;
  name: string;
  direction: 'to_badulla' | 'to_colombo' | 'to_kandy';
  originStation: string;
  destinationStation: string;
  arrivalTimeElla: string; // e.g. "15:14"
  departureTimeElla: string; // e.g. "15:17"
  operatingDays: string[]; // e.g. ['Daily'] or ['Mon', 'Tue', ...]
  classes: TrainClass[];
  currentStatus: TrainStatus;
  statusNote?: string;
  platform: string;
  lastUpdated: string;
  source: string;
  intermediateStopsSummary?: string;
}

export interface ServiceAlert {
  id: string;
  type: 'delay' | 'cancellation' | 'advisory' | 'maintenance';
  title: string;
  titleSi?: string;
  titleTa?: string;
  message: string;
  messageSi?: string;
  messageTa?: string;
  affectedTrain?: string;
  active: boolean;
  publishedAt: string;
  lastVerified: string;
  source: string;
}

export interface FareRecord {
  id: string;
  fromStation: string;
  toStation: string;
  distanceKm: number;
  thirdClassFare: number;
  secondClassFare: number;
  firstClassFare?: number;
  observationFare?: number;
  lastVerified: string;
  source: string;
}

export interface TouristAttraction {
  id: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  distanceKm: number;
  walkingTimeMinutes?: number;
  drivingTimeMinutes?: number;
  description: string;
  descriptionSi?: string;
  descriptionTa?: string;
  imageUrl: string;
  imageAttribution: string;
  mapsUrl: string;
  tip?: string;
}

export interface EmergencyContact {
  id: string;
  serviceName: string;
  serviceNameSi?: string;
  serviceNameTa?: string;
  phoneNumber: string;
  alternateNumber?: string;
  description: string;
  location: string;
  operatingHours: string;
  lastVerified: string;
  badge?: string;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  category: 'Feedback' | 'Complaint' | 'Suggestion' | 'Timetable Correction' | 'Other';
  message: string;
  submittedAt: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  adminNotes?: string;
  notificationStatus: 'sent' | 'queued' | 'simulated';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface WebsiteSettings {
  siteTitle: string;
  siteDescription: string;
  officialRailwayUrl: string;
  stationMasterEmail: string;
  notificationSenderEmail: string;
  emailNotificationsEnabled: boolean;
  googleMapsDirectionsUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  emergencyHotline: string;
  lastTimetableAudit: string;
}
