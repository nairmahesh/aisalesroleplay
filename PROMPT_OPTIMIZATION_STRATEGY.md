# Post-Call Analysis: Token-Optimized Prompt Strategy

## Architecture Overview

```
Call Transcript (10,000 tokens)
    ↓
[PHASE 1] Extract + Classify (GPT-4o-mini)
    ↓ (500 tokens)
Key Moments + Speakers + Topics
    ↓
[PHASE 2] Parallel Scoring (GPT-4o-mini × 8)
    ↓ (200 tokens each)
Individual Criterion Scores
    ↓
[PHASE 3] Synthesis (GPT-4o)
    ↓ (800 tokens)
Final Report + Insights

Total Input Tokens: ~3,300 (vs 80,000 with naive approach)
Cost Savings: 96%
```

---

## Phase 1: Extraction Prompt (Cheap & Fast)

**Model**: GPT-4o-mini
**Input**: Full transcript
**Output**: Structured JSON

### Prompt:
```
Extract from transcript:

1. Key quotes by category:
   - pain_statements: [{ts, speaker, quote}]
   - decision_mentions: [{ts, speaker, quote}]
   - budget_mentions: [{ts, speaker, quote}]
   - competitor_mentions: [{ts, speaker, quote}]
   - objections: [{ts, speaker, quote}]

2. Metrics:
   - questions_asked: int
   - talk_time_rep: seconds
   - talk_time_prospect: seconds
   - prospect_engagement_score: 1-10

3. Key moments:
   - opening_quote: {ts, text}
   - strongest_moment: {ts, text}
   - weakest_moment: {ts, text}
   - closing_quote: {ts, text}

Transcript:
[FULL_TRANSCRIPT]

Output only valid JSON.
```

**Token Usage**: ~3,000 input, ~500 output
**Cost**: ~$0.001

---

## Phase 2: Criterion Scoring (Parallel)

**Model**: GPT-4o-mini (8 parallel requests)
**Input**: Extracted data + single criterion definition
**Output**: Single criterion score

### Prompt Template:
```
Score: [CRITERION_NAME]

Definition: [CRITERION_DEF]

Relevant quotes:
[FILTERED_QUOTES_FOR_THIS_CRITERION]

Call metrics:
- Duration: [X]
- Questions: [Y]
- Engagement: [Z]

Output JSON:
{
  "score": 0-10,
  "passed": boolean,
  "feedback": "2-3 sentences explaining score",
  "evidence_timestamps": ["00:42", "01:15"],
  "improvement": "If failed, 1 specific action"
}
```

**Token Usage Per Request**: ~200 input, ~150 output
**Total for 8 criteria**: ~2,800 tokens
**Cost**: ~$0.001

---

## Phase 3: Synthesis (Smart)

**Model**: GPT-4o (only if needed for complex insights)
**Input**: All scores + key moments
**Output**: Executive summary + insights

### Prompt:
```
Synthesize call analysis:

Scores:
[JSON_OF_ALL_SCORES]

Key moments:
[EXTRACTED_MOMENTS]

Generate:
1. executive_summary (3 sentences)
2. top_3_strengths
3. top_3_improvements
4. deal_risk_level (low/med/high)
5. recommended_actions [3 items]

Output valid JSON only.
```

**Token Usage**: ~800 input, ~300 output
**Cost**: ~$0.003

---

## Total Cost Comparison

### Naive Approach:
- Single prompt with full transcript + all instructions
- Input: ~15,000 tokens
- Model: GPT-4o (required for quality)
- Cost per call: **$0.15**
- Time: ~30 seconds

### Optimized Approach:
- 3 phases, parallel processing
- Input: ~3,300 tokens total
- Models: Mostly GPT-4o-mini
- Cost per call: **$0.005**
- Time: ~8 seconds (parallel)

### Savings: **97% cost reduction, 4x faster**

---

## Framework Definitions (Store Once, Reuse)

```json
{
  "MEDDPICC": {
    "Metrics": {
      "definition": "Quantified business impact (revenue, savings, efficiency)",
      "good_indicators": ["specific numbers", "ROI mentioned", "timeline for impact"],
      "bad_indicators": ["vague benefits", "no quantification", "no business case"],
      "keywords": ["revenue", "cost", "save", "increase", "reduce", "ROI", "%", "$"]
    },
    "Economic_Buyer": {
      "definition": "Identified the person who controls budget/final decision",
      "good_indicators": ["asked about decision maker", "mentioned budget holder", "discussed authority"],
      "bad_indicators": ["didn't ask about authority", "assumed contact is decision maker"],
      "keywords": ["decide", "budget", "approve", "CFO", "VP", "director", "final say"]
    }
    // ... etc for all 8 criteria
  }
}
```

Store in Supabase table `framework_definitions` - retrieve only needed criterion.

---

## Smart Windowing Algorithm

```javascript
// Identify which transcript sections are relevant for each criterion
function identifyRelevantWindows(transcript, criterion) {
  const keywords = frameworkDefs[criterion].keywords;
  const windows = [];

  // Find sections with keyword density > threshold
  for (let i = 0; i < transcript.length; i += 5) {
    const window = transcript.slice(i, i + 10); // 10 messages
    const keywordCount = countKeywords(window, keywords);

    if (keywordCount > 2) {
      windows.push({
        start: i,
        end: i + 10,
        relevance: keywordCount
      });
    }
  }

  return mergeOverlappingWindows(windows);
}

// Result: Send only 15% of transcript per criterion
```

---

## Implementation Priorities

### Phase 1 (MVP): Basic Chunking
1. ✅ Extract key quotes first
2. ✅ Score each criterion separately
3. ✅ Use GPT-4o-mini for everything
4. **Savings: 60%, Easy to implement**

### Phase 2: Smart Windowing
1. Add keyword-based relevance detection
2. Send only relevant transcript sections
3. **Savings: 85%, Moderate complexity**

### Phase 3: Advanced
1. Add embeddings for framework definitions
2. Implement parallel processing
3. Add caching for repeated transcripts
4. **Savings: 97%, High complexity**

---

## Caching Strategy

```javascript
// Cache transcript analysis for 24 hours
const cacheKey = `analysis:${hashTranscript(transcript)}:${framework}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return cached; // 100% token savings on repeated calls
}

// If practice call with same script, cache indefinitely
if (isPracticeCall && transcriptTemplate) {
  const templateCache = await getTemplateAnalysis(transcriptTemplate);
  // Reuse 80% of analysis, only personalize 20%
}
```

---

## Monitoring & Optimization

Track these metrics:
- Average tokens per call
- Cost per analysis
- Processing time
- Cache hit rate
- Model accuracy (spot check)

Optimize based on:
- If accuracy drops below 90%, use larger model for that phase
- If certain criteria always need full context, don't window them
- If cache hit rate < 20%, adjust strategy
