import React, { useState } from 'react';
import { Target, Trophy, Edit2, Check, Flame, BookCheck, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const ReadingGoalsWidget: React.FC = () => {
  const { books, goal, updateGoalTarget } = useData();
  const { isAdmin } = useAuth();
  const { accentClass } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [targetInput, setTargetInput] = useState(goal.target_books.toString());

  const readBooks = books.filter((b) => b.status === 'Read');
  const totalBooksCompleted = readBooks.length;
  const totalPagesRead = books.reduce((acc, b) => acc + (b.pages_read || (b.status === 'Read' ? b.total_pages : 0)), 0);

  const target = goal.target_books || 30;
  const percentage = Math.min(100, Math.round((totalBooksCompleted / target) * 100));
  const remaining = Math.max(0, target - totalBooksCompleted);

  const handleSaveGoal = async () => {
    const num = parseInt(targetInput, 10);
    if (!isNaN(num) && num > 0) {
      await updateGoalTarget(num);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                2025 Reading Goal
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Yearly target & progress</p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Edit Yearly Target"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Goal Edit Form (Admin) */}
        {isAdmin && isEditing && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center space-x-2">
            <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">Target books:</span>
            <input
              type="number"
              min="1"
              max="300"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-20 px-2 py-1 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 text-xs font-mono text-center font-bold"
            />
            <button
              onClick={handleSaveGoal}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              Save
            </button>
          </div>
        )}

        {/* Main Progress Ring / Hero Bar */}
        <div className="my-3">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
                {totalBooksCompleted}
              </span>
              <span className="text-sm text-stone-400 dark:text-stone-500 font-serif ml-1.5">
                of {target} books
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Large Progress Bar */}
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-stone-200/60 dark:border-stone-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Sub-Metrics Cards */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                {totalPagesRead.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Pages Read</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                {remaining} more
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">To Hit Goal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
