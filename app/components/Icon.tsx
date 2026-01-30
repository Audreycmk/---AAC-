interface IconProps {
  emoji: string;
  size?: number;
  className?: string;
}

export default function Icon({ emoji, size = 64, className = '' }: IconProps) {
  // Convert emoji to Unicode codepoint for Twemoji CDN
  // Remove variation selectors (U+FE0F) and other modifiers
  const cleanEmoji = emoji.replace(/\uFE0F/g, '');
  
  const codePoint = Array.from(cleanEmoji)
    .map(char => {
      const code = char.codePointAt(0);
      return code ? code.toString(16) : '';
    })
    .filter(code => code !== '')
    .join('-');
  
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codePoint}.png`}
      alt={emoji}
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block' }}
      onError={(e) => {
        // Fallback to text emoji if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.fontSize = `${size}px`;
        span.className = className;
        target.parentNode?.replaceChild(span, target);
      }}
    />
  );
}
