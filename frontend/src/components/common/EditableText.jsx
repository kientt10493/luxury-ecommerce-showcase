import React, { useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

export default function EditableText({
  value = '',
  onChange,
  isEditing = false,
  as: Component = 'span',
  className = '',
  placeholder = 'Nhấp để sửa nội dung...',
  multiline = false
}) {
  const contentRef = useRef(null);

  // Sync contentRef when external value changes
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== (value || '')) {
      contentRef.current.innerText = value || '';
    }
  }, [value]);

  const handleBlur = () => {
    if (!contentRef.current || !onChange) return;
    const text = contentRef.current.innerText.trim();
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      contentRef.current?.blur();
    }
  };

  if (!isEditing) {
    return (
      <Component className={className}>
        {value || placeholder}
      </Component>
    );
  }

  return (
    <span className="relative group inline-block max-w-full">
      <Component
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} cursor-text border border-dashed border-[#0071e3]/70 bg-[#0071e3]/10 hover:bg-[#0071e3]/15 focus:bg-[#0071e3]/20 focus:border-solid focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none rounded-lg px-2 py-0.5 -mx-2 transition-all`}
        title="Nhấp trực tiếp để sửa như Word"
      >
        {value}
      </Component>

      {/* Floating mini pencil indicator on hover */}
      <span className="absolute -top-3 -right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0071e3] text-white p-1 rounded-full shadow-lg scale-75 z-20">
        <Pencil className="w-3 h-3" />
      </span>
    </span>
  );
}
