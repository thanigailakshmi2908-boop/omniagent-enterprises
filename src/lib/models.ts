import type { ModelInfo, Persona } from './types';

export const MODELS: ModelInfo[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    shortName: '3.6 Flash',
    description: 'High-speed agentic planning and multi-step reasoning',
    tagline: 'Agentic Planning',
    role: 'planning',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    speedTokensPerSec: 850,
    maxTokens: 1048576,
    badgeColor: 'from-sky-500 to-cyan-400',
    iconColor: 'text-sky-400',
  },
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash-Lite',
    shortName: '3.5 Flash-Lite',
    description: 'Lightning-fast data extraction and classification',
    tagline: 'Data Extraction',
    role: 'extraction',
    inputCostPer1M: 0.0375,
    outputCostPer1M: 0.15,
    speedTokensPerSec: 1200,
    maxTokens: 1048576,
    badgeColor: 'from-emerald-500 to-teal-400',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    shortName: '3.1 Pro',
    description: 'Deep architectural reasoning and complex analysis',
    tagline: 'Deep Reasoning',
    role: 'reasoning',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    speedTokensPerSec: 180,
    maxTokens: 2097152,
    badgeColor: 'from-violet-500 to-fuchsia-400',
    iconColor: 'text-violet-400',
  },
];

export const PERSONAS: Persona[] = [
  {
    id: 'financial',
    name: 'Financial Anomaly Detector',
    shortName: 'Finance',
    description: 'Detects anomalies, fraud patterns, and irregularities in financial data',
    systemPrompt: `You are a Financial Anomaly Detector agent specialized in identifying fraud, irregularities, and unusual patterns in financial data. Analyze the provided documents for:
- Statistical outliers and deviations beyond 2-sigma thresholds
- Duplicate or suspicious transaction patterns
- Unusual timing, frequency, or amount distributions
- Compliance violations and regulatory red flags

Structure your response with:
1. **Executive Summary** — key findings and risk level
2. **Anomalies Detected** — table of flagged items with severity
3. **Risk Assessment** — scored by category
4. **Recommended Actions** — prioritized remediation steps`,
    outputFormat: 'Structured anomaly report with severity tables',
    icon: 'TrendingUp',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'codebase',
    name: 'Codebase Refactorer',
    shortName: 'Refactor',
    description: 'Analyzes code for refactoring opportunities, complexity, and best practices',
    systemPrompt: `You are a Codebase Refactorer agent specialized in improving code quality, reducing complexity, and applying design patterns. Analyze the provided code for:
- Cyclomatic complexity hotspots
- SOLID principle violations
- Duplication and DRY opportunities
- Performance bottlenecks and anti-patterns
- Security vulnerabilities

Structure your response with:
1. **Architecture Overview** — current state assessment
2. **Refactoring Recommendations** — ranked by impact/effort
3. **Code Smells** — categorized list with locations
4. **Before/After Snippets** — concrete improvement examples
5. **Migration Plan** — phased refactoring roadmap`,
    outputFormat: 'Refactoring plan with code examples',
    icon: 'Code2',
    accent: 'from-sky-500 to-blue-500',
  },
  {
    id: 'resume',
    name: 'Smart Resume Matcher',
    shortName: 'Resume',
    description: 'Matches candidate resumes against job requirements with semantic scoring',
    systemPrompt: `You are a Smart Resume Matcher agent specialized in semantic matching between candidate profiles and job requirements. Analyze the provided documents for:
- Skills coverage and gap analysis
- Experience relevance scoring (0-100)
- Keyword and competency extraction
- Cultural fit indicators
- Red flags and embellishment detection

Structure your response with:
1. **Match Summary** — overall compatibility score
2. **Skills Matrix** — required vs. possessed skills table
3. **Strengths** — highlighted qualifications
4. **Gaps** — missing or weak areas
5. **Recommendation** — hire/no-hire with reasoning`,
    outputFormat: 'Match scorecard with skills matrix',
    icon: 'UserCheck',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    id: 'strategy',
    name: 'Executive Strategy Drafter',
    shortName: 'Strategy',
    description: 'Drafts executive-level strategic plans and business analysis from documents',
    systemPrompt: `You are an Executive Strategy Drafter agent specialized in producing C-suite-ready strategic documents. Synthesize the provided documents into:
- Market positioning and competitive landscape
- SWOT analysis with evidence-backed points
- Strategic priorities with OKR frameworks
- Financial projections and resource requirements
- Risk mitigation and contingency planning

Structure your response with:
1. **Executive Summary** — one-page synopsis
2. **Situational Analysis** — market + internal assessment
3. **Strategic Pillars** — 3-5 key initiatives
4. **Implementation Roadmap** — quarterly milestones
5. **KPIs & Success Metrics** — measurable outcomes
6. **Risk Register** — top risks with mitigation`,
    outputFormat: 'Executive strategy document',
    icon: 'Briefcase',
    accent: 'from-violet-500 to-purple-500',
  },
];
