import { Problem } from '../lib/math';

interface AbacusBoardProps {
  problem: Problem | null;
  userInput: string;
  feedback: 'none' | 'correct' | 'error';
}

const padDigits = (value: number | null, length: number) => {
  if (value === null) return Array.from({ length }, () => 0);
  const digits = String(value).split('').reverse().map(Number);
  while (digits.length < length) digits.push(0);
  return digits.slice(0, length);
};

export function AbacusBoard({ problem, userInput, feedback }: AbacusBoardProps) {
  const digits = padDigits(problem?.answer ?? null, 4);
  const statusClass = feedback === 'correct' ? 'ring-cyber-correct' : feedback === 'error' ? 'ring-cyber-error' : 'ring-white/10';
  const fillClass = feedback === 'correct' ? 'shadow-[0_0_25px_rgba(48,209,88,0.35)]' : feedback === 'error' ? 'shadow-[0_0_25px_rgba(255,69,58,0.35)]' : 'shadow-[0_0_20px_rgba(100,210,255,0.12)]';

  return (
    <div className={`rounded-[32px] border p-6 bg-white/5 border-white/10 ${statusClass} ${fillClass} transition-all duration-300`}> 
      <div className="mb-6 flex justify-between items-center gap-4 text-sm uppercase tracking-[0.3em] text-text-dim">
        <span>Abacus Board</span>
        <span className="font-mono text-cyber-teal">{userInput || '0000'}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {digits.map((value, index) => {
          const upperActive = value >= 5;
          const lowerCount = value % 5;
          return (
            <div key={index} className="abacus-rod bg-cyber-bg/70 rounded-[28px] p-4 border border-white/10 shadow-inner">
              <div className="relative h-16 mb-4 flex items-center justify-center">
                <div className={`abacus-bead upper ${upperActive ? 'active' : ''}`} />
              </div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`abacus-bead lower ${lowerCount >= i ? 'active' : ''}`}
                  />
                ))}
              </div>
              <div className="mt-5 text-center text-xs uppercase tracking-[0.2em] text-text-dim">
                Rod {digits.length - index}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
