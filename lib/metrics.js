// Metrics and helpers shared across app and API

export const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'it', 'to', 'and', 'or', 'of', 'in', 'on', 'at', 'with', 'for', 'but', 'by', 'as', 'that', 'this', 'we', 'i', 'you', 'he', 'she', 'they']);

export const sanitizeText = (text) => (text || '')
  .toLowerCase()
  .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
  .replace(/\s{2,}/g, " ");

export const calculateTTR = (text) => {
  const sanitized = sanitizeText(text);
  const words = sanitized.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 0;
  const uniqueWords = new Set(words);
  return parseFloat(((uniqueWords.size / words.length) * 100).toFixed(1));
};

export const calculateQueryCoverage = (prompt, response) => {
  const sanitizedPrompt = sanitizeText(prompt);
  const promptWords = sanitizedPrompt.split(/\s+/).filter(w => w.length > 0 && !STOP_WORDS.has(w));
  if (promptWords.length === 0) return 100;

  const responseText = sanitizeText(response);
  let coveredCount = 0;
  const uniquePromptWords = new Set(promptWords);

  uniquePromptWords.forEach(keyword => {
    if (responseText.includes(keyword)) coveredCount++;
  });

  return parseFloat(((coveredCount / uniquePromptWords.size) * 100).toFixed(1));
};

export const calculateSentenceCount = (text) => {
  const sentences = (text || '').match(/[^\.!\?]+[\.!\?]+/g);
  return sentences ? sentences.length : 0;
};

export const calculateAvgWordLength = (text) => {
  const sanitized = sanitizeText(text);
  const words = sanitized.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 0;
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  return parseFloat((totalChars / words.length).toFixed(2));
};

export const calculateAllMetrics = (prompt, response) => {
  if (!response || response.startsWith('API Error') || response.startsWith('Generation failed')) {
    return { ttr: 0, coverage: 0, sentenceCount: 0, avgWordLength: 0, wordCount: 0 };
  }
  const wordCount = (response || '').split(/\s+/).filter(w => w.length > 0).length;
  return {
    ttr: calculateTTR(response),
    coverage: calculateQueryCoverage(prompt, response),
    sentenceCount: calculateSentenceCount(response),
    avgWordLength: calculateAvgWordLength(response),
    wordCount,
  };
};
