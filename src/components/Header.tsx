import { Music, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  currentLabel: string;
  timer: string;
  isMuted: boolean;
  isPlayingBgm: boolean;
  isGeneratingBgm: boolean;
  onToggleMute: () => void;
  onToggleBgm: () => void;
}

export function Header({ currentLabel, timer, isMuted, isPlayingBgm, isGeneratingBgm, onToggleMute, onToggleBgm }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-4">
      <div className="space-y-3">
        <div className="text-2xl font-extrabold tracking-[-0.5px] flex items-center gap-2">
          <span className="uppercase text-cyber-teal drop-shadow-[0_0_12px_rgba(100,210,255,0.4)]">Abacus</span>
          <span className="uppercase opacity-80">Quest</span>
        </div>
        <p className="text-sm text-text-dim uppercase tracking-[0.32em]">{currentLabel}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-cyber-surface/80 border border-white/10 rounded-2xl px-4 py-3 text-sm font-semibold text-cyber-teal tracking-[0.12em] uppercase shadow-inner">
          {timer}
        </div>
        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] hover:bg-white/10 transition"
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isMuted ? 'Silent' : 'Sound'}
        </button>
        <button
          onClick={onToggleBgm}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] hover:bg-white/10 transition disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isPlayingBgm ? 'Pause background music' : 'Play background music'}
          disabled={isGeneratingBgm}
        >
          <Music className="w-4 h-4" />
          {isGeneratingBgm ? 'Loading...' : isPlayingBgm ? 'Atmosphere' : 'BGM'}
        </button>
      </div>
    </header>
  );
}
