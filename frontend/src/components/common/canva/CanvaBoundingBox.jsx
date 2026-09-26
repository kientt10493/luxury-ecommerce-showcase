import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Move } from 'lucide-react';
import CanvaToolbar from './CanvaToolbar';

export default function CanvaBoundingBox({
  element,
  isSelected = false,
  isEditMode = false,
  onSelect,
  onUpdateTransform,
  onUpdateContent,
  onUpdateStyle,
  onBringForward,
  onSendBackward,
  onDuplicate,
  onDelete
}) {
  const [isEditingText, setIsEditingText] = useState(false);
  const containerRef = useRef(null);
  const textInputRef = useRef(null);

  // Focus contenteditable on double click
  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditingText]);

  if (!element) return null;

  const {
    id,
    type,
    x = 100,
    y = 200,
    width = 240,
    height,
    rotation = 0,
    zIndex = 35,
    content = '',
    style = {}
  } = element;

  // 1. Drag / Move Handler
  const handleDragStart = (e) => {
    if (!isEditMode) return;
    if (e.target.closest('button') || e.target.closest('input') || isEditingText) return;

    e.preventDefault();
    e.stopPropagation();
    onSelect?.(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = x;
    const initY = y;

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newX = Math.max(10, Math.min(window.innerWidth - 60, Math.round(initX + dx)));
      const newY = Math.max(10, Math.round(initY + dy));
      onUpdateTransform?.(id, { x: newX, y: newY });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // 2. 8-Point Resize Handler
  const handleResizeStart = (e, handleDirection) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = x;
    const initY = y;
    const initW = width;
    const initH = containerRef.current?.offsetHeight || 60;

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newW = initW;
      let newH = initH;
      let newX = initX;
      let newY = initY;

      // Handle horizontal resize
      if (handleDirection.includes('e')) {
        newW = Math.max(60, initW + dx);
      } else if (handleDirection.includes('w')) {
        const potentialW = initW - dx;
        if (potentialW >= 60) {
          newW = potentialW;
          newX = initX + dx;
        }
      }

      // Handle vertical resize
      if (handleDirection.includes('s')) {
        newH = Math.max(30, initH + dy);
      } else if (handleDirection.includes('n')) {
        const potentialH = initH - dy;
        if (potentialH >= 30) {
          newH = potentialH;
          newY = initY + dy;
        }
      }

      onUpdateTransform?.(id, {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newW),
        height: Math.round(newH)
      });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // 3. Rotation Handle
  const handleRotateStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onPointerMove = (moveEvent) => {
      const rad = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      let deg = Math.round((rad * 180) / Math.PI) + 90;
      if (deg < 0) deg += 360;

      // Snap points: 0, 45, 90, 135, 180, 225, 270, 315, 360
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (const snap of snapAngles) {
        if (Math.abs(deg - snap) <= 4) {
          deg = snap === 360 ? 0 : snap;
          break;
        }
      }

      onUpdateTransform?.(id, { rotation: deg });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // 8 Handles specs
  const handles = [
    { dir: 'nw', cursor: 'nwse-resize', pos: '-top-1.5 -left-1.5' },
    { dir: 'n', cursor: 'ns-resize', pos: '-top-1.5 left-1/2 -translate-x-1/2' },
    { dir: 'ne', cursor: 'nesw-resize', pos: '-top-1.5 -right-1.5' },
    { dir: 'e', cursor: 'ew-resize', pos: 'top-1/2 -translate-y-1/2 -right-1.5' },
    { dir: 'se', cursor: 'nwse-resize', pos: '-bottom-1.5 -right-1.5' },
    { dir: 's', cursor: 'ns-resize', pos: '-bottom-1.5 left-1/2 -translate-x-1/2' },
    { dir: 'sw', cursor: 'nesw-resize', pos: '-bottom-1.5 -left-1.5' },
    { dir: 'w', cursor: 'ew-resize', pos: 'top-1/2 -translate-y-1/2 -left-1.5' }
  ];

  return (
    <div
      ref={containerRef}
      onPointerDown={handleDragStart}
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          onSelect?.(id);
        }
      }}
      onDoubleClick={(e) => {
        if (isEditMode && (type === 'text' || type === 'badge')) {
          e.stopPropagation();
          setIsEditingText(true);
        }
      }}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: height ? `${height}px` : 'auto',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        zIndex: isSelected ? 50 : zIndex
      }}
      className={`select-none transition-shadow ${
        isEditMode ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-auto'
      }`}
    >
      {/* Active Bounding Box Outline */}
      {isEditMode && isSelected && (
        <>
          {/* Blue Canva Border */}
          <div className="absolute -inset-1 border-2 border-[#0071e3] pointer-events-none rounded-sm shadow-md" />

          {/* Contextual Floating Toolbar */}
          <CanvaToolbar
            element={element}
            onUpdateStyle={(patch) => onUpdateStyle?.(id, patch)}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />

          {/* 8 Resize Handles */}
          {handles.map((h) => (
            <div
              key={h.dir}
              onPointerDown={(e) => handleResizeStart(e, h.dir)}
              style={{ cursor: h.cursor }}
              className={`absolute w-3 h-3 bg-white border-2 border-[#0071e3] rounded-sm shadow-sm z-50 ${h.pos}`}
            />
          ))}

          {/* 360 Rotation Handle (Located 24px below bottom-center) */}
          <div
            onPointerDown={handleRotateStart}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#0071e3] shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-50 text-[#0071e3] hover:scale-110 transition-transform"
            title={`Xoay góc (Hiện tại: ${rotation}°)`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </div>
        </>
      )}

      {/* Render Element Content */}
      <div
        style={{
          fontSize: `${style.fontSize || (type === 'badge' ? 12 : 24)}px`,
          color: style.color || '#ffffff',
          fontWeight: style.fontWeight || 'normal',
          textAlign: style.textAlign || 'center',
          backgroundColor: style.backgroundColor || 'transparent',
          borderRadius: `${style.borderRadius || 0}px`,
          border: style.border || 'none',
          opacity: style.opacity ?? 1,
          padding: style.padding || (type === 'badge' ? '6px 14px' : '4px')
        }}
        className="w-full h-full overflow-hidden flex items-center justify-center transition-all"
      >
        {/* Text / Badge Display or Inline Editor */}
        {(type === 'text' || type === 'badge') && (
          isEditingText ? (
            <input
              ref={textInputRef}
              type="text"
              value={content}
              onChange={(e) => onUpdateContent?.(id, e.target.value)}
              onBlur={() => setIsEditingText(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingText(false);
              }}
              className="w-full bg-transparent outline-none border-b border-[#0071e3] text-inherit font-inherit text-center px-1"
            />
          ) : (
            <span className="w-full break-words leading-snug">
              {content || (type === 'badge' ? 'Huy hiệu mới' : 'Nhập văn bản...')}
            </span>
          )
        )}

        {/* Image Display */}
        {type === 'image' && (
          <img
            src={content}
            alt="Canva visual element"
            draggable={false}
            className="w-full h-auto object-cover pointer-events-none rounded-inherit shadow-lg"
          />
        )}
      </div>
    </div>
  );
}
