import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode } from '../types';
import { Language, translations } from '../utils/i18n';
import { Sparkles, Layers, Zap, Check, X, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GameModeModalProps {
  isOpen: boolean;
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onClose: () => void;
  lang?: Language;
}

export const GameModeModal: React.FC<GameModeModalProps> = ({
  isOpen,
  currentMode,
  onSelectMode,
  onClose,
  lang = 'tr',
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const modes: {
    id: GameMode;
    title: string;
    description: string;
    badge: string;
    icon: React.ReactNode;
    colorClass: string;
    borderClass: string;
    bgClass: string;
    accentColor: string;
  }[] = [
    {
      id: 'lucky_5x',
      title: t.modeLuckyTitle,
      description: t.modeLuckyDesc,
      badge: lang === 'tr' ? 'Yeni Başlayanlar & Yüksek Şans' : 'Beginner Friendly & High Luck',
      icon: <Sparkles className="w-6 h-6 text-[#f9e2af]" />,
      colorClass: 'text-[#f9e2af]',
      borderClass: 'border-[#f9e2af]',
      bgClass: 'bg-[#f9e2af]/10',
      accentColor: '#f9e2af',
    },
    {
      id: 'extra_cards',
      title: t.modeExtraTitle,
      description: t.modeExtraDesc,
      badge: lang === 'tr' ? '6 Kart Oyuncu vs 5 Kart Kurt' : '6 Player Cards vs 5 Wolf Cards',
      icon: <Layers className="w-6 h-6 text-[#89b4fa]" />,
      colorClass: 'text-[#89b4fa]',
      borderClass: 'border-[#89b4fa]',
      bgClass: 'bg-[#89b4fa]/10',
      accentColor: '#89b4fa',
    },
    {
      id: 'classic',
      title: t.modeClassicTitle,
      description: t.modeClassicDesc,
      badge: lang === 'tr' ? 'Standart 4v4 Kart' : 'Standard 4v4 Cards',
      icon: <Zap className="w-6 h-6 text-[#a6e3a1]" />,
      colorClass: 'text-[#a6e3a1]',
      borderClass: 'border-[#a6e3a1]',
      bgClass: 'bg-[#a6e3a1]/10',
      accentColor: '#a6e3a1',
    },
  ];

  return (
    <div
      id="game-mode-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-lg bg-[#181825] border-2 border-[#45475a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11111b] px-6 py-5 border-b border-[#313244] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f9e2af]/20 border border-[#f9e2af]/40 flex items-center justify-center text-[#f9e2af] shadow-lg">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#cdd6f4] tracking-tight">
                {t.selectGameMode}
              </h3>
              <p className="text-xs text-[#a6adc8]">
                {lang === 'tr' ? 'İstediğiniz kurallarla oyunu özelleştirin' : 'Customize your match rules and style'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode List */}
        <div className="p-6 space-y-3.5 overflow-y-auto">
          {modes.map((mode) => {
            const isSelected = currentMode === mode.id;
            return (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundManager.playCardSelect();
                  onSelectMode(mode.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 relative overflow-hidden group
                  ${
                    isSelected
                      ? `${mode.borderClass} ${mode.bgClass} shadow-lg`
                      : 'border-[#313244] bg-[#1e1e2e]/80 hover:border-[#45475a] hover:bg-[#1e1e2e]'
                  }
                `}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-110
                    ${
                      isSelected
                        ? `${mode.bgClass} ${mode.borderClass}`
                        : 'bg-[#181825] border-[#313244]'
                    }
                  `}
                >
                  {mode.icon}
                </div>

                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-base text-[#cdd6f4]">
                      {mode.title}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${mode.borderClass} ${mode.bgClass} ${mode.colorClass}`}
                    >
                      {mode.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#a6adc8] leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                {/* Selected Checkmark */}
                {isSelected && (
                  <div
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-[#11111b] font-bold shadow-md`}
                    style={{ backgroundColor: mode.accentColor }}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#11111b]/80 border-t border-[#313244] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] text-xs font-bold transition-all cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
