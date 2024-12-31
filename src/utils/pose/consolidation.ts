import type { ModelResult, Analysis } from '../../types';

function weightedAverage(values: number[], weights: number[]): number {
  const sum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
  const weightSum = weights.reduce((acc, val) => acc + val, 0);
  return sum / weightSum;
}

export function consolidateResults(results: ModelResult[]): Analysis['consolidated'] {
  const confidences = results.map(r => r.confidence);
  const weights = confidences.map(c => c / 100);

  // Get the most confident detection
  const bestResult = results.reduce((prev, current) => 
    current.confidence > prev.confidence ? current : prev
  );

  return {
    detectedMotion: bestResult.detectedMotion,
    confidence: Math.max(...confidences),
    score: Math.round(weightedAverage(
      results.map(r => r.score),
      weights
    )),
    recommendations: Array.from(new Set(
      results.flatMap(r => r.recommendations)
    )),
    improvements: Array.from(new Set(
      results.flatMap(r => r.improvements)
    ))
  };
}