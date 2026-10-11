import React from 'react';

interface HighlightTextProps {
  text: string;
  query?: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Escapes regex special characters to prevent regex crashes
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  className = '',
  highlightClassName = 'font-bold text-[#0a0a0a] bg-[#B6FFED] px-1 py-0.5 rounded shadow-[0_0_8px_rgba(182,255,237,0.35)]',
}) => {
  if (!text) return null;
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return <span className={className}>{text}</span>;
  }

  try {
    const escaped = escapeRegExp(trimmed);
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    if (parts.length <= 1) {
      return <span className={className}>{text}</span>;
    }

    return (
      <span className={className}>
        {parts.map((part, index) => {
          if (part.toLowerCase() === trimmed.toLowerCase()) {
            return (
              <strong key={index} className={highlightClassName}>
                {part}
              </strong>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </span>
    );
  } catch {
    return <span className={className}>{text}</span>;
  }
};
