'use client';

import Icon from './Icon';

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
}: SideMenuProps) {
  return (
    <>
      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-500 ease-out ${
          menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } w-80 pt-20 pb-24 sm:pb-20`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Custom Sentence Button in Menu */}
          <button
            onClick={() => {
              setShowCustomPanel(!showCustomPanel);
              setMenuOpen(false);
            }}
            className={`w-full mt-6 px-6 py-5 bg-[#f97316] text-white rounded-2xl font-bold text-2xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[70px] flex items-center justify-center gap-3 mb-6 transform ${
              menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
            style={{
              transitionDelay: menuOpen ? '50ms' : '0ms',
            }}
            aria-label="自訂句子 Custom Sentence"
          >
            <Icon emoji="📝" size={40} />
            <BilingualText
              zh="自訂句子"
              en="Custom Sentence"
              className="items-center text-center"
              enClassName="text-lg"
            />
          </button>

          {/* Favorites Section */}
          <div
            className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
              menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
          >
            <h2 className="text-3xl font-bold text-[#1e3a5f]">
              <BilingualText zh="常用選單" en="Favorites" enClassName="text-lg sm:text-xl" />
            </h2>
          </div>
          <nav className="space-y-3 mb-8">
            {favorites.map((category, index) => (
              <div
                key={category}
                className={`transition-all duration-300 relative ${
                  menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? `${index * 50}ms` : '0ms' }}
              >
                <div
                  className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                    selectedCategory === category
                      ? 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                      : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105 translate-x-0 opacity-100'
                  }`}
                >
                  <Icon
                    emoji={customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁'}
                    size={48}
                    className="flex-shrink-0"
                  />
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
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  aria-label={`Select ${category}`}
                />
              </div>
            ))}
          </nav>

          {/* Categories Section - Only for logged in users */}
          {hasFullAccess() && (
            <>
              <div
                className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
                  menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
              >
                <h2 className="text-3xl font-bold text-[#1e3a5f]">
                  <BilingualText zh="分類選單" en="Categories" enClassName="text-lg sm:text-xl" />
                </h2>
              </div>
              <nav className="space-y-3 mb-8">
                {getUniqueCategories().map((category, index) => (
                  <div
                    key={category}
                    className={`transition-all duration-300 relative ${
                      menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                    }`}
                    style={{ transitionDelay: menuOpen ? `${150 + index * 50}ms` : '0ms' }}
                  >
                    <div
                      className={`w-full text-left px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 flex items-center gap-4 transform hover:translate-x-2 hover:shadow-xl min-h-[70px] ${
                        selectedCategory === category
                          ? 'bg-[#1e3a5f] text-white shadow-lg scale-105'
                          : 'bg-[#f5f5dc] text-[#1e3a5f] border-2 border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:scale-105 translate-x-0 opacity-100'
                      }`}
                    >
                      <Icon
                        emoji={customCategoryIcons[category] || CATEGORY_ICONS[category] || '📁'}
                        size={48}
                        className="flex-shrink-0"
                      />
                      <span className="flex-1">
                        <BilingualText
                          zh={customCategoryNames[category]?.zh ?? category}
                          en={customCategoryNames[category]?.en ?? CATEGORY_LABELS[category]}
                          className="items-start"
                          enClassName="text-base sm:text-lg"
                        />
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setMenuOpen(false);
                      }}
                      className="absolute inset-0 w-full h-full rounded-2xl"
                      aria-label={`Select ${category}`}
                    />
                  </div>
                ))}
              </nav>
            </>
          )}

          {/* User Menu Section */}
          <div className="mt-8 pt-8 border-t-2 border-gray-300 space-y-3">
            {hasFullAccess() && (
              <>
                <button
                  onClick={() => {
                    setShowAddVocab(true);
                    setMenuOpen(false);
                  }}
                  className={`w-full px-6 py-4 bg-[#f97316] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#ea580c] transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
                    menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: menuOpen ? '300ms' : '0ms' }}
                  aria-label="Add Vocabulary"
                >
                  <Icon emoji="📚" size={32} />
                  <span>加入詞語</span>
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowDashboard(true);
                      setMenuOpen(false);
                    }}
                    className={`w-full px-6 py-4 bg-[#1e3a5f] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#0a1a2e] transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
                      menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                    }`}
                    style={{ transitionDelay: menuOpen ? '350ms' : '0ms' }}
                    aria-label="Admin Dashboard"
                  >
                    <Icon emoji="📊" size={32} />
                    <span>管理員</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setMenuOpen(false);
              }}
              className={`w-full px-6 py-4 bg-[#1e3a5f] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#0a1a2e] transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}
              aria-label="Settings"
            >
              <Icon emoji="⚙" size={32} />
              <span>設定</span>
            </button>

            <button
              onClick={() => {
                setShowHistory(!showHistory);
                setMenuOpen(false);
              }}
              className={`w-full px-6 py-4 bg-[#1e3a5f] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#0a1a2e] transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}
              aria-label="History"
            >
              <Icon emoji="⭐️" size={32} />
              <span>歷史記錄</span>
            </button>

            {!user ? (
              <button
                onClick={() => {
                  setShowLoginCodeModal(true);
                  setMenuOpen(false);
                }}
                className={`w-full px-6 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
                  menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? '500ms' : '0ms' }}
                aria-label="Login"
              >
                <Icon emoji="🔐" size={32} />
                <span>登入</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className={`w-full px-6 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-red-700 transition-all duration-300 min-h-[60px] flex items-center justify-center gap-2 ${
                  menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? '500ms' : '0ms' }}
                aria-label="Logout"
              >
                <Icon emoji="🚪" size={32} />
                <span>登出</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-all duration-500 animate-fadeIn backdrop-blur-sm"
        />
      )}
    </>
  );
}
