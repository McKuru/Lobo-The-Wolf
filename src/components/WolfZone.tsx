import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../types';
import { CardView } from './CardView';
import { Language, translations } from '../utils/i18n';

interface WolfZoneProps {
  wolfCards: Card[];
  selectedCardIds: string[];
  hintedCardIds: string[];
  onToggleCard: (cardId: string) => void;
  disabled?: boolean;
  lang?: Language;
}

export const WolfZone: React.FC<WolfZoneProps> = ({
  wolfCards,
  selectedCardIds,
  hintedCardIds,
  onToggleCard,
  disabled = false,
  lang = 'tr',
}) => {
  const t = translations[lang];

  return (
    <section
      id="wolf-zone"
      className="w-full flex-1 flex flex-col justify-between px-4 py-3 sm:px-12 sm:py-4 bg-[#1e1e2e] relative overflow-hidden"
    >
      {/* Wolf Status Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f38ba8] animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-[#f38ba8] font-bold">
            {t.wolfHandTitle}
          </span>
          <span className="text-[11px] text-[#6c7086] font-mono hidden sm:inline ml-2">
            ({wolfCards.length} {t.cardCount})
          </span>
        </div>

        {/* Target Objective Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#181825] border border-[#313244] text-[11px] text-[#a6adc8]">
          <span className="w-2 h-2 rounded-full bg-[#89b4fa]" />
          <span>
            {lang === 'tr'
              ? "Hedef: Kurt'un elini tamamen boşalt!"
              : "Goal: Clear all cards from the Wolf's hand!"}
          </span>
        </div>
      </div>

      {/* Wolf Hand & Wolf Themed Card Area */}
      <div className="my-auto py-1 sm:py-2 flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-6 md:gap-8 z-10 w-full max-w-5xl mx-auto">
        {/* Wolf Active Face-Up Cards - Smooth responsive flex container */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-5 min-h-[82px] xs:min-h-[92px] sm:min-h-[140px] px-0.5 sm:px-1 max-w-full">
          <AnimatePresence mode="popLayout">
            {wolfCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-4 py-3 sm:px-6 sm:py-4 rounded-xl border border-dashed border-[#a6e3a1]/40 bg-[#a6e3a1]/10 text-center"
              >
                <p className="text-sm sm:text-base font-bold text-[#a6e3a1]">
                  {lang === 'tr' ? "🎉 Kurt'un Eli Boşaldı!" : "🎉 Wolf's Hand Cleared!"}
                </p>
                <p className="text-[10px] sm:text-xs text-[#cdd6f4]/80 mt-0.5">
                  {lang === 'tr' ? 'Oyuncu turu kazandı!' : 'Player won the round!'}
                </p>
              </motion.div>
            ) : (
              wolfCards.map((card) => (
                <CardView
                  key={card.id}
                  card={card}
                  owner="wolf"
                  isSelected={selectedCardIds.includes(card.id)}
                  isHinted={hintedCardIds.includes(card.id)}
                  onClick={() => onToggleCard(card.id)}
                  disabled={disabled}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Right side: Single Solid Red Themed Wolf Card with Sleek Vector Artwork */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center pl-1.5 xs:pl-2 sm:pl-4 border-l border-[#313244]/40">
          <div className="relative group">
            {/* Single Solid Red Card */}
            <div className="relative z-10 w-[52px] h-[76px] xs:w-[60px] xs:h-[86px] sm:w-20 sm:h-28 md:w-24 md:h-34 lg:w-28 lg:h-40 bg-gradient-to-b from-[#b91c1c] via-[#881337] to-[#450a0a] rounded-xl border border-[#f43f5e]/60 flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(185,28,28,0.4)] p-1 sm:p-2 select-none">
              <div className="w-full h-full rounded-lg border border-white/20 bg-black/25 flex flex-col items-center justify-center p-0.5 sm:p-2 relative overflow-hidden backdrop-blur-xs">
                {/* Wolf Silhouette from Reference Image */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  fill="currentColor"
                >
                  <path d="M110 38 C 107 43, 98 52, 90 56 C 84 59, 78 65, 74 69 C 67 73, 58 79, 50.5 82.8 C 47.5 84.2, 48.5 88, 52 90 C 56 92.5, 62 95.5, 65.5 96.8 C 75 99.5, 83 99, 88.5 106 C 93.5 112, 94 121, 89.5 132.5 C 85 144, 77.5 158, 78.5 166 C 80.5 154, 88.5 143, 99.5 135 C 107.5 129, 114 131, 108.5 139.5 C 120 131.5, 131.5 126.5, 136.5 133.5 C 135 121.5, 132 108.5, 125 98.5 C 139 106.5, 147 102.5, 149 109.5 C 147 95.5, 143 84.5, 132 76.5 C 145 80.5, 148 76.5, 149 80.5 C 146.5 67.5, 137.5 59.5, 120 56.5 L 120.5 40.5 Z" />
                </svg>

                {/* Thin, Elegant Typography */}
                <div className="mt-0.5 sm:mt-1.5 flex items-center justify-center">
                  <span className="text-[7px] xs:text-[8px] sm:text-[9.5px] md:text-[11px] font-light tracking-[0.2em] sm:tracking-[0.4em] text-white/90 uppercase pl-[0.2em] sm:pl-[0.4em]">
                    {t.wolfLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wolf status indicator bar */}
      <div className="flex items-center justify-end text-[11px] text-[#6c7086] pt-0.5">
        {selectedCardIds.length > 0 && (
          <span className="text-[#89dceb] font-medium">
            {lang === 'tr'
              ? `Seçilen Kurt Kartı: ${selectedCardIds.length} adet`
              : `Selected Wolf Cards: ${selectedCardIds.length}`}
          </span>
        )}
      </div>
    </section>
  );
};
