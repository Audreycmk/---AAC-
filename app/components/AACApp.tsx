'use client';

import { useState, useEffect, useRef } from 'react';
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
  { text: '唔記得', en: 'Cannot remember', icon: '🤔' },
  { text: '幫我', en: 'Help me', icon: '🤝' },
  { text: '我要', en: 'I need to', icon: '✋' },
];

// Additional starters for logged-in users (elderly-friendly)
const ADDITIONAL_STARTERS = [
  { text: '請問', en: 'May I ask', icon: '❓' },
  { text: '唔該', en: 'Please', icon: '🙏' },
  { text: '好辛苦', en: 'Feel uncomfortable', icon: '😣' },
  { text: '我唔舒服', en: 'Not feeling well', icon: '🤒' },
  { text: '好攰喇', en: 'Very tired', icon: '😴' },
 
  { text: '好凍呀', en: 'Feeling cold', icon: '🥶' },
  { text: '好熱呀', en: 'Feeling hot', icon: '🥵' },
  { text: '痛呀', en: 'Feeling pain', icon: '😖' },
  { text: '好悶呀', en: 'Feeling bored', icon: '😑' },
];

const SUGGESTED_WORDS: Record<string, Array<{text: string, en: string, icon: string}>> = {
  '我想': [
    { text: '飲水', en: 'drink water', icon: '💧' },
    { text: '食飯', en: 'eat', icon: '🍚' },
    { text: '休息', en: 'rest', icon: '🛏️' },
    { text: '睇電視', en: 'watch TV', icon: '📺' }
  ],

  '幫我': [
    { text: '拎嘢', en: 'get it for me', icon: '📦' },
    { text: '加水', en: 'pour water', icon: '💧' },
    { text: '開門', en: 'open the door', icon: '✅🚪' },
    { text: '關門', en: 'close the door', icon: '❌🚪' },
    { text: '開燈', en: 'turn on the light', icon: '✅💡' },
    { text: '熄燈', en: 'turn off the light', icon: '❌💡' },
    { text: '開窗', en: 'open the window', icon: '✅🪟' },
    { text: '閂窗', en: 'close the window', icon: '❌🪟' }
  ],
  '我要': [
    { text: '食藥', en: 'take medicine', icon: '💊' },
    { text: '換衫', en: 'change clothes', icon: '👕' },
    { text: '沖涼', en: 'take a shower', icon: '🚿' },
    { text: '睇醫生', en: 'see a doctor', icon: '👨‍⚕️' }
  ],
  '請問': [
    { text: '廁所喺邊', en: 'where is the toilet', icon: '🚻' },
    { text: '你嘅電話號碼', en: 'what is your contact number', icon: '📱' },
    { text: '你係邊個', en: 'who are you', icon: '👤' },
    { text: '你叫咩名', en: 'what is your name', icon: '🗣️' },
    { text: '幾多錢', en: 'how much', icon: '💰' },
    { text: '今日幾月幾日', en: 'what date is today', icon: '📅' },
    { text: '幾點鐘', en: 'what time is it', icon: '⏰' },
    { text: '天氣點呀', en: 'how is the weather', icon: '🌤️' }
    
  ],
  '唔該': [
    { text: '唔該', en: 'and thank you', icon: '🙏' },
    { text: '等一等', en: 'wait', icon: '✋' },
    { text: '借借', en: 'excuse me', icon: '🏃' },
    { text: '講多次', en: 'say it again', icon: '🗣️' },
    { text: '落單', en: 'take my order', icon: '📝' },
    { text: '埋單', en: 'check the bill', icon: '💵' },
    { text: '有落', en: 'let me off', icon: '🚗' },

    
  ],
    '唔記得': [
    { text: '食咗藥未', en: 'took medicine or not', icon: '💊' },
    { text: '佢叫乜名', en: 'what\'s the name', icon: '❓' },
    { text: '放喺邊', en: 'where I put it', icon: '🔍' },
    { text: '幾點鐘', en: 'what time', icon: '⏰' }
  ],
  '好辛苦': [
    { text: '頭暈', en: 'dizzy', icon: '😵' },
    { text: '冇力', en: 'no energy', icon: '😩' },
    { text: '心翳', en: 'chest discomfort', icon: '💔' },
    { text: '唔想郁', en: 'don\'t want to move', icon: '🛋️' }
  ],
  '我唔舒服': [
    { text: '肚痛', en: 'stomachache', icon: '🤢' },
    { text: '頭痛', en: 'headache', icon: '🤕' },
    { text: '周身痛', en: 'aching all over', icon: '😣' },
    { text: '想嘔', en: 'feel like vomiting', icon: '🤮' }
  ],
  '好攰喇': [
    { text: '想瞓', en: 'want to sleep', icon: '😴' },
    { text: '想坐低', en: 'want to sit', icon: '🪑' },
    { text: '想抖吓', en: 'want to rest', icon: '🛋️' },
    { text: '冇精神', en: 'no energy', icon: '😪' }
  ],

  '好凍呀': [
    { text: '要被', en: 'need blanket', icon: '🛏️' },
    { text: '關窗', en: 'close window', icon: '🪟' },
    { text: '著多件', en: 'wear more', icon: '🧥' },
    { text: '開暖氣', en: 'turn on heater', icon: '♨️' }
  ],
  '好熱呀': [
    { text: '開風扇', en: 'turn on fan', icon: '💨' },
    { text: '開冷氣', en: 'turn on AC', icon: '❄️' },
    { text: '開窗', en: 'open window', icon: '🪟' },
    { text: '脫件衫', en: 'take off clothes', icon: '👕' }
  ],
  '痛呀': [
    { text: '腰痛', en: 'back pain', icon: '🦴' },
    { text: '腳痛', en: 'leg pain', icon: '🦵' },
    { text: '手痛', en: 'hand pain', icon: '🤲' },
    { text: '好痛', en: 'very painful', icon: '😣' }
  ],
  '好悶呀': [
    { text: '想傾偈', en: 'want to chat', icon: '💬' },
    { text: '想出街', en: 'want to go out', icon: '🚶' },
    { text: '想睇報紙', en: 'want to read newspaper', icon: '📰' },
    { text: '想聽歌', en: 'want to listen to music', icon: '🎵' }
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

// Common emoji presets for quick selection
const COMMON_EMOJIS = [
  '😊', '❤️', '👋', '🙏', '🍔', '💧', '🏥', '😴', '🆘', '🛏️',
  '👜', '🏠', '🍎', '📍', '🚻', '🍽️', '👨‍⚕️', '💊', '📺', '🚪',
  '❄️', '🔥', '💡', '🥄', '🍴', '🍇', '🍊', '🍍', '🏢', '🌳',
  '☕', '🎓', '🎨', '⚽', '🎮', '🎵', '📚', '🏃', '🚗', '✈️',
  '🎁', '🎪', '🎭', '🎬', '🎸', '🎹', '🎤', '🏋️', '⛹️', '🤸',
  '🧘', '💃', '🕺', '👯', '🚴', '🏊', '🧗', '🤺', '🏇', '🎿',
];

type CustomPhrase = (typeof PHRASES)[0];

export default function AACApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [user, setUser] = useState<{ email: string; role: 'admin' | 'user' } | null>(null);
  const [showLoginCodeModal, setShowLoginCodeModal] = useState(false);
  const [loginCode, setLoginCode] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // User Management States
  const [showDashboard, setShowDashboard] = useState(false);
  const [allUsers, setAllUsers] = useState<Array<{
    id: string;
    email?: string;
    password?: string;
    loginCode?: string;
    role: 'admin' | 'user';
    createdAt: string;
    trialType: 'unlimited' | '14days' | 'notrial';
    trialStartDate?: string;
    customizations?: {
      favorites: string[];
      customPhrases: any[];
      customCategoryIcons: Record<string, string>;
      customCategoryNames: Record<string, { zh: string; en: string }>;
    };
  }>>([
    {
      id: '1',
      email: 'admin@aac.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
      trialType: 'unlimited',
    }
  ]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserType, setNewUserType] = useState<'admin' | 'user'>('user');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserLoginCode, setNewUserLoginCode] = useState('');
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<'admin' | 'user'>('user');
  const [editingUserTrial, setEditingUserTrial] = useState<'unlimited' | '14days' | 'notrial'>('14days');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [menuOpen, setMenuOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [speechRate, setSpeechRate] = useState(0.5);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [speechLanguage, setSpeechLanguage] = useState<'zh-HK' | 'en-US'>('zh-HK');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStarter, setCurrentStarter] = useState('');
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['個人物品', '家居用品', '水果', '地方']);
  
  // Add Vocabulary Feature States
  const [showAddVocab, setShowAddVocab] = useState(false);
  const [customPhrases, setCustomPhrases] = useState<(typeof PHRASES[0])[]>([]);
  const [addVocabInput, setAddVocabInput] = useState({
    text: '',
    en: '',
    icon: '📝',
    category: '',
    newCategory: '',
  });
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('📁');
  const [addVocabLang, setAddVocabLang] = useState<'zh' | 'en'>('zh');
  const [vocabError, setVocabError] = useState('');
  const [vocabSuccess, setVocabSuccess] = useState(false);
  const [lastAddedWord, setLastAddedWord] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCategoryEmojiPicker, setShowCategoryEmojiPicker] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [customCategoryIcons, setCustomCategoryIcons] = useState<Record<string, string>>({});
  const [customCategoryNames, setCustomCategoryNames] = useState<Record<string, { zh: string; en: string }>>({});
  const [editFavoritesMode, setEditFavoritesMode] = useState(false);
  const [editCategoriesMode, setEditCategoriesMode] = useState(false);
  const [editingCategoryName, setEditingCategoryName] = useState<Record<string, { zh: string; en: string }>>({});
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [showCategoryEmojiPickerFor, setShowCategoryEmojiPickerFor] = useState<string | null>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);

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
        setAvailableVoices(voices);
        console.log('Available voices:', voices.length);
        console.log('Cantonese voices:', voices.filter(v => v.lang.includes('zh-HK')));
      };
      
      // Load voices immediately if already available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    }
    
    // 從 localStorage 載入用戶列表
    const loadUsersFromAPI = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          setAllUsers(users);
          // Also save to localStorage as cache
          localStorage.setItem('aac-users', JSON.stringify(users));
        }
      } catch (error) {
        console.error('Failed to load users from API, using localStorage:', error);
        // Fallback to localStorage if API fails
        const savedUsers = localStorage.getItem('aac-users');
        if (savedUsers) {
          try {
            setAllUsers(JSON.parse(savedUsers));
          } catch (e) {
            console.error('Failed to load users from localStorage:', e);
          }
        }
      }
    };

    loadUsersFromAPI();

    // 從 localStorage 載入當前用戶會話
    const savedUserSession = localStorage.getItem('aac-current-user');
    if (savedUserSession) {
      try {
        const userSession = JSON.parse(savedUserSession);
        setUser(userSession);
      } catch (e) {
        console.error('Failed to load user session from localStorage:', e);
      }
    }
    
    // 從 localStorage 載入歷史記錄
    const savedHistory = localStorage.getItem('aac-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // 從 localStorage 載入自訂分類圖示
    const savedCategoryIcons = localStorage.getItem('custom-category-icons');
    if (savedCategoryIcons) {
      setCustomCategoryIcons(JSON.parse(savedCategoryIcons));
    }

    // 從 localStorage 載入自訂詞語
    const savedCustomPhrases = localStorage.getItem('custom-vocab');
    if (savedCustomPhrases) {
      setCustomPhrases(JSON.parse(savedCustomPhrases));
    }
    
    // 從 localStorage 載入語音設定
    const savedSpeechRate = localStorage.getItem('aac-speech-rate');
    if (savedSpeechRate) {
      setSpeechRate(parseFloat(savedSpeechRate));
    }
    
    const savedSpeechVolume = localStorage.getItem('aac-speech-volume');
    if (savedSpeechVolume) {
      setSpeechVolume(parseFloat(savedSpeechVolume));
    }
    
    const savedSpeechLanguage = localStorage.getItem('aac-speech-language');
    if (savedSpeechLanguage) {
      setSpeechLanguage(savedSpeechLanguage as 'zh-HK' | 'en-US');
    }
    
    const savedSelectedVoice = localStorage.getItem('aac-selected-voice');
    if (savedSelectedVoice) {
      setSelectedVoice(savedSelectedVoice);
    }
  }, []);

  // Save allUsers to API and localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aac-users', JSON.stringify(allUsers));
    
    // Sync with server (optional - only if you want real-time sync)
    // This is useful but not required since we sync when adding/removing users
  }, [allUsers]);

  // Save current user session to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('aac-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aac-current-user');
    }
  }, [user]);
  
  // Save speech settings to localStorage
  useEffect(() => {
    localStorage.setItem('aac-speech-rate', speechRate.toString());
  }, [speechRate]);
  
  useEffect(() => {
    localStorage.setItem('aac-speech-volume', speechVolume.toString());
  }, [speechVolume]);
  
  useEffect(() => {
    localStorage.setItem('aac-speech-language', speechLanguage);
  }, [speechLanguage]);
  
  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('aac-selected-voice', selectedVoice);
    } else {
      localStorage.removeItem('aac-selected-voice');
    }
  }, [selectedVoice]);

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

  const handleLoginCode = () => {
    if (!loginCode.trim()) {
      alert('請輸入登入碼 / Please enter login code');
      return;
    }
    
    if (loginCode.toLowerCase() === 'admin') {
      // Admin login - show email/password modal
      setShowLoginCodeModal(false);
      setLoginCode('');
      setShowLoginModal(true);
    } else {
      // Normal user login - verify with server
      verifyUserLogin('user', loginCode);
    }
  };

  const verifyUserLogin = async (role: 'admin' | 'user', loginData: string, password?: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          role === 'admin' 
            ? { email: loginData, password, role }
            : { loginCode: loginData, role }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Authentication failed');
        return;
      }

      // Update state with authenticated user
      setUser(result.user);
      
      // Reset modal states
      setShowLoginCodeModal(false);
      setShowLoginModal(false);
      setLoginCode('');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      console.error('Login error:', error);
      alert('登入失敗 / Login failed');
    }
  };

  const handleLogin = () => {
    // Admin credentials - verify with server
    if (!loginEmail || !loginPassword) {
      alert('請輸入郵箱和密碼 / Please enter email and password');
      return;
    }
    verifyUserLogin('admin', loginEmail, loginPassword);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // ========== User Management CRUD Functions ==========
  const addUser = async () => {
    if (newUserType === 'admin') {
      // Admin user requires email and password
      if (!newUserEmail || !newUserPassword) {
        alert('請填寫所有欄位 / Please fill in all fields');
        return;
      }
      if (allUsers.some(u => u.email === newUserEmail)) {
        alert('該郵箱已存在 / This email already exists');
        return;
      }
      
      const newAdmin = {
        email: newUserEmail,
        password: newUserPassword,
        role: 'admin' as const,
        trialType: 'unlimited' as const,
      };
      
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAdmin),
        });

        if (!response.ok) {
          alert('添加用戶失敗 / Failed to add user');
          return;
        }

        const createdUser = await response.json();
        setAllUsers([...allUsers, createdUser]);
        alert('管理員已新增 / Admin added successfully');
      } catch (error) {
        console.error('Error adding admin:', error);
        alert('添加用戶失敗 / Failed to add user');
      }
    } else {
      // Normal user requires login code only
      if (!newUserLoginCode) {
        alert('請填寫所有欄位 / Please fill in all fields');
        return;
      }
      if (allUsers.some(u => u.loginCode === newUserLoginCode)) {
        alert('該登入碼已存在 / This login code already exists');
        return;
      }
      
      const newNormalUser = {
        loginCode: newUserLoginCode,
        role: 'user' as const,
        trialType: '14days' as const,
      };
      
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNormalUser),
        });

        if (!response.ok) {
          alert('添加用戶失敗 / Failed to add user');
          return;
        }

        const createdUser = await response.json();
        setAllUsers([...allUsers, createdUser]);
        alert('普通使用者已新增 / User added successfully');
      } catch (error) {
        console.error('Error adding user:', error);
        alert('添加用戶失敗 / Failed to add user');
      }
    }
    
    setNewUserType('user');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserLoginCode('');
    setShowAddUserModal(false);
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('刪除用戶失敗 / Failed to delete user');
        return;
      }

      setAllUsers(allUsers.filter(u => u.id !== userId));
      setDeleteUserConfirm(null);
      alert('用戶已刪除 / User deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('刪除用戶失敗 / Failed to delete user');
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        alert('更新用戶失敗 / Failed to update user');
        return;
      }

      const updatedUser = await response.json();
      setAllUsers(allUsers.map(u => u.id === userId ? updatedUser : u));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('更新用戶失敗 / Failed to update user');
    }
  };

  const updateUserTrial = async (userId: string, newTrialType: 'unlimited' | '14days' | 'notrial') => {
    try {
      const updateData: any = { trialType: newTrialType };
      
      // When changing back from notrial, set new start date
      const currentUser = allUsers.find(u => u.id === userId);
      if (currentUser?.trialType === 'notrial' && (newTrialType === '14days' || newTrialType === 'unlimited')) {
        updateData.trialStartDate = new Date().toISOString();
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        alert('更新用戶失敗 / Failed to update user');
        return;
      }

      const updatedUser = await response.json();
      setAllUsers(allUsers.map(u => u.id === userId ? updatedUser : u));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user trial:', error);
      alert('更新用戶失敗 / Failed to update user');
    }
  };

  const getTrialStatus = (user: any) => {
    if (user.trialType === 'unlimited') {
      return { status: 'Unlimited', daysLeft: -1, expired: false };
    }
    if (user.trialType === 'notrial') {
      return { status: 'No Trial', daysLeft: 0, expired: true };
    }
    // 14days
    const startDate = new Date(user.trialStartDate || user.createdAt);
    const daysLeft = Math.ceil((startDate.getTime() + 14 * 24 * 60 * 60 * 1000 - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) {
      // Auto-expire trial
      setAllUsers(allUsers.map(u => u.id === user.id ? { ...u, trialType: 'notrial' } : u));
      return { status: 'Expired', daysLeft: 0, expired: true };
    }
    return { status: `${daysLeft}日`, daysLeft, expired: false };
  };

  const hasFullAccess = () => {
    if (!user) return false;
    
    // Admin always has full access
    if (user.role === 'admin') return true;
    
    // Regular user - check trial status
    // For normal users, user.email contains the login code
    const currentUser = allUsers.find(u => u.loginCode === user.email && u.role === 'user');
    if (!currentUser) return false;
    
    if (currentUser.trialType === 'unlimited') return true;
    if (currentUser.trialType === '14days') {
      const startDate = new Date(currentUser.trialStartDate || currentUser.createdAt);
      const daysLeft = Math.ceil((startDate.getTime() + 14 * 24 * 60 * 60 * 1000 - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft > 0;
    }
    return false;
  };

  const playVoiceDemo = (voiceName: string) => {
    if (!speechSupported) {
      alert('您的瀏覽器不支援語音功能 / Your browser does not support speech');
      return;
    }

    window.speechSynthesis.cancel();
    
    const demoText = speechLanguage === 'zh-HK' ? '你好，呢個係試聽' : 'Hello, this is a demo sound';
    const utterance = new SpeechSynthesisUtterance(demoText);
    
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.rate = speechRate;
    utterance.volume = speechVolume;
    
    window.speechSynthesis.speak(utterance);
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

    // 使用用戶選擇的語音，如果沒有選擇則使用默認邏輯
    const voices = window.speechSynthesis.getVoices();
    let targetVoice = null;
    
    if (selectedVoice) {
      targetVoice = voices.find(voice => voice.name === selectedVoice);
    }
    
    if (!targetVoice) {
      targetVoice = speechLanguage === 'zh-HK'
        ? voices.find(voice => voice.lang === 'zh-HK' || voice.lang === 'zh_HK')
        : voices.find(voice => voice.lang.startsWith('en') && /(female|woman|girl|samantha|victoria|zoe|serena|tessa|karen|moira|susan)/i.test(voice.name))
          || voices.find(voice => voice.lang.startsWith('en'));
    }
    
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

  const moveFavoriteUp = (index: number) => {
    if (index > 0) {
      const newFavorites = [...favorites];
      [newFavorites[index], newFavorites[index - 1]] = [newFavorites[index - 1], newFavorites[index]];
      setFavorites(newFavorites);
    }
  };

  const moveFavoriteDown = (index: number) => {
    if (index < favorites.length - 1) {
      const newFavorites = [...favorites];
      [newFavorites[index], newFavorites[index + 1]] = [newFavorites[index + 1], newFavorites[index]];
      setFavorites(newFavorites);
    }
  };

  const updateCategoryEmoji = (oldName: string, newEmoji: string) => {
    const updatedIcons = { ...customCategoryIcons };
    if (updatedIcons[oldName]) {
      updatedIcons[oldName] = newEmoji;
      setCustomCategoryIcons(updatedIcons);
      localStorage.setItem('custom-category-icons', JSON.stringify(updatedIcons));
    }
  };

  const updateCategoryName = (oldName: string, newName: string) => {
    if (!newName.trim()) return;
    
    // Update customPhrases
    const updatedPhrases = customPhrases.map(phrase => 
      phrase.category === oldName ? { ...phrase, category: newName } : phrase
    );
    setCustomPhrases(updatedPhrases);
    localStorage.setItem('custom-vocab', JSON.stringify(updatedPhrases));
    
    // Update customCategoryIcons
    const updatedIcons = { ...customCategoryIcons };
    if (updatedIcons[oldName]) {
      updatedIcons[newName] = updatedIcons[oldName];
      delete updatedIcons[oldName];
      setCustomCategoryIcons(updatedIcons);
      localStorage.setItem('custom-category-icons', JSON.stringify(updatedIcons));
    }
    
    // Update favorites
    setFavorites(favorites.map(fav => fav === oldName ? newName : fav));
    
    // Reset edit state
    setEditingCategoryName(prev => {
      const updated = { ...prev };
      delete updated[oldName];
      return updated;
    });
  };

  const deleteCategory = (category: string) => {
    // Remove from customPhrases
    const updatedPhrases = customPhrases.filter(phrase => phrase.category !== category);
    setCustomPhrases(updatedPhrases);
    localStorage.setItem('custom-vocab', JSON.stringify(updatedPhrases));
    
    // Remove from customCategoryIcons
    const updatedIcons = { ...customCategoryIcons };
    delete updatedIcons[category];
    setCustomCategoryIcons(updatedIcons);
    localStorage.setItem('custom-category-icons', JSON.stringify(updatedIcons));
    
    // Remove from favorites
    setFavorites(favorites.filter(fav => fav !== category));
    
    // Reset states
    setDeleteCategoryConfirm(null);
    setEditingCategoryName(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  // ========== Add Vocabulary Functions ==========
  
  const validatePhrase = (phrase: Partial<typeof PHRASES[0]>) => {
    const errors: string[] = [];
    if (!phrase.text?.trim()) errors.push('Chinese text required / 需要中文');
    if (!phrase.en?.trim()) errors.push('English text required / 需要英文');
    if (!phrase.icon) errors.push('Emoji required / 需要表情符號');
    if (!phrase.category) errors.push('Category required / 需要分類');
    return errors;
  };

  const resetAddVocabForm = () => {
    setAddVocabInput({
      text: '',
      en: '',
      icon: '📝',
      category: '',
      newCategory: '',
    });
    setNewCategoryEmoji('📁');
    setShowCreateCategory(false);
    setAddVocabLang('zh');
    setVocabError('');
    setVocabSuccess(false);
  };

  const getUniqueCategories = () => {
    const allPhrases = [...PHRASES, ...customPhrases];
    return Array.from(new Set(allPhrases.map((p: typeof PHRASES[0]) => p.category))).sort();
  };

  const handleAddVocab = () => {
    const errors = validatePhrase({
      text: addVocabInput.text,
      en: addVocabInput.en,
      icon: addVocabInput.icon,
      category: addVocabInput.category || addVocabInput.newCategory,
    });

    if (errors.length > 0) {
      setVocabError(errors.join(' / '));
      return;
    }

    const selectedCat = addVocabInput.category || addVocabInput.newCategory;
    let finalCategory = selectedCat;
    
    const newId = Math.max(...PHRASES.map((p: typeof PHRASES[0]) => p.id), ...customPhrases.map((p: typeof PHRASES[0]) => p.id), 0) + 1;
    
    const newPhrase: typeof PHRASES[0] = {
      id: newId,
      text: addVocabInput.text,
      en: addVocabInput.en,
      icon: addVocabInput.icon,
      category: finalCategory,
    };

    const updatedCustomPhrases = [...customPhrases, newPhrase];
    setCustomPhrases(updatedCustomPhrases);
    
    // Save category emoji if creating new category with custom emoji
    if (addVocabInput.newCategory && !addVocabInput.category && newCategoryEmoji !== '📁') {
      const updatedCategoryIcons = {
        ...customCategoryIcons,
        [finalCategory]: newCategoryEmoji
      };
      setCustomCategoryIcons(updatedCategoryIcons);
      localStorage.setItem('custom-category-icons', JSON.stringify(updatedCategoryIcons));
    }
    
    // Save to localStorage
    localStorage.setItem('custom-vocab', JSON.stringify(updatedCustomPhrases));

    // Store the added word and show success message
    setLastAddedWord(addVocabInput.text);
    setVocabSuccess(true);
    
    // Auto scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset form but keep the page open
    resetAddVocabForm();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setVocabSuccess(false);
      setLastAddedWord('');
    }, 3000);
  };

  const handleVocabInputChange = (field: string, value: string) => {
    setAddVocabInput(prev => ({
      ...prev,
      [field]: value
    }));
    setVocabError('');
  };

  const toggleInputLanguage = () => {
    setAddVocabLang(addVocabLang === 'zh' ? 'en' : 'zh');
    // Swap the values when toggling language
    setAddVocabInput(prev => ({
      ...prev,
      text: prev.en,
      en: prev.text,
    }));
  };

  const categories = ['全部', ...getUniqueCategories().filter(c => c !== '全部')];
  const allPhrases = [...PHRASES, ...customPhrases];
  const filteredPhrases = selectedCategory === '全部' 
    ? allPhrases
    : allPhrases.filter(p => p.category === selectedCategory);

  // Combine starters - always show all, but guests can't access additional ones
  const allAvailableStarters = [...SENTENCE_STARTERS, ...ADDITIONAL_STARTERS];

  const visibleStarters = showSuggestions && currentStarter
    ? allAvailableStarters.filter((starter) => starter.text === currentStarter)
    : allAvailableStarters;
  
  // Check if a starter is from the base 4 or the additional ones
  const isBasicStarter = (starterText: string) => 
    SENTENCE_STARTERS.some(s => s.text === starterText);

  const starterMatch = allAvailableStarters.find((starter) => customText.startsWith(starter.text));
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
        
        <h1 className="text-lg sm:text-3xl font-bold flex-1 text-center mx-2 sm:mx-0">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1">
            <div className="whitespace-nowrap">AAC</div>
            <div className="whitespace-nowrap">輔助</div>
            <div className="whitespace-nowrap">通訊</div>
          </div>
        </h1>
        
        <div className="flex gap-2">
          {/* 歷史記錄按鈕 */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="歷史記錄 History"
          >
            <Icon emoji="⭐️" size={32} />
          </button>
          
          {/* 設定按鈕 */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="設定 Settings"
          >
            <Icon emoji="⚙" size={32} />
          </button>

          {/* 登入/登出按鈕 */}
          {user ? (
            <>
              {user.role === 'admin' && (
                <button
                  onClick={() => setShowDashboard(true)}
                  className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
                  aria-label="管理儀表板 Dashboard"
                >
                  <Icon emoji="📊" size={32} />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-3 bg-red-500 rounded-xl shadow-lg hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
                aria-label="登出 Logout"
              >
                <Icon emoji="🚪" size={32} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginCodeModal(true)}
              className="p-3 bg-green-500 rounded-xl shadow-lg hover:bg-green-600 hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
              aria-label="登入 Login"
            >
              <Icon emoji="🔐" size={32} />
            </button>
          )}
        </div>
      </div>

      {/* 側邊選單 */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-500 ease-out ${
          menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } w-80 pt-20 pb-24 sm:pb-20`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* 自訂句子按鈕（在菜單內） */}
          <button
            onClick={() => {
              setShowCustomPanel(!showCustomPanel);
              setMenuOpen(false);
            }}
            className={`w-full mt-6 px-6 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3 mb-6 transform ${
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
          
          <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
            menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}>
            <h2 className="text-3xl font-bold text-[#1e3a5f]">
              <BilingualText zh="常用選單" en="Favorites" enClassName="text-lg sm:text-xl" />
            </h2>
          </div>
          <nav className="space-y-3 mb-8">
            {favorites.map((category, index) => (
              <div 
                key={category} 
                className={`transition-all duration-300 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`} 
                style={{ transitionDelay: menuOpen ? `${index * 50}ms` : '0ms' }}
              >
                <div className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                  selectedCategory === category
                    ? 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                    : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105 translate-x-0 opacity-100'
                }`}>
                  <Icon emoji={customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁'} size={48} className="flex-shrink-0" />
                  <span className="flex-1">
                    <BilingualText
                      zh={customCategoryNames[category]?.zh ?? category}
                      en={customCategoryNames[category]?.en ?? CATEGORY_LABELS[category]}
                      className="items-start"
                      enClassName="text-base sm:text-lg"
                    />
                  </span>
                  <button
                    onClick={() => toggleFavorite(category)}
                    className="transition-all duration-300 hover:scale-125 flex-shrink-0"
                    aria-label={favorites.includes(category) ? '移除最愛' : '加入最愛'}
                  >
                    <Icon emoji={favorites.includes(category) ? '❤️' : '🤍'} size={24} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setMenuOpen(false);
                  }}
                  className="absolute inset-0 w-full h-full"
                  aria-label={`Select ${category}`}
                />
              </div>
            ))}
          </nav>
          
          {/* Categories Section - Show all if logged in with full access, only defaults if not */}
          {hasFullAccess() && (
            <>
              <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <h2 className="text-3xl font-bold text-[#1e3a5f]">
                  <BilingualText zh="分類選單" en="Categories" enClassName="text-lg sm:text-xl" />
                </h2>
                <button
                  onClick={() => {
                    if (editCategoriesMode) {
                      // Save edits
                      Object.entries(editingCategoryName).forEach(([category, names]) => {
                        setCustomCategoryNames(prev => ({ ...prev, [category]: names }));
                      });
                    }
                    setEditCategoriesMode(!editCategoriesMode);
                    setEditingCategoryName({});
                    setShowCategoryEmojiPickerFor(null);
                  }}
                  className="ml-auto px-4 py-2 bg-[#f97316] text-white rounded-xl font-bold text-lg hover:bg-[#ea580c] hover:scale-105 transition-all duration-300 min-h-[50px] flex items-center justify-center gap-2"
                  aria-label={editCategoriesMode ? '保存' : '編輯'}
                >
                  <Icon emoji={editCategoriesMode ? '✔️' : '✏️'} size={24} />
                </button>
              </div>
              <nav className="space-y-3 mb-8">
                {categories.map((category, index) => (
              <div
                key={category}
                className={`transition-all duration-300 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                style={{ transitionDelay: menuOpen ? `${index * 50}ms` : '0ms' }}
                draggable={editCategoriesMode}
                onDragStart={() => setDraggedCategory(category)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  // Categories are read-only derived, so drag is visual only
                  setDraggedCategory(null);
                }}
                onDragEnd={() => setDraggedCategory(null)}
              >
                <div className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                  editCategoriesMode
                    ? 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#f97316] cursor-move'
                    : selectedCategory === category
                      ? 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                      : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105 translate-x-0 opacity-100'
                }`}>
                  {editCategoriesMode ? (
                    // Edit mode
                    <div className="w-full flex items-center gap-3">
                      <button
                        onClick={() => setShowCategoryEmojiPickerFor(showCategoryEmojiPickerFor === category ? null : category)}
                        className="px-3 py-2 bg-[#f97316] text-white rounded-xl text-3xl hover:scale-110 transition-all duration-300 flex-shrink-0"
                      >
                        {customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁'}
                      </button>
                      <div className="flex flex-col gap-2 flex-1">
                        <input
                          type="text"
                          value={editingCategoryName[category]?.zh ?? category}
                          onChange={(e) => setEditingCategoryName(prev => ({ ...prev, [category]: { ...prev[category], zh: e.target.value } }))}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="max-w-[120px] px-3 py-2 border-2 border-[#1e3a5f] rounded-lg font-bold text-base bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
                          placeholder="中文 Chinese"
                        />
                        <input
                          type="text"
                          value={editingCategoryName[category]?.en ?? CATEGORY_LABELS[category] ?? ''}
                          onChange={(e) => setEditingCategoryName(prev => ({ ...prev, [category]: { ...prev[category], en: e.target.value } }))}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="max-w-[120px] px-3 py-2 border-2 border-[#1e3a5f] rounded-lg font-bold text-base bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
                          placeholder="English"
                        />
                      </div>
                      <button
                        onClick={() => setDeleteCategoryConfirm(category)}
                        className="px-3 py-2 text-2xl hover:scale-125 transition-all duration-300 flex-shrink-0"
                      >
                        ⛔️
                      </button>
                    </div>
                  ) : (
                    // Normal mode - show category button
                    <>
                      <Icon emoji={customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁'} size={48} className="flex-shrink-0" />
                      <BilingualText
                        zh={customCategoryNames[category]?.zh ?? category}
                        en={customCategoryNames[category]?.en ?? CATEGORY_LABELS[category]}
                        className="items-start flex-1"
                        enClassName="text-base sm:text-lg"
                      />
                    </>
                  )}
                </div>
                {!editCategoriesMode && (
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setMenuOpen(false);
                    }}
                    className="absolute inset-0 w-full h-full"
                    aria-label={`Select ${category}`}
                  />
                )}
              </div>
            ))}
              </nav>
            </>
          )}

          {/* Guest/Limited Access Categories View - Only show 4 default categories */}
          {!hasFullAccess() && (
            <>
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-6">
                <BilingualText zh="分類選單" en="Categories" enClassName="text-lg sm:text-xl" />
              </h2>
              <nav className="space-y-3 mb-32">
                {['個人物品', '家居用品', '水果', '地方'].map((category, index) => (
                  <div
                    key={category}
                    className={`transition-all duration-300 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                    style={{ transitionDelay: menuOpen ? `${index * 50}ms` : '0ms' }}
                  >
                    <div className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                      selectedCategory === category
                        ? 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                        : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105 translate-x-0 opacity-100'
                    }`}>
                      <Icon emoji={customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁'} size={48} className="flex-shrink-0" />
                      <BilingualText
                        zh={customCategoryNames[category]?.zh ?? category}
                        en={customCategoryNames[category]?.en ?? CATEGORY_LABELS[category]}
                        className="items-start flex-1"
                        enClassName="text-base sm:text-lg"
                      />
                      <button
                        onClick={() => toggleFavorite(category)}
                        className="transition-all duration-300 hover:scale-125 flex-shrink-0"
                        aria-label={favorites.includes(category) ? '移除最愛' : '加入最愛'}
                      >
                        <Icon emoji={favorites.includes(category) ? '❤️' : '🤍'} size={24} />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setMenuOpen(false);
                      }}
                      className="absolute inset-0 w-full h-full"
                      aria-label={`Select ${category}`}
                    />
                  </div>
                ))}
              </nav>
            </>
          )}

          {/* Add Vocabulary Button - Show for all users, grey for non-logged in */}
          <button
            onClick={() => {
              if (hasFullAccess()) {
                setShowAddVocab(true);
                setMenuOpen(false);
              } else {
                alert('請登入以使用此功能\nPlease log in to use this function');
              }
            }}
            className={`w-full mt-8 mb-20 px-6 py-5 rounded-2xl font-bold text-2xl shadow-lg transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3 transform ${
              menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            } ${
              hasFullAccess() 
                ? 'bg-[#f97316] text-white hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            style={{ 
              transitionDelay: menuOpen ? `${categories.length * 50 + 100}ms` : '0ms'
            }}
            aria-label="加入詞語 Add Vocabulary"
          >
            <Icon emoji="➕" size={40} />
            <BilingualText zh="加入詞語" en="Add Words" className="items-center text-center" enClassName="text-lg" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1e3a5f] text-white border-t-4 border-[#f97316] shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-6 py-[12px] text-center">
          {!hasFullAccess() ? (
            <>
              <button
                onClick={() => setShowLoginCodeModal(true)}
                className="w-full font-bold text-sm sm:text-lg mb-2 hover:opacity-80 transition-all duration-300 truncate"
              >
                🔐 <span className="hidden sm:inline">請登入以存取更多功能 / </span><span className="sm:hidden">登入存取</span><span className="hidden sm:inline">Please login for more features</span><span className="sm:hidden">更多功能</span>
              </button>
              <div className="font-bold text-xs sm:text-sm">
                @Audrey Chung 2026
              </div>
            </>
          ) : (
            <div className="font-bold text-xs sm:text-sm">
              @Audrey Chung 2026
            </div>
          )}
        </div>
      </footer>

      {/* 遮罩層 */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-all duration-500 animate-fadeIn backdrop-blur-sm"
        />
      )}

      {/* 選擇分類圖示表情符號選擇器 */}
      {showCategoryEmojiPickerFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowCategoryEmojiPickerFor(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-[95%] sm:w-[85%] md:w-[80%] max-h-[65vh] border-4 border-[#f97316] flex flex-col">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3 sm:mb-4 flex-shrink-0">選擇分類圖示</h3>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 overflow-y-auto flex-1 pb-4">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    updateCategoryEmoji(showCategoryEmojiPickerFor, emoji);
                    setShowCategoryEmojiPickerFor(null);
                  }}
                  className={`text-3xl sm:text-5xl md:text-6xl p-2 sm:p-3 md:p-4 rounded-lg hover:bg-[#f97316] hover:scale-110 transition-all duration-300 ${
                    (customCategoryIcons[showCategoryEmojiPickerFor] || CATEGORY_ICONS[showCategoryEmojiPickerFor]) === emoji ? 'bg-[#f97316] scale-110' : 'bg-white'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCategoryEmojiPickerFor(null)}
              className="mt-3 sm:mt-4 w-full px-4 py-2 sm:py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all duration-300 flex-shrink-0"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      {/* 刪除分類確認對話框 */}
      {deleteCategoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setDeleteCategoryConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-4 border-red-500">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">確認刪除分類</h3>
            <p className="text-lg text-[#1e3a5f] mb-6">
              確定要刪除分類「<span className="font-bold">{deleteCategoryConfirm}</span>」嗎？該分類下的所有詞語都會被刪除，無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteCategoryConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all duration-300"
              >
                取消
              </button>
              <button
                onClick={() => deleteCategory(deleteCategoryConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all duration-300"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主要內容 */}
      <div className="pt-28 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* 登入碼模態 - First Step Login */}
          {showLoginCodeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowLoginCodeModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-4 border-[#1e3a5f]">
                <h3 className="text-3xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                  <Icon emoji="🔐" size={40} />
                  登入 / Login
                </h3>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="登入碼 (Login Code)"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
                  />
                  
                  {/* Get Login Code Button */}
                  <div className="border-t-2 border-gray-200 pt-4">
                    <p className="text-sm font-semibold text-[#1e3a5f] mb-2">
                      需要登入碼？ / Need a Login Code?
                    </p>
                    <a
                      href="mailto:audreycmk@gmail.com?subject=AAC%20Login%20Code%20Request&body=Hi%2C%0A%0AI%20would%20like%20to%20request%20a%20login%20code%20for%20the%20AAC%20app.%0A%0AThank%20you!"
                      className="w-full px-4 py-3 bg-[#f97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Icon emoji="📧" size={24} />
                      <span>取得登入碼 / Get Login Code</span>
                    </a>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      audreycmk@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLoginCodeModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all duration-300"
                  >
                    取消 / Cancel
                  </button>
                  <button
                    onClick={handleLoginCode}
                    disabled={!loginCode}
                    className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-[#0a1a2e] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    登入 / Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 登入模態 - Admin Email & Password Login */}
          {showLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-4 border-[#1e3a5f]">
                <h3 className="text-3xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                  <Icon emoji="🔐" size={40} />
                  登入 / Login
                </h3>
                <div className="space-y-4 mb-6">
                  <input
                    type="email"
                    placeholder="Email (admin for admin role)"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all duration-300"
                  >
                    取消 / Cancel
                  </button>
                  <button
                    onClick={handleLogin}
                    disabled={!loginEmail}
                    className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-[#0a1a2e] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    登入 / Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Modal - User Management */}
          {showDashboard && user?.role === 'admin' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowDashboard(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 border-4 border-[#f97316] my-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-4xl font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Icon emoji="📊" size={48} />
                    管理員儀表板 / Admin Dashboard
                  </h3>
                  <button
                    onClick={() => setShowDashboard(false)}
                    className="text-[#1e3a5f] hover:text-[#f97316] text-3xl font-bold transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>

                {/* Add User Button */}
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="mb-6 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold text-lg hover:bg-[#0a1a2e] transition-all duration-300 flex items-center gap-2"
                >
                  <Icon emoji="➕" size={24} />
                  新增使用者 / Add User
                </button>

                {/* Add User Modal */}
                {showAddUserModal && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowAddUserModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 border-4 border-[#f97316]">
                      <h4 className="text-2xl font-bold text-[#1e3a5f] mb-4">新增使用者 / Add User</h4>
                      <div className="space-y-4">
                        {/* User Type Selection */}
                        <select
                          value={newUserType}
                          onChange={(e) => {
                            setNewUserType(e.target.value as 'admin' | 'user');
                            setNewUserEmail('');
                            setNewUserPassword('');
                            setNewUserLoginCode('');
                          }}
                          className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                        >
                          <option value="user">一般使用者 / Normal User</option>
                          <option value="admin">管理員 / Admin</option>
                        </select>

                        {/* Admin User Fields */}
                        {newUserType === 'admin' && (
                          <>
                            <input
                              type="email"
                              placeholder="Email"
                              value={newUserEmail}
                              onChange={(e) => setNewUserEmail(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                            />
                            <input
                              type="password"
                              placeholder="Password"
                              value={newUserPassword}
                              onChange={(e) => setNewUserPassword(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                            />
                            <div className="text-sm text-[#1e3a5f] font-bold bg-blue-50 p-3 rounded-lg">
                              試用期限 / Trial: 無限制 (Unlimited)
                            </div>
                          </>
                        )}

                        {/* Normal User Fields */}
                        {newUserType === 'user' && (
                          <>
                            <input
                              type="text"
                              placeholder="登入碼 (Login Code)"
                              value={newUserLoginCode}
                              onChange={(e) => setNewUserLoginCode(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                            />
                            <div className="text-sm text-[#1e3a5f] font-bold bg-blue-50 p-3 rounded-lg">
                              試用期限 / Trial: 14日 (14 Days)
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => {
                            setShowAddUserModal(false);
                            setNewUserEmail('');
                            setNewUserPassword('');
                            setNewUserLoginCode('');
                          }}
                          className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500"
                        >
                          取消 / Cancel
                        </button>
                        <button
                          onClick={addUser}
                          className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-[#0a1a2e]"
                        >
                          新增 / Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#1e3a5f] text-white">
                        <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">身份 / Info</th>
                        <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">角色 / Role</th>
                        <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">建立日期 / Created</th>
                        <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">試用期限 / Trial</th>
                        <th className="border-2 border-[#1e3a5f] px-4 py-3 text-center font-bold">操作 / Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u) => {
                        const trialStatus = getTrialStatus(u);
                        return (
                          <tr key={u.id} className="border-b-2 border-[#1e3a5f]">
                            <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold text-[#1e3a5f]">
                              {u.role === 'admin' ? `📧 ${u.email}` : `🔐 ${u.loginCode}`}
                            </td>
                            <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold">
                              {editingUserId === u.id && !editingUserId?.endsWith('_trial') ? (
                                <select
                                  value={editingUserRole}
                                  onChange={(e) => setEditingUserRole(e.target.value as 'admin' | 'user')}
                                  className="px-3 py-2 border-2 border-[#f97316] rounded-lg font-bold bg-white text-[#1e3a5f]"
                                >
                                  <option value="user">使用者 / User</option>
                                  <option value="admin">管理員 / Admin</option>
                                </select>
                              ) : (
                                <span className={`px-3 py-1 rounded-lg font-bold text-white ${u.role === 'admin' ? 'bg-[#f97316]' : 'bg-[#1e3a5f]'}`}>
                                  {u.role === 'admin' ? '管理員' : '使用者'}
                                </span>
                              )}
                            </td>
                            <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold text-[#1e3a5f] text-sm">
                              {new Date(u.createdAt).toLocaleDateString('zh-HK')}
                            </td>
                            <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold text-center">
                              {editingUserId === `${u.id}_trial` ? (
                                <select
                                  value={editingUserTrial}
                                  onChange={(e) => setEditingUserTrial(e.target.value as 'unlimited' | '14days' | 'notrial')}
                                  className="px-3 py-2 border-2 border-[#f97316] rounded-lg font-bold bg-white text-[#1e3a5f] w-full"
                                >
                                  <option value="unlimited">Unlimited</option>
                                  <option value="14days">14日</option>
                                  <option value="notrial">No Trial</option>
                                </select>
                              ) : (
                                <span className={`px-3 py-1 rounded-lg font-bold text-white cursor-pointer hover:opacity-80 ${
                                  u.trialType === 'unlimited' ? 'bg-green-600' : u.trialType === '14days' ? 'bg-blue-500' : 'bg-red-500'
                                }`}
                                  onClick={() => {
                                    setEditingUserId(`${u.id}_trial`);
                                    setEditingUserTrial(u.trialType);
                                  }}
                                >
                                  {u.trialType === 'unlimited' ? '無限制' : u.trialType === '14days' ? `14日 (${trialStatus.daysLeft}天)` : '無試用'}
                                </span>
                              )}
                            </td>
                            <td className="border-2 border-[#1e3a5f] px-4 py-3 text-center">
                              {editingUserId?.startsWith(u.id) ? (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => {
                                      if (editingUserId.endsWith('_trial')) {
                                        updateUserTrial(u.id, editingUserTrial);
                                      } else {
                                        updateUserRole(u.id, editingUserRole);
                                      }
                                    }}
                                    className="px-3 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 text-sm"
                                  >
                                    ✔
                                  </button>
                                  <button
                                    onClick={() => setEditingUserId(null)}
                                    className="px-3 py-2 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 text-sm"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => {
                                      setEditingUserId(u.id);
                                      setEditingUserRole(u.role);
                                    }}
                                    className="px-3 py-2 bg-[#1e3a5f] text-white rounded-lg font-bold hover:bg-[#0a1a2e] text-sm"
                                  >
                                    編輯
                                  </button>
                                  <button
                                    onClick={() => setDeleteUserConfirm(u.id)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 text-sm"
                                  >
                                    刪除
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Delete Confirmation */}
                {deleteUserConfirm && (
                  <div className="fixed inset-0 z-[70] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border-4 border-red-500">
                      <h4 className="text-2xl font-bold text-[#1e3a5f] mb-4">確認刪除 / Confirm Delete</h4>
                      <p className="text-lg font-bold text-[#1e3a5f] mb-6">
                        確定要刪除 {allUsers.find(u => u.id === deleteUserConfirm)?.email} 嗎? / Are you sure?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteUserConfirm(null)}
                          className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500"
                        >
                          取消 / Cancel
                        </button>
                        <button
                          onClick={() => deleteUser(deleteUserConfirm)}
                          className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
                        >
                          刪除 / Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
                          .filter(v => {
                            const langCode = speechLanguage === 'zh-HK' ? 'zh' : 'en';
                            return v.lang.toLowerCase().includes(langCode);
                          })
                          .map(voice => (
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
                            // Play default voice demo
                            const defaultVoice = availableVoices.find(v => {
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
                  <label className="block text-xl font-bold text-[#1e3a5f] mb-2">
                    語速: {speechRate.toFixed(1)}x
                  </label>
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
          )}

          {/* Add Vocabulary Panel */}
          {showAddVocab && (
            <div className="fixed inset-0 z-50 bg-[#f5f5dc] overflow-y-auto">
              {/* Header with back button */}
              <div className="fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white shadow-lg z-50 px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowAddVocab(false);
                    resetAddVocabForm();
                  }}
                  className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 transform min-h-[60px] min-w-[60px] flex items-center justify-center"
                  aria-label="返回 Back"
                >
                  <span className="text-white text-3xl font-bold">←</span>
                </button>
                
                <h1 className="text-2xl sm:text-3xl font-bold flex-1 text-center">
                  <BilingualText
                    zh="加入新詞語"
                    en="Add New Words"
                    className="items-center"
                    enClassName="text-base sm:text-lg font-semibold"
                  />
                </h1>
                
                <div className="min-h-[60px] min-w-[60px]"></div>
              </div>

              {/* Main Content */}
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-4 border-[#f97316] relative">
                  {/* Success Message Overlay */}
                  {vocabSuccess && (
                    <div className="absolute inset-0 z-50 bg-green-500 rounded-2xl flex items-center justify-center p-8 animate-fadeIn">
                      <div className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <div className="text-4xl font-bold text-white mb-3">{lastAddedWord}</div>
                        <div className="text-2xl font-bold text-white mb-2">詞語已加入！</div>
                        <div className="text-xl font-semibold text-green-100">Word added successfully!</div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {vocabError && (
                    <div className="mb-6 p-4 bg-red-100 border-3 border-red-500 rounded-xl text-red-800 font-bold text-lg">
                      ❌ {vocabError}
                    </div>
                  )}

              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 text-[#1e3a5f] rounded-full flex items-center justify-center font-bold text-xl">1</div>
                    <h4 className="text-2xl font-bold text-[#1e3a5f]">
                      <BilingualText zh="上傳圖片" en="Upload Image" enClassName="text-lg" />
                    </h4>
                  </div>
                  <div className="bg-[#f5f5dc] p-4 rounded-2xl">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex-1 px-4 py-3 border-2 border-[#1e3a5f] rounded-xl text-center font-bold bg-white text-[#1e3a5f] flex items-center justify-center min-h-[120px]">
                        {addVocabInput.icon && typeof addVocabInput.icon === 'string' && addVocabInput.icon.startsWith('data:image') ? (
                          <img src={addVocabInput.icon} alt="Uploaded" className="max-w-[90%] max-h-[100px] object-contain" />
                        ) : (
                          <span className="text-2xl">{addVocabInput.icon || '📝'}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {/* Camera Button */}
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.setAttribute('capture', 'environment');
                          input.onchange = (e: any) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event: any) => {
                                handleVocabInputChange('icon', event.target.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="flex-1 min-w-[120px] px-6 py-4 bg-[#f97316] text-white rounded-2xl font-bold text-lg border-3 border-[#f97316] shadow-lg hover:bg-[#ea580c] hover:scale-105 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2"
                      >
                        <Icon emoji="📷" size={32} />
                        <span>拍照 / Camera</span>
                      </button>

                      {/* Upload Button */}
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event: any) => {
                                handleVocabInputChange('icon', event.target.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="flex-1 min-w-[120px] px-6 py-4 bg-[#f97316] text-white rounded-2xl font-bold text-lg border-3 border-[#f97316] shadow-lg hover:bg-[#ea580c] hover:scale-105 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2"
                      >
                        <Icon emoji="📁" size={32} />
                        <span>上傳 / Upload</span>
                      </button>

                      {/* Emoji Keyboard Button */}
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="flex-1 min-w-[120px] px-6 py-4 bg-[#f97316] text-white rounded-2xl font-bold text-lg border-3 border-[#f97316] shadow-lg hover:bg-[#ea580c] hover:scale-105 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2"
                      >
                        <Icon emoji="😀" size={32} />
                        <span>表情 / Emoji</span>
                      </button>
                    </div>

                    {/* Emoji Keyboard Grid */}
                    {showEmojiPicker && (
                      <div className="mt-4 grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-2 bg-white rounded-xl">
                        {COMMON_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              handleVocabInputChange('icon', emoji);
                              setShowEmojiPicker(false);
                            }}
                            className={`text-3xl p-2 rounded-lg hover:bg-[#f97316] hover:scale-110 transition-all duration-300 ${
                              addVocabInput.icon === emoji ? 'bg-[#f97316] scale-110' : 'bg-white'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Inputs */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 text-[#1e3a5f] rounded-full flex items-center justify-center font-bold text-xl">2</div>
                    <h4 className="text-2xl font-bold text-[#1e3a5f]">
                      <BilingualText zh="輸入詞語" en="Enter Words" enClassName="text-lg" />
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-lg font-bold text-[#1e3a5f] mb-2">
                        {addVocabLang === 'zh' ? '中文 Chinese' : '英文 English'}
                      </label>
                      <input
                        type="text"
                        placeholder={addVocabLang === 'zh' ? '輸入中文詞語...' : 'Enter English word...'}
                        value={addVocabLang === 'zh' ? addVocabInput.text : addVocabInput.en}
                        onChange={(e) => handleVocabInputChange(addVocabLang === 'zh' ? 'text' : 'en', e.target.value)}
                        className="w-full px-6 py-4 border border-[#1e3a5f] rounded-xl text-xl font-bold text-[#1e3a5f] focus:border-[#f97316] focus:outline-none transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-[#1e3a5f] mb-2">
                        {addVocabLang === 'zh' ? '英文 English' : '中文 Chinese'}
                      </label>
                      <input
                        type="text"
                        placeholder={addVocabLang === 'zh' ? 'Enter English translation...' : '輸入中文翻譯...'}
                        value={addVocabLang === 'zh' ? addVocabInput.en : addVocabInput.text}
                        onChange={(e) => handleVocabInputChange(addVocabLang === 'zh' ? 'en' : 'text', e.target.value)}
                        className="w-full px-6 py-4 border border-[#1e3a5f] rounded-xl text-xl font-bold text-[#1e3a5f] focus:border-[#f97316] focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selector */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 text-[#1e3a5f] rounded-full flex items-center justify-center font-bold text-xl">3</div>
                    <h4 className="text-2xl font-bold text-[#1e3a5f]">
                      <BilingualText zh="選擇分類" en="Choose Category" enClassName="text-lg" />
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {getUniqueCategories().length > 0 && (
                      <select
                        value={addVocabInput.category}
                        onChange={(e) => handleVocabInputChange('category', e.target.value)}
                        className="w-full px-6 py-4 border border-[#1e3a5f] rounded-xl text-lg font-bold text-[#1e3a5f] focus:border-[#f97316] focus:outline-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="">-- 選擇分類 / Select Category --</option>
                        {getUniqueCategories().map((cat) => (
                          <option key={cat} value={cat}>
                            {cat} / {CATEGORY_LABELS[cat] || cat}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    <button
                      onClick={() => setShowCreateCategory(!showCreateCategory)}
                      disabled={!!addVocabInput.category}
                      className="w-full px-6 py-4 bg-[#f97316] text-white rounded-xl font-bold text-lg border border-[#f97316] shadow-lg hover:bg-[#ea580c] hover:scale-105 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Icon emoji="➕" size={32} />
                      <span>新增分類</span>
                    </button>
                    
                    {showCreateCategory && (
                      <div className="space-y-3">
                        {/* Category Emoji Selector */}
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-3 border-2 border-[#1e3a5f] rounded-xl text-4xl text-center font-bold bg-white text-[#1e3a5f] min-w-[80px] flex items-center justify-center">
                            {newCategoryEmoji}
                          </div>
                          <button
                            onClick={() => setShowCategoryEmojiPicker(!showCategoryEmojiPicker)}
                            disabled={!!addVocabInput.category}
                            className="flex-1 px-6 py-4 bg-[#f97316] text-white rounded-xl font-bold text-lg border border-[#f97316] shadow-lg hover:bg-[#ea580c] hover:scale-105 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <Icon emoji="😀" size={32} />
                            <span>選擇新分類圖示 / Select New Category Icon</span>
                          </button>
                        </div>

                        {/* Category Emoji Picker Grid */}
                        {showCategoryEmojiPicker && (
                          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-2 bg-white rounded-xl border-2 border-[#1e3a5f]">
                            {COMMON_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  setNewCategoryEmoji(emoji);
                                  setShowCategoryEmojiPicker(false);
                                }}
                                className={`text-3xl p-2 rounded-lg hover:bg-[#f97316] hover:scale-110 transition-all duration-300 ${
                                  newCategoryEmoji === emoji ? 'bg-[#f97316] scale-110' : 'bg-white'
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Category Name Input */}
                        <input
                          type="text"
                          placeholder="新分類名稱 / New Category Name"
                          value={addVocabInput.newCategory}
                          onChange={(e) => handleVocabInputChange('newCategory', e.target.value)}
                          disabled={!!addVocabInput.category}
                          className="w-full px-6 py-4 border border-[#1e3a5f] rounded-xl text-lg font-bold text-[#1e3a5f] focus:border-[#f97316] focus:outline-none transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddVocab}
                    className="flex-1 px-8 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-105 active:scale-95 disabled:bg-gray-400 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-2"
                  >
                    <Icon emoji="💾" size={40} />
                    <BilingualText zh="加入詞語" en="Add Word" className="items-center" enClassName="text-lg" />
                  </button>
                  <button
                    onClick={() => {
                      setShowAddVocab(false);
                      resetAddVocabForm();
                    }}
                    className="flex-1 px-8 py-5 bg-[#1e3a5f] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#2a5a8f] hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-2"
                  >
                    <Icon emoji="❌" size={40} />
                    <BilingualText zh="返回" en="Back" className="items-center" enClassName="text-lg" />
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          )}

          {/* 自訂句子 */}
          {!showCustomPanel ? (
            <button
              onClick={() => setShowCustomPanel(true)}
              className="w-full mt-6 mb-6 px-6 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3"
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
              <Icon emoji={customCategoryIcons[selectedCategory] || CATEGORY_ICONS[selectedCategory] || '📁'} size={64} className="transition-transform duration-300 hover:rotate-12 hover:scale-125" />
              <span className="text-3xl font-bold">{selectedCategory}</span>
              {selectedCategory !== '全部' && (
                <button
                  onClick={() => toggleFavorite(selectedCategory)}
                  className="ml-4 transition-all duration-300 hover:scale-125"
                  aria-label={favorites.includes(selectedCategory) ? '移除最愛' : '加入最愛'}
                >
                  <Icon emoji={favorites.includes(selectedCategory) ? '❤️' : '🤍'} size={30} />
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
                <div className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-active:scale-90 flex items-center justify-center">
                  {phrase.icon && typeof phrase.icon === 'string' && phrase.icon.startsWith('data:image') ? (
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
