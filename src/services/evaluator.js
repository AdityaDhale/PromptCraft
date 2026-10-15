/**
 * Automated prompt quality & output benchmark evaluator.
 * Scores outputs on Clarity, Conciseness, Instruction Adherence, and Composite rating.
 */

const FILLER_PHRASES = [
  'as an ai language model',
  'i hope this email finds you well',
  'please feel free to reach out',
  'it is important to note that',
  'needless to say',
  'at the end of the day',
  'in order to',
  'with that being said',
  'as previously stated',
  'for all intents and purposes'
];

export function estimateTokens(text = '') {
  if (!text) return 0;
  // Standard heuristic: ~4 characters per token for English text
  return Math.max(1, Math.ceil(text.trim().length / 4));
}

export function evaluateOutput(prompt = '', output = '', scenarioInput = '') {
  const cleanOutput = output.trim();
  const cleanPrompt = prompt.toLowerCase();
  
  if (!cleanOutput) {
    return {
      clarity: 0,
      conciseness: 0,
      adherence: 0,
      composite: 0,
      tokenCount: 0,
      wordCount: 0,
      insights: ['No output generated to evaluate.']
    };
  }

  const words = cleanOutput.match(/\b[a-zA-Z0-9_\-'`]+\b/g) || [];
  const wordCount = words.length;
  const tokenCount = estimateTokens(cleanOutput);
  const sentences = cleanOutput.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = wordCount / sentenceCount;

  // 1. CLARITY SCORING (0 - 100)
  let clarity = 50; // baseline
  
  // Bonus for markdown structure (headings, bullets, numbered lists, bolding)
  const hasHeadings = /^#{1,4}\s/m.test(cleanOutput);
  const hasBullets = /^[-*•]\s/m.test(cleanOutput) || /^\d+\.\s/m.test(cleanOutput);
  const hasBolding = /\*\*[^*]+\*\*/.test(cleanOutput);
  const hasCodeBlock = /```[\s\S]*?```/.test(cleanOutput);

  if (hasHeadings) clarity += 15;
  if (hasBullets) clarity += 15;
  if (hasBolding) clarity += 10;
  if (hasCodeBlock) clarity += 10;

  // Penalty for runaway sentence length or monolithic block
  if (avgWordsPerSentence > 28) clarity -= 15;
  else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 22) clarity += 10;

  // Paragraph spacing check
  const paragraphs = cleanOutput.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length >= 2) clarity += 10;

  clarity = Math.max(10, Math.min(98, clarity));

  // 2. CONCISENESS SCORING (0 - 100)
  let conciseness = 70; // baseline

  // Filler phrase penalty
  const lowerOutput = cleanOutput.toLowerCase();
  let fillerCount = 0;
  for (const phrase of FILLER_PHRASES) {
    if (lowerOutput.includes(phrase)) {
      fillerCount++;
    }
  }
  conciseness -= fillerCount * 12;

  // Target word count sweet spot (typically 40 to 250 words for structured prompt benchmarks)
  if (wordCount < 15) {
    conciseness -= 20; // Too terse/empty
  } else if (wordCount > 350) {
    conciseness -= Math.min(35, Math.floor((wordCount - 350) / 10)); // Overly verbose
  } else if (wordCount >= 40 && wordCount <= 180) {
    conciseness += 15; // Crisp density
  }

  conciseness = Math.max(15, Math.min(99, conciseness));

  // 3. INSTRUCTION ADHERENCE SCORING (0 - 100)
  let adherence = 60; // baseline
  const insights = [];

  // Directive checks based on keywords in prompt:
  // Check bullets requirement
  if (cleanPrompt.includes('bullet') || cleanPrompt.includes('list')) {
    if (hasBullets) {
      adherence += 15;
      insights.push('Strictly followed bullet list formatting directive.');
    } else {
      adherence -= 20;
      insights.push('Failed requested bullet formatting.');
    }
  }

  // Check SLA or timeline requirement
  if (cleanPrompt.includes('sla') || cleanPrompt.includes('hour') || cleanPrompt.includes('within')) {
    if (/\b\d+\s*(hours?|hrs?|mins?|days?)\b/i.test(cleanOutput) || /sla/i.test(cleanOutput)) {
      adherence += 15;
      insights.push('Included concrete SLA timeframe specification.');
    } else {
      adherence -= 15;
    }
  }

  // Check code/patch requirement
  if (cleanPrompt.includes('patch') || cleanPrompt.includes('code snippet') || cleanPrompt.includes('replacement')) {
    if (hasCodeBlock) {
      adherence += 20;
      insights.push('Provided concrete code replacement block.');
    } else {
      adherence -= 25;
      insights.push('Did not provide concrete code block as requested.');
    }
  }

  // Check executive/tldr requirement
  if (cleanPrompt.includes('tl;dr') || cleanPrompt.includes('tldr')) {
    if (/tl;?dr/i.test(cleanOutput)) {
      adherence += 15;
      insights.push('Synthesized TL;DR summary section explicitly.');
    } else {
      adherence -= 10;
    }
  }

  // Check empathy / acknowledgment
  if (cleanPrompt.includes('empath') || cleanPrompt.includes('acknowledge')) {
    if (/(understand|frustrat|apologiz|sorry|concern|help you resolve)/i.test(cleanOutput)) {
      adherence += 10;
      insights.push('Acknowledged user situation with appropriate tone.');
    }
  }

  adherence = Math.max(20, Math.min(99, adherence));

  // COMPOSITE SCORE (Weighted: 35% clarity, 30% conciseness, 35% adherence)
  const composite = Math.round((clarity * 0.35) + (conciseness * 0.30) + (adherence * 0.35));

  if (insights.length === 0) {
    if (composite > 80) insights.push('High precision response with strong readability.');
    else insights.push('Adequate response, but prompt instructions could be tightened.');
  }

  return {
    clarity,
    conciseness,
    adherence,
    composite,
    tokenCount,
    wordCount,
    insights
  };
}

export function compareVariants(resultA, resultB) {
  if (!resultA || !resultB) return null;

  const scoreA = resultA.scores.composite;
  const scoreB = resultB.scores.composite;

  let winner = 'tie';
  let diffScore = Math.abs(scoreA - scoreB);

  if (scoreA > scoreB + 2) {
    winner = 'variantA';
  } else if (scoreB > scoreA + 2) {
    winner = 'variantB';
  }

  return {
    winner,
    diffScore,
    summary: winner === 'tie' 
      ? 'Both prompt variants performed at parity across clarity and adherence.'
      : `${winner === 'variantA' ? 'Variant A' : 'Variant B'} outperformed by ${diffScore} points due to higher instruction adherence and structural clarity.`
  };
}
