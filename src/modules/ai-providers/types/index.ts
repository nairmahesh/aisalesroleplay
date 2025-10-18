import { BaseEntity } from '../../../core/types';

export enum AIProviderType {
  AMAZON_BEDROCK = 'amazon_bedrock',
  SMALLEST_AI = 'smallest_ai',
  OPENAI = 'openai',
}

export enum VoiceProviderType {
  ELEVENLABS = 'elevenlabs',
  AWS_POLLY = 'aws_polly',
}

export interface AIProviderConfig extends BaseEntity {
  provider_type: AIProviderType;
  model_name: string;
  api_key?: string;
  region?: string;
  endpoint?: string;
  is_active: boolean;
  language: string;
  temperature?: number;
  max_tokens?: number;
  settings?: Record<string, any>;
}

export interface VoiceProviderConfig extends BaseEntity {
  provider_type: VoiceProviderType;
  voice_id: string;
  api_key?: string;
  is_active: boolean;
  language: string;
  settings?: Record<string, any>;
}

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ConversationContext {
  botPersona: string;
  conversationHistory: ConversationMessage[];
  userProfile?: {
    name: string;
    role: string;
  };
}

export interface LLMRequest {
  messages: ConversationMessage[];
  temperature?: number;
  max_tokens?: number;
  stop?: string[];
}

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  finish_reason?: string;
}

export interface TTSRequest {
  text: string;
  voiceId: string;
  settings?: {
    stability?: number;
    similarity_boost?: number;
    speed?: number;
  };
}

export interface TTSResponse {
  audio: ArrayBuffer | Blob;
  contentType: string;
  duration?: number;
}

export interface AIProviderSettings {
  llm: {
    provider: AIProviderType;
    model: string;
    language: string;
  };
  voice: {
    provider: VoiceProviderType;
    voiceId: string;
    language: string;
  };
}
