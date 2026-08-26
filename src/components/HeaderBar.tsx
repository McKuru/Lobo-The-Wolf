import React from 'react';
import {
  Home,
  Sliders,
  Flame,
  Lightbulb,
  BookOpen,
  History,
  RotateCcw,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { GameMode } from '../types';

interface HeaderBarProps {
  playerScore: number;
  wolfScore: number;
  currentRound: number;
  targetScore: number;
  currentMode: GameMode;
  isMuted: boolean;
  lang: Language;
  onOpenMenu: () => void;
  onOpenGameModes: () => void;
  onOpenSettings: () => void;
  onShowRules: () => void;
  onShowHints: () => void;
  onToggleHistory: () => void;
  onResetGame: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  playerScore,
  wolfScore,
  currentRound,
  targetScore,
  currentMode,
  lang,
  onOpenMenu,
  onOpenGameModes,
  onOpenSettings,
  onShowRules,
  onShowHints,
  onToggleHistory,
  onResetGame,
}) => {
  const t = translations[lang];

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'lucky_5x':
        return { text: t.modeLuckyTitle, color: 'text-[#f9e2af] border-[#f9e2af]/40 bg-[#f9e2af]/10' };
      case 'extra_cards':
        return { text: t.modeExtraTitle, color: 'text-[#89b4fa] border-[#89b4fa]/40 bg-[#89b4fa]/10' };
      case 'classic':
      default:
        return { text: t.modeClassicTitle, color: 'text-[#a6e3a1] border-[#a6e3a1]/40 bg-[#a6e3a1]/10' };
    }
  };

  const modeInfo = getModeLabel(currentMode);

  return (
    <header className="w-full bg-[#181825] border-b border-[#313244] px-2 sm:px-5 py-2 flex items-center justify-between z-40 select-none">
      {/* Brand Title & Menu Button */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        <button
          onClick={onOpenMenu}
          title={t.mainMenu}
          className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#89b4fa] text-[#89b4fa] transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">{t.mainMenu}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-[#cba6f7] uppercase leading-none">
            {t.appTitle}
          </h1>

          {/* Mode Pill badge */}
          <button
            onClick={onOpenGameModes}
            title={t.selectGameMode}
            className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold cursor-pointer hover:scale-105 transition-transform ${modeInfo.color}`}
          >
            <Flame className="w-3 h-3" />
            <span>{modeInfo.text}</span>
          </button>
        </div>
      </div>

      {/* Center Match Scoreboard */}
      <div className="flex items-center gap-2 sm:gap-5 md:gap-7 mx-1">
        {/* Target */}
        <div className="text-center">
          <p className="text-[7px] sm:text-[9px] uppercase tracking-wider text-[#6c7086] font-bold whitespace-nowrap">
            {t.targetScore}
          </p>
          <p className="text-xs sm:text-base md:text-lg font-mono font-bold text-[#f9e2af] leading-tight">
            {targetScore}
          </p>
        </div>

        {/* Player Score */}
        <div className="text-center">
          <p className="text-[7px] sm:text-[9px] uppercase tracking-wider text-[#6c7086] font-bold whitespace-nowrap">
            {t.youLabel}
          </p>
          <p className="text-xs sm:text-base md:text-lg font-mono font-bold text-[#a6e3a1] leading-tight">
            {String(playerScore).padStart(3, '0')}
          </p>
        </div>

        {/* Wolf Score */}
        <div className="text-center">
          <p className="text-[7px] sm:text-[9px] uppercase tracking-wider text-[#6c7086] font-bold whitespace-nowrap">
            {t.wolfLabel}
          </p>
          <p className="text-xs sm:text-base md:text-lg font-mono font-bold text-[#f38ba8] leading-tight">
            {String(wolfScore).padStart(3, '0')}
          </p>
        </div>

        {/* Current Round */}
        <div className="text-center">
          <p className="text-[7px] sm:text-[9px] uppercase tracking-wider text-[#6c7086] font-bold whitespace-nowrap">
            {t.round}
          </p>
          <p className="text-xs sm:text-base md:text-lg font-mono font-bold text-[#89b4fa] leading-tight">
            {String(currentRound).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {/* Hint Button */}
        <button
          id="header-hint-button"
          onClick={onShowHints}
          title={t.hint}
          className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#f9e2af]/50 text-[#f9e2af] transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden lg:inline">{t.hint}</span>
        </button>

        {/* History Button */}
        <button
          id="header-history-button"
          onClick={onToggleHistory}
          title={t.history}
          className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#89b4fa]/50 text-[#a6adc8] hover:text-[#cdd6f4] transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xl:inline">{t.history}</span>
        </button>

        {/* Rules Button */}
        <button
          id="header-rules-button"
          onClick={onShowRules}
          title={t.rules}
          className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#cba6f7]/50 text-[#cba6f7] transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xl:inline">{t.rules}</span>
        </button>

        {/* Settings Button */}
        <button
          id="header-settings-button"
          onClick={onOpenSettings}
          title={t.settings}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#89b4fa] text-[#89b4fa] transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
        >
          <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#89b4fa]" />
          <span className="hidden md:inline">{t.settings}</span>
        </button>

        {/* Reset / New Game */}
        <button
          id="header-restart-button"
          onClick={onResetGame}
          title={t.reset}
          className="p-1.5 sm:p-2 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] text-[#a6adc8] hover:text-[#f38ba8] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};
