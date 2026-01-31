'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import SideMenu from './SideMenu';
import LoginModals from './LoginModals';
import AdminDashboard from './AdminDashboard';
import SettingsPanel from './SettingsPanel';
import CustomSentencePanel from './CustomSentencePanel';
import AddVocabularyPanel from './AddVocabularyPanel';
import HistoryPanel from './HistoryPanel';
import CategoryDisplay from './CategoryDisplay';
import PhrasesGrid from './PhrasesGrid';
import MeasureWordPanel from './MeasureWordPanel';

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
  { id: 47, text: '窗', en: 'Window', category: '家居用品', icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa9f.png' },
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

const DISPLAY_CATEGORIES = ['個人物品', '家居用品', '水果', '地方'] as const;

// 量詞 (Measure Words / Classifiers)
const MEASURE_WORD_CLASSIFIERS = [
  { text: '個', en: 'item', icon: '1️⃣' },
  { text: '十', en: 'ten', icon: '🔟' },
  { text: '百', en: 'hundred', icon: '💯' },
  { text: '千', en: 'thousand', icon: '🔠' },
  { text: '萬', en: 'ten thousand', icon: '📊' },
];

const VALID_CLASSIFIER_COMBINATIONS = [
  { display: '十萬', en: 'hundred thousand', classifiers: ['十', '萬'] },
  { display: '百萬', en: 'million', classifiers: ['百', '萬'] },
  { display: '千萬', en: 'ten million', classifiers: ['千', '萬'] },
];

const MEASURE_WORD_UNITS = [
  { text: '蚊', en: 'dollars', icon: '💵' },
  { text: '個', en: '', icon: '1️⃣' },
  { text: '隻', en: '', icon: '🦆' },
  { text: '次', en: 'times', icon: '🔄' },
  { text: '位', en: 'people', icon: '👤' },
  { text: '粒', en: '', icon: '🫘' },
  { text: '條', en: '', icon: '➖' },
  { text: '枝', en: '', icon: '✏️' },
  { text: '張', en: 'pieces', icon: '🎫' },
];

// 句子啟動器和建議詞語
const SENTENCE_STARTERS = [
  { text: '我要', en: 'I need', icon: '✋' },
  { text: '我想', en: 'I want to', icon: '💭' },
  { text: '幫我', en: 'Help me', icon: '🤝' },
  { text: '唔記得', en: 'Cannot remember', icon: '🤔' },
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

const SUGGESTED_WORDS: Record<string, Array<{ text: string; en: string; icon: string }>> = {
  '我想': [
    { text: '飲水', en: 'drink water', icon: '💧' },
    { text: '食飯', en: 'eat', icon: '🍚' },
    { text: '休息', en: 'rest', icon: '🛏️' },
    { text: '睇電視', en: 'watch TV', icon: '📺' },
  ],

  '幫我': [
    { text: '拎嘢', en: 'get it for me', icon: '📦' },
    { text: '加水', en: 'pour water', icon: '💧' },
    { text: '開門', en: 'open the door', icon: '✅🚪' },
    { text: '關門', en: 'close the door', icon: '❌🚪' },
    { text: '開燈', en: 'turn on the light', icon: '✅💡' },
    { text: '熄燈', en: 'turn off the light', icon: '❌💡' },
    { text: '開窗', en: 'open the window', icon: '✅🪟' },
    { text: '閂窗', en: 'close the window', icon: '❌🪟' },
  ],
  '我要': [
    { text: '更多', en: 'More', icon: '➕' },
    { text: '食藥', en: 'to take medicine', icon: '💊' },
    { text: '換衫', en: 'tochange clothes', icon: '👕' },
    { text: '沖涼', en: 'to take a shower', icon: '🚿' },
    // { text: '睇醫生', en: 'to see a doctor', icon: '👨‍⚕️' },
  ],
  '請問': [
    { text: '廁所喺邊', en: 'where is the toilet', icon: '🚻' },
    { text: '你嘅電話號碼', en: 'what is your contact number', icon: '📱' },
    { text: '你係邊個', en: 'who are you', icon: '👤' },
    { text: '你叫咩名', en: 'what is your name', icon: '🗣️' },
    { text: '幾多錢', en: 'how much', icon: '💰' },
    { text: '今日幾月幾日', en: 'what date is today', icon: '📅' },
    { text: '幾點鐘', en: 'what time is it', icon: '⏰' },
    { text: '天氣點呀', en: 'how is the weather', icon: '🌤️' },
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
    { text: '佢叫乜名', en: "what's the name", icon: '❓' },
    { text: '放喺邊', en: 'where I put it', icon: '🔍' },
    { text: '幾點鐘', en: 'what time', icon: '⏰' },
  ],
  '好辛苦': [
    { text: '頭暈', en: 'dizzy', icon: '😵' },
    { text: '冇力', en: 'no energy', icon: '😩' },
    { text: '心翳', en: 'chest discomfort', icon: '💔' },
    { text: '唔想郁', en: "don't want to move", icon: '🛋️' },
  ],
  '我唔舒服': [
    { text: '肚痛', en: 'stomachache', icon: '🤢' },
    { text: '頭痛', en: 'headache', icon: '🤕' },
    { text: '周身痛', en: 'aching all over', icon: '😣' },
    { text: '想嘔', en: 'feel like vomiting', icon: '🤮' },
  ],
  '好攰喇': [
    { text: '想瞓', en: 'want to sleep', icon: '😴' },
    { text: '想坐低', en: 'want to sit', icon: '🪑' },
    { text: '想抖吓', en: 'want to rest', icon: '🛋️' },
    { text: '冇精神', en: 'no energy', icon: '😪' },
  ],

  '好凍呀': [
    { text: '要被', en: 'need blanket', icon: '🛏️' },
    { text: '閂窗', en: 'close window', icon: '❌🪟' },
    { text: '著多件', en: 'wear more', icon: '🧥' },
    { text: '開暖氣', en: 'turn on heater', icon: '♨️' },
  ],
  '好熱呀': [
    { text: '開風扇', en: 'turn on fan', icon: '💨' },
    { text: '開冷氣', en: 'turn on AC', icon: '❄️' },
    { text: '開窗', en: 'open window', icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa9f.png' },
    { text: '脫件衫', en: 'take off clothes', icon: '👕' },
  ],
  '痛呀': [
    { text: '腰痛', en: 'back pain', icon: '🦴' },
    { text: '腳痛', en: 'leg pain', icon: '🦵' },
    { text: '手痛', en: 'hand pain', icon: '🤲' },
    { text: '好痛', en: 'very painful', icon: '😣' },
  ],
  '好悶呀': [
    { text: '想傾偈', en: 'want to chat', icon: '💬' },
    { text: '想出街', en: 'want to go out', icon: '🚶' },
    { text: '想睇報紙', en: 'want to read newspaper', icon: '📰' },
    { text: '想聽歌', en: 'want to listen to music', icon: '🎵' },
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
  const [user, setUser] = useState<{ email?: string; loginCode?: string; role: 'admin' | 'user' } | null>(null);
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
  }>>([]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserType, setNewUserType] = useState<'admin' | 'user'>('user');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserLoginCode, setNewUserLoginCode] = useState('');
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<'admin' | 'user'>('user');
  const [editingUserTrial, setEditingUserTrial] = useState<'unlimited' | '14days' | 'notrial'>('14days');

  const [selectedCategory, setSelectedCategory] = useState<string>(DISPLAY_CATEGORIES[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [speechRate, setSpeechRate] = useState(0.7);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [speechLanguage, setSpeechLanguage] = useState<'zh-HK' | 'en-US' | 'en-AU'>('zh-HK');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSelectingVoiceRef = useRef(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStarter, setCurrentStarter] = useState('');
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [showVocabSelector, setShowVocabSelector] = useState(false);
  const [vocabSelectorCategory, setVocabSelectorCategory] = useState<string>('全部');
  const [favorites, setFavorites] = useState<string[]>([...DISPLAY_CATEGORIES]);

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
  const [customCategoryIcons, setCustomCategoryIcons] = useState<Record<string, string>>({});
  const [customCategoryNames, setCustomCategoryNames] = useState<Record<string, { zh: string; en: string }>>({});
  const [editCategoriesMode, setEditCategoriesMode] = useState(false);
  const [editingCategoryName, setEditingCategoryName] = useState<Record<string, { zh: string; en: string }>>({});

  // Measure Word States
  const [showMeasureWord, setShowMeasureWord] = useState(false);

  // ========== UTILITY FUNCTIONS ==========
  const getUniqueCategories = () => [...DISPLAY_CATEGORIES];

  const getTrialStatus = (u: any) => {
    if (u.trialType === 'unlimited') return { daysLeft: Infinity, isExpired: false };
    if (u.trialType === 'notrial') return { daysLeft: 0, isExpired: true };

    const trialStart = u.trialStartDate ? new Date(u.trialStartDate).getTime() : new Date(u.createdAt).getTime();
    const trialEnd = trialStart + 14 * 24 * 60 * 60 * 1000;
    const daysLeft = Math.ceil((trialEnd - Date.now()) / (24 * 60 * 60 * 1000));
    return { daysLeft: Math.max(0, daysLeft), isExpired: daysLeft < 0 };
  };

  const hasFullAccess = () => !!user;

  const isBasicStarter = (starterText: string) => SENTENCE_STARTERS.some((s) => s.text === starterText);

  const getLanguageCodeForVoice = (lang: 'zh-HK' | 'en-US' | 'en-AU') => (lang === 'zh-HK' ? 'zh' : 'en');

  const getDefaultVoiceForLanguage = (
    voices: SpeechSynthesisVoice[],
    lang: 'zh-HK' | 'en-US' | 'en-AU'
  ) => {
    if (lang === 'zh-HK') {
      const hkVoices = voices.filter((v) => v.lang.toLowerCase().includes('zh-hk'));
      if (hkVoices.length > 0) {
        return hkVoices[0];
      }
      const zhVoices = voices.filter((v) => v.lang.toLowerCase().includes('zh'));
      return zhVoices[0];
    }

    const langCode = getLanguageCodeForVoice(lang);
    const matchingVoices = voices.filter((v) => v.lang.toLowerCase().includes(langCode));

    if (lang === 'en-US') {
      const preferredFemaleNames = [
        'Samantha',
        'Victoria',
        'Tessa',
        'Moira',
        'Serena',
        'Karen',
        'Fiona',
        'Ava',
        'Nicky',
        'Allison',
        'Susan',
        'Google US English',
      ];

      const preferredFemaleVoice = matchingVoices.find((voice) =>
        preferredFemaleNames.some((name) => voice.name.toLowerCase().includes(name.toLowerCase()))
      );

      if (preferredFemaleVoice) {
        return preferredFemaleVoice;
      }
    }

    return matchingVoices[0];
  };

  const handleStarterClick = (text: string) => {
    setShowSuggestions(!showSuggestions);
    setCurrentStarter(text);
  };

  const handleSuggestionClick = (word: { text: string; en: string; icon: string }) => {
    if (word.text === '更多') {
      setShowVocabSelector(true);
      setVocabSelectorCategory(DISPLAY_CATEGORIES[0]);
    } else {
      setCustomText(currentStarter + word.text);
    }
  };

  const handleVocabSelection = (phrase: { text: string; en: string }) => {
    setCustomText(currentStarter + phrase.text);
    setShowVocabSelector(false);
  };

  const handleMeasureWordSelected = (measureWord: string, english: string) => {
    setCustomText(currentStarter + measureWord);
  };

  const handleCustomSpeak = (englishOverride?: string) => {
    const textToSpeak = speechLanguage === 'en-US' && englishOverride ? englishOverride : customText;
    if (textToSpeak.trim()) {
      speak(textToSpeak);
    }
  };

  const speak = (text: string) => {
    if (!speechSupported) {
      alert('您的瀏覽器不支援語音合成\nYour browser does not support speech synthesis');
      return;
    }

    setIsLoading(true);
    const resolvedEnglishText = speechLanguage === 'en-US' ? resolveEnglishText(text) : '';
    const speechText = resolvedEnglishText || text;
    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Set language based on selected language
    if (speechLanguage === 'zh-HK') {
      utterance.lang = 'zh-HK';
    } else if (speechLanguage === 'en-AU') {
      utterance.lang = 'en-AU';
    } else {
      utterance.lang = 'en-US';
    }
    
    utterance.rate = speechRate;
    utterance.volume = speechVolume;

    if (selectedVoice) {
      const voice = availableVoices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.onend = () => {
      setIsLoading(false);
      setHistory((prev) => {
        const updated = [text, ...prev.filter((h) => h !== text)];
        return updated.slice(0, 10);
      });
    };

    utterance.onerror = () => {
      setIsLoading(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playVoiceDemo = (voiceName: string) => {
    const demoText = speechLanguage === 'zh-HK' ? '你好' : 'Hello';
    const utterance = new SpeechSynthesisUtterance(demoText);
    
    if (speechLanguage === 'zh-HK') {
      utterance.lang = 'zh-HK';
    } else if (speechLanguage === 'en-AU') {
      utterance.lang = 'en-AU';
    } else {
      utterance.lang = 'en-US';
    }
    
    utterance.rate = speechRate;
    utterance.volume = speechVolume;

    const voice = availableVoices.find((v) => v.name === voiceName);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleLoginCode = () => {
    if (!loginCode) {
      alert('請輸入登入碼 / Please enter login code');
      return;
    }
    verifyUserLogin('user', loginCode);
  };

  const verifyUserLogin = async (role: 'admin' | 'user', loginData: string, password?: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          role === 'admin' ? { email: loginData, password, role } : { loginCode: loginData, role }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Authentication failed');
        return;
      }

      setUser(result.user);
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
    if (!loginEmail || !loginPassword) {
      alert('請輸入郵箱和密碼 / Please enter email and password');
      return;
    }
    verifyUserLogin('admin', loginEmail, loginPassword);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleFavorite = (category: string) => {
    setFavorites((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const resetAddVocabForm = () => {
    setAddVocabInput({ text: '', en: '', icon: '📝', category: '', newCategory: '' });
    setAddVocabLang('zh');
    setVocabError('');
    setVocabSuccess(false);
    setLastAddedWord('');
  };

  const handleVocabInputChange = (field: string, value: string) => {
    if (field === 'newCategory') {
      setAddVocabInput((prev) => ({ ...prev, [field]: value }));
    } else {
      setAddVocabInput((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddVocab = async () => {
    if (!addVocabInput.text || !addVocabInput.en) {
      setVocabError('請填寫中英文 / Please fill in both Chinese and English');
      return;
    }

    const category = addVocabInput.category || addVocabInput.newCategory;
    if (!category) {
      setVocabError('請選擇或新增分類 / Please select or add category');
      return;
    }

    const newPhrase = {
      id: Math.max(...[...PHRASES, ...customPhrases].map((p) => p.id), 0) + 1,
      text: addVocabInput.text,
      en: addVocabInput.en,
      category,
      icon: addVocabInput.icon,
    };

    if (addVocabInput.newCategory && !addVocabInput.category) {
      setCustomCategoryIcons((prev) => ({ ...prev, [category]: newCategoryEmoji }));
    }

    setCustomPhrases((prev) => [...prev, newPhrase]);
    setLastAddedWord(addVocabInput.text);
    setVocabSuccess(true);
    setVocabError('');

    setTimeout(() => {
      resetAddVocabForm();
      setShowAddVocab(false);
    }, 2000);
  };

  const addUser = async () => {
    if (newUserType === 'admin') {
      if (!newUserEmail || !newUserPassword) {
        alert('請填寫所有欄位 / Please fill in all fields');
        return;
      }
      if (allUsers.some((u) => u.email === newUserEmail)) {
        alert('該郵箱已存在 / This email already exists');
        return;
      }
    } else {
      if (!newUserLoginCode) {
        alert('請輸入登入碼 / Please enter login code');
        return;
      }
      if (allUsers.some((u) => u.loginCode === newUserLoginCode)) {
        alert('該登入碼已存在 / This login code already exists');
        return;
      }
    }

    const newUser: typeof allUsers[0] = {
      id: Date.now().toString(),
      ...(newUserType === 'admin' ? { email: newUserEmail, password: newUserPassword } : { loginCode: newUserLoginCode }),
      role: newUserType,
      createdAt: new Date().toISOString(),
      trialType: newUserType === 'admin' ? 'unlimited' : '14days',
      trialStartDate: newUserType === 'user' ? new Date().toISOString() : undefined,
    };

    setAllUsers((prev) => [...prev, newUser] as typeof allUsers);
    setShowAddUserModal(false);
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserLoginCode('');
    setNewUserType('user');
  };

  const deleteUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteUserConfirm(null);
  };

  const updateUserRole = (id: string, role: 'admin' | 'user') => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setEditingUserId(null);
  };

  const updateUserTrial = (id: string, trial: 'unlimited' | '14days' | 'notrial') => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, trialType: trial, trialStartDate: new Date().toISOString() }
          : u
      )
    );
    setEditingUserId(null);
  };

  // ========== USEEFFECT HOOKS ==========
  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        const savedVoice = localStorage.getItem('aac-selected-voice');
        if (!savedVoice) {
          const defaultVoice = getDefaultVoiceForLanguage(voices, speechLanguage);
          if (defaultVoice) {
            setSelectedVoice(defaultVoice.name);
            localStorage.setItem('aac-selected-voice', defaultVoice.name);
          }
        }
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);

        const savedVoice = localStorage.getItem('aac-selected-voice');
        if (!savedVoice) {
          const defaultVoice = getDefaultVoiceForLanguage(voices, speechLanguage);
          if (defaultVoice) {
            setSelectedVoice(defaultVoice.name);
            localStorage.setItem('aac-selected-voice', defaultVoice.name);
          }
        }
      }
    }

    const loadUsersFromAPI = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          setAllUsers(users);
          localStorage.setItem('aac-users', JSON.stringify(users));
        }
      } catch (error) {
        const savedUsers = localStorage.getItem('aac-users');
        if (savedUsers) {
          setAllUsers(JSON.parse(savedUsers));
        }
      }
    };

    loadUsersFromAPI();

    const savedUserSession = localStorage.getItem('aac-current-user');
    if (savedUserSession) {
      setUser(JSON.parse(savedUserSession));
    }

    const savedHistory = localStorage.getItem('aac-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedCategoryIcons = localStorage.getItem('custom-category-icons');
    if (savedCategoryIcons) {
      setCustomCategoryIcons(JSON.parse(savedCategoryIcons));
    }

    const savedCustomPhrases = localStorage.getItem('custom-vocab');
    if (savedCustomPhrases) {
      setCustomPhrases(JSON.parse(savedCustomPhrases));
    }

    const savedSpeechRate = localStorage.getItem('aac-speech-rate');
    if (savedSpeechRate) {
      setSpeechRate(parseFloat(savedSpeechRate));
    }

    const savedSpeechVolume = localStorage.getItem('aac-speech-volume');
    if (savedSpeechVolume) {
      setSpeechVolume(parseFloat(savedSpeechVolume));
    }

    const savedSpeechLanguage = localStorage.getItem('aac-speech-language');
    if (savedSpeechLanguage === 'zh-HK' || savedSpeechLanguage === 'en-US') {
      setSpeechLanguage(savedSpeechLanguage);
    }

    const savedSelectedVoice = localStorage.getItem('aac-selected-voice');
    if (savedSelectedVoice) {
      setSelectedVoice(savedSelectedVoice);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aac-users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aac-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aac-current-user');
    }
  }, [user]);

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

  useEffect(() => {
    if (availableVoices.length === 0 || isSelectingVoiceRef.current) return;

    const langCode = getLanguageCodeForVoice(speechLanguage);
    const currentVoice = availableVoices.find((v) => v.name === selectedVoice);

    if (currentVoice && currentVoice.lang.toLowerCase().includes(langCode)) {
      return;
    }

    const defaultVoice = getDefaultVoiceForLanguage(availableVoices, speechLanguage);
    if (defaultVoice) {
      isSelectingVoiceRef.current = true;
      setSelectedVoice(defaultVoice.name);
      setTimeout(() => {
        isSelectingVoiceRef.current = false;
      }, 100);
    }
  }, [availableVoices, speechLanguage]);

  useEffect(() => {
    const defaultCategory = favorites.length > 0 ? favorites[0] : '個人物品';
    setSelectedCategory(defaultCategory);
  }, [favorites]);

  const resolveEnglishText = (text: string) => {
    const customMatch = customPhrases.find((phrase) => phrase.text === text);
    if (customMatch?.en) {
      return customMatch.en;
    }
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
    const suggestionMatch = SUGGESTED_WORDS[starterMatch.text]?.find((word) => word.text === tail);
    if (suggestionMatch) {
      return `${starterMatch.en} ${suggestionMatch.en}`;
    }

    const phraseMatch = [...PHRASES, ...customPhrases].find((phrase) => phrase.text === tail);
    if (phraseMatch?.en) {
      return `${starterMatch.en} ${phraseMatch.en}`;
    }

    if (tail.startsWith('去')) {
      const placeMatch = [...PHRASES, ...customPhrases].find((phrase) => phrase.text === tail.slice(1));
      if (placeMatch?.en) {
        return `${starterMatch.en} ${placeMatch.en}`;
      }
    }

    return '';
  };

  const allPhrases = [...PHRASES, ...customPhrases].filter((p) => DISPLAY_CATEGORIES.includes(p.category as typeof DISPLAY_CATEGORIES[number]));

  const applyPlacePrefix = (phrase: (typeof PHRASES)[0]) => {
    if (phrase.category !== '地方') return phrase;
    if (phrase.text.startsWith('去')) return phrase;
    return { ...phrase, text: `去${phrase.text}` };
  };

  const displayPhrases = allPhrases.map(applyPlacePrefix);

  const filteredPhrases = displayPhrases.filter((p) => p.category === selectedCategory);

  const allAvailableStarters = [...SENTENCE_STARTERS, ...ADDITIONAL_STARTERS];
  const visibleStarters = showSuggestions && currentStarter
    ? allAvailableStarters.filter((starter) => starter.text === currentStarter)
    : allAvailableStarters;

  const starterMatch = allAvailableStarters.find((starter) => customText.startsWith(starter.text));
  const starterTail = starterMatch ? customText.slice(starterMatch.text.length) : '';
  const suggestionMatch =
    starterMatch && starterTail ? SUGGESTED_WORDS[starterMatch.text]?.find((word) => word.text === starterTail) : undefined;
  const customEnglish = resolveEnglishText(customText);

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      {/* 頂部工具列 */}
      <div className="fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white shadow-lg z-50 px-4 py-3 flex items-center justify-between">
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
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="歷史記錄 History"
          >
            <Icon emoji="⭐️" size={32} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="設定 Settings"
          >
            <Icon emoji="⚙" size={32} />
          </button>

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

      {/* Side Menu Component */}
      <SideMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        favorites={favorites}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        toggleFavorite={toggleFavorite}
        showCustomPanel={showCustomPanel}
        setShowCustomPanel={setShowCustomPanel}
        customCategoryIcons={customCategoryIcons}
        customCategoryNames={customCategoryNames}
        CATEGORY_ICONS={CATEGORY_ICONS}
        CATEGORY_LABELS={CATEGORY_LABELS}
        hasFullAccess={hasFullAccess}
        getUniqueCategories={getUniqueCategories}
        editCategoriesMode={editCategoriesMode}
        setEditCategoriesMode={setEditCategoriesMode}
        editingCategoryName={editingCategoryName}
        setEditingCategoryName={setEditingCategoryName}
        setCustomCategoryNames={setCustomCategoryNames}
        setShowAddVocab={setShowAddVocab}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        user={user}
        setShowLoginCodeModal={setShowLoginCodeModal}
        setShowDashboard={setShowDashboard}
        handleLogout={handleLogout}
      />

      {/* Login Modals Component */}
      <LoginModals
        showLoginCodeModal={showLoginCodeModal}
        setShowLoginCodeModal={setShowLoginCodeModal}
        loginCode={loginCode}
        setLoginCode={setLoginCode}
        handleLoginCode={handleLoginCode}
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
      />

      {/* Admin Dashboard Component */}
      <AdminDashboard
        showDashboard={showDashboard}
        setShowDashboard={setShowDashboard}
        user={user}
        allUsers={allUsers}
        showAddUserModal={showAddUserModal}
        setShowAddUserModal={setShowAddUserModal}
        newUserType={newUserType}
        setNewUserType={setNewUserType}
        newUserEmail={newUserEmail}
        setNewUserEmail={setNewUserEmail}
        newUserPassword={newUserPassword}
        setNewUserPassword={setNewUserPassword}
        newUserLoginCode={newUserLoginCode}
        setNewUserLoginCode={setNewUserLoginCode}
        addUser={addUser}
        deleteUserConfirm={deleteUserConfirm}
        setDeleteUserConfirm={setDeleteUserConfirm}
        deleteUser={deleteUser}
        editingUserId={editingUserId}
        setEditingUserId={setEditingUserId}
        editingUserRole={editingUserRole}
        setEditingUserRole={setEditingUserRole}
        updateUserRole={updateUserRole}
        editingUserTrial={editingUserTrial}
        setEditingUserTrial={setEditingUserTrial}
        updateUserTrial={updateUserTrial}
        getTrialStatus={getTrialStatus}
      />

      {/* Settings Panel Component */}
      <SettingsPanel
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        speechLanguage={speechLanguage}
        setSpeechLanguage={setSpeechLanguage}
        availableVoices={availableVoices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        hasFullAccess={hasFullAccess}
        playVoiceDemo={playVoiceDemo}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        speechVolume={speechVolume}
        setSpeechVolume={setSpeechVolume}
      />

      {/* Main Content */}
      <div className="pt-28 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Add Vocabulary Panel Component */}
          <AddVocabularyPanel
            showAddVocab={showAddVocab}
            setShowAddVocab={setShowAddVocab}
            addVocabInput={addVocabInput}
            handleVocabInputChange={handleVocabInputChange}
            resetAddVocabForm={resetAddVocabForm}
            handleAddVocab={handleAddVocab}
            vocabError={vocabError}
            vocabSuccess={vocabSuccess}
            lastAddedWord={lastAddedWord}
            addVocabLang={addVocabLang}
            setAddVocabLang={setAddVocabLang}
            getUniqueCategories={getUniqueCategories}
            CATEGORY_LABELS={CATEGORY_LABELS}
            COMMON_EMOJIS={COMMON_EMOJIS}
          />

          {/* Custom Sentence Panel Component */}
          <CustomSentencePanel
            showCustomPanel={showCustomPanel}
            setShowCustomPanel={setShowCustomPanel}
            customText={customText}
            setCustomText={setCustomText}
            customEnglish={customEnglish}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            currentStarter={currentStarter}
            setCurrentStarter={setCurrentStarter}
            visibleStarters={visibleStarters}
            SUGGESTED_WORDS={SUGGESTED_WORDS}
            hasFullAccess={hasFullAccess}
            isBasicStarter={isBasicStarter}
            handleStarterClick={handleStarterClick}
            handleSuggestionClick={handleSuggestionClick}
            handleCustomSpeak={handleCustomSpeak}
            isLoading={isLoading}
            showVocabSelector={showVocabSelector}
            setShowVocabSelector={setShowVocabSelector}
            vocabSelectorCategory={vocabSelectorCategory}
            setVocabSelectorCategory={setVocabSelectorCategory}
            allPhrases={displayPhrases}
            handleVocabSelection={handleVocabSelection}
            getUniqueCategories={getUniqueCategories}
            CATEGORY_ICONS={CATEGORY_ICONS}
            CATEGORY_LABELS={CATEGORY_LABELS}
            customCategoryIcons={customCategoryIcons}
            showMeasureWord={showMeasureWord}
            setShowMeasureWord={setShowMeasureWord}
          />

          {/* Measure Word Panel Component */}
          <MeasureWordPanel
            showMeasureWord={showMeasureWord}
            setShowMeasureWord={setShowMeasureWord}
            MEASURE_WORD_CLASSIFIERS={MEASURE_WORD_CLASSIFIERS}
            VALID_CLASSIFIER_COMBINATIONS={VALID_CLASSIFIER_COMBINATIONS}
            MEASURE_WORD_UNITS={MEASURE_WORD_UNITS}
            onMeasureWordSelected={handleMeasureWordSelected}
          />

          {/* Category Display Component */}
          <CategoryDisplay
            selectedCategory={selectedCategory}
            CATEGORY_ICONS={CATEGORY_ICONS}
            CATEGORY_LABELS={CATEGORY_LABELS}
            customCategoryIcons={customCategoryIcons}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />

          {/* History Panel Component */}
          <HistoryPanel
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            history={history}
            speak={speak}
          />

          {/* Phrases Grid Component */}
          <PhrasesGrid
            filteredPhrases={filteredPhrases}
            speak={speak}
            isLoading={isLoading}
            user={user}
            CATEGORY_LABELS={CATEGORY_LABELS}
          />

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

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1e3a5f] text-white border-t-4 border-[#f97316] shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-6 py-[12px] text-center">
          {hasFullAccess() && (
            <p className="text-sm sm:text-base font-semibold">
              ©2026 Audrey Chung
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
