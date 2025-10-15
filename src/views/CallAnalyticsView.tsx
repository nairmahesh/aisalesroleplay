import { ArrowLeft, TrendingUp, MessageSquare, Clock, Award, CheckCircle, XCircle, AlertTriangle, PlayCircle } from 'lucide-react';
import { Bot } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DetailedScoreCard, ScoringCriteria, CallScore } from '../components/DetailedScoreCard';

interface CallAnalyticsViewProps {
  sessionId: string;
  bot: Bot;
  onBack: () => void;
}

interface FrameworkCriterion {
  name: string;
  status: 'identified' | 'partial' | 'not_identified';
  timestamp: string | null;
  evidence: string | null;
  comment: string;
}

export function CallAnalyticsView({ sessionId, bot, onBack }: CallAnalyticsViewProps) {
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null);
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

      if (criteriaData) setScoringCriteria(criteriaData);
      if (scoresData) setCallScores(scoresData);
      if (analyticsData) {
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

  const meddic: FrameworkCriterion[] = [
    {
      name: 'Metrics',
      status: 'identified',
      timestamp: '00:53',
      evidence: 'Rep: "We can help you cut manual work by 50%."',
      comment: 'Quantified business outcome identified'
    },
    {
      name: 'Economic Buyer',
      status: 'partial',
      timestamp: '02:45',
      evidence: 'Buyer: "I\'ll check with our CTO."',
      comment: 'Buyer not final decision-maker'
    },
    {
      name: 'Decision Criteria',
      status: 'identified',
      timestamp: '03:12',
      evidence: 'Buyer: "Integration with HubSpot is key."',
      comment: 'Clear evaluation factor'
    },
    {
      name: 'Decision Process',
      status: 'not_identified',
      timestamp: null,
      evidence: null,
      comment: 'Not discussed'
    },
    {
      name: 'Identify Pain',
      status: 'identified',
      timestamp: '00:42',
      evidence: 'Buyer: "Manual updates are tiring."',
      comment: 'Clear pain identified'
    },
    {
      name: 'Champion',
      status: 'partial',
      timestamp: '04:00',
      evidence: 'Buyer: "I\'ll share it internally."',
      comment: 'Possible advocate but not confirmed'
    }
  ];

  const bant: FrameworkCriterion[] = [
    {
      name: 'Budget',
      status: 'identified',
      timestamp: '01:48',
      evidence: 'Buyer: "That\'s within our range."',
      comment: 'Budget confirmed in $50-75K range'
    },
    {
      name: 'Authority',
      status: 'partial',
      timestamp: '02:45',
      evidence: 'Buyer: "I\'ll check with our CTO."',
      comment: 'Not the final decision maker'
    },
    {
      name: 'Need',
      status: 'identified',
      timestamp: '00:42',
      evidence: 'Buyer: "We have 25 reps and no real-time visibility."',
      comment: 'Clear business need established'
    },
    {
      name: 'Timeline',
      status: 'identified',
      timestamp: '01:48',
      evidence: 'Buyer: "We\'re looking to implement something in Q1 next year."',
      comment: 'Q1 2026 implementation target'
    }
  ];

  const spin: FrameworkCriterion[] = [
    {
      name: 'Situation Questions',
      status: 'identified',
      timestamp: '00:28',
      evidence: 'Rep: "What specific issues are you facing?"',
      comment: 'Current state explored'
    },
    {
      name: 'Problem Questions',
      status: 'identified',
      timestamp: '00:42',
      evidence: 'Buyer: "It\'s getting difficult to scale."',
      comment: 'Pain points uncovered'
    },
    {
      name: 'Implication Questions',
      status: 'partial',
      timestamp: null,
      evidence: null,
      comment: 'Could dig deeper into consequences'
    },
    {
      name: 'Need-Payoff Questions',
      status: 'identified',
      timestamp: '00:58',
      evidence: 'Rep: "What metrics are most important to you?"',
      comment: 'Value discussion initiated'
    }
  ];

  const getCriteria = () => {
    switch (analyticsData.framework) {
      case 'MEDDIC':
        return meddic;
      case 'BANT':
        return bant;
      case 'SPIN':
        return spin;
      default:
        return meddic;
    }
  };

  const criteria = getCriteria();
  const identifiedCount = criteria.filter(c => c.status === 'identified').length;
  const totalCount = criteria.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'identified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'not_identified':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'border-green-300 bg-green-50';
      case 'partial':
        return 'border-amber-300 bg-amber-50';
      case 'not_identified':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-slate-300 bg-slate-50';
    }
  };

  const jumpToTimestamp = (timestamp: string) => {
    setHighlightedTimestamp(timestamp);

    const transcriptElement = document.getElementById(`transcript-${timestamp}`);
    if (transcriptElement) {
      transcriptElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">Call Analytics</h1>
          <p className="text-slate-600">Detailed performance analysis and insights</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
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

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-cyan-900">Overall Score</h3>
            </div>
            <p className="text-4xl font-bold text-cyan-900 mb-2">{analyticsData.overallScore}</p>
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
        <DetailedScoreCard
          totalScore={detailedTotalScore}
          maxScore={detailedMaxScore}
          criteria={scoringCriteria}
          scores={callScores}
          overallFeedback={detailedOverallFeedback}
          onCriterionClick={jumpToTimestamp}
        />
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Framework: {analyticsData.framework}</h2>
            <p className="text-slate-600 mt-1">
              You got {identifiedCount}/{totalCount} criteria correct. Dive into each criteria to check out detailed feedback.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Criteria</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 w-20">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Evidence (Transcript Snippet)</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {criteria.map((criterion, index) => (
                <tr
                  key={index}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    selectedCriterion === criterion.name ? 'bg-cyan-50' : ''
                  }`}
                  onClick={() => setSelectedCriterion(criterion.name)}
                >
                  <td className="px-4 py-4">
                    <span className="font-medium text-slate-900">{criterion.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusIcon(criterion.status)}
                  </td>
                  <td className="px-4 py-4">
                    {criterion.evidence ? (
                      <div className="space-y-1">
                        {criterion.timestamp && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (criterion.timestamp) jumpToTimestamp(criterion.timestamp);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-mono text-cyan-600 hover:text-cyan-700 hover:underline"
                          >
                            <PlayCircle className="w-3 h-3" />
                            [{criterion.timestamp}]
                          </button>
                        )}
                        <p className="text-sm text-slate-700">{criterion.evidence}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-700">{criterion.comment}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCriterion && (() => {
        const criterion = criteria.find(c => c.name === selectedCriterion);
        if (!criterion) return null;

        return (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(criterion.status)}
                <h3 className="text-xl font-bold text-slate-900">{criterion.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCriterion(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className={`p-4 rounded-lg border-2 ${getStatusColor(criterion.status)} mb-4`}>
              <h4 className="font-semibold text-slate-900 mb-2">Why were you scored this way?</h4>
              <p className="text-sm text-slate-700 mb-3">{criterion.comment}</p>

              {criterion.evidence && criterion.timestamp && (
                <div className="bg-white p-3 rounded border border-slate-200">
                  <button
                    onClick={() => jumpToTimestamp(criterion.timestamp!)}
                    className="inline-flex items-center gap-2 text-sm font-mono text-cyan-600 hover:text-cyan-700 hover:underline mb-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Jump to [{criterion.timestamp}]
                  </button>
                  <p className="text-sm text-slate-700 italic">"{criterion.evidence}"</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">What could you do differently next time?</h4>
              <p className="text-sm text-slate-600">
                {criterion.status === 'identified'
                  ? 'Great work! Keep using this approach in future calls.'
                  : criterion.status === 'partial'
                  ? 'You made progress here, but try to dig deeper and get full confirmation.'
                  : 'Make sure to ask direct questions to uncover this information early in the call.'}
              </p>
            </div>
          </div>
        );
      })()}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Full Transcript</h2>
        <div className="space-y-4">
          {analyticsData.conversationFlow.map((msg, i) => {
            const isHighlighted = highlightedTimestamp === msg.timestamp;
            return (
              <div
                key={i}
                id={`transcript-${msg.timestamp}`}
                className={`flex gap-4 transition-all duration-500 ${
                  isHighlighted ? 'scale-105' : ''
                }`}
              >
                <div className="flex-shrink-0 w-16 text-xs text-slate-500 font-mono pt-1">
                  {msg.timestamp}
                </div>
                <div className={`flex-1 p-4 rounded-lg transition-all duration-500 ${
                  isHighlighted
                    ? 'ring-4 ring-cyan-400 shadow-lg bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-400'
                    : msg.speaker === 'user'
                    ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase ${
                      msg.speaker === 'user' ? 'text-cyan-700' : 'text-slate-600'
                    }`}>
                      {msg.speaker === 'user' ? 'You' : bot.name}
                    </span>
                    {isHighlighted && (
                      <span className="text-xs font-semibold text-cyan-700 bg-cyan-200 px-2 py-0.5 rounded-full animate-pulse">
                        Referenced in scoring
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-800">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
