// Common emoji presets for quick selection
export const COMMON_EMOJIS = [
  '😊', '❤️', '👋', '🙏', '👩🏻', '👨🏻', '🏥', '😄', '🆘', '🛏️',
  '👜', '🏠', '🍎', '📍', '🚻', '🍽️', '👨‍⚕️', '💊', '📺', '🚪',
  '❄️', '🔥', '💡', '🐶', '🍴', '🍇', '🍊', '🍍', '🏢', '🌳',
  '☕', '🎓', '🎨', '⚽', '🎮', '🎵', '📚', '🏃', '🚗', '✈️',
  '🎁', '🎪', '🎭', '🎬', '🎸', '🎹', '🎤', '🏋️', '⛹️', '🚍',
  '🧘', '🚇', '✈️', '🌏', '', '🏊', '🧗', '🤺', '🏇', '🎿',
];

interface EmojiKeyboardProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

export default function EmojiKeyboard({ onEmojiSelect, selectedEmoji }: EmojiKeyboardProps) {
  return (
    <div className="grid grid-cols-10 gap-2">
      {COMMON_EMOJIS.map((emoji, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onEmojiSelect(emoji)}
          className={`text-3xl p-2 rounded-lg transition-all duration-200 hover:scale-125 hover:bg-[#f97316] ${
            selectedEmoji === emoji ? 'bg-[#f97316] scale-110' : 'bg-white'
          }`}
          title={emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
