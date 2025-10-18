# Modular Architecture Guide

## Overview

This application follows an enterprise-grade modular architecture designed for scalability, maintainability, and seamless integration with third-party platforms.

## Directory Structure

```
src/
├── core/                          # Core infrastructure
│   ├── config/                    # Configuration management
│   │   ├── env.ts                # Environment variables
│   │   └── index.ts
│   ├── services/                  # Base service classes
│   │   └── BaseService.ts        # Abstract base service
│   └── types/                     # Shared TypeScript types
│       ├── common.ts             # Common interfaces
│       └── index.ts
│
├── modules/                       # Feature modules
│   ├── practice-rooms/           # Human-to-Human Practice
│   │   ├── types/                # Module-specific types
│   │   ├── services/             # Business logic services
│   │   ├── hooks/                # React hooks
│   │   └── index.ts              # Public API
│   │
│   ├── analytics/                # Analytics & Reporting
│   │   ├── types/
│   │   ├── services/
│   │   └── index.ts
│   │
│   └── bots/                     # Bot Management
│       ├── types/
│       ├── services/
│       └── index.ts
│
├── integrations/                 # External Platform Integrations
│   ├── base/                     # Base integration interfaces
│   │   ├── CRMIntegration.ts    # Abstract CRM class
│   │   └── types.ts              # Integration types
│   │
│   ├── salesforce/               # Salesforce integration
│   │   └── SalesforceService.ts
│   │
│   ├── hubspot/                  # HubSpot integration
│   │   └── HubSpotService.ts
│   │
│   ├── zoho/                     # Zoho integration
│   │   └── ZohoService.ts
│   │
│   ├── IntegrationManager.ts    # Central integration management
│   └── index.ts
│
├── shared/                       # Shared components
├── components/                   # Legacy components (to be refactored)
├── views/                        # Legacy views (to be refactored)
├── lib/                          # Utilities
└── App.tsx                       # Main application
```

## Module Structure

Each module follows a consistent structure:

```
module-name/
├── types/
│   └── index.ts              # TypeScript interfaces and types
├── services/
│   └── ModuleService.ts      # Business logic and data operations
├── hooks/
│   └── useModule.ts          # React hooks for state management
├── components/               # Module-specific components (optional)
├── views/                    # Module-specific views (optional)
└── index.ts                  # Public API - exports only what's needed
```

## Usage Examples

### Using Practice Rooms Module

```typescript
import { usePracticeRooms, CreateRoomData } from '@/modules/practice-rooms';

function MyComponent() {
  const { rooms, loading, createRoom, updateRoom, deleteRoom } = usePracticeRooms();

  const handleCreate = async () => {
    const roomData: CreateRoomData = {
      name: 'My Practice Room',
      rep_name: 'John Doe',
      rep_type: 'employee',
      // ... other fields
    };

    const success = await createRoom(roomData);
    if (success) {
      console.log('Room created!');
    }
  };

  // Use rooms, loading, etc.
}
```

### Using Analytics Module

```typescript
import { analyticsService } from '@/modules/analytics';

async function getCallMetrics(callId: string) {
  const response = await analyticsService.getCallAnalytics(callId);

  if (response.success && response.data) {
    console.log('Analytics:', response.data);
  } else {
    console.error('Error:', response.error);
  }
}
```

### Using Bot Module

```typescript
import { botService, BotFilters } from '@/modules/bots';

async function fetchActiveBots() {
  const filters: BotFilters = {
    is_active: true,
    difficulty: 'medium',
  };

  const response = await botService.getBots(filters);

  if (response.success && response.data) {
    return response.data;
  }

  return [];
}
```

## Integration System

### Setting Up CRM Integration

```typescript
import {
  integrationManager,
  IntegrationType,
  IntegrationConfig,
} from '@/integrations';

// Configure Salesforce
const salesforceConfig: IntegrationConfig = {
  enabled: true,
  credentials: {
    instanceUrl: 'https://your-instance.salesforce.com',
    accessToken: 'your-access-token',
    refreshToken: 'your-refresh-token',
  },
  syncInterval: 3600000, // 1 hour
};

integrationManager.registerIntegration(
  IntegrationType.SALESFORCE,
  salesforceConfig
);

// Test connection
const isConnected = await integrationManager.testIntegration(
  IntegrationType.SALESFORCE
);
```

### Logging Activity to CRM

```typescript
import { integrationManager, Activity } from '@/integrations';

const activity: Activity = {
  type: 'practice_session',
  contactId: 'contact-123',
  subject: 'Sales Practice Call',
  description: 'Completed practice session with AI bot',
  duration: 1800,
  score: 85,
  date: new Date(),
};

// Logs to all active integrations
await integrationManager.logActivityToAll(activity);
```

### Creating Custom Integration

```typescript
import { CRMIntegration } from '@/integrations/base';
import {
  Contact,
  Activity,
  Opportunity,
  SyncResult,
  IntegrationConfig,
} from '@/integrations/base/types';

export class CustomCRMService extends CRMIntegration {
  constructor(config: IntegrationConfig) {
    super(config);
  }

  getName(): string {
    return 'Custom CRM';
  }

  async testConnection(): Promise<boolean> {
    // Implement connection test
    return true;
  }

  async syncContacts(): Promise<SyncResult> {
    // Implement contact sync
    return {
      success: true,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      errors: [],
    };
  }

  // Implement other required methods...
}
```

## Service Layer Pattern

All services extend `BaseService` which provides:

- Error handling utilities
- Consistent response format
- Logging capabilities

```typescript
import { BaseService } from '@/core/services/BaseService';
import { ApiResponse } from '@/core/types';

export class MyService extends BaseService {
  async doSomething(): Promise<ApiResponse<Data>> {
    try {
      // Your logic here
      const data = await fetchData();

      return this.success(data, 'Operation successful');
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }
}
```

## Type Safety

All modules use TypeScript interfaces for type safety:

```typescript
// From core/types/common.ts
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}
```

## Best Practices

### 1. Single Responsibility
Each module handles one specific domain:
- `practice-rooms`: Human practice sessions
- `analytics`: Call analytics and scoring
- `bots`: AI bot management

### 2. Dependency Injection
Services use singleton pattern for easy testing:

```typescript
export class MyService {
  private static instance: MyService;

  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
}
```

### 3. Consistent API
All services return `ApiResponse<T>`:

```typescript
const response = await service.getData();

if (response.success && response.data) {
  // Handle success
} else {
  // Handle error: response.error
}
```

### 4. Module Isolation
Modules export only what's necessary via `index.ts`:

```typescript
// modules/practice-rooms/index.ts
export * from './types';
export * from './services/PracticeRoomService';
export * from './hooks/usePracticeRooms';
// Internal files are not exported
```

## Future Enhancements

### Phase 1: Core Modules (Current)
- ✅ Practice Rooms
- ✅ Analytics
- ✅ Bots
- ✅ Integration Layer

### Phase 2: Extended Features
- [ ] Authentication module
- [ ] Dashboard module
- [ ] AI Roleplay module refactor
- [ ] Shared UI component library

### Phase 3: Advanced Integrations
- [ ] Salesforce full implementation
- [ ] HubSpot full implementation
- [ ] Zoho full implementation
- [ ] Webhook handling
- [ ] Data synchronization engine

### Phase 4: Enterprise Features
- [ ] Multi-tenancy support
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Advanced analytics
- [ ] White-labeling

## Migration Strategy

Existing code can be gradually migrated:

1. **Identify module boundaries** in current code
2. **Extract business logic** into services
3. **Create hooks** for React components
4. **Update imports** to use new module structure
5. **Remove legacy code** once migration is complete

## Testing

Each module can be tested independently:

```typescript
import { practiceRoomService } from '@/modules/practice-rooms';

describe('PracticeRoomService', () => {
  it('should create a room', async () => {
    const roomData = { /* ... */ };
    const response = await practiceRoomService.createRoom(roomData);

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
```

## Support

For questions or issues:
1. Check this guide
2. Review `ARCHITECTURE.md` for system design
3. Examine module `index.ts` for public APIs
4. Look at existing implementations for patterns
