import React, { useState } from 'react';
import {
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  Image as ImageIcon,
  Minus,
  Plus,
  Sliders,
  Sparkles
} from 'lucide-react';

const LUXURY_PALETTE = [
  { name: 'Trắng tinh khiết', color: '#ffffff' },
  { name: 'Xám Titan', color: '#86868b' },
  { name: 'Vàng Gold Hoàng Gia', color: '#ffd700' },
  { name: 'Xanh Apple Pacific', color: '#2997ff' },
  { name: 'Xanh Ngọc Lục Bảo', color: '#30d158' },
  { name: 'Đỏ Ruby', color: '#ff453a' },
  { name: 'Tím Không Gian', color: '#bf5af2' },
  { name: 'Đen Obsidian', color: '#161617' }
];

const BG_PRESETS = [
  { name: 'Trong suốt', value: 'transparent' },
  { name: 'Kính tối (Dark Glass)', value: 'rgba(22, 22, 23, 0.85)' },
  { name: 'Kính mờ (Frosted Glass)', value: 'rgba(255, 255, 255, 0.12)' },
  { name: 'Ánh Vàng Gold', value: 'rgba(255, 215, 0, 0.15)' },
  { name: 'Ánh Xanh Sapphire', value: 'rgba(41, 151, 255, 0.18)' },
  { name: 'Titanium Đen', value: 'rgba(0, 0, 0, 0.75)' }
];

export default function CanvaToolbar({
  element,
  onUpdateStyle,
  onUpdateContent,
  onStartEditing,
  onBringForward,
  onSendBackward,
  onDuplicate,
  onDelete
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  if (!element) return null;

  const style = element.style || {};
  const isTextType = element.type === 'text' || element.type === 'badge';
  const fontSize = style.fontSize ?? (element.type === 'badge' ? 12 : 24);
  const currentColor = style.color || '#ffffff';
  const isBold = style.fontWeight === 'bold' || style.fontWeight === 700;
  const textAlign = style.textAlign || 'center';
  const opacity = Math.round((style.opacity ?? 1) * 100);

  const handleFontSizeChange = (delta) => {
    const newSize = Math.max(10, Math.min(96, fontSize + delta));
    onUpdateStyle?.({ fontSize: newSize });
  };

  const handleOpacityChange = (val) => {
    onUpdateStyle?.({ opacity: Math.max(0.1, Math.min(1, val / 100)) });
  };

  return (
    <div
      data-canva-toolbar="true"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#161617]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-xs text-white select-none whitespace-nowrap pointer-events-auto apple-animate-in"
    >
      {/* 0. Direct Edit Content Button for Text & Badge */}
      {isTextType && (
        <button
          type="button"
          onClick={() => onStartEditing?.()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold transition-all shadow-md cursor-pointer hover:scale-105"
          title="Chỉnh sửa nội dung chữ"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="text-[11px]">Sửa chữ</span>
        </button>
      )}

      {/* 1. Typography Controls for Text / Badge */}
      {isTextType && (
        <>
          {/* Font Size +/- */}
          <div className="flex items-center bg-white/10 rounded-xl px-1 py-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => handleFontSizeChange(-2)}
              className="p-1 hover:bg-white/15 rounded text-white transition-colors cursor-pointer"
              title="Giảm cỡ chữ"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-semibold text-[#2997ff] min-w-[28px] text-center">
              {fontSize}
            </span>
            <button
              type="button"
              onClick={() => handleFontSizeChange(2)}
              className="p-1 hover:bg-white/15 rounded text-white transition-colors cursor-pointer"
              title="Tăng cỡ chữ"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Color Palette Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowBgPicker(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
              title="Đổi màu chữ"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
              <span className="text-[11px] hidden sm:inline">Màu</span>
            </button>

            {showColorPicker && (
              <div className="absolute top-10 left-0 bg-[#1c1c1e] p-2.5 rounded-2xl border border-white/15 shadow-2xl z-50 grid grid-cols-4 gap-2 w-48">
                {LUXURY_PALETTE.map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => {
                      onUpdateStyle?.({ color: item.color });
                      setShowColorPicker(false);
                    }}
                    className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    title={item.name}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-white/30 shadow"
                      style={{ backgroundColor: item.color }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bold Toggle */}
          <button
            type="button"
            onClick={() => onUpdateStyle?.({ fontWeight: isBold ? 'normal' : 'bold' })}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isBold
                ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                : 'bg-white/10 border-white/10 text-[#86868b] hover:text-white'
            }`}
            title="In đậm (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Alignment Toggle */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => onUpdateStyle?.({ textAlign: 'left' })}
              className={`p-1 rounded cursor-pointer ${textAlign === 'left' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
              title="Căn trái"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateStyle?.({ textAlign: 'center' })}
              className={`p-1 rounded cursor-pointer ${textAlign === 'center' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
              title="Căn giữa"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateStyle?.({ textAlign: 'right' })}
              className={`p-1 rounded cursor-pointer ${textAlign === 'right' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
              title="Căn phải"
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </div>

          {/* Background / Pill Style Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowBgPicker(!showBgPicker);
                setShowColorPicker(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
              title="Đổi màu nền khung / tem"
            >
              <Sparkles className="w-3 h-3 text-[#ff9f0a]" />
              <span className="text-[11px] hidden md:inline">Nền</span>
            </button>

            {showBgPicker && (
              <div className="absolute top-10 left-0 bg-[#1c1c1e] p-2 rounded-2xl border border-white/15 shadow-2xl z-50 flex flex-col gap-1 w-44">
                {BG_PRESETS.map((bg) => (
                  <button
                    key={bg.name}
                    type="button"
                    onClick={() => {
                      onUpdateStyle?.({
                        backgroundColor: bg.value,
                        border: bg.value === 'transparent' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                        borderRadius: bg.value === 'transparent' ? 0 : 16,
                        padding: bg.value === 'transparent' ? '4px' : '8px 16px'
                      });
                      setShowBgPicker(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-start text-[11px] hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    {bg.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. Image Specific Controls */}
      {element.type === 'image' && (
        <div className="flex items-center gap-2 px-1">
          <button
            type="button"
            onClick={() => {
              const newUrl = prompt('Nhập URL hình ảnh mới:', element.content || '');
              if (newUrl && newUrl.trim()) {
                onUpdateContent?.(newUrl.trim());
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium transition-colors cursor-pointer"
            title="Đổi link ảnh"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="text-[11px]">Đổi ảnh</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-[#86868b]">
            <Sliders className="w-3 h-3" />
            <span>Mờ:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={opacity}
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              className="w-16 h-1 accent-[#0071e3] cursor-pointer"
              title="Chỉnh độ trong suốt"
            />
            <span className="text-[10px] w-6">{opacity}%</span>
          </div>

          <button
            type="button"
            onClick={() => onUpdateStyle?.({ borderRadius: (style.borderRadius || 0) > 0 ? 0 : 24 })}
            className={`px-2 py-1 rounded-xl text-[11px] border transition-colors cursor-pointer ${
              (style.borderRadius || 0) > 0
                ? 'bg-[#0071e3] border-[#0071e3] text-white'
                : 'bg-white/10 border-white/10 text-[#86868b] hover:text-white'
            }`}
            title="Bật/Tắt bo góc tròn"
          >
            Bo góc
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="w-[1px] h-5 bg-white/20 mx-0.5" />

      {/* 3. Universal Actions (Layering, Duplicate, Delete) */}
      <div className="flex items-center gap-1">
        {/* Layer Controls */}
        <button
          type="button"
          onClick={() => onBringForward?.(element.id)}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#86868b] hover:text-white transition-colors cursor-pointer"
          title="Đưa lên lớp trên (Bring Forward)"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onSendBackward?.(element.id)}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#86868b] hover:text-white transition-colors cursor-pointer"
          title="Hạ xuống lớp dưới (Send Backward)"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={() => onDuplicate?.(element.id)}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#2997ff] hover:text-white transition-colors cursor-pointer"
          title="Nhân bản (Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete?.(element.id)}
          className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer flex items-center gap-1"
          title="Xóa đối tượng (Delete)"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold text-rose-300">Xóa</span>
        </button>
      </div>
    </div>
  );
}
