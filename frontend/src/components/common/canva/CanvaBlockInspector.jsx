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
  Check,
  Layers,
  Upload,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Trash2,
  Eye,
  Loader2,
  Copy
} from 'lucide-react';
import { adminApi } from '../../../services/api';
import { LUXURY_COLOR_PRESETS } from '../../showcase/colorPresets';

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

const SECTION_NAMES = {
  hero: '1. Khối Giới Thiệu Hero Showcase',
  configurator: '2. Trình Chọn Cấu Hình & Mua Hàng',
  bento: '3. Thẻ Đột Phá Bento Highlights',
  specs: '4. Bảng Thông Số Kỹ Thuật Tech Specs'
};

export default function CanvaBlockInspector({
  activeBlock,
  blockStyle = {},
  onUpdateStyle,
  onResetStyle,
  onClose,
  embedded = false,
  sectionOrder = ['hero', 'configurator', 'bento', 'specs'],
  onMoveSection,
  onDeleteBlock,
  onDuplicateBlock
}) {
  const isColorSwatchesBlock = activeBlock?.id === 'config-color-swatches' || activeBlock?.type === 'Bảng Màu Sắc' || !!activeBlock?.colorSwatches;

  const [activeTab, setActiveTab] = useState(() => isColorSwatchesBlock ? 'colors' : 'typography');
  const [customImgInput, setCustomImgInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [textValue, setTextValue] = useState(activeBlock?.value || '');
  const [colorSwatchesList, setColorSwatchesList] = useState(activeBlock?.colorSwatches || []);
  const [uploadingSwatchIdx, setUploadingSwatchIdx] = useState(null);
  const fileInputRef = React.useRef(null);
  const swatchFileRefs = React.useRef({});

  React.useEffect(() => {
    setTextValue(activeBlock?.value || '');
    if (activeBlock?.colorSwatches) {
      setColorSwatchesList(activeBlock.colorSwatches);
    }
    if (activeBlock?.id === 'config-color-swatches' || activeBlock?.type === 'Bảng Màu Sắc') {
      setActiveTab('colors');
    }
  }, [activeBlock?.id, activeBlock?.value, activeBlock?.colorSwatches]);

  const handleUpdateSwatchItem = (idx, field, val) => {
    const next = [...colorSwatchesList];
    next[idx] = { ...next[idx], [field]: val };
    setColorSwatchesList(next);
    activeBlock?.onUpdateSwatches?.(next);
  };

  const handleApplyPresetToSwatch = (idx, preset) => {
    const next = [...colorSwatchesList];
    next[idx] = {
      ...next[idx],
      name: next[idx].name || preset.name,
      color: preset.color,
      hex: preset.hex,
      image: next[idx].image || preset.sampleImage
    };
    setColorSwatchesList(next);
    activeBlock?.onUpdateSwatches?.(next);
  };

  const handleAddNewSwatchInCanva = () => {
    const nextIdx = colorSwatchesList.length;
    const preset = LUXURY_COLOR_PRESETS[nextIdx % LUXURY_COLOR_PRESETS.length];
    const newSwatch = {
      id: `color-${Date.now()}`,
      name: preset.name,
      color: preset.color,
      hex: preset.hex,
      image: preset.sampleImage
    };
    const next = [...colorSwatchesList, newSwatch];
    setColorSwatchesList(next);
    activeBlock?.onUpdateSwatches?.(next);
  };

  const handleDeleteSwatchInCanva = (idx) => {
    if (colorSwatchesList.length <= 1) {
      alert('Cần giữ ít nhất 1 nút màu.');
      return;
    }
    const next = colorSwatchesList.filter((_, i) => i !== idx);
    setColorSwatchesList(next);
    activeBlock?.onUpdateSwatches?.(next);
  };

  const handleUploadSwatchImage = async (idx, file) => {
    if (!file) return;
    setUploadingSwatchIdx(idx);
    try {
      const res = await adminApi.uploadImage(file);
      if (res.data?.url) {
        handleUpdateSwatchItem(idx, 'image', res.data.url);
        return;
      }
    } catch (e) {
      console.warn('Backend upload failed, reading data URL:', e);
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      handleUpdateSwatchItem(idx, 'image', evt.target.result);
    };
    reader.readAsDataURL(file);
    setUploadingSwatchIdx(null);
  };

  if (!activeBlock) return null;

  const currentFontFamily = blockStyle.fontFamily || '';
  const currentFontSize = parseInt(blockStyle.fontSize) || 16;
  const currentColor = blockStyle.color || '#ffffff';
  const isBold = blockStyle.fontWeight === 'bold' || blockStyle.fontWeight >= 700;
  const isItalic = blockStyle.fontStyle === 'italic';
  const textAlign = blockStyle.textAlign || 'left';
  const isUppercase = blockStyle.textTransform === 'uppercase';
  const currentZIndex = parseInt(blockStyle.zIndex) || 1;

  // Resolve which section this block belongs to
  const resolveSectionKey = () => {
    if (activeBlock.sectionKey) return activeBlock.sectionKey;
    if (activeBlock.id?.startsWith('section-')) return activeBlock.id.replace('section-', '');
    if (activeBlock.id?.startsWith('hero-')) return 'hero';
    if (activeBlock.id?.startsWith('config-') || activeBlock.id?.startsWith('picker-')) return 'configurator';
    if (activeBlock.id?.startsWith('bento-')) return 'bento';
    if (activeBlock.id?.startsWith('specs-')) return 'specs';
    return null;
  };

  const currentSectionKey = resolveSectionKey();
  const currentSectionIndex = currentSectionKey ? sectionOrder.indexOf(currentSectionKey) : -1;

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await adminApi.uploadImage(file);
      if (res.data?.url) {
        handleApplyBgImage(res.data.url);
      }
    } catch (err) {
      console.warn('Upload image failed, falling back to FileReader data URL:', err);
      const reader = new FileReader();
      reader.onload = (evt) => {
        handleApplyBgImage(evt.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const content = (
    <div className="w-full space-y-3.5 select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#0071e3] to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-white truncate text-xs">
                {activeBlock.label || activeBlock.id}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#0071e3]/20 text-[#2997ff] text-[9px] font-mono border border-[#0071e3]/30">
                {activeBlock.type || 'Khối'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onDuplicateBlock && (
            <button
              type="button"
              onClick={() => onDuplicateBlock(activeBlock.id)}
              className="px-2 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer text-[10px] border border-blue-500/30"
              title="Nhân bản khối này"
            >
              <Copy className="w-2.5 h-2.5" />
              <span>Nhân bản</span>
            </button>
          )}

          {onDeleteBlock && (
            <button
              type="button"
              onClick={() => onDeleteBlock(activeBlock.id)}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer text-[10px] font-semibold border border-rose-500/40 shadow-sm"
              title="Xóa / Ẩn phần tử này khỏi trang web (Phím Delete)"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Xóa / Ẩn</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetStyle}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#a1a1a6] hover:text-white flex items-center gap-1 transition-all cursor-pointer text-[10px]"
            title="Khôi phục style nguyên bản của khối"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Đặt lại gốc</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-white transition-all cursor-pointer"
            title="Bỏ chọn khối này"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Direct Text Editor Box if block has editable text */}
      {(activeBlock.type === 'text' || activeBlock.onUpdateText || activeBlock.value !== undefined) && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Type className="w-3 h-3" />
              Sửa nội dung văn bản khối này
            </span>
          </div>
          <textarea
            rows={2}
            value={textValue}
            onChange={(e) => {
              const val = e.target.value;
              setTextValue(val);
              activeBlock.onUpdateText?.(val);
            }}
            placeholder="Nhập nội dung mới..."
            className="w-full bg-[#161618] text-white border border-white/20 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#0071e3] resize-none"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-[11px] ${
            activeTab === 'typography'
              ? 'bg-[#0071e3] text-white shadow'
              : 'text-[#86868b] hover:text-white hover:bg-white/5'
          }`}
        >
          <Type className="w-3 h-3" />
          <span>Chữ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('background')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-[11px] ${
            activeTab === 'background'
              ? 'bg-[#0071e3] text-white shadow'
              : 'text-[#86868b] hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          <span>Nền</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('effects')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-[11px] ${
            activeTab === 'effects'
              ? 'bg-[#0071e3] text-white shadow'
              : 'text-[#86868b] hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>Bo góc</span>
        </button>

        {/* Color Swatches Tab Button */}
        {isColorSwatchesBlock && (
          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-[11px] ${
              activeTab === 'colors'
                ? 'bg-[#0071e3] text-white shadow'
                : 'text-amber-400 hover:text-white hover:bg-amber-500/15'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>Màu & Ảnh</span>
          </button>
        )}
      </div>

      {/* Tab: Color Swatches & Slideshow Gallery */}
      {activeTab === 'colors' && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span>Nút màu & Ảnh Slideshow</span>
            </span>
            <button
              type="button"
              onClick={handleAddNewSwatchInCanva}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm màu</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {colorSwatchesList.map((swatch, idx) => (
              <div key={swatch.id || idx} className="p-3 rounded-xl bg-[#161618] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div 
                      className="w-7 h-7 rounded-full border border-white/20 shadow flex-shrink-0"
                      style={{ background: swatch.color || swatch.hex || '#333' }}
                    />
                    <input
                      type="text"
                      value={swatch.name || ''}
                      onChange={(e) => handleUpdateSwatchItem(idx, 'name', e.target.value)}
                      placeholder="Tên màu..."
                      className="w-full bg-[#111113] border border-white/15 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSwatchInCanva(idx)}
                    className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="Xóa nút màu này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color pickers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {LUXURY_COLOR_PRESETS.slice(0, 6).map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPresetToSwatch(idx, preset)}
                        className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer shadow flex-shrink-0"
                        style={{ background: preset.color }}
                        title={preset.name}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="color"
                      value={swatch.hex || '#484b50'}
                      onChange={(e) => {
                        const hex = e.target.value;
                        handleUpdateSwatchItem(idx, 'hex', hex);
                        handleUpdateSwatchItem(idx, 'color', hex);
                      }}
                      className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 outline-none"
                      title="Chọn mã màu tùy biến"
                    />
                  </div>
                </div>

                {/* Connected Image */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                    {swatch.image ? (
                      <img src={swatch.image} alt="color" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">Ảnh</div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={swatch.image || ''}
                    onChange={(e) => handleUpdateSwatchItem(idx, 'image', e.target.value)}
                    placeholder="Dán link ảnh slideshow..."
                    className="flex-1 bg-[#111113] border border-white/10 rounded-lg px-2 py-0.5 text-[11px] text-white outline-none focus:border-[#0071e3]"
                  />

                  <input
                    type="file"
                    ref={(el) => (swatchFileRefs.current[idx] = el)}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadSwatchImage(idx, file);
                    }}
                  />

                  <button
                    type="button"
                    disabled={uploadingSwatchIdx === idx}
                    onClick={() => swatchFileRefs.current[idx]?.click()}
                    className="p-1 rounded-lg bg-white/10 hover:bg-blue-600 text-white cursor-pointer"
                    title="Tải ảnh từ máy tính"
                  >
                    {uploadingSwatchIdx === idx ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Typography & Text Colors */}
      {activeTab === 'typography' && (
        <div className="space-y-3 pt-1">
          {/* Font Family */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">Kiểu Font chữ</span>
            <select
              value={currentFontFamily}
              onChange={(e) => onUpdateStyle?.({ fontFamily: e.target.value })}
              className="w-full bg-[#1c1c1e] text-white border border-white/15 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-[#0071e3] cursor-pointer"
            >
              <option value="">-- Mặc định (Apple SF Pro) --</option>
              {FONT_FAMILIES.map((f) => (
                <option key={f.name} value={f.value}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Formats */}
          <div className="grid grid-cols-2 gap-2">
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

            {/* Alignments */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">Căn lề</span>
              <div className="flex items-center justify-around bg-[#1c1c1e] rounded-xl p-1 border border-white/15">
                <button
                  type="button"
                  onClick={() => onUpdateStyle?.({ textAlign: 'left' })}
                  className={`p-1 rounded-lg cursor-pointer ${textAlign === 'left' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
                  title="Căn trái"
                >
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStyle?.({ textAlign: 'center' })}
                  className={`p-1 rounded-lg cursor-pointer ${textAlign === 'center' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
                  title="Căn giữa"
                >
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStyle?.({ textAlign: 'right' })}
                  className={`p-1 rounded-lg cursor-pointer ${textAlign === 'right' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'}`}
                  title="Căn phải"
                >
                  <AlignRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Text Style Toggles (Bold, Italic, Uppercase) */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/5">
            <button
              type="button"
              onClick={() => onUpdateStyle?.({ fontWeight: isBold ? 'normal' : 'bold' })}
              className={`flex-1 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] ${
                isBold
                  ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                  : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
              }`}
              title="In đậm (Bold)"
            >
              <Bold className="w-3 h-3" />
              <span>Đậm</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateStyle?.({ fontStyle: isItalic ? 'normal' : 'italic' })}
              className={`flex-1 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] ${
                isItalic
                  ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                  : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
              }`}
              title="In nghiêng (Italic)"
            >
              <Italic className="w-3 h-3" />
              <span>Nghiêng</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateStyle?.({ textTransform: isUppercase ? 'none' : 'uppercase' })}
              className={`flex-1 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 font-mono text-[11px] ${
                isUppercase
                  ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                  : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
              }`}
              title="In hoa toàn bộ chữ"
            >
              <span>AA</span>
              <span className="text-[10px]">Hoa</span>
            </button>
          </div>

          {/* Text Colors Swatches */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">Màu sắc văn bản</span>
            <div className="flex flex-wrap items-center gap-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onUpdateStyle?.({ color: c.value })}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                    currentColor.toLowerCase() === c.value.toLowerCase()
                      ? 'border-white scale-110 shadow-lg ring-2 ring-[#0071e3]'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  {currentColor.toLowerCase() === c.value.toLowerCase() && (
                    <Check className={`w-2.5 h-2.5 ${c.value === '#ffffff' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}

              {/* Native Color Picker for custom Hex */}
              <label className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer text-[10px]">
                <Palette className="w-3 h-3 text-[#2997ff]" />
                <input
                  type="color"
                  value={currentColor.startsWith('#') ? currentColor : '#ffffff'}
                  onChange={(e) => onUpdateStyle?.({ color: e.target.value })}
                  className="w-4 h-4 rounded cursor-pointer border-none bg-transparent"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Backgrounds & Images */}
      {activeTab === 'background' && (
        <div className="space-y-3 pt-1">
          {/* Glassmorphism & Gradients Presets */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
              1. Nền Kính Luxury & Gradients
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {BG_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSetBgPreset(p)}
                  className="px-2 py-1.5 rounded-xl text-left border border-white/10 hover:border-[#0071e3] transition-all cursor-pointer bg-white/5 hover:bg-white/10 flex flex-col gap-1"
                >
                  <span className="font-medium text-[10px] text-white truncate">{p.name}</span>
                  <div
                    className="w-full h-2.5 rounded border border-white/20 shadow-inner"
                    style={{ background: p.value }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Insert Background Image */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
                2. Chèn Ảnh Nền Vào Khối
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[10px] text-[#2997ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-2.5 h-2.5" />
                <span>{isUploading ? 'Đang tải...' : 'Tải ảnh lên'}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Quick Preset Textures */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_BG_IMAGES.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => handleApplyBgImage(img.url)}
                  className="relative group rounded-xl overflow-hidden h-11 border border-white/15 hover:border-[#0071e3] transition-all cursor-pointer"
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-medium text-center px-1">
                    {img.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL Input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={customImgInput}
                onChange={(e) => setCustomImgInput(e.target.value)}
                placeholder="Dán URL ảnh (https://...)"
                className="flex-1 bg-[#1c1c1e] text-white border border-white/15 rounded-xl px-2.5 py-1.5 outline-none focus:border-[#0071e3] text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (customImgInput.trim()) {
                    handleApplyBgImage(customImgInput.trim());
                    setCustomImgInput('');
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs cursor-pointer shadow"
              >
                Áp dụng
              </button>
              {blockStyle.backgroundImage && (
                <button
                  type="button"
                  onClick={() => handleApplyBgImage('')}
                  className="px-2 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs cursor-pointer"
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
        <div className="space-y-3 pt-1">
          {/* Border Radius */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#86868b] font-medium uppercase tracking-wider">
              Bo góc khung (Border Radius)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { name: 'Vuông (0px)', val: '0px' },
                { name: 'Bo nhẹ (8px)', val: '8px' },
                { name: 'Chuẩn (16px)', val: '16px' },
                { name: 'Bo lớn (24px)', val: '24px' },
                { name: 'Rất cong (32px)', val: '32px' },
                { name: 'Pill (Tròn)', val: '9999px' }
              ].map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => onUpdateStyle?.({ borderRadius: r.val })}
                  className={`py-1.5 px-1 rounded-xl border text-[10px] text-center transition-all cursor-pointer truncate ${
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
            <div className="grid grid-cols-2 gap-1.5">
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
                  className={`py-1.5 px-2 rounded-xl border text-[10px] text-center transition-all cursor-pointer truncate ${
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
            <div className="grid grid-cols-2 gap-1.5">
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
                  className={`py-1.5 px-2 rounded-xl border text-[10px] text-center transition-all cursor-pointer truncate ${
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

      {/* Tab 4: Order / Position Before - After */}
      {activeTab === 'order' && (
        <div className="space-y-4 pt-1">
          {/* Section Reordering Controls */}
          {currentSectionIndex !== -1 && (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#2997ff] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpDown className="w-3 h-3" />
                  <span>1. Vị trí Khối trên trang web</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/20 border border-[#0071e3]/40 text-[#2997ff] font-mono text-[10px] font-bold">
                  Vị trí #{currentSectionIndex + 1} / {sectionOrder.length}
                </span>
              </div>

              <div className="text-[11px] text-white font-medium bg-black/40 p-2 rounded-xl border border-white/5">
                {SECTION_NAMES[currentSectionKey] || currentSectionKey}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={currentSectionIndex === 0}
                  onClick={() => onMoveSection?.(currentSectionIndex, currentSectionIndex - 1)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentSectionIndex === 0
                      ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-[#86868b]'
                      : 'bg-[#0071e3] hover:bg-[#0077ed] border-blue-400 text-white shadow-lg shadow-blue-500/25'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Hiển thị lên trước</span>
                </button>

                <button
                  type="button"
                  disabled={currentSectionIndex === sectionOrder.length - 1}
                  onClick={() => onMoveSection?.(currentSectionIndex, currentSectionIndex + 1)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    currentSectionIndex === sectionOrder.length - 1
                      ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-[#86868b]'
                      : 'bg-[#0071e3] hover:bg-[#0077ed] border-blue-400 text-white shadow-lg shadow-blue-500/25'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Hiển thị ra sau</span>
                </button>
              </div>
            </div>
          )}

          {/* Z-Index / Layer Stacking Order */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <span className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider block">
              2. Độ sâu lớp hiển thị (Z-Index / Stacking Layer)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { name: 'Lớp nền (0)', z: 0 },
                { name: 'Chuẩn (10)', z: 10 },
                { name: 'Nổi (20)', z: 20 },
                { name: 'Trên cao (30)', z: 30 },
                { name: 'Trên cùng (50)', z: 50 }
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onUpdateStyle?.({ zIndex: item.z, position: blockStyle.position || 'relative' })}
                  className={`py-1.5 px-1 rounded-xl border text-[10px] text-center transition-all cursor-pointer truncate ${
                    currentZIndex === item.z
                      ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                      : 'bg-white/5 border-white/10 text-[#86868b] hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div 
      data-canva-toolbar="true"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-3xl rounded-3xl bg-[#161617]/95 backdrop-blur-2xl border border-[#0071e3]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-[#0071e3]/30 p-3 sm:p-4 text-white text-xs select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {content}
    </div>
  );
}
