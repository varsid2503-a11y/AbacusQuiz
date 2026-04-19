import { Trophy } from 'lucide-react';

interface GameOverPanelProps {
  score: number;
  accuracy: number;
  onRestart: () => void;
  onReturn: () => void;
}

export function GameOverPanel({ score, accuracy, onRestart, onReturn }: GameOverPanelProps) {
  return (
    <div className="w-full max-w-md bg-cyber-surface border border-white/10 p-12 rounded-[40px] text-center">
      <Trophy className="w-20 h-20 text-cyber-teal mx-auto mb-6" />
      <h2 className="text-4xl font-bold tracking-tight mb-2 uppercase">Trial Complete</h2>
      <div className="text-text-dim text-sm uppercase tracking-widest mb-10">Data Pipeline Closed</div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
          <p className="text-[10px] uppercase font-mono tracking-[2px] opacity-40 mb-1">Final Score</p>
          <p className="text-4xl font-black text-cyber-teal">{score}</p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
          <p className="text-[10px] uppercase font-mono tracking-[2px] opacity-40 mb-1">Accuracy</p>
          <p className="text-4xl font-black text-cyber-purple">{accuracy}%</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-5 bg-cyber-teal text-cyber-bg rounded-2xl font-black text-xl hover:opacity-90 transition-all mb-4"
      >
        REBOOT TRIAL
      </button>
      <button
        onClick={onReturn}
        className="w-full py-4 border border-white/10 rounded-2xl font-bold opacity-60 hover:opacity-100 transition-all"
      >
        RETURN TO BASE
      </button>
    </div>
  );
}
