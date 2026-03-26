'use client';

import Icon from './Icon';

interface CategoryDisplayProps {
  selectedCategory: string;
  CATEGORY_ICONS: Record<string, string>;
  CATEGORY_LABELS: Record<string, string>;
  customCategoryIcons: Record<string, string>;
  customCategoryNames: Record<string, { zh: string; en: string }>;
  favorites: string[];
  toggleFavorite: (category: string) => void;
  onCategoryClick?: (category: string) => void;
}

export default function CategoryDisplay({
  selectedCategory,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  customCategoryIcons,
  customCategoryNames,
  favorites,
  toggleFavorite,
  onCategoryClick,
}: CategoryDisplayProps) {
  return (
    <div className="mb-6 text-center">
      <div className="inline-flex items-center gap-4 px-10 py-5 bg-[#1e3a5f] text-white rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-110 transform border-4 border-[#f97316]">
        <button
          onClick={() => onCategoryClick?.(selectedCategory)}
          className="inline-flex items-center gap-4 flex-1 cursor-pointer focus:outline-none"
        >
          <Icon
            emoji={customCategoryIcons[selectedCategory] || CATEGORY_ICONS[selectedCategory] || '📁'}
            size={64}
            className="transition-transform duration-300 hover:rotate-12 hover:scale-125"
          />
          <div className="flex flex-col items-start">
            <span className="text-3xl font-bold">{customCategoryNames[selectedCategory]?.zh ?? selectedCategory}</span>
            <span className="text-sm sm:text-base opacity-80 text-base sm:text-lg font-bold">
              {(customCategoryNames[selectedCategory]?.en ?? CATEGORY_LABELS[selectedCategory]) || selectedCategory}
            </span>
          </div>
        </button>
        {selectedCategory !== '全部' && (
          <button
            onClick={() => toggleFavorite(selectedCategory)}
            className="ml-4 transition-all duration-300 hover:scale-125 focus:outline-none"
            aria-label={favorites.includes(selectedCategory) ? '移除最愛' : '加入最愛'}
          >
            <Icon emoji={favorites.includes(selectedCategory) ? '❤️' : '🤍'} size={30} />
          </button>
        )}
      </div>
    </div>
  );
}
