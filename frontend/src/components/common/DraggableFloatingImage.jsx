import React, { useState, useRef, useEffect } from 'react';
import { Move, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function DraggableFloatingImage({
  item,
  isEditMode = false,
  onUpdatePosition,
  onUpdateWidth,
  onDelete
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState({ x: item.x ?? 40, y: item.y ?? 160 });
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const containerRef = useRef(null);

  // Sync localPos when item props change and not actively dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalPos({ x: item.x ?? 40, y: item.y ?? 160 });
    }
  }, [item.x, item.y, isDragging]);

  const width = item.width ?? 220;

  // Pointer Down handler: handles mouse, stylus, and touch flawlessly
  const handlePointerDown = (e) => {
    if (!isEditMode) return;
    // Don't drag if clicking buttons, inputs, or sliders
    if (e.target.closest('button') || e.target.closest('input')) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: localPos.x,
      initialY: localPos.y
    };

    // Capture pointer so dragging continues smoothly even outside container
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const maxX = Math.max(10, window.innerWidth - width - 20);
    const maxY = Math.max(10, window.innerHeight - 80);

    const newX = Math.max(10, Math.min(maxX, Math.round(dragStartRef.current.initialX + deltaX)));
    const newY = Math.max(10, Math.min(maxY, Math.round(dragStartRef.current.initialY + deltaY)));

    setLocalPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    // Commit final position to parent state
    onUpdatePosition?.(item.id, localPos.x, localPos.y);
  };

  // Nudge buttons for ultra-precise or keyboard-free placement
  const handleNudge = (dx, dy) => {
    const maxX = Math.max(10, window.innerWidth - width - 20);
    const maxY = Math.max(10, window.innerHeight - 80);
    const newX = Math.max(10, Math.min(maxX, localPos.x + dx));
    const newY = Math.max(10, Math.min(maxY, localPos.y + dy));
    setLocalPos({ x: newX, y: newY });
    onUpdatePosition?.(item.id, newX, newY);
  };

  // Quick preset alignments
  const handleAlign = (alignment) => {
    let newX = 30;
    if (alignment === 'center') {
      newX = Math.max(10, Math.round((window.innerWidth - width) / 2));
    } else if (alignment === 'right') {
      newX = Math.max(10, window.innerWidth - width - 30);
    }
    setLocalPos((prev) => ({ ...prev, x: newX }));
    onUpdatePosition?.(item.id, newX, localPos.y);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'fixed',
        left: `${localPos.x}px`,
        top: `${localPos.y}px`,
        width: `${width}px`,
        zIndex: isEditMode ? 45 : 30,
        touchAction: isEditMode ? 'none' : 'auto'
      }}
      className={`select-none transition-shadow duration-150 ${
        isEditMode
          ? 'ring-2 ring-[#0071e3] ring-offset-2 ring-offset-black rounded-2xl p-2 bg-[#161617]/95 backdrop-blur-xl shadow-2xl cursor-grab active:cursor-grabbing'
          : 'pointer-events-auto drop-shadow-2xl'
      }`}
    >
      {/* Edit Mode Control Center */}
      {isEditMode && (
        <div className="space-y-1.5 pb-2 mb-2 border-b border-white/10 text-[11px] text-white">
          {/* Main Grip Handle */}
          <div className="flex items-center justify-between bg-black/60 px-2 py-1 rounded-xl">
            <div className="flex items-center gap-1.5 text-[#2997ff] font-semibold text-[11px]">
              <Move className="w-3.5 h-3.5 animate-pulse" />
              <span>⠿ Giữ & Kéo Di Chuyển</span>
            </div>

            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              className="p-1 rounded hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Xóa ảnh này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Nudge & Alignment Toolbar */}
          <div className="flex items-center justify-between gap-1 text-[10px] text-[#86868b] px-0.5">
            {/* Direct Directional Nudge */}
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => handleNudge(-25, 0)}
                className="p-1 hover:bg-white/10 text-white rounded transition-colors"
                title="Dịch sang trái"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(0, -25)}
                className="p-1 hover:bg-white/10 text-white rounded transition-colors"
                title="Dịch lên trên"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(0, 25)}
                className="p-1 hover:bg-white/10 text-white rounded transition-colors"
                title="Dịch xuống dưới"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(25, 0)}
                className="p-1 hover:bg-white/10 text-white rounded transition-colors"
                title="Dịch sang phải"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Snap Alignments */}
            <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => handleAlign('left')}
                className="p-1 hover:bg-white/10 text-[#86868b] hover:text-white rounded"
                title="Căn lề trái"
              >
                <AlignLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleAlign('center')}
                className="p-1 hover:bg-white/10 text-[#86868b] hover:text-white rounded"
                title="Căn giữa màn hình"
              >
                <AlignCenter className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleAlign('right')}
                className="p-1 hover:bg-white/10 text-[#86868b] hover:text-white rounded"
                title="Căn lề phải"
              >
                <AlignRight className="w-3 h-3" />
              </button>
            </div>

            {/* Size Slider */}
            <div className="flex items-center gap-1">
              <span className="text-[9px]">Thu/Phóng:</span>
              <input
                type="range"
                min="120"
                max="450"
                value={width}
                onChange={(e) => onUpdateWidth?.(item.id, Number(e.target.value))}
                className="w-14 h-1 accent-[#0071e3] cursor-pointer"
                title="Chỉnh độ rộng ảnh"
              />
            </div>
          </div>
        </div>
      )}

      {/* The Image Element */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/40">
        <img
          src={item.src}
          alt={item.caption || "Floating showcase asset"}
          draggable={false}
          className="w-full h-auto object-cover pointer-events-none rounded-xl"
        />
      </div>

      {item.caption && (
        <div className="mt-1 text-center text-[10px] text-[#86868b] font-medium truncate px-1">
          {item.caption}
        </div>
      )}
    </div>
  );
}
