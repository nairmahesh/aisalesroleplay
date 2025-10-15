import { CheckCircle, XCircle, ChevronRight, X, Lightbulb, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export interface ScoringCriteria {
  id: string;
  name: string;
  description: string;
  max_score: number;
  category: string;
  order_index: number;
}

export interface TranscriptReference {
  timestamp: string;
  text: string;
  speaker: string;
}

export interface CallScore {
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

export interface TranscriptMessage {
  timestamp: string;
  speaker: string;
  text: string;
}

interface DetailedScoreCardProps {
  totalScore: number;
  maxScore: number;
  criteria: ScoringCriteria[];
  scores: CallScore[];
  overallFeedback?: string;
  onCriterionClick?: (timestamp: string) => void;
  transcript?: TranscriptMessage[];
  botName?: string;
}

export function DetailedScoreCard({ totalScore, maxScore, criteria, scores, overallFeedback, onCriterionClick, transcript, botName }: DetailedScoreCardProps) {
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null);
  const [highlightedTimestamp, setHighlightedTimestamp] = useState<string | null>(null);

  const getScoreForCriteria = (criteriaId: string) => {
    return scores.find(s => s.criteria_id === criteriaId);
  };

  const scrollToTranscript = (timestamp: string) => {
    setHighlightedTimestamp(timestamp);

    const element = document.getElementById(`modal-transcript-${timestamp}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        setHighlightedTimestamp(null);
      }, 3000);
    }
  };

  const groupedCriteria = criteria.reduce((acc, criterion) => {
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      opening: 'bg-blue-50 border-blue-200',
      discovery: 'bg-emerald-50 border-emerald-200',
      handling: 'bg-amber-50 border-amber-200',
      value: 'bg-violet-50 border-violet-200',
      closing: 'bg-cyan-50 border-cyan-200'
    };
    return colors[category] || 'bg-slate-50 border-slate-200';
  };

  const selectedCriteria = selectedCriteriaId ? criteria.find(c => c.id === selectedCriteriaId) : null;
  const selectedScore = selectedCriteriaId ? getScoreForCriteria(selectedCriteriaId) : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Overall Score</h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl font-bold text-slate-900">{totalScore}</span>
            <span className="text-3xl text-slate-500">/</span>
            <span className="text-3xl font-semibold text-slate-600">{maxScore}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all ${
                totalScore / maxScore >= 0.8
                  ? 'bg-green-600'
                  : totalScore / maxScore >= 0.6
                  ? 'bg-cyan-600'
                  : totalScore / maxScore >= 0.4
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${(totalScore / maxScore) * 100}%` }}
            />
          </div>
          {overallFeedback && (
            <p className="text-sm text-slate-700 max-w-2xl mx-auto">{overallFeedback}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Score Breakdown</h2>

        <div className="space-y-6">
          {sortedCategories.map(category => {
            const categoryCriteria = groupedCriteria[category].sort((a, b) => a.order_index - b.order_index);
            const categoryMaxScore = categoryCriteria.reduce((sum, c) => sum + c.max_score, 0);
            const categoryScore = categoryCriteria.reduce((sum, c) => {
              const score = getScoreForCriteria(c.id);
              return sum + (score?.score || 0);
            }, 0);

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{getCategoryLabel(category)}</h3>
                  <span className="text-sm font-medium text-slate-600">
                    {categoryScore}/{categoryMaxScore} points
                  </span>
                </div>

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
                          <ChevronRight className="w-5 h-5 text-slate-400" />
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

      {selectedCriteria && selectedScore && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
            <div className={`p-6 border-b-4 ${
              selectedScore.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {selectedScore.passed ? (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-7 h-7 text-red-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedCriteria.name}</h3>
                    <p className="text-slate-700">{selectedCriteria.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold ${
                        selectedScore.passed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        Score: {selectedScore.score}/{selectedCriteria.max_score}
                      </span>
                      <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                        selectedScore.passed
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {selectedScore.passed ? 'Passed' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCriteriaId(null)}
                  className="flex-shrink-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 border-r border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Feedback Details</h3>

                <div className={`p-5 rounded-xl border-2 mb-4 ${
                  selectedScore.passed
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className={`w-5 h-5 mt-1 flex-shrink-0 ${
                      selectedScore.passed ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <div className="w-full">
                      <h4 className="text-base font-bold text-slate-900 mb-3">Why were you scored this way?</h4>
                      <div className="text-sm text-slate-800 leading-relaxed space-y-3">
                        {selectedScore.feedback.split('\n\n').map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>

                      {selectedScore.transcript_references && selectedScore.transcript_references.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {selectedScore.transcript_references.map((ref, idx) => (
                            <button
                              key={idx}
                              onClick={() => scrollToTranscript(ref.timestamp)}
                              className="flex items-start gap-3 w-full text-left p-3 bg-white rounded-lg border border-slate-300 hover:border-cyan-400 hover:shadow-sm transition-all"
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <span className="text-xs font-mono text-cyan-600 font-semibold">
                                  ({ref.timestamp})
                                </span>
                                <p className="text-sm text-slate-700 mt-1 italic">"{ref.text}"</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="w-full">
                      <h4 className="text-base font-bold text-slate-900 mb-3">What could you do differently next time?</h4>
                      {selectedScore.improvement_examples && selectedScore.improvement_examples.length > 0 ? (
                        <div className="text-sm text-slate-800 leading-relaxed space-y-3">
                          <ol className="space-y-3">
                            {selectedScore.improvement_examples.map((example, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="flex-1 pt-0.5 text-sm">{example}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ) : selectedScore.passed ? (
                        <div className="text-sm text-slate-800 leading-relaxed">
                          <p>Excellent work on this criteria! Continue applying this approach consistently.</p>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-800 leading-relaxed">
                          <p>N/A</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!selectedScore.passed && (
                  <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-200">
                    <h4 className="text-base font-bold text-amber-900 mb-3">Pro Tips</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Record yourself and review to identify moments where you could apply this technique</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Create a checklist for this criterion to reference during practice calls</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="w-80 overflow-y-auto p-6 bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Transcript</h3>

                {transcript && transcript.length > 0 ? (
                  <div className="space-y-2">
                    {transcript.map((msg, i) => {
                      const isHighlighted = highlightedTimestamp === msg.timestamp;
                      const isReferenced = selectedScore.transcript_references?.some(ref => ref.timestamp === msg.timestamp);

                      return (
                        <div
                          key={i}
                          id={`modal-transcript-${msg.timestamp}`}
                          className={`transition-all duration-300 ${
                            isHighlighted ? 'scale-[1.01]' : ''
                          }`}
                        >
                          <div className={`p-2.5 rounded transition-all duration-300 ${
                            isHighlighted
                              ? 'bg-cyan-400 text-white'
                              : isReferenced
                              ? 'bg-cyan-100'
                              : 'hover:bg-slate-100'
                          }`}>
                            <div className="flex items-start gap-2 mb-1">
                              <span className={`text-xs font-semibold ${
                                isHighlighted ? 'text-white' : msg.speaker === 'user' ? 'text-cyan-700' : 'text-slate-600'
                              }`}>
                                {msg.speaker === 'user' ? 'You' : botName || 'Bot'}
                              </span>
                              <span className={`text-xs font-mono ${
                                isHighlighted ? 'text-cyan-100' : 'text-slate-500'
                              }`}>
                                {msg.timestamp}
                              </span>
                            </div>
                            <p className={`text-xs leading-relaxed ${
                              isHighlighted ? 'text-white' : 'text-slate-700'
                            }`}>{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Transcript not available</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCriteriaId(null)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
