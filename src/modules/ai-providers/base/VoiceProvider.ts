import { TTSRequest, TTSResponse, VoiceProviderConfig } from '../types';

export abstract class VoiceProvider {
  protected config: VoiceProviderConfig;

  constructor(config: VoiceProviderConfig) {
    this.config = config;
  }

  abstract getName(): string;

  abstract testConnection(): Promise<boolean>;

  abstract synthesize(request: TTSRequest): Promise<TTSResponse>;

  abstract getAvailableVoices(): Promise<Array<{ id: string; name: string; language: string }>>;

  updateConfig(config: Partial<VoiceProviderConfig>): void {
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
    throw new Error(`Voice Provider error: ${error.message || error}`);
  }
}
