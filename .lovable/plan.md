

# SchoolGrowth AI — Implementation Plan

## Overview
A modern SaaS dashboard that serves as an AI-powered marketing consultant for schools. It features 8 analysis tools powered by AI, a central dashboard with marketing scores and insights, and exportable reports.

## Design & Theme
- Clean, professional SaaS dashboard with a sidebar navigation
- Color scheme: Deep blue primary with green accents (trust & growth)
- Cards, charts (recharts), progress bars, and clean form layouts
- Responsive design for desktop and tablet use

## Pages & Navigation

### 1. Sidebar Layout
- Logo + app name "SchoolGrowth AI"
- Navigation links to: Dashboard, and all 8 tools
- Collapsible on mobile

### 2. Dashboard (Home)
- Marketing Score display (circular progress/gauge) — populated after completing the audit
- Key Insights cards summarizing latest analyses
- Quick-access grid to all 8 tools with icons and descriptions
- Recent reports list

### 3. Marketing Audit
- Multi-step form with 6 sections (10 questions each, 60 total)
- Stepper/progress indicator showing current section
- 1–5 rating scale per question with labeled options
- On submit: calculates scores per aspect + total, determines performance level
- Sends data to AI for detailed report (strengths, weaknesses, opportunities, recommendations)
- Results displayed with score charts and AI narrative

### 4. Market Research
- Form: school name, city, education level (TK/SD/SMP/SMA), student count, target parents, tuition range, unique programs
- AI generates: market opportunity, parent demand insights, education trends, growth potential

### 5. School Positioning Finder
- Uses school profile data (form or reuse from Market Research)
- AI generates: USP, brand positioning statement, differentiation, parent-facing brand message

### 6. Competitor Analysis
- Form for school context and known competitors
- AI generates: competitor strengths/weaknesses, positioning opportunities, strategic recommendations

### 7. Growth Strategy Generator
- Input: school profile + current enrollment data
- AI generates: promotional strategies, community engagement ideas, events, partnerships, referral strategies

### 8. Social Media Content Planner
- Input: school type, target audience, key themes
- AI generates: 30-day content calendar with post ideas, captions, video ideas, educational content

### 9. Parent Persona Generator
- Input: school profile and target market
- AI generates: detailed personas with demographics, profession, priorities, concerns, preferred channels

### 10. SWOT Analysis
- Input: school profile data
- AI generates: structured Strengths, Weaknesses, Opportunities, Threats analysis

## Report System
- Every AI analysis produces a structured report: Summary → Key Insights → Detailed Analysis → Recommendations
- Copy to clipboard button
- Download as text/markdown
- Reports stored in local state for dashboard display

## AI Integration
- Lovable AI Gateway (Google Gemini) via edge function
- Separate edge function with different system prompts per analysis type
- Streaming responses for better UX
- Indonesian education market context baked into prompts

## Backend (Lovable Cloud)
- Edge function for AI calls
- No database needed initially — all data in-browser session
- Can be extended later with auth + saved reports

## Implementation Order
1. App shell: sidebar layout, routing, dashboard page
2. Marketing Audit (most complex feature — multi-step form + scoring + AI)
3. Shared report component (copy/download)
4. Market Research + Positioning Finder
5. Competitor Analysis + Growth Strategy
6. Social Media Planner + Parent Persona + SWOT
7. Dashboard integration (scores, insights, quick access)
8. AI edge function with streaming

