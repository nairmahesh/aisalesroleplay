# CRM Integration Setup Guide

## Overview

This guide explains how to set up and configure integrations with Salesforce, HubSpot, Zoho, and custom CRM platforms.

## Architecture

The integration system uses an abstract base class pattern that allows you to:
- Implement any CRM platform with consistent interface
- Manage multiple integrations simultaneously
- Log activities to all connected platforms at once
- Sync contacts and opportunities bidirectionally

## Quick Start

### 1. Basic Setup

```typescript
import {
  integrationManager,
  IntegrationType,
  IntegrationConfig,
} from './integrations';

// Register an integration
const config: IntegrationConfig = {
  enabled: true,
  credentials: {
    apiKey: 'your-api-key',
    accessToken: 'your-access-token',
  },
};

integrationManager.registerIntegration(
  IntegrationType.SALESFORCE,
  config
);
```

### 2. Test Connection

```typescript
const isConnected = await integrationManager.testIntegration(
  IntegrationType.SALESFORCE
);

if (isConnected) {
  console.log('Successfully connected!');
}
```

### 3. Use the Integration

```typescript
// Log an activity
await integrationManager.logActivityToAll({
  type: 'practice_session',
  contactId: 'contact-123',
  subject: 'Sales Practice',
  description: 'Completed roleplay session',
  duration: 1800,
  score: 85,
  date: new Date(),
});

// Sync all integrations
await integrationManager.syncAll();
```

## Salesforce Integration

### Prerequisites
- Salesforce account with API access
- Connected App configured
- OAuth 2.0 credentials

### Setup Steps

1. **Create Connected App in Salesforce**
   - Go to Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Add OAuth scopes: `api`, `refresh_token`, `offline_access`
   - Set callback URL

2. **Get Authentication Credentials**
   ```bash
   # OAuth 2.0 flow
   # Step 1: Get authorization code
   https://login.salesforce.com/services/oauth2/authorize?
     client_id=YOUR_CLIENT_ID&
     redirect_uri=YOUR_REDIRECT_URI&
     response_type=code

   # Step 2: Exchange code for tokens
   POST https://login.salesforce.com/services/oauth2/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=authorization_code&
   code=YOUR_AUTH_CODE&
   client_id=YOUR_CLIENT_ID&
   client_secret=YOUR_CLIENT_SECRET&
   redirect_uri=YOUR_REDIRECT_URI
   ```

3. **Configure Integration**
   ```typescript
   const salesforceConfig: IntegrationConfig = {
     enabled: true,
     credentials: {
       instanceUrl: 'https://your-instance.salesforce.com',
       accessToken: 'access_token_here',
       refreshToken: 'refresh_token_here',
       expiresAt: new Date('2025-12-31'),
     },
     syncInterval: 3600000, // 1 hour
     mappings: [
       {
         sourceField: 'firstName',
         targetField: 'FirstName',
       },
       {
         sourceField: 'lastName',
         targetField: 'LastName',
       },
     ],
   };

   integrationManager.registerIntegration(
     IntegrationType.SALESFORCE,
     salesforceConfig
   );
   ```

### Field Mapping

```typescript
// Example: Map practice session to Salesforce Task
const mappings = [
  { sourceField: 'subject', targetField: 'Subject' },
  { sourceField: 'description', targetField: 'Description' },
  { sourceField: 'date', targetField: 'ActivityDate' },
  {
    sourceField: 'duration',
    targetField: 'CallDurationInSeconds',
    transform: (minutes) => minutes * 60,
  },
];
```

## HubSpot Integration

### Prerequisites
- HubSpot account
- Private app or OAuth app
- API key

### Setup Steps

1. **Create Private App**
   - Go to Settings → Integrations → Private Apps
   - Create new private app
   - Grant scopes: `contacts`, `timeline`, `crm.objects.contacts.write`
   - Copy access token

2. **Configure Integration**
   ```typescript
   const hubspotConfig: IntegrationConfig = {
     enabled: true,
     credentials: {
       accessToken: 'your-access-token',
     },
     syncInterval: 3600000,
     mappings: [
       { sourceField: 'firstName', targetField: 'firstname' },
       { sourceField: 'lastName', targetField: 'lastname' },
       { sourceField: 'email', targetField: 'email' },
       { sourceField: 'phone', targetField: 'phone' },
     ],
   };

   integrationManager.registerIntegration(
     IntegrationType.HUBSPOT,
     hubspotConfig
   );
   ```

### Timeline Events

```typescript
// Log practice session as timeline event
const activity = {
  type: 'practice_session',
  contactId: 'hubspot-contact-id',
  subject: 'AI Roleplay Practice',
  description: 'Completed practice session',
  date: new Date(),
  score: 85,
};

await hubspotIntegration.logActivity(activity);
```

## Zoho CRM Integration

### Prerequisites
- Zoho CRM account
- OAuth credentials
- API domain

### Setup Steps

1. **Register Client**
   - Go to API Console (https://api-console.zoho.com/)
   - Create new server-based application
   - Add redirect URI
   - Note client ID and secret

2. **Get Tokens**
   ```bash
   # Step 1: Authorization
   https://accounts.zoho.com/oauth/v2/auth?
     scope=ZohoCRM.modules.ALL&
     client_id=YOUR_CLIENT_ID&
     response_type=code&
     access_type=offline&
     redirect_uri=YOUR_REDIRECT_URI

   # Step 2: Generate tokens
   POST https://accounts.zoho.com/oauth/v2/token
   Content-Type: application/x-www-form-urlencoded

   code=YOUR_AUTH_CODE&
   client_id=YOUR_CLIENT_ID&
   client_secret=YOUR_CLIENT_SECRET&
   redirect_uri=YOUR_REDIRECT_URI&
   grant_type=authorization_code
   ```

3. **Configure Integration**
   ```typescript
   const zohoConfig: IntegrationConfig = {
     enabled: true,
     credentials: {
       accessToken: 'access_token',
       refreshToken: 'refresh_token',
       domain: 'https://www.zohoapis.com',
       expiresAt: new Date('2025-12-31'),
     },
     syncInterval: 3600000,
   };

   integrationManager.registerIntegration(
     IntegrationType.ZOHO,
     zohoConfig
   );
   ```

## Custom CRM Integration

### Creating Custom Integration

```typescript
import { CRMIntegration } from './integrations/base/CRMIntegration';
import {
  Contact,
  Activity,
  Opportunity,
  SyncResult,
  IntegrationConfig,
} from './integrations/base/types';

export class CustomCRMService extends CRMIntegration {
  private apiClient: any;

  constructor(config: IntegrationConfig) {
    super(config);
    this.initializeClient();
  }

  private initializeClient() {
    // Initialize your API client
    this.apiClient = createClient({
      apiKey: this.config.credentials.apiKey,
      baseURL: this.config.credentials.instanceUrl,
    });
  }

  getName(): string {
    return 'Custom CRM';
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.apiClient.get('/health');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async syncContacts(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      errors: [],
    };

    try {
      // Fetch contacts from CRM
      const contacts = await this.apiClient.get('/contacts');

      for (const contact of contacts) {
        try {
          // Process each contact
          const mapped = this.mapFields(contact, this.config.mappings);

          // Save to local database
          await this.saveContactLocally(mapped);

          result.recordsProcessed++;
        } catch (error) {
          result.errors.push({
            record: contact.id,
            error: error.message,
          });
        }
      }
    } catch (error) {
      result.success = false;
    }

    return result;
  }

  async createContact(contact: Contact): Promise<string> {
    try {
      const mapped = this.mapFields(contact, this.config.mappings);

      const response = await this.apiClient.post('/contacts', mapped);

      return response.id;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateContact(id: string, data: Partial<Contact>): Promise<void> {
    try {
      const mapped = this.mapFields(data, this.config.mappings);

      await this.apiClient.patch(`/contacts/${id}`, mapped);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getContact(id: string): Promise<Contact | null> {
    try {
      const response = await this.apiClient.get(`/contacts/${id}`);
      return this.mapToContact(response);
    } catch (error) {
      return null;
    }
  }

  async logActivity(activity: Activity): Promise<void> {
    try {
      const mapped = this.mapFields(activity, this.config.mappings);

      await this.apiClient.post('/activities', mapped);
    } catch (error) {
      this.handleError(error);
    }
  }

  async syncOpportunities(): Promise<SyncResult> {
    // Similar to syncContacts
    return {
      success: true,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      errors: [],
    };
  }

  async createOpportunity(opportunity: Opportunity): Promise<string> {
    // Implementation
    return 'opp-id';
  }

  async updateOpportunity(
    id: string,
    data: Partial<Opportunity>
  ): Promise<void> {
    // Implementation
  }

  async getOpportunity(id: string): Promise<Opportunity | null> {
    // Implementation
    return null;
  }

  private mapToContact(data: any): Contact {
    return {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email_address,
      phone: data.phone_number,
      company: data.company_name,
      title: data.job_title,
    };
  }

  private async saveContactLocally(contact: Contact): Promise<void> {
    // Save to your local database
  }
}
```

### Register Custom Integration

```typescript
import { CustomCRMService } from './CustomCRMService';

const customConfig: IntegrationConfig = {
  enabled: true,
  credentials: {
    apiKey: 'your-api-key',
    instanceUrl: 'https://api.yourcrm.com',
  },
};

const customIntegration = new CustomCRMService(customConfig);

// Register with manager
integrationManager.registerIntegration(
  IntegrationType.CUSTOM,
  customConfig
);
```

## Webhook Handling

### Setup Webhook Endpoint

```typescript
// In your backend (Edge Function or Express route)
export async function handleWebhook(req: Request) {
  const payload = await req.json();

  const webhookData: WebhookPayload = {
    event: payload.event,
    data: payload.data,
    timestamp: new Date(payload.timestamp),
    source: IntegrationType.SALESFORCE, // or detect from payload
  };

  // Process webhook
  await processWebhook(webhookData);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}

async function processWebhook(webhook: WebhookPayload) {
  switch (webhook.event) {
    case 'contact.created':
      // Handle new contact
      break;
    case 'contact.updated':
      // Handle contact update
      break;
    case 'opportunity.closed':
      // Handle closed opportunity
      break;
  }
}
```

## Security Best Practices

### 1. Secure Credential Storage

```typescript
// Store encrypted credentials in database
import { supabase } from './lib/supabase';

async function saveCredentials(
  type: IntegrationType,
  credentials: IntegrationCredentials
) {
  const encrypted = await encryptData(credentials);

  await supabase.from('integration_credentials').insert({
    integration_type: type,
    credentials: encrypted,
    created_at: new Date(),
  });
}
```

### 2. Token Refresh

```typescript
class TokenManager {
  async refreshToken(integration: CRMIntegration) {
    // Implement token refresh logic
    const newToken = await getNewAccessToken();

    integration.updateConfig({
      credentials: {
        ...integration.config.credentials,
        accessToken: newToken.access_token,
        expiresAt: new Date(Date.now() + newToken.expires_in * 1000),
      },
    });
  }
}
```

### 3. Rate Limiting

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async checkLimit(integration: string, limit: number = 100): Promise<boolean> {
    const now = Date.now();
    const requests = this.requests.get(integration) || [];

    // Remove requests older than 1 minute
    const recent = requests.filter((time) => now - time < 60000);

    if (recent.length >= limit) {
      return false;
    }

    recent.push(now);
    this.requests.set(integration, recent);

    return true;
  }
}
```

## Monitoring and Logging

### Track Integration Health

```typescript
interface IntegrationMetrics {
  integration: string;
  lastSync: Date;
  successRate: number;
  avgResponseTime: number;
  errorCount: number;
}

async function getIntegrationMetrics(
  type: IntegrationType
): Promise<IntegrationMetrics> {
  // Query metrics from database
  return {
    integration: type,
    lastSync: new Date(),
    successRate: 0.98,
    avgResponseTime: 250,
    errorCount: 5,
  };
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify credentials are correct
   - Check if tokens have expired
   - Ensure proper OAuth scopes

2. **Sync Failures**
   - Check network connectivity
   - Verify API rate limits
   - Review field mappings

3. **Webhook Issues**
   - Confirm webhook URL is accessible
   - Verify webhook secret/signature
   - Check payload format

### Debug Mode

```typescript
// Enable detailed logging
const config: IntegrationConfig = {
  enabled: true,
  credentials: { /* ... */ },
  customFields: {
    debug: true,
    logLevel: 'verbose',
  },
};
```

## Support

For integration support:
1. Check this guide
2. Review CRM-specific documentation
3. Test with provided examples
4. Contact platform support if needed
