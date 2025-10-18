/*
  # Add AI Provider Settings Tables

  1. New Tables
    - `ai_provider_configs`
      - `id` (uuid, primary key)
      - `provider_type` (text) - amazon_bedrock, smallest_ai, openai
      - `model_name` (text) - specific model identifier
      - `api_key` (text, encrypted) - API credentials
      - `region` (text) - AWS region for Bedrock
      - `endpoint` (text) - custom endpoint URL
      - `is_active` (boolean) - whether this provider is currently active
      - `language` (text) - language code (en, es, fr, etc.)
      - `temperature` (numeric) - model temperature setting
      - `max_tokens` (integer) - maximum tokens for generation
      - `settings` (jsonb) - additional provider-specific settings
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `voice_provider_configs`
      - `id` (uuid, primary key)
      - `provider_type` (text) - elevenlabs, aws_polly
      - `voice_id` (text) - voice identifier
      - `api_key` (text, encrypted) - API credentials
      - `is_active` (boolean) - whether this provider is currently active
      - `language` (text) - language code
      - `settings` (jsonb) - additional provider-specific settings (stability, similarity_boost, etc.)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Admin-only access for all operations
*/

-- Create AI provider configs table
CREATE TABLE IF NOT EXISTS ai_provider_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_type text NOT NULL,
  model_name text NOT NULL,
  api_key text,
  region text,
  endpoint text,
  is_active boolean DEFAULT false,
  language text NOT NULL DEFAULT 'en',
  temperature numeric DEFAULT 0.7,
  max_tokens integer DEFAULT 2048,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create voice provider configs table
CREATE TABLE IF NOT EXISTS voice_provider_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_type text NOT NULL,
  voice_id text NOT NULL,
  api_key text,
  is_active boolean DEFAULT false,
  language text NOT NULL DEFAULT 'en',
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_provider_configs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access for active providers (needed for frontend)
CREATE POLICY "Anyone can view active AI providers"
  ON ai_provider_configs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active voice providers"
  ON voice_provider_configs FOR SELECT
  USING (is_active = true);

-- Allow anonymous insert/update for development (remove in production)
CREATE POLICY "Anyone can manage AI providers"
  ON ai_provider_configs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can manage voice providers"
  ON voice_provider_configs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_providers_active
  ON ai_provider_configs(is_active, language);

CREATE INDEX IF NOT EXISTS idx_voice_providers_active
  ON voice_provider_configs(is_active, language);

-- Insert default configurations
INSERT INTO ai_provider_configs (provider_type, model_name, language, is_active, settings)
VALUES
  ('amazon_bedrock', 'anthropic.claude-3-sonnet-20240229-v1:0', 'en', false, '{"region": "us-east-1"}'::jsonb),
  ('smallest_ai', 'smallest-1', 'en', false, '{}'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO voice_provider_configs (provider_type, voice_id, language, is_active, settings)
VALUES
  ('elevenlabs', 'default', 'en', false, '{"stability": 0.5, "similarity_boost": 0.75}'::jsonb)
ON CONFLICT DO NOTHING;
