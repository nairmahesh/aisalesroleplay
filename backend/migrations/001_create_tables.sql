-- Create users table with password authentication
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'sales_rep' CHECK (role IN ('sales_rep', 'manager', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  industry text NOT NULL,
  personality text NOT NULL,
  call_type text NOT NULL,
  language text DEFAULT 'English (US)',
  avatar_initials text NOT NULL,
  avatar_color text NOT NULL,
  brief_profile text NOT NULL,
  detailed_profile text NOT NULL,
  dos text[] DEFAULT '{}',
  donts text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create call_sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  bot_id uuid NOT NULL REFERENCES bots(id),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer,
  is_multi_party boolean DEFAULT false,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now()
);

-- Create call_transcripts table
CREATE TABLE IF NOT EXISTS call_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  speaker text NOT NULL CHECK (speaker IN ('user', 'bot')),
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative'))
);

-- Create call_analytics table
CREATE TABLE IF NOT EXISTS call_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid UNIQUE NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  user_talk_percentage numeric(5,2) DEFAULT 0,
  bot_talk_percentage numeric(5,2) DEFAULT 0,
  user_sentiment_score numeric(3,2) DEFAULT 0,
  bot_sentiment_score numeric(3,2) DEFAULT 0,
  evaluation_framework text CHECK (evaluation_framework IN ('BANT', 'MEDDIC', 'MEDDPICC', 'SPIN')),
  framework_score numeric(5,2) DEFAULT 0,
  budget_identified boolean DEFAULT false,
  authority_identified boolean DEFAULT false,
  need_identified boolean DEFAULT false,
  timeline_identified boolean DEFAULT false,
  key_points text[] DEFAULT '{}',
  strengths text[] DEFAULT '{}',
  improvements text[] DEFAULT '{}',
  total_score integer DEFAULT 0,
  max_score integer DEFAULT 100,
  overall_feedback text,
  created_at timestamptz DEFAULT now()
);

-- Create scoring_criteria table
CREATE TABLE IF NOT EXISTS scoring_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  max_score integer NOT NULL DEFAULT 10,
  category text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create call_scores table
CREATE TABLE IF NOT EXISTS call_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  criteria_id uuid NOT NULL REFERENCES scoring_criteria(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  feedback text,
  transcript_evidence text,
  timestamp text,
  improvement_examples text[],
  transcript_references jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, criteria_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bots_industry ON bots(industry);
CREATE INDEX IF NOT EXISTS idx_bots_call_type ON bots(call_type);
CREATE INDEX IF NOT EXISTS idx_call_sessions_user_id ON call_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_bot_id ON call_sessions(bot_id);
CREATE INDEX IF NOT EXISTS idx_call_transcripts_session_id ON call_transcripts(session_id);
CREATE INDEX IF NOT EXISTS idx_call_analytics_session_id ON call_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_call_scores_session_id ON call_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_call_scores_criteria_id ON call_scores(criteria_id);
