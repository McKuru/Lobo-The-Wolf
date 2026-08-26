import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language, translations } from '../utils/i18n';
import { Volume2, VolumeX, Music, Sliders, Globe, RotateCcw, X, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  onResetGame,
}) => {
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());
  const [bgmVol, setBgmVol] = useState(() => Math.round(soundManager.getBgmVolume() * 100));
  const [sfxVol, setSfxVol] = useState(() => Math.round(soundManager.getSfxVolume() * 100));

  if (!isOpen) return null;

  const t = translations[lang];

  const handleToggleMute = () => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
  };

  const handleBgmChange = (val: number) => {
    setBgmVol(val);
    soundManager.setBgmVolume(val / 100);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    soundManager.setSfxVolume(val / 100);
    soundManager.playScoreCountTick();
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-md bg-[#181825] border-2 border-[#45475a] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11111b] px-6 py-5 border-b border-[#313244] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#89b4fa]/20 border border-[#89b4fa]/40 flex items-center justify-center text-[#89b4fa] shadow-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#cdd6f4] tracking-tight">
                {t.settingsTitle}
              </h3>
              <p className="text-xs text-[#a6adc8]">
                {t.soundSettings}
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

        {/* Settings Body */}
        <div className="p-6 space-y-5">
          {/* Mute All Toggle */}
          <div className="p-4 rounded-2xl bg-[#1e1e2e] border border-[#313244] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${isMuted ? 'bg-[#f38ba8]/20 border-[#f38ba8]/40 text-[#f38ba8]' : 'bg-[#a6e3a1]/20 border-[#a6e3a1]/40 text-[#a6e3a1]'}`}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-sm font-bold text-[#cdd6f4] block">
                  {t.muteToggleLabel}
                </span>
                <span className="text-xs text-[#6c7086]">
                  {isMuted ? (lang === 'tr' ? 'Sesler kapalı' : 'Muted') : (lang === 'tr' ? 'Sesler açık' : 'Unmuted')}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleMute}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isMuted
                  ? 'bg-[#f38ba8] text-[#11111b] hover:bg-[#f38ba8]/90 shadow-md'
                  : 'bg-[#313244] text-[#cdd6f4] hover:bg-[#45475a]'
              }`}
            >
              {isMuted ? t.unmute : t.mute}
            </button>
          </div>

          {/* Music Volume Slider */}
          <div className="p-4 rounded-2xl bg-[#1e1e2e] border border-[#313244] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#cdd6f4]">
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#89b4fa]" />
                <span>{t.bgmVolumeLabel}</span>
              </span>
              <span className="text-[#89b4fa] font-mono">{bgmVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bgmVol}
              onChange={(e) => handleBgmChange(Number(e.target.value))}
              className="w-full accent-[#89b4fa] bg-[#313244] rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* SFX Volume Slider */}
          <div className="p-4 rounded-2xl bg-[#1e1e2e] border border-[#313244] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#cdd6f4]">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#f9e2af]" />
                <span>{t.sfxVolumeLabel}</span>
              </span>
              <span className="text-[#f9e2af] font-mono">{sfxVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVol}
              onChange={(e) => handleSfxChange(Number(e.target.value))}
              className="w-full accent-[#f9e2af] bg-[#313244] rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Language Selector */}
          <div className="p-4 rounded-2xl bg-[#1e1e2e] border border-[#313244] space-y-2.5">
            <span className="text-xs font-bold text-[#cdd6f4] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#cba6f7]" />
              <span>{t.languageSelectLabel}</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onLanguageChange('tr')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  lang === 'tr'
                    ? 'bg-[#cba6f7]/20 border-[#cba6f7] text-[#cba6f7]'
                    : 'bg-[#181825] border-[#313244] text-[#a6adc8] hover:border-[#45475a]'
                }`}
              >
                <span>🇹🇷</span>
                <span>Türkçe</span>
                {lang === 'tr' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#cba6f7]/20 border-[#cba6f7] text-[#cba6f7]'
                    : 'bg-[#181825] border-[#313244] text-[#a6adc8] hover:border-[#45475a]'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
                {lang === 'en' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Reset Option & Close */}
        <div className="px-6 py-4 bg-[#11111b]/80 border-t border-[#313244] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onResetGame();
            }}
            className="flex items-center gap-1.5 text-xs text-[#f38ba8] hover:text-[#f38ba8]/80 font-semibold px-2 py-1 rounded-lg hover:bg-[#f38ba8]/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.reset}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#89b4fa] hover:bg-[#89b4fa]/90 text-[#11111b] text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            {t.closeBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
