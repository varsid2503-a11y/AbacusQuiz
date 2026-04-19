/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Settings, 
  RotateCcw, 
  Play, 
  History,
  Info,
  ChevronLeft,
  Volume2,
  VolumeX,
  Zap,
  Music,
  Loader2,
  Target,
  Flame
} from 'lucide-react';
import { DifficultyLevel, Problem, generateProblem } from './lib/math.ts';
import { playSound } from './lib/sounds.ts';
import { generateFavicon, generateBGM } from './lib/ai.ts';

// --- Types ---
interface HighScore {
  name: string;
  score: number;
  level: DifficultyLevel;
  date: string;
}

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'practice'>('start');
  const [level, setLevel] = useState<DifficultyLevel>(1);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmUrl, setBgmUrl] = useState<string | null>(null);
  const [isGeneratingBgm, setIsGeneratingBgm] = useState(false);
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'error'>('none');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [userName, setUserName] = useState('Zen Master');
  const [masterTimerDuration, setMasterTimerDuration] = useState(60);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const savedScores = localStorage.getItem('zen_abacus_scores');
    if (savedScores) setHighScores(JSON.parse(savedScores));
    
    const savedName = localStorage.getItem('zen_abacus_name');
    if (savedName) setUserName(savedName);

    // Initial AI Favicon generation
    generateFavicon().then(url => {
      if (url) {
        const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
        (link as HTMLLinkElement).rel = 'icon';
        (link as HTMLLinkElement).href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    });

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  const handleBgmToggle = async () => {
    if (bgmUrl) {
      if (isPlayingBgm) {
        bgmRef.current?.pause();
        setIsPlayingBgm(false);
      } else {
        bgmRef.current?.play();
        setIsPlayingBgm(true);
      }
      return;
    }

    setIsGeneratingBgm(true);
    const url = await generateBGM();
    setIsGeneratingBgm(false);

    if (url) {
      setBgmUrl(url);
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0.3;
      bgmRef.current = audio;
      audio.play();
      setIsPlayingBgm(true);
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  // --- Handlers ---
  const startGame = useCallback(() => {
    let initialTime = 60;
    if (level === 1) initialTime = 20;
    else if (level === 2) initialTime = 40;
    else if (level === 3) initialTime = masterTimerDuration;

    setScore(0);
    setTimeLeft(initialTime);
    setGameState('playing');
    setProblem(generateProblem(level));
    setUserInput('');
    if (!isMuted) playSound('click');
  }, [level, isMuted, masterTimerDuration]);

  const startPractice = useCallback(() => {
    setGameState('practice');
    setProblem(generateProblem(level));
    setUserInput('');
    if (!isMuted) playSound('click');
  }, [level, isMuted]);

  const endGame = useCallback(() => {
    setGameState('gameover');
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Save High Score
    const newScore: HighScore = {
      name: userName,
      score,
      level,
      date: new Date().toLocaleDateString()
    };
    
    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
      
    setHighScores(updatedScores);
    localStorage.setItem('zen_abacus_scores', JSON.stringify(updatedScores));
    
    if (score > 0 && !isMuted) playSound('triumph');
  }, [score, level, userName, highScores, isMuted]);

  const handleInput = (val: string) => {
    if (gameState !== 'playing' && gameState !== 'practice') return;
    
    // Validation: Only numeric and max 5 digits
    if (val !== 'BS' && val !== 'OK') {
      if (!/^\d$/.test(val)) return; // Ensure val is a single digit
      if (userInput.length >= 5) return;
    }

    if (!isMuted) playSound('click');
    
    if (val === 'BS') {
      setUserInput(prev => prev.slice(0, -1));
      return;
    }
    
    if (val === 'OK') {
      submitAnswer();
      return;
    }

    setUserInput(prev => prev + val);
  };

  const submitAnswer = useCallback(() => {
    if (!problem) return;
    
    const isCorrect = parseInt(userInput) === problem.answer;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + (level * 10));
      if (!isMuted) playSound('correct');
      
      setTimeout(() => {
        setFeedback('none');
        setProblem(generateProblem(level));
        setUserInput('');
      }, 400);
    } else {
      setFeedback('error');
      if (!isMuted) playSound('error');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      setTimeout(() => {
        setFeedback('none');
        setUserInput('');
      }, 600);
    }
  }, [problem, userInput, level, isMuted]);

  // Keyboard support
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' && gameState !== 'practice') return;
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      if (e.key === 'Backspace') handleInput('BS');
      if (e.key === 'Enter') handleInput('OK');
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [gameState, handleInput]);

  // --- Render Helpers ---
  const renderNumpad = () => (
    <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mt-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'BS', 0, 'OK'].map((val) => {
        if (val === 'OK') return (
          <button
            key={val}
            onClick={() => handleInput('OK')}
            className="col-span-3 h-14 bg-cyber-purple border border-cyber-purple text-white rounded-[40px] text-lg font-bold tracking-[2px] uppercase hover:bg-cyber-purple/80 transition-all active:scale-95 mt-2"
          >
            Submit Answer
          </button>
        );
        
        const isAccent = val === 'BS';
        return (
          <button
            key={val}
            onClick={() => handleInput(val.toString())}
            className={`w-20 h-20 flex items-center justify-center rounded-full text-2xl font-semibold transition-all
              ${isAccent ? 'border-cyber-teal border text-cyber-teal bg-cyber-surface/50 hover:bg-cyber-teal/10' : 
                'bg-cyber-surface text-white border border-white/10 hover:border-white/20 active:scale-95'}`}
          >
            {val === 'BS' ? '⌫' : val}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-cyber-bg text-white p-6 font-sans antialiased overflow-x-hidden relative flex flex-col">
      {/* HUD Background Decorations */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1024px] mx-auto flex flex-col flex-1">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-bottom border-white/20 pb-4 border-b">
          <div className="text-2xl font-extrabold flex items-center gap-2.5 tracking-[-0.5px]">
            <span className="text-cyber-teal drop-shadow-[0_0_10px_rgba(100,210,255,0.5)] uppercase">Abacus</span> 
            <span className="uppercase opacity-90">Quest</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex bg-cyber-purple/15 border border-cyber-purple px-3 py-1 rounded-full text-[12px] font-semibold text-cyber-purple uppercase tracking-wider">
              {level === 1 ? 'Apprentice' : level === 2 ? 'Adept' : 'Grandmaster'}
            </div>
            <div className="font-mono text-cyber-teal text-xl">
              {gameState === 'playing' ? `00:${timeLeft.toString().padStart(2, '0')}` : 
               gameState === 'practice' ? '∞ : ∞' : '--:--'}
            </div>
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="p-1 px-2.5 glass rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-white/20' : 'bg-cyber-teal shadow-[0_0_8px_rgba(100,210,255,0.8)]'}`} />
              <span className="opacity-60">{isMuted ? 'SILENT' : 'SOUND ON'}</span>
            </button>
            <button 
              onClick={handleBgmToggle}
              disabled={isGeneratingBgm}
              className={`p-1 px-2.5 glass rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-2 ${isGeneratingBgm ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isGeneratingBgm ? (
                <Loader2 className="w-3 h-3 animate-spin text-cyber-purple" />
              ) : (
                <Music className={`w-3 h-3 ${isPlayingBgm ? 'text-cyber-purple' : 'opacity-40'}`} />
              )}
              <span className="opacity-60 uppercase tracking-tighter">
                {isGeneratingBgm ? 'SYNCING...' : isPlayingBgm ? 'ATMOSPHERE ON' : 'ATMOSPHERE OFF'}
              </span>
            </button>
          </div>
        </header>

        <main className={`flex-1 min-h-0 ${gameState === 'playing' || gameState === 'practice' ? 'lg:grid lg:grid-cols-[240px_1fr_240px] gap-8' : 'flex items-center justify-center'}`}>
          {/* Left Sidebar (Only in playing/practice mode on large screens) */}
          {(gameState === 'playing' || gameState === 'practice') && (
            <aside className="hidden lg:flex flex-col bg-cyber-surface rounded-2xl p-5 border border-white/5">
              <div className="text-[11px] uppercase tracking-[1.5px] text-text-dim mb-4 flex justify-between border-b border-white/5 pb-2">
                <span>{level === 1 ? 'Apprentice' : level === 2 ? 'Adept' : 'Master'} Leaderboard</span>
                <span>PTS</span>
              </div>
              <div className="space-y-3 mt-4">
                {highScores
                  .filter(s => s.level === level)
                  .slice(0, 10)
                  .map((s, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={`${s.name}-${s.score}-${i}`} 
                    className="flex justify-between items-center font-mono text-sm"
                  >
                    <span className="text-cyber-teal font-bold">{String(i+1).padStart(2, '0')}</span>
                    <span className="flex-1 ml-3 truncate opacity-80">{s.name}</span>
                    <span className="ml-2">{s.score.toLocaleString()}</span>
                  </motion.div>
                ))}
                {highScores.filter(s => s.level === level).length === 0 && <p className="text-xs italic opacity-30 mt-4">No records for this level.</p>}
              </div>
              
              <div className="mt-auto pt-5 border-t border-white/10 text-xs">
                <div className="flex justify-between mb-2">
                  <span className="opacity-50">Daily Goal</span>
                  <span className="text-cyber-purple font-bold">80%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    className="h-full bg-cyber-purple" 
                  />
                </div>
              </div>
            </aside>
          )}

          <AnimatePresence mode="wait">
            {/* Start Screen */}
            {gameState === 'start' && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-cyber-surface/50 border border-white/10 p-10 rounded-[40px] text-center"
              >
                <h2 className="text-sm font-mono text-cyber-teal uppercase tracking-[0.3em] mb-8">System Calibration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
                  {[
                    { l: 1, name: 'Apprentice', desc: '1-Digit arithmetic. Pure focus on foundation.', icon: Zap },
                    { l: 2, name: 'Adept', desc: 'Partner rules training (Friends). Advanced shortcuts.', icon: Target },
                    { l: 3, name: 'Master', desc: 'Multiplication fury. High-speed mental throughput.', icon: Flame }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = level === item.l;
                    
                    return (
                      <button
                        key={item.l}
                        onClick={() => setLevel(item.l as DifficultyLevel)}
                        className={`relative group min-w-[240px] md:min-w-0 p-6 rounded-[32px] border transition-all duration-500 text-left overflow-hidden
                          ${isActive ? 
                            'bg-cyber-purple/20 border-cyber-purple shadow-[0_0_30px_rgba(191,90,242,0.2)]' : 
                            'bg-white/5 border-white/5 opacity-40 hover:opacity-80'}`}
                      >
                        {/* Background Number */}
                        <div className={`absolute -right-4 -bottom-8 text-[120px] font-black font-mono leading-none transition-all duration-700
                          ${isActive ? 'opacity-10 text-cyber-purple' : 'opacity-5 text-white'}`}>
                          {item.l}
                        </div>

                        <div className="relative z-10">
                          <div className={`p-3 w-fit rounded-2xl mb-4 transition-colors ${isActive ? 'bg-cyber-purple text-white' : 'bg-white/10'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <p className="text-[10px] font-mono uppercase tracking-widest text-cyber-teal mb-1">Module 0{item.l}</p>
                          <h3 className="text-xl font-black mb-2 tracking-tight">{item.name}</h3>
                          <p className="text-xs leading-relaxed opacity-60">
                            {item.desc}
                          </p>
                        </div>

                        {isActive && (
                          <motion.div 
                            layoutId="active-glow"
                            className="absolute inset-0 border-2 border-cyber-purple rounded-[32px] pointer-events-none"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mb-10 max-w-sm mx-auto">
                  <p className="text-xs uppercase tracking-widest opacity-40 mb-3">Operator ID</p>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => {
                      const val = e.target.value;
                      // Validation: Alphanumeric and max 12 characters for clean leaderboard
                      if (/^[a-zA-Z0-9 ]*$/.test(val) && val.length <= 12) {
                        setUserName(val);
                        localStorage.setItem('zen_abacus_name', val);
                      }
                    }}
                    className="w-full bg-cyber-bg border border-white/10 rounded-2xl p-4 text-center focus:outline-none focus:ring-2 focus:ring-cyber-teal/30 focus:border-cyber-teal/50 transition-all text-lg mb-6 uppercase tracking-[0.2em] font-bold shadow-inner placeholder:opacity-20 translate-y-0 active:scale-[0.99]"
                    placeholder="ENTER CODENAME"
                  />

                  {level === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-50">
                        <span>Master Trial Duration</span>
                        <span className="text-cyber-purple">{masterTimerDuration}s</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="180" 
                        step="10"
                        value={masterTimerDuration}
                        onChange={(e) => setMasterTimerDuration(parseInt(e.target.value))}
                        className="w-full accent-cyber-purple h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-[10px] opacity-30 italic text-left">Adjust frequency for high-throughput calculation</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={startGame}
                    className="flex-1 py-5 bg-cyber-purple text-white rounded-2xl font-black text-xl hover:bg-cyber-purple/90 transition-all shadow-xl shadow-cyber-purple/20 flex items-center justify-center gap-3"
                  >
                    <Zap className="w-6 h-6 fill-current" />
                    SPEED TRIAL
                  </button>
                  <button
                    onClick={startPractice}
                    className="flex-1 py-5 bg-cyber-surface border border-white/10 text-white rounded-2xl font-black text-xl hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    PRACTICE
                  </button>
                </div>

                {/* Global Hall of Fame */}
                <div className="mt-12 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3 justify-center mb-8">
                    <Trophy className="w-4 h-4 text-cyber-teal" />
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-text-dim">Global Hall of Fame</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(l => {
                      const levelTopScores = highScores
                        .filter(s => s.level === l)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 1);
                      
                      const levelName = l === 1 ? 'Apprentice' : l === 2 ? 'Adept' : 'Master';
                      const record = levelTopScores[0];

                      return (
                        <div key={l} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-center">
                          <p className="text-[9px] font-mono text-cyber-teal/50 uppercase tracking-widest mb-2">{levelName}</p>
                          {record ? (
                            <div className="text-center">
                              <p className="text-lg font-black tracking-tight text-white mb-0.5">{record.score.toLocaleString()}</p>
                              <p className="text-[10px] opacity-40 uppercase font-mono">{record.name}</p>
                            </div>
                          ) : (
                            <p className="text-[10px] opacity-20 italic">No record</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Playing or Practice State */}
            {(gameState === 'playing' || gameState === 'practice') && (
              <motion.div
                key={gameState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-6"
              >
                <div className={`w-full bg-white/[0.03] rounded-[24px] p-12 text-center border relative overflow-hidden transition-all duration-300
                  ${feedback === 'correct' ? 'border-cyber-correct' : 
                    feedback === 'error' ? 'border-cyber-error animate-shake' : 
                    'border-cyber-teal/10'}`}
                >
                  {gameState === 'practice' && (
                    <button 
                      onClick={() => setGameState('start')}
                      className="absolute top-4 left-4 p-2 hover:bg-white/5 rounded-lg transition-colors group flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-text-dim"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Exit Practice
                    </button>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-teal to-cyber-purple" />
                  
                  <div className="mb-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.h3 
                        key={problem?.question}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="text-[84px] font-bold tracking-[-2px] leading-tight"
                      >
                        {problem?.question}
                      </motion.h3>
                    </AnimatePresence>
                    <p className="text-sm text-text-dim mt-2 uppercase tracking-wide">
                      {gameState === 'practice' ? `Practice: Level 0${level}` : (problem?.rule || 'Mental Calculation Active')}
                    </p>
                  </div>

                  <div className="h-16 flex items-center justify-center mt-4">
                    <div className="text-5xl font-mono tracking-[-1px] text-white">
                      {userInput ? userInput : <span className="opacity-10">000</span>}
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
                    {gameState === 'playing' ? (
                      <motion.div 
                        className="h-full bg-cyber-teal shadow-[0_0_15px_rgba(100,210,255,1)]"
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                      />
                    ) : (
                      <div className="h-full w-full bg-cyber-teal/20 animate-pulse" />
                    )}
                  </div>
                </div>

                {renderNumpad()}
              </motion.div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-cyber-surface border border-white/5 p-12 rounded-[40px] text-center"
              >
                <Trophy className="w-20 h-20 text-cyber-teal mx-auto mb-6" />
                <h2 className="text-4xl font-bold tracking-tight mb-2 uppercase">Trial Complete</h2>
                <div className="text-text-dim text-sm uppercase tracking-widest mb-10">Data Pipeline Closed</div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <p className="text-[10px] uppercase font-mono tracking-[2px] opacity-40 mb-1">Final Score</p>
                    <p className="text-4xl font-black text-cyber-teal">{score}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <p className="text-[10px] uppercase font-mono tracking-[2px] opacity-40 mb-1">Efficiency</p>
                    <p className="text-4xl font-black text-cyber-purple">
                      {score > 500 ? 'S+' : 'A'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="w-full py-5 bg-cyber-teal text-cyber-bg rounded-2xl font-black text-xl hover:opacity-90 transition-all mb-4"
                >
                  REBOOT TRIAL
                </button>
                <button
                  onClick={() => setGameState('start')}
                  className="w-full py-4 border border-white/10 rounded-2xl font-bold opacity-60 hover:opacity-100 transition-all"
                >
                  RETURN TO BASE
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Sidebar (Only in playing/practice mode) */}
          {(gameState === 'playing' || gameState === 'practice') && (
            <aside className="hidden lg:flex flex-col bg-cyber-surface rounded-2xl p-5 border border-white/5">
              <div className="text-[11px] uppercase tracking-[1.5px] text-text-dim mb-4 flex justify-between">
                <span>Recent Session</span>
                <span>Ans</span>
              </div>
              <div className="space-y-2.5 mt-4">
                <div className="flex justify-between text-xs text-cyber-correct">
                  <span>12 + 88</span>
                  <span className="font-mono">100</span>
                </div>
                <div className="flex justify-between text-xs text-cyber-correct">
                  <span>45 - 19</span>
                  <span className="font-mono">26</span>
                </div>
                <div className="flex justify-between text-xs text-cyber-error">
                  <span>33 + 7</span>
                  <span className="font-mono">41</span>
                </div>
              </div>
              
              <div className="mt-auto bg-cyber-teal/5 p-4 rounded-xl text-center">
                <div className="text-[10px] text-cyber-teal uppercase tracking-widest mb-1">Session Combo</div>
                <div className="text-2xl font-black font-mono">x4.5</div>
              </div>
            </aside>
          )}
        </main>

        <footer className="mt-8 flex gap-6 text-[12px] text-text-dim py-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-cyber-teal">
            <div className="w-2 h-2 rounded-full bg-cyber-teal shadow-[0_0_8px_rgba(100,210,255,1)]" />
            HAPTICS: ON
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            GHOST ABACUS: OFF
          </div>
          <div className="ml-auto font-mono opacity-40 uppercase tracking-widest">
            ZenAbacus Core v1.0.4 Ready
          </div>
        </footer>
      </div>
    </div>
  );
}
