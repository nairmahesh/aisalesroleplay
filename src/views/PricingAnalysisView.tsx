import { DollarSign, TrendingUp, Users, Target, BarChart3, Download } from 'lucide-react';

export function PricingAnalysisView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100">Pricing Analysis & Cost Structure</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
        <p className="text-slate-400">Comprehensive cost analysis and recommended pricing strategy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-100">$3.58</div>
              <div className="text-sm text-slate-400">Avg Cost per Voice Call</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Range: $2.33 - $4.84</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-100">40-55%</div>
              <div className="text-sm text-slate-400">Target Margin</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Blended across all tiers</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-100">$9-186</div>
              <div className="text-sm text-slate-400">Cost per User/Month</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Depends on usage intensity</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">Recommended Pricing Tiers</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Starter</h3>
                  <p className="text-sm text-slate-400">Individual Contributors</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">$49</div>
                  <div className="text-xs text-slate-500">/month</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-300 mb-3">
                <li>• 10 voice calls/month</li>
                <li>• Unlimited text calls</li>
                <li>• Basic analytics</li>
                <li>• Email support</li>
              </ul>
              <div className="pt-3 border-t border-slate-700 text-xs text-slate-400">
                Cost: $36/mo | Margin: 26%
              </div>
            </div>

            <div className="bg-slate-900 border border-cyan-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Professional</h3>
                  <p className="text-sm text-slate-400">Active Sales Reps</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">$99</div>
                  <div className="text-xs text-slate-500">/month</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-300 mb-3">
                <li>• 25 voice calls/month</li>
                <li>• Unlimited text calls</li>
                <li>• Advanced analytics & trends</li>
                <li>• Custom bot personalities</li>
                <li>• Priority support</li>
              </ul>
              <div className="pt-3 border-t border-slate-700 text-xs text-slate-400">
                Cost: $72/mo | Margin: 27-52%
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Business</h3>
                  <p className="text-sm text-slate-400">Sales Managers & Trainers</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">$199</div>
                  <div className="text-xs text-slate-500">/month</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-300 mb-3">
                <li>• 60 voice calls/month</li>
                <li>• Unlimited text calls</li>
                <li>• Team analytics & leaderboards</li>
                <li>• CRM integrations</li>
                <li>• Dedicated account manager</li>
              </ul>
              <div className="pt-3 border-t border-slate-700 text-xs text-slate-400">
                Cost: $179/mo | Margin: 11-40%
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">Enterprise</h3>
                  <p className="text-sm text-purple-200">Large Teams & Organizations</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">Custom</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-purple-100 mb-3">
                <li>• Unlimited voice + text calls</li>
                <li>• White-label options</li>
                <li>• Custom integrations</li>
                <li>• SLA guarantees</li>
                <li>• Dedicated support team</li>
              </ul>
              <div className="pt-3 border-t border-purple-700 text-xs text-purple-200">
                Target Margin: 40-60%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Cost Breakdown per Call</h2>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Voice Call (10 min)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">AI Conversation (LLM)</span>
                  <span className="text-slate-200">$0.20 - $0.60</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Voice Synthesis (TTS)</span>
                  <span className="text-slate-200">$2.00 - $4.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Post-Call Analysis</span>
                  <span className="text-slate-200">$0.025 - $0.035</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Voice Transcription</span>
                  <span className="text-slate-200">$0.10 - $0.20</span>
                </div>
                <div className="pt-2 border-t border-slate-700 flex justify-between font-semibold">
                  <span className="text-slate-200">Total</span>
                  <span className="text-cyan-400">$2.33 - $4.84</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Text Call (10 min)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">AI Conversation (LLM)</span>
                  <span className="text-slate-200">$0.20 - $0.60</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Post-Call Analysis</span>
                  <span className="text-slate-200">$0.025 - $0.035</span>
                </div>
                <div className="pt-2 border-t border-slate-700 flex justify-between font-semibold">
                  <span className="text-slate-200">Total</span>
                  <span className="text-green-400">$0.23 - $0.64</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-green-400 font-medium">92% cost savings vs voice calls</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Team Pricing</h2>

            <div className="space-y-3">
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-200">Small Team (5 users)</span>
                  <span className="text-lg font-bold text-cyan-400">$399/mo</span>
                </div>
                <div className="text-sm text-slate-400">$80/user • 100 team calls/month</div>
                <div className="text-xs text-slate-500 mt-1">Margin: 28%</div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-200">Medium Team (20 users)</span>
                  <span className="text-lg font-bold text-cyan-400">$1,599/mo</span>
                </div>
                <div className="text-sm text-slate-400">$80/user • 300 team calls/month</div>
                <div className="text-xs text-slate-500 mt-1">Margin: 52%</div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-200">Enterprise (100+ users)</span>
                  <span className="text-lg font-bold text-cyan-400">Custom</span>
                </div>
                <div className="text-sm text-slate-400">$50-70/user • Volume pricing</div>
                <div className="text-xs text-slate-500 mt-1">Target Margin: 54-67%</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900 to-blue-900 border border-cyan-500 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Cost Optimization Tips</h2>
            <ul className="space-y-3 text-sm text-cyan-50">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Encourage text calls:</strong> 92% cheaper than voice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Smart caching:</strong> Save 20-30% on LLM costs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Shorter calls:</strong> Default to 5-min saves 50%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Batch analysis:</strong> Reduce costs by 15-25%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-500 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Financial Projections</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-green-200 mb-2">Year 1 Revenue (Conservative)</div>
            <div className="text-3xl font-bold text-white mb-1">~$400K</div>
            <div className="text-sm text-green-300">38% profit margin</div>
            <div className="text-xs text-green-200 mt-2">Growing from 20 to 500 users</div>
          </div>

          <div>
            <div className="text-sm text-green-200 mb-2">Year 2 Revenue (Growth)</div>
            <div className="text-3xl font-bold text-white mb-1">~$3.6M</div>
            <div className="text-sm text-green-300">52% profit margin</div>
            <div className="text-xs text-green-200 mt-2">Scaling to 2,000 users</div>
          </div>

          <div>
            <div className="text-sm text-green-200 mb-2">LTV:CAC Ratio</div>
            <div className="text-3xl font-bold text-white mb-1">12:1</div>
            <div className="text-sm text-green-300">Healthy SaaS metric</div>
            <div className="text-xs text-green-200 mt-2">2 month payback period</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-xs text-slate-400 text-center">
          Last Updated: 2025-10-18 | Cost assumptions based on current AI provider pricing |
          Full analysis available in <code className="text-cyan-400 bg-slate-900 px-2 py-1 rounded">PRICING_ANALYSIS.md</code>
        </p>
      </div>
    </div>
  );
}
