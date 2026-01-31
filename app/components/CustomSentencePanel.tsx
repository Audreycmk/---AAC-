'use client';

import Icon from './Icon';

interface CustomSentencePanelProps {
  showCustomPanel: boolean;
  setShowCustomPanel: (show: boolean) => void;
  customText: string;
  setCustomText: (text: string) => void;
  customEnglish: string;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  currentStarter: string;
  setCurrentStarter: (starter: string) => void;
  visibleStarters: Array<{ text: string; en: string; icon: string }>;
  SUGGESTED_WORDS: Record<string, Array<{ text: string; en: string; icon: string }>>;
  hasFullAccess: () => boolean;
  isBasicStarter: (text: string) => boolean;
  handleStarterClick: (text: string) => void;
  handleSuggestionClick: (word: { text: string; en: string; icon: string }) => void;
  handleCustomSpeak: (englishOverride?: string) => void;
  isLoading: boolean;
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

export default function CustomSentencePanel({
  showCustomPanel,
  setShowCustomPanel,
  customText,
  setCustomText,
  customEnglish,
  showSuggestions,
  setShowSuggestions,
  currentStarter,
  setCurrentStarter,
  visibleStarters,
  SUGGESTED_WORDS,
  hasFullAccess,
  isBasicStarter,
  handleStarterClick,
  handleSuggestionClick,
  handleCustomSpeak,
  isLoading,
}: CustomSentencePanelProps) {
  if (!showCustomPanel) {
    return (
      <button
        onClick={() => setShowCustomPanel(true)}
        className="w-full mt-6 mb-6 px-6 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3"
        aria-label="自訂句子 Custom Sentence"
      >
        <Icon emoji="📝" size={40} />
        <BilingualText zh="自訂句子" en="Custom Sentence" className="items-center text-center" enClassName="text-lg" />
      </button>
    );
  }

  return (
    <div className="mb-6 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#f97316]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <Icon emoji="📝" size={40} />
          <BilingualText zh="自訂句子" en="Custom Sentence" enClassName="text-lg" />
        </h3>
        <button
          onClick={() => {
            setShowCustomPanel(false);
            setShowSuggestions(false);
            setCurrentStarter('');
          }}
          className="text-[#1e3a5f] hover:text-[#f97316] text-2xl font-bold"
          aria-label="關閉 Close"
        >
          ✕
        </button>
      </div>

      {/* 句子啟動按鈕 */}
      <div className="mb-4 p-4 bg-[#f5f5dc] rounded-2xl border-3 border-[#1e3a5f] max-h-[300px] sm:max-h-[320px] md:max-h-[315px] lg:max-h-[400px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {visibleStarters.map((starter) => {
            const isBasic = isBasicStarter(starter.text);
            const isDisabled = !hasFullAccess() && !isBasic;

            return (
              <button
                key={starter.text}
                onClick={() => {
                  if (isDisabled) {
                    alert('請登入以使用此功能\nPlease log in to use this function');
                  } else {
                    handleStarterClick(starter.text);
                  }
                }}
                className={`px-4 py-4 rounded-2xl font-bold text-base border-3 transition-all duration-300 min-h-[80px] flex flex-col items-center justify-center gap-2 ${
                  isDisabled
                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                    : currentStarter === starter.text
                    ? 'bg-[#f97316] text-white border-[#f97316] shadow-lg scale-[1.02]'
                    : 'bg-white text-[#1e3a5f] border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-[1.02]'
                }`}
              >
                <Icon emoji={starter.icon} size={32} />
                <BilingualText
                  zh={starter.text}
                  en={starter.en}
                  className="items-center text-center"
                  enClassName="text-sm"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 建議詞語面板 */}
      {showSuggestions && currentStarter && SUGGESTED_WORDS[currentStarter] && (
        <div className="mb-4 p-4 bg-[#f5f5dc] rounded-2xl border-3 border-[#1e3a5f] animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
              <Icon emoji="💡" size={32} />
              <BilingualText zh="建議詞語" en="Suggestions" enClassName="text-lg" />
            </h4>
            <button
              onClick={() => {
                setShowSuggestions(false);
                setCurrentStarter('');
              }}
              className="text-[#1e3a5f] hover:text-[#f97316] text-2xl font-bold"
              aria-label="關閉建議 Close suggestions"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {SUGGESTED_WORDS[currentStarter].map((word, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(word)}
                className="px-4 py-4 bg-white text-[#1e3a5f] rounded-xl font-bold text-lg border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-110 transition-all duration-300 shadow-md flex flex-col items-center gap-2"
              >
                <Icon emoji={word.icon} size={32} />
                <BilingualText
                  zh={word.text}
                  en={word.en}
                  className="items-center text-center"
                  enClassName="text-base"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 輸入框和播放按鈕 */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex-1 min-w-[280px] relative border-4 border-[#1e3a5f] rounded-2xl bg-[#f5f5dc] min-h-[80px] focus-within:border-[#f97316] transition-all duration-300">
          <div className="absolute inset-0 px-6 py-4 pointer-events-none flex flex-col justify-center">
            {customText ? (
              <>
                <span className="text-2xl font-bold text-[#1e3a5f]">{customText}</span>
                {customEnglish && (
                  <span className="text-xl sm:text-2xl font-semibold text-[#1e3a5f] opacity-85">
                    {customEnglish}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-[#1e3a5f] opacity-50">輸入要說的話...</span>
                <span className="text-xl sm:text-2xl font-semibold text-[#1e3a5f] opacity-40">Type your message...</span>
              </>
            )}
          </div>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomSpeak(customEnglish)}
            aria-label="輸入要說的話 / Type your message"
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-[#1e3a5f] px-6 py-5 text-2xl font-bold rounded-2xl focus:outline-none"
          />
        </div>
        <button
          onClick={() => handleCustomSpeak(customEnglish)}
          disabled={!customText.trim() || isLoading}
          className="px-8 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-110 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 min-h-[70px] min-w-[120px] flex items-center justify-center gap-2"
        >
          <Icon emoji="🔊" size={40} />
          <BilingualText zh="播放" en="Play" className="items-center" enClassName="text-lg" />
        </button>
      </div>
    </div>
  );
}
