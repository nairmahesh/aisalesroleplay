# AI Providers Integration Guide

## Overview

This application supports multiple AI providers for language models and voice synthesis, allowing administrators to choose the best solution for their needs based on cost, performance, language support, and features.

## Supported Providers

### Language Model Providers

1. **Amazon Bedrock**
   - Models: Claude 3, Llama 2, Titan, and more
   - Region: Configurable AWS region
   - Best for: Enterprise customers already using AWS

2. **Smallest.ai**
   - Compact, efficient models
   - Cost-effective solution
   - Best for: High-volume use cases with budget constraints

3. **OpenAI** (Future support)
   - GPT-4, GPT-3.5-turbo
   - Best for: High-quality responses

### Voice Synthesis Providers

1. **ElevenLabs**
   - High-quality, natural-sounding voices
   - Multiple languages
   - Voice cloning capabilities
   - Best for: Premium voice quality

2. **AWS Polly** (Future support)
   - Good quality, cost-effective
   - Many languages
   - Best for: Enterprise AWS customers

## Setup Instructions

### 1. Amazon Bedrock

#### Prerequisites
- AWS Account with Bedrock access
- IAM credentials with Bedrock permissions
- Model access enabled in AWS Console

#### Steps

1. **Enable Model Access**
   ```bash
   # Go to AWS Console → Bedrock → Model Access
   # Request access to Claude 3 or other models
   ```

2. **Create IAM User with Permissions**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. **Configure in Application**
   - Go to Admin → AI Providers
   - Click "Add Provider"
   - Select "Amazon Bedrock"
   - Enter:
     - Model: `anthropic.claude-3-sonnet-20240229-v1:0`
     - Region: `us-east-1` (or your preferred region)
     - API Key: Your AWS access key
     - Language: `en`
     - Temperature: `0.7`
     - Max Tokens: `4096`

4. **Set as Active**
   - Click the checkmark icon to activate

### 2. Smallest.ai

#### Prerequisites
- Smallest.ai account
- API key from dashboard

#### Steps

1. **Get API Key**
   - Visit https://smallest.ai/
   - Sign up or log in
   - Go to API Keys section
   - Create new API key

2. **Configure in Application**
   - Go to Admin → AI Providers
   - Click "Add Provider"
   - Select "Smallest.ai"
   - Enter:
     - Model: `smallest-1`
     - API Key: Your Smallest.ai API key
     - Language: `en`
     - Temperature: `0.7`
     - Max Tokens: `2048`

3. **Set as Active**
   - Click the checkmark icon to activate

### 3. ElevenLabs

#### Prerequisites
- ElevenLabs account
- API key from dashboard

#### Steps

1. **Get API Key**
   - Visit https://elevenlabs.io/
   - Sign up or log in
   - Go to Profile → API Keys
   - Copy your API key

2. **Choose Voice**
   - Go to Voice Library
   - Select or create a voice
   - Copy the Voice ID

3. **Configure in Application**
   - Go to Admin → AI Providers
   - Click "Add Provider" in Voice Synthesis section
   - Select "ElevenLabs"
   - Enter:
     - Voice ID: Your chosen voice ID
     - API Key: Your ElevenLabs API key
     - Language: `en`
     - Settings:
       - Stability: `0.5` (0-1, lower = more varied)
       - Similarity Boost: `0.75` (0-1, higher = more similar to original)

4. **Set as Active**
   - Click the checkmark icon to activate

## Usage in Code

### Conversation with LLM

```typescript
import { aiProviderManager, ConversationMessage } from '@/modules/ai-providers';

const messages: ConversationMessage[] = [
  {
    role: 'system',
    content: 'You are a helpful sales prospect named John.',
  },
  {
    role: 'user',
    content: 'Hi John, I wanted to discuss our product with you.',
  },
];

// Get response
const response = await aiProviderManager.chat(messages);
console.log(response.content);

// Stream response
await aiProviderManager.streamChat(messages, (chunk) => {
  console.log('Received chunk:', chunk);
});
```

### Text-to-Speech

```typescript
import { aiProviderManager } from '@/modules/ai-providers';

// Convert text to speech
const response = await aiProviderManager.textToSpeech(
  'Hello! Nice to meet you.',
  'voice-id-optional'
);

// Play audio
const audioBlob = new Blob([response.audio], { type: response.contentType });
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

### Get Available Voices

```typescript
const voices = await aiProviderManager.getAvailableVoices();

voices.forEach((voice) => {
  console.log(`${voice.name} (${voice.language}): ${voice.id}`);
});
```

## Multi-Language Support

The system supports multiple languages simultaneously. To add a new language:

1. **Add LLM Provider for Language**
   ```typescript
   // Add Spanish language support
   {
     provider_type: 'smallest_ai',
     model_name: 'smallest-1',
     language: 'es',
     is_active: true,
     // ... other settings
   }
   ```

2. **Add Voice Provider for Language**
   ```typescript
   // Add Spanish voice
   {
     provider_type: 'elevenlabs',
     voice_id: 'spanish-voice-id',
     language: 'es',
     is_active: true,
   }
   ```

3. **Switch Language at Runtime**
   ```typescript
   import { aiProviderManager, AIProviderType, VoiceProviderType } from '@/modules/ai-providers';

   // Switch to Spanish
   aiProviderManager.setActiveLLMProvider(AIProviderType.SMALLEST_AI, 'es');
   aiProviderManager.setActiveVoiceProvider(VoiceProviderType.ELEVENLABS, 'es');
   ```

## Cost Optimization

### Amazon Bedrock Pricing
- Claude 3 Sonnet: ~$0.015 per 1K input tokens, ~$0.075 per 1K output tokens
- Use lower max_tokens to control costs
- Consider Haiku for lower-cost option

### Smallest.ai Pricing
- Typically lower than major providers
- Check their pricing page for current rates
- Good for high-volume scenarios

### ElevenLabs Pricing
- ~$0.18 per 1K characters
- Free tier: 10K characters/month
- Creator plan: 30K characters/month for $5

### Optimization Tips

1. **Cache Responses**
   ```typescript
   // Cache common bot responses
   const cachedResponses = new Map<string, string>();

   function getCachedResponse(input: string) {
     const cached = cachedResponses.get(input);
     if (cached) return cached;

     // If not cached, get from AI and cache it
     const response = await aiProviderManager.chat([...]);
     cachedResponses.set(input, response.content);
     return response.content;
   }
   ```

2. **Reduce Token Usage**
   ```typescript
   // Limit conversation history
   const recentMessages = messages.slice(-10); // Keep last 10 messages

   // Use shorter system prompts
   // Summarize old messages before sending
   ```

3. **Batch Requests**
   ```typescript
   // Process multiple requests together when possible
   const responses = await Promise.all([
     aiProviderManager.chat(messages1),
     aiProviderManager.chat(messages2),
   ]);
   ```

## Error Handling

```typescript
import { aiProviderManager } from '@/modules/ai-providers';

try {
  const response = await aiProviderManager.chat(messages);
  console.log(response.content);
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limiting
    console.log('Rate limited, retrying in 1 second...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Retry
  } else if (error.message.includes('authentication')) {
    // Handle auth errors
    console.error('Invalid API key');
  } else {
    // Handle other errors
    console.error('AI Provider error:', error);
  }
}
```

## Testing Connections

```typescript
import { aiProviderService } from '@/modules/ai-providers';

// Test LLM provider
const llmConfig = await aiProviderService.getActiveLLMConfig('en');
if (llmConfig.success && llmConfig.data) {
  const provider = new AmazonBedrockProvider(llmConfig.data);
  const isConnected = await provider.testConnection();
  console.log('LLM connected:', isConnected);
}

// Test voice provider
const voiceConfig = await aiProviderService.getActiveVoiceConfig('en');
if (voiceConfig.success && voiceConfig.data) {
  const provider = new ElevenLabsProvider(voiceConfig.data);
  const isConnected = await provider.testConnection();
  console.log('Voice provider connected:', isConnected);
}
```

## Database Schema

### ai_provider_configs

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| provider_type | text | amazon_bedrock, smallest_ai, openai |
| model_name | text | Model identifier |
| api_key | text | API credentials |
| region | text | AWS region (Bedrock only) |
| endpoint | text | Custom endpoint URL |
| is_active | boolean | Active status |
| language | text | Language code (en, es, fr, etc.) |
| temperature | numeric | Model temperature (0-1) |
| max_tokens | integer | Max generation tokens |
| settings | jsonb | Additional settings |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### voice_provider_configs

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| provider_type | text | elevenlabs, aws_polly |
| voice_id | text | Voice identifier |
| api_key | text | API credentials |
| is_active | boolean | Active status |
| language | text | Language code |
| settings | jsonb | Voice settings (stability, etc.) |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

## Security Considerations

1. **API Key Storage**
   - Store encrypted in database
   - Never expose in frontend code
   - Use environment variables for sensitive defaults

2. **Access Control**
   - Only admin users can configure providers
   - RLS policies enforce this at database level

3. **Rate Limiting**
   - Implement application-level rate limiting
   - Monitor usage per user/session

4. **Logging**
   - Log all AI interactions for audit
   - Don't log sensitive data
   - Monitor for abuse patterns

## Troubleshooting

### Common Issues

1. **"No active provider" error**
   - Check that at least one provider is marked as active
   - Verify language matches your request

2. **Authentication errors**
   - Verify API keys are correct
   - Check credentials haven't expired
   - For Bedrock, verify IAM permissions

3. **Empty responses**
   - Check max_tokens setting isn't too low
   - Verify model has access (Bedrock)
   - Check API quotas aren't exceeded

4. **Voice synthesis fails**
   - Verify voice ID is correct
   - Check API key permissions
   - Ensure voice supports target language

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('DEBUG_AI_PROVIDERS', 'true');

// Check active providers
console.log('Active LLM:', aiProviderManager.getActiveLLMProvider()?.getName());
console.log('Active Voice:', aiProviderManager.getActiveVoiceProvider()?.getName());

// List all registered providers
console.log('All LLM providers:', aiProviderManager.getAllLLMProviders());
console.log('All voice providers:', aiProviderManager.getAllVoiceProviders());
```

## Support

For issues or questions:
1. Check this guide
2. Review provider documentation
3. Test connection using built-in test function
4. Check browser console for errors
5. Verify database configurations
