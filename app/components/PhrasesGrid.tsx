'use client';

import Icon from './Icon';

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
}

// Image mapping for btc2026 user
const BTC2026_IMAGE_MAP: Record<number, string> = {
  35: '/wallet.jpg',           // 銀包 Wallet
  36: '/mobilephone.jpg',      // 手機 Mobile phone
  37: '/glasses.jpg',          // 眼鏡 Glasses
  38: '/mask.jpg',             // 口罩 Mask
  39: '/keys.jpg',             // 鎖匙 Keys
  40: '/bag.jpg',              // 袋 Bag
  41: '/jacket.jpg',           // 外套 Jacket
  42: '/hairtie.jpg',          // 橡筋 Hair tie
  43: '/tv.jpg',               // 電視 Television
  44: '/door.jpg',             // 門 Door
  45: '/aircon.jpg',           // 冷氣 Air conditioner
  46: '/heater.jpg',           // 暖爐 Heater
  47: '/window.jpg',           // 窗 Window
  48: '/light.jpg',            // 燈 Light
  49: '/spoon.jpg',            // 匙羹 Spoon
  50: '/fork.jpg',             // 叉 Fork
  51: '/grapes.jpg',           // 提子 Grapes
  52: '/banana.jpg',           // 香蕉 Banana
  53: '/apple.jpg',            // 蘋果 Apple
  54: '/orange.jpg',           // 橙 Orange
  55: '/dragonfruit.jpg',      // 火龍果 Dragonfruit
  56: '/pineapple.jpg',        // 菠蘿 Pineapple
  57: '/peach.jpg',            // 桃 Peach
  58: '/durian.jpg',           // 榴槤 Durian
  59: '/toilet.jpg',           // 廁所 Toilet
  60: '/bank.jpg',             // 銀行 Bank
  61: '/supermarket.jpg',      // 超市 Supermarket
  62: '/LCU.jpg',              // 李鄭屋中心 Lei Cheng Uk Center
  63: '/hospital.jpg',         // 醫院 Hospital
  64: '/chineserestaurant.jpg',// 酒樓 Chinese restaurant
  65: '/park.jpg',             // 公園 Park
  66: '/chachaanteng.jpg',     // 茶餐廳 Cha Chaan Teng
};

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

export default function PhrasesGrid({
  filteredPhrases,
  speak,
  isLoading,
  user,
  CATEGORY_LABELS,
  selectedCategory,
  setShowLoginModal,
  setShowLoginCodeModal,
}: PhrasesGridProps) {
  // Categories that guests can preview (but not use)
  const guestPreviewCategories = ['日常', '飲食', '醫療', '情緒', '求助'];
  const isGuestPreview = !user && guestPreviewCategories.includes(selectedCategory);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredPhrases.map((phrase, index) => (
        <button
          key={phrase.id}
          onClick={() => {
            if (isGuestPreview) {
              setShowLoginCodeModal(true);
            } else {
              speak(phrase.text);
            }
          }}
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
            ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed scale-95'
                : isGuestPreview
                ? 'bg-gray-200 text-gray-500 border-4 border-gray-400 cursor-pointer hover:scale-105'
                : 'bg-white hover:bg-[#f97316] hover:text-white hover:scale-110 hover:shadow-[0_20px_50px_rgba(249,115,22,0.5)] hover:-translate-y-3 active:scale-95 text-[#1e3a5f] border-4 border-[#1e3a5f] hover:border-[#f97316]'
            }
            animate-fadeIn
            group
          `}
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-center justify-center">
            {/* Custom images for btc2026 user */}
            {user?.loginCode === 'btc2026' && BTC2026_IMAGE_MAP[phrase.id] ? (
              <img src={BTC2026_IMAGE_MAP[phrase.id]} alt={phrase.text} className="max-w-[90%] max-h-[120px] object-contain" />
            ) : phrase.icon && typeof phrase.icon === 'string' && (phrase.icon.startsWith('data:image') || phrase.icon.startsWith('http') || phrase.icon.startsWith('/')) ? (
              <img src={phrase.icon} alt={phrase.text} className="max-w-[90%] max-h-[120px] object-contain" style={{ display: 'inline-block' }} />
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
  );
}
