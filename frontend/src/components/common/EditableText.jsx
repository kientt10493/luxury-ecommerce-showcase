import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Move, RotateCcw } from 'lucide-react';

export default function EditableText({
  value = '',
  onChange,
  isEditing = false,
  as: Component = 'span',
  className = '',
  placeholder = 'Nhấp để sửa nội dung...',
  multiline = false,
  id = '',
  offset = { x: 0, y: 0 },
  onOffsetChange,
  allowDrag = true
}) {
  const contentRef = useRef(null);
  const [localOffset, setLocalOffset] = useState({ x: offset?.x || 0, y: offset?.y || 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0 });

  // Sync external offset to local offset
  useEffect(() => {
    setLocalOffset({ x: offset?.x || 0, y: offset?.y || 0 });
  }, [offset?.x, offset?.y]);

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

  // Drag handlers
  const handlePointerDown = (e) => {
    if (!isEditing || !allowDrag) return;
    // Don't drag if clicking inside contentEditable text
    if (e.target === contentRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: localOffset.x,
      initY: localOffset.y
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const newX = dragRef.current.initX + dx;
    const newY = dragRef.current.initY + dy;
    setLocalOffset({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const finalX = dragRef.current.initX + dx;
    const finalY = dragRef.current.initY + dy;

    if (onOffsetChange && id) {
      onOffsetChange(id, { x: finalX, y: finalY });
    }
  };

  const handleResetPosition = (e) => {
    e.stopPropagation();
    setLocalOffset({ x: 0, y: 0 });
    if (onOffsetChange && id) {
      onOffsetChange(id, { x: 0, y: 0 });
    }
  };

  const hasOffset = localOffset.x !== 0 || localOffset.y !== 0;
  const transformStyle = hasOffset
    ? { transform: `translate3d(${localOffset.x}px, ${localOffset.y}px, 0)` }
    : undefined;

  // View mode
  if (!isEditing) {
    return (
      <span 
        style={transformStyle} 
        className={`inline-block ${hasOffset ? 'relative z-10' : ''}`}
      >
        <Component className={className}>
          {value || placeholder}
        </Component>
      </span>
    );
  }

  // Edit mode
  return (
    <span 
      style={transformStyle}
      className={`relative group inline-block max-w-full transition-shadow ${
        isDragging ? 'z-40 scale-[1.02]' : 'z-20'
      }`}
    >
      <Component
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} cursor-text border border-dashed border-[#0071e3]/70 bg-[#0071e3]/10 hover:bg-[#0071e3]/15 focus:bg-[#0071e3]/20 focus:border-solid focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none rounded-lg px-2 py-0.5 -mx-2 transition-all`}
        title="Nhấp trực tiếp để sửa nội dung"
      >
        {value}
      </Component>

      {/* Floating Drag & Move Handle on Top Left */}
      {allowDrag && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute -top-3.5 -left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30"
        >
          <div
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white p-1 rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform hover:scale-110"
            title="Kéo chuột để di chuyển khung text này đến vị trí bất kỳ"
          >
            <Move className="w-3 h-3" />
          </div>

          {/* Reset position button */}
          {hasOffset && (
            <button
              type="button"
              onClick={handleResetPosition}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-1 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-transform hover:scale-110"
              title="Đặt lại vị trí ban đầu"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      )}

      {/* Floating mini pencil indicator on Top Right */}
      <span className="absolute -top-3 -right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0071e3] text-white p-1 rounded-full shadow-lg scale-75 z-20">
        <Pencil className="w-3 h-3" />
      </span>
    </span>
  );
}
