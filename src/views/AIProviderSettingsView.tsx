import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
  aiProviderService,
  AIProviderConfig,
  VoiceProviderConfig,
  AIProviderType,
  VoiceProviderType,
} from '../modules/ai-providers';

export function AIProviderSettingsView() {
  const [llmConfigs, setLlmConfigs] = useState<AIProviderConfig[]>([]);
  const [voiceConfigs, setVoiceConfigs] = useState<VoiceProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddLLM, setShowAddLLM] = useState(false);
  const [showAddVoice, setShowAddVoice] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    setLoading(true);

    const [llmResponse, voiceResponse] = await Promise.all([
      aiProviderService.getLLMConfigs(),
      aiProviderService.getVoiceConfigs(),
    ]);

    if (llmResponse.success && llmResponse.data) {
      setLlmConfigs(llmResponse.data);
    }

    if (voiceResponse.success && voiceResponse.data) {
      setVoiceConfigs(voiceResponse.data);
    }

    setLoading(false);
  }

  async function toggleLLMActive(id: string) {
    setSaving(true);

    const config = llmConfigs.find((c) => c.id === id);
    if (config) {
      await aiProviderService.updateLLMConfig(id, {
        is_active: !config.is_active,
      });
    }

    await loadConfigs();
    setSaving(false);
  }

  async function toggleVoiceActive(id: string) {
    setSaving(true);

    const config = voiceConfigs.find((c) => c.id === id);
    if (config) {
      await aiProviderService.updateVoiceConfig(id, {
        is_active: !config.is_active,
      });
    }

    await loadConfigs();
    setSaving(false);
  }

  async function deleteLLMConfig(id: string) {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    setSaving(true);
    await aiProviderService.deleteLLMConfig(id);
    await loadConfigs();
    setSaving(false);
  }

  async function deleteVoiceConfig(id: string) {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    setSaving(true);
    await aiProviderService.deleteVoiceConfig(id);
    await loadConfigs();
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Loading AI provider settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Provider Settings</h1>
        <p className="text-slate-600">
          Configure language models and voice synthesis providers for AI roleplay conversations.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Language Model Providers</h2>
            <p className="text-sm text-slate-600 mt-1">
              Select which LLM provider and model to use for AI conversations
            </p>
          </div>
          <button
            onClick={() => setShowAddLLM(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Provider
          </button>
        </div>

        <div className="space-y-4">
          {llmConfigs.map((config) => (
            <div
              key={config.id}
              className="border border-slate-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">
                    {config.provider_type === AIProviderType.AMAZON_BEDROCK
                      ? 'Amazon Bedrock'
                      : config.provider_type === AIProviderType.SMALLEST_AI
                      ? 'Smallest.ai'
                      : 'OpenAI'}
                  </h3>
                  {config.is_active && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Model: <span className="font-mono">{config.model_name}</span></div>
                  <div>Language: <span className="font-medium">{config.language}</span></div>
                  <div>Temperature: {config.temperature} | Max Tokens: {config.max_tokens}</div>
                  {config.region && <div>Region: {config.region}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLLMActive(config.id)}
                  disabled={saving}
                  className={`p-2 rounded-lg transition-colors ${
                    config.is_active
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={config.is_active ? 'Deactivate' : 'Activate'}
                >
                  {config.is_active ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => deleteLLMConfig(config.id)}
                  disabled={saving}
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {llmConfigs.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No LLM providers configured. Add one to get started.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Voice Synthesis Providers</h2>
            <p className="text-sm text-slate-600 mt-1">
              Configure text-to-speech providers for AI voice responses
            </p>
          </div>
          <button
            onClick={() => setShowAddVoice(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Provider
          </button>
        </div>

        <div className="space-y-4">
          {voiceConfigs.map((config) => (
            <div
              key={config.id}
              className="border border-slate-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">
                    {config.provider_type === VoiceProviderType.ELEVENLABS
                      ? 'ElevenLabs'
                      : 'AWS Polly'}
                  </h3>
                  {config.is_active && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Voice ID: <span className="font-mono">{config.voice_id}</span></div>
                  <div>Language: <span className="font-medium">{config.language}</span></div>
                  {config.settings && (
                    <div>
                      Settings: Stability {config.settings.stability || 0.5} |
                      Similarity {config.settings.similarity_boost || 0.75}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVoiceActive(config.id)}
                  disabled={saving}
                  className={`p-2 rounded-lg transition-colors ${
                    config.is_active
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={config.is_active ? 'Deactivate' : 'Activate'}
                >
                  {config.is_active ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => deleteVoiceConfig(config.id)}
                  disabled={saving}
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {voiceConfigs.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No voice providers configured. Add one to get started.
            </div>
          )}
        </div>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <h3 className="font-semibold text-cyan-900 mb-2">Configuration Notes</h3>
        <ul className="text-sm text-cyan-800 space-y-1 list-disc list-inside">
          <li>Only one provider can be active per language at a time</li>
          <li>API keys are stored securely in the database</li>
          <li>Changes take effect immediately for new conversations</li>
          <li>For Amazon Bedrock, ensure AWS credentials are properly configured</li>
          <li>For ElevenLabs, get your API key from https://elevenlabs.io/</li>
        </ul>
      </div>
    </div>
  );
}
