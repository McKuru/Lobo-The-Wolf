import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../types';
import { getSuitInfo } from '../utils/gameLogic';

interface CardViewProps {
  card?: Card;
  isSelected?: boolean;
  isFaceDown?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isHinted?: boolean;
  size?: 'sm' | 'md' | 'lg';
  owner?: 'player' | 'wolf' | 'deck';
  badge?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected = false,
  isFaceDown = false,
  onClick,
  disabled = false,
  isHinted = false,
  size = 'md',
  owner = 'player',
  badge,
}) => {
  // If face down (e.g. Wolf card back or closed deck pile)
  if (isFaceDown || !card) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={!disabled && onClick ? { scale: 1.03 } : {}}
        onClick={!disabled ? onClick : undefined}
        className={`relative select-none rounded-xl border-2 border-[#45475a] bg-[#313244] p-1 sm:p-2 flex flex-col items-center justify-center shadow-xl transition-all duration-200 flex-shrink-0
          ${size === 'sm' ? 'w-12 h-17 sm:w-16 sm:h-24' : size === 'lg' ? 'w-20 h-28 sm:w-28 sm:h-40' : 'w-[52px] h-[76px] xs:w-[60px] xs:h-[86px] sm:w-20 sm:h-28 md:w-24 md:h-34 lg:w-28 lg:h-40'}
          ${onClick && !disabled ? 'cursor-pointer hover:border-[#89b4fa]' : 'cursor-default'}
        `}
      >
        {/* Card Back Themed Emblem */}
        <div className="w-full h-full rounded-lg border border-[#585b70] bg-[#11111b] flex flex-col items-center justify-center p-0.5 sm:p-1 relative overflow-hidden">
          <div className="text-base sm:text-2xl md:text-3xl filter grayscale opacity-40">🐺</div>
          <span className="text-[7px] sm:text-[9px] tracking-widest font-black text-[#6c7086] mt-0.5 uppercase">
            LOBO
          </span>
        </div>
      </motion.div>
    );
  }

  const suitInfo = getSuitInfo(card.suit);

  return (
    <motion.div
      layout
      initial={
        owner === 'deck'
          ? { scale: 0.9, opacity: 0 }
          : {
              scale: 0.7,
              opacity: 0,
              x: 60,
              y: owner === 'wolf' ? -35 : 35,
              rotate: owner === 'wolf' ? -8 : 8,
            }
      }
      animate={{
        scale: isSelected ? 1.07 : 1,
        opacity: 1,
        x: 0,
        y: isSelected ? (owner === 'wolf' ? 8 : -8) : 0,
        rotate: 0,
      }}
      exit={{
        scale: 0.4,
        opacity: 0,
        y: owner === 'wolf' ? 30 : -30,
        filter: 'blur(4px)',
        transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
      }}
      whileHover={
        !disabled && onClick
          ? {
              scale: isSelected ? 1.1 : 1.05,
              y: isSelected ? (owner === 'wolf' ? 10 : -10) : owner === 'wolf' ? 4 : -4,
            }
          : {}
      }
      whileTap={!disabled && onClick ? { scale: 0.96 } : {}}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.8,
      }}
      onClick={!disabled ? onClick : undefined}
      id={`card-${card.id}`}
      className={`relative select-none rounded-xl border-2 border-[#181825] transition-shadow duration-200 flex flex-col justify-between p-1 sm:p-2 md:p-3 overflow-hidden shadow-xl flex-shrink-0
        ${size === 'sm' ? 'w-12 h-17 sm:w-16 sm:h-24 text-xs' : size === 'lg' ? 'w-20 h-28 sm:w-28 sm:h-40' : 'w-[52px] h-[76px] xs:w-[60px] xs:h-[86px] sm:w-20 sm:h-28 md:w-24 md:h-34 lg:w-28 lg:h-40'}
        ${
          isSelected
            ? 'ring-3 sm:ring-4 ring-[#89dceb] shadow-[0_0_25px_#89dceb] z-20'
            : isHinted
            ? 'ring-3 sm:ring-4 ring-[#f9e2af] shadow-[0_0_20px_#f9e2af] z-10 animate-pulse'
            : 'hover:brightness-105 shadow-md hover:shadow-2xl'
        }
        ${onClick && !disabled ? 'cursor-pointer' : 'cursor-default'}
      `}
      style={{
        backgroundColor: suitInfo.colorHex,
      }}
    >
      {/* Background Watermark Value */}
      <div className="absolute inset-0 flex items-center justify-center opacity-12 text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-[#11111b] pointer-events-none select-none">
        {card.value}
      </div>

      {/* Selection Glow Indicator Badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#11111b] text-[#89dceb] text-[9px] sm:text-xs font-black flex items-center justify-center shadow-lg z-30 border border-[#89dceb]"
        >
          ✓
        </motion.div>
      )}

      {badge && (
        <div className="absolute -top-2 -left-2 px-1.5 py-0.5 rounded bg-[#11111b] text-[#cdd6f4] border border-[#585b70] text-[8px] sm:text-[10px] font-bold shadow-md z-30">
          {badge}
        </div>
      )}

      {/* Top Left Value */}
      <div className="flex items-start justify-between pointer-events-none z-10">
        <span className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-[#11111b] leading-none tracking-tight">
          {card.value}
        </span>
      </div>

      {/* Center Artistic Number / Badge */}
      <div className="flex items-center justify-center my-auto pointer-events-none z-10">
        <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full border-2 border-[#11111b]/25 bg-[#11111b]/10 flex items-center justify-center font-black text-xs xs:text-sm sm:text-base md:text-xl text-[#11111b] shadow-inner backdrop-blur-[1px]">
          {card.value}
        </div>
      </div>

      {/* Bottom Right Inverted Value */}
      <div className="flex items-end justify-between rotate-180 pointer-events-none z-10 opacity-70">
        <span className="text-xs xs:text-sm sm:text-lg md:text-xl font-black text-[#11111b] leading-none tracking-tight">
          {card.value}
        </span>
      </div>
    </motion.div>
  );
};
