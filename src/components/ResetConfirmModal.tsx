import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="reset-confirm-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-md bg-[#181825] border-2 border-[#45475a] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11111b] px-6 py-4 border-b border-[#313244] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f38ba8]/20 border border-[#f38ba8]/40 flex items-center justify-center text-[#f38ba8]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#cdd6f4]">
              Oyunu Yeniden Başlat?
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Message */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-[#a6adc8] leading-relaxed">
            Mevcut turunuz, puan tablonuz ve eldeki tüm hamle geçmişiniz sıfırlanacak.
          </p>
          <div className="p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] text-xs text-[#f9e2af] flex items-start gap-2">
            <RotateCcw className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Yeni bir deste dağıtılarak 1. Turdan baştan başlanacaktır.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-[#11111b]/80 border-t border-[#313244] flex items-center justify-end gap-3">
          <button
            id="reset-cancel-button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            id="reset-confirm-button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#f38ba8] hover:bg-[#f38ba8]/90 text-[#11111b] text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Evet, Sıfırla</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
