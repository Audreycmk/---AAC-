'use client';

import Icon from './Icon';
import { useState } from 'react';

interface SideMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  favorites: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  toggleFavorite: (category: string) => void;
  showCustomPanel: boolean;
  setShowCustomPanel: (show: boolean) => void;
  customCategoryIcons: Record<string, string>;
  customCategoryNames: Record<string, { zh: string; en: string }>;
  CATEGORY_ICONS: Record<string, string>;
  CATEGORY_LABELS: Record<string, string>;
  hasFullAccess: () => boolean;
  getUniqueCategories: () => string[];
  editCategoriesMode: boolean;
  setEditCategoriesMode: (mode: boolean) => void;
  editingCategoryName: Record<string, { zh: string; en: string }>;
  setEditingCategoryName: (names: Record<string, { zh: string; en: string }>) => void;
  setCustomCategoryNames: (callback: (prev: Record<string, { zh: string; en: string }>) => Record<string, { zh: string; en: string }>) => void;
  setShowAddVocab: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  user: { email?: string; loginCode?: string; role: 'admin' | 'user' } | null;
  setShowLoginCodeModal: (show: boolean) => void;
  setShowDashboard: (show: boolean) => void;
  handleLogout: () => void;
  onReorderCategories?: (newOrder: string[]) => void;
  onDeleteCategory?: (category: string) => void;
  onUpdateCategoryIcon?: (category: string, icon: string) => void;
  onUpdateCategoryName?: (category: string, zh: string, en: string) => void;
  COMMON_EMOJIS?: string[];
  editingCategoryIcon?: Record<string, boolean>;
  setEditingCategoryIcon?: (icons: Record<string, boolean>) => void;
  editingCategoryText?: Record<string, boolean>;
  setEditingCategoryText?: (texts: Record<string, boolean>) => void;
  deleteConfirmCategory?: string | null;
  setDeleteConfirmCategory?: (category: string | null) => void;
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

export default function SideMenu({
  menuOpen,
  setMenuOpen,
  favorites,
  selectedCategory,
  setSelectedCategory,
  toggleFavorite,
  showCustomPanel,
  setShowCustomPanel,
  customCategoryIcons,
  customCategoryNames,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  hasFullAccess,
  getUniqueCategories,
  editCategoriesMode,
  setEditCategoriesMode,
  editingCategoryName,
  setEditingCategoryName,
  setCustomCategoryNames,
  setShowAddVocab,
  showSettings,
  setShowSettings,
  showHistory,
  setShowHistory,
  user,
  setShowLoginCodeModal,
  setShowDashboard,
  handleLogout,
  onReorderCategories,
  onDeleteCategory,
  onUpdateCategoryIcon,
  onUpdateCategoryName,
  COMMON_EMOJIS = [],
  editingCategoryIcon = {},
  setEditingCategoryIcon,
  editingCategoryText = {},
  setEditingCategoryText,
  deleteConfirmCategory,
  setDeleteConfirmCategory,
}: SideMenuProps) {
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);
  const [dragOverCategoryIndex, setDragOverCategoryIndex] = useState<number | null>(null);
  const [tempCategoryIcon, setTempCategoryIcon] = useState<Record<string, string>>({});
  const [tempCategoryName, setTempCategoryName] = useState<Record<string, { zh: string; en: string }>>({});
  const [activeEditingCategory, setActiveEditingCategory] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  const guestPreviewCategories = ['日常', '飲食', '醫療', '情緒', '求助'];
  const isGuestPreview = (category: string) => !user && guestPreviewCategories.includes(category);

  const handleCategoryDragStart = (index: number) => {
    if (!editCategoriesMode) return;
    setDraggedCategoryIndex(index);
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    if (!editCategoriesMode || draggedCategoryIndex === null) return;
    e.preventDefault();
    setDragOverCategoryIndex(index);
  };

  const handleCategoryDragEnd = () => {
    if (!editCategoriesMode || draggedCategoryIndex === null || dragOverCategoryIndex === null || !onReorderCategories) {
      setDraggedCategoryIndex(null);
      setDragOverCategoryIndex(null);
      return;
    }
    const categories = getUniqueCategories();
    const newOrder = [...categories];
    const [draggedCategory] = newOrder.splice(draggedCategoryIndex, 1);
    newOrder.splice(dragOverCategoryIndex, 0, draggedCategory);
    onReorderCategories(newOrder);
    setDraggedCategoryIndex(null);
    setDragOverCategoryIndex(null);
  };
  
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-500 ease-out ${
          menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } w-80 pt-20`}
      >
        <div className="p-6 h-full overflow-y-auto pb-20">
          {/* Custom Sentence Button */}
          <button
            onClick={() => {
              setShowCustomPanel(!showCustomPanel);
              setMenuOpen(false);
            }}
            className={`w-full mt-6 px-6 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3 mb-6 transform ${
              menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? '50ms' : '0ms' }}
          >
            <Icon emoji="📝" size={40} />
            <BilingualText zh="自訂句子" en="Custom Sentence" className="items-center text-center" enClassName="text-lg" />
          </button>

          {/* Favorites Header */}
          <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-[#1e3a5f]">
              <BilingualText zh="常用選單" en="Favorites" enClassName="text-lg sm:text-xl" />
            </h2>
          </div>

          {/* Favorites Nav */}
          <nav className="space-y-3 mb-8">
            {favorites.map((category, index) => (
              <div
                key={category}
                className={`transition-all duration-300 relative ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                style={{ transitionDelay: menuOpen ? `${index * 50}ms` : '0ms' }}
              >
                <div className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                  selectedCategory === category
                    ? isGuestPreview(category) ? 'bg-gray-400 text-gray-600 shadow-lg scale-105' : 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                    : isGuestPreview(category) ? 'bg-gray-200 text-gray-500 border-2 border-gray-400' : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f]'
                }`}>
                  <Icon emoji={customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁'} size={48} className="flex-shrink-0" />
                  <span className="flex-1">
                    <BilingualText zh={customCategoryNames[category]?.zh ?? category} en={customCategoryNames[category]?.en ?? CATEGORY_LABELS[category]} className="items-start" />
                  </span>
                  <button onClick={() => toggleFavorite(category)} className="transition-all duration-300 hover:scale-125 flex-shrink-0">
                    <Icon emoji={favorites.includes(category) ? '❤️' : '🤍'} size={24} />
                  </button>
                </div>
                <button onClick={() => { setSelectedCategory(category); setMenuOpen(false); }} className="absolute inset-0 w-full h-full rounded-2xl" />
              </div>
            ))}
          </nav>

          {/* Categories Header */}
          <div className={`flex items-center justify-between gap-3 mb-6 transition-all duration-700 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-[#1e3a5f]">
              <BilingualText zh="分類" en="Categories" enClassName="text-lg sm:text-xl" />
            </h2>
            {hasFullAccess() && (
              <div className="flex gap-2">
                {editCategoriesMode && (
                  <button
                    onClick={() => {
                      if (setEditingCategoryIcon) setEditingCategoryIcon({});
                      if (setEditingCategoryText) setEditingCategoryText({});
                      setTempCategoryIcon({});
                      setTempCategoryName({});
                      setActiveEditingCategory(null);
                      setShowEmojiPicker(null);
                      setEditCategoriesMode(false);
                    }}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg"
                  >
                    取消
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (editCategoriesMode) {
                      const categories = getUniqueCategories();
                      for (const cat of categories) {
                        if (tempCategoryIcon[cat] && onUpdateCategoryIcon) await onUpdateCategoryIcon(cat, tempCategoryIcon[cat]);
                        if (tempCategoryName[cat] && onUpdateCategoryName) await onUpdateCategoryName(cat, tempCategoryName[cat].zh, tempCategoryName[cat].en);
                      }
                      setActiveEditingCategory(null);
                      setShowEmojiPicker(null);
                    }
                    setEditCategoriesMode(!editCategoriesMode);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${editCategoriesMode ? 'bg-green-500 text-white' : 'bg-[#f97316] text-white'}`}
                >
                  {editCategoriesMode ? '完成' : '✏️'}
                </button>
              </div>
            )}
          </div>

          {/* Categories Nav - FIXED Z-INDEX LOGIC HERE */}
          <nav className="space-y-3 mb-8">
            {getUniqueCategories().map((category, index) => {
              const isDragging = draggedCategoryIndex === index;
              const isDragOver = dragOverCategoryIndex === index;
              const isEditing = activeEditingCategory === category;
              const currentIcon = tempCategoryIcon[category] || customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁';
              const currentZh = tempCategoryName[category]?.zh ?? customCategoryNames[category]?.zh ?? category;
              const currentEn = tempCategoryName[category]?.en ?? customCategoryNames[category]?.en ?? CATEGORY_LABELS[category];

              return (
                <div
                  key={category}
                  draggable={editCategoriesMode && !isEditing}
                  onDragStart={() => handleCategoryDragStart(index)}
                  onDragOver={(e) => handleCategoryDragOver(e, index)}
                  onDragEnd={handleCategoryDragEnd}
                  /* CRITICAL FIX: Applying z-index to the parent container 
                     so the row being edited sits on top of others.
                  */
                  className={`transition-all duration-300 relative ${
                    menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  } ${editCategoriesMode && !isEditing ? 'cursor-move' : ''} 
                    ${isDragging ? 'opacity-50' : ''} 
                    ${isDragOver ? 'scale-105' : ''}
                    ${isEditing ? 'z-[50]' : 'z-0'}`} 
                  style={{ transitionDelay: menuOpen ? `${150 + index * 50}ms` : '0ms' }}>
                  
                  <div
                    onClick={() => {
                      if (editCategoriesMode && !isEditing) {
                        setActiveEditingCategory(category);
                        setTempCategoryIcon(prev => ({ ...prev, [category]: currentIcon }));
                        setTempCategoryName(prev => ({ ...prev, [category]: { zh: currentZh, en: currentEn } }));
                      }
                    }}
                    className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                      editCategoriesMode
                        ? 'bg-white border-2 border-dashed border-[#1e3a5f]'
                        : selectedCategory === category
                        ? isGuestPreview(category) ? 'bg-gray-400 text-gray-600 shadow-lg scale-105' : 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                        : isGuestPreview(category) ? 'bg-gray-200 text-gray-500 border-2 border-gray-400' : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f]'
                    }`}>
                    
                    {/* Emoji Picker Logic */}
                    <div className="flex-shrink-0 relative">
                      <div 
                        onClick={(e) => {
                          if (editCategoriesMode && isEditing) {
                            e.stopPropagation();
                            setShowEmojiPicker(showEmojiPicker === category ? null : category);
                          }
                        }}
                      >
                        <Icon emoji={currentIcon} size={48} className={`${editCategoriesMode && isEditing ? 'cursor-pointer hover:scale-110' : ''}`} />
                      </div>

                      {showEmojiPicker === category && (
                        <>
                          <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(null); }} />
                          <div className="grid grid-cols-5 gap-1 max-h-[150px] overflow-y-auto p-2 bg-white rounded-xl border-2 border-[#1e3a5f] absolute z-[101] mt-2 left-0 shadow-2xl min-w-[200px]">
                            {COMMON_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTempCategoryIcon(prev => ({ ...prev, [category]: emoji }));
                                  setShowEmojiPicker(null);
                                }}
                                className={`text-2xl p-1 rounded hover:bg-[#f97316] ${currentIcon === emoji ? 'bg-[#f97316]' : ''}`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <span className="flex-1">
                      {isEditing ? (
                        <div className="flex flex-col gap-2 w-full">
                          <input
                            type="text"
                            value={currentZh}
                            onChange={(e) => setTempCategoryName(prev => ({ ...prev, [category]: { zh: e.target.value, en: prev[category]?.en ?? currentEn } }))}
                            className="px-2 py-1 border-2 border-[#1e3a5f] rounded text-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                          <input
                            type="text"
                            value={currentEn}
                            onChange={(e) => setTempCategoryName(prev => ({ ...prev, [category]: { zh: prev[category]?.zh ?? currentZh, en: e.target.value } }))}
                            className="px-2 py-1 border-2 border-[#1e3a5f] rounded text-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        <BilingualText zh={currentZh} en={currentEn} className="items-start" />
                      )}
                    </span>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {editCategoriesMode ? (
                        !isEditing && (
                          <button
                            onClick={(e) => { e.stopPropagation(); if (setDeleteConfirmCategory) setDeleteConfirmCategory(category); }}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
                          >
                            −
                          </button>
                        )
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(category); }} className="hover:scale-125">
                          <Icon emoji={favorites.includes(category) ? '❤️' : '🤍'} size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                  {!editCategoriesMode && (
                    <button onClick={() => { setSelectedCategory(category); setMenuOpen(false); }} className="absolute inset-0 w-full h-full rounded-2xl" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="mt-8 pt-8 border-t-2 border-gray-300 space-y-3">
            {hasFullAccess() && (
              <>
                <button onClick={() => { setShowAddVocab(true); setMenuOpen(false); }} className="w-full px-6 py-4 bg-[#f97316] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
                  <Icon emoji="➕" size={32} /> <span>加入詞語</span>
                </button>
                {user?.role === 'admin' && (
                  <button onClick={() => { setShowDashboard(true); setMenuOpen(false); }} className="w-full px-6 py-4 bg-[#1e3a5f] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
                    <Icon emoji="📊" size={32} /> <span>管理員</span>
                  </button>
                )}
              </>
            )}
            <button onClick={() => { setShowSettings(!showSettings); setMenuOpen(false); }} className="w-full px-6 py-4 bg-[#1e3a5f] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
              <Icon emoji="⚙" size={32} /> <span>設定</span>
            </button>
            <button onClick={() => { setShowHistory(!showHistory); setMenuOpen(false); }} className="w-full px-6 py-4 bg-[#1e3a5f] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
              <Icon emoji="⭐️" size={32} /> <span>歷史記錄</span>
            </button>
            {!user ? (
              <button onClick={() => { setShowLoginCodeModal(true); setMenuOpen(false); }} className="w-full px-6 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
                <Icon emoji="🔐" size={32} /> <span>登入</span>
              </button>
            ) : (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full px-6 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
                <Icon emoji="🚪" size={32} /> <span>登出</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm" />
      )}
    </>
  );
}