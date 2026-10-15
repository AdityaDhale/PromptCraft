/**
 * Fast Longest Common Subsequence (LCS) based word/token diff engine.
 * Computes additions, deletions, and common words between two text outputs.
 */

// Tokenizes text while preserving words, whitespaces, and punctuation
export function tokenize(text) {
  if (!text) return [];
  // Match words, whitespace sequences, and punctuation individually
  const tokens = text.match(/\S+|\s+/g) || [];
  return tokens;
}

export function computeWordDiff(textA = '', textB = '') {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  const m = tokensA.length;
  const n = tokensB.length;

  // Optimize for identical strings
  if (textA === textB) {
    return {
      diff: tokensA.map(t => ({ type: 'common', value: t })),
      stats: { added: 0, removed: 0, common: tokensA.length, similarity: 100 }
    };
  }

  // Handle empty cases
  if (m === 0) {
    return {
      diff: tokensB.map(t => ({ type: 'added', value: t })),
      stats: { added: tokensB.length, removed: 0, common: 0, similarity: 0 }
    };
  }
  if (n === 0) {
    return {
      diff: tokensA.map(t => ({ type: 'removed', value: t })),
      stats: { added: 0, removed: tokensA.length, common: 0, similarity: 0 }
    };
  }

  // LCS Matrix
  // Using 1D arrays or standard matrix for moderate size texts (< 1000 tokens)
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (tokensA[i] === tokensB[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to build the diff
  let i = m;
  let j = n;
  const rawDiff = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
      rawDiff.push({ type: 'common', value: tokensA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({ type: 'added', value: tokensB[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.push({ type: 'removed', value: tokensA[i - 1] });
      i--;
    }
  }

  rawDiff.reverse();

  // Consolidate adjacent tokens of the same type for cleaner rendering
  const consolidated = [];
  let addedCount = 0;
  let removedCount = 0;
  let commonCount = 0;

  for (const item of rawDiff) {
    const isWhitespace = /^\s+$/.test(item.value);
    if (!isWhitespace) {
      if (item.type === 'added') addedCount++;
      else if (item.type === 'removed') removedCount++;
      else commonCount++;
    }

    const last = consolidated[consolidated.length - 1];
    if (last && last.type === item.type) {
      last.value += item.value;
    } else {
      consolidated.push({ ...item });
    }
  }

  const total = addedCount + removedCount + (commonCount * 2);
  const similarity = total > 0 ? Math.round(((commonCount * 2) / total) * 100) : 0;

  return {
    diff: consolidated,
    stats: {
      added: addedCount,
      removed: removedCount,
      common: commonCount,
      similarity
    }
  };
}
