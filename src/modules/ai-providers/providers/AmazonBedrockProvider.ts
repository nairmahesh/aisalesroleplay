import { LLMProvider } from '../base/LLMProvider';
import { LLMRequest, LLMResponse, AIProviderConfig } from '../types';

export class AmazonBedrockProvider extends LLMProvider {
  constructor(config: AIProviderConfig) {
    super(config);
  }

  getName(): string {
    return 'Amazon Bedrock';
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
      console.error('Bedrock connection test failed:', error);
      return false;
    }
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    try {
      const endpoint = this.config.endpoint || this.getBedrockEndpoint();

      const body = this.formatRequest(request);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api_key}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Bedrock API error');
      }

      const data = await response.json();

      return this.parseResponse(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async streamChat(
    request: LLMRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const endpoint = this.getBedrockEndpoint();

      const body = this.formatRequest(request);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api_key}`,
        },
        body: JSON.stringify({ ...body, stream: true }),
      });

      if (!response.ok) {
        throw new Error('Bedrock streaming error');
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
          try {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);

              if (data.completion) {
                onChunk(data.completion);
              }
            }
          } catch (e) {
            continue;
          }
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private getBedrockEndpoint(): string {
    const region = this.config.region || 'us-east-1';
    const modelId = this.config.model_name || 'anthropic.claude-3-sonnet-20240229-v1:0';

    return `https://bedrock-runtime.${region}.amazonaws.com/model/${modelId}/invoke`;
  }

  private formatRequest(request: LLMRequest): any {
    const modelId = this.config.model_name || '';

    if (modelId.includes('claude')) {
      return {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: request.max_tokens || this.config.max_tokens || 4096,
        temperature: request.temperature || this.config.temperature || 0.7,
        messages: request.messages.map((msg) => ({
          role: msg.role === 'system' ? 'assistant' : msg.role,
          content: msg.content,
        })),
      };
    }

    if (modelId.includes('llama')) {
      const prompt = this.buildLlamaPrompt(request.messages);
      return {
        prompt,
        max_gen_len: request.max_tokens || this.config.max_tokens || 2048,
        temperature: request.temperature || this.config.temperature || 0.7,
      };
    }

    return {
      inputText: request.messages[request.messages.length - 1].content,
      textGenerationConfig: {
        maxTokenCount: request.max_tokens || this.config.max_tokens || 4096,
        temperature: request.temperature || this.config.temperature || 0.7,
      },
    };
  }

  private buildLlamaPrompt(messages: Array<{ role: string; content: string }>): string {
    let prompt = '';

    for (const msg of messages) {
      if (msg.role === 'system') {
        prompt += `<<SYS>>\n${msg.content}\n<</SYS>>\n\n`;
      } else if (msg.role === 'user') {
        prompt += `[INST] ${msg.content} [/INST]\n`;
      } else if (msg.role === 'assistant') {
        prompt += `${msg.content}\n`;
      }
    }

    return prompt;
  }

  private parseResponse(data: any): LLMResponse {
    const modelId = this.config.model_name || '';

    if (modelId.includes('claude')) {
      return {
        content: data.content[0].text,
        usage: {
          prompt_tokens: data.usage.input_tokens,
          completion_tokens: data.usage.output_tokens,
          total_tokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        finish_reason: data.stop_reason,
      };
    }

    if (modelId.includes('llama')) {
      return {
        content: data.generation,
        finish_reason: data.stop_reason,
      };
    }

    return {
      content: data.results?.[0]?.outputText || data.completion || '',
    };
  }
}
