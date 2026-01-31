'use client';

import Icon from './Icon';

interface HistoryPanelProps {
  showHistory: boolean;
  history: string[];
  speak: (text: string) => void;
}

export default function HistoryPanel({ showHistory, history, speak }: HistoryPanelProps) {
  if (!showHistory || history.length === 0) return null;

  return (
    <div className="mb-6 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#1e3a5f] animate-fadeIn">
      <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
        <Icon emoji="⭐️" size={40} />
        歷史記錄
      </h3>
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
