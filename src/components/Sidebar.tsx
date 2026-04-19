import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { HighScore, DifficultyLevel } from '../lib/math';

interface SidebarProps {
  level: DifficultyLevel;
  highScores: HighScore[];
  recentAnswers: Array<{ question: string; answer: number; correct: boolean }>;
  combo: number;
}

const levelName = (level: DifficultyLevel) => level === 1 ? 'Apprentice' : level === 2 ? 'Adept' : 'Master';

export function Sidebar({ level, highScores, recentAnswers, combo }: SidebarProps) {
  const levelScores = highScores.filter((score) => score.level === level).slice(0, 5);
  return (
    <aside className="hidden lg:flex flex-col bg-cyber-surface rounded-2xl p-5 border border-white/5 gap-6">
      <div className="text-[11px] uppercase tracking-[1.5px] text-text-dim mb-4 flex justify-between">
        <span>{levelName(level)} Leaderboard</span>
        <span>PTS</span>
      </div>
      <div className="space-y-3">
        {levelScores.length > 0 ? levelScores.map((entry, index) => (
          <motion.div
            key={`${entry.name}-${entry.score}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-between items-center font-mono text-sm"
          >
            <span className="text-cyber-teal font-bold">{String(index + 1).padStart(2, '0')}</span>
            <span className="flex-1 ml-3 truncate opacity-80">{entry.name}</span>
            <span className="ml-2">{entry.score.toLocaleString()}</span>
          </motion.div>
        )) : (
          <p className="text-xs italic opacity-30 mt-2">No records for this level.</p>
        )}
      </div>
      <div className="bg-white/5 p-4 rounded-2xl text-center">
        <div className="text-[10px] font-mono text-cyber-teal uppercase tracking-widest mb-1">Session Combo</div>
        <div className="text-2xl font-black font-mono">x{combo.toFixed(1)}</div>
      </div>
      <div className="pt-5 border-t border-white/10 text-xs">
        <div className="flex justify-between mb-2">
          <span className="opacity-50">Goal</span>
          <span className="text-cyber-purple font-bold">80%</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-cyber-purple" />
        </div>
      </div>
    </aside>
  );
}
