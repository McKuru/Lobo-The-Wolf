import React from 'react';
import { motion } from 'motion/react';
import { GameMode, GameStats } from '../types';
import { Language, translations } from '../utils/i18n';
import { Play, Flame, Sliders, BookOpen, Volume2, VolumeX, Sparkles, Layers, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenGameModes: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  currentMode: GameMode;
  stats: GameStats;
  isMuted: boolean;
  onToggleSound: () => void;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenGameModes,
  onOpenSettings,
  onOpenRules,
  currentMode,
  stats,
  isMuted,
  onToggleSound,
  lang,
  onLanguageChange,
}) => {
  const t = translations[lang];

  const getModeDetails = (mode: GameMode) => {
    switch (mode) {
      case 'lucky_5x':
        return {
          title: t.modeLuckyTitle,
          icon: <Sparkles className="w-4 h-4 text-[#f9e2af]" />,
          colorClass: 'text-[#f9e2af] border-[#f9e2af]/40 bg-[#f9e2af]/15',
        };
      case 'extra_cards':
        return {
          title: t.modeExtraTitle,
          icon: <Layers className="w-4 h-4 text-[#89b4fa]" />,
          colorClass: 'text-[#89b4fa] border-[#89b4fa]/40 bg-[#89b4fa]/15',
        };
      case 'classic':
      default:
        return {
          title: t.modeClassicTitle,
          icon: <Zap className="w-4 h-4 text-[#a6e3a1]" />,
          colorClass: 'text-[#a6e3a1] border-[#a6e3a1]/40 bg-[#a6e3a1]/15',
        };
    }
  };

  const currentModeInfo = getModeDetails(currentMode);

  return (
    <div
      id="main-menu-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#11111b] text-[#cdd6f4] px-4 py-6 sm:py-10 relative overflow-hidden select-none"
    >
      {/* Background Ambient Glow Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#89b4fa]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#f38ba8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Language & Sound Quick Access */}
      <div className="w-full max-w-4xl flex items-center justify-between z-20">
        <button
          onClick={() => onLanguageChange(lang === 'tr' ? 'en' : 'tr')}
          className="px-3.5 py-1.5 rounded-full bg-[#181825] border border-[#313244] hover:border-[#89b4fa] text-xs font-bold text-[#cdd6f4] flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <span>{lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}</span>
        </button>

        {/* Active Mode Pill (Clickable to change mode) */}
        <button
          onClick={onOpenGameModes}
          className={`px-4 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-lg ${currentModeInfo.colorClass}`}
        >
          {currentModeInfo.icon}
          <span>{currentModeInfo.title}</span>
        </button>

        <button
          onClick={onToggleSound}
          className="p-2.5 rounded-full bg-[#181825] border border-[#313244] hover:border-[#89b4fa] text-[#a6adc8] hover:text-[#cdd6f4] transition-all cursor-pointer shadow-md"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#f38ba8]" /> : <Volume2 className="w-4 h-4 text-[#a6e3a1]" />}
        </button>
      </div>

      {/* Center Section: Logo & 4 Horizontal Circular Action Buttons */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto max-w-3xl w-full z-20">
        {/* Main Brand Title: "Lobo The Wolf" */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-10 md:mb-14"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-[#1e1e2e] border-2 border-[#89b4fa]/40 shadow-[0_0_40px_rgba(137,180,250,0.25)] mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">
            🐺
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#cdd6f4] to-[#89b4fa] tracking-tight uppercase">
            Lobo The Wolf
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#a6adc8] font-medium mt-1.5 sm:mt-2 max-w-md mx-auto px-2">
            {t.menuSubtitle}
          </p>
        </motion.div>

        {/* 4 Horizontal Buttons as drawn in Untitled.png sketch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-center gap-3.5 xs:gap-4 sm:gap-6 md:gap-8"
        >
          {/* Button 1 (Left): Green PLAY Button */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <motion.button
              id="menu-play-button"
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                soundManager.playMoveSuccess('match');
                onStartGame();
              }}
              className="w-16 h-16 xs:w-18 xs:h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 rounded-full bg-[#a6e3a1] text-[#11111b] border-3 sm:border-4 border-[#181825] shadow-[0_0_35px_rgba(166,227,161,0.5)] flex items-center justify-center cursor-pointer transition-shadow hover:shadow-[0_0_45px_rgba(166,227,161,0.7)] group"
              title={t.playBtn}
            >
              <Play className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 fill-current ml-0.5 sm:ml-1 transition-transform group-hover:scale-110" />
            </motion.button>
            <span className="text-[11px] sm:text-sm font-black text-[#a6e3a1] tracking-wide uppercase">
              {t.playBtn}
            </span>
          </div>

          {/* Button 2 (Middle-Left): Yellow GAME MODE Selector Button */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <motion.button
              id="menu-modes-button"
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                soundManager.playCardSelect();
                onOpenGameModes();
              }}
              className="w-16 h-16 xs:w-18 xs:h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 rounded-full bg-[#f9e2af] text-[#11111b] border-3 sm:border-4 border-[#181825] shadow-[0_0_35px_rgba(249,226,175,0.45)] flex items-center justify-center cursor-pointer transition-shadow hover:shadow-[0_0_45px_rgba(249,226,175,0.65)] group"
              title={t.gameModeBtn}
            >
              <Flame className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 fill-current transition-transform group-hover:scale-110" />
            </motion.button>
            <span className="text-[11px] sm:text-sm font-black text-[#f9e2af] tracking-wide uppercase">
              {t.gameModeBtn}
            </span>
          </div>

          {/* Button 3 (Middle-Right): Dark/Muted Blue SETTINGS Button */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <motion.button
              id="menu-settings-button"
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                soundManager.playCardSelect();
                onOpenSettings();
              }}
              className="w-16 h-16 xs:w-18 xs:h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 rounded-full bg-[#45475a] hover:bg-[#585b70] text-[#89b4fa] border-3 sm:border-4 border-[#181825] shadow-[0_0_30px_rgba(137,180,250,0.3)] flex items-center justify-center cursor-pointer transition-all hover:shadow-[0_0_40px_rgba(137,180,250,0.5)] group"
              title={t.settingsBtn}
            >
              <Sliders className="w-6 h-6 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform group-hover:scale-110 text-[#89b4fa]" />
            </motion.button>
            <span className="text-[11px] sm:text-sm font-black text-[#89b4fa] tracking-wide uppercase">
              {t.settingsBtn}
            </span>
          </div>

          {/* Button 4 (Right): Purple RULES Button */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <motion.button
              id="menu-rules-button"
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                soundManager.playCardSelect();
                onOpenRules();
              }}
              className="w-16 h-16 xs:w-18 xs:h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 rounded-full bg-[#313244] hover:bg-[#45475a] text-[#cba6f7] border-3 sm:border-4 border-[#181825] shadow-[0_0_25px_rgba(203,166,247,0.25)] flex items-center justify-center cursor-pointer transition-all hover:shadow-[0_0_35px_rgba(203,166,247,0.45)] group"
              title={t.rulesBtn}
            >
              <BookOpen className="w-6 h-6 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform group-hover:scale-110 text-[#cba6f7]" />
            </motion.button>
            <span className="text-[11px] sm:text-sm font-black text-[#cba6f7] tracking-wide uppercase">
              {t.rulesBtn}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Info */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-[#6c7086] border-t border-[#313244]/60 pt-4 z-20">
        <div className="flex items-center gap-4">
          <span>{lang === 'tr' ? 'En Yüksek Skor:' : 'High Score:'} <strong className="text-[#89b4fa] font-mono">{stats.highestRoundScore}</strong></span>
          <span>{lang === 'tr' ? 'Kazanılan Tur:' : 'Won Rounds:'} <strong className="text-[#a6e3a1] font-mono">{stats.playerRoundsWon}</strong></span>
        </div>
        <div className="text-[11px] opacity-75">
          {lang === 'tr' ? 'Lo-Fi Chill & Solitaire Experience' : 'Lo-Fi Chill & Solitaire Experience'}
        </div>
      </div>
    </div>
  );
};
