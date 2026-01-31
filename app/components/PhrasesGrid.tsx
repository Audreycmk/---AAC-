'use client';

import Icon from './Icon';

interface Phrase {
  id: number;
  text: string;
  en: string;
  category: string;
  icon: string;
}

interface PhrasesGridProps {
  filteredPhrases: Phrase[];
  speak: (text: string) => void;
  isLoading: boolean;
  user: { email?: string; loginCode?: string; role: 'admin' | 'user' } | null;
  CATEGORY_LABELS: Record<string, string>;
}

const BilingualText = ({
  zh,
  en,
  className = '',
  enClassName = '',
}: {
  zh: string;
  en: string;
  className?: string;
  enClassName?: string;
}) => (
  <span className={`flex flex-col leading-tight ${className}`}>
    <span>{zh}</span>
    <span className={`text-sm sm:text-base opacity-80 ${enClassName}`}>{en}</span>
  </span>
);

export default function PhrasesGrid({
  filteredPhrases,
  speak,
  isLoading,
  user,
  CATEGORY_LABELS,
}: PhrasesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredPhrases.map((phrase, index) => (
        <button
          key={phrase.id}
          onClick={() => speak(phrase.text)}
          disabled={isLoading}
          className={`
            p-10
            text-3xl
            font-bold
            rounded-3xl
            shadow-2xl
            transition-all duration-300
            flex flex-col items-center justify-center gap-5
            transform
            min-h-[180px]
            ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed scale-95'
                : 'bg-white hover:bg-[#f97316] hover:text-white hover:scale-110 hover:shadow-[0_20px_50px_rgba(249,115,22,0.5)] hover:-translate-y-3 active:scale-95'
            }
            text-[#1e3a5f]
            border-4 border-[#1e3a5f]
            hover:border-[#f97316]
            animate-fadeIn
            group
          `}
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both',
          }}
        >
          <div className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-active:scale-90 flex items-center justify-center">
            {/* Custom icon for specific users */}
            {user?.loginCode === 'btc2026' && phrase.id === 35 ? (
              <img src="/Wallet.png" alt={phrase.text} className="max-w-[90%] max-h-[120px] object-contain" />
            ) : phrase.icon && typeof phrase.icon === 'string' && phrase.icon.startsWith('data:image') ? (
              <img src={phrase.icon} alt={phrase.text} className="max-w-[90%] max-h-[120px] object-contain" />
            ) : (
              <Icon emoji={phrase.icon || '📝'} size={96} />
            )}
          </div>
          <div className="text-center transition-all duration-300 group-hover:scale-110">
            <BilingualText
              zh={phrase.text}
              en={phrase.en}
              className="items-center"
              enClassName="text-lg sm:text-xl"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
