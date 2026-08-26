import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoveLogItem } from '../types';
import { X, History, Layers } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface MoveLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: MoveLogItem[];
  lang?: Language;
}

export const MoveLogDrawer: React.FC<MoveLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  lang = 'tr',
}) => {
  const t = translations[lang];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#11111b]/50 backdrop-blur-xs">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-sm h-full bg-[#181825] border-l border-[#313244] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#313244] flex items-center justify-between bg-[#1e1e2e]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#89b4fa]" />
                <h3 className="font-bold text-[#cdd6f4] text-sm">{t.historyTitle}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg border border-[#45475a] flex items-center justify-center text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-[#6c7086] text-xs">
                  <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  {t.noMovesYet}
                </div>
              ) : (
                logs.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#89b4fa]">
                        {lang === 'tr' ? 'Hamle' : 'Move'} #{logs.length - index} ({item.type.toUpperCase()})
                      </span>
                      <span className="text-[10px] text-[#6c7086]">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[#cdd6f4]">{item.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#a6adc8] pt-1 border-t border-[#313244]/60">
                      <span>
                        {lang === 'tr' ? 'Çekilen:' : 'Drawn:'} {item.cardsDrawn}{' '}
                        {t.cardCount} (
                        {item.drawer === 'player' ? t.youLabel : t.wolfLabel})
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
