import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Skull, BarChart3 } from 'lucide-react';
import { GameStats } from '../types';
import { Language, translations } from '../utils/i18n';
import { soundManager } from '../utils/audio';

interface GameOverModalProps {
  winner: 'player' | 'wolf';
  playerTotalScore: number;
  wolfTotalScore: number;
  stats: GameStats;
  onRestartGame: () => void;
  lang?: Language;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  playerTotalScore,
  wolfTotalScore,
  stats,
  onRestartGame,
  lang = 'tr',
}) => {
  const isPlayerWinner = winner === 'player';
  const t = translations[lang];

  useEffect(() => {
    if (isPlayerWinner) {
      soundManager.playRoundWin();
      const end = Date.now() + 2.5 * 1000;
      const interval: NodeJS.Timeout = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }, 250);
      return () => clearInterval(interval);
    } else {
      soundManager.playRoundLoss();
    }
  }, [isPlayerWinner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11111b]/85 backdrop-blur-lg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-3xl border-2 border-[#585b70] bg-[#181825] shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-48 rounded-full blur-3xl pointer-events-none opacity-35
            ${isPlayerWinner ? 'bg-[#a6e3a1]' : 'bg-[#f38ba8]'}
          `}
        />

        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 border-2 shadow-2xl z-10
            ${
              isPlayerWinner
                ? 'bg-[#a6e3a1]/25 border-[#a6e3a1] text-[#a6e3a1]'
                : 'bg-[#f38ba8]/25 border-[#f38ba8] text-[#f38ba8]'
            }
          `}
        >
          {isPlayerWinner ? <Trophy className="w-10 h-10 animate-bounce" /> : <Skull className="w-10 h-10" />}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#cdd6f4] tracking-tight z-10">
          {isPlayerWinner ? t.gameOverWinTitle : t.gameOverLossTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#a6adc8] mt-2 max-w-xs z-10">
          {isPlayerWinner ? t.gameOverWinDesc : t.gameOverLossDesc}
        </p>

        {/* Final Scoreboard */}
        <div className="my-6 grid grid-cols-2 gap-4 w-full z-10">
          <div className="p-4 rounded-2xl bg-[#1e1e2e] border border-[#313244] text-center">
            <span className="text-xs uppercase text-[#a6adc8] font-bold">{t.youLabel}</span>
            <p className="text-3xl font-extrabold text-[#89b4fa] mt-1">{playerTotalScore}</p>
            <span className="text-[10px] text-[#a6e3a1] font-semibold">
              {isPlayerWinner ? t.targetReached : t.points}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1e1e2e] border border-[#313244] text-center">
            <span className="text-xs uppercase text-[#a6adc8] font-bold">{t.wolfLabel}</span>
            <p className="text-3xl font-extrabold text-[#f38ba8] mt-1">{wolfTotalScore}</p>
            <span className="text-[10px] text-[#f38ba8] font-semibold">
              {!isPlayerWinner ? t.targetReached : t.points}
            </span>
          </div>
        </div>

        {/* Match Statistics */}
        <div className="w-full bg-[#1e1e2e] rounded-2xl p-4 border border-[#313244] mb-6 text-xs text-[#a6adc8] space-y-2 text-left z-10">
          <div className="flex items-center gap-1.5 font-bold text-[#cdd6f4] border-b border-[#313244] pb-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#89b4fa]" />
            <span>{t.finalScoreLabel}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#a6adc8]">{t.statRoundsPlayed}:</span>
            <span className="font-bold text-[#cdd6f4]">{stats.roundsPlayed}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#a6adc8]">{t.statRoundsWon}:</span>
            <span className="font-bold text-[#a6e3a1]">
              {stats.playerRoundsWon} {t.round}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#a6adc8]">{t.statMatchesMade}:</span>
            <span className="font-bold text-[#89b4fa]">{stats.totalMatchesMade}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#a6adc8]">{t.statSumSplitMoves}:</span>
            <span className="font-bold text-[#cba6f7]">
              {stats.totalSumMoves + stats.totalSplitMoves}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#a6adc8]">{t.statHighestScore}:</span>
            <span className="font-bold text-[#f9e2af]">
              {stats.highestRoundScore} {t.points}
            </span>
          </div>
        </div>

        {/* Restart Button */}
        <button
          id="restart-game-button"
          onClick={onRestartGame}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-[#89b4fa] via-[#a6e3a1] to-[#94e2d5] text-[#11111b] hover:shadow-[0_0_25px_rgba(166,227,161,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 z-10"
        >
          <RefreshCw className="w-5 h-5" />
          <span>{t.playAgainBtn}</span>
        </button>
      </motion.div>
    </div>
  );
};
