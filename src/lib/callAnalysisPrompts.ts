export interface TranscriptMessage {
  timestamp: string;
  speaker: 'user' | 'bot';
  text: string;
}

export interface ExtractedData {
  pain_statements: Array<{ ts: string; speaker: string; quote: string }>;
  decision_mentions: Array<{ ts: string; speaker: string; quote: string }>;
  budget_mentions: Array<{ ts: string; speaker: string; quote: string }>;
  competitor_mentions: Array<{ ts: string; speaker: string; quote: string }>;
  objections: Array<{ ts: string; speaker: string; quote: string }>;
  metrics: {
    questions_asked: number;
    talk_time_rep: number;
    talk_time_prospect: number;
    prospect_engagement_score: number;
  };
  key_moments: {
    opening_quote: { ts: string; text: string };
    strongest_moment: { ts: string; text: string };
    weakest_moment: { ts: string; text: string };
    closing_quote: { ts: string; text: string };
  };
}

export interface CriterionScore {
  score: number;
  passed: boolean;
  feedback: string;
  evidence_timestamps: string[];
  improvement?: string;
}

export const FRAMEWORK_DEFINITIONS = {
  MEDDPICC: {
    Metrics: {
      definition: 'Rep quantified business impact with specific numbers (revenue, cost savings, efficiency gains)',
      keywords: ['revenue', 'cost', 'save', 'increase', 'reduce', 'ROI', 'percent', 'dollar'],
      passing_criteria: 'Rep discussed specific quantified business impact',
    },
    'Economic Buyer': {
      definition: 'Rep identified who controls budget and makes final purchasing decisions',
      keywords: ['decide', 'budget', 'approve', 'CFO', 'VP', 'director', 'final say', 'authority'],
      passing_criteria: 'Rep explicitly asked about or identified decision maker',
    },
    'Decision Criteria': {
      definition: 'Rep uncovered what criteria will be used to evaluate solutions',
      keywords: ['criteria', 'evaluate', 'compare', 'requirements', 'must have', 'priority'],
      passing_criteria: 'Rep discovered specific evaluation criteria',
    },
    'Decision Process': {
      definition: 'Rep mapped out the buying process, timeline, and stakeholders involved',
      keywords: ['process', 'timeline', 'steps', 'stakeholders', 'approval', 'when', 'how long'],
      passing_criteria: 'Rep clarified steps and timeline for decision',
    },
    'Paper Process': {
      definition: 'Rep identified procurement, legal, or contracting requirements',
      keywords: ['contract', 'legal', 'procurement', 'MSA', 'security review', 'compliance'],
      passing_criteria: 'Rep discussed procurement or legal process',
    },
    'Identify Pain': {
      definition: 'Rep identified specific pain points and quantified their impact',
      keywords: ['problem', 'challenge', 'pain', 'difficult', 'frustrating', 'costing', 'losing'],
      passing_criteria: 'Rep uncovered pain and discussed business impact',
    },
    Champion: {
      definition: 'Rep identified internal advocate who will sell on their behalf',
      keywords: ['advocate', 'champion', 'help', 'support', 'internal', 'sponsor'],
      passing_criteria: 'Rep identified someone who will champion the solution internally',
    },
    Competition: {
      definition: 'Rep discovered what alternatives or competitors are being considered',
      keywords: ['alternative', 'competitor', 'also looking at', 'comparing', 'other options'],
      passing_criteria: 'Rep asked about other solutions being evaluated',
    },
  },
  SPIN: {
    Situation: {
      definition: 'Rep asked questions to understand current state and context',
      keywords: ['currently', 'now', 'today', 'how do you', 'what is your', 'describe'],
      passing_criteria: 'Rep thoroughly understood current situation',
    },
    Problem: {
      definition: 'Rep uncovered specific problems and difficulties',
      keywords: ['problem', 'challenge', 'issue', 'difficult', 'struggle', 'pain'],
      passing_criteria: 'Rep identified specific problems',
    },
    Implication: {
      definition: 'Rep explored consequences and costs of not solving the problem',
      keywords: ['if', 'cost', 'impact', 'result', 'consequence', 'what happens'],
      passing_criteria: 'Rep discussed implications of inaction',
    },
    'Need-Payoff': {
      definition: 'Rep got prospect to articulate benefits of solving the problem',
      keywords: ['benefit', 'help', 'improve', 'better', 'value', 'useful', 'solve'],
      passing_criteria: 'Rep had prospect describe value of solution',
    },
  },
  BANT: {
    Budget: {
      definition: 'Rep confirmed budget is available or allocated',
      keywords: ['budget', 'cost', 'price', 'afford', 'allocated', 'approved'],
      passing_criteria: 'Rep discussed budget availability',
    },
    Authority: {
      definition: 'Rep confirmed speaking with decision-maker or influencer',
      keywords: ['decide', 'authority', 'decision maker', 'approve', 'sign off'],
      passing_criteria: 'Rep identified decision-making authority',
    },
    Need: {
      definition: 'Rep identified clear, urgent business need',
      keywords: ['need', 'must', 'require', 'urgent', 'critical', 'important'],
      passing_criteria: 'Rep confirmed urgent business need',
    },
    Timeline: {
      definition: 'Rep established when decision will be made and implementation timeline',
      keywords: ['when', 'timeline', 'deadline', 'by', 'date', 'schedule'],
      passing_criteria: 'Rep clarified decision and implementation timeline',
    },
  },
};

export function generateExtractionPrompt(transcript: TranscriptMessage[]): string {
  const transcriptText = transcript
    .map((msg) => `[${msg.timestamp}] ${msg.speaker === 'user' ? 'Rep' : 'Prospect'}: ${msg.text}`)
    .join('\n');

  return `Extract structured data from sales call transcript.

Output valid JSON only with this structure:
{
  "pain_statements": [{ts:"00:00",speaker:"Rep/Prospect",quote:"exact text"}],
  "decision_mentions": [{ts,speaker,quote}],
  "budget_mentions": [{ts,speaker,quote}],
  "competitor_mentions": [{ts,speaker,quote}],
  "objections": [{ts,speaker,quote}],
  "metrics": {
    "questions_asked": 0,
    "talk_time_rep": 0,
    "talk_time_prospect": 0,
    "prospect_engagement_score": 0
  },
  "key_moments": {
    "opening_quote": {ts,text},
    "strongest_moment": {ts,text},
    "weakest_moment": {ts,text},
    "closing_quote": {ts,text}
  }
}

Transcript:
${transcriptText}`;
}

export function generateCriterionScoringPrompt(
  criterion: string,
  definition: any,
  relevantQuotes: Array<{ ts: string; speaker: string; quote: string }>,
  metrics: any
): string {
  const quotesText = relevantQuotes
    .map((q) => `[${q.ts}] ${q.speaker}: "${q.quote}"`)
    .join('\n');

  return `Score: ${criterion}

Definition: ${definition.definition}

Passing criteria: ${definition.passing_criteria}

Relevant quotes from call:
${quotesText || 'No relevant quotes found'}

Call metrics:
- Questions asked: ${metrics.questions_asked}
- Prospect engagement: ${metrics.prospect_engagement_score}/10

Output valid JSON only:
{
  "score": 0-10,
  "passed": true/false,
  "feedback": "2-3 sentence explanation of score based on evidence",
  "evidence_timestamps": ["00:42"],
  "improvement": "If failed: 1 specific action to improve"
}`;
}

export function generateSynthesisPrompt(
  scores: Record<string, CriterionScore>,
  keyMoments: any,
  framework: string
): string {
  return `Synthesize sales call analysis.

Framework: ${framework}

Scores:
${JSON.stringify(scores, null, 2)}

Key moments:
${JSON.stringify(keyMoments, null, 2)}

Output valid JSON only:
{
  "executive_summary": "3 sentences summarizing call performance",
  "top_3_strengths": ["strength 1", "strength 2", "strength 3"],
  "top_3_improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "deal_risk_level": "low/medium/high",
  "recommended_actions": ["action 1", "action 2", "action 3"]
}`;
}

export function filterRelevantQuotes(
  extractedData: ExtractedData,
  criterion: string,
  framework: string
): Array<{ ts: string; speaker: string; quote: string }> {
  const definition = (FRAMEWORK_DEFINITIONS as any)[framework][criterion];
  const keywords = definition.keywords.map((k: string) => k.toLowerCase());

  const allQuotes = [
    ...extractedData.pain_statements,
    ...extractedData.decision_mentions,
    ...extractedData.budget_mentions,
    ...extractedData.competitor_mentions,
  ];

  return allQuotes.filter((quote) => {
    const lowerText = quote.quote.toLowerCase();
    return keywords.some((keyword) => lowerText.includes(keyword));
  });
}

export function calculateTokenEstimate(transcript: TranscriptMessage[]): {
  naive: number;
  optimized: number;
  savings: number;
} {
  const avgCharsPerToken = 4;
  const transcriptLength = transcript.reduce((sum, msg) => sum + msg.text.length, 0);
  const transcriptTokens = Math.ceil(transcriptLength / avgCharsPerToken);

  const naivePromptSize = 3000;
  const naiveTotal = transcriptTokens + naivePromptSize;

  const extractionTokens = transcriptTokens + 500;
  const scoringTokens = 8 * 200;
  const synthesisTokens = 800;
  const optimizedTotal = extractionTokens + scoringTokens + synthesisTokens;

  return {
    naive: naiveTotal,
    optimized: optimizedTotal,
    savings: Math.round((1 - optimizedTotal / naiveTotal) * 100),
  };
}

export const COST_PER_1K_TOKENS = {
  'gpt-4o-mini-input': 0.00015,
  'gpt-4o-mini-output': 0.0006,
  'gpt-4o-input': 0.0025,
  'gpt-4o-output': 0.01,
};

export function calculateCostEstimate(tokenEstimate: ReturnType<typeof calculateTokenEstimate>): {
  naive: number;
  optimized: number;
  savings: number;
} {
  const naiveCost =
    (tokenEstimate.naive / 1000) * COST_PER_1K_TOKENS['gpt-4o-input'] +
    (1000 / 1000) * COST_PER_1K_TOKENS['gpt-4o-output'];

  const optimizedCost =
    (tokenEstimate.optimized / 1000) * COST_PER_1K_TOKENS['gpt-4o-mini-input'] +
    (500 / 1000) * COST_PER_1K_TOKENS['gpt-4o-mini-output'];

  return {
    naive: Number(naiveCost.toFixed(4)),
    optimized: Number(optimizedCost.toFixed(4)),
    savings: Math.round((1 - optimizedCost / naiveCost) * 100),
  };
}
