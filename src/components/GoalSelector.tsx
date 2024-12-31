import React from 'react';
import { Target, Dumbbell, Heart, Move } from 'lucide-react';
import type { TrainingGoal } from '../types';

interface Props {
  selectedGoal: TrainingGoal;
  onSelectGoal: (goal: TrainingGoal) => void;
}

const goals = [
  {
    id: 'technique' as TrainingGoal,
    name: 'Technique',
    description: 'Perfect your form and movement patterns',
    icon: Target,
  },
  {
    id: 'strength' as TrainingGoal,
    name: 'Strength',
    description: 'Build muscle and increase power',
    icon: Dumbbell,
  },
  {
    id: 'endurance' as TrainingGoal,
    name: 'Endurance',
    description: 'Improve stamina and cardiovascular fitness',
    icon: Heart,
  },
  {
    id: 'flexibility' as TrainingGoal,
    name: 'Flexibility',
    description: 'Enhance range of motion and mobility',
    icon: Move,
  },
];

export function GoalSelector({ selectedGoal, onSelectGoal }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {goals.map((goal) => {
        const Icon = goal.icon;
        return (
          <button
            key={goal.id}
            onClick={() => onSelectGoal(goal.id)}
            className={`rounded-lg p-6 text-left transition-all ${
              selectedGoal === goal.id
                ? 'bg-blue-100 ring-2 ring-blue-500'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <Icon className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {goal.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{goal.description}</p>
          </button>
        );
      })}
    </div>
  );
}