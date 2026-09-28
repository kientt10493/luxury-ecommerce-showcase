import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Move, RotateCcw, Sparkles } from 'lucide-react';

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
  allowDrag = true,
  blockStyle = {},
  isSelected = false,
  onSelectBlock
}) {
  const contentRef = useRef(null);
  const [localOffset, setLocalOffset] = useState({ x: offset?.x || 0, y: offset?.y || 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0 });

  // Sync external offset to local offset
  useEffect(() => {
    setLocalOffset({ x: offset?.x || 0, y: offset?.y || 0 });
  }, [offset?.x, offset?.y]);

  // Sync contentRef when external value changes (only when not actively typing)
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== (value || '')) {
      if (document.activeElement !== contentRef.current) {
        contentRef.current.innerText = value || '';
      }
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

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
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

  const handleElementClick = (e) => {
    e?.stopPropagation?.();
    if (isEditing && onSelectBlock && id) {
      onSelectBlock({
        id,
        type: 'text',
        label: value || id,
        value,
        style: blockStyle,
        onUpdateText: onChange
      });
    }
  };

  const hasOffset = localOffset.x !== 0 || localOffset.y !== 0;
  const transformStyle = hasOffset
    ? { transform: `translate3d(${localOffset.x}px, ${localOffset.y}px, 0)` }
    : {};

  // Compute custom Canva Studio styling
  const customBlockInlineStyle = {
    ...transformStyle,
    ...(blockStyle?.color ? { color: blockStyle.color } : {}),
    ...(blockStyle?.fontSize ? { fontSize: blockStyle.fontSize } : {}),
    ...(blockStyle?.fontFamily ? { fontFamily: blockStyle.fontFamily } : {}),
    ...(blockStyle?.fontWeight ? { fontWeight: blockStyle.fontWeight } : {}),
    ...(blockStyle?.fontStyle ? { fontStyle: blockStyle.fontStyle } : {}),
    ...(blockStyle?.textAlign ? { textAlign: blockStyle.textAlign } : {}),
    ...(blockStyle?.textTransform ? { textTransform: blockStyle.textTransform } : {}),
    ...(blockStyle?.letterSpacing ? { letterSpacing: blockStyle.letterSpacing } : {}),
    ...(blockStyle?.background ? { background: blockStyle.background } : {}),
    ...(blockStyle?.backgroundColor ? { backgroundColor: blockStyle.backgroundColor } : {}),
    ...(blockStyle?.backgroundImage ? { backgroundImage: blockStyle.backgroundImage } : {}),
    ...(blockStyle?.backgroundSize ? { backgroundSize: blockStyle.backgroundSize } : {}),
    ...(blockStyle?.backgroundPosition ? { backgroundPosition: blockStyle.backgroundPosition } : {}),
    ...(blockStyle?.borderRadius ? { borderRadius: blockStyle.borderRadius } : {}),
    ...(blockStyle?.border ? { border: blockStyle.border } : {}),
    ...(blockStyle?.padding ? { padding: blockStyle.padding } : {}),
    ...(blockStyle?.boxShadow ? { boxShadow: blockStyle.boxShadow } : {}),
    ...(blockStyle?.backdropFilter ? { backdropFilter: blockStyle.backdropFilter, WebkitBackdropFilter: blockStyle.backdropFilter } : {})
  };

  // View mode (for site visitors)
  if (!isEditing) {
    return (
      <span 
        style={customBlockInlineStyle} 
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
      style={customBlockInlineStyle}
      onClick={handleElementClick}
      className={`relative group inline-block max-w-full transition-all ${
        isDragging ? 'z-40 scale-[1.02]' : 'z-20'
      } ${
        isSelected
          ? 'ring-2 ring-[#0071e3] ring-offset-2 ring-offset-black/90 rounded-xl shadow-[0_0_25px_rgba(0,113,227,0.45)]'
          : ''
      }`}
    >
      <Component
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onClick={(e) => {
          e.stopPropagation();
          handleElementClick(e);
        }}
        onFocus={(e) => {
          e.stopPropagation();
          handleElementClick(e);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} cursor-text border border-dashed ${
          isSelected ? 'border-[#0071e3] bg-[#0071e3]/15' : 'border-[#0071e3]/60 bg-[#0071e3]/10 hover:bg-[#0071e3]/15'
        } focus:bg-[#0071e3]/20 focus:border-solid focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none rounded-lg px-2 py-0.5 -mx-2 transition-all`}
        title="Nhấp trực tiếp để sửa nội dung và mở Canva Studio"
      >
        {value}
      </Component>

      {/* Floating Drag & Move Handle on Top Left */}
      {allowDrag && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`absolute -top-4 -left-2 flex items-center gap-1 transition-opacity z-30 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
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

          {/* Canva Studio Tag */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(e);
            }}
            className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-semibold flex items-center gap-0.5 shadow-md hover:scale-105 cursor-pointer"
            title="Mở bảng chỉnh sửa Canva Studio cho khối này"
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>Canva</span>
          </button>
        </div>
      )}

      {/* Floating mini pencil indicator on Top Right */}
      <span className="absolute -top-3 -right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0071e3] text-white p-1 rounded-full shadow-lg scale-75 z-20">
        <Pencil className="w-3 h-3" />
      </span>
    </span>
  );
}
