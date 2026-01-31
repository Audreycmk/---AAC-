'use client';

import Icon from './Icon';

interface HistoryPanelProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  history: string[];
  speak: (text: string) => void;
}

export default function HistoryPanel({ showHistory, setShowHistory, history, speak }: HistoryPanelProps) {
  if (!showHistory || history.length === 0) return null;

  return (
    <div
      className="fixed top-20 left-0 right-0 z-40 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#1e3a5f] animate-fadeIn mx-4 sm:mx-6 lg:mx-8 mt-6"
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <Icon emoji="⭐️" size={40} />
          歷史記錄
        </h3>
        <button
          onClick={() => setShowHistory(false)}
          className="text-[#1e3a5f] hover:text-[#f97316] text-2xl font-bold transition-all duration-300"
          aria-label="關閉 Close"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => speak(item)}
            className="px-6 py-4 bg-[#f5f5dc] text-[#1e3a5f] rounded-xl font-bold text-xl border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105 transition-all duration-300 min-h-[60px]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
