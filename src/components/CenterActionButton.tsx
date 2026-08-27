import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoveValidation } from '../types';
import { soundManager } from '../utils/audio';
import { Language, translations } from '../utils/i18n';

interface CenterActionButtonProps {
  hasSelection: boolean;
  validation: MoveValidation;
  onPlayMove: () => void;
  onSurrender: () => void;
  disabled?: boolean;
  lang?: Language;
}

export const CenterActionButton: React.FC<CenterActionButtonProps> = ({
  hasSelection,
  validation,
  onPlayMove,
  onSurrender,
  disabled = false,
  lang = 'tr',
}) => {
  const [pressProgress, setPressProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [isCharged, setIsCharged] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const pressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isChargedRef = useRef(false);
  const HOLD_DURATION = 650; // Snappy 0.65s hold duration

  const t = translations[lang];

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        cancelAnimationFrame(pressTimerRef.current);
      }
    };
  }, []);

  const handlePointerDown = () => {
    if (disabled) return;

    if (hasSelection) {
      // If cards are selected, this is a click-to-play button
      if (validation.isValid) {
        onPlayMove();
      } else {
        soundManager.playInvalid();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
      return;
    }

    // No cards selected -> Hold to surrender mode
    setIsPressing(true);
    setIsCharged(false);
    isChargedRef.current = false;
    setPressProgress(0);
    startTimeRef.current = performance.now();

    const updateHold = (currentTime: number) => {
      if (!startTimeRef.current) return;
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(1, elapsed / HOLD_DURATION);
      setPressProgress(progress);

      if (progress >= 1) {
        if (!isChargedRef.current) {
          isChargedRef.current = true;
          setIsCharged(true);
          soundManager.playChargeTick(1);
        }
      } else {
        if (Math.floor(progress * 10) % 2 === 0) {
          soundManager.playChargeTick(progress);
        }
        pressTimerRef.current = requestAnimationFrame(updateHold);
      }
    };

    pressTimerRef.current = requestAnimationFrame(updateHold);
  };

  const handlePointerUp = () => {
    if (pressTimerRef.current) {
      cancelAnimationFrame(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (isChargedRef.current) {
      // Fully charged and released -> Trigger Surrender!
      setIsPressing(false);
      setIsCharged(false);
      isChargedRef.current = false;
      setPressProgress(0);
      startTimeRef.current = null;
      onSurrender();
    } else {
      // Released before 100% -> Cancel
      setIsPressing(false);
      setIsCharged(false);
      isChargedRef.current = false;
      setPressProgress(0);
      startTimeRef.current = null;
    }
  };

  const handlePointerCancel = () => {
    if (pressTimerRef.current) {
      cancelAnimationFrame(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressing(false);
    setIsCharged(false);
    isChargedRef.current = false;
    setPressProgress(0);
    startTimeRef.current = null;
  };

  return (
    <div className="relative z-30 flex flex-col items-center justify-center pointer-events-auto">
      {/* Circular Action Button */}
      <div className="relative flex items-center justify-center">
        {hasSelection ? (
          /* PLAY BUTTON (When cards are selected) */
          <motion.div
            animate={
              isShaking
                ? { x: [-6, 6, -5, 5, -3, 3, 0] }
                : { scale: 1 }
            }
            transition={{ duration: 0.4 }}
          >
            <button
              id="center-play-button"
              onClick={handlePointerDown}
              disabled={disabled}
              className={`relative w-16 h-16 xs:w-18 xs:h-18 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-3 sm:border-[6px] border-[#1e1e2e] flex flex-col items-center justify-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none overflow-hidden
                ${
                  validation.isValid
                    ? 'bg-[#74c7ec] text-[#11111b] shadow-[0_0_35px_rgba(116,199,236,0.5)]'
                    : 'bg-[#313244] text-[#f38ba8] border-3 sm:border-[6px] border-[#1e1e2e] shadow-[0_0_20px_rgba(243,139,168,0.3)]'
                }
              `}
            >
              {validation.isValid ? (
                <>
                  <span className="text-[#11111b] font-black text-xs xs:text-sm sm:text-xl md:text-2xl tracking-tighter uppercase leading-none">
                    {t.play}
                  </span>
                  <span className="text-[#11111b] text-[7px] xs:text-[8px] sm:text-[10px] md:text-[11px] font-bold opacity-85 mt-0.5 uppercase text-center px-0.5 whitespace-nowrap">
                    {validation.title || (lang === 'tr' ? 'Hamle' : 'Move')}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#f38ba8] font-black text-[10px] xs:text-xs sm:text-sm md:text-base tracking-tight uppercase leading-none">
                    {t.invalid}
                  </span>
                  <span className="text-[#a6adc8] text-[6.5px] xs:text-[7px] sm:text-[9px] font-semibold mt-0.5 text-center px-0.5 whitespace-nowrap">
                    {validation.errorReason || (lang === 'tr' ? 'Hata' : 'Error')}
                  </span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          /* SURRENDER BUTTON (Long Press when no cards selected, triggers upon release after 100%) */
          <div className="relative">
            <button
              id="center-surrender-button"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerCancel}
              onContextMenu={(e) => e.preventDefault()}
              disabled={disabled}
              className={`relative w-16 h-16 xs:w-18 xs:h-18 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-3 sm:border-[6px] border-[#1e1e2e] flex flex-col items-center justify-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.4)]
                ${
                  isCharged
                    ? 'bg-[#f38ba8] text-[#11111b] shadow-[0_0_30px_rgba(243,139,168,0.7)] animate-pulse'
                    : isPressing
                    ? 'bg-[#313244] text-[#f38ba8] shadow-[0_0_20px_rgba(243,139,168,0.4)]'
                    : 'bg-[#181825] hover:bg-[#313244] text-[#cdd6f4]'
                }
              `}
            >
              {/* Charge gauge filling up from bottom */}
              {isPressing && (
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#f38ba8]/35 via-[#f38ba8]/60 to-[#f38ba8]/90 pointer-events-none transition-all duration-75"
                  style={{ height: `${pressProgress * 100}%`, top: 'auto', bottom: 0 }}
                />
              )}

              <span
                className={`font-black text-xs xs:text-sm sm:text-xl md:text-2xl tracking-tighter uppercase leading-none z-10
                  ${
                    isCharged
                      ? 'text-[#11111b]'
                      : isPressing
                      ? 'text-[#f38ba8]'
                      : 'text-[#74c7ec] group-hover:text-white'
                  }
                `}
              >
                {isCharged
                  ? t.releaseToFold.toUpperCase()
                  : isPressing
                  ? t.fold.toUpperCase()
                  : 'LOBO'}
              </span>
              <span
                className={`text-[7px] xs:text-[8px] sm:text-[10px] md:text-[11px] font-bold mt-0.5 sm:mt-1 uppercase text-center px-0.5 z-10 tracking-wide
                  ${isCharged ? 'text-[#11111b]' : isPressing ? 'text-[#f38ba8]' : 'text-[#89b4fa] opacity-90'}
                `}
              >
                {isCharged
                  ? t.fold
                  : isPressing
                  ? `%${Math.round(pressProgress * 100)}`
                  : t.fold}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Validation / Status Tooltip */}
      <AnimatePresence>
        {hasSelection && validation.description && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`absolute -bottom-8 px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-medium shadow-lg border whitespace-nowrap z-40
              ${
                validation.isValid
                  ? 'bg-[#181825] border-[#89b4fa]/40 text-[#89b4fa]'
                  : 'bg-[#181825] border-[#f38ba8]/40 text-[#f38ba8]'
              }
            `}
          >
            {validation.description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
