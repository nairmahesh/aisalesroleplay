import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or API key is missing. Some features may not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'sales_rep' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Bot {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  personality: string;
  call_type: string;
  language: string;
  avatar_initials: string;
  avatar_color: string;
  brief_profile: string;
  detailed_profile: string;
  dos: string[];
  donts: string[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CallSession {
  id: string;
  user_id: string;
  bot_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  is_multi_party: boolean;
  status: 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
}

export interface CallAnalytics {
  id: string;
  session_id: string;
  user_talk_percentage: number;
  bot_talk_percentage: number;
  user_sentiment_score: number;
  bot_sentiment_score: number;
  evaluation_framework: 'BANT' | 'MEDDIC' | 'MEDDPICC' | 'SPIN';
  framework_score: number;
  budget_identified: boolean;
  authority_identified: boolean;
  need_identified: boolean;
  timeline_identified: boolean;
  key_points: string[];
  strengths: string[];
  improvements: string[];
  created_at: string;
}
