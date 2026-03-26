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
  { id: 6, text: '好', en: 'Okay', category: '日常', icon: '👍' },
  { id: 7, text: '唔好', en: 'No', category: '日常', icon: '👎' },
  { id: 8, text: '係', en: 'Yes', category: '日常', icon: '✅' },
  { id: 9, text: '唔係', en: 'No', category: '日常', icon: '❌' },
  { id: 10, text: '明白', en: 'I understand', category: '日常', icon: '💡' },
  { id: 11, text: '唔明白', en: "I don't understand", category: '日常', icon: '❓' },
   { id: 1, text: '你好', en: 'Hello', category: '日常', icon: '👋' },
  { id: 2, text: '多謝', en: 'Thank you', category: '日常', icon: '🙏' },
  { id: 3, text: '唔該', en: 'Please / Thanks', category: '日常', icon: '🙇🏻‍♀️' },
  { id: 4, text: '對唔住', en: 'Sorry', category: '日常', icon: '😔' },
  { id: 5, text: '再見', en: 'Goodbye', category: '日常', icon: '👋' },

  // 飲食
  { id: 12, text: '口渴', en: 'thirsty', category: '飲食', icon: '💧' },
  { id: 13, text: '肚餓', en: 'Hungry', category: '飲食', icon: '🍽️' },
  { id: 14, text: '飯', en: 'Rice', category: '飲食', icon: '🍚' },
  { id: 15, text: '麵', en: 'Noodles', category: '飲食', icon: '🍜' },
  { id: 16, text: '茶', en: 'Tea', category: '飲食', icon: '🍵' },
  { id: 17, text: '奶', en: 'Milk', category: '飲食', icon: '🥛' },
  { id: 18, text: '藥', en: 'Medicine', category: '飲食', icon: '💊' },
  
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
  { id: 42, text: '橡筋', en: 'Hair tie', category: '個人物品', icon: '👱‍♀️' },

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
  { id: 55, text: '火龍果', en: 'Dragonfruit', category: '水果', icon: '🐉' },
  { id: 56, text: '菠蘿', en: 'Pineapple', category: '水果', icon: '🍍' },
  { id: 57, text: '桃', en: 'Peach', category: '水果', icon: '🍑' },
  { id: 58, text: '榴槤', en: 'Durian', category: '水果', icon: '🟡' },

  // 地方
  // { id: 11111, text: '去', en: 'Go to', category: '地方', icon: '/去 go to.png' },
  { id: 59, text: '廁所', en: 'Toilet', category: '地方', icon: '🚻' },
  { id: 60, text: '銀行', en: 'Bank', category: '地方', icon: '🏦' },
  { id: 61, text: '超市', en: 'Supermarket', category: '地方', icon: '🏬' },
  { id: 62, text: '李鄭屋中心', en: 'Lei Cheng Uk Center', category: '地方', icon: '🏢' },
  { id: 63, text: '醫院', en: 'Hospital', category: '地方', icon: '🏥' },
  { id: 64, text: '酒樓', en: 'Chinese restaurant', category: '地方', icon: '🍽️' },
  { id: 65, text: '公園', en: 'Park', category: '地方', icon: '🌳' },
  { id: 66, text: '茶餐廳', en: 'Cha Chaan Teng', category: '地方', icon: '☕' },

  // 量詞 (Numbers) set1
  { id: 68, text: '十', en: 'ten', category: '量詞', icon: '🔟' },
  { id: 69, text: '百', en: 'hundred', category: '量詞', icon: '💯' },
  { id: 70, text: '千', en: 'thousand', category: '量詞', icon: '🔠' },
  { id: 71, text: '萬', en: 'ten thousand', category: '量詞', icon: '📊' },
    // 量詞 (Numbers) set2
  { id: 72, text: '分鐘', en: 'minutes', category: '量詞', icon: '⏱️' },
  { id: 73, text: '小時', en: 'hours', category: '量詞', icon: '⏰' },
  { id: 74, text: '日', en: 'days', category: '量詞', icon: '📅' },
  { id: 75, text: ' 星期', en: 'week', category: '量詞', icon: '📆' },
  { id: 76, text: '月', en: 'month', category: '量詞', icon: '🗓️' },
  { id: 77, text: '年', en: 'year', category: '量詞', icon: '📈' },
  { id: 78, text: '歲', en: 'years old', category: '量詞', icon: '🎂' },
    // 量詞 (Numbers) set3
  { id: 79, text: '斤', en: 'catty (0.5 kg)', category: '量詞', icon: '⚖️' },
  { id: 80, text: '両', en: 'tael (38 g)', category: '量詞', icon: '🏺' },
  { id: 81, text: '寸', en: 'inch', category: '量詞', icon: '📏' },
  { id: 82, text: '磅', en: 'pound', category: '量詞', icon: '⚖️' },
  { id: 83, text: '厘米', en: 'cm', category: '量詞', icon: '📐' },

  // 國家
  { id: 84, text: '香港', en: 'Hong Kong', category: '國家', icon: '/hk.jpg' },
  { id: 85, text: '中國', en: 'China', category: '國家', icon: '/china.jpg' },
  { id: 86, text: '台灣', en: 'Taiwan', category: '國家', icon: '/tw.jpg' },
  { id: 87, text: '韓國', en: 'Korea', category: '國家', icon: '/korea.jpg' },
  { id: 88, text: '日本', en: 'Japan', category: '國家', icon: '/japan.jpg' },
  { id: 89, text: '歐美', en: 'Western', category: '國家', icon: '/foreign.jpg' },

  // 茶餐廳
  { id: 90, text: '蛋撻', en: 'Egg tart', category: '茶餐廳', icon: '/eggtart.jpg' },
  { id: 91, text: '菠蘿油', en: 'Pineapple bun with butter', category: '茶餐廳', icon: '/pineapplebutter.jpg' },
  { id: 92, text: '奶茶', en: 'Milk tea', category: '茶餐廳', icon: '/milktea.jpg' },
  { id: 93, text: '檸茶', en: 'Lemon tea', category: '茶餐廳', icon: '/lemontea.jpg' },
  { id: 94, text: '西多士', en: 'French toast', category: '茶餐廳', icon: '/frenchtoast.jpg' },
  { id: 95, text: '雞髀', en: 'Chicken thigh', category: '茶餐廳', icon: '/chicken.jpg' },
  { id: 96, text: '紅豆冰', en: 'Red bean ice', category: '茶餐廳', icon: '/redbeanice.jpg' },
  { id: 97, text: '雪菜肉絲米粉', en: 'Shredded Pork & Pickled Vegetable Rice Noodle Soup', category: '茶餐廳', icon: '/noodles.jpg' },

  // 電視節目
  { id: 98, text: '東張西望', en: 'Scoop', category: '電視節目', icon: '/eastwest.jpg' },
  { id: 99, text: 'viuTV', en: '', category: '電視節目', icon: '/viutv.jpg' },
  { id: 100, text: 'TVB', en: '', category: '電視節目', icon: '/tvb.jpg' },
  { id: 101, text: '82台', en: 'Channel 82', category: '電視節目', icon: '/82.jpg' },
  { id: 102, text: '99台', en: 'Channel 99', category: '電視節目', icon: '/99.jpg' },
  { id: 103, text: '喜劇', en: 'Comedy', category: '電視節目', icon: '/comedy.jpg ' },
  { id: 104, text: '綜藝', en: 'Variety show', category: '電視節目', icon: '/varietyshow.jpg' },
  { id: 105, text: '偶像劇', en: 'Drama', category: '電視節目', icon: '/drama.jpg' },
  { id: 106, text: '電影', en: 'Movie', category: '電視節目', icon: '/movie.jpg' },
  { id: 107, text: '新聞', en: 'News', category: '電視節目', icon: '/news.jpg' },
  { id: 108, text: '記錄片', en: 'Documentary', category: '電視節目', icon: '/documentary.jpg' },
  { id: 109, text: '飲食節目', en: 'Food show', category: '電視節目', icon: '/foodie.jpg' },
  { id: 110, text: '音樂節目', en: 'Music show', category: '電視節目', icon: '/music.jpg' },
  { id: 111, text: '動畫', en: 'Cartoon', category: '電視節目', icon: '/cartoon.jpg' },

  // twt2026 活動 Events
  { id: 112, text: '探朋友', en: 'Visiting', category: '活動', icon: '/Events/Visiting.jpg' },
  { id: 113, text: '買嘢', en: 'Buying', category: '活動', icon: '/Events/Buying.jpg' },
  { id: 114, text: '食嘢', en: 'Eating', category: '活動', icon: '/Events/Eating.jpg' },
  { id: 115, text: '返工', en: 'Working', category: '活動', icon: '/Events/Working.jpg' },

  // twt2026 Time
  { id: 116, text: '前日', en: 'Day before yesterday', category: '時間/Time', icon: '/twt2026_Time/前日Day before yesterday.png' },
  { id: 117, text: '昨天', en: 'Yesterday', category: '時間/Time', icon: '/twt2026_Time/昨天Yesterday.png' },
  { id: 118, text: '星期一', en: 'Monday', category: '時間/Time', icon: '/twt2026_Time/星期一 Monday.png' },
  { id: 119, text: '星期二', en: 'Tuesday', category: '時間/Time', icon: '/twt2026_Time/星期二 Tuesday.png' },
  { id: 120, text: '星期三', en: 'Wednesday', category: '時間/Time', icon: '/twt2026_Time/星期三 Wednesday.png' },
  { id: 121, text: '星期四', en: 'Thursday', category: '時間/Time', icon: '/twt2026_Time/星期四 Thursday.png' },
  { id: 122, text: '星期五', en: 'Friday', category: '時間/Time', icon: '/twt2026_Time/星期五 Friday.png' },
  { id: 123, text: '星期六', en: 'Saturday', category: '時間/Time', icon: '/twt2026_Time/星期六 Saturday.png' },
  { id: 124, text: '星期日', en: 'Sunday', category: '時間/Time', icon: '/twt2026_Time/星期日Sunday.png' },


  // twt2026 MTR 將軍澳綫
  // { id: 125, text: '去', en: 'Go to', category: '將軍澳綫', icon: '/twt2026_MTR/去 go to.png' },
  // { id: 126, text: '將軍澳', en: 'Tseung Kwan O', category: '將軍澳綫', icon: '/twt2026_MTR/將軍澳Tseung Kwan O.jpeg' },
  // { id: 127, text: '坑口', en: 'Hang Hau', category: '將軍澳綫', icon: '/twt2026_MTR/坑口Hang Hau.jpeg' },
  // { id: 128, text: '寶琳', en: 'Po Lam', category: '將軍澳綫', icon: '/twt2026_MTR/寶琳 Po Lam.jpeg' },


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
  '量詞': '🔢',
  '國家': '🌍',
  '茶餐廳': '☕',
  '電視節目': '📺',
  '活動': '🎮',
};

const CATEGORY_LABELS: Record<string, string> = {
  '全部': 'All',
  '日常': 'Daily',
  '飲食': 'Food & Drink',
  '醫療': 'Medical',
  '情緒': 'Feelings',
  '求助': 'Time and weather',
  '個人物品': 'Personal Items',
  '家居用品': 'Household Items',
  '水果': 'Fruits',
  '地方': 'Places',
  '量詞': 'Numbers',
  '國家': 'Countries',
  '茶餐廳': 'Cha Chaan Teng',
  '電視節目': 'TV Programs',
  '活動': 'Events',
};

const DISPLAY_CATEGORIES = ['個人物品', '家居用品', '量詞', '水果', '地方'] as const;

// 量詞 (Numbers)
const MEASURE_WORD_CLASSIFIERS = [
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
  { text: '蚊', en: 'dollars', icon: '💲' },
  { text: '斤', en: 'catty (0.5 kg)', icon: '⚖️' },
  { text: '両', en: 'tael (38 g)', icon: '🏺' },
  { text: '寸', en: 'inch', icon: '📏' },
  { text: '磅', en: 'pound', icon: '⚖️' },
  { text: '厘米', en: 'cm', icon: '📐' },
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
    { text: '換衫', en: 'to change clothes', icon: '👕' },
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
   '😊', '❤️', '👋', '🙏', '👩🏻', '👨🏻', '🏥', '😄', '🆘', '🛏️',
  '👜', '🏠', '🍎', '📍', '🚻', '🍽️', '👨‍⚕️', '💊', '📺', '🚪',
  '❄️', '🔥', '💡', '🐶', '🍴', '🍇', '🍊', '🍍', '🏢', '🌳',
  '☕', '🎓', '🎨', '⚽', '🎮', '🎵', '📚', '🏃', '🚗', '✈️',
  '🎁', '🎪', '🎭', '🎬', '🎸', '🎹', '🎤', '🏋️', '⛹️', '🚍',
  '🧘', '🚇', '🌏', '🏊', '🚆', '🤺', '🏇', '🎿',
];

type CustomPhrase = (typeof PHRASES)[0];

export default function AACApp() {
    // Helper to filter out duplicate ids (keep first occurrence)
    function filterUniqueById(phrases: CustomPhrase[]) {
      const seen = new Set();
      return phrases.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    }
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [user, setUser] = useState<{ 
    id?: string;
    email?: string; 
    loginCode?: string; 
    role: 'admin' | 'user';
    customizations?: {
      favorites: string[];
      customPhrases: any[];
      customCategoryIcons: Record<string, string>;
      customCategoryNames: Record<string, { zh: string; en: string }>;
    };
  } | null>(null);
  const [showLoginCodeModal, setShowLoginCodeModal] = useState(false);
  const [loginCode, setLoginCode] = useState('');
  const [loginUserEmail, setLoginUserEmail] = useState(''); // Email for regular user login
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
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
    userEmail?: string; // Email provided by user during login
    lastLoginAt?: string; // Last login timestamp
    role: 'admin' | 'user';
    createdAt: string;
    trialType: 'unlimited' | '14days' | '30days' | 'notrial';
    trialStartDate?: string;
    customizations?: {
      favorites: string[];
      customPhrases: any[];
      customCategoryIcons: Record<string, string>;
      customCategoryNames: Record<string, { zh: string; en: string }>;
    };
  }>>([]);
  
  // Login history for admin dashboard
  const [loginHistory, setLoginHistory] = useState<Array<{
    id: string;
    loginCode: string;
    userEmail?: string;
    loggedInAt: string;
    trialType: string;
    createdAt: string;
  }>>([]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserType, setNewUserType] = useState<'admin' | 'user'>('user');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserLoginCode, setNewUserLoginCode] = useState('');
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<'admin' | 'user'>('user');
  const [editingUserTrial, setEditingUserTrial] = useState<'unlimited' | '14days' | '30days' | 'notrial'>('14days');

  const [selectedCategory, setSelectedCategory] = useState<string>(DISPLAY_CATEGORIES[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [numberText, setNumberText] = useState('');
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
    newCategoryEN: '',
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
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]); // Track category order
  const [deletedCategories, setDeletedCategories] = useState<string[]>([]); // Track deleted categories
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<string | null>(null);
  const [editingCategoryIcon, setEditingCategoryIcon] = useState<Record<string, boolean>>({}); // Track which category is editing icon
  const [editingCategoryText, setEditingCategoryText] = useState<Record<string, boolean>>({}); // Track which category is editing text

  // Measure Word States
  const [showMeasureWord, setShowMeasureWord] = useState(false);

  // Vocab Container Size State
  const [vocabContainerSize, setVocabContainerSize] = useState(1.0); // Scale factor for vocab containers

  // Edit Mode States
  const [editVocabMode, setEditVocabMode] = useState(false);
  const [phraseOrder, setPhraseOrder] = useState<Record<string, number[]>>({}); // category -> ordered phrase ids
  const [deletedPhraseIds, setDeletedPhraseIds] = useState<number[]>([]); // Track deleted phrase IDs (both built-in and custom)
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState<{ id: number; text: string; en: string } | null>(null);

  // ========== UTILITY FUNCTIONS ==========
  const getUniqueCategories = () => {
    if (hasFullAccess()) {
      // Show all categories when logged in, including custom categories
      const standardCategories = Object.keys(CATEGORY_ICONS).filter(cat => cat !== '全部');
      const customCategories = Object.keys(customCategoryNames);
      let allCategories = [...new Set([...standardCategories, ...customCategories])];
      
      // Filter out deleted categories
      allCategories = allCategories.filter(cat => !deletedCategories.includes(cat));
      
      // Apply custom ordering if available
      if (categoryOrder.length > 0) {
        const ordered: string[] = [];
        const unordered: string[] = [];
        
        categoryOrder.forEach(cat => {
          if (allCategories.includes(cat)) {
            ordered.push(cat);
          }
        });
        
        allCategories.forEach(cat => {
          if (!categoryOrder.includes(cat)) {
            unordered.push(cat);
          }
        });
        
        return [...ordered, ...unordered];
      }
      
      return allCategories;
    }
    // Show limited categories when not logged in
    return [...DISPLAY_CATEGORIES].filter(cat => !deletedCategories.includes(cat));
  };

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

  const handleVocabSelection = (phrase: { text: string; en: string; category?: string }) => {
    let textToAdd = phrase.text;
    // Add 去 prefix only for 地方 category in custom sentences
    if (phrase.category === '地方' && !phrase.text.startsWith('去')) {
      textToAdd = `去${phrase.text}`;
    }
    setCustomText(currentStarter + textToAdd);
    setShowVocabSelector(false);
  };

  const handleMeasureWordSelected = (measureWord: string, english: string) => {
    setNumberText(prev => prev + measureWord);
  };

  const handleCustomSpeak = (englishOverride?: string, forceCustomText?: boolean) => {
    let textToSpeak = forceCustomText ? customText : (selectedCategory === '量詞' ? numberText : customText);
    if (speechLanguage === 'en-US') {
      if (englishOverride) {
        textToSpeak = englishOverride;
      } else if (!forceCustomText && selectedCategory === '量詞') {
        // For number category, translate to English
        const translated = translateNumberToEnglish(numberText);
        textToSpeak = translated || numberText;
      }
    }
    if (textToSpeak.trim()) {
      speak(textToSpeak);
    }
  };

  const speak = (text: string, rateOverride?: number) => {
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
    
    utterance.rate = rateOverride ?? speechRate;
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

  const speakAtRate = (text: string, rate: number) => {
    speak(text, rate);
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
    // Check if login code is "admin" - open admin login modal
    if (loginCode.toLowerCase() === 'admin') {
      setShowLoginCodeModal(false);
      setLoginCode('');
      setLoginUserEmail('');
      setVerificationCode('');
      setIsCodeSent(false);
      setIsSendingCode(false);
      setShowLoginModal(true);
      return;
    }
    // Email and verification code are always required for user login
    if (!loginUserEmail) {
      alert('請輸入電子郵件 / Please enter email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginUserEmail)) {
      alert('請輸入有效的電子郵件格式 / Please enter a valid email format');
      return;
    }
    if (!verificationCode) {
      alert('請輸入驗證碼 / Please enter verification code');
      return;
    }
    if (!isCodeSent) {
      alert('請先取得驗證碼 / Please request a verification code first');
      return;
    }
    verifyUserLogin('user', loginCode, undefined, loginUserEmail, verificationCode);
  };

  const verifyUserLogin = async (
    role: 'admin' | 'user',
    loginData: string,
    password?: string,
    userEmail?: string,
    emailVerificationCode?: string
  ) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          role === 'admin'
            ? { email: loginData, password, role }
            : {
                loginCode: loginData,
                role,
                userEmail,
                verificationCode: emailVerificationCode,
              }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Authentication failed');
        return;
      }

      setUser(result.user);
      
      // Load user customizations if available
      if (result.userData?.customizations) {
        const customizations = result.userData.customizations;
        setFavorites(customizations.favorites || ['個人物品', '家居用品', '水果', '地方']);
        setCustomPhrases(customizations.customPhrases || []);
        setCustomCategoryIcons(customizations.customCategoryIcons || {});
        setCustomCategoryNames(customizations.customCategoryNames || {});
        setPhraseOrder(customizations.phraseOrder || {});
        setDeletedPhraseIds(customizations.deletedPhraseIds || []);
        setCategoryOrder(customizations.categoryOrder || []);
        setDeletedCategories(customizations.deletedCategories || []);
      }
      
      // Store user with id for future database updates
      const userWithId = {
        ...result.user,
        id: result.userData?.id
      };
      setUser(userWithId);
      // Save to localStorage for session persistence
      localStorage.setItem('aac-user-session', JSON.stringify(userWithId));
      
      setShowLoginCodeModal(false);
      setShowLoginModal(false);
      setLoginCode('');
      setLoginUserEmail('');
      setVerificationCode('');
      setIsCodeSent(false);
      setIsSendingCode(false);
      setLoginEmail('');
      setLoginPassword('');
      
      // Refresh user list to show updated login time
      loadUsersFromAPI();
      
      // Open admin dashboard if admin user logs in
      if (result.user.role === 'admin') {
        setShowDashboard(true);
      }
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

  const handleLoginCodeChange = (code: string) => {
    setLoginCode(code);
    setVerificationCode('');
    setIsCodeSent(false);
  };

  const handleLoginUserEmailChange = (email: string) => {
    setLoginUserEmail(email);
    setVerificationCode('');
    setIsCodeSent(false);
  };

  const handleSendVerificationCode = async () => {
    if (!loginCode) {
      alert('請輸入登入碼 / Please enter login code');
      return;
    }
    if (loginCode.toLowerCase() === 'admin') {
      alert('管理員登入不需要驗證碼 / Admin login does not require a verification code');
      return;
    }
    if (!loginUserEmail) {
      alert('請輸入電子郵件 / Please enter email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginUserEmail)) {
      alert('請輸入有效的電子郵件格式 / Please enter a valid email format');
      return;
    }

    try {
      setIsSendingCode(true);
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginUserEmail, loginCode }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || 'Failed to send verification code');
        return;
      }

      setIsCodeSent(true);
      alert('驗證碼已寄出 / Verification code sent');
    } catch (error) {
      console.error('Send verification code error:', error);
      alert('無法寄出驗證碼 / Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  useEffect(() => {
    if (!showLoginCodeModal) {
      setVerificationCode('');
      setIsCodeSent(false);
      setIsSendingCode(false);
    }
  }, [showLoginCodeModal]);

  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？\nAre you sure you want to log out?')) {
      setUser(null);
      // Clear user session from localStorage
      localStorage.removeItem('aac-user-session');
      // Don't reset customizations - they're saved in database and will reload on next login
    }
  };

  // Sync customizations to database
  const syncCustomizationsToDatabase = async () => {
    if (!user?.id) return;
    
    try {
      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customizations: {
            favorites,
            customPhrases,
            customCategoryIcons,
            customCategoryNames,
          }
        }),
      });
      console.log('Customizations synced to database');
    } catch (error) {
      console.error('Failed to sync customizations:', error);
    }
  };

  const toggleFavorite = async (category: string) => {
    setFavorites((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const resetAddVocabForm = () => {
    setAddVocabInput({ text: '', en: '', icon: '📝', category: '', newCategory: '', newCategoryEN: '' });
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

    // If creating a new category, ensure both zh and en names are provided
    if (addVocabInput.newCategory && !addVocabInput.category && !addVocabInput.newCategoryEN) {
      setVocabError('請填寫分類的中英文名稱 / Please fill in both Chinese and English category names');
      return;
    }

    // Generate a unique id not present in PHRASES or customPhrases
    const usedIds = new Set([...PHRASES, ...customPhrases].map((p) => p.id));
    let nextId = 1;
    while (usedIds.has(nextId)) {
      nextId++;
    }
    const newPhrase = {
      id: nextId,
      text: addVocabInput.text,
      en: addVocabInput.en,
      category,
      icon: addVocabInput.icon,
    };

    const updatedCustomCategoryIcons = addVocabInput.newCategory && !addVocabInput.category
      ? { ...customCategoryIcons, [category]: newCategoryEmoji }
      : customCategoryIcons;
    
    const updatedCustomCategoryNames = addVocabInput.newCategory && !addVocabInput.category
      ? { ...customCategoryNames, [category]: { zh: addVocabInput.newCategory, en: addVocabInput.newCategoryEN } }
      : customCategoryNames;

    if (addVocabInput.newCategory && !addVocabInput.category) {
      setCustomCategoryIcons(updatedCustomCategoryIcons);
      setCustomCategoryNames(updatedCustomCategoryNames);
    }

    const updatedCustomPhrases = [...customPhrases, newPhrase];
    setCustomPhrases(updatedCustomPhrases);
    setLastAddedWord(addVocabInput.text);
    setVocabSuccess(true);
    setVocabError('');

    // Switch to the category of the newly added vocab so it is visible
    setSelectedCategory(category);

    // Save to localStorage immediately as backup
    const customizationsBackup = {
      favorites,
      customPhrases: updatedCustomPhrases,
      customCategoryIcons: updatedCustomCategoryIcons,
      customCategoryNames: updatedCustomCategoryNames,
      phraseOrder,
      deletedPhraseIds,
      categoryOrder,
      deletedCategories,
    };
    try {
      localStorage.setItem('aac-customizations-backup', JSON.stringify(customizationsBackup));
    } catch (error) {
      console.warn('Failed to save to localStorage (quota exceeded):', error);
      // Continue without localStorage backup
    }

    // Always sync to database after adding vocab
    if (user?.id) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customizations: customizationsBackup }),
        });
        console.log('Customizations synced immediately after adding vocab');
      } catch (error) {
        console.error('Failed to sync customizations:', error);
      }
    }

    // Auto-dismiss success message after 3 seconds
    setTimeout(() => {
      setVocabSuccess(false);
    }, 3000);

    // Close the panel after 3.5 seconds (after success message disappears)
    setTimeout(() => {
      resetAddVocabForm();
      setShowAddVocab(false);
    }, 3500);
  };

  // Handle reordering phrases in edit mode (only update state, save when exiting edit mode)
  const handleReorderPhrases = (category: string, newOrder: number[]) => {
    const updatedOrder = {
      ...phraseOrder,
      [category]: newOrder,
    };
    setPhraseOrder(updatedOrder);
    // Don't save to localStorage here - will save when exiting edit mode to avoid quota errors
  };

  // Handle deleting a phrase (both built-in and custom)
  const handleDeletePhrase = async (phraseId: number) => {
    // Find the phrase to delete (could be from PHRASES or customPhrases)
    const allPhrasesList = [...PHRASES, ...customPhrases];
    const phraseToDelete = allPhrasesList.find((p) => p.id === phraseId);
    if (!phraseToDelete) {
      return;
    }

    // Add to deleted list
    const updatedDeletedIds = [...deletedPhraseIds, phraseId];
    setDeletedPhraseIds(updatedDeletedIds);

    // If it's a custom phrase, also remove from customPhrases
    const updatedCustomPhrases = customPhrases.filter((p) => p.id !== phraseId);
    if (updatedCustomPhrases.length !== customPhrases.length) {
      setCustomPhrases(updatedCustomPhrases);
    }

    // Update phrase order for the category
    const category = phraseToDelete.category;
    if (phraseOrder[category]) {
      const updatedOrder = phraseOrder[category].filter((id) => id !== phraseId);
      setPhraseOrder((prev) => ({
        ...prev,
        [category]: updatedOrder,
      }));
    }

    // Save to localStorage
    const customizationsBackup = {
      favorites,
      customPhrases: updatedCustomPhrases,
      customCategoryIcons,
      customCategoryNames,
      phraseOrder,
      deletedPhraseIds: updatedDeletedIds,
      categoryOrder,
      deletedCategories,
    };
    try {
      localStorage.setItem('aac-customizations-backup', JSON.stringify(customizationsBackup));
    } catch (error) {
      console.warn('Failed to save to localStorage (quota exceeded):', error);
      // Continue without localStorage backup
    }

    // Always sync to database after deleting vocab
    if (user?.id) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customizations: customizationsBackup }),
        });
      } catch (error) {
        console.error('Failed to sync customizations:', error);
      }
    }

    setDeleteConfirmPhrase(null);
  };

  // Handle reordering categories
  const handleReorderCategories = (newOrder: string[]) => {
    setCategoryOrder(newOrder);
  };

  // Handle deleting a category
  const handleDeleteCategory = async (category: string) => {
    // Don't allow deleting certain essential categories
    if (category === '全部' || category === '量詞') {
      alert('無法刪除此分類 / Cannot delete this category');
      return;
    }

    const updatedDeletedCategories = [...deletedCategories, category];
    setDeletedCategories(updatedDeletedCategories);

    // Remove from favorites if it's there
    const updatedFavorites = favorites.filter(fav => fav !== category);
    setFavorites(updatedFavorites);

    // Remove from category order
    const updatedCategoryOrder = categoryOrder.filter(cat => cat !== category);
    setCategoryOrder(updatedCategoryOrder);

    // If it's a custom category, remove custom icon and name
    const updatedCustomCategoryIcons = { ...customCategoryIcons };
    const updatedCustomCategoryNames = { ...customCategoryNames };
    delete updatedCustomCategoryIcons[category];
    delete updatedCustomCategoryNames[category];
    setCustomCategoryIcons(updatedCustomCategoryIcons);
    setCustomCategoryNames(updatedCustomCategoryNames);

    // Save to localStorage
    const customizationsBackup = {
      favorites: updatedFavorites,
      customPhrases,
      customCategoryIcons: updatedCustomCategoryIcons,
      customCategoryNames: updatedCustomCategoryNames,
      phraseOrder,
      deletedPhraseIds,
      categoryOrder: updatedCategoryOrder,
      deletedCategories: updatedDeletedCategories,
    };
    try {
      localStorage.setItem('aac-customizations-backup', JSON.stringify(customizationsBackup));
    } catch (error) {
      console.warn('Failed to save to localStorage (quota exceeded):', error);
    }

    // Sync to database
    if (user?.id) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customizations: customizationsBackup }),
        });
      } catch (error) {
        console.error('Failed to sync customizations:', error);
      }
    }

    setDeleteConfirmCategory(null);
    
    // If deleted category was selected, switch to first available category
    if (selectedCategory === category) {
      const availableCategories = getUniqueCategories();
      if (availableCategories.length > 0) {
        setSelectedCategory(availableCategories[0]);
      }
    }
  };

  // Handle updating category icon
  const handleUpdateCategoryIcon = async (category: string, icon: string) => {
    const updatedCustomCategoryIcons = {
      ...customCategoryIcons,
      [category]: icon,
    };
    setCustomCategoryIcons(updatedCustomCategoryIcons);
    setEditingCategoryIcon(prev => ({ ...prev, [category]: false }));

    // Save to localStorage
    const customizationsBackup = {
      favorites,
      customPhrases,
      customCategoryIcons: updatedCustomCategoryIcons,
      customCategoryNames,
      phraseOrder,
      deletedPhraseIds,
      deletedCategories,
    };
    try {
      localStorage.setItem('aac-customizations-backup', JSON.stringify(customizationsBackup));
    } catch (error) {
      console.warn('Failed to save to localStorage (quota exceeded):', error);
    }

    // Sync to database
    if (user?.id) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customizations: customizationsBackup }),
        });
      } catch (error) {
        console.error('Failed to sync customizations:', error);
      }
    }
  };

  // Handle updating category name
  const handleUpdateCategoryName = async (category: string, zh: string, en: string) => {
    const updatedCustomCategoryNames = {
      ...customCategoryNames,
      [category]: { zh, en },
    };
    setCustomCategoryNames(updatedCustomCategoryNames);
    setEditingCategoryText(prev => ({ ...prev, [category]: false }));

    // Save to localStorage
    const customizationsBackup = {
      favorites,
      customPhrases,
      customCategoryIcons,
      customCategoryNames: updatedCustomCategoryNames,
      phraseOrder,
      deletedPhraseIds,
      deletedCategories,
    };
    try {
      localStorage.setItem('aac-customizations-backup', JSON.stringify(customizationsBackup));
    } catch (error) {
      console.warn('Failed to save to localStorage (quota exceeded):', error);
    }

    // Sync to database
    if (user?.id) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customizations: customizationsBackup }),
        });
      } catch (error) {
        console.error('Failed to sync customizations:', error);
      }
    }
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

    const newUser = {
      ...(newUserType === 'admin' ? { email: newUserEmail, password: newUserPassword } : { loginCode: newUserLoginCode }),
      role: newUserType,
      trialType: newUserType === 'admin' ? 'unlimited' : '14days',
      trialStartDate: newUserType === 'user' ? new Date().toISOString() : undefined,
    };

    try {
      // Save to database via API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || '新增用戶失敗 / Failed to add user');
        return;
      }

      const createdUser = await response.json();
      
      // Update local state with the created user
      setAllUsers((prev) => [...prev, createdUser]);
      setShowAddUserModal(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserLoginCode('');
      setNewUserType('user');
      
      alert('用戶已成功新增 / User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('新增用戶失敗 / Failed to add user');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('刪除用戶失敗 / Failed to delete user');
        return;
      }

      setAllUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteUserConfirm(null);
      alert('用戶已刪除 / User deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('刪除用戶失敗 / Failed to delete user');
    }
  };

  const updateUserRole = async (id: string, role: 'admin' | 'user') => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        alert('更新用戶角色失敗 / Failed to update user role');
        return;
      }

      setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('更新用戶角色失敗 / Failed to update user role');
    }
  };

  const updateUserTrial = async (id: string, trial: 'unlimited' | '14days' | '30days' | 'notrial') => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trialType: trial, 
          trialStartDate: new Date().toISOString() 
        }),
      });

      if (!response.ok) {
        alert('更新試用期失敗 / Failed to update trial period');
        return;
      }

      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, trialType: trial, trialStartDate: new Date().toISOString() }
            : u
        )
      );
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating trial:', error);
      alert('更新試用期失敗 / Failed to update trial period');
    }
  };

  // ========== USEEFFECT HOOKS ==========
  
  const loadUsersFromAPI = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        setAllUsers(users);
        localStorage.setItem('aac-users', JSON.stringify(users));
      }
      
      // Also load login history
      const historyResponse = await fetch('/api/login-history');
      if (historyResponse.ok) {
        const history = await historyResponse.json();
        setLoginHistory(history);
      }
    } catch (error) {
      const savedUsers = localStorage.getItem('aac-users');
      if (savedUsers) {
        setAllUsers(JSON.parse(savedUsers));
      }
    }
  };
  
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

    loadUsersFromAPI();

    // Restore user session from localStorage
    const savedUserSession = localStorage.getItem('aac-user-session');
    if (savedUserSession) {
      try {
        const userData = JSON.parse(savedUserSession);
        // Load user customizations from database before setting user to prevent flash
        if (userData.id) {
          fetch(`/api/users/${userData.id}`)
            .then(res => res.json())
            .then(result => {
              if (result.customizations) {
                setFavorites(result.customizations.favorites || ['個人物品', '家居用品', '水果', '地方']);
                setCustomPhrases(result.customizations.customPhrases || []);
                setCustomCategoryIcons(result.customizations.customCategoryIcons || {});
                setCustomCategoryNames(result.customizations.customCategoryNames || {});
              } else if (!result.customizations) {
                // If database doesn't have customizations, try localStorage backup
                const backupCustomizations = localStorage.getItem('aac-customizations-backup');
                if (backupCustomizations) {
                  try {
                    const backup = JSON.parse(backupCustomizations);
                    setFavorites(backup.favorites || ['個人物品', '家居用品', '水果', '地方']);
                    setCustomPhrases(backup.customPhrases || []);
                    setCustomCategoryIcons(backup.customCategoryIcons || {});
                    setCustomCategoryNames(backup.customCategoryNames || {});
                    setPhraseOrder(backup.phraseOrder || {});
                    setDeletedPhraseIds(backup.deletedPhraseIds || []);
                    setCategoryOrder(backup.categoryOrder || []);
                    setDeletedCategories(backup.deletedCategories || []);
                  } catch (e) {
                    console.error('Error parsing backup customizations:', e);
                  }
                }
              }
              // Set user AFTER customizations are loaded
              setUser(userData);
            })
            .catch(err => {
              console.error('Error loading user customizations:', err);
              // Try localStorage backup on error
              const backupCustomizations = localStorage.getItem('aac-customizations-backup');
              if (backupCustomizations) {
                try {
                  const backup = JSON.parse(backupCustomizations);
                  setFavorites(backup.favorites || ['個人物品', '家居用品', '水果', '地方']);
                  setCustomPhrases(backup.customPhrases || []);
                  setCustomCategoryIcons(backup.customCategoryIcons || {});
                  setCustomCategoryNames(backup.customCategoryNames || {});
                } catch (e) {
                  console.error('Error parsing backup customizations:', e);
                }
              }
              // Still set user even if customizations fail to load
              setUser(userData);
            });
        } else {
          // No user id, just set user
          setUser(userData);
        }
      } catch (error) {
        console.error('Error restoring user session:', error);
        localStorage.removeItem('aac-user-session');
      }
    }

    // Load device-specific settings only (not user-specific data)
    const savedHistory = localStorage.getItem('aac-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
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

    // Listen for custom event to close vocab success message
    const handleCloseVocabSuccess = () => {
      setVocabSuccess(false);
    };
    window.addEventListener('closeVocabSuccess', handleCloseVocabSuccess);
    
    return () => {
      window.removeEventListener('closeVocabSuccess', handleCloseVocabSuccess);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('aac-users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Removed: No longer saving user session to localStorage
  // User customizations now loaded from database on login

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

  // Sync customizations to database when they change (debounced)
  useEffect(() => {
    if (!user?.id) return;
    
    const timeoutId = setTimeout(() => {
      syncCustomizationsToDatabase();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [favorites, customPhrases, customCategoryIcons, customCategoryNames]);

  // Translate for display - keep numbers as digits
  const translateNumberForDisplay = (text: string): string => {
    if (!text) return '';
    
    // Unit translations
    const unitTranslations: Record<string, string> = {
      '蚊': 'dollars',
      '斤': 'catty',
      '両': 'tael',
      '寸': 'inches',
      '磅': 'pounds',
      '厘米': 'centimeters',
      '日': 'days',
      '月': 'months',
      '年': 'years',
      '歲': 'years old',
      '分鐘': 'minutes',
      '小時': 'hours',
      '禮拜': 'weeks'
    };
    
    let result = text;
    for (const [unit, translation] of Object.entries(unitTranslations)) {
      result = result.replace(unit, ' ' + translation);
    }
    
    return result.trim();
  };

  // Translate numbers and units to English (for speech)
  const translateNumberToEnglish = (text: string): string => {
    if (!text) return '';
    
    // Convert number to words
    const numberToWords = (num: number): string => {
      if (num === 0) return 'zero';
      
      const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
      const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return tens[ten] + (one ? ' ' + ones[one] : '');
      }
      if (num < 1000) {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        return ones[hundred] + ' hundred' + (remainder ? ' ' + numberToWords(remainder) : '');
      }
      if (num < 1000000) {
        const thousand = Math.floor(num / 1000);
        const remainder = num % 1000;
        return numberToWords(thousand) + ' thousand' + (remainder ? ' ' + numberToWords(remainder) : '');
      }
      return num.toString();
    };
    
    // Unit translations
    const unitTranslations: Record<string, string> = {
      '蚊': 'dollars',
      '斤': 'catty',
      '両': 'tael',
      '寸': 'inches',
      '磅': 'pounds',
      '厘米': 'centimeters',
      '日': 'days',
      '月': 'months',
      '年': 'years',
      '歲': 'years old',
      '分鐘': 'minutes',
      '小時': 'hours',
      '禮拜': 'weeks'
    };
    
    // Extract numbers and units
    let result = '';
    let currentNumber = '';
    let i = 0;
    
    while (i < text.length) {
      const char = text[i];
      
      // Check if it's a digit or decimal point
      if (/[0-9.]/.test(char)) {
        currentNumber += char;
        i++;
      } else {
        // Process accumulated number
        if (currentNumber) {
          if (currentNumber.includes('.')) {
            // Handle decimal numbers
            const parts = currentNumber.split('.');
            const wholePart = parseInt(parts[0]);
            result += numberToWords(wholePart) + ' point';
            for (const digit of parts[1]) {
              const digitWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
              result += ' ' + digitWords[parseInt(digit)];
            }
          } else {
            const num = parseInt(currentNumber);
            result += numberToWords(num);
          }
          currentNumber = '';
        }
        
        // Check for multi-character units
        let matched = false;
        for (const [unit, translation] of Object.entries(unitTranslations)) {
          if (text.substring(i).startsWith(unit)) {
            result += ' ' + translation;
            i += unit.length;
            matched = true;
            break;
          }
        }
        
        if (!matched) {
          i++;
        }
      }
    }
    
    // Process any remaining number
    if (currentNumber) {
      if (currentNumber.includes('.')) {
        const parts = currentNumber.split('.');
        const wholePart = parseInt(parts[0]);
        result += numberToWords(wholePart) + ' point';
        for (const digit of parts[1]) {
          const digitWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
          result += ' ' + digitWords[parseInt(digit)];
        }
      } else {
        const num = parseInt(currentNumber);
        result += numberToWords(num);
      }
    }
    
    return result.trim();
  };

  const resolveEnglishText = (text: string) => {
    const availableStarters = [...SENTENCE_STARTERS, ...ADDITIONAL_STARTERS];
    const customMatch = customPhrases.find((phrase) => phrase.text === text);
    if (customMatch?.en) {
      return customMatch.en;
    }
    if (PHRASE_TRANSLATIONS[text]) {
      return PHRASE_TRANSLATIONS[text];
    }
    const starterMatch = availableStarters.find((starter) => text.startsWith(starter.text));
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

  const allPhrasesRaw = [...PHRASES, ...customPhrases];
  const allPhrases = filterUniqueById(allPhrasesRaw);
  // Filter out deleted phrases
  const displayPhrases = allPhrases.filter((p) => !deletedPhraseIds.includes(p.id));

  // Apply custom ordering if available
  const getOrderedPhrases = (phrases: typeof allPhrases, category: string) => {
    const categoryOrder = phraseOrder[category];
    if (!categoryOrder || categoryOrder.length === 0) {
      return phrases;
    }

    // Create a map for quick lookup
    const phraseMap = new Map(phrases.map((p) => [p.id, p]));
    
    // Get ordered phrases first, then append any not in the order
    const ordered: typeof phrases = [];
    const unordered: typeof phrases = [];

    categoryOrder.forEach((id) => {
      const phrase = phraseMap.get(id);
      if (phrase) ordered.push(phrase);
    });

    phrases.forEach((phrase) => {
      if (!categoryOrder.includes(phrase.id)) {
        unordered.push(phrase);
      }
    });

    return [...ordered, ...unordered];
  };

  const categoryPhrases = displayPhrases.filter((p) => p.category === selectedCategory);
  const filteredPhrases = getOrderedPhrases(categoryPhrases, selectedCategory);
  const isGuest = !user;

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
          onClick={() => {
            const nextMenuOpen = !menuOpen;
            setMenuOpen(nextMenuOpen);
            if (nextMenuOpen) {
              setShowCustomPanel(false);
              setShowSettings(false);
              setShowHistory(false);
            }
          }}
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
            onClick={() => {
              const nextShowHistory = !showHistory;
              setShowHistory(nextShowHistory);
              if (nextShowHistory) {
                setShowSettings(false);
                setShowCustomPanel(false);
              }
            }}
            className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="歷史記錄 History"
          >
            <Icon emoji="⭐️" size={32} />
          </button>

          <button
            onClick={() => {
              const nextShowSettings = !showSettings;
              setShowSettings(nextShowSettings);
              if (nextShowSettings) {
                setShowHistory(false);
                setShowCustomPanel(false);
              }
            }}
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
        setEditCategoriesMode={async (mode) => {
          if (!mode && editCategoriesMode) {
            // Save category order when exiting edit mode
            try {
              const customizationsBackup = {
                favorites,
                customPhrases,
                customCategoryIcons,
                customCategoryNames,
                phraseOrder,
                deletedPhraseIds,
                categoryOrder,
                deletedCategories,
              };
              try {
                localStorage.setItem('aac-customizations-backup', JSON.stringify(customizationsBackup));
              } catch (storageError) {
                console.warn('Failed to save to localStorage (quota exceeded):', storageError);
              }
              
              if (user?.id) {
                await fetch(`/api/users/${user.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ customizations: customizationsBackup }),
                });
              }
            } catch (error) {
              console.error('Failed to save category order:', error);
            }
          }
          setEditCategoriesMode(mode);
        }}
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
        onReorderCategories={handleReorderCategories}
        onDeleteCategory={(category) => setDeleteConfirmCategory(category)}
        onUpdateCategoryIcon={handleUpdateCategoryIcon}
        onUpdateCategoryName={handleUpdateCategoryName}
        COMMON_EMOJIS={COMMON_EMOJIS}
        editingCategoryIcon={editingCategoryIcon}
        setEditingCategoryIcon={setEditingCategoryIcon}
        editingCategoryText={editingCategoryText}
        setEditingCategoryText={setEditingCategoryText}
        deleteConfirmCategory={deleteConfirmCategory}
        setDeleteConfirmCategory={setDeleteConfirmCategory}
      />

      {/* Login Modals Component */}
      <LoginModals
        showLoginCodeModal={showLoginCodeModal}
        setShowLoginCodeModal={setShowLoginCodeModal}
        loginCode={loginCode}
        setLoginCode={handleLoginCodeChange}
        loginUserEmail={loginUserEmail}
        setLoginUserEmail={handleLoginUserEmailChange}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isCodeSent={isCodeSent}
        isSendingCode={isSendingCode}
        handleSendVerificationCode={handleSendVerificationCode}
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
        loginHistory={loginHistory}
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
        vocabContainerSize={vocabContainerSize}
        setVocabContainerSize={setVocabContainerSize}
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
            newCategoryEmoji={newCategoryEmoji}
            setNewCategoryEmoji={setNewCategoryEmoji}
          />

          {/* Custom Sentence Panel Component */}
          <CustomSentencePanel
            showCustomPanel={showCustomPanel}
            setShowCustomPanel={setShowCustomPanel}
            setShowHistory={setShowHistory}
            setShowSettings={setShowSettings}
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
            speak={speak}
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
            customCategoryNames={customCategoryNames}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onCategoryClick={(category) => speak(category)}
          />

          {/* History Panel Component */}
          <HistoryPanel
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            history={history}
            speak={speak}
          />

          {/* Phrases Grid Component or Calculator */}
          {selectedCategory === '量詞' ? (
            // Calculator Interface for Numbers Category
            <div className="mt-8 p-6 bg-white rounded-3xl shadow-2xl">
              
              {/* Display Screen */}
              <div
                className="mb-4 p-4 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] rounded-2xl shadow-inner cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => handleCustomSpeak()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleCustomSpeak();
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white/90 font-semibold flex items-center gap-3">
                    <span className="text-3xl sm:text-3xl leading-1">🔊</span>
                    <span className="flex flex-col leading-[1.2] text-[1em] sm:text-[1em] gap-2 text-white/70">
                      <span>播</span>
                      <span>放</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-4xl sm:text-5xl font-bold text-white min-h-[60px] flex items-center justify-end">
                      {numberText || '0'}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      {numberText ? translateNumberForDisplay(numberText) : 'Enter number'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculator Buttons */}
              <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
                {/* Number Pad - Left Side */}
                <div className="w-full lg:w-[40%] lg:mr-[30px] lg:h-full lg:self-stretch flex flex-col">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 h-full lg:auto-rows-fr flex-1">
                    {/* Numbers 7-9, 4-6, 1-3 */}
                    {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setNumberText(prev => prev + String(num));
                          speakAtRate(String(num), 1.0);
                        }}
                        className="rounded-3xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white text-4xl sm:text-5xl font-bold shadow-lg hover:shadow-md hover:translate-y-1 active:shadow-sm active:translate-y-2 transition-all duration-200 transform flex items-center justify-center min-h-[80px] sm:min-h-[100px]"
                      >
                        {num}
                      </button>
                    ))}

                    {/* Decimal Point */}
                    <button
                      onClick={() => {
                        setNumberText(prev => prev + '.');
                        speakAtRate('.', 1.0);
                      }}
                      className="rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white text-4xl sm:text-5xl font-bold shadow-lg hover:shadow-md hover:translate-y-1 active:shadow-sm active:translate-y-2 transition-all duration-200 transform flex items-center justify-center min-h-[80px] sm:min-h-[100px]"
                    >
                      .
                    </button>

                     {/* Number 0 */}
                    <button
                      onClick={() => {
                        setNumberText(prev => prev + '0');
                        speakAtRate('0', 1.0);
                      }}
                      className="rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white text-4xl sm:text-5xl font-bold shadow-lg hover:shadow-md hover:translate-y-1 active:shadow-sm active:translate-y-2 transition-all duration-200 transform flex items-center justify-center min-h-[80px] sm:min-h-[100px]"
                    >
                      0
                    </button>

                    {/* Clear Button */}
                    <button
                      onClick={() => {
                        setNumberText('');
                        speakAtRate('清除', 1.0);
                      }}
                      className="rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-3xl sm:text-4xl font-bold shadow-lg hover:shadow-md hover:translate-y-1 active:shadow-sm active:translate-y-2 transition-all duration-200 transform flex items-center justify-center min-h-[80px] sm:min-h-[100px]"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Measure Words Section - Right Side */}
                <div className="w-full lg:w-[60%] flex flex-col gap-3 lg:h-full">
                {/* <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">
                  量詞 Measure Words
                </h3> */}
                
                {/* Large Units - Time Related */}
                <div className="flex-1 flex flex-col lg:max-h-[350px]">
                  <p className="text-lg font-bold text-gray-700 mb-2">時間 Time:</p>
                  <div className="space-y-3 lg:space-y-1.5 flex-1 flex flex-col justify-center">
                    {/* Row 1: 日 月 年 歲 */}
                    <div className="grid grid-cols-4 gap-3 lg:gap-1.5 justify-center">
                      {[...PHRASES, ...customPhrases].filter(p => ['日', '月', '年', '歲'].includes(p.text)).map((phrase) => (
                        <button
                          key={phrase.id}
                          onClick={() => {
                            if (isGuest) {
                              setShowLoginCodeModal(true);
                              return;
                            }
                            setNumberText(prev => prev + phrase.text);
                            const textToSpeak = speechLanguage === 'en-US' ? phrase.en : phrase.text;
                            speakAtRate(textToSpeak, 1.0);
                          }}
                          aria-disabled={isGuest}
                          className={`aspect-square rounded-full text-2xl sm:text-3xl lg:text-xl font-bold transition-all duration-200 transform flex flex-col items-center justify-center max-h-[100px] sm:min-h-[100px] lg:max-h-[100px] gap-0.5 lg:gap-0.5 cursor-pointer ${
                            isGuest
                              ? 'bg-gray-300 text-gray-500 shadow-inner'
                              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-md hover:translate-y-1 active:shadow-sm active:translate-y-2'
                          }`}
                        >
                          <span className="text-xl lg:text-lg">{phrase.icon}</span>
                          <span className="text-xl sm:text-2xl lg:text-lg">{phrase.text}</span>
                        </button>
                      ))}
                    </div>
                    {/* Row 2: 分鐘 小時 禮拜 */}
                    <div className="grid grid-cols-3 gap-3 lg:gap-1.5 justify-center">
                      {[...PHRASES, ...customPhrases].filter(p => ['分鐘', '小時', '禮拜'].includes(p.text)).map((phrase) => (
                        <button
                          key={phrase.id}
                          onClick={() => {
                            if (isGuest) {
                              setShowLoginCodeModal(true);
                              return;
                            }
                            setNumberText(prev => prev + phrase.text);
                            const textToSpeak = speechLanguage === 'en-US' ? phrase.en : phrase.text;
                            speakAtRate(textToSpeak, 1.0);
                          }}
                          aria-disabled={isGuest}
                          className={`aspect-square rounded-full text-2xl sm:text-3xl lg:text-xl font-bold transition-all duration-200 transform flex flex-col items-center justify-center max-h-[100px] sm:max-h-[100px] lg:max-h-[140px] gap-0.5 lg:gap-0.5 cursor-pointer ${
                            isGuest
                              ? 'bg-gray-300 text-gray-500 shadow-inner'
                              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-md hover:translate-y-1 active:shadow-sm active:translate-y-2'
                          }`}
                        >
                          <span className="text-xl lg:text-lg">{phrase.icon}</span>
                          <span className="text-xl sm:text-2xl lg:text-lg">{phrase.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Units */}
                <div className="flex-1 flex flex-col">
                  <p className="text-lg font-bold text-gray-700 mb-2">單位 Units:</p>
                  <div className="grid grid-cols-3 gap-3 flex-1 content-center justify-center">
                    {MEASURE_WORD_UNITS.map((unit) => (
                      <button
                        key={unit.text}
                        onClick={() => {
                          if (isGuest) {
                            setShowLoginCodeModal(true);
                            return;
                          }
                          setNumberText(prev => prev + unit.text);
                          const textToSpeak = speechLanguage === 'en-US' ? unit.en : unit.text;
                          speakAtRate(textToSpeak, 1.0);
                        }}
                        aria-disabled={isGuest}
                        className={`aspect-square rounded-full text-2xl sm:text-3xl font-bold transition-all duration-200 transform flex flex-col items-center justify-center max-h-[100px] sm:max-h-[140px] gap-1 cursor-pointer ${
                          isGuest
                            ? 'bg-gray-300 text-gray-500 shadow-inner'
                            : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-md hover:translate-y-1 active:shadow-sm active:translate-y-2'
                        }`}
                      >
                        <span>{unit.icon}</span>
                        <span className="text-xl sm:text-2xl">{unit.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => handleCustomSpeak()}
                  disabled={isLoading || !numberText}
                  className={`flex-1 p-6 rounded-2xl font-bold text-2xl shadow-xl transition-all duration-300 transform ${
                    isLoading || !numberText
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white hover:shadow-2xl hover:scale-105 active:scale-95'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-spin">⏳</span> 播放中...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      🔊 播放 Speak
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <PhrasesGrid
              filteredPhrases={filteredPhrases}
              speak={speak}
              isLoading={isLoading}
              user={user}
              CATEGORY_LABELS={CATEGORY_LABELS}
              selectedCategory={selectedCategory}
              setShowLoginModal={setShowLoginModal}
              setShowLoginCodeModal={setShowLoginCodeModal}
              editMode={editVocabMode}
              onReorder={(newOrder) => handleReorderPhrases(selectedCategory, newOrder)}
              onDeleteClick={(phrase) => setDeleteConfirmPhrase(phrase)}
              customPhrases={customPhrases}
              vocabContainerSize={vocabContainerSize}
            />
          )}

          {/* Edit Button - only show when category is selected and user has access */}
          {selectedCategory !== '全部' && selectedCategory !== '量詞' && hasFullAccess() && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={async () => {
                  if (editVocabMode) {
                    // Save phrase order when exiting edit mode
                    try {
                      const customizationsBackup = {
                        favorites,
                        customPhrases,
                        customCategoryIcons,
                        customCategoryNames,
                        phraseOrder,
                        deletedPhraseIds,
                        categoryOrder,
                        deletedCategories,
                      };
                      try {
                        localStorage.setItem('aac-customizations-backup', JSON.stringify(customizationsBackup));
                      } catch (storageError) {
                        console.warn('Failed to save to localStorage (quota exceeded):', storageError);
                        // Continue without localStorage backup
                      }
                      
                      if (user?.id) {
                        await fetch(`/api/users/${user.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ customizations: customizationsBackup }),
                        });
                      }
                    } catch (error) {
                      console.error('Failed to save phrase order:', error);
                    }
                  }
                  setEditVocabMode(!editVocabMode);
                }}
                className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  editVocabMode
                    ? 'bg-[#f97316] text-white hover:bg-[#ea580c]'
                    : 'bg-white text-[#1e3a5f] border-2 border-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'
                }`}
              >
                {editVocabMode ? '完成編輯 / Done Editing' : '編輯 / Edit'}
              </button>
            </div>
          )}

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

      {/* Delete Confirmation Modal */}
      {deleteConfirmPhrase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-[#1e3a5f]">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 text-center">
              確認刪除 / Confirm Delete
            </h3>
            <div className="mb-6 text-center">
              <p className="text-lg text-[#1e3a5f] mb-2">
                確定要刪除這個詞語嗎？
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to delete this phrase?
              </p>
              <div className="mt-4 p-4 bg-[#f5f5dc] rounded-xl border-2 border-[#1e3a5f]">
                <div className="flex items-center justify-center gap-3 mb-2">
                <Icon emoji={(deleteConfirmPhrase as any).icon || '📝'} size={48} />
                </div>
                <p className="text-xl font-bold text-[#1e3a5f]">{deleteConfirmPhrase.text}</p>
                <p className="text-sm text-gray-600">{deleteConfirmPhrase.en}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmPhrase(null)}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition-all duration-300"
              >
                取消 / Cancel
              </button>
              <button
                onClick={() => handleDeletePhrase(deleteConfirmPhrase.id)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-300"
              >
                刪除 / Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Delete Confirmation Modal */}
      {deleteConfirmCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-[#1e3a5f]">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 text-center">
              確認刪除分類 / Confirm Delete Category
            </h3>
            <div className="mb-6 text-center">
              <p className="text-lg text-[#1e3a5f] mb-2">
                確定要刪除這個分類嗎？
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to delete this category?
              </p>
              <div className="mt-4 p-4 bg-[#f5f5dc] rounded-xl border-2 border-[#1e3a5f]">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Icon emoji={customCategoryIcons[deleteConfirmCategory] || CATEGORY_ICONS[deleteConfirmCategory] || '📁'} size={48} />
                </div>
                <p className="text-xl font-bold text-[#1e3a5f]">
                  {customCategoryNames[deleteConfirmCategory]?.zh ?? deleteConfirmCategory}
                </p>
                <p className="text-sm text-gray-600">
                  {customCategoryNames[deleteConfirmCategory]?.en ?? CATEGORY_LABELS[deleteConfirmCategory]}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmCategory(null)}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition-all duration-300"
              >
                取消 / Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirmCategory)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-300"
              >
                刪除 / Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
