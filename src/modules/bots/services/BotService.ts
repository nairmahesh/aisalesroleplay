import { BaseService } from '../../../core/services/BaseService';
import { ApiResponse } from '../../../core/types';
import { supabase } from '../../../lib/supabase';
import { Bot, CreateBotData, UpdateBotData, BotFilters } from '../types';

export class BotService extends BaseService {
  private static instance: BotService;

  private constructor() {
    super();
  }

  static getInstance(): BotService {
    if (!BotService.instance) {
      BotService.instance = new BotService();
    }
    return BotService.instance;
  }

  async getBots(filters?: BotFilters): Promise<ApiResponse<Bot[]>> {
    try {
      let query = supabase
        .from('bots')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.industry) {
        query = query.eq('industry', filters.industry);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query;

      if (error) throw error;

      let bots = data || [];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        bots = bots.filter(
          (bot) =>
            bot.name.toLowerCase().includes(searchLower) ||
            bot.company.toLowerCase().includes(searchLower) ||
            bot.role.toLowerCase().includes(searchLower)
        );
      }

      return this.success(bots);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getBotById(id: string): Promise<ApiResponse<Bot>> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async createBot(botData: CreateBotData): Promise<ApiResponse<Bot>> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .insert([
          {
            ...botData,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async updateBot(id: string, botData: UpdateBotData): Promise<ApiResponse<Bot>> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .update(botData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async deleteBot(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('bots').delete().eq('id', id);

      if (error) throw error;

      return this.success(undefined);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async toggleBotStatus(id: string, is_active: boolean): Promise<ApiResponse<Bot>> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }
}

export const botService = BotService.getInstance();
