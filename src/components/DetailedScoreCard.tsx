import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
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
        <div className="bg-white rounded-xl border-2 border-cyan-200 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {selectedScore.passed ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedCriteria.name}</h3>
                <p className="text-sm text-slate-600">{selectedCriteria.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCriteriaId(null)}
              className="text-slate-500 hover:text-slate-700 font-medium"
            >
              Close
            </button>
          </div>

          <div className={`p-5 rounded-lg border-2 mb-4 ${
            selectedScore.passed
              ? 'border-green-300 bg-green-50'
              : 'border-red-300 bg-red-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">Score</h4>
              <span className={`text-2xl font-bold ${
                selectedScore.passed ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedScore.score}/{selectedCriteria.max_score}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Why were you scored this way?</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{selectedScore.feedback}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">What could you do differently next time?</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedScore.passed
                ? 'Excellent work on this criteria! Continue to apply this approach in your future calls to maintain consistency.'
                : `Focus on ${selectedCriteria.name.toLowerCase()} by being more intentional and asking targeted questions. Review the feedback above and practice this specific skill in your next roleplay session.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
