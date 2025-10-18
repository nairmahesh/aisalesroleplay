import { BaseService } from '../../../core/services/BaseService';
import { ApiResponse } from '../../../core/types';
import { supabase } from '../../../lib/supabase';
import { AIProviderConfig, VoiceProviderConfig, AIProviderType, VoiceProviderType } from '../types';
import { aiProviderManager } from '../AIProviderManager';

export class AIProviderService extends BaseService {
  private static instance: AIProviderService;

  private constructor() {
    super();
  }

  static getInstance(): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService();
    }
    return AIProviderService.instance;
  }

  async initializeProviders(): Promise<void> {
    try {
      const llmConfigs = await this.getLLMConfigs();
      const voiceConfigs = await this.getVoiceConfigs();

      if (llmConfigs.success && llmConfigs.data) {
        for (const config of llmConfigs.data) {
          aiProviderManager.registerLLMProvider(config);
        }
      }

      if (voiceConfigs.success && voiceConfigs.data) {
        for (const config of voiceConfigs.data) {
          aiProviderManager.registerVoiceProvider(config);
        }
      }
    } catch (error) {
      console.error('Failed to initialize AI providers:', error);
    }
  }

  async getLLMConfigs(): Promise<ApiResponse<AIProviderConfig[]>> {
    try {
      const { data, error } = await supabase
        .from('ai_provider_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return this.success(data || []);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getVoiceConfigs(): Promise<ApiResponse<VoiceProviderConfig[]>> {
    try {
      const { data, error } = await supabase
        .from('voice_provider_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return this.success(data || []);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getActiveLLMConfig(language: string = 'en'): Promise<ApiResponse<AIProviderConfig>> {
    try {
      const { data, error } = await supabase
        .from('ai_provider_configs')
        .select('*')
        .eq('is_active', true)
        .eq('language', language)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return this.error({
          code: 'NOT_FOUND',
          message: 'No active LLM provider found',
        });
      }

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getActiveVoiceConfig(language: string = 'en'): Promise<ApiResponse<VoiceProviderConfig>> {
    try {
      const { data, error } = await supabase
        .from('voice_provider_configs')
        .select('*')
        .eq('is_active', true)
        .eq('language', language)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return this.error({
          code: 'NOT_FOUND',
          message: 'No active voice provider found',
        });
      }

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async createLLMConfig(config: Omit<AIProviderConfig, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<AIProviderConfig>> {
    try {
      if (config.is_active) {
        await this.deactivateAllLLMProviders(config.language);
      }

      const { data, error } = await supabase
        .from('ai_provider_configs')
        .insert([config])
        .select()
        .single();

      if (error) throw error;

      await this.initializeProviders();

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async createVoiceConfig(config: Omit<VoiceProviderConfig, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<VoiceProviderConfig>> {
    try {
      if (config.is_active) {
        await this.deactivateAllVoiceProviders(config.language);
      }

      const { data, error } = await supabase
        .from('voice_provider_configs')
        .insert([config])
        .select()
        .single();

      if (error) throw error;

      await this.initializeProviders();

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async updateLLMConfig(id: string, updates: Partial<AIProviderConfig>): Promise<ApiResponse<AIProviderConfig>> {
    try {
      if (updates.is_active) {
        const config = await supabase
          .from('ai_provider_configs')
          .select('language')
          .eq('id', id)
          .single();

        if (config.data) {
          await this.deactivateAllLLMProviders(config.data.language);
        }
      }

      const { data, error } = await supabase
        .from('ai_provider_configs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.initializeProviders();

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async updateVoiceConfig(id: string, updates: Partial<VoiceProviderConfig>): Promise<ApiResponse<VoiceProviderConfig>> {
    try {
      if (updates.is_active) {
        const config = await supabase
          .from('voice_provider_configs')
          .select('language')
          .eq('id', id)
          .single();

        if (config.data) {
          await this.deactivateAllVoiceProviders(config.data.language);
        }
      }

      const { data, error } = await supabase
        .from('voice_provider_configs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.initializeProviders();

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async deleteLLMConfig(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('ai_provider_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return this.success(undefined);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async deleteVoiceConfig(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('voice_provider_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return this.success(undefined);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  private async deactivateAllLLMProviders(language: string): Promise<void> {
    await supabase
      .from('ai_provider_configs')
      .update({ is_active: false })
      .eq('language', language)
      .eq('is_active', true);
  }

  private async deactivateAllVoiceProviders(language: string): Promise<void> {
    await supabase
      .from('voice_provider_configs')
      .update({ is_active: false })
      .eq('language', language)
      .eq('is_active', true);
  }
}

export const aiProviderService = AIProviderService.getInstance();
