import React, { useState, useRef, useEffect } from 'react';
import { Move, Trash2, Maximize2 } from 'lucide-react';

export default function DraggableFloatingImage({
  item,
  isEditMode = false,
  onUpdatePosition,
  onUpdateWidth,
  onDelete
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Default coordinates if not set
  const posX = item.x ?? 20;
  const posY = item.y ?? 100;
  const width = item.width ?? 220;

  const handleMouseDown = (e) => {
    if (!isEditMode) return;
    // Don't drag if clicking buttons or range input
    if (e.target.closest('button') || e.target.closest('input')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - posX,
      y: e.clientY - posY
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - width - 20, e.clientX - dragOffset.x));
      const newY = Math.max(10, e.clientY - dragOffset.y);
      onUpdatePosition?.(item.id, newX, newY);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, item.id, width, onUpdatePosition]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${width}px`,
        zIndex: isEditMode ? 40 : 30
      }}
      className={`select-none transition-shadow ${
        isEditMode
          ? 'cursor-grab active:cursor-grabbing ring-2 ring-[#0071e3] ring-dashed rounded-2xl p-1 bg-[#161617]/90 shadow-2xl'
          : 'pointer-events-auto drop-shadow-2xl'
      }`}
    >
      {/* Edit Mode Toolbar Header */}
      {isEditMode && (
        <div className="flex items-center justify-between pb-1.5 px-2 text-[10px] text-white border-b border-white/10 mb-1 bg-black/60 rounded-xl">
          <div className="flex items-center gap-1 text-[#2997ff] font-semibold">
            <Move className="w-3 h-3" />
            <span>Kéo thả vị trí</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="100"
              max="450"
              value={width}
              onChange={(e) => onUpdateWidth?.(item.id, Number(e.target.value))}
              className="w-14 h-1 accent-[#0071e3] cursor-pointer"
              title="Chỉnh kích thước"
            />
            <button
              onClick={() => onDelete?.(item.id)}
              className="p-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Xóa ảnh này"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* The Image Element */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/40">
        <img
          src={item.src}
          alt={item.caption || "Floating showcase asset"}
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
