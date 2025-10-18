import { LLMProvider } from '../base/LLMProvider';
import { LLMRequest, LLMResponse, AIProviderConfig } from '../types';

export class SmallestAIProvider extends LLMProvider {
  private readonly baseUrl = 'https://api.smallest.ai/v1';

  constructor(config: AIProviderConfig) {
    super(config);
  }

  getName(): string {
    return 'Smallest.ai';
  }

  async testConnection(): Promise<boolean> {
    try {
      const testRequest: LLMRequest = {
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      };

      await this.chat(testRequest);
      return true;
    } catch (error) {
      console.error('Smallest.ai connection test failed:', error);
      return false;
    }
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    try {
      const endpoint = this.config.endpoint || `${this.baseUrl}/chat/completions`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api_key}`,
        },
        body: JSON.stringify({
          model: this.config.model_name || 'smallest-1',
          messages: request.messages,
          temperature: request.temperature || this.config.temperature || 0.7,
          max_tokens: request.max_tokens || this.config.max_tokens || 2048,
          stop: request.stop,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Smallest.ai API error');
      }

      const data = await response.json();

      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        model: data.model,
        finish_reason: data.choices[0].finish_reason,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async streamChat(
    request: LLMRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const endpoint = this.config.endpoint || `${this.baseUrl}/chat/completions`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api_key}`,
        },
        body: JSON.stringify({
          model: this.config.model_name || 'smallest-1',
          messages: request.messages,
          temperature: request.temperature || this.config.temperature || 0.7,
          max_tokens: request.max_tokens || this.config.max_tokens || 2048,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Smallest.ai streaming error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);

            if (jsonStr === '[DONE]') {
              break;
            }

            try {
              const data = JSON.parse(jsonStr);
              const content = data.choices[0]?.delta?.content;

              if (content) {
                onChunk(content);
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }
}
