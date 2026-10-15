export const PRESETS = [
  {
    id: 'support',
    name: 'Customer Support Escalation',
    category: 'Customer Experience',
    description: 'Compare generic polite assistance vs. structured empathetic resolution with SLAs.',
    variantA: {
      name: 'Zero-Shot Polite',
      model: 'Simulated LLM (Standard)',
      prompt: `You are customer service. Reply to this customer complaint and be polite.

Customer Message:
{{input}}`
    },
    variantB: {
      name: 'Structured SLA Specialist',
      model: 'Simulated LLM (Enhanced)',
      prompt: `You are an empathetic Tier-2 Support Specialist at CloudSync. Follow these strict rules:
1. Acknowledge the user's emotion immediately with high empathy.
2. Provide a clear 2-step troubleshooting or verification action.
3. State our exact resolution SLA (investigated within 2 hours).
4. Do NOT apologize more than once; keep tone calm, professional, and action-oriented.
5. Format with concise markdown bullet points.

Customer Message:
{{input}}`
    },
    scenarios: [
      {
        id: 'billing',
        title: 'Double Billing Error',
        input: `I was double billed for my Pro annual renewal and my card was charged $120 twice! This is outrageous, fix it now or I'm doing a chargeback.`
      },
      {
        id: 'data-scare',
        title: 'Local Sync Scare',
        input: `I updated the desktop client and now my local sync folder is completely empty! Are my files deleted forever? I have client deliverables due tomorrow.`
      },
      {
        id: 'missing-settings',
        title: 'Missing Webhook Settings',
        input: `Where do I find the webhook settings? The docs say Settings > API, but on my admin panel I only see Billing and Team Profile.`
      }
    ]
  },
  {
    id: 'code-review',
    name: 'Code Review & Security Audit',
    category: 'Engineering',
    description: 'Compare high-level feedback vs. structured vulnerability, performance, and patch analysis.',
    variantA: {
      name: 'General Reviewer',
      model: 'Simulated LLM (Standard)',
      prompt: `Review this pull request code and tell me what is wrong with it:

Code:
\`\`\`javascript
{{input}}
\`\`\``
    },
    variantB: {
      name: 'Security & Perf Architect',
      model: 'Simulated LLM (Enhanced)',
      prompt: `You are a Principal Security & Performance Engineer. Review the code snippet below and output strictly in this structure:
### 1. Critical Vulnerabilities & Safety
(List any injection, leak, or validation flaws with CVSS risk level)
### 2. Performance & Big-O Impact
(Time/Space complexity and memory footprint notes)
### 3. Concrete Recommended Patch
(Provide a drop-in safe replacement code block)

Code:
\`\`\`javascript
{{input}}
\`\`\``
    },
    scenarios: [
      {
        id: 'sql-injection',
        title: 'SQL Injection Vulnerability',
        input: `function getUser(db, req) {
  const id = req.query.id;
  return db.query(\`SELECT * FROM users WHERE id = '\${id}'\`);
}`
      },
      {
        id: 'memory-leak',
        title: 'Global Array Memory Leak',
        input: `function processOrders(orders) {
  const cache = [];
  for (let i = 0; i < orders.length; i++) {
    globalThis.history = globalThis.history || [];
    globalThis.history.push(orders[i]);
    cache.push(orders[i].total * 1.1);
  }
  return cache;
}`
      },
      {
        id: 'clean-helper',
        title: 'Pure Utility Function',
        input: `function formatCurrency(cents) {
  if (typeof cents !== 'number' || isNaN(cents)) return '$0.00';
  return '$' + (cents / 100).toFixed(2);
}`
      }
    ]
  },
  {
    id: 'executive-briefing',
    name: 'Executive TL;DR & Action Items',
    category: 'Leadership & Ops',
    description: 'Compare conversational summary vs. high-density executive briefing with owners and blockers.',
    variantA: {
      name: 'Casual Summary',
      model: 'Simulated LLM (Standard)',
      prompt: `Summarize this business memo:

{{input}}`
    },
    variantB: {
      name: 'Chief of Staff Briefing',
      model: 'Simulated LLM (Enhanced)',
      prompt: `You are an Executive Chief of Staff. Distill the following operational update into a high-density Executive Briefing with zero corporate fluff:
- **TL;DR**: Exactly 1 sentence (under 25 words).
- **Key Metrics & Wins**: Top 2 quantitative milestones.
- **Urgent Blockers & Required Decisions**: Explicit decisions needed from VP leadership today.
- **48-Hour Next Steps**: Bulleted action items with assigned owners.

Update:
{{input}}`
    },
    scenarios: [
      {
        id: 'q3-launch',
        title: 'Product Pipeline Launch Update',
        input: `Team, we launched the v2 analytics pipeline yesterday. In the first 12 hours, event throughput doubled to 4.2M events/sec with p99 latency dropping from 420ms to 85ms. However, CloudWatch costs spiked by 28% due to excessive DynamoDB read units, and mobile SDK 3.1 is crashing on iOS 16.2 devices. Sarah's team needs an approval from VP Eng to roll back mobile while keeping the backend pipeline active.`
      },
      {
        id: 'fundraising',
        title: 'Bridge Financing Round Close',
        input: `Hey team and advisory board, we closed the bridge round at $1.5M with 80% wire completion. Monthly Burn is steady at $45k with 14 months runway. We hired two ex-Stripe infra leads starting next Monday. Main bottleneck right now is SOC2 Type II audit vendor selection—we have proposals from Vanta and Secureframe and need legal sign-off by Friday.`
      }
    ]
  }
];
