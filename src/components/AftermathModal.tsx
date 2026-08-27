import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RoundResult } from '../types';
import { CardView } from './CardView';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Skull, ArrowRight, AlertCircle } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface AftermathModalProps {
  roundResult: RoundResult;
  playerTotalScore: number;
  wolfTotalScore: number;
  currentRound: number;
  targetScore: number;
  onNextRound: () => void;
  lang?: Language;
}

export const AftermathModal: React.FC<AftermathModalProps> = ({
  roundResult,
  playerTotalScore,
  wolfTotalScore,
  currentRound,
  targetScore,
  onNextRound,
  lang = 'tr',
}) => {
  const isPlayerWinner = roundResult.winner === 'player';
  const isNoMoves = roundResult.reason === 'no_valid_moves';
  const roundPoints = isPlayerWinner ? roundResult.playerRoundScore : roundResult.wolfRoundScore;
  const cardsToShow = isPlayerWinner ? roundResult.playerCardsRemaining : roundResult.wolfCardsRemaining;
  const t = translations[lang];

  // Animated counting for points
  const [animatedPoints, setAnimatedPoints] = useState(0);

  useEffect(() => {
    // Play winner or loser sound effect
    if (isPlayerWinner) {
      soundManager.playRoundWin();
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#89b4fa', '#a6e3a1', '#f9e2af', '#cba6f7'],
      });
    } else {
      soundManager.playRoundLoss();
    }

    // Number roll up animation
    let start = 0;
    const end = roundPoints;
    if (end === 0) {
      setAnimatedPoints(0);
      return;
    }

    const duration = 1000;
    const stepTime = Math.max(20, Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setAnimatedPoints(start);
      soundManager.playScoreCountTick();
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [roundPoints, isPlayerWinner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11111b]/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        className="w-full max-w-lg rounded-3xl border-2 border-[#45475a] bg-[#181825] shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-48 rounded-full blur-3xl pointer-events-none opacity-40
            ${isPlayerWinner ? 'bg-[#a6e3a1]' : isNoMoves ? 'bg-[#fab387]' : 'bg-[#f38ba8]'}
          `}
        />

        {/* Winner Badge / Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border-2 shadow-xl
            ${
              isPlayerWinner
                ? 'bg-[#a6e3a1]/20 border-[#a6e3a1] text-[#a6e3a1]'
                : isNoMoves
                ? 'bg-[#fab387]/20 border-[#fab387] text-[#fab387]'
                : 'bg-[#f38ba8]/20 border-[#f38ba8] text-[#f38ba8]'
            }
          `}
        >
          {isPlayerWinner ? (
            <Trophy className="w-9 h-9 animate-bounce" />
          ) : isNoMoves ? (
            <AlertCircle className="w-9 h-9" />
          ) : (
            <Skull className="w-9 h-9" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#cdd6f4] tracking-wide">
          {isPlayerWinner
            ? t.roundWonTitle
            : isNoMoves
            ? t.roundNoMovesTitle
            : t.roundLostTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#a6adc8] mt-1 max-w-sm">
          {isPlayerWinner
            ? t.roundWonSubtitle
            : isNoMoves
            ? t.roundNoMovesSubtitle
            : t.roundLostSubtitle}
        </p>

        {/* Animated Point Counter */}
        <div className="my-5 py-4 px-6 rounded-2xl bg-[#1e1e2e] border border-[#313244] w-full flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-[#a6adc8] font-bold">
            {t.roundScoreTitle}
          </span>
          <div className="flex items-baseline gap-1.5 my-1">
            <span
              className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight
                ${isPlayerWinner ? 'text-[#a6e3a1]' : 'text-[#f38ba8]'}
              `}
            >
              +{animatedPoints}
            </span>
            <span className="text-sm font-semibold text-[#a6adc8]">{t.points}</span>
          </div>
          <span className="text-[11px] text-[#6c7086]">
            {isPlayerWinner
              ? (lang === 'tr' ? 'Elinizde kalan kartların toplamı' : 'Sum of remaining cards in your hand')
              : (lang === 'tr' ? "Kurt'un elinde kalan kartların toplamı" : 'Sum of remaining cards in Wolf hand')}
          </span>
        </div>

        {/* Remaining Cards Breakdown */}
        {cardsToShow.length > 0 && (
          <div className="w-full mb-5">
            <p className="text-xs font-semibold text-[#a6adc8] mb-2 text-left">
              {t.scoringCards} ({cardsToShow.length} {t.cardCount}):
            </p>
            <div className="flex items-center justify-center flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
              {cardsToShow.map((c) => (
                <CardView key={c.id} card={c} size="sm" disabled />
              ))}
            </div>
          </div>
        )}

        {/* Total Score Progression Bar */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3 rounded-2xl bg-[#1e1e2e] border border-[#313244]">
            <div className="flex items-center justify-between text-xs text-[#a6adc8]">
              <span>{t.youLabel}</span>
              <span className="text-[#a6e3a1] font-bold">🎯 {targetScore}</span>
            </div>
            <p className="text-xl font-bold text-[#89b4fa] mt-1">{playerTotalScore} {t.points}</p>
            <div className="w-full bg-[#313244] h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#89b4fa] h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (playerTotalScore / targetScore) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#1e1e2e] border border-[#313244]">
            <div className="flex items-center justify-between text-xs text-[#a6adc8]">
              <span>{t.wolfLabel}</span>
              <span className="text-[#f38ba8] font-bold">🎯 {targetScore}</span>
            </div>
            <p className="text-xl font-bold text-[#f38ba8] mt-1">{wolfTotalScore} {t.points}</p>
            <div className="w-full bg-[#313244] h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#f38ba8] h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (wolfTotalScore / targetScore) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Next Round Button */}
        <button
          id="next-round-button"
          onClick={onNextRound}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-[#89b4fa] to-[#cba6f7] text-[#11111b] hover:shadow-[0_0_25px_rgba(137,180,250,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>{t.nextRoundBtn} ({t.round} {currentRound + 1})</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
