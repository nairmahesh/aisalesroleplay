import { ArrowLeft, Users, Award, TrendingUp, MessageCircle, ChevronRight, CheckCircle, XCircle, Play } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'participants' | 'scorecard' | 'analytics' | 'feedback' | 'objections'>('scorecard');
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null);
  const [scoringCriteria, setScoringCriteria] = useState<ScoringCriteria[]>([]);
  const [callScores, setCallScores] = useState<CallScore[]>([]);
  const [detailedTotalScore, setDetailedTotalScore] = useState<number>(0);
  const [detailedMaxScore, setDetailedMaxScore] = useState<number>(100);
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
        .select('total_score, max_score')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (criteriaData) {
        setScoringCriteria(criteriaData);
      }
      if (scoresData) {
        setCallScores(scoresData);
      }
      if (analyticsData) {
        setDetailedTotalScore(analyticsData.total_score || 0);
        setDetailedMaxScore(analyticsData.max_score || 100);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading scoring data:', error);
      setLoading(false);
    }
  };

  const getScoreForCriteria = (criteriaId: string): CallScore | undefined => {
    return callScores.find(s => s.criteria_id === criteriaId);
  };

  const analyticsData = {
    caller: 'Marcus Johnson',
    callType: 'Cold Call',
    date: '10/15/2025',
    time: '12:34',
    participants: 2,
    duration: '12:34',
    framework: 'MEDDIC',
    conversationFlow: [
      { timestamp: '00:00', speaker: 'user', text: 'Hi! Thanks for taking my call today.' },
      { timestamp: '00:05', speaker: 'bot', text: 'Hello! This is Marcus Johnson. Thanks for reaching out. How can I help you today?' },
      { timestamp: '00:15', speaker: 'user', text: 'I wanted to discuss your solutions for our sales team. We\'re looking to improve our performance tracking.' },
      { timestamp: '00:28', speaker: 'bot', text: 'Great! I\'d love to learn more about your current challenges. What specific issues are you facing with performance tracking?' },
      { timestamp: '00:42', speaker: 'user', text: 'We\'re using spreadsheets and it\'s getting difficult to scale. We have 25 reps and no real-time visibility.' },
      { timestamp: '00:58', speaker: 'bot', text: 'I understand. So you have 25 reps using spreadsheets for performance tracking. What\'s the biggest pain point you\'re experiencing right now?' },
      { timestamp: '01:15', speaker: 'user', text: 'The biggest issue is we can\'t see problems until it\'s too late. By the time we review the data, the week is already over.' },
      { timestamp: '01:32', speaker: 'bot', text: 'That makes sense. Real-time visibility is crucial. Can you tell me more about your current process and how decisions are made?' },
    ]
  };

  const groupedCriteria = scoringCriteria.reduce((acc, criterion) => {
    if (!acc[criterion.category]) {
      acc[criterion.category] = [];
    }
    acc[criterion.category].push(criterion);
    return acc;
  }, {} as Record<string, ScoringCriteria[]>);

  const getCategoryScore = (category: string) => {
    const criteria = groupedCriteria[category] || [];
    const scores = criteria.map(c => getScoreForCriteria(c.id));
    const total = scores.reduce((sum, s) => sum + (s?.score || 0), 0);
    const max = criteria.reduce((sum, c) => sum + c.max_score, 0);
    return { total, max };
  };

  const selectedScore = selectedCriteriaId ? getScoreForCriteria(selectedCriteriaId) : null;
  const selectedCriteria = selectedCriteriaId ? scoringCriteria.find(c => c.id === selectedCriteriaId) : null;

  const handleTimestampClick = (timestamp: string) => {
    setHighlightedTimestamp(timestamp);
    const element = document.getElementById(`transcript-${timestamp}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightedTimestamp(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Side - Video/Audio Player and Transcript */}
      <div className="flex-1 flex flex-col border-r border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Call with {analyticsData.caller}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {analyticsData.participants} Participants
            </div>
            <div>{analyticsData.date}</div>
            <div>{analyticsData.duration}</div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                Score: {detailedTotalScore}/{detailedMaxScore}
              </span>
            </div>
          </div>
        </div>

        {/* Video/Audio Player */}
        <div className="p-6 border-b border-slate-200 bg-slate-900">
          <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                <Play className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-400">No recording available</p>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="mt-4 flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <div className="h-1 bg-slate-700 rounded-full">
                <div className="h-1 bg-blue-600 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0:00</span>
                <span>0:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Transcript</h2>
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-4">
            {analyticsData.conversationFlow.map((msg, i) => (
              <div
                key={i}
                id={`transcript-${msg.timestamp}`}
                className={`p-4 rounded-lg transition-all ${
                  highlightedTimestamp === msg.timestamp
                    ? 'bg-yellow-100 ring-2 ring-yellow-400'
                    : msg.speaker === 'user'
                    ? 'bg-slate-50'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.speaker === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {msg.speaker === 'user' ? 'C' : bot.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">{msg.timestamp}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {msg.speaker === 'user' ? analyticsData.caller : bot.name}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Tabs and Content */}
      <div className="w-[600px] flex flex-col">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'participants'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'scorecard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Scorecard
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'feedback'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Feedback
            </button>
            <button
              onClick={() => setActiveTab('objections')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'objections'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Objections
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'scorecard' && !selectedCriteriaId && (
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Score: {detailedTotalScore}/{detailedMaxScore}
                  </h3>
                </div>
                <p className="text-sm text-slate-600">
                  You got {detailedTotalScore}/{detailedMaxScore} criteria correct. For this call, the scorecard is the best resource to understand what went right and what went wrong. Dive into each criteria to check out detailed feedback.
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedCriteria).map(([category, criteria]) => {
                  const categoryScore = getCategoryScore(category);
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                          {category}
                        </h3>
                        <span className="text-sm font-semibold text-slate-600">
                          {categoryScore.total}/{categoryScore.max}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {criteria.map((criterion) => {
                          const score = getScoreForCriteria(criterion.id);
                          const isPassed = score?.passed || false;

                          return (
                            <button
                              key={criterion.id}
                              onClick={() => setSelectedCriteriaId(criterion.id)}
                              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {isPassed ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                )}
                                <span className="text-sm font-medium text-slate-900">
                                  {category} – {criterion.name}
                                </span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
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

          {activeTab === 'scorecard' && selectedCriteriaId && selectedCriteria && selectedScore && (
            <div className="p-6">
              <button
                onClick={() => setSelectedCriteriaId(null)}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                View full scorecard
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {selectedScore.passed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedCriteria.category} – {selectedCriteria.name}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 uppercase tracking-wide font-semibold">
                  {selectedCriteria.category}
                </p>
              </div>

              <div className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${
                  selectedScore.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Why were you scored this way?
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedScore.feedback}
                  </p>
                </div>

                {selectedScore.transcript_references && selectedScore.transcript_references.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">
                      Evidence from transcript:
                    </h3>
                    <ol className="space-y-3">
                      {selectedScore.transcript_references.map((ref, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-600 text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <button
                              onClick={() => handleTimestampClick(ref.timestamp)}
                              className="text-blue-600 hover:text-blue-700 font-mono text-xs mb-1"
                            >
                              ({ref.timestamp})
                            </button>
                            <p className="text-sm text-slate-700">
                              "{ref.text}"
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {!selectedScore.passed && selectedScore.improvement_examples && selectedScore.improvement_examples.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">
                      What could you do differently next time?
                    </h3>
                    <ul className="space-y-2">
                      {selectedScore.improvement_examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-blue-600 flex-shrink-0">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Call Participants (2)</h2>
              <p className="text-sm text-slate-600 mb-6">Engagement metrics and participation data</p>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      M
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{analyticsData.caller}</h3>
                      <p className="text-sm text-slate-600">Sales Rep</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">7</div>
                      <div className="text-xs text-slate-600">Questions Asked</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">0.8</div>
                      <div className="text-xs text-slate-600">Sentiment Score</div>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                      {bot.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{bot.name}</h3>
                      <p className="text-sm text-slate-600">Prospect</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Call Analytics</h2>
              <p className="text-slate-600">Analytics view coming soon...</p>
            </div>
          )}

          {activeTab === 'feedback' && !selectedCriteriaId && (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                    {detailedTotalScore}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Just the beginning, you'll get there!</p>
                    <h2 className="text-lg font-bold text-slate-900">
                      You got {detailedTotalScore}/{detailedMaxScore} criteria correct.
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-3">
                  For this call, the scorecard is the best resource to understand what went right and what went wrong. Dive into each criteria to check out detailed feedback.
                </p>
              </div>

              <div className="border-b border-slate-200 mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Scorecard</h3>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedCriteria).map(([category, criteria]) => {
                  const categoryScore = getCategoryScore(category);
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          {category}
                        </h3>
                        <span className="text-xs font-semibold text-slate-600">
                          {categoryScore.total}/{categoryScore.max}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {criteria.map((criterion) => {
                          const score = getScoreForCriteria(criterion.id);
                          const isPassed = score?.passed || false;

                          return (
                            <button
                              key={criterion.id}
                              onClick={() => setSelectedCriteriaId(criterion.id)}
                              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {isPassed ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                )}
                                <span className="text-sm font-medium text-slate-900">
                                  {category} – {criterion.name}
                                </span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
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

          {activeTab === 'feedback' && selectedCriteriaId && selectedCriteria && selectedScore && (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-200">
                <button
                  onClick={() => setSelectedCriteriaId(null)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  View full scorecard
                </button>

                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {scoringCriteria.map((criterion) => {
                    const score = getScoreForCriteria(criterion.id);
                    const isPassed = score?.passed || false;
                    const isSelected = criterion.id === selectedCriteriaId;

                    return (
                      <button
                        key={criterion.id}
                        onClick={() => setSelectedCriteriaId(criterion.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                          isSelected
                            ? isPassed
                              ? 'bg-green-100 text-green-700 ring-2 ring-green-600'
                              : 'bg-red-100 text-red-700 ring-2 ring-red-600'
                            : isPassed
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {criterion.category} – {criterion.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {selectedCriteria.category} - {selectedCriteria.name}
                  </h2>
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold">
                    {selectedCriteria.category}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">AI</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Why were you scored this way?
                      </h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedScore.feedback}
                    </p>
                  </div>

                  {selectedScore.transcript_references && selectedScore.transcript_references.length > 0 && (
                    <div>
                      <ol className="space-y-4">
                        {selectedScore.transcript_references.map((ref, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-slate-700 mb-2">
                                {ref.text.split(':')[0]}:{' '}
                                <button
                                  onClick={() => handleTimestampClick(ref.timestamp)}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-mono text-xs"
                                >
                                  <Play className="w-3 h-3" />
                                  ({ref.timestamp})
                                </button>{' '}
                                "{ref.text.split(':').slice(1).join(':').trim()}"
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {!selectedScore.passed && selectedScore.improvement_examples && selectedScore.improvement_examples.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <h3 className="text-sm font-bold text-slate-900 mb-3">
                        What could you do differently next time?
                      </h3>
                      <ul className="space-y-2">
                        {selectedScore.improvement_examples.map((example, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-blue-600 flex-shrink-0">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'objections' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Objections</h2>
              <p className="text-slate-600">Objections view coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
