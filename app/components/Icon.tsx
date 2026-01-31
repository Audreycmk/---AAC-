import { useState, useEffect } from 'react';

interface IconProps {
  emoji: string;
  size?: number;
  className?: string;
}

export default function Icon({ emoji, size = 64, className = '' }: IconProps) {
  const [showEmoji, setShowEmoji] = useState(false);

  // If emoji is a URL, render as img directly
  if (emoji && typeof emoji === 'string' && (emoji.startsWith('http://') || emoji.startsWith('https://'))) {
    // Determine alt text based on URL - use window emoji for window images
    const alt = emoji.includes('1fa9f') ? '🪟' : 'icon';
    return (
      <img 
        src={emoji} 
        alt={alt}
        width={size} 
        height={size} 
        className={className}
        style={{ display: 'inline-block' }}
      />
    );
  }

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

  const handleImageError = () => {
    setShowEmoji(true);
  };

  if (showEmoji) {
    return (
      <span
        style={{ 
          fontSize: `${size}px`,
          display: 'inline-block',
          lineHeight: '1'
        }}
        className={className}
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codePoint}.png`}
      alt={emoji}
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block' }}
      onError={handleImageError}
    />
  );
}
