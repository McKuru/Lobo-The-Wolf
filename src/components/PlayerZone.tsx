import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../types';
import { CardView } from './CardView';

interface PlayerZoneProps {
  playerCards: Card[];
  deck: Card[]; // top card is deck[0]
  selectedCardIds: string[];
  hintedCardIds: string[];
  onToggleCard: (cardId: string) => void;
  disabled?: boolean;
}

export const PlayerZone: React.FC<PlayerZoneProps> = ({
  playerCards,
  deck,
  selectedCardIds,
  hintedCardIds,
  onToggleCard,
  disabled = false,
}) => {
  const topDeckCard = deck.length > 0 ? deck[0] : undefined;
  const totalValue = playerCards.reduce((acc, c) => acc + c.value, 0);

  return (
    <section
      id="player-zone"
      className="w-full flex-1 flex flex-col justify-between px-4 py-3 sm:px-12 sm:py-4 bg-[#1e1e2e] relative overflow-hidden"
    >
      {/* Player Status / Info Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#89b4fa]" />
          <span className="text-xs uppercase tracking-widest text-[#89b4fa] font-bold">
            Senin Elin
          </span>
          <span className="text-[11px] text-[#6c7086] font-mono hidden sm:inline ml-2">
            (Toplam: <strong className="text-[#a6e3a1]">{totalValue} Puan</strong>)
          </span>
        </div>

        {/* Selected cards counter / status */}
        <div className="flex items-center gap-2">
          {selectedCardIds.length > 0 ? (
            <span className="px-3 py-1 rounded-lg bg-[#89b4fa]/15 text-[#89b4fa] border border-[#89b4fa]/30 text-xs font-semibold animate-pulse">
              {selectedCardIds.length} kart seçildi
            </span>
          ) : (
            <span className="text-xs text-[#6c7086] hidden sm:inline">
              Hamle yapmak için kartlara tıklayın
            </span>
          )}
        </div>
      </div>

      {/* Player Hand & Draw Deck Area */}
      <div className="my-auto py-1 sm:py-2 flex items-center justify-center gap-2 sm:gap-6 md:gap-8 z-10 w-full max-w-5xl mx-auto">
        {/* Player Active Face-Up Cards - 2 rows in mobile grid, single row in tablet/desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 min-h-[100px] sm:min-h-[140px] px-0.5 sm:px-1">
          <AnimatePresence mode="popLayout">
            {playerCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="col-span-2 px-6 py-4 rounded-xl border border-dashed border-[#585b70]/40 bg-[#181825] text-center"
              >
                <p className="text-sm font-semibold text-[#a6adc8]">Elinizde kart kalmadı</p>
              </motion.div>
            ) : (
              playerCards.map((card) => (
                <CardView
                  key={card.id}
                  card={card}
                  owner="player"
                  isSelected={selectedCardIds.includes(card.id)}
                  isHinted={hintedCardIds.includes(card.id)}
                  onClick={() => onToggleCard(card.id)}
                  disabled={disabled}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Right side: Draw Deck with High-Elevation 3D Stack */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center pl-2 sm:pl-4 border-l border-[#313244]/40">
          <div className="relative group flex flex-col items-center">
            {deck.length > 0 ? (
              <>
                {/* 3D Stacked Card Pile with Depth & Elevation */}
                <div className="absolute top-2.5 -right-2 w-16 h-22 sm:w-20 sm:h-28 md:w-24 md:h-34 lg:w-28 lg:h-40 rounded-xl bg-[#11111b] border border-[#313244] pointer-events-none transform rotate-4 shadow-xl" />
                <div className="absolute top-1 -right-1 w-16 h-22 sm:w-20 sm:h-28 md:w-24 md:h-34 lg:w-28 lg:h-40 rounded-xl bg-[#181825] border border-[#45475a] pointer-events-none transform rotate-2 shadow-lg" />

                {/* Top Card Face Up with Açık Kart Badge & Elevation */}
                <div className="relative z-10 shadow-[0_12px_32px_rgba(0,0,0,0.65)] rounded-xl">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#a6e3a1] text-[#11111b] text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded uppercase z-20 shadow-md whitespace-nowrap">
                    Açık Kart
                  </div>
                  <CardView
                    card={topDeckCard}
                    owner="deck"
                    disabled={true}
                  />
                </div>

                {/* Deck remaining count badge */}
                <div className="mt-1 sm:mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#181825] border border-[#45475a] text-[9px] sm:text-[10px] text-[#cdd6f4] font-medium shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]" />
                  <span>Deste: {deck.length} kart</span>
                </div>
              </>
            ) : (
              <div className="w-16 h-22 sm:w-20 sm:h-28 md:w-24 md:h-34 lg:w-28 lg:h-40 rounded-xl border-2 border-dashed border-[#45475a] bg-[#181825]/40 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-lg sm:text-xl mb-1 opacity-50">📭</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#a6adc8]">Deste Bitti</span>
                <span className="text-[8px] sm:text-[9px] text-[#6c7086]">0 kart</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player footer guide */}
      <div className="flex items-center justify-end text-[11px] text-[#6c7086] pt-1">
        <span className="text-[#a6adc8]">
          Hedef Skor: <span className="text-[#f9e2af] font-bold">100 Puan</span>
        </span>
      </div>
    </section>
  );
};
