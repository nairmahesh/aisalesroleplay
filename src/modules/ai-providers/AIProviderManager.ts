import { LLMProvider } from './base/LLMProvider';
import { VoiceProvider } from './base/VoiceProvider';
import {
  AIProviderType,
  VoiceProviderType,
  AIProviderConfig,
  VoiceProviderConfig,
  ConversationMessage,
  LLMRequest,
  LLMResponse,
  TTSRequest,
  TTSResponse,
} from './types';
import { AmazonBedrockProvider } from './providers/AmazonBedrockProvider';
import { SmallestAIProvider } from './providers/SmallestAIProvider';
import { ElevenLabsProvider } from './providers/ElevenLabsProvider';

export class AIProviderManager {
  private static instance: AIProviderManager;
  private llmProviders: Map<string, LLMProvider> = new Map();
  private voiceProviders: Map<string, VoiceProvider> = new Map();
  private activeLLMProvider: LLMProvider | null = null;
  private activeVoiceProvider: VoiceProvider | null = null;

  private constructor() {}

  static getInstance(): AIProviderManager {
    if (!AIProviderManager.instance) {
      AIProviderManager.instance = new AIProviderManager();
    }
    return AIProviderManager.instance;
  }

  registerLLMProvider(config: AIProviderConfig): void {
    let provider: LLMProvider;

    switch (config.provider_type) {
      case AIProviderType.AMAZON_BEDROCK:
        provider = new AmazonBedrockProvider(config);
        break;
      case AIProviderType.SMALLEST_AI:
        provider = new SmallestAIProvider(config);
        break;
      default:
        throw new Error(`Unsupported LLM provider: ${config.provider_type}`);
    }

    const key = `${config.provider_type}_${config.language}`;
    this.llmProviders.set(key, provider);

    if (config.is_active) {
      this.activeLLMProvider = provider;
    }
  }

  registerVoiceProvider(config: VoiceProviderConfig): void {
    let provider: VoiceProvider;

    switch (config.provider_type) {
      case VoiceProviderType.ELEVENLABS:
        provider = new ElevenLabsProvider(config);
        break;
      default:
        throw new Error(`Unsupported voice provider: ${config.provider_type}`);
    }

    const key = `${config.provider_type}_${config.language}`;
    this.voiceProviders.set(key, provider);

    if (config.is_active) {
      this.activeVoiceProvider = provider;
    }
  }

  setActiveLLMProvider(providerType: AIProviderType, language: string): void {
    const key = `${providerType}_${language}`;
    const provider = this.llmProviders.get(key);

    if (!provider) {
      throw new Error(`LLM provider not found: ${key}`);
    }

    this.activeLLMProvider = provider;
  }

  setActiveVoiceProvider(providerType: VoiceProviderType, language: string): void {
    const key = `${providerType}_${language}`;
    const provider = this.voiceProviders.get(key);

    if (!provider) {
      throw new Error(`Voice provider not found: ${key}`);
    }

    this.activeVoiceProvider = provider;
  }

  async chat(messages: ConversationMessage[]): Promise<LLMResponse> {
    if (!this.activeLLMProvider) {
      throw new Error('No active LLM provider configured');
    }

    const request: LLMRequest = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    return this.activeLLMProvider.chat(request);
  }

  async streamChat(
    messages: ConversationMessage[],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.activeLLMProvider) {
      throw new Error('No active LLM provider configured');
    }

    const request: LLMRequest = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    return this.activeLLMProvider.streamChat(request, onChunk);
  }

  async textToSpeech(text: string, voiceId?: string): Promise<TTSResponse> {
    if (!this.activeVoiceProvider) {
      throw new Error('No active voice provider configured');
    }

    const request: TTSRequest = {
      text,
      voiceId: voiceId || this.activeVoiceProvider.config.voice_id,
    };

    return this.activeVoiceProvider.synthesize(request);
  }

  async getAvailableVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    if (!this.activeVoiceProvider) {
      return [];
    }

    return this.activeVoiceProvider.getAvailableVoices();
  }

  getActiveLLMProvider(): LLMProvider | null {
    return this.activeLLMProvider;
  }

  getActiveVoiceProvider(): VoiceProvider | null {
    return this.activeVoiceProvider;
  }

  getAllLLMProviders(): LLMProvider[] {
    return Array.from(this.llmProviders.values());
  }

  getAllVoiceProviders(): VoiceProvider[] {
    return Array.from(this.voiceProviders.values());
  }

  clearAll(): void {
    this.llmProviders.clear();
    this.voiceProviders.clear();
    this.activeLLMProvider = null;
    this.activeVoiceProvider = null;
  }
}

export const aiProviderManager = AIProviderManager.getInstance();
