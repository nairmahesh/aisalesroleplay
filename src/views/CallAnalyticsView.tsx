import { ArrowLeft, TrendingUp, MessageSquare, Clock, Award, CheckCircle, XCircle, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';
import { Bot } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CallAnalyticsViewProps {
  sessionId: string;
  bot: Bot;
  onBack: () => void;
}

interface ScoringCriteria {
  id: string;
  name: string;
  description: string;
  max_score: number;
  category: string;
  order_index: number;
}

interface TranscriptReference {
  timestamp: string;
  text: string;
  speaker: string;
}

interface CallScore {
  id: string;
  criteria_id: string;
  score: number;
  passed: boolean;
  feedback: string;
  transcript_evidence?: string;
  timestamp?: string;
  improvement_examples?: string[];
  transcript_references?: TranscriptReference[];
}

interface TranscriptMessage {
  timestamp: string;
  speaker: string;
  text: string;
}

export function CallAnalyticsView({ sessionId, bot, onBack }: CallAnalyticsViewProps) {
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null);
  const [scoringCriteria, setScoringCriteria] = useState<ScoringCriteria[]>([]);
  const [callScores, setCallScores] = useState<CallScore[]>([]);
  const [detailedTotalScore, setDetailedTotalScore] = useState<number>(0);
  const [detailedMaxScore, setDetailedMaxScore] = useState<number>(100);
  const [detailedOverallFeedback, setDetailedOverallFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [highlightedTimestamp, setHighlightedTimestamp] = useState<string | null>(null);

  useEffect(() => {
    loadScoringData();
  }, [sessionId]);

  const loadScoringData = async () => {
    try {
      const { data: criteriaData } = await supabase
        .from('scoring_criteria')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: scoresData } = await supabase
        .from('call_scores')
        .select('*')
        .eq('session_id', sessionId);

      const { data: analyticsData } = await supabase
        .from('call_analytics')
        .select('total_score, max_score, overall_feedback')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (criteriaData) {
        console.log('Loaded criteria:', criteriaData.length, 'items');
        setScoringCriteria(criteriaData);
      }
      if (scoresData) {
        console.log('Loaded scores:', scoresData.length, 'items');
        setCallScores(scoresData);
      }
      if (analyticsData) {
        console.log('Loaded analytics:', analyticsData);
        setDetailedTotalScore(analyticsData.total_score || 0);
        setDetailedMaxScore(analyticsData.max_score || 100);
        setDetailedOverallFeedback(analyticsData.overall_feedback || '');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading scoring data:', error);
      setLoading(false);
    }
  };

  const analyticsData = {
    overallScore: 67,
    framework: 'MEDDIC',
    duration: '12:34',
    date: new Date().toLocaleDateString(),
    userTalkPercentage: 45,
    botTalkPercentage: 55,
    userSentiment: 0.7,
    botSentiment: 0.5,
    conversationFlow: [
      { timestamp: '00:00', speaker: 'user', text: 'Hi! Thanks for taking my call today.' },
      { timestamp: '00:05', speaker: 'bot', text: "Hello! This is Marcus Johnson. Thanks for reaching out. How can I help you today?" },
      { timestamp: '00:15', speaker: 'user', text: "I wanted to discuss your solutions for our sales team. We're looking to improve our performance tracking." },
      { timestamp: '00:28', speaker: 'bot', text: "Great! I'd love to learn more about your current challenges. What specific issues are you facing with performance tracking?" },
      { timestamp: '00:42', speaker: 'user', text: "We're using spreadsheets and it's getting difficult to scale. We have 25 reps and no real-time visibility." },
      { timestamp: '00:53', speaker: 'bot', text: "We can help you cut manual work by 50%." },
      { timestamp: '01:15', speaker: 'user', text: "Deal velocity, win rates, and activity tracking are our top priorities. What does your pricing look like?" },
      { timestamp: '01:32', speaker: 'bot', text: "For a team of 25, we typically see pricing in the $50-75K annual range, depending on features. That includes implementation and training. What's your budget range?" },
      { timestamp: '01:48', speaker: 'user', text: "That's within our range. We're looking to implement something in Q1 next year." },
      { timestamp: '02:00', speaker: 'bot', text: "Perfect timing! Q1 gives us enough runway for a smooth implementation. Who else needs to be involved in this decision?" },
      { timestamp: '02:45', speaker: 'user', text: "I'll check with our CTO." },
      { timestamp: '03:12', speaker: 'user', text: "Integration with HubSpot is key for us." },
      { timestamp: '04:00', speaker: 'user', text: "I'll share it internally." },
    ],
  };

  const scrollToTranscript = (timestamp: string) => {
    setHighlightedTimestamp(timestamp);

    const element = document.getElementById(`transcript-${timestamp}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        setHighlightedTimestamp(null);
      }, 3000);
    }
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 0.6) return { label: 'Positive', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 0.3) return { label: 'Neutral', color: 'text-slate-600', bg: 'bg-slate-100' };
    return { label: 'Negative', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const userSentimentStyle = getSentimentLabel(analyticsData.userSentiment);

  const getScoreForCriteria = (criteriaId: string) => {
    return callScores.find(s => s.criteria_id === criteriaId);
  };

  const groupedCriteria = scoringCriteria.reduce((acc, criterion) => {
    if (!acc[criterion.category]) {
      acc[criterion.category] = [];
    }
    acc[criterion.category].push(criterion);
    return acc;
  }, {} as Record<string, ScoringCriteria[]>);

  const categoryOrder = ['opening', 'discovery', 'handling', 'value', 'closing'];
  const sortedCategories = Object.keys(groupedCriteria).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const selectedCriteria = selectedCriteriaId ? scoringCriteria.find(c => c.id === selectedCriteriaId) : null;
  const selectedScore = selectedCriteriaId ? getScoreForCriteria(selectedCriteriaId) : null;

  return (
    <div className="fixed inset-0 flex">
      <div className="flex-1 flex overflow-hidden">
        {/* Middle Section - Analytics */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to History
            </button>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: bot.avatar_color }}
                  >
                    {bot.avatar_initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{bot.name}</h2>
                    <p className="text-slate-600">{bot.call_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">{analyticsData.date}</p>
                  <p className="text-sm text-slate-600">{analyticsData.duration}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-semibold text-cyan-900">Overall Score</h3>
                  </div>
                  <p className="text-4xl font-bold text-cyan-900 mb-2">{detailedTotalScore}/{detailedMaxScore}</p>
                  <p className="text-sm text-cyan-700">{analyticsData.framework} Framework</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-900">Your Talk %</h3>
                  </div>
                  <p className="text-4xl font-bold text-emerald-900 mb-2">{analyticsData.userTalkPercentage}%</p>
                  <div className="w-full bg-emerald-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${analyticsData.userTalkPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                    <h3 className="font-semibold text-violet-900">Your Sentiment</h3>
                  </div>
                  <p className={`text-2xl font-bold mb-2 ${userSentimentStyle.color}`}>
                    {userSentimentStyle.label}
                  </p>
                  <p className="text-sm text-violet-700">
                    Score: {(analyticsData.userSentiment * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Duration</h3>
                  </div>
                  <p className="text-4xl font-bold text-slate-900 mb-2">{analyticsData.duration}</p>
                  <p className="text-sm text-slate-600">Total call time</p>
                </div>
              </div>
            </div>

            {scoringCriteria.length > 0 && callScores.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Score Breakdown</h2>

                {detailedOverallFeedback && (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 p-6 mb-6">
                    <p className="text-sm text-slate-700">{detailedOverallFeedback}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {sortedCategories.map(category => {
                    const categoryCriteria = groupedCriteria[category].sort((a, b) => a.order_index - b.order_index);

                    return (
                      <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900">{getCategoryLabel(category)}</h3>

                        <div className="space-y-2">
                          {categoryCriteria.map(criterion => {
                            const score = getScoreForCriteria(criterion.id);
                            const isPassed = score?.passed || false;

                            return (
                              <button
                                key={criterion.id}
                                onClick={() => setSelectedCriteriaId(criterion.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                                  selectedCriteriaId === criterion.id
                                    ? 'border-cyan-300 bg-cyan-50'
                                    : isPassed
                                    ? 'border-green-200 bg-green-50 hover:border-green-300'
                                    : 'border-red-200 bg-red-50 hover:border-red-300'
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  {isPassed ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <XCircle className="w-6 h-6 text-red-600" />
                                  )}
                                </div>

                                <div className="flex-1 text-left">
                                  <div className="font-medium text-slate-900">{criterion.name}</div>
                                  <div className="text-sm text-slate-600">{criterion.description}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className={`text-lg font-bold ${
                                    isPassed ? 'text-green-700' : 'text-red-700'
                                  }`}>
                                    {score?.score || 0}/{criterion.max_score}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Transcript & Details */}
        <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
          {selectedCriteria && selectedScore ? (
            <div className="p-6">
              <div className={`p-4 rounded-xl border-2 mb-4 ${
                selectedScore.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {selectedScore.passed ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedCriteria.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{selectedCriteria.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    selectedScore.passed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    Score: {selectedScore.score}/{selectedCriteria.max_score}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    selectedScore.passed
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {selectedScore.passed ? 'Passed' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 mb-4 ${
                selectedScore.passed
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    selectedScore.passed ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <h4 className="text-sm font-bold text-slate-900">Why were you scored this way?</h4>
                </div>
                <div className="text-sm text-slate-800 leading-relaxed space-y-2">
                  {selectedScore.feedback.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {selectedScore.transcript_references && selectedScore.transcript_references.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedScore.transcript_references.map((ref, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToTranscript(ref.timestamp)}
                        className="flex items-start gap-2 w-full text-left p-2 bg-white rounded-lg border border-slate-300 hover:border-cyan-400 hover:shadow-sm transition-all"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-mono text-cyan-600 font-semibold">
                            ({ref.timestamp})
                          </span>
                          <p className="text-xs text-slate-700 mt-1 italic truncate">"{ref.text}"</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200 mb-4">
                <div className="flex items-start gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <h4 className="text-sm font-bold text-slate-900">What could you do differently?</h4>
                </div>
                {selectedScore.improvement_examples && selectedScore.improvement_examples.length > 0 ? (
                  <ol className="space-y-2">
                    {selectedScore.improvement_examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-800">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="flex-1">{example}</span>
                      </li>
                    ))}
                  </ol>
                ) : selectedScore.passed ? (
                  <p className="text-sm text-slate-800">Excellent work! Continue this approach.</p>
                ) : (
                  <p className="text-sm text-slate-800">N/A</p>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Transcript</h3>
                <div className="space-y-2">
                  {analyticsData.conversationFlow.map((msg, i) => (
                    <div
                      key={i}
                      id={`transcript-${msg.timestamp}`}
                      className={`p-3 rounded-lg transition-all ${
                        highlightedTimestamp === msg.timestamp
                          ? 'bg-cyan-100 border-2 border-cyan-400'
                          : msg.speaker === 'user'
                          ? 'bg-blue-50'
                          : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">{msg.timestamp}</span>
                        <span className={`text-xs font-semibold ${
                          msg.speaker === 'user' ? 'text-blue-600' : 'text-slate-600'
                        }`}>
                          {msg.speaker === 'user' ? 'You' : bot.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Transcript</h3>
              <div className="space-y-2">
                {analyticsData.conversationFlow.map((msg, i) => (
                  <div
                    key={i}
                    id={`transcript-${msg.timestamp}`}
                    className={`p-3 rounded-lg ${
                      msg.speaker === 'user' ? 'bg-blue-50' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">{msg.timestamp}</span>
                      <span className={`text-xs font-semibold ${
                        msg.speaker === 'user' ? 'text-blue-600' : 'text-slate-600'
                      }`}>
                        {msg.speaker === 'user' ? 'You' : bot.name}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
