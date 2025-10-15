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

export interface CallScore {
  id: string;
  criteria_id: string;
  score: number;
  passed: boolean;
  feedback: string;
  transcript_evidence?: string;
  timestamp?: string;
  improvement_examples?: string[];
}

interface DetailedScoreCardProps {
  totalScore: number;
  maxScore: number;
  criteria: ScoringCriteria[];
  scores: CallScore[];
  overallFeedback?: string;
}

export function DetailedScoreCard({ totalScore, maxScore, criteria, scores, overallFeedback }: DetailedScoreCardProps) {
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null);

  const getScoreForCriteria = (criteriaId: string) => {
    return scores.find(s => s.criteria_id === criteriaId);
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
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

            <div className="p-8 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              {selectedScore.transcript_evidence && (
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-700 font-mono text-sm font-bold">{selectedScore.timestamp || '0:00'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-3">Transcript Evidence</h4>
                      <div className="bg-white p-4 rounded-lg border border-slate-300 font-mono text-sm text-slate-800 whitespace-pre-wrap">
                        {selectedScore.transcript_evidence}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={`p-6 rounded-xl border-2 ${
                selectedScore.passed
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className={`w-6 h-6 mt-1 ${
                    selectedScore.passed ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div className="w-full">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">Why were you scored this way?</h4>
                    <div className="text-slate-800 leading-relaxed space-y-3">
                      {selectedScore.feedback.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="w-full">
                    <h4 className="text-lg font-bold text-slate-900 mb-3">What could you do differently next time?</h4>
                    {selectedScore.improvement_examples && selectedScore.improvement_examples.length > 0 ? (
                      <div className="text-slate-800 leading-relaxed space-y-3">
                        <p className="font-medium mb-3">The rep could have helped quantify the business impact by:</p>
                        <ol className="space-y-3">
                          {selectedScore.improvement_examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="flex-1 pt-0.5">{example}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : selectedScore.passed ? (
                      <div className="text-slate-800 leading-relaxed space-y-3">
                        <p className="font-medium">Excellent work on this criteria! Here's how to maintain this standard:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                          <li>Continue applying this approach consistently in all your calls</li>
                          <li>Use this as a reference point for training team members</li>
                          <li>Document what worked well for future preparation</li>
                          <li>Look for opportunities to refine and optimize this skill further</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="text-slate-800 leading-relaxed space-y-3">
                        <p className="font-medium">Here are specific steps to improve:</p>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                          <li>Review the detailed feedback above and identify the key gap</li>
                          <li>Practice {selectedCriteria.name.toLowerCase()} in your next roleplay session with specific focus on this area</li>
                          <li>Prepare specific questions or talking points related to this criterion before calls</li>
                          <li>Ask for feedback from peers or managers specifically on this skill</li>
                          <li>Watch recordings of successful calls that demonstrate this criterion well</li>
                        </ol>
                        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                          <p className="font-semibold text-blue-900 mb-2">Key Focus Area:</p>
                          <p className="text-slate-700">
                            {selectedCriteria.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!selectedScore.passed && (
                <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
                  <h4 className="text-lg font-bold text-amber-900 mb-3">Pro Tips</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Record yourself practicing and review the recording to identify specific moments where you could have applied this technique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Create a checklist of key points for this criterion and keep it visible during practice calls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Schedule dedicated practice time focusing exclusively on improving this one skill</span>
                    </li>
                  </ul>
                </div>
              )}
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
