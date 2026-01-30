'use client';

import { useState, useEffect } from 'react';
import Icon from './Icon';

// 常用廣東話短語（附圖示）- 按新分類重組
const PHRASES = [
  // 日常
  { id: 1, text: '你好', en: 'Hello', category: '日常', icon: '👋' },
  { id: 2, text: '多謝', en: 'Thank you', category: '日常', icon: '🙏' },
  { id: 3, text: '唔該', en: 'Please / Thanks', category: '日常', icon: '🙏' },
  { id: 4, text: '對唔住', en: 'Sorry', category: '日常', icon: '😔' },
  { id: 5, text: '再見', en: 'Goodbye', category: '日常', icon: '👋' },
  { id: 6, text: '好', en: 'Okay', category: '日常', icon: '👍' },
  { id: 7, text: '唔好', en: 'No', category: '日常', icon: '👎' },
  { id: 8, text: '係', en: 'Yes', category: '日常', icon: '✅' },
  { id: 9, text: '唔係', en: 'No', category: '日常', icon: '❌' },
  { id: 10, text: '明白', en: 'I understand', category: '日常', icon: '💡' },
  { id: 11, text: '唔明白', en: "I don't understand", category: '日常', icon: '❓' },
  
  // 飲食
  { id: 12, text: '我想飲水', en: 'I want water', category: '飲食', icon: '💧' },
  { id: 13, text: '我肚餓', en: "I'm hungry", category: '飲食', icon: '🍚' },
  { id: 14, text: '我想食飯', en: 'I want to eat', category: '飲食', icon: '🍱' },
  { id: 15, text: '我想飲奶', en: 'I want milk', category: '飲食', icon: '🥛' },
  { id: 16, text: '蘋果', en: 'Apple', category: '飲食', icon: '🍎' },
  { id: 17, text: '橙', en: 'Orange', category: '飲食', icon: '🍊' },
  { id: 18, text: '香蕉', en: 'Banana', category: '飲食', icon: '🍌' },
  
  // 醫療
  { id: 19, text: '我唔舒服', en: 'I feel unwell', category: '醫療', icon: '🤒' },
  { id: 20, text: '我頭痛', en: 'I have a headache', category: '醫療', icon: '🤕' },
  { id: 21, text: '我想睇醫生', en: 'I want to see a doctor', category: '醫療', icon: '👨‍⚕️' },
  { id: 22, text: '我要食藥', en: 'I need medicine', category: '醫療', icon: '💊' },
  { id: 23, text: '我想量體溫', en: 'I want to check my temperature', category: '醫療', icon: '🌡️' },
  { id: 24, text: '我想去廁所', en: 'I want to use the toilet', category: '醫療', icon: '🚻' },
  
  // 情緒
  { id: 25, text: '我好開心', en: "I'm happy", category: '情緒', icon: '😊' },
  { id: 26, text: '我好傷心', en: "I'm sad", category: '情緒', icon: '😢' },
  { id: 27, text: '我好攰', en: "I'm tired", category: '情緒', icon: '😴' },
  { id: 28, text: '我好擔心', en: "I'm worried", category: '情緒', icon: '😰' },
  { id: 29, text: '我好熱', en: "I'm hot", category: '情緒', icon: '🥵' },
  { id: 30, text: '我好凍', en: "I'm cold", category: '情緒', icon: '🥶' },
  
  // 求助
  { id: 31, text: '幫幫我', en: 'Help me', category: '求助', icon: '🆘' },
  { id: 32, text: '我想休息', en: 'I want to rest', category: '求助', icon: '🛏️' },
  { id: 33, text: '我需要幫忙', en: 'I need help', category: '求助', icon: '🙋' },
  { id: 34, text: '請等等', en: 'Please wait', category: '求助', icon: '⏰' },

  // 個人物品
  { id: 35, text: '銀包', en: 'Wallet', category: '個人物品', icon: '💳' },
  { id: 36, text: '手機', en: 'Mobile phone', category: '個人物品', icon: '📱' },
  { id: 37, text: '眼鏡', en: 'Glasses', category: '個人物品', icon: '👓' },
  { id: 38, text: '口罩', en: 'Mask', category: '個人物品', icon: '😷' },
  { id: 39, text: '鎖匙', en: 'Key', category: '個人物品', icon: '🔑' },
  { id: 40, text: '袋', en: 'Bag', category: '個人物品', icon: '👜' },
  { id: 41, text: '外套', en: 'Jacket', category: '個人物品', icon: '🧥' },
  { id: 42, text: '橡筋', en: 'Hair tie', category: '個人物品', icon: '💁' },

  // 家居用品
  { id: 43, text: '電視', en: 'Television', category: '家居用品', icon: '📺' },
  { id: 44, text: '門', en: 'Door', category: '家居用品', icon: '🚪' },
  { id: 45, text: '冷氣', en: 'Air conditioner', category: '家居用品', icon: '❄️' },
  { id: 46, text: '暖爐', en: 'Heater', category: '家居用品', icon: '🔥' },
  { id: 47, text: '窗', en: 'Window', category: '家居用品', icon: '🪟' },
  { id: 48, text: '燈', en: 'Light', category: '家居用品', icon: '💡' },
  { id: 49, text: '匙羹', en: 'Spoon', category: '家居用品', icon: '🥄' },
  { id: 50, text: '叉', en: 'Fork', category: '家居用品', icon: '🍴' },

  // 水果
  { id: 51, text: '提子', en: 'Grapes', category: '水果', icon: '🍇' },
  { id: 52, text: '香蕉', en: 'Banana', category: '水果', icon: '🍌' },
  { id: 53, text: '蘋果', en: 'Apple', category: '水果', icon: '🍎' },
  { id: 54, text: '橙', en: 'Orange', category: '水果', icon: '🍊' },
  { id: 55, text: '荔枝', en: 'Lychee', category: '水果', icon: '🍑' },
  { id: 56, text: '菠蘿', en: 'Pineapple', category: '水果', icon: '🍍' },
  { id: 57, text: '桃', en: 'Peach', category: '水果', icon: '🍑' },
  { id: 58, text: '榴槤', en: 'Durian', category: '水果', icon: '🟡' },

  // 地方
  { id: 59, text: '廁所', en: 'Toilet', category: '地方', icon: '🚻' },
  { id: 60, text: '睡房', en: 'Bedroom', category: '地方', icon: '🛏️' },
  { id: 61, text: '超市', en: 'Supermarket', category: '地方', icon: '🏬' },
  { id: 62, text: '李鄭屋中心', en: 'Lei Cheng Uk Center', category: '地方', icon: '🏢' },
  { id: 63, text: '醫院', en: 'Hospital', category: '地方', icon: '🏥' },
  { id: 64, text: '酒樓', en: 'Chinese restaurant', category: '地方', icon: '🍽️' },
  { id: 65, text: '公園', en: 'Park', category: '地方', icon: '🌳' },
  { id: 66, text: '茶餐廳', en: 'Cha Chaan Teng', category: '地方', icon: '☕' },
];

// 分類圖示映射（新配色主題）
const CATEGORY_ICONS: Record<string, string> = {
  '全部': '📋',
  '日常': '👋',
  '飲食': '🍔',
  '醫療': '🏥',
  '情緒': '😊',
  '求助': '🆘',
  '個人物品': '👜',
  '家居用品': '🏠',
  '水果': '🍎',
  '地方': '📍',
};

const CATEGORY_LABELS: Record<string, string> = {
  '全部': 'All',
  '日常': 'Daily',
  '飲食': 'Food & Drink',
  '醫療': 'Medical',
  '情緒': 'Emotions',
  '求助': 'Help',
  '個人物品': 'Personal Items',
  '家居用品': 'Home Items',
  '水果': 'Fruits',
  '地方': 'Places',
};

// 句子啟動器和建議詞語
const SENTENCE_STARTERS = [
  { text: '我想', en: 'I want to', icon: '💭' },
  { text: '可唔可以', en: 'Could you', icon: '🙏' },
  { text: '幫我', en: 'Help me', icon: '🤝' },
  { text: '我要', en: 'I need to', icon: '✋' },
];

const SUGGESTED_WORDS: Record<string, Array<{text: string, en: string, icon: string}>> = {
  '我想': [
    { text: '飲水', en: 'drink water', icon: '💧' },
    { text: '食飯', en: 'eat', icon: '🍚' },
    { text: '休息', en: 'rest', icon: '🛏️' },
    { text: '去廁所', en: 'go to the toilet', icon: '🚻' },
    { text: '睇醫生', en: 'see a doctor', icon: '👨‍⚕️' },
    { text: '食藥', en: 'take medicine', icon: '💊' },
    { text: '訓覺', en: 'sleep', icon: '😴' },
    { text: '出去', en: 'go out', icon: '🚶' },
    { text: '打電話', en: 'make a call', icon: '📞' },
    { text: '睇電視', en: 'watch TV', icon: '📺' }
  ],
  '可唔可以': [
    { text: '幫我', en: 'help me', icon: '🤝' },
    { text: '開燈', en: 'turn on the light', icon: '💡' },
    { text: '熄燈', en: 'turn off the light', icon: '🌙' },
    { text: '開窗', en: 'open the window', icon: '🪟' },
    { text: '閉窗', en: 'close the window', icon: '🪟' },
    { text: '開門', en: 'open the door', icon: '🚪' },
    { text: '俾我', en: 'give me', icon: '🤲' },
    { text: '拎俾我', en: 'hand it to me', icon: '🤲' },
    { text: '等我', en: 'wait for me', icon: '⏰' },
    { text: '陪我', en: 'stay with me', icon: '👥' }
  ],
  '幫我': [
    { text: '拎嘢', en: 'get it for me', icon: '📦' },
    { text: '開門', en: 'open the door', icon: '🚪' },
    { text: '閉門', en: 'close the door', icon: '🚪' },
    { text: '打電話', en: 'make a call', icon: '📞' },
    { text: '叫人', en: 'call someone', icon: '📢' },
    { text: '攞藥', en: 'get medicine', icon: '💊' },
    { text: '倒水', en: 'pour water', icon: '💧' },
    { text: '拎紙巾', en: 'get tissues', icon: '🧻' },
    { text: '開電視', en: 'turn on TV', icon: '📺' },
    { text: '調位', en: 'adjust position', icon: '🔄' }
  ],
  '我要': [
    { text: '飲水', en: 'drink water', icon: '💧' },
    { text: '食嘢', en: 'eat food', icon: '🍔' },
    { text: '去廁所', en: 'go to the toilet', icon: '🚻' },
    { text: '休息', en: 'rest', icon: '🛏️' },
    { text: '睇醫生', en: 'see a doctor', icon: '👨‍⚕️' },
    { text: '食藥', en: 'take medicine', icon: '💊' },
    { text: '換衫', en: 'change clothes', icon: '👕' },
    { text: '沖涼', en: 'take a shower', icon: '🚿' },
    { text: '睇報紙', en: 'read the newspaper', icon: '📰' },
    { text: '聽收音機', en: 'listen to the radio', icon: '📻' }
  ],
};

const PHRASE_TRANSLATIONS = PHRASES.reduce<Record<string, string>>((acc, phrase) => {
  acc[phrase.text] = phrase.en;
  return acc;
}, {});

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

export default function AACApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [menuOpen, setMenuOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [speechLanguage, setSpeechLanguage] = useState<'zh-HK' | 'en-US'>('zh-HK');
  const [history, setHistory] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStarter, setCurrentStarter] = useState('');
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['個人物品', '家居用品', '水果', '地方']);

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

  const resolveEnglishText = (text: string) => {
    if (PHRASE_TRANSLATIONS[text]) {
      return PHRASE_TRANSLATIONS[text];
    }
    const starterMatch = SENTENCE_STARTERS.find((starter) => text.startsWith(starter.text));
    if (!starterMatch) {
      return '';
    }
    const tail = text.slice(starterMatch.text.length);
    if (!tail) {
      return starterMatch.en;
    }
    const suggestion = SUGGESTED_WORDS[starterMatch.text]?.find((word) => word.text === tail);
    return suggestion ? `${starterMatch.en} ${suggestion.en}` : '';
  };

  const speak = (text: string) => {
    if (!speechSupported) {
      alert('您的瀏覽器不支援語音功能 / Your browser does not support speech');
      return;
    }

    setIsLoading(true);

    // 停止任何正在播放的語音
    window.speechSynthesis.cancel();

    const englishText = resolveEnglishText(text);
    const spokenText = speechLanguage === 'en-US' && englishText ? englishText : text;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    
    // 設置語言
    utterance.lang = speechLanguage;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = speechVolume;

    // 嘗試選擇對應語音
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = speechLanguage === 'zh-HK'
      ? voices.find(voice => voice.lang === 'zh-HK' || voice.lang === 'zh_HK')
      : voices.find(voice => voice.lang.startsWith('en') && /(female|woman|girl|samantha|victoria|zoe|serena|tessa|karen|moira|susan)/i.test(voice.name))
        || voices.find(voice => voice.lang.startsWith('en'));
    if (targetVoice) {
      utterance.voice = targetVoice;
      console.log('Using voice:', targetVoice.name);
    } else {
      console.warn('No matching voice found, using default');
    }

    utterance.onstart = () => {
      console.log('Speech started:', spokenText);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsLoading(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsLoading(false);
      alert(`語音播放失敗: ${event.error} / Speech failed: ${event.error}. 請確保您使用 Chrome 或 Safari 瀏覽器 / Please use Chrome or Safari.`);
    };

    try {
      window.speechSynthesis.speak(utterance);
      console.log('Speech synthesis started');
    } catch (error) {
      console.error('Failed to speak:', error);
      setIsLoading(false);
      alert('語音播放失敗，請重試 / Speech failed, please try again');
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
      setShowSuggestions(false);
      setCurrentStarter('');
    }
  };
  
  const handleStarterClick = (starter: string) => {
    setCustomText(starter);
    setCurrentStarter(starter);
    setShowSuggestions(true);
  };
  
  const handleSuggestionClick = (word: {text: string, en: string, icon: string}) => {
    setCustomText(customText + word.text);
    setShowSuggestions(false);
    setCurrentStarter('');
  };

  const toggleFavorite = (category: string) => {
    if (favorites.includes(category)) {
      setFavorites(favorites.filter(fav => fav !== category));
    } else {
      setFavorites([...favorites, category]);
    }
  };

  const categories = ['全部', ...Array.from(new Set(PHRASES.map(p => p.category)))];
  const filteredPhrases = selectedCategory === '全部' 
    ? PHRASES 
    : PHRASES.filter(p => p.category === selectedCategory);

  const visibleStarters = showSuggestions && currentStarter
    ? SENTENCE_STARTERS.filter((starter) => starter.text === currentStarter)
    : SENTENCE_STARTERS;

  const starterMatch = SENTENCE_STARTERS.find((starter) => customText.startsWith(starter.text));
  const starterTail = starterMatch ? customText.slice(starterMatch.text.length) : '';
  const suggestionMatch = starterMatch && starterTail
    ? SUGGESTED_WORDS[starterMatch.text]?.find((word) => word.text === starterTail)
    : undefined;
  const customEnglish =
    PHRASE_TRANSLATIONS[customText] ||
    (starterMatch && suggestionMatch ? `${starterMatch.en} ${suggestionMatch.en}` : '') ||
    (starterMatch && !starterTail ? starterMatch.en : '');

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      {/* 頂部工具列 */}
      <div className="fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white shadow-lg z-50 px-4 py-3 flex items-center justify-between">
        {/* 漢堡選單按鈕 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 transform min-h-[60px] min-w-[60px] flex items-center justify-center"
          aria-label="選單 Menu"
        >
          <span className="text-white text-3xl font-bold transition-all duration-500">
            {menuOpen ? '✕' : '≡'}
          </span>
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-bold flex-1 text-center">
          <BilingualText
            zh="Audrey Audrey Chung 輔助通訊"
            en=""
            className="items-center"
            enClassName="text-base sm:text-lg font-semibold"
          />
        </h1>
        
        <div className="flex gap-2">
          {/* 歷史記錄按鈕 */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="歷史記錄 History"
          >
            <Icon emoji="📜" size={32} />
          </button>
          
          {/* 設定按鈕 */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="設定 Settings"
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
          {/* 自訂句子按鈕（在菜單內） */}
          <button
            onClick={() => {
              setShowCustomPanel(!showCustomPanel);
              setMenuOpen(false);
            }}
            className={`w-full px-6 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3 mb-6 transform ${
              menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
            style={{ 
              transitionDelay: menuOpen ? '50ms' : '0ms'
            }}
            aria-label="自訂句子 Custom Sentence"
          >
            <Icon emoji="📝" size={40} />
            <BilingualText zh="自訂句子" en="Custom Sentence" className="items-center text-center" enClassName="text-lg" />
          </button>
          
          <h2 className={`text-3xl font-bold text-[#1e3a5f] mb-6 transition-all duration-700 ${
            menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}>
            <BilingualText zh="常用選單" en="Favorites" enClassName="text-lg sm:text-xl" />
          </h2>
          <nav className="space-y-3 mb-8">
            {favorites.map((category, index) => (
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
                <span className="flex-1">
                  <BilingualText
                    zh={category}
                    en={CATEGORY_LABELS[category]}
                    className="items-start"
                    enClassName="text-base sm:text-lg"
                  />
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(category);
                  }}
                  className="transition-all duration-300 hover:scale-125"
                  aria-label="移除最愛 Remove favorite"
                >
                  <Icon emoji="❤️" size={32} />
                </button>
              </button>
            ))}
          </nav>
          
          <h2 className={`text-3xl font-bold text-[#1e3a5f] mb-6 transition-all duration-700 ${
            menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}>
            <BilingualText zh="分類選單" en="Categories" enClassName="text-lg sm:text-xl" />
          </h2>
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
                <BilingualText
                  zh={category}
                  en={CATEGORY_LABELS[category]}
                  className="items-start"
                  enClassName="text-base sm:text-lg"
                />
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
            <div className="fixed top-20 left-0 right-0 z-40 p-6 bg-white rounded-2xl shadow-xl border-4 border-[#1e3a5f] animate-fadeIn mx-4 sm:mx-6 lg:mx-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
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
                    廣東話
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
                    English
                  </button>
                </div>
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

          {/* 自訂句子 */}
          {!showCustomPanel ? (
            <button
              onClick={() => setShowCustomPanel(true)}
              className="w-full mb-6 px-6 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3"
              aria-label="自訂句子 Custom Sentence"
            >
              <Icon emoji="📝" size={40} />
              <BilingualText zh="自訂句子" en="Custom Sentence" className="items-center text-center" enClassName="text-lg" />
            </button>
          ) : (
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
              <div className="mb-4 flex flex-col gap-3 items-center">
                {visibleStarters.map((starter) => (
                  <button
                    key={starter.text}
                    onClick={() => handleStarterClick(starter.text)}
                    className={`w-full px-6 py-5 rounded-2xl font-bold text-[110%] border-3 transition-all duration-300 min-h-[80px] flex items-center justify-center gap-4 ${
                      currentStarter === starter.text
                        ? 'bg-[#f97316] text-white border-[#f97316] shadow-lg scale-[1.02]'
                        : 'bg-[#f5f5dc] text-[#1e3a5f] border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-[1.02]'
                    }`}
                  >
                    <Icon emoji={starter.icon} size={40} />
                    <BilingualText
                      zh={starter.text}
                      en={starter.en}
                      className="items-center text-center"
                      enClassName="text-lg"
                    />
                  </button>
                ))}
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
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomSpeak()}
                    aria-label="輸入要說的話 / Type your message"
                    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-[#1e3a5f] px-6 py-5 text-2xl font-bold rounded-2xl focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleCustomSpeak}
                  disabled={!customText.trim() || isLoading}
                  className="px-8 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-110 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 min-h-[70px] min-w-[120px] flex items-center justify-center gap-2"
                >
                  <Icon emoji="🔊" size={40} />
                  <BilingualText zh="播放" en="Play" className="items-center" enClassName="text-lg" />
                </button>
              </div>
            </div>
          )}

          {/* 當前分類顯示 */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-4 px-10 py-5 bg-[#1e3a5f] text-white rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-110 transform border-4 border-[#f97316]">
              <Icon emoji={CATEGORY_ICONS[selectedCategory] || '📁'} size={64} className="transition-transform duration-300 hover:rotate-12 hover:scale-125" />
              <span className="text-3xl font-bold">{selectedCategory}</span>
              {selectedCategory !== '全部' && (
                <button
                  onClick={() => toggleFavorite(selectedCategory)}
                  className="ml-4 transition-all duration-300 hover:scale-125"
                  aria-label={favorites.includes(selectedCategory) ? '移除最愛' : '加入最愛'}
                >
                  <Icon emoji={favorites.includes(selectedCategory) ? '❤️' : '🤍'} size={48} />
                </button>
              )}
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
