import React from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, Layers, Flag } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr',
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11111b]/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[#45475a] bg-[#181825] shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#313244] flex items-center justify-between bg-[#1e1e2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#89b4fa]/20 border border-[#89b4fa]/40 flex items-center justify-center text-[#89b4fa]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#cdd6f4]">
                {t.rulesTitle}
              </h2>
              <p className="text-xs text-[#a6adc8]">
                {lang === 'tr' ? 'Strateji ve Hamle Rehberi' : 'Strategy and Move Guide'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#45475a] flex items-center justify-center text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#cdd6f4]">
          {/* General Overview */}
          <div className="bg-[#1e1e2e] p-4 rounded-xl border border-[#313244] space-y-2">
            <h3 className="font-bold text-[#89b4fa] text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> {t.rulesGoalHeader}
            </h3>
            <p className="text-[#a6adc8] leading-relaxed">
              {t.rulesGoalText}
            </p>
            <div className="p-3 bg-[#11111b] border border-[#45475a]/50 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#f38ba8] font-bold">
                <span>🐺 {lang === 'tr' ? 'Kurt Hamle Mekaniği:' : 'Wolf Action Mechanics:'}</span>
              </div>
              <p className="text-[#cdd6f4]">
                {lang === 'tr'
                  ? 'Kurt asla kendiliğinden hamle yapmaz; yalnızca sizin yaptığınız hamlelere göre desteden kart çeker.'
                  : 'The Wolf never takes turns; it only draws cards according to the capture actions you perform.'}
              </p>
              <div className="pt-1.5 border-t border-[#313244] flex items-center gap-2 text-[#89b4fa]">
                <span className="font-bold">{lang === 'tr' ? '🎯 Hamle Seçim Formülü:' : '🎯 Actions:'}</span>
              </div>
              <p className="text-[#a6adc8] font-mono text-[11px]">
                {lang === 'tr'
                  ? 'Eşleştirme (1=1) • Toplama (2+=1) • Bölme (1=2+) • Üst (1>1) • Çekilme (Fold)'
                  : 'Perfect (1=1) • Sum (2+=1) • Split (1=2+) • Over (1>1) • Fold'}
              </p>
            </div>
          </div>

          {/* 4 Move Types */}
          <div>
            <h3 className="font-bold text-[#f9e2af] text-sm mb-3">{t.rulesMovesHeader}:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Eşleştirme */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#89b4fa]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#89b4fa]/20 text-[#89b4fa] font-bold text-xs">
                    1. {t.rulesPerfectTitle}
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs leading-relaxed">
                  {t.rulesPerfectDesc}
                </p>
              </div>

              {/* 2. Toplama */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#a6e3a1]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#a6e3a1]/20 text-[#a6e3a1] font-bold text-xs">
                    2. {t.rulesSumTitle}
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs leading-relaxed">
                  {t.rulesSumDesc}
                </p>
              </div>

              {/* 3. Bölme */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#cba6f7]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#cba6f7]/20 text-[#cba6f7] font-bold text-xs">
                    3. {t.rulesSplitTitle}
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs leading-relaxed">
                  {t.rulesSplitDesc}
                </p>
              </div>

              {/* 4. Üst */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#fab387]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#fab387]/20 text-[#fab387] font-bold text-xs">
                    4. {t.rulesOverTitle}
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs leading-relaxed">
                  {t.rulesOverDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Scoring & Surrender */}
          <div className="bg-[#1e1e2e] p-4 rounded-xl border border-[#313244] space-y-2">
            <h3 className="font-bold text-[#f38ba8] text-sm flex items-center gap-1.5">
              <Flag className="w-4 h-4" /> {t.rulesScoringHeader}
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#a6adc8]">
              <li>
                <strong className="text-[#a6e3a1]">
                  {lang === 'tr' ? "Kurt'un eli boşalırsa: " : "If Wolf's hand is emptied: "}
                </strong>
                {t.rulesScoringClear}
              </li>
              <li>
                <strong className="text-[#f38ba8]">
                  {lang === 'tr' ? 'Oyuncu çekilirse (Fold): ' : 'If Player folds: '}
                </strong>
                {t.rulesScoringFold}
              </li>
              <li>
                <strong className="text-[#f9e2af]">{t.targetScore}: </strong>
                {t.rulesScoringWin}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#313244] bg-[#1e1e2e] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#89b4fa] text-[#11111b] font-bold text-xs hover:bg-[#b4befe] transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
