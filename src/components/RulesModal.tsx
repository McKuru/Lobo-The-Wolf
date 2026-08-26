import React from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, Layers, CheckCircle, RefreshCw, Flag } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
                Lobo Solitaire Oyun Kuralları
              </h2>
              <p className="text-xs text-[#a6adc8]">Strateji ve Hamle Rehberi</p>
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
              <Layers className="w-4 h-4" /> Oyunun Amacı & Deste Yapısı
            </h3>
            <p className="text-[#a6adc8] leading-relaxed">
              Lobo, 5 farklı renkte (Gül, Şeftali, Güneş, Zümrüt, Safir) 1'den 10'a kadar numaralandırılmış toplam <strong>50 karttan</strong> oluşur.
              Başlangıçta Kurt'un 4 açık kartı, Oyuncu'nun 4 açık kartı vardır ve çekme destesinin <strong>en üstteki kartı daima açık görünür</strong>.
            </p>
            <div className="p-3 bg-[#11111b] border border-[#45475a]/50 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#f38ba8] font-bold">
                <span>🐺 Kurt Hamle Mekaniği:</span>
              </div>
              <p className="text-[#cdd6f4]">
                <strong>Kurt asla kendiliğinden hamle yapmaz;</strong> yalnızca sizin yaptığınız hamle türlerine ve aradaki farklara göre desteden kart çeker.
              </p>
              <div className="pt-1.5 border-t border-[#313244] flex items-center gap-2 text-[#89b4fa]">
                <span className="font-bold">🎯 Hamle Seçim Formülü:</span>
              </div>
              <p className="text-[#a6adc8] font-mono text-[11px]">
                Eşleştirme (1=1) • Toplama (2+=1) • Bölme (1=2+) • Üst (1&gt;1)
              </p>
            </div>
            <p className="text-[#a6adc8] leading-relaxed">
              Hedef: <strong>Kurt'un elini tamamen boşaltmak</strong> ve turlar boyunca toplam <strong>100 puana</strong> ilk ulaşan taraf olmaktır.
            </p>
          </div>

          {/* 4 Move Types */}
          <div>
            <h3 className="font-bold text-[#f9e2af] text-sm mb-3">4 Temel Hamle Türü:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Eşleştirme */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#89b4fa]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#89b4fa]/20 text-[#89b4fa] font-bold text-xs">
                    1. Eşleştirme (Match)
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs">
                  Oyuncunun <strong>1 kartı</strong> ile Kurt'un <strong>aynı değerdeki 1 kartı</strong> eşleşir (örn. 5 = 5).
                </p>
                <div className="mt-2 text-[11px] font-mono text-[#a6e3a1] bg-[#11111b] p-2 rounded">
                  Sonuç: Kartlar silinir. <strong>Oyuncu 1 kart çeker</strong>.
                </div>
              </div>

              {/* 2. Toplama */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#a6e3a1]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#a6e3a1]/20 text-[#a6e3a1] font-bold text-xs">
                    2. Toplama (Sum)
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs">
                  Oyuncunun <strong>birden fazla kartının toplamı</strong>, Kurt'un 1 kartına eşit olur (örn. 2 + 5 = 7).
                </p>
                <div className="mt-2 text-[11px] font-mono text-[#a6e3a1] bg-[#11111b] p-2 rounded">
                  Sonuç: Kartlar silinir. <strong>Oyuncu 1 kart çeker</strong>.
                </div>
              </div>

              {/* 3. Bölme */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#cba6f7]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#cba6f7]/20 text-[#cba6f7] font-bold text-xs">
                    3. Bölme (Split)
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs">
                  Oyuncunun <strong>1 kartı</strong>, Kurt'un toplamı bu karta eşit olan <strong>birden fazla kartını</strong> alır (örn. 8 = 3 + 5).
                </p>
                <div className="mt-2 text-[11px] font-mono text-[#f9e2af] bg-[#11111b] p-2 rounded">
                  Sonuç: Kartlar silinir. <strong>Kurt 1 kart çeker</strong>.
                </div>
              </div>

              {/* 4. Üst */}
              <div className="p-3.5 rounded-xl bg-[#1e1e2e]/80 border border-[#fab387]/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#fab387]/20 text-[#fab387] font-bold text-xs">
                    4. Üst (Higher)
                  </span>
                </div>
                <p className="text-[#a6adc8] text-xs">
                  Oyuncunun <strong>1 kartı</strong>, Kurt'un <strong>daha küçük değerli 1 kartını</strong> alır (örn. 9 &gt; 4).
                </p>
                <div className="mt-2 text-[11px] font-mono text-[#f38ba8] bg-[#11111b] p-2 rounded">
                  Sonuç: Kartlar silinir. Kurt aradaki <strong>fark kadar ({'9 - 4 = 5'})</strong> desteden kart çeker!
                </div>
              </div>
            </div>
          </div>

          {/* Scoring & Surrender */}
          <div className="bg-[#1e1e2e] p-4 rounded-xl border border-[#313244] space-y-2">
            <h3 className="font-bold text-[#f38ba8] text-sm flex items-center gap-1.5">
              <Flag className="w-4 h-4" /> Tur Sonu ve Puanlama
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#a6adc8]">
              <li>
                <strong className="text-[#a6e3a1]">Kurt'un eli boşalırsa:</strong> Turu oyuncu kazanır. Oyuncu <em>elinde kalan kartların değerlerinin toplamını</em> puan olarak hanesine yazar.
              </li>
              <li>
                <strong className="text-[#f38ba8]">Oyuncu çekilirse (Merkez butona basılı tutarak):</strong> Turu Kurt kazanır. Kurt <em>elinde kalan kartların değerlerinin toplamını</em> puan olarak hanesine yazar.
              </li>
              <li>
                <strong className="text-[#f9e2af]">Hedef:</strong> Toplam 100 puana ilk ulaşan taraf oyunun şampiyonu olur!
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
            Anladım, Oyuna Dön
          </button>
        </div>
      </motion.div>
    </div>
  );
};
