import { CRMIntegration } from './base/CRMIntegration';
import { IntegrationType, IntegrationConfig, Activity } from './base/types';
import { SalesforceService } from './salesforce/SalesforceService';
import { HubSpotService } from './hubspot/HubSpotService';
import { ZohoService } from './zoho/ZohoService';

export class IntegrationManager {
  private static instance: IntegrationManager;
  private integrations: Map<IntegrationType, CRMIntegration> = new Map();

  private constructor() {}

  static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }

  registerIntegration(type: IntegrationType, config: IntegrationConfig): void {
    let integration: CRMIntegration;

    switch (type) {
      case IntegrationType.SALESFORCE:
        integration = new SalesforceService(config);
        break;
      case IntegrationType.HUBSPOT:
        integration = new HubSpotService(config);
        break;
      case IntegrationType.ZOHO:
        integration = new ZohoService(config);
        break;
      default:
        throw new Error(`Unsupported integration type: ${type}`);
    }

    this.integrations.set(type, integration);
  }

  getIntegration(type: IntegrationType): CRMIntegration | undefined {
    return this.integrations.get(type);
  }

  getActiveIntegrations(): CRMIntegration[] {
    return Array.from(this.integrations.values()).filter((integration) =>
      integration.isEnabled()
    );
  }

  async testIntegration(type: IntegrationType): Promise<boolean> {
    const integration = this.getIntegration(type);
    if (!integration) {
      throw new Error(`Integration not found: ${type}`);
    }
    return integration.testConnection();
  }

  async logActivityToAll(activity: Activity): Promise<void> {
    const activeIntegrations = this.getActiveIntegrations();
    const promises = activeIntegrations.map((integration) =>
      integration.logActivity(activity).catch((error) => {
        console.error(`Failed to log activity to ${integration.getName()}:`, error);
      })
    );

    await Promise.allSettled(promises);
  }

  async syncAll(): Promise<void> {
    const activeIntegrations = this.getActiveIntegrations();

    for (const integration of activeIntegrations) {
      try {
        console.log(`Syncing ${integration.getName()}...`);
        await integration.syncContacts();
        await integration.syncOpportunities();
        console.log(`${integration.getName()} sync complete`);
      } catch (error) {
        console.error(`Failed to sync ${integration.getName()}:`, error);
      }
    }
  }

  removeIntegration(type: IntegrationType): void {
    this.integrations.delete(type);
  }

  clearAll(): void {
    this.integrations.clear();
  }
}

export const integrationManager = IntegrationManager.getInstance();
