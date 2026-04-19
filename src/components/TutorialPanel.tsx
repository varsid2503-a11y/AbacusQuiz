import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { LevelTutorial, TutorialStep } from '../lib/tutorials';

interface TutorialPanelProps {
  tutorial: LevelTutorial | undefined;
  stepIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  onExit: () => void;
}

export function TutorialPanel({ tutorial, stepIndex, onPrev, onNext, onFinish, onExit }: TutorialPanelProps) {
  const step: TutorialStep | undefined = tutorial?.steps[stepIndex];
  return (
    <div className="w-full max-w-2xl bg-cyber-surface border border-white/10 p-10 rounded-[40px] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-teal to-cyber-purple" />
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[10px] font-mono text-cyber-teal uppercase tracking-widest mb-1">Knowledge Retrieval</p>
          <h2 className="text-2xl font-black uppercase tracking-tight">{tutorial?.name || 'Tutorial'}</h2>
        </div>
        <button
          onClick={onExit}
          className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
          aria-label="Exit tutorial"
        >
          <ChevronLeft className="w-5 h-5 opacity-60" />
        </button>
      </div>

      <div className="min-h-[300px]">
        <div className="space-y-4">
          <div className="text-[10px] font-mono text-cyber-purple uppercase tracking-[0.35em] mb-4">
            Step {stepIndex + 1} of {tutorial?.steps.length}
          </div>
          <h3 className="text-xl font-bold text-white">{step?.title}</h3>
          <p className="text-sm leading-relaxed text-text-dim">{step?.content}</p>
          {step?.example && (
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
              <p className="text-[10px] uppercase font-mono tracking-widest opacity-40 mb-2">Technical Example</p>
              <p className="text-sm italic text-cyber-teal">{step.example}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-12 pt-8 border-t border-white/5">
        <button
          disabled={stepIndex === 0}
          onClick={onPrev}
          className="flex-1 py-4 glass rounded-2xl font-bold opacity-40 hover:opacity-100 disabled:opacity-20 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> PREV
        </button>
        {stepIndex < (tutorial?.steps.length || 0) - 1 ? (
          <button
            onClick={onNext}
            className="flex-[2] py-4 bg-cyber-teal text-cyber-bg rounded-2xl font-black uppercase tracking-tight hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            NEXT STEP <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onFinish}
            className="flex-[2] py-4 bg-cyber-purple text-white rounded-2xl font-black uppercase tracking-tight hover:bg-cyber-purple/90 transition-all flex items-center justify-center gap-2"
          >
            GO TO PRACTICE <Play className="w-4 h-4 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}
