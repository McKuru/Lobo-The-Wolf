import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Volume1,
  VolumeX,
  Lightbulb,
  BookOpen,
  History,
  RotateCcw,
  Music,
  Sparkles,
  Globe,
  Check,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { Language, translations } from '../utils/i18n';

interface HeaderBarProps {
  playerScore: number;
  wolfScore: number;
  currentRound: number;
  targetScore: number;
  isMuted: boolean;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onToggleSound: () => void;
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
  isMuted,
  lang,
  onLanguageChange,
  onToggleSound,
  onShowRules,
  onShowHints,
  onToggleHistory,
  onResetGame,
}) => {
  const [showVolumeMenu, setShowVolumeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [bgmVol, setBgmVol] = useState(soundManager.getBgmVolume());
  const [sfxVol, setSfxVol] = useState(soundManager.getSfxVolume());
  const volumeMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeMenuRef.current &&
        !volumeMenuRef.current.contains(event.target as Node)
      ) {
        setShowVolumeMenu(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setShowLangMenu(false);
      }
    };
    if (showVolumeMenu || showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumeMenu, showLangMenu]);

  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBgmVol(val);
    soundManager.setBgmVolume(val);
    if (isMuted && val > 0) {
      onToggleSound();
    }
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundManager.setSfxVolume(val);
    if (isMuted && val > 0) {
      onToggleSound();
    }
    // Play SFX preview each time volume is adjusted
    soundManager.playScoreCountTick();
  };

  return (
    <header className="w-full bg-[#181825] border-b border-[#313244] px-2.5 py-2 sm:px-6 sm:py-3 flex items-center justify-between z-40 select-none">
      {/* Brand Title */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#cba6f7] rounded-lg flex items-center justify-center text-[#11111b] font-black italic text-sm sm:text-lg shadow-md">
          L
        </div>
        <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#cba6f7] uppercase leading-none">
          {t.appTitle}
        </h1>
      </div>

      {/* Center Match Scoreboard - Compact and non-overlapping on mobile */}
      <div className="flex items-center gap-2 sm:gap-6 md:gap-8 mx-1">
        {/* Target */}
        <div className="text-center">
          <p className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#6c7086] font-semibold whitespace-nowrap">
            {t.targetScore}
          </p>
          <p className="text-xs sm:text-lg md:text-xl font-mono font-bold text-[#f9e2af] leading-tight">
            {targetScore}
          </p>
        </div>

        {/* Player Score */}
        <div className="text-center">
          <p className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#6c7086] font-semibold whitespace-nowrap">
            {t.youLabel}
          </p>
          <p className="text-xs sm:text-lg md:text-xl font-mono font-bold text-[#a6e3a1] leading-tight">
            {String(playerScore).padStart(3, '0')}
          </p>
        </div>

        {/* Wolf Score */}
        <div className="text-center">
          <p className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#6c7086] font-semibold whitespace-nowrap">
            {t.wolfLabel}
          </p>
          <p className="text-xs sm:text-lg md:text-xl font-mono font-bold text-[#f38ba8] leading-tight">
            {String(wolfScore).padStart(3, '0')}
          </p>
        </div>

        {/* Current Round */}
        <div className="text-center">
          <p className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#6c7086] font-semibold whitespace-nowrap">
            {t.round}
          </p>
          <p className="text-xs sm:text-lg md:text-xl font-mono font-bold text-[#89b4fa] leading-tight">
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
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#f9e2af]/50 text-[#f9e2af] transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden md:inline">{t.hint}</span>
        </button>

        {/* History Button */}
        <button
          id="header-history-button"
          onClick={onToggleHistory}
          title={t.history}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#89b4fa]/50 text-[#a6adc8] hover:text-[#cdd6f4] transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden lg:inline">{t.history}</span>
        </button>

        {/* Rules Button */}
        <button
          id="header-rules-button"
          onClick={onShowRules}
          title={t.rules}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#cba6f7]/50 text-[#cba6f7] transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden lg:inline">{t.rules}</span>
        </button>

        {/* Language Switcher Dropdown Menu */}
        <div className="relative" ref={langMenuRef}>
          <button
            id="header-language-toggle"
            onClick={() => setShowLangMenu((prev) => !prev)}
            title={t.language}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] hover:border-[#89b4fa]/50 text-[#89b4fa] transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#89b4fa]" />
            <span className="hidden md:inline uppercase text-[11px] font-bold">
              {lang}
            </span>
          </button>

          {/* Language Selection Popover */}
          {showLangMenu && (
            <div
              id="language-menu-popover"
              className="absolute right-0 top-full mt-2 w-36 py-1.5 bg-[#181825] border border-[#313244] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] z-50 flex flex-col backdrop-blur-md"
            >
              <button
                onClick={() => {
                  onLanguageChange('tr');
                  setShowLangMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  lang === 'tr'
                    ? 'bg-[#89b4fa]/15 text-[#89b4fa] font-bold'
                    : 'text-[#cdd6f4] hover:bg-[#313244]'
                }`}
              >
                <span>🇹🇷 Türkçe</span>
                {lang === 'tr' && <Check className="w-3.5 h-3.5 text-[#89b4fa]" />}
              </button>
              <button
                onClick={() => {
                  onLanguageChange('en');
                  setShowLangMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#89b4fa]/15 text-[#89b4fa] font-bold'
                    : 'text-[#cdd6f4] hover:bg-[#313244]'
                }`}
              >
                <span>🇬🇧 English</span>
                {lang === 'en' && <Check className="w-3.5 h-3.5 text-[#89b4fa]" />}
              </button>
            </div>
          )}
        </div>

        {/* Sound Toggle & Slider Dropdown Menu */}
        <div className="relative" ref={volumeMenuRef}>
          <button
            id="header-sound-toggle"
            onClick={() => setShowVolumeMenu((prev) => !prev)}
            title={isMuted ? t.sound : t.mute}
            className="p-1.5 sm:p-2 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] border border-[#313244] text-[#a6adc8] hover:text-[#cdd6f4] transition-colors cursor-pointer flex items-center justify-center"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f38ba8]" />
            ) : bgmVol > 0 || sfxVol > 0 ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a6e3a1]" />
            ) : (
              <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f9e2af]" />
            )}
          </button>

          {/* Volume Control Panel (Only Icons, Zero Text) */}
          {showVolumeMenu && (
            <div
              id="volume-slider-popover"
              className="absolute right-0 top-full mt-2 w-60 sm:w-64 p-3.5 bg-[#181825] border border-[#313244] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] z-50 flex flex-col gap-3.5 backdrop-blur-md"
            >
              {/* Music Volume Row */}
              <div className="flex items-center gap-2 w-full">
                <Music className="w-4 h-4 text-[#cba6f7] flex-shrink-0" />
                <input
                  id="bgm-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : bgmVol}
                  onChange={handleBgmChange}
                  className="w-full min-w-0 flex-1 h-1.5 bg-[#313244] rounded-lg appearance-none cursor-pointer accent-[#cba6f7]"
                />
                {isMuted || bgmVol === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-[#6c7086] flex-shrink-0" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#cba6f7] flex-shrink-0" />
                )}
              </div>

              {/* SFX Volume Row */}
              <div className="flex items-center gap-2 w-full">
                <Sparkles className="w-4 h-4 text-[#f9e2af] flex-shrink-0" />
                <input
                  id="sfx-volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : sfxVol}
                  onChange={handleSfxChange}
                  className="w-full min-w-0 flex-1 h-1.5 bg-[#313244] rounded-lg appearance-none cursor-pointer accent-[#f9e2af]"
                />
                {isMuted || sfxVol === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-[#6c7086] flex-shrink-0" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#f9e2af] flex-shrink-0" />
                )}
              </div>
            </div>
          )}
        </div>

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
