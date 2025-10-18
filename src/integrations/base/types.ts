export interface Contact {
  id?: string;
  externalId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  customFields?: Record<string, any>;
}

export interface Activity {
  id?: string;
  type: 'call' | 'meeting' | 'email' | 'practice_session';
  contactId: string;
  subject: string;
  description: string;
  duration?: number;
  outcome?: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  score?: number;
  date: Date;
  customFields?: Record<string, any>;
}

export interface Opportunity {
  id?: string;
  externalId?: string;
  name: string;
  contactId: string;
  amount?: number;
  stage: string;
  probability?: number;
  closeDate?: Date;
  customFields?: Record<string, any>;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  errors: Array<{
    record: string;
    error: string;
  }>;
}

export interface IntegrationCredentials {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  instanceUrl?: string;
  domain?: string;
  expiresAt?: Date;
  customFields?: Record<string, any>;
}

export interface IntegrationConfig {
  enabled: boolean;
  credentials: IntegrationCredentials;
  syncInterval?: number;
  webhookUrl?: string;
  mappings?: FieldMapping[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
}

export enum IntegrationType {
  SALESFORCE = 'salesforce',
  HUBSPOT = 'hubspot',
  ZOHO = 'zoho',
  CUSTOM = 'custom',
}

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: Date;
  source: IntegrationType;
}
