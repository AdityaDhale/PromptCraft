/**
 * Benchmark Runner Service.
 * Supports zero-cost instant offline simulation and live Google Gemini API execution.
 */

// Realistic simulation fixtures for presets to guarantee deterministic, high-quality demo output
const SIMULATED_RESPONSES = {
  // Support - Billing
  'support-billing-a': `Hello,

Thank you for reaching out to us. We are very sorry to hear that you were charged twice for your Pro annual renewal. We understand this can be very frustrating. 

Please send us your account email address and transaction IDs so that we can look into this matter with our billing team. Once we verify the duplicate charge, we will be able to issue a refund back to your payment card. We apologize for the inconvenience and appreciate your patience while we work on this.

Best regards,
Customer Support Team`,

  'support-billing-b': `Hi there,

I completely understand your frustration—unexpected double charges are alarming, and I am stepping in to ensure this is fixed immediately.

Here is the exact action plan:
1. **Instant Verification**: I have pulled up your billing ledger. Our system triggered a gateway retry during your renewal, resulting in duplicate invoice #CS-89211.
2. **Refund Authorization**: I have initiated an immediate refund of **$120.00** back to your card ending in **4129**.

**Our SLA Guarantee**: You will receive an official merchant confirmation email within **2 hours**, and funds typically reflect in your account within 3–5 business days depending on your bank. 

If there is anything else you need, I am personally monitoring this ticket until resolved.`,

  // Support - Data Scare
  'support-data-scare-a': `Dear user,

Sorry for the issue with the desktop client. Sometimes after an update the files don't show up right away. Please don't worry, your files are probably still on our server. 

Have you tried restarting your computer or logging out of the app and logging back in? Let us know if that works or if the folder is still empty. We are sorry for this problem and hope your files come back soon.`,

  'support-data-scare-b': `Hello,

I hear how urgent this is with client deadlines tomorrow—please rest assured that your files are safe in CloudSync vault storage. 

Follow these two quick recovery steps:
1. **Check Local Archive**: Open File Explorer / Finder and navigate to \`~/.cloudsync/cache/backup-pre-update\`. Your local files are safeguarded there.
2. **Trigger Force Re-Index**: In the CloudSync menubar app, click **Settings > Advanced > Re-Index Local Root**.

**SLA Commitment**: If your files do not repopulate your active folder within **45 minutes**, reply directly to this notice and our on-call storage engineering team will restore a server-side snapshot.`,

  // Support - Missing Settings
  'support-missing-settings-a': `Hello,

Thanks for your question about webhooks. If you can't find the webhook settings under Settings > API, you might not have the right permissions on your account. Are you an admin? Try checking with the owner of the organization. Let us know if you need any other help with settings.`,

  'support-missing-settings-b': `Hi there,

I can quickly clarify why you're not seeing the API tab!

Here are the two steps to access your Webhook configuration:
1. **Verify Role Permissions**: Webhooks require Organization Owner or Developer role permissions; standard Team Member roles only display Billing and Team Profile.
2. **Direct Navigation**: If you hold admin privileges, navigate directly to \`https://app.cloudsync.com/admin/integrations/webhooks\`.

**SLA Guarantee**: If your organization owner updated your role within the last hour, our permission sync takes up to **15 minutes** to propagate. Let us know if you still don't see it!`,

  // Code Review - SQL Injection
  'code-review-sql-injection-a': `This code has a security issue. You are doing string concatenation inside the query string which is vulnerable to SQL injection attacks. An attacker could pass a malicious ID like \`1' OR '1'='1\` and get access to all users in the database. 

You should use parameterized queries or prepared statements instead of template literals. Also there is no error handling if the database query fails. You should wrap it in a try/catch block.`,

  'code-review-sql-injection-b': `### 1. Critical Vulnerabilities & Safety
- **High Severity (CVSS 9.8 - CWE-89)**: Direct string interpolation of untrusted user input (\`req.query.id\`) directly into an unescaped SQL statement allows trivial SQL Injection and unauthorized database dumping.
- **Unvalidated Input**: Missing UUID/integer type-check on \`req.query.id\`.

### 2. Performance & Big-O Impact
- Query planner misses prepared-statement caching, leading to \(O(N)\) full table scans if \`id\` is unindexed.
- Execution memory: Minimal, but unparameterized queries cause database connection pool exhaustion under injection fuzzing.

### 3. Concrete Recommended Patch
\`\`\`javascript
async function getUser(db, req) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    throw new ValidationError('Valid user ID parameter is required');
  }
  
  // Use parameterized query to eliminate SQL injection vectors
  const query = 'SELECT id, email, created_at FROM users WHERE id = $1 LIMIT 1';
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
}
\`\`\``,

  // Code Review - Memory Leak
  'code-review-memory-leak-a': `There is an issue here where you are appending everything into \`globalThis.history\`. Because \`globalThis\` never gets garbage collected, this array will keep growing and growing forever and eventually cause the application to run out of memory. 

Also, \`orders[i].total * 1.1\` might produce floating point precision issues. You should fix the memory leak and clean up the loop.`,

  'code-review-memory-leak-b': `### 1. Critical Vulnerabilities & Safety
- **Unbounded Memory Leak**: Writing every incoming order to \`globalThis.history\` persists state across all requests in the Node process lifetime. This guarantees eventual \`OutOfMemoryError\` (OOM crash) in production.
- **Floating-point rounding**: \`total * 1.1\` causes IEEE 754 precision errors on financial amounts.

### 2. Performance & Big-O Impact
- **Time Complexity**: \(O(N)\) linear iteration over orders.
- **Memory Complexity**: \(O(N)\) per batch, but permanent process heap retention due to the global reference leak.

### 3. Concrete Recommended Patch
\`\`\`javascript
function processOrders(orders) {
  if (!Array.isArray(orders)) return [];

  // Isolate calculations in local scope; avoid mutating global objects
  return orders.map(order => {
    // Round to 2 decimal places to prevent currency float artifacts
    const adjustedTotal = Math.round((order.total || 0) * 110) / 100;
    return adjustedTotal;
  });
}
\`\`\``,

  // Executive - Q3 Launch
  'executive-briefing-q3-launch-a': `This memo is an update on the v2 analytics pipeline launched yesterday. The pipeline had good results with throughput doubling to 4.2 million events per second and latency dropping to 85 milliseconds. 

However, CloudWatch costs increased by 28% because of DynamoDB read units, and the mobile SDK 3.1 is crashing on iOS 16.2 devices. Sarah's team is requesting VP approval to roll back the mobile version while keeping the backend active.`,

  'executive-briefing-q3-launch-b': `### TL;DR
Analytics v2 doubled throughput to 4.2M events/sec and cut latency to 85ms, but iOS crashes and a 28% DynamoDB cost spike require urgent action.

### Key Metrics & Wins
- **Throughput**: 4.2M events/sec (+100% capacity).
- **p99 Latency**: Down from 420ms to 85ms (-80% reduction).

### Urgent Blockers & Required Decisions
- **VP Eng Decision**: Approve immediate rollback of Mobile SDK v3.1 to mitigate iOS 16.2 client crashes while keeping backend pipeline live.
- **Infrastructure Audit**: Investigate 28% DynamoDB read capacity unit surge.

### 48-Hour Next Steps
- **Sarah (Mobile Lead)**: Execute iOS SDK 3.1 rollback and deploy hotfix v3.1.1 within 24 hours.
- **Alex (DevOps)**: Implement DynamoDB caching layer to reverse 28% CloudWatch cost surge.`
};

export function interpolatePrompt(template = '', scenarioInput = '') {
  if (!template) return '';
  if (template.includes('{{input}}')) {
    return template.replaceAll('{{input}}', scenarioInput);
  }
  return `${template}\n\n[Scenario Input]:\n${scenarioInput}`;
}

export async function runPrompt({
  prompt,
  scenarioInput,
  presetId,
  scenarioId,
  variantType, // 'a' or 'b'
  mode = 'simulated',
  apiKey = ''
}) {
  const startTime = performance.now();
  const finalPrompt = interpolatePrompt(prompt, scenarioInput);

  // If live mode with valid API key
  if (mode === 'live' && apiKey.trim().length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: finalPrompt }] }],
            generationConfig: {
              temperature: variantType === 'b' ? 0.2 : 0.7,
              maxOutputTokens: 800
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from model.';
      const elapsedMs = Math.round(performance.now() - startTime);

      return {
        output: outputText,
        latencyMs: elapsedMs,
        isLive: true
      };
    } catch (err) {
      console.warn('Live API request failed, falling back to simulation engine:', err);
      // Fallback seamlessly to simulation below
    }
  }

  // Fast High-Fidelity Simulation Mode
  const simulatedDelay = 450 + Math.floor(Math.random() * 350);
  await new Promise(resolve => setTimeout(resolve, simulatedDelay));

  const fixtureKey = `${presetId}-${scenarioId}-${variantType}`;
  let outputText = SIMULATED_RESPONSES[fixtureKey];

  if (!outputText) {
    // Dynamic fallback for custom inputs
    if (variantType === 'b') {
      outputText = `### Benchmark Analysis & Response
Based on the provided input, here is the structured resolution:

- **Key Observation**: Processing requested query with high specificity.
- **Recommended Action**: Implement validated procedure with 2-step verification.
- **SLA & Assurance**: Verified within standard operational limits (under 2 hours).

\`\`\`markdown
Status: Verified
Input Processed: "${scenarioInput.slice(0, 80)}..."
\`\`\``;
    } else {
      outputText = `Thank you for your message regarding: "${scenarioInput.slice(0, 80)}...". 

We have received your input and will look into it as soon as possible. Please let us know if you have any questions or need further clarification in the meantime. We appreciate your patience.`;
    }
  }

  const elapsedMs = Math.round(performance.now() - startTime);
  return {
    output: outputText,
    latencyMs: elapsedMs,
    isLive: false
  };
}
