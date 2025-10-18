import { BaseEntity } from '../../../core/types';

export interface Bot extends BaseEntity {
  name: string;
  persona: string;
  company: string;
  industry: string;
  role: string;
  challenges: string;
  objections: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  voice_id?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface CreateBotData {
  name: string;
  persona: string;
  company: string;
  industry: string;
  role: string;
  challenges: string;
  objections: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  voice_id?: string;
  avatar_url?: string;
}

export interface UpdateBotData extends Partial<CreateBotData> {
  is_active?: boolean;
}

export interface BotFilters {
  difficulty?: 'easy' | 'medium' | 'hard';
  industry?: string;
  search?: string;
  is_active?: boolean;
}
