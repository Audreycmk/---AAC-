'use client';

import { useState, useEffect } from 'react';
import Icon from './Icon';

// 常用廣東話短語（附圖示）- 按新分類重組
const PHRASES = [
  // 日常
  { id: 1, text: '你好', category: '日常', icon: '👋' },
  { id: 2, text: '多謝', category: '日常', icon: '🙏' },
  { id: 3, text: '唔該', category: '日常', icon: '🙏' },
  { id: 4, text: '對唔住', category: '日常', icon: '😔' },
  { id: 5, text: '再見', category: '日常', icon: '👋' },
  { id: 6, text: '好', category: '日常', icon: '👍' },
  { id: 7, text: '唔好', category: '日常', icon: '👎' },
  { id: 8, text: '係', category: '日常', icon: '✅' },
  { id: 9, text: '唔係', category: '日常', icon: '❌' },
  { id: 10, text: '明白', category: '日常', icon: '💡' },
  { id: 11, text: '唔明白', category: '日常', icon: '❓' },
  
  // 飲食
  { id: 12, text: '我想飲水', category: '飲食', icon: '💧' },
  { id: 13, text: '我肚餓', category: '飲食', icon: '🍚' },
  { id: 14, text: '我想食飯', category: '飲食', icon: '🍱' },
  { id: 15, text: '我想飲奶', category: '飲食', icon: '🥛' },
  { id: 16, text: '蘋果', category: '飲食', icon: '🍎' },
  { id: 17, text: '橙', category: '飲食', icon: '🍊' },
  { id: 18, text: '香蕉', category: '飲食', icon: '🍌' },
  
  // 醫療
  { id: 19, text: '我唔舒服', category: '醫療', icon: '🤒' },
  { id: 20, text: '我頭痛', category: '醫療', icon: '🤕' },
  { id: 21, text: '我想睇醫生', category: '醫療', icon: '👨‍⚕️' },
  { id: 22, text: '我要食藥', category: '醫療', icon: '💊' },
  { id: 23, text: '我想量體溫', category: '醫療', icon: '🌡️' },
  { id: 24, text: '我想去廁所', category: '醫療', icon: '🚻' },
  
  // 情緒
  { id: 25, text: '我好開心', category: '情緒', icon: '😊' },
  { id: 26, text: '我好傷心', category: '情緒', icon: '😢' },
  { id: 27, text: '我好攰', category: '情緒', icon: '😴' },
  { id: 28, text: '我好擔心', category: '情緒', icon: '😰' },
  { id: 29, text: '我好熱', category: '情緒', icon: '🥵' },
  { id: 30, text: '我好凍', category: '情緒', icon: '🥶' },
  
  // 求助
  { id: 31, text: '幫幫我', category: '求助', icon: '🆘' },
  { id: 32, text: '我想休息', category: '求助', icon: '🛏️' },
  { id: 33, text: '我需要幫忙', category: '求助', icon: '🙋' },
  { id: 34, text: '請等等', category: '求助', icon: '⏰' },
];

// 分類圖示映射（新配色主題）
const CATEGORY_ICONS: Record<string, string> = {
  '全部': '📋',
  '日常': '🏠',
  '飲食': '🍔',
  '醫療': '🏥',
  '情緒': '😊',
  '求助': '🆘',
};

// 句子啟動器和建議詞語
const SENTENCE_STARTERS = [
  { text: '我想', icon: '💭' },
  { text: '可唔可以', icon: '🙏' },
  { text: '幫我', icon: '🤝' },
  { text: '我要', icon: '✋' },
];

const SUGGESTED_WORDS: Record<string, Array<{text: string, icon: string}>> = {
  '我想': [
    { text: '飲水', icon: '💧' },
    { text: '食飯', icon: '🍚' },
    { text: '休息', icon: '🛏️' },
    { text: '去廁所', icon: '🚻' },
    { text: '睇醫生', icon: '👨‍⚕️' },
    { text: '食藥', icon: '💊' },
    { text: '訓覺', icon: '😴' },
    { text: '出去', icon: '🚶' },
    { text: '打電話', icon: '📞' },
    { text: '睇電視', icon: '📺' }
  ],
  '可唔可以': [
    { text: '幫我', icon: '🤝' },
    { text: '開燈', icon: '💡' },
    { text: '閉燈', icon: '🌙' },
    { text: '開窗', icon: '🪟' },
    { text: '閉窗', icon: '🪟' },
    { text: '開門', icon: '🚪' },
    { text: '俾我', icon: '🤲' },
    { text: '拎俾我', icon: '🤲' },
    { text: '等我', icon: '⏰' },
    { text: '陪我', icon: '👥' }
  ],
  '幫我': [
    { text: '拎嘢', icon: '📦' },
    { text: '開門', icon: '🚪' },
    { text: '閉門', icon: '🚪' },
    { text: '打電話', icon: '📞' },
    { text: '叫人', icon: '📢' },
    { text: '攞藥', icon: '💊' },
    { text: '倒水', icon: '💧' },
    { text: '拎紙巾', icon: '🧻' },
    { text: '開電視', icon: '📺' },
    { text: '調位', icon: '🔄' }
  ],
  '我要': [
    { text: '飲水', icon: '💧' },
    { text: '食嘢', icon: '🍔' },
    { text: '去廁所', icon: '🚻' },
    { text: '休息', icon: '🛏️' },
    { text: '睇醫生', icon: '👨‍⚕️' },
    { text: '食藥', icon: '💊' },
    { text: '換衫', icon: '👕' },
    { text: '沖涼', icon: '🚿' },
    { text: '睇報紙', icon: '📰' },
    { text: '聽收音機', icon: '📻' }
  ],
};

export default function AACApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [menuOpen, setMenuOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [history, setHistory] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStarter, setCurrentStarter] = useState('');

  useEffect(() => {
    // 檢查瀏覽器是否支援 Web Speech API
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
    
    // 載入語音列表（某些瀏覽器需要這個步驟）
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // 觸發語音列表載入
      window.speechSynthesis.getVoices();
      
      // 監聽語音列表變化
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        console.log('Cantonese voices:', voices.filter(v => v.lang.includes('zh-HK')));
      };
    }
    
    // 從 localStorage 載入歷史記錄
    const savedHistory = localStorage.getItem('aac-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const speak = (text: string) => {
    if (!speechSupported) {
      alert('您的瀏覽器不支援語音功能');
      return;
    }

    setIsLoading(true);

    // 停止任何正在播放的語音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 設置為廣東話
    utterance.lang = 'zh-HK';
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = speechVolume;

    // 嘗試選擇廣東話語音
    const voices = window.speechSynthesis.getVoices();
    const cantonese = voices.find(voice => voice.lang === 'zh-HK' || voice.lang === 'zh_HK');
    if (cantonese) {
      utterance.voice = cantonese;
      console.log('Using voice:', cantonese.name);
    } else {
      console.warn('No Cantonese voice found, using default');
    }

    utterance.onstart = () => {
      console.log('Speech started:', text);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsLoading(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsLoading(false);
      alert(`語音播放失敗: ${event.error}。請確保您使用 Chrome 或 Safari 瀏覽器。`);
    };

    try {
      window.speechSynthesis.speak(utterance);
      console.log('Speech synthesis started');
    } catch (error) {
      console.error('Failed to speak:', error);
      setIsLoading(false);
      alert('語音播放失敗，請重試');
    }
    
    // 添加到歷史記錄
    addToHistory(text);
  };
  
  const addToHistory = (text: string) => {
    const newHistory = [text, ...history.filter(h => h !== text)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('aac-history', JSON.stringify(newHistory));
  };
  
  const handleCustomSpeak = () => {
    if (customText.trim()) {
      speak(customText);
      setCustomText('');
      setShowSuggestions(false);
      setCurrentStarter('');
    }
  };
  
  const handleStarterClick = (starter: string) => {
    setCustomText(starter);
    setCurrentStarter(starter);
    setShowSuggestions(true);
  };
  
  const handleSuggestionClick = (word: {text: string, icon: string}) => {
    setCustomText(customText + word.text);
    setShowSuggestions(false);
  };

  const categories = ['全部', ...Array.from(new Set(PHRASES.map(p => p.category)))];
  const filteredPhrases = selectedCategory === '全部' 
    ? PHRASES 
    : PHRASES.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      {/* 頂部工具列 */}
      <div className="fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white shadow-lg z-50 px-4 py-3 flex items-center justify-between">
        {/* 漢堡選單按鈕 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 transform min-h-[60px] min-w-[60px] flex items-center justify-center"
          aria-label="選單"
        >
          <svg 
            className={`w-8 h-8 transition-transform duration-300 ${menuOpen ? 'rotate-90' : 'rotate-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-bold flex-1 text-center">Audrey Audrey Chung 輔助通訊</h1>
        
        <div className="flex gap-2">
          {/* 歷史記錄按鈕 */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="歷史記錄"
          >
            <Icon emoji="📜" size={32} />
          </button>
          
          {/* 設定按鈕 */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="設定"
          >
            <Icon emoji="⚙" size={32} />
          </button>
        </div>
      </div>

      {/* 側邊選單 */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-500 ease-out ${
          menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } w-80 pt-20`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <h2 className={`text-3xl font-bold text-[#1e3a5f] mb-6 transition-all duration-700 ${
            menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}>分類選單</h2>
          <nav className="space-y-3">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                  selectedCategory === category
                    ? 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                    : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105'
                } ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                style={{ 
                  transitionDelay: menuOpen ? `${index * 50}ms` : '0ms'
                }}
              >
                <Icon emoji={CATEGORY_ICONS[category] || '📁'} size={48} />
                <span>{category}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 遮罩層 */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-all duration-500 animate-fadeIn backdrop-blur-sm"
        />
      )}

      {/* 主要內容 */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* 語音設定面板 */}
          {showSettings && (
            <div className="mb-6 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#1e3a5f] animate-fadeIn">
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Icon emoji="⚙" size={40} />
                語音設定
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xl font-bold text-[#1e3a5f] mb-2">
                    語速: {speechRate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full h-4 bg-[#f5f5dc] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold text-[#1e3a5f] mb-2">
                    音量: {Math.round(speechVolume * 100)}%
                  </label>
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
          )}

          {/* 歷史記錄面板 */}
          {showHistory && history.length > 0 && (
            <div className="mb-6 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#1e3a5f] animate-fadeIn">
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Icon emoji="📜" size={40} />
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
          )}

          {/* 自訂輸入區 */}
          <div className="mb-6 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#f97316]">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <Icon emoji="📝" size={40} />
              自訂訊息
            </h3>
            
            {/* 句子啟動按鈕 */}
            <div className="mb-4 flex flex-wrap gap-3">
              {SENTENCE_STARTERS.map((starter) => (
                <button
                  key={starter.text}
                  onClick={() => handleStarterClick(starter.text)}
                  className={`px-6 py-4 rounded-2xl font-bold text-xl border-3 transition-all duration-300 min-h-[60px] flex items-center gap-2 ${
                    customText.startsWith(starter.text)
                      ? 'bg-[#f97316] text-white border-[#f97316] shadow-lg scale-105'
                      : 'bg-[#f5f5dc] text-[#1e3a5f] border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105'
                  }`}
                >
                  <Icon emoji={starter.icon} size={32} />
                  <span>{starter.text}</span>
                </button>
              ))}
            </div>
            
            {/* 建議詞語面板 */}
            {showSuggestions && currentStarter && SUGGESTED_WORDS[currentStarter] && (
              <div className="mb-4 p-4 bg-[#f5f5dc] rounded-2xl border-3 border-[#1e3a5f] animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Icon emoji="💡" size={32} />
                    建議詞語
                  </h4>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-[#1e3a5f] hover:text-[#f97316] text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {SUGGESTED_WORDS[currentStarter].map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(word)}
                      className="px-4 py-3 bg-white text-[#1e3a5f] rounded-xl font-bold text-lg border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-110 transition-all duration-300 shadow-md flex flex-col items-center gap-2"
                    >
                      <Icon emoji={word.icon} size={32} />
                      <span>{word.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 輸入框和播放按鈕 */}
            <div className="flex flex-wrap gap-3 justify-center">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomSpeak()}
                onFocus={() => setShowSuggestions(false)}
                placeholder="輸入要說的話..."
                className="flex-1 min-w-[280px] px-6 py-5 text-2xl font-bold border-4 border-[#1e3a5f] rounded-2xl focus:outline-none focus:border-[#f97316] transition-all duration-300 bg-[#f5f5dc] min-h-[70px]"
              />
              <button
                onClick={handleCustomSpeak}
                disabled={!customText.trim() || isLoading}
                className="px-8 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-110 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 min-h-[70px] min-w-[120px] flex items-center justify-center gap-2"
              >
                <Icon emoji="🔊" size={40} />
                <span>播放</span>
              </button>
            </div>
          </div>

          {/* 當前分類顯示 */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-4 px-10 py-5 bg-[#1e3a5f] text-white rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-110 transform border-4 border-[#f97316]">
              <Icon emoji={CATEGORY_ICONS[selectedCategory] || '📁'} size={64} className="transition-transform duration-300 hover:rotate-12 hover:scale-125" />
              <span className="text-3xl font-bold">{selectedCategory}</span>
            </div>
          </div>

          {/* 短語按鈕網格 */}
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
                  ${isLoading 
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
                  animationFillMode: 'both'
                }}
              >
                <Icon emoji={phrase.icon} size={96} className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-active:scale-90" />
                <div className="text-center transition-all duration-300 group-hover:scale-110">{phrase.text}</div>
              </button>
            ))}
          </div>

          {/* 使用說明 */}
          <div className="mt-12 p-8 bg-white rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(30,58,95,0.3)] hover:scale-105 transform border-4 border-[#1e3a5f]">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-3">
              <Icon emoji="📖" size={48} />
              使用說明
            </h2>
            <ul className="space-y-3 text-xl text-[#1e3a5f] font-semibold">
              <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
                <Icon emoji="🔹" size={32} />
                點擊左上角選單選擇分類
              </li>
              <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
                <Icon emoji="🔹" size={32} />
                點擊任何按鈕即可播放語音
              </li>
              <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
                <Icon emoji="🔹" size={32} />
                使用自訂輸入框輸入任何想說的話
              </li>
              <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
                <Icon emoji="🔹" size={32} />
                在設定中調整語速和音量
              </li>
              <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
                <Icon emoji="🔹" size={32} />
                查看歷史記錄快速重複使用
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
