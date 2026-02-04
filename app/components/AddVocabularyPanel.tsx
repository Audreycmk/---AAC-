'use client';

import Icon from './Icon';
import { useState } from 'react';

interface AddVocabularyPanelProps {
  showAddVocab: boolean;
  setShowAddVocab: (show: boolean) => void;
  addVocabInput: {
    text: string;
    en: string;
    icon: string;
    category: string;
    newCategory: string;
  };
  handleVocabInputChange: (field: string, value: string) => void;
  resetAddVocabForm: () => void;
  handleAddVocab: () => void;
  vocabError: string;
  vocabSuccess: boolean;
  lastAddedWord: string;
  addVocabLang: 'zh' | 'en';
  setAddVocabLang: (lang: 'zh' | 'en') => void;
  getUniqueCategories: () => string[];
  CATEGORY_LABELS: Record<string, string>;
  COMMON_EMOJIS: string[];
  newCategoryEmoji: string;
  setNewCategoryEmoji: (emoji: string) => void;
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

export default function AddVocabularyPanel({
  showAddVocab,
  setShowAddVocab,
  addVocabInput,
  handleVocabInputChange,
  resetAddVocabForm,
  handleAddVocab,
  vocabError,
  vocabSuccess,
  lastAddedWord,
  addVocabLang,
  setAddVocabLang,
  getUniqueCategories,
  CATEGORY_LABELS,
  COMMON_EMOJIS,
  newCategoryEmoji,
  setNewCategoryEmoji,
}: AddVocabularyPanelProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCategoryEmojiPicker, setShowCategoryEmojiPicker] = useState(false);

  if (!showAddVocab) return null;

  return (
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
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
              <div className="relative bg-green-500 rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-4 border-green-600 animate-fadeIn">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-3">✅</div>
                  <div className="text-3xl font-bold text-white mb-2 break-words">{lastAddedWord}</div>
                  <div className="text-xl font-bold text-white mb-1">詞語已加入！</div>
                  <div className="text-lg font-semibold text-green-100">Word added successfully!</div>
                </div>
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
                <div className="flex flex-col items-center justify-center gap-2 mb-4">
                  <div className="flex-1 px-4 py-3 border-2 border-[#1e3a5f] rounded-xl text-center font-bold bg-white text-[#1e3a5f] flex flex-col items-center justify-center min-h-[120px]">
                    {addVocabInput.icon && typeof addVocabInput.icon === 'string' && addVocabInput.icon.startsWith('data:image') ? (
                      <img src={addVocabInput.icon} alt="Uploaded" className="max-w-[90%] max-h-[100px] object-contain" />
                    ) : (
                      <>
                        <img
                          src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5bc.png"
                          alt="Default img icon"
                          className="w-10 h-10 mb-2"
                        />
                        <div className="text-sm text-[#1e3a5f]">
                          選擇圖片<br />Choose an image
                        </div>
                      </>
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
                className="flex-1 px-8 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-105 active:scale-95 disabled:bg-gray-400 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-1 sm:gap-2 flex-col sm:flex-row text-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4be.png"
                  alt="Save"
                  className="w-10 h-10"
                />
                <span className="text-xl sm:text-2xl font-bold">加入<br />詞語</span>
                <span className="text-lg sm:text-xl opacity-80">Add Word</span>
              </button>
              <button
                onClick={() => {
                  setShowAddVocab(false);
                  resetAddVocabForm();
                }}
                className="flex-1 px-8 py-5 bg-[#1e3a5f] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#2a5a8f] hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-1 sm:gap-2 flex-col sm:flex-row text-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/274c.png"
                  alt="Back"
                  className="w-10 h-10"
                />
                <span className="text-xl sm:text-2xl font-bold">返回</span>
                <span className="text-lg sm:text-xl opacity-80">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
