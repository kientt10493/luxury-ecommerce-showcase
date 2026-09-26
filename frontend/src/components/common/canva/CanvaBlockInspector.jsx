import React, { useState } from 'react';
import {
  Sparkles,
  X,
  RotateCcw,
  Palette,
  Type,
  Image as ImageIcon,
  Sliders,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  ChevronDown,
  Layers,
  Check
} from 'lucide-react';

const FONT_FAMILIES = [
  { name: 'Apple SF Pro (Hệ thống)', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { name: 'Inter (Hiện đại, Sắc nét)', value: "'Inter', sans-serif" },
  { name: 'Outfit (Đột phá công nghệ)', value: "'Outfit', sans-serif" },
  { name: 'Playfair Display (Cổ điển sang trọng)', value: "'Playfair Display', serif" },
  { name: 'Cinzel (Hoàng gia cao cấp)', value: "'Cinzel', serif" },
  { name: 'Fira Code (Kỹ thuật Monospace)', value: "'Fira Code', monospace" }
];

const TEXT_COLORS = [
  { name: 'Trắng Tinh Khiết', value: '#ffffff' },
  { name: 'Xám Titan', value: '#a1a1a6' },
  { name: 'Vàng Hoàng Kim (Gold)', value: '#fde047' },
  { name: 'Xanh Pacific (Apple Blue)', value: '#2997ff' },
  { name: 'Xanh Ngọc Lục Bảo (Emerald)', value: '#34d399' },
  { name: 'Đỏ Ruby (Crimson)', value: '#f43f5e' },
  { name: 'Tím Không Gian (Cyber)', value: '#c084fc' },
  { name: 'Cam Hổ Phách (Amber)', value: '#fb923c' },
  { name: 'Đen Obsidian', value: '#09090b' }
];

const BG_PRESETS = [
  { name: 'Trong suốt', value: 'transparent', border: 'none', filter: 'none' },
  { name: 'Kính Tối Luxury', value: 'rgba(22, 22, 23, 0.85)', border: '1px solid rgba(255,255,255,0.15)', filter: 'blur(20px)' },
  { name: 'Kính Mờ Pha Lê', value: 'rgba(255, 255, 255, 0.10)', border: '1px solid rgba(255,255,255,0.25)', filter: 'blur(16px)' },
  { name: 'Ánh Vàng Hoàng Kim', value: 'linear-gradient(135deg, rgba(234, 179, 8, 0.22), rgba(0, 0, 0, 0.85))', border: '1px solid rgba(234,179,8,0.45)', filter: 'blur(12px)' },
  { name: 'Ánh Xanh Sapphire', value: 'linear-gradient(135deg, rgba(41, 151, 255, 0.25), rgba(0, 0, 0, 0.88))', border: '1px solid rgba(41,151,255,0.45)', filter: 'blur(16px)' },
  { name: 'Titanium Đen', value: 'rgba(10, 10, 12, 0.95)', border: '1px solid rgba(255,255,255,0.1)', filter: 'none' },
  { name: 'Ngọc Lục Bảo', value: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(0, 0, 0, 0.85))', border: '1px solid rgba(16,185,129,0.45)', filter: 'blur(12px)' },
  { name: 'Đỏ Ruby', value: 'linear-gradient(135deg, rgba(244, 63, 94, 0.22), rgba(0, 0, 0, 0.85))', border: '1px solid rgba(244,63,94,0.45)', filter: 'blur(12px)' }
];

const PRESET_BG_IMAGES = [
  { name: 'Carbon Texture', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop' },
  { name: 'Dark Gradient Aura', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' },
  { name: 'Deep Space Stars', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop' },
  { name: 'Titanium Metal Mesh', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop' }
];

export default function CanvaBlockInspector({
  activeBlock,
  blockStyle = {},
  onUpdateStyle,
  onResetStyle,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('typography'); // 'typography' | 'background' | 'effects'
  const [customImgInput, setCustomImgInput] = useState('');

  if (!activeBlock) return null;

  const currentFontFamily = blockStyle.fontFamily || '';
  const currentFontSize = parseInt(blockStyle.fontSize) || 16;
  const currentColor = blockStyle.color || '#ffffff';
  const currentBg = blockStyle.backgroundColor || blockStyle.background || '';
  const isBold = blockStyle.fontWeight === 'bold' || blockStyle.fontWeight >= 700;
  const isItalic = blockStyle.fontStyle === 'italic';
  const textAlign = blockStyle.textAlign || 'left';
  const isUppercase = blockStyle.textTransform === 'uppercase';
  const borderRadius = parseInt(blockStyle.borderRadius) || 0;

  const handleFontSizeChange = (delta) => {
    const next = Math.max(10, Math.min(96, currentFontSize + delta));
    onUpdateStyle?.({ fontSize: `${next}px` });
  };

  const handleSetBgPreset = (preset) => {
    onUpdateStyle?.({
      backgroundColor: preset.value.startsWith('linear-gradient') ? undefined : preset.value,
      background: preset.value.startsWith('linear-gradient') ? preset.value : undefined,
      border: preset.border,
      backdropFilter: preset.filter,
      padding: blockStyle.padding || '16px 24px',
      borderRadius: blockStyle.borderRadius || '20px'
    });
  };

  const handleApplyBgImage = (url) => {
    if (!url) {
      onUpdateStyle?.({
        backgroundImage: undefined,
        backgroundSize: undefined,
        backgroundPosition: undefined
      });
      return;
    }
    onUpdateStyle?.({
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: blockStyle.borderRadius || '20px',
      padding: blockStyle.padding || '20px'
    });
  };

  return (
    <div 
      data-canva-toolbar="true"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-3xl rounded-3xl bg-[#161617]/95 backdrop-blur-2xl border border-[#0071e3]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-[#0071e3]/30 p-3 sm:p-4 text-white text-xs select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#0071e3] to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white truncate text-xs sm:text-sm">
                Canva Studio · {activeBlock.label || activeBlock.id}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/20 text-[#2997ff] text-[10px] font-mono border border-[#0071e3]/30">
                {activeBlock.type || 'Block'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onResetStyle}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#a1a1a6] hover:text-white flex items-center gap-1 transition-all cursor-pointer text-[11px]"
            title="Khôi phục style nguyên bản của khối"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Đặt lại gốc</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white transition-all cursor-pointer"
            title="Đóng bảng Canva Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-3 bg-black/40 p-1 rounded-2xl border border-white/5">
        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer text-xs ${
            activeTab === 'typography'
              ? 'bg-[#0071e3] text-white shadow'
              : 'text-[#86868b] hover:text-white hover:bg-white/5'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Font chữ & Màu sắc</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('background')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer text-xs ${
            activeTab === 'background'
              ? 'bg-[#0071e3] text-white shadow'
              : 'text-[#86868b] hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Chèn Nền & Ảnh</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('effects')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer text-xs ${
            activeTab === 'effects'
              ? 'bg-[#0071e3] text-white shadow'
              : 'text-[#86868b] hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Bo góc & Định dạng</span>
        </button>
      </div>

      {/* Tab 1: Typography & Text Colors */}
      {activeTab === 'typography' && (
        <div className="space-y-3">
          {/* Row 1: Font Family & Size & Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Font Family selector */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">Kiểu Font chữ</span>
              <select
                value={currentFontFamily}
                onChange={(e) => onUpdateStyle?.({ fontFamily: e.target.value })}
                className="w-full bg-[#1c1c1e] text-white border border-white/15 rounded-xl px-3 py-1.5 outline-none focus:border-[#0071e3] cursor-pointer"
              >
                <option value="">-- Mặc định (Apple SF Pro) --</option>
                {FONT_FAMILIES.map((f) => (
                  <option key={f.name} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size +/- */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">Cỡ chữ (px)</span>
              <div className="flex items-center justify-between bg-[#1c1c1e] rounded-xl px-2 py-1 border border-white/15">
                <button
                  type="button"
                  onClick={() => handleFontSizeChange(-2)}
                  className="p-1 hover:bg-white/15 rounded text-white transition-colors cursor-pointer"
                  title="Giảm cỡ chữ"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-xs font-semibold text-[#2997ff]">
                  {currentFontSize}px
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
            </div>
          </div>

          {/* Row 2: Text Style Toggles (Bold, Italic, Uppercase, Alignment) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateStyle?.({ fontWeight: isBold ? 'normal' : 'bold' })}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isBold
                    ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                    : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
                }`}
                title="In đậm (Bold)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onUpdateStyle?.({ fontStyle: isItalic ? 'normal' : 'italic' })}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isItalic
                    ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                    : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
                }`}
                title="In nghiêng (Italic)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onUpdateStyle?.({ textTransform: isUppercase ? 'none' : 'uppercase' })}
                className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer font-mono text-[11px] ${
                  isUppercase
                    ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                    : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
                }`}
                title="In hoa toàn bộ chữ"
              >
                AA
              </button>
            </div>

            {/* Alignments */}
            <div className="flex items-center bg-[#1c1c1e] rounded-xl p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => onUpdateStyle?.({ textAlign: 'left' })}
                className={`p-1.5 rounded-lg cursor-pointer ${textAlign === 'left' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
                title="Căn trái"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateStyle?.({ textAlign: 'center' })}
                className={`p-1.5 rounded-lg cursor-pointer ${textAlign === 'center' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
                title="Căn giữa"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateStyle?.({ textAlign: 'right' })}
                className={`p-1.5 rounded-lg cursor-pointer ${textAlign === 'right' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
                title="Căn phải"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 3: Luxury Text Colors Swatches */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">Màu sắc văn bản</span>
            <div className="flex flex-wrap items-center gap-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onUpdateStyle?.({ color: c.value })}
                  className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                    currentColor.toLowerCase() === c.value.toLowerCase()
                      ? 'border-white scale-110 shadow-lg ring-2 ring-[#0071e3]'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  {currentColor.toLowerCase() === c.value.toLowerCase() && (
                    <Check className={`w-3 h-3 ${c.value === '#ffffff' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}

              {/* Native Color Picker for custom Hex */}
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer text-[11px]">
                <Palette className="w-3.5 h-3.5 text-[#2997ff]" />
                <span>Mã màu:</span>
                <input
                  type="color"
                  value={currentColor.startsWith('#') ? currentColor : '#ffffff'}
                  onChange={(e) => onUpdateStyle?.({ color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Backgrounds & Images */}
      {activeTab === 'background' && (
        <div className="space-y-3">
          {/* Glassmorphism Presets */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
              1. Nền Kính Luxury (Glassmorphism & Gradients)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BG_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSetBgPreset(p)}
                  className="px-2.5 py-2 rounded-xl text-left border border-white/10 hover:border-[#0071e3] transition-all cursor-pointer bg-white/5 hover:bg-white/10 flex flex-col gap-1"
                >
                  <span className="font-semibold text-[11px] text-white">{p.name}</span>
                  <div
                    className="w-full h-3 rounded border border-white/20 shadow-inner"
                    style={{ background: p.value }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Insert Background Image */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
              2. Chèn Ảnh Nền Vào Khối
            </span>

            {/* Quick Preset Images */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {PRESET_BG_IMAGES.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => handleApplyBgImage(img.url)}
                  className="relative group rounded-xl overflow-hidden h-12 border border-white/15 hover:border-[#0071e3] transition-all cursor-pointer"
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] text-white font-medium text-center px-1">
                    {img.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customImgInput}
                onChange={(e) => setCustomImgInput(e.target.value)}
                placeholder="Dán link ảnh nền trực tiếp (https://...)"
                className="flex-1 bg-[#1c1c1e] text-white border border-white/15 rounded-xl px-3 py-1.5 outline-none focus:border-[#0071e3] text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (customImgInput.trim()) {
                    handleApplyBgImage(customImgInput.trim());
                    setCustomImgInput('');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs cursor-pointer shadow"
              >
                Áp dụng
              </button>
              {blockStyle.backgroundImage && (
                <button
                  type="button"
                  onClick={() => handleApplyBgImage('')}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs cursor-pointer"
                  title="Gỡ ảnh nền"
                >
                  Gỡ ảnh
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Radius, Padding & Glow Effects */}
      {activeTab === 'effects' && (
        <div className="space-y-3">
          {/* Border Radius */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
              Bo góc khung (Border Radius)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: 'Vuông (0px)', val: '0px' },
                { name: 'Bo nhẹ (8px)', val: '8px' },
                { name: 'Apple Chuẩn (16px)', val: '16px' },
                { name: 'Bo lớn (24px)', val: '24px' },
                { name: 'Viên thuốc (Pill)', val: '9999px' }
              ].map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => onUpdateStyle?.({ borderRadius: r.val })}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                    blockStyle.borderRadius === r.val
                      ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                      : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
              Khoảng cách đệm (Padding)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: 'Gọn (4px 8px)', val: '4px 8px' },
                { name: 'Chuẩn (8px 16px)', val: '8px 16px' },
                { name: 'Rộng (16px 24px)', val: '16px 24px' },
                { name: 'Thoáng (24px 36px)', val: '24px 36px' }
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => onUpdateStyle?.({ padding: p.val })}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                    blockStyle.padding === p.val
                      ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                      : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Glow / Box Shadow */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
              Ánh sáng phát quang (Glow & Shadow)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: 'Không phát sáng', val: 'none' },
                { name: 'Xanh Sapphire Glow', val: '0 0 25px rgba(41, 151, 255, 0.45)' },
                { name: 'Vàng Hoàng Kim Glow', val: '0 0 25px rgba(234, 179, 8, 0.45)' },
                { name: 'Đổ bóng sâu 3D', val: '0 20px 50px rgba(0, 0, 0, 0.85)' }
              ].map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => onUpdateStyle?.({ boxShadow: s.val })}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                    blockStyle.boxShadow === s.val
                      ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                      : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
