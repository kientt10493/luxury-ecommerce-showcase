import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Move, Trash2, Check } from 'lucide-react';
import CanvaToolbar from './CanvaToolbar';
import CanvaImageSlider from './CanvaImageSlider';
import CanvaIconRenderer from './CanvaIconRenderer';

export default function CanvaBoundingBox({
  element,
  isSelected = false,
  isEditMode = false,
  onSelect,
  onSaveSnapshot,
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
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0 });

  // Focus textarea when editing begins
  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      textInputRef.current.focus();
      // Select all text for quick overwriting
      textInputRef.current.select();
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

  // 1. Drag / Move Handler with Pointer Capture
  const handleDragStart = (e) => {
    if (!isEditMode) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || isEditingText) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    onSelect?.(id);

    isDraggingRef.current = true;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: x,
      initY: y
    };

    // Save snapshot once at the start of drag gesture for clean undo
    onSaveSnapshot?.();

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

    const onPointerMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 60, Math.round(dragStartRef.current.initX + dx)));
      const newY = Math.max(0, Math.round(dragStartRef.current.initY + dy));
      onUpdateTransform?.(id, { x: newX, y: newY }, false);
    };

    const onPointerUp = (upEvent) => {
      isDraggingRef.current = false;
      if (upEvent?.currentTarget?.releasePointerCapture) {
        try {
          upEvent.currentTarget.releasePointerCapture(upEvent.pointerId);
        } catch (_) {}
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // 2. 8-Point Resize Handler
  const handleResizeStart = (e, handleDirection) => {
    e.preventDefault();
    e.stopPropagation();

    onSaveSnapshot?.();

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

      onUpdateTransform?.(
        id,
        {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH)
        },
        false
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // 3. Rotation Handle
  const handleRotateStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onSaveSnapshot?.();

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

      onUpdateTransform?.(id, { rotation: deg }, false);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
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
      data-canva-element="true"
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
        zIndex: isSelected ? 50 : (zIndex || 35)
      }}
      className={`select-none pointer-events-auto transition-shadow ${
        isEditMode ? 'cursor-grab active:cursor-grabbing' : ''
      } ${
        isEditMode && !isSelected
          ? 'hover:ring-1 hover:ring-[#0071e3]/60 hover:rounded-sm transition-all'
          : ''
      }`}
    >
      {/* Active Bounding Box Outline */}
      {isEditMode && isSelected && (
        <>
          {/* Blue Canva Border */}
          <div className="absolute -inset-1 border-2 border-[#0071e3] pointer-events-none rounded-sm shadow-xl ring-2 ring-[#0071e3]/30" />

          {/* Quick Delete Floating Button at Top-Right Corner */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl border-2 border-white/40 z-50 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
            title="Xóa đối tượng này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Contextual Floating Toolbar */}
          <CanvaToolbar
            element={element}
            onStartEditing={() => setIsEditingText(true)}
            onUpdateContent={(val) => onUpdateContent?.(id, val)}
            onUpdateStyle={(patch) => onUpdateStyle?.(id, patch)}
            onBringForward={() => onBringForward?.(id)}
            onSendBackward={() => onSendBackward?.(id)}
            onDuplicate={() => onDuplicate?.(id)}
            onDelete={() => onDelete?.(id)}
          />

          {/* 8 Resize Handles */}
          {handles.map((h) => (
            <div
              key={h.dir}
              onPointerDown={(e) => handleResizeStart(e, h.dir)}
              style={{ cursor: h.cursor }}
              className={`absolute w-3 h-3 bg-white border-2 border-[#0071e3] rounded-sm shadow-md z-50 pointer-events-auto hover:scale-125 transition-transform ${h.pos}`}
            />
          ))}

          {/* Bottom Action Pill: Dedicated Move & Rotate Handles */}
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute -bottom-11 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 pointer-events-auto"
          >
            {/* Dedicated Move Handle */}
            <div
              onPointerDown={handleDragStart}
              className="w-7 h-7 rounded-full bg-white border-2 border-[#0071e3] shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing text-[#0071e3] hover:scale-110 transition-transform"
              title="Giữ và kéo để di chuyển"
            >
              <Move className="w-3.5 h-3.5" />
            </div>

            {/* 360 Rotate Handle */}
            <div
              onPointerDown={handleRotateStart}
              className="w-7 h-7 rounded-full bg-white border-2 border-[#0071e3] shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing text-[#0071e3] hover:scale-110 transition-transform"
              title={`Xoay góc (Hiện tại: ${rotation}°)`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </div>

            {/* Rotation Degree Badge */}
            {rotation !== 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-[#161617]/90 text-[10px] font-mono text-white border border-white/20 shadow">
                {rotation}°
              </span>
            )}
          </div>
        </>
      )}

      {/* Render Element Content */}
      <div
        style={{
          fontSize: `${style.fontSize || (type === 'badge' ? 12 : 24)}px`,
          color: style.color || '#ffffff',
          fontWeight: style.fontWeight || 'normal',
          backgroundColor: style.backgroundColor || (style.background ? undefined : 'transparent'),
          background: style.background,
          borderRadius: typeof style.borderRadius === 'number' ? `${style.borderRadius}px` : style.borderRadius || '0px',
          border: style.border || 'none',
          boxShadow: style.boxShadow,
          backdropFilter: style.backdropFilter,
          WebkitBackdropFilter: style.backdropFilter,
          opacity: style.opacity ?? 1,
          padding: style.padding || (type === 'badge' ? '6px 14px' : type === 'button' ? '12px 24px' : '4px')
        }}
        className="w-full h-full overflow-hidden flex items-center justify-center transition-all pointer-events-auto"
      >
        {/* Text / Badge / Symbol Display or Inline Editor */}
        {(type === 'text' || type === 'badge' || type === 'symbol') && (
          isEditingText ? (
            <div
              className="w-full flex flex-col gap-2 p-1 z-50 pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                ref={textInputRef}
                value={content}
                onChange={(e) => onUpdateContent?.(id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    setIsEditingText(false);
                  } else if (e.key === 'Escape') {
                    setIsEditingText(false);
                  }
                }}
                rows={Math.max(2, (content || '').split('\n').length)}
                className="w-full bg-[#161617]/95 text-white rounded-xl p-2.5 text-inherit font-inherit border-2 border-[#0071e3] outline-none shadow-2xl resize-none text-left"
                placeholder="Nhập nội dung..."
              />
              <div className="flex items-center justify-between gap-2 px-1">
                <span className="text-[10px] text-[#86868b]">Ctrl+Enter để xong</span>
                <button
                  type="button"
                  onClick={() => setIsEditingText(false)}
                  className="px-3 py-1 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white text-[11px] font-semibold flex items-center gap-1 shadow cursor-pointer hover:scale-105 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Xong</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className="w-full break-words leading-snug cursor-pointer select-none"
              onClick={(e) => {
                if (isSelected) {
                  e.stopPropagation();
                  setIsEditingText(true);
                }
              }}
              title={isSelected ? 'Nhấp để chỉnh sửa nội dung' : 'Nhấp chọn'}
            >
              {content || (type === 'badge' ? 'Huy hiệu mới' : type === 'symbol' ? '✦' : 'Nhập văn bản...')}
            </div>
          )
        )}

        {/* Button Display / Editor */}
        {type === 'button' && (
          isEditingText ? (
            <div
              className="w-full flex items-center gap-2 p-1 z-50 pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={textInputRef}
                type="text"
                value={content}
                onChange={(e) => onUpdateContent?.(id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingText(false);
                }}
                className="w-full bg-black/80 text-white rounded-lg px-2 py-1 text-center font-inherit border border-[#0071e3] outline-none"
              />
              <button
                type="button"
                onClick={() => setIsEditingText(false)}
                className="px-2 py-1 rounded bg-[#0071e3] text-white text-xs"
              >
                Xong
              </button>
            </div>
          ) : (
            <div
              onClick={(e) => {
                if (isSelected) {
                  e.stopPropagation();
                  setIsEditingText(true);
                }
              }}
              className="w-full text-center font-semibold cursor-pointer select-none"
              title="Nhấn đúp để đổi chữ trên nút"
            >
              {content || 'Nút bấm CTA'}
            </div>
          )
        )}

        {/* Container / Card Box Display */}
        {(type === 'container' || type === 'box') && (
          <div
            className="w-full h-full flex items-center justify-center p-3 text-center opacity-80"
            title="Khối nền tự do"
          >
            {content && <span className="text-xs text-neutral-300 font-medium">{content}</span>}
          </div>
        )}

        {/* Icon Display */}
        {type === 'icon' && (
          <div className="flex items-center justify-center p-2">
            <CanvaIconRenderer
              name={content || 'Sparkles'}
              size={style.fontSize || 36}
              color={style.color || '#2997ff'}
            />
          </div>
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

        {/* Slider / Carousel Display */}
        {type === 'slider' && (
          <CanvaImageSlider
            images={content}
            style={style}
            isEditMode={true}
          />
        )}
      </div>
    </div>
  );
}
