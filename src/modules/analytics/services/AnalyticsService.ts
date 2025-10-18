import { BaseService } from '../../../core/services/BaseService';
import { ApiResponse } from '../../../core/types';
import { supabase } from '../../../lib/supabase';
import {
  CallAnalytics,
  CallScore,
  ScoringCriteria,
  PerformanceMetrics,
  AnalyticsFilters,
} from '../types';

export class AnalyticsService extends BaseService {
  private static instance: AnalyticsService;

  private constructor() {
    super();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async getCallAnalytics(callId: string): Promise<ApiResponse<CallAnalytics>> {
    try {
      const { data, error } = await supabase
        .from('call_analytics')
        .select('*')
        .eq('call_id', callId)
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getCallScores(callId: string): Promise<ApiResponse<CallScore[]>> {
    try {
      const { data, error } = await supabase
        .from('call_scores')
        .select('*')
        .eq('call_id', callId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return this.success(data || []);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getScoringCriteria(): Promise<ApiResponse<ScoringCriteria[]>> {
    try {
      const { data, error } = await supabase
        .from('scoring_criteria')
        .select('*')
        .eq('is_active', true)
        .order('category, name');

      if (error) throw error;

      return this.success(data || []);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getPerformanceMetrics(
    userId: string,
    filters?: AnalyticsFilters
  ): Promise<ApiResponse<PerformanceMetrics>> {
    try {
      let query = supabase
        .from('call_analytics')
        .select('*')
        .eq('user_id', userId);

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const calls = data || [];
      const totalCalls = calls.length;
      const averageScore =
        totalCalls > 0
          ? calls.reduce((sum, call) => sum + call.overall_score, 0) / totalCalls
          : 0;
      const averageDuration =
        totalCalls > 0
          ? calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls
          : 0;

      const metrics: PerformanceMetrics = {
        totalCalls,
        averageScore,
        averageDuration,
        improvementRate: 0,
        topStrengths: [],
        areasForImprovement: [],
      };

      return this.success(metrics);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async createCallAnalytics(
    callData: Omit<CallAnalytics, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<CallAnalytics>> {
    try {
      const { data, error } = await supabase
        .from('call_analytics')
        .insert([callData])
        .select()
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async createCallScore(
    scoreData: Omit<CallScore, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<CallScore>> {
    try {
      const { data, error } = await supabase
        .from('call_scores')
        .insert([scoreData])
        .select()
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
