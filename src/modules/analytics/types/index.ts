import { BaseEntity } from '../../../core/types';

export interface CallAnalytics extends BaseEntity {
  call_id: string;
  user_id: string;
  duration: number;
  overall_score: number;
  transcript: string;
  recording_url?: string;
  metadata?: Record<string, any>;
}

export interface ScoringCriteria extends BaseEntity {
  name: string;
  description: string;
  category: string;
  weight: number;
  is_active: boolean;
}

export interface CallScore extends BaseEntity {
  call_id: string;
  criteria_id: string;
  score: number;
  feedback: string;
  evidence: string[];
  suggestions: string[];
}

export interface PerformanceMetrics {
  totalCalls: number;
  averageScore: number;
  averageDuration: number;
  improvementRate: number;
  topStrengths: string[];
  areasForImprovement: string[];
}

export interface AnalyticsFilters {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  minScore?: number;
  maxScore?: number;
}
