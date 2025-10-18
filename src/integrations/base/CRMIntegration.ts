import { Contact, Activity, Opportunity, SyncResult, IntegrationConfig } from './types';

export abstract class CRMIntegration {
  protected config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  abstract getName(): string;

  abstract testConnection(): Promise<boolean>;

  abstract syncContacts(): Promise<SyncResult>;

  abstract createContact(contact: Contact): Promise<string>;

  abstract updateContact(id: string, data: Partial<Contact>): Promise<void>;

  abstract getContact(id: string): Promise<Contact | null>;

  abstract logActivity(activity: Activity): Promise<void>;

  abstract syncOpportunities(): Promise<SyncResult>;

  abstract createOpportunity(opportunity: Opportunity): Promise<string>;

  abstract updateOpportunity(id: string, data: Partial<Opportunity>): Promise<void>;

  abstract getOpportunity(id: string): Promise<Opportunity | null>;

  updateConfig(config: Partial<IntegrationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  protected mapFields(data: any, mappings?: Array<{ sourceField: string; targetField: string; transform?: (value: any) => any }>): any {
    if (!mappings || mappings.length === 0) {
      return data;
    }

    const mapped: any = {};
    for (const mapping of mappings) {
      const value = data[mapping.sourceField];
      mapped[mapping.targetField] = mapping.transform ? mapping.transform(value) : value;
    }

    return mapped;
  }

  protected handleError(error: any): never {
    console.error(`[${this.getName()}] Error:`, error);
    throw new Error(`Integration error: ${error.message || error}`);
  }
}
