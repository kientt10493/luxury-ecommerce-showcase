import React, { useState, useRef } from 'react';
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
  Sparkles,
  Layers,
  Play,
  Pause,
  Upload,
  Loader2,
  Film,
  Link as LinkIcon,
  Palette,
  Tag
} from 'lucide-react';
import { adminApi } from '../../../services/api';

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

const BUTTON_THEMES = [
  { name: 'Apple Blue', bg: 'linear-gradient(135deg, #0071e3 0%, #0077ed 100%)', color: '#ffffff' },
  { name: 'Gold Luxury', bg: 'linear-gradient(135deg, #fde047 0%, #ca8a04 100%)', color: '#000000' },
  { name: 'Frosted Glass', bg: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' },
  { name: 'Emerald Glow', bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#ffffff' },
  { name: 'Ruby Red', bg: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)', color: '#ffffff' }
];

export default function CanvaToolbar({
  element,
  onUpdateStyle,
  onUpdateContent,
  onStartEditing,
  onBringForward,
  onSendBackward,
  onDuplicate,
  onDelete,
  onUpdateAnchor,
  allAnchors = []
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showSlideManager, setShowSlideManager] = useState(false);
  const [showAnchorEditor, setShowAnchorEditor] = useState(false);
  const [anchorInput, setAnchorInput] = useState('');
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [isUploadingMultiple, setIsUploadingMultiple] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileMultiUploadRef = useRef(null);

  if (!element) return null;

  const style = element.style || {};
  const isTextType = element.type === 'text' || element.type === 'badge';
  const fontSize = style.fontSize ?? (element.type === 'badge' ? 12 : element.type === 'icon' || element.type === 'symbol' ? 32 : 24);
  const currentColor = style.color || '#ffffff';
  const isBold = style.fontWeight === 'bold' || style.fontWeight === 700;
  const textAlign = style.textAlign || 'center';
  const opacity = Math.round((style.opacity ?? 1) * 100);

  const handleFontSizeChange = (delta) => {
    const newSize = Math.max(10, Math.min(120, fontSize + delta));
    onUpdateStyle?.({ fontSize: newSize });
  };

  const handleOpacityChange = (val) => {
    onUpdateStyle?.({ opacity: Math.max(0.1, Math.min(1, val / 100)) });
  };

  const handleAnchorSave = () => {
    const slug = anchorInput.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    onUpdateAnchor?.(slug || null);
    setShowAnchorEditor(false);
  };

  const handleAnchorClear = () => {
    onUpdateAnchor?.(null);
    setShowAnchorEditor(false);
  };

  const handleMultiUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingMultiple(true);
    setUploadProgress(`0/${files.length}`);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`${i + 1}/${files.length}`);
        const res = await adminApi.uploadImage(files[i]);
        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        const currentList = Array.isArray(element.content) ? element.content : [element.content].filter(Boolean);
        onUpdateContent?.([...currentList, ...uploadedUrls]);
      }
    } catch (err) {
      console.error('Lỗi tải nhiều ảnh:', err);
      alert('Tải ảnh thất bại. Bạn vui lòng thử lại!');
    } finally {
      setIsUploadingMultiple(false);
      setUploadProgress('');
      if (fileMultiUploadRef.current) fileMultiUploadRef.current.value = '';
    }
  };

  return (
    <div
      data-canva-toolbar="true"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#161617]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-xs text-white select-none whitespace-nowrap pointer-events-auto apple-animate-in"
    >
      {/* 0. Direct Edit Content Button for Text, Badge, Button, Symbol */}
      {(isTextType || element.type === 'button' || element.type === 'symbol') && (
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
              className="p-1 hover:text-blue-400 cursor-pointer"
              title="Giảm kích thước chữ"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center font-mono text-[11px] font-semibold">
              {fontSize}
            </span>
            <button
              type="button"
              onClick={() => handleFontSizeChange(2)}
              className="p-1 hover:text-blue-400 cursor-pointer"
              title="Tăng kích thước chữ"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Color Picker Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowBgPicker(false);
                setShowSlideManager(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
              title="Đổi màu chữ"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
              <span className="text-[11px] hidden md:inline">Màu</span>
            </button>

            {showColorPicker && (
              <div className="absolute top-10 left-0 bg-[#1c1c1e] p-2.5 rounded-2xl border border-white/15 shadow-2xl z-50 grid grid-cols-4 gap-2 w-48">
                {LUXURY_PALETTE.map((pal) => (
                  <button
                    key={pal.name}
                    type="button"
                    onClick={() => {
                      onUpdateStyle?.({ color: pal.color });
                      setShowColorPicker(false);
                    }}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer shadow"
                    style={{
                      backgroundColor: pal.color,
                      borderColor: currentColor === pal.color ? '#0071e3' : 'rgba(255,255,255,0.2)'
                    }}
                    title={pal.name}
                  />
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
            title="Đậm / Thường"
          >
            <Bold className="w-3 h-3" />
          </button>

          {/* Alignment */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => onUpdateStyle?.({ textAlign: 'left' })}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                textAlign === 'left' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'
              }`}
              title="Căn trái"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateStyle?.({ textAlign: 'center' })}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                textAlign === 'center' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'
              }`}
              title="Căn giữa"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateStyle?.({ textAlign: 'right' })}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                textAlign === 'right' ? 'bg-[#0071e3] text-white' : 'text-[#86868b] hover:text-white'
              }`}
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
                setShowSlideManager(false);
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

      {/* 2a. Image Specific Controls */}
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

      {/* 2b. Slider / Carousel Specific Controls */}
      {element.type === 'slider' && (
        <div className="flex items-center gap-1.5 px-1">
          {/* Hidden Multi-upload file input */}
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileMultiUploadRef}
            className="hidden"
            onChange={handleMultiUpload}
          />

          {/* Manage Slide Images Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSlideManager(!showSlideManager);
                setShowColorPicker(false);
                setShowBgPicker(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold transition-all shadow cursor-pointer"
              title="Quản lý ảnh trong slide"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[11px]">
                Ảnh Slide ({Array.isArray(element.content) ? element.content.length : 1})
              </span>
            </button>

            {showSlideManager && (
              <div 
                className="absolute top-10 left-0 bg-[#1c1c1e] p-3 rounded-2xl border border-white/20 shadow-2xl z-50 flex flex-col gap-2 w-80"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="font-semibold text-[11px] text-white">Danh sách ảnh Slide</span>
                  <span className="text-[10px] text-[#2997ff] font-mono">
                    {Array.isArray(element.content) ? element.content.length : 1} ảnh
                  </span>
                </div>

                {/* Multi-file upload from computer */}
                <button
                  type="button"
                  onClick={() => fileMultiUploadRef.current?.click()}
                  disabled={isUploadingMultiple}
                  className="w-full py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  title="Tải lên nhiều hình ảnh từ thư mục máy tính"
                >
                  {isUploadingMultiple ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải {uploadProgress}...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>📸 Tải nhiều ảnh từ máy tính</span>
                    </>
                  )}
                </button>

                {/* Thumbnails list */}
                <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                  {(Array.isArray(element.content) ? element.content : [element.content]).map((url, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 group">
                      <img src={url} alt={`Slide ${i + 1}`} className="w-9 h-9 object-cover rounded-lg flex-shrink-0" />
                      <span className="text-[10px] text-neutral-300 truncate flex-1 font-mono">
                        {url}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = Array.isArray(element.content) ? element.content : [element.content];
                          if (currentList.length <= 1) {
                            alert('Slide cần có ít nhất 1 hình ảnh!');
                            return;
                          }
                          const updated = currentList.filter((_, idx) => idx !== i);
                          onUpdateContent?.(updated);
                        }}
                        className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Xóa ảnh này khỏi slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new image by URL */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                  <input
                    type="text"
                    placeholder="URL ảnh mới (https://...)"
                    value={newSlideUrl}
                    onChange={(e) => setNewSlideUrl(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-[#0071e3]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSlideUrl.trim()) {
                        const currentList = Array.isArray(element.content) ? element.content : [element.content];
                        onUpdateContent?.([...currentList, newSlideUrl.trim()]);
                        setNewSlideUrl('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSlideUrl.trim()) {
                        const currentList = Array.isArray(element.content) ? element.content : [element.content];
                        onUpdateContent?.([...currentList, newSlideUrl.trim()]);
                        setNewSlideUrl('');
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white text-[10px] font-semibold cursor-pointer shadow"
                  >
                    + Thêm
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Layout: Thumbnail Strip vs Standard Dots */}
          <button
            type="button"
            onClick={() => onUpdateStyle?.({ showThumbnails: !style.showThumbnails })}
            className={`px-2.5 py-1 rounded-xl text-[11px] border transition-colors cursor-pointer flex items-center gap-1.5 ${
              style.showThumbnails
                ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                : 'bg-white/10 border-white/10 text-neutral-300 hover:text-white'
            }`}
            title="Bật/Tắt hiển thị hàng ảnh thu nhỏ bên dưới"
          >
            <Film className="w-3 h-3 text-[#2997ff]" />
            <span>{style.showThumbnails ? 'Hàng Thumbnails' : 'Chấm tròn'}</span>
          </button>

          {/* Autoplay Toggle */}
          <button
            type="button"
            onClick={() => onUpdateStyle?.({ autoplay: style.autoplay === false ? true : false })}
            className={`px-2.5 py-1 rounded-xl text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${
              style.autoplay !== false
                ? 'bg-[#0071e3] border-[#0071e3] text-white shadow'
                : 'bg-white/10 border-white/10 text-[#86868b] hover:text-white'
            }`}
            title="Bật/Tắt tự động trượt slide"
          >
            {style.autoplay !== false ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
            <span>Auto</span>
          </button>

          {/* Corner Radius Toggle */}
          <button
            type="button"
            onClick={() => {
              const cur = parseInt(style.borderRadius) || 20;
              const next = cur === 0 ? '16px' : cur === 16 ? '24px' : cur === 24 ? '32px' : '0px';
              onUpdateStyle?.({ borderRadius: next });
            }}
            className="px-2 py-1 rounded-xl text-[11px] bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors cursor-pointer"
            title="Đổi kiểu bo góc"
          >
            Bo góc: {style.borderRadius || '20px'}
          </button>
        </div>
      )}

      {/* 2c. Button (CTA) Specific Controls */}
      {element.type === 'button' && (
        <div className="flex items-center gap-1.5 px-1">
          {/* Link Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLinkEditor(!showLinkEditor);
                setLinkInput(style.link || '');
                setShowAnchorEditor(false);
                setShowColorPicker(false);
                setShowBgPicker(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#2997ff] border border-white/15 transition-colors cursor-pointer"
              title="Cài đặt link hành động khi bấm nút"
            >
              <LinkIcon className="w-3 h-3" />
              <span className="text-[11px]">Link: {style.link || '#'}</span>
            </button>

            {showLinkEditor && (
              <div
                className="absolute top-10 left-0 bg-[#1c1c1e] p-3 rounded-2xl border border-white/20 shadow-2xl z-50 flex flex-col gap-2 w-72"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
                  <LinkIcon className="w-3.5 h-3.5 text-[#2997ff]" />
                  <span className="text-[11px] font-semibold text-white">Liên kết khi bấm nút</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="#ten-the-neo hoặc https://..."
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onUpdateStyle?.({ link: linkInput.trim() });
                        setShowLinkEditor(false);
                      }
                    }}
                    className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-[#0071e3] font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { onUpdateStyle?.({ link: linkInput.trim() }); setShowLinkEditor(false); }}
                    className="px-2.5 py-1 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white text-[10px] font-semibold cursor-pointer shadow"
                  >
                    Lưu
                  </button>
                </div>

                {allAnchors.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#86868b] font-medium">Thẻ neo có sẵn trên trang:</span>
                    <div className="flex flex-col gap-0.5 max-h-32 overflow-y-auto">
                      {allAnchors.map((a) => (
                        <button
                          key={a.anchor}
                          type="button"
                          onClick={() => {
                            setLinkInput(`#${a.anchor}`);
                            onUpdateStyle?.({ link: `#${a.anchor}` });
                            setShowLinkEditor(false);
                          }}
                          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 text-left text-[10px] transition-colors cursor-pointer"
                        >
                          <span className="text-emerald-400 font-mono">#{a.anchor}</span>
                          <span className="text-[#86868b] truncate">{a.label}</span>
                          {style.link === `#${a.anchor}` && (
                            <span className="ml-auto text-[#2997ff] text-[10px]">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {style.link && (
                  <button
                    type="button"
                    onClick={() => { onUpdateStyle?.({ link: '' }); setShowLinkEditor(false); }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 text-left transition-colors cursor-pointer"
                  >
                    Xóa liên kết
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Button Theme presets */}
          <div className="flex items-center gap-1">
            {BUTTON_THEMES.map((theme) => (
              <button
                key={theme.name}
                type="button"
                onClick={() => onUpdateStyle?.({ background: theme.bg, color: theme.color })}
                className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer shadow"
                style={{ background: theme.bg }}
                title={theme.name}
              />
            ))}
          </div>

          {/* Border radius toggle */}
          <button
            type="button"
            onClick={() => {
              const cur = style.borderRadius || '9999px';
              const next = cur === '9999px' ? '12px' : cur === '12px' ? '4px' : '9999px';
              onUpdateStyle?.({ borderRadius: next });
            }}
            className="px-2 py-1 rounded-xl text-[11px] bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors cursor-pointer"
            title="Đổi hình dáng nút"
          >
            Bo góc: {style.borderRadius === '9999px' ? 'Viên thuốc' : style.borderRadius || 'Viên thuốc'}
          </button>
        </div>
      )}

      {/* 2d. Container / Box Specific Controls */}
      {(element.type === 'container' || element.type === 'box') && (
        <div className="flex items-center gap-1.5 px-1">
          {/* Background Presets */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBgPicker(!showBgPicker)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 transition-colors cursor-pointer"
              title="Đổi phong cách khối nền"
            >
              <Sparkles className="w-3 h-3" />
              <span className="text-[11px]">Nền & Kính</span>
            </button>

            {showBgPicker && (
              <div className="absolute top-10 left-0 bg-[#1c1c1e] p-2 rounded-2xl border border-white/15 shadow-2xl z-50 flex flex-col gap-1 w-48">
                {BG_PRESETS.map((bg) => (
                  <button
                    key={bg.name}
                    type="button"
                    onClick={() => {
                      onUpdateStyle?.({
                        backgroundColor: bg.value,
                        border: bg.value === 'transparent' ? '1px dashed rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.18)',
                        backdropFilter: bg.value === 'transparent' ? 'none' : 'blur(20px)'
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

          {/* Border radius */}
          <button
            type="button"
            onClick={() => {
              const cur = parseInt(style.borderRadius) || 24;
              const next = cur === 24 ? '32px' : cur === 32 ? '0px' : cur === 0 ? '16px' : '24px';
              onUpdateStyle?.({ borderRadius: next });
            }}
            className="px-2 py-1 rounded-xl text-[11px] bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors cursor-pointer"
            title="Đổi bo góc khối"
          >
            Bo góc: {style.borderRadius || '24px'}
          </button>
        </div>
      )}

      {/* 2e. Icon & Symbol Specific Controls */}
      {(element.type === 'icon' || element.type === 'symbol') && (
        <div className="flex items-center gap-1.5 px-1">
          {/* Size +/- */}
          <div className="flex items-center bg-white/10 rounded-xl px-1 py-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => handleFontSizeChange(-4)}
              className="p-1 hover:text-blue-400 cursor-pointer"
              title="Thu nhỏ icon"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center font-mono text-[11px] font-semibold">
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={() => handleFontSizeChange(4)}
              className="p-1 hover:text-blue-400 cursor-pointer"
              title="Phóng to icon"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Color picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
              title="Đổi màu biểu tượng"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
              <span className="text-[11px]">Màu</span>
            </button>

            {showColorPicker && (
              <div className="absolute top-10 left-0 bg-[#1c1c1e] p-2.5 rounded-2xl border border-white/15 shadow-2xl z-50 grid grid-cols-4 gap-2 w-48">
                {LUXURY_PALETTE.map((pal) => (
                  <button
                    key={pal.name}
                    type="button"
                    onClick={() => {
                      onUpdateStyle?.({ color: pal.color });
                      setShowColorPicker(false);
                    }}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer shadow"
                    style={{
                      backgroundColor: pal.color,
                      borderColor: currentColor === pal.color ? '#0071e3' : 'rgba(255,255,255,0.2)'
                    }}
                    title={pal.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anchor Tag Section — available for every element type */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setAnchorInput(element.anchor || '');
            setShowAnchorEditor(!showAnchorEditor);
            setShowLinkEditor(false);
            setShowColorPicker(false);
            setShowBgPicker(false);
            setShowSlideManager(false);
          }}
          className={`flex items-center gap-1 px-2 py-1 rounded-xl border transition-colors cursor-pointer ${
            element.anchor
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-white/10 border-white/10 text-[#86868b] hover:text-white'
          }`}
          title={element.anchor ? `Thẻ neo: #${element.anchor} — Nhấp để chỉnh sửa` : 'Đặt thẻ neo (Anchor)'}
        >
          <Tag className="w-3 h-3" />
          <span className="text-[11px]">{element.anchor ? `#${element.anchor}` : 'Thẻ neo'}</span>
        </button>

        {showAnchorEditor && (
          <div
            className="absolute top-10 right-0 bg-[#1c1c1e] p-3 rounded-2xl border border-white/15 shadow-2xl z-50 flex flex-col gap-2 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-white">Thẻ neo (Anchor)</span>
            </div>

            {element.anchor && (
              <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                <span className="text-[11px] text-emerald-400 font-mono">#{element.anchor}</span>
                <button
                  type="button"
                  onClick={handleAnchorClear}
                  className="ml-auto text-[10px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Xóa thẻ
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#86868b] font-mono">#</span>
              <input
                type="text"
                placeholder="ten-the-neo"
                value={anchorInput}
                onChange={(e) =>
                  setAnchorInput(
                    e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
                  )
                }
                onKeyDown={(e) => { if (e.key === 'Enter') handleAnchorSave(); }}
                className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-emerald-500 font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAnchorSave}
                disabled={!anchorInput.trim()}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-semibold cursor-pointer shadow transition-colors"
              >
                Lưu
              </button>
            </div>

            <p className="text-[10px] text-[#86868b] leading-relaxed">
              Nút bấm dùng thẻ này để cuộn đến vị trí khối. Chỉ dùng chữ thường,
              không dấu (VD:{' '}
              <span className="font-mono text-[#2997ff]">hero-section</span>).
            </p>
          </div>
        )}
      </div>

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
