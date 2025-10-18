import { VoiceProvider } from '../base/VoiceProvider';
import { TTSRequest, TTSResponse, VoiceProviderConfig } from '../types';

export class ElevenLabsProvider extends VoiceProvider {
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(config: VoiceProviderConfig) {
    super(config);
  }

  getName(): string {
    return 'ElevenLabs';
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.config.api_key || '',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('ElevenLabs connection test failed:', error);
      return false;
    }
  }

  async synthesize(request: TTSRequest): Promise<TTSResponse> {
    try {
      const voiceId = request.voiceId || this.config.voice_id;

      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.config.api_key || '',
          },
          body: JSON.stringify({
            text: request.text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: request.settings?.stability || 0.5,
              similarity_boost: request.settings?.similarity_boost || 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail?.message || 'ElevenLabs API error');
      }

      const audio = await response.arrayBuffer();

      return {
        audio,
        contentType: 'audio/mpeg',
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAvailableVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.config.api_key || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();

      return data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        language: voice.labels?.language || 'en',
      }));
    } catch (error) {
      console.error('Failed to get voices:', error);
      return [];
    }
  }
}
