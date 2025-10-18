# Pricing Analysis & Cost Structure
## Sales Practice Call Platform - Per User Cost Evaluation

---

## Executive Summary

**Bottom Line:** Your actual cost per user ranges from **$9-$186/month** depending on usage intensity.

**Recommended Pricing Tiers:**
- **Starter:** $29-49/month (10 calls) - 3-5x margin
- **Professional:** $99-149/month (50 calls) - 2-3x margin
- **Team:** $299-499/month (unlimited) - 2-4x margin
- **Enterprise:** Custom (volume discounts, dedicated support)

---

## Cost Per Call Breakdown

### Full Voice Call (10 minutes)
```
Component                    API Calls    Cost Range
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Conversation (LLM)        10-20       $0.20-$0.60
Voice Synthesis (TTS)        10-20       $2.00-$4.00
Post-Call Analysis (LLM)      1          $0.025-$0.035
Voice Transcription (STT)     1          $0.10-$0.20
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PER VOICE CALL                    $2.33-$4.84
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Average: $3.58 per voice call**

### Text-Only Call (10 minutes)
```
Component                    API Calls    Cost Range
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Conversation (LLM)        10-20       $0.20-$0.60
Post-Call Analysis (LLM)      1          $0.025-$0.035
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PER TEXT CALL                     $0.23-$0.64
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Average: $0.44 per text call**

---

## Per User Monthly Cost Models

### Model 1: Light User (Individual Contributor)
**Usage Pattern:** 2-3 practice calls per week

| Metric | Voice Only | Text Only | Mixed (50/50) |
|--------|-----------|-----------|---------------|
| Calls/month | 10 | 10 | 10 (5 voice, 5 text) |
| **Cost/month** | **$36** | **$4.40** | **$20** |
| Data storage | $0.10 | $0.10 | $0.10 |
| **TOTAL** | **$36.10** | **$4.50** | **$20.10** |

**Recommended Price:** $49-79/month
**Margin:** 36-54%

---

### Model 2: Regular User (Active Rep)
**Usage Pattern:** 1 practice call per day

| Metric | Voice Only | Text Only | Mixed (50/50) |
|--------|-----------|-----------|---------------|
| Calls/month | 20 | 20 | 20 (10 voice, 10 text) |
| **Cost/month** | **$72** | **$8.80** | **$40** |
| Data storage | $0.20 | $0.20 | $0.20 |
| **TOTAL** | **$72.20** | **$9.00** | **$40.20** |

**Recommended Price:** $99-149/month
**Margin:** 27-52%

---

### Model 3: Power User (Sales Manager/Trainer)
**Usage Pattern:** 2-3 practice calls per day

| Metric | Voice Only | Text Only | Mixed (50/50) |
|--------|-----------|-----------|---------------|
| Calls/month | 50 | 50 | 50 (25 voice, 25 text) |
| **Cost/month** | **$179** | **$22** | **$101** |
| Data storage | $0.50 | $0.50 | $0.50 |
| **TOTAL** | **$179.50** | **$22.50** | **$101.50** |

**Recommended Price:** $199-299/month
**Margin:** 11-40%

---

### Model 4: Heavy User (Enterprise Training Program)
**Usage Pattern:** Daily intensive training

| Metric | Voice Only | Text Only | Mixed (50/50) |
|--------|-----------|-----------|---------------|
| Calls/month | 100 | 100 | 100 (50 voice, 50 text) |
| **Cost/month** | **$358** | **$44** | **$201** |
| Data storage | $1.00 | $1.00 | $1.00 |
| **TOTAL** | **$359** | **$45** | **$202** |

**Recommended Price:** $399-599/month
**Margin:** 11-40%

---

## Team-Based Pricing (Multi-User)

### Small Team (5 users)
**Assumption:** 20 calls/user/month, 80% voice, 20% text

```
Per User Cost: $57.76/month
Total Team Cost: $288.80/month

Recommended Team Price: $399-499/month ($80-100/user)
Margin: 28-42%
```

### Medium Team (20 users)
**Assumption:** 15 calls/user/month, 70% voice, 30% text

```
Per User Cost: $38.24/month
Total Team Cost: $764.80/month

Recommended Team Price: $1,499-1,999/month ($75-100/user)
Margin: 49-62%
```

### Enterprise Team (100+ users)
**Assumption:** 10 calls/user/month, 60% voice, 40% text

```
Per User Cost: $23.16/month
Total Team Cost (100 users): $2,316/month

Recommended Team Price: $4,999-7,999/month ($50-80/user)
Margin: 54-71%
```

---

## Additional Infrastructure Costs

### Fixed Monthly Costs
```
Service                          Cost/Month    Notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Supabase Database (Pro)         $25           Up to 8GB
Hosting/CDN                     $20           Vercel/Netlify Pro
Auth/User Management            $0            (Supabase included)
Analytics/Monitoring            $15           Error tracking
WebRTC Infrastructure           $50           TURN/STUN servers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL FIXED COSTS              $110/month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Per User Fixed Cost (amortized)
- 10 users: $11/user/month
- 50 users: $2.20/user/month
- 100 users: $1.10/user/month
- 500 users: $0.22/user/month

---

## Break-Even Analysis

### Scenario: Individual User Plans

| Plan | Price | Calls Included | User Cost (Voice) | User Cost (Text) | Break-Even Users |
|------|-------|----------------|-------------------|------------------|------------------|
| Starter | $49 | 10 | $36.10 | $4.50 | 3 users (voice) |
| Pro | $99 | 20 | $72.20 | $9.00 | 2 users (voice) |
| Premium | $199 | 50 | $179.50 | $22.50 | 1 user (voice) |

**Conclusion:** Need minimum 5-10 paying users to cover fixed costs.

---

## Recommended Pricing Strategy

### Option A: Usage-Based Tiers (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│ STARTER                                          $49/month  │
│ ─────────────────────────────────────────────────────────── │
│ • 10 voice calls/month                                      │
│ • Unlimited text calls                                      │
│ • Basic analytics                                           │
│ • Email support                                             │
│                                                             │
│ Your Cost: $36/month | Margin: $13 (26%)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PROFESSIONAL                                    $149/month  │
│ ─────────────────────────────────────────────────────────── │
│ • 30 voice calls/month                                      │
│ • Unlimited text calls                                      │
│ • Advanced analytics & trends                               │
│ • Custom bot personalities                                  │
│ • Priority email support                                    │
│                                                             │
│ Your Cost: $108/month | Margin: $41 (28%)                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ BUSINESS                                        $299/month  │
│ ─────────────────────────────────────────────────────────── │
│ • 75 voice calls/month                                      │
│ • Unlimited text calls                                      │
│ • Team analytics & leaderboards                             │
│ • CRM integrations                                          │
│ • Dedicated account manager                                 │
│                                                             │
│ Your Cost: $269/month | Margin: $30 (10%)                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENTERPRISE                                         Custom   │
│ ─────────────────────────────────────────────────────────── │
│ • Unlimited voice + text calls                              │
│ • White-label options                                       │
│ • Custom integrations                                       │
│ • SLA guarantees                                            │
│ • Dedicated support team                                    │
│                                                             │
│ Your Cost: Volume-dependent | Target Margin: 40-60%        │
└─────────────────────────────────────────────────────────────┘
```

---

### Option B: Team-Based Pricing

```
┌─────────────────────────────────────────────────────────────┐
│ SMALL TEAM (5 users)                            $399/month  │
│ ─────────────────────────────────────────────────────────── │
│ • 100 team voice calls/month (20/user)                      │
│ • $80/user/month                                            │
│                                                             │
│ Your Cost: $289/month | Margin: $110 (28%)                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MEDIUM TEAM (20 users)                        $1,599/month  │
│ ─────────────────────────────────────────────────────────── │
│ • 300 team voice calls/month (15/user)                      │
│ • $80/user/month                                            │
│                                                             │
│ Your Cost: $765/month | Margin: $834 (52%)                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENTERPRISE TEAM (100+ users)                       Custom   │
│ ─────────────────────────────────────────────────────────── │
│ • Volume pricing: $50-70/user/month                         │
│ • Minimum 100 users                                         │
│                                                             │
│ Your Cost: ~$23/user | Target Margin: 54-67%               │
└─────────────────────────────────────────────────────────────┘
```

---

### Option C: Freemium Model

```
┌─────────────────────────────────────────────────────────────┐
│ FREE                                                  $0    │
│ ─────────────────────────────────────────────────────────── │
│ • 3 text calls/month                                        │
│ • Basic scoring only                                        │
│ • Community support                                         │
│                                                             │
│ Your Cost: $1.32/month | Loss Leader                       │
└─────────────────────────────────────────────────────────────┘

Then upsell to paid tiers above.
Conversion target: 5-10% free → paid
```

---

## Cost Optimization Strategies

### 1. Encourage Text Calls for Practice
```
Cost Savings: 92% per call
Strategy: Offer unlimited text calls, limited voice calls
Impact: Reduces average user cost from $72 → $20/month
```

### 2. Implement Smart Caching
```
Cost Savings: 20-30% on LLM calls
Strategy: Cache common bot responses, personality traits
Impact: Reduces average user cost by $7-15/month
```

### 3. Batch Processing for Analysis
```
Cost Savings: 15-25% on analysis calls
Strategy: Analyze multiple calls together
Impact: Reduces analysis cost from $0.035 → $0.026/call
```

### 4. Shorter Call Durations
```
Cost Savings: 40-50% per call
Strategy: Default to 5-minute calls, offer 10-min premium
Impact: Reduces voice call cost from $3.58 → $1.79
```

### 5. Regional Voice Models
```
Cost Savings: 30-40% on TTS
Strategy: Use cheaper TTS for non-premium tiers
Impact: Reduces voice call cost from $3.58 → $2.39
```

---

## Competitive Pricing Benchmarks

### Similar SaaS Products

| Product | Type | Price/User/Month | Features |
|---------|------|------------------|----------|
| Gong | Sales Intelligence | $1,200-2,400 | Recording, analysis, coaching |
| Chorus.ai | Conversation Intelligence | $1,800-3,600 | Similar to Gong |
| ExecVision | Call Coaching | $600-1,200 | Recording, scoring, coaching |
| Salesloft Conversations | Sales Engagement | $900-1,500 | Part of larger platform |
| **Your Platform** | **AI Roleplay** | **$49-299** | **Practice + Real-time scoring** |

**Key Differentiator:** You're 5-10x cheaper because:
- AI roleplay (not human time)
- Practice tool (not full sales platform)
- No recording storage for real calls
- Focused feature set

**Market Position:** Accessible training tool vs. enterprise analytics platform

---

## Financial Projections

### Year 1 Target (Conservative)

```
Month 1-3 (Beta):
  • 20 users @ $49/month = $980/month
  • Costs: $110 fixed + $722 variable = $832
  • Net: $148/month
  • Margin: 15%

Month 4-6 (Launch):
  • 100 users @ $99 avg = $9,900/month
  • Costs: $110 fixed + $7,220 variable = $7,330
  • Net: $2,570/month
  • Margin: 26%

Month 7-12 (Growth):
  • 500 users @ $129 avg = $64,500/month
  • Costs: $110 fixed + $36,100 variable = $36,210
  • Net: $28,290/month
  • Margin: 44%

Year 1 Revenue: ~$400,000
Year 1 Profit: ~$150,000 (38% margin)
```

### Year 2 Target (Growth)

```
• 2,000 users @ $149 avg = $298,000/month
• Costs: $110 fixed + $144,400 variable = $144,510
• Net: $153,490/month
• Margin: 52%

Year 2 Revenue: ~$3.6M
Year 2 Profit: ~$1.8M (50% margin)
```

---

## Key Metrics to Track

### Unit Economics
```
Metric                        Target      Notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAC (Customer Acq Cost)       $150        Marketing + sales
LTV (Lifetime Value)          $1,800      Based on 12mo retention
LTV:CAC Ratio                 12:1        Healthy SaaS metric
Payback Period                2 months    Time to recover CAC
Gross Margin                  40-60%      After variable costs
Churn Rate                    <5%/mo      Monthly customer churn
NRR (Net Revenue Retention)   >110%       Expansion revenue
```

### Per-User Metrics
```
Average Calls/User/Month      15-25       Mix of voice + text
Average Revenue/User          $99-149     Blended across tiers
Average Cost/User             $50-75      Voice-heavy usage
Contribution Margin/User      $49-74      Revenue - variable cost
```

---

## Pricing Recommendations Summary

### Optimal Strategy: **Hybrid Usage + Value Tiers**

**Why this works:**
1. **Predictable costs** for users (capped monthly plans)
2. **High margins** on light users (subsidize heavy users)
3. **Clear upgrade path** as usage grows
4. **Text calls** as loss leader to drive engagement
5. **Voice calls** as premium feature with pricing power

### Recommended Launch Pricing:

```
┌──────────────────────────────────────────────────┐
│ INDIVIDUAL PLANS                                 │
├──────────────────────────────────────────────────┤
│ Starter:       $49/mo  (10 voice + unlimited text)│
│ Professional:  $99/mo  (25 voice + unlimited text)│
│ Premium:       $199/mo (60 voice + unlimited text)│
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ TEAM PLANS                                       │
├──────────────────────────────────────────────────┤
│ Small (5):     $299/mo ($60/user, 75 team calls) │
│ Medium (15):   $899/mo ($60/user, 225 team calls)│
│ Large (50):    $2,499/mo ($50/user, 750 calls)   │
│ Enterprise:    Custom (volume discounts)         │
└──────────────────────────────────────────────────┘
```

### Target Margins:
- **Starter/Small users:** 25-35% (acquisition focus)
- **Pro/Medium users:** 35-50% (sweet spot)
- **Premium/Enterprise:** 50-70% (high margin)
- **Blended average:** 40-55%

---

## Risk Analysis

### High Usage Risk
**Problem:** Power users exceed cost assumptions
**Mitigation:**
- Hard limits on voice calls per tier
- Overage charges ($4/additional voice call)
- Automatic tier upgrade prompts
- Monitor top 10% users weekly

### Low Adoption Risk
**Problem:** Users don't engage enough to see value
**Mitigation:**
- Onboarding sequences to drive usage
- Weekly practice reminders
- Free text calls to build habit
- Success metrics dashboards

### Competitive Pricing Pressure
**Problem:** Competitors undercut on price
**Mitigation:**
- Focus on ROI (better reps = more revenue)
- Enterprise features (integrations, analytics)
- Lock-in through custom bots/data
- Annual contracts with discounts

---

## Next Steps for Pricing Strategy

### Phase 1: Validation (Weeks 1-4)
- [ ] Beta test with 20 users at $49/month
- [ ] Track actual usage patterns
- [ ] Measure willingness to upgrade
- [ ] A/B test $49 vs $79 starter price

### Phase 2: Optimization (Months 2-3)
- [ ] Adjust tier limits based on actual usage
- [ ] Introduce annual pricing (2mo discount)
- [ ] Add overage options
- [ ] Test team pricing with 2-3 pilots

### Phase 3: Scale (Months 4-6)
- [ ] Launch full pricing page
- [ ] Enable self-service upgrades
- [ ] Implement usage alerts
- [ ] Build ROI calculator for sales

### Phase 4: Enterprise (Months 7-12)
- [ ] Custom pricing for 50+ users
- [ ] Volume discounts
- [ ] Annual contracts
- [ ] Success team for high-value accounts

---

## Conclusion

### Your Actual Cost Per User:
- **Light user (10 calls/mo):** $9-36/month
- **Regular user (20 calls/mo):** $18-72/month
- **Power user (50 calls/mo):** $45-180/month
- **Heavy user (100 calls/mo):** $90-360/month

### Recommended Pricing Per User:
- **Light:** $49-79/month (2-4x cost)
- **Regular:** $99-149/month (2-3x cost)
- **Power:** $199-299/month (1.5-3x cost)
- **Enterprise:** Custom (2-5x cost with volume)

### Key Success Factors:
1. ✅ Drive text call adoption (92% cheaper)
2. ✅ Implement smart caching (20-30% savings)
3. ✅ Monitor usage patterns continuously
4. ✅ Clear upgrade paths as usage grows
5. ✅ Focus on ROI/value over feature count

**Target blended margin: 40-55% across all tiers**

---

*Last Updated: 2025-10-18*
*Cost assumptions based on current AI provider pricing*
*Actual costs may vary based on provider negotiations and usage patterns*
