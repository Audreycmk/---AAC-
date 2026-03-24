'use client';

import Icon from './Icon';
import { useState } from 'react';

interface Phrase {
  id: number;
  text: string;
  en: string;
  category: string;
  icon: string;
}

interface PhrasesGridProps {
  filteredPhrases: Phrase[];
  speak: (text: string) => void;
  isLoading: boolean;
  user: { email?: string; loginCode?: string; role: 'admin' | 'user' } | null;
  CATEGORY_LABELS: Record<string, string>;
  selectedCategory: string;
  setShowLoginModal: (show: boolean) => void;
  setShowLoginCodeModal: (show: boolean) => void;
  editMode?: boolean;
  onReorder?: (newOrder: number[]) => void;
  onDeleteClick?: (phrase: Phrase) => void;
  customPhrases?: Phrase[];
  vocabContainerSize?: number;
}

// Image mapping for btc2026 user
const BTC2026_IMAGE_MAP: Record<number, string> = {
  35: '/wallet.jpg', 36: '/mobilephone.jpg', 37: '/glasses.jpg', 38: '/mask.jpg',
  39: '/keys.jpg', 40: '/bag.jpg', 41: '/jacket.jpg', 42: '/hairtie.jpg',
  43: '/tv.jpg', 44: '/door.jpg', 45: '/aircon.jpg', 46: '/heater.jpg',
  47: '/window.jpg', 48: '/light.jpg', 49: '/spoon.jpg', 50: '/fork.jpg',
  51: '/grapes.jpg', 52: '/banana.jpg', 53: '/apple.jpg', 54: '/orange.jpg',
  55: '/dragonfruit.jpg', 56: '/pineapple.jpg', 57: '/peach.jpg', 58: '/durian.jpg',
  59: '/toilet.jpg', 60: '/bank.jpg', 61: '/supermarket.jpg', 62: '/LCU.jpg',
  63: '/hospital.jpg', 64: '/chineserestaurant.jpg', 65: '/park.jpg', 66: '/chachaanteng.jpg',
};

const BilingualText = ({
  zh,
  en,
  className = '',
  enClassName = '',
  style = {},
}: {
  zh: string;
  en: string;
  className?: string;
  enClassName?: string;
  style?: React.CSSProperties;
}) => (
  <span className={`flex flex-col leading-tight ${className}`} style={style}>
    <span className="w-full truncate text-center">{zh}</span>
    <span className={`opacity-80 w-full truncate text-center ${enClassName}`}>{en}</span>
  </span>
);

export default function PhrasesGrid({
  filteredPhrases,
  speak,
  isLoading,
  user,
  CATEGORY_LABELS,
  selectedCategory,
  setShowLoginModal,
  setShowLoginCodeModal,
  editMode = false,
  onReorder,
  onDeleteClick,
  customPhrases = [],
  vocabContainerSize = 1.0,
}: PhrasesGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const guestPreviewCategories = ['日常', '飲食', '醫療', '情緒', '求助'];
  const isGuestPreview = !user && guestPreviewCategories.includes(selectedCategory);

  const handleDragStart = (index: number) => {
    if (!editMode) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!editMode || draggedIndex === null) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (!editMode || draggedIndex === null || dragOverIndex === null || !onReorder) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newOrder = [...filteredPhrases];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dragOverIndex, 0, draggedItem);
    onReorder(newOrder.map((p) => p.id));
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, phrase: Phrase) => {
    e.stopPropagation();
    if (onDeleteClick) onDeleteClick(phrase);
  };

  return (
    <div 
      className="w-full"
      style={{ 
        display: 'grid',
        /* 核心修改：使用 auto-fill 配合 minmax，確保卡片根據闊度自動換行 */
        gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(200, 280 * vocabContainerSize)}px, 1fr))`,
        gap: `${1.5 * vocabContainerSize}rem`,
        padding: '1rem',
        width: '100%',
      }}
    >
      {filteredPhrases.map((phrase, index) => {
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index;

        return (
          <div
            key={phrase.id}
            draggable={editMode}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative h-full transition-all duration-300 ${editMode ? 'cursor-move' : ''} ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'scale-105' : ''}`}
          >
            {editMode && (
              <button
                onClick={(e) => handleDeleteClick(e, phrase)}
                className="absolute -top-3 -right-3 z-20 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95"
              >
                <span className="text-white text-2xl font-bold">−</span>
              </button>
            )}

            <button
              onClick={() => {
                if (editMode) return;
                if (isGuestPreview) setShowLoginCodeModal(true);
                else speak(phrase.text);
              }}
              disabled={isLoading || editMode}
              className={`
                w-full h-full
                font-bold
                rounded-3xl
                shadow-2xl
                transition-all duration-300
                flex flex-col items-center justify-center
                border-4
                ${
                  editMode
                    ? 'bg-white border-dashed border-[#1e3a5f] hover:border-[#f97316]'
                    : isLoading
                    ? 'bg-gray-400 cursor-not-allowed grayscale'
                    : isGuestPreview
                    ? 'bg-gray-200 text-gray-500 border-gray-400'
                    : 'bg-white text-[#1e3a5f] border-[#1e3a5f] hover:bg-[#f97316] hover:text-white hover:border-[#f97316] hover:-translate-y-2'
                }
                group
              `}
              style={{
                /* 唔用 scale，改為動態調整 Padding 同 Min-Height */
                padding: `${2 * vocabContainerSize}rem`,
                minHeight: `${160 * vocabContainerSize}px`,
                gap: `${1 * vocabContainerSize}rem`,
                animationDelay: !editMode ? `${index * 50}ms` : '0',
                animationFillMode: 'both',
              }}
            >
              <div className="flex items-center justify-center w-full">
                {user?.loginCode === 'btc2026' && BTC2026_IMAGE_MAP[phrase.id] ? (
                  <img 
                    src={BTC2026_IMAGE_MAP[phrase.id]} 
                    alt={phrase.text} 
                    style={{ maxHeight: `${120 * vocabContainerSize}px` }} 
                    className="max-w-[90%] object-contain" 
                  />
                ) : phrase.icon && (phrase.icon.startsWith('data:') || phrase.icon.startsWith('http') || phrase.icon.startsWith('/')) ? (
                  <img 
                    src={phrase.icon} 
                    alt={phrase.text} 
                    style={{ maxHeight: `${120 * vocabContainerSize}px` }} 
                    className="max-w-[90%] object-contain" 
                  />
                ) : (
                  <Icon emoji={phrase.icon || '📝'} size={Math.round(80 * vocabContainerSize)} />
                )}
              </div>

              <div className="w-full overflow-hidden">
                <BilingualText
                  zh={phrase.text}
                  en={phrase.en}
                  className="items-center"
                  style={{ fontSize: `${Math.max(1, 1.8 * vocabContainerSize)}rem` }}
                  enClassName="opacity-80"
                />
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}