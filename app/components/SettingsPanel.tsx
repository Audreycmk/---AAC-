'use client';

import Icon from './Icon';

interface SettingsPanelProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  speechLanguage: 'zh-HK' | 'en-US';
  setSpeechLanguage: (lang: 'zh-HK' | 'en-US') => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  hasFullAccess: () => boolean;
  playVoiceDemo: (voiceName: string) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechVolume: number;
  setSpeechVolume: (volume: number) => void;
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

export default function SettingsPanel({
  showSettings,
  setShowSettings,
  speechLanguage,
  setSpeechLanguage,
  availableVoices,
  selectedVoice,
  setSelectedVoice,
  hasFullAccess,
  playVoiceDemo,
  speechRate,
  setSpeechRate,
  speechVolume,
  setSpeechVolume,
}: SettingsPanelProps) {
  if (!showSettings) return null;

  return (
    <div
      className="fixed top-20 left-0 right-0 z-40 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#1e3a5f] animate-fadeIn mx-4 sm:mx-6 lg:mx-8"
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <Icon emoji="⚙" size={40} />
          語音設定
        </h3>
        <button
          onClick={() => setShowSettings(false)}
          className="text-[#1e3a5f] hover:text-[#f97316] text-2xl font-bold transition-all duration-300"
          aria-label="關閉 Close"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSpeechLanguage('zh-HK')}
            className={`px-6 py-4 rounded-2xl font-bold text-xl border-3 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
              speechLanguage === 'zh-HK'
                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-lg'
                : 'bg-[#f5f5dc] text-[#1e3a5f] border-[#1e3a5f] hover:bg-[#f97316] hover:text-white'
            }`}
            aria-label="廣東話 Cantonese"
          >
            🇭🇰 廣東話
          </button>
          <button
            onClick={() => setSpeechLanguage('en-US')}
            className={`px-6 py-4 rounded-2xl font-bold text-xl border-3 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
              speechLanguage === 'en-US'
                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-lg'
                : 'bg-[#f5f5dc] text-[#1e3a5f] border-[#1e3a5f] hover:bg-[#f97316] hover:text-white'
            }`}
            aria-label="English"
          >
            🇬🇧 English
          </button>
        </div>

        {/* Voice Selection - Show for all users, grey out for guests */}
        {availableVoices.length > 0 && (
          <div className="space-y-3">
            <label
              className={`block text-xl font-bold ${hasFullAccess() ? 'text-[#1e3a5f]' : 'text-gray-400 cursor-pointer'}`}
              onClick={() => {
                if (!hasFullAccess()) {
                  alert('請登入以使用此功能\nPlease log in to use this function');
                }
              }}
            >
              選擇語音 / Select Voice
            </label>
            <div
              className="flex flex-col sm:flex-row gap-3"
              onClick={(e) => {
                if (!hasFullAccess() && (e.target as HTMLElement).tagName !== 'SELECT') {
                  alert('請登入以使用此功能\nPlease log in to use this function');
                }
              }}
            >
              <select
                value={hasFullAccess() ? selectedVoice : ''}
                onChange={(e) => {
                  if (hasFullAccess()) {
                    setSelectedVoice(e.target.value);
                  } else {
                    alert('請登入以使用此功能\nPlease log in to use this function');
                  }
                }}
                onClick={(e) => {
                  if (!hasFullAccess()) {
                    e.preventDefault();
                    alert('請登入以使用此功能\nPlease log in to use this function');
                  }
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-lg border-2 focus:outline-none ${
                  hasFullAccess()
                    ? 'bg-[#f5f5dc] text-[#1e3a5f] border-[#1e3a5f] focus:border-[#f97316] cursor-pointer'
                    : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                }`}
                disabled={!hasFullAccess()}
              >
                <option value="">預設語音 / Default Voice</option>
                {availableVoices
                  .filter((v) => {
                    const langCode = speechLanguage === 'zh-HK' ? 'zh' : 'en';
                    return v.lang.toLowerCase().includes(langCode);
                  })
                  .map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
              </select>
              <button
                onClick={() => {
                  if (!hasFullAccess()) {
                    alert('請登入以使用此功能\nPlease log in to use this function');
                    return;
                  }
                  if (selectedVoice) {
                    playVoiceDemo(selectedVoice);
                  } else {
                    const defaultVoice = availableVoices.find((v) => {
                      const langCode = speechLanguage === 'zh-HK' ? 'zh' : 'en';
                      return v.lang.toLowerCase().includes(langCode);
                    });
                    if (defaultVoice) {
                      playVoiceDemo(defaultVoice.name);
                    }
                  }
                }}
                className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px] ${
                  hasFullAccess()
                    ? 'bg-[#f97316] text-white hover:bg-[#ea580c]'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                🔊 試聽 / Demo
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xl font-bold text-[#1e3a5f] mb-2">語速: {speechRate.toFixed(1)}x</label>
          <input
            type="range"
            min="0.1"
            max="1.2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full h-4 bg-[#f5f5dc] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
          />
        </div>
        <div>
          <label className="block text-xl font-bold text-[#1e3a5f] mb-2">音量: {Math.round(speechVolume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={speechVolume}
            onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
            className="w-full h-4 bg-[#f5f5dc] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
          />
        </div>
      </div>
    </div>
  );
}
