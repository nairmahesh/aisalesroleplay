import { LLMRequest, LLMResponse, AIProviderConfig } from '../types';

export abstract class LLMProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract getName(): string;

  abstract testConnection(): Promise<boolean>;

  abstract chat(request: LLMRequest): Promise<LLMResponse>;

  abstract streamChat(
    request: LLMRequest,
    onChunk: (chunk: string) => void
  ): Promise<void>;

  updateConfig(config: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isEnabled(): boolean {
    return this.config.is_active;
  }

  getLanguage(): string {
    return this.config.language;
  }

  protected handleError(error: any): never {
    console.error(`[${this.getName()}] Error:`, error);
    throw new Error(`LLM Provider error: ${error.message || error}`);
  }
}
