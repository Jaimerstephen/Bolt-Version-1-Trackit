import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import type { Analysis } from '../../types';

interface Props {
  analysis: Analysis;
}

export function MotionAnalysis({ analysis }: Props) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Motion Analysis</h2>
        </div>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-gray-600">
            Confidence: {analysis.consolidated.confidence.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Detected Motion</h3>
          <p className="mt-1 text-xl font-semibold text-blue-600">
            {analysis.consolidated.detectedMotion}
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-green-50 p-4">
            <h4 className="font-medium text-green-800">Key Form Points</h4>
            <ul className="mt-2 space-y-2">
              {analysis.consolidated.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-green-600" />
                  <span className="text-green-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-amber-50 p-4">
            <h4 className="font-medium text-amber-800">Areas to Focus On</h4>
            <ul className="mt-2 space-y-2">
              {analysis.consolidated.improvements.map((imp, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-amber-600" />
                  <span className="text-amber-700">{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}