interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    environment: 'development' | 'staging' | 'production';
  };
  features: {
    enableAnalytics: boolean;
    enableIntegrations: boolean;
    enableExternalInvites: boolean;
  };
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: EnvironmentConfig = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  app: {
    name: 'Sales Training Platform',
    environment: (import.meta.env.MODE as any) || 'development',
  },
  features: {
    enableAnalytics: true,
    enableIntegrations: true,
    enableExternalInvites: true,
  },
};
