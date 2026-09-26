import React, { useState, useRef } from 'react';
import { 
  X, 
  Type, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Loader2,
  Award,
  ShieldCheck,
  Flame,
  Tag,
  Gem,
  Plus,
  Film,
  Trash2
} from 'lucide-react';
import { adminApi } from '../../../services/api';

const BADGE_PRESETS = [
  {
    id: 'badge-limited',
    title: 'Limited Edition',
    content: '★ LIMITED EDITION · 2026',
    icon: Gem,
    style: {
      color: '#fde047',
      backgroundColor: 'rgba(23, 23, 23, 0.92)',
      borderColor: 'rgba(234, 179, 8, 0.55)',
      fontSize: 12,
      fontWeight: '600',
      padding: '8px 18px',
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      letterSpacing: '0.12em',
      boxShadow: '0 0 20px rgba(234, 179, 8, 0.25)',
      backdropFilter: 'blur(12px)'
    }
  },
  {
    id: 'badge-titanium',
    title: 'Titanium Aerospace',
    content: 'TITANIUM GRADE 5 · AEROSPACE',
    icon: Sparkles,
    style: {
      color: '#f4f4f5',
      backgroundColor: 'rgba(39, 39, 42, 0.88)',
      borderColor: 'rgba(161, 161, 170, 0.4)',
      fontSize: 11,
      fontWeight: '600',
      padding: '7px 16px',
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      letterSpacing: '0.14em',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(12px)'
    }
  },
  {
    id: 'badge-warranty',
    title: 'Bảo Hành Toàn Cầu 2 Năm',
    content: '✓ BẢO HÀNH TOÀN CẦU 2 NĂM AURA CARE',
    icon: ShieldCheck,
    style: {
      color: '#34d399',
      backgroundColor: 'rgba(6, 78, 59, 0.75)',
      borderColor: 'rgba(16, 185, 129, 0.45)',
      fontSize: 11,
      fontWeight: '600',
      padding: '7px 16px',
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      letterSpacing: '0.08em',
      boxShadow: '0 0 18px rgba(16, 185, 129, 0.25)',
      backdropFilter: 'blur(12px)'
    }
  },
  {
    id: 'badge-bestseller',
    title: 'Best Seller 2026',
    content: '🔥 TOP 1 SẢN PHẨM BÁN CHẠY NHẤT',
    icon: Flame,
    style: {
      color: '#ffedd5',
      backgroundColor: 'rgba(154, 52, 18, 0.85)',
      borderColor: 'rgba(249, 115, 22, 0.6)',
      fontSize: 11,
      fontWeight: '700',
      padding: '8px 18px',
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      letterSpacing: '0.06em',
      boxShadow: '0 0 22px rgba(249, 115, 22, 0.35)',
      backdropFilter: 'blur(12px)'
    }
  },
  {
    id: 'badge-discount',
    title: 'Ưu Đãi Đặc Quyền -20%',
    content: '🎁 ĐẶC QUYỀN VIP - GIẢM 20% HÔM NAY',
    icon: Tag,
    style: {
      color: '#ffe4e6',
      backgroundColor: 'rgba(159, 18, 57, 0.82)',
      borderColor: 'rgba(244, 63, 94, 0.55)',
      fontSize: 11,
      fontWeight: '700',
      padding: '8px 18px',
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      letterSpacing: '0.08em',
      boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)',
      backdropFilter: 'blur(12px)'
    }
  },
  {
    id: 'badge-craft',
    title: 'Chế Tác Thủ Công',
    content: '✦ MASTER CRAFTSMANSHIP · GENEVA',
    icon: Award,
    style: {
      color: '#bae6fd',
      backgroundColor: 'rgba(12, 74, 110, 0.85)',
      borderColor: 'rgba(14, 165, 233, 0.5)',
      fontSize: 11,
      fontWeight: '600',
      padding: '7px 16px',
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      letterSpacing: '0.12em',
      boxShadow: '0 0 20px rgba(14, 165, 233, 0.25)',
      backdropFilter: 'blur(12px)'
    }
  }
];

const SAMPLE_IMAGES = [
  {
    title: 'M4 Max Chip Seal',
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80',
  },
  {
    title: 'Studio Hi-Fi Sound',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
  },
  {
    title: 'Luxury Watch Detail',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  },
  {
    title: 'Spatial Audio Wave',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
  }
];

const SLIDER_PRESETS = [
  {
    id: 'slider-chrono',
    title: 'Chrono Titanium Collection',
    desc: '3 góc chuyển động cơ khí tinh xảo',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop'
    ],
    style: {
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      autoplay: true,
      interval: 3500
    }
  },
  {
    id: 'slider-tech',
    title: 'Đẳng Cấp Hi-Tech Luxury',
    desc: 'Phong cách Apple Store tối giản, hiện đại',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop'
    ],
    style: {
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(41, 151, 255, 0.25)',
      autoplay: true,
      interval: 4000
    }
  },
  {
    id: 'slider-lifestyle',
    title: 'Boutique & Lifestyle Lookbook',
    desc: 'Trải nghiệm thời thượng quý phái',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop'
    ],
    style: {
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      autoplay: true,
      interval: 3200
    }
  }
];

export default function CanvaDrawer({
  isOpen = false,
  onClose,
  onAddText,
  onAddBadge,
  onAddImage,
  onAddSlider
}) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'badge' | 'image' | 'slider'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customSlideImages, setCustomSlideImages] = useState([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop'
  ]);
  const [slideUrlInput, setSlideUrlInput] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const res = await adminApi.uploadImage(file);
      if (res.data?.url) {
        onAddImage?.(res.data.url);
        onClose?.();
      }
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
      setUploadError('Tải ảnh thất bại. Bạn vui lòng thử lại.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddCustomUrl = (e) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    onAddImage?.(customImageUrl.trim());
    setCustomImageUrl('');
    onClose?.();
  };

  return (
    <div data-canva-drawer="true" className="fixed inset-y-0 left-0 z-50 flex shadow-2xl animate-in slide-in-from-left duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10" 
        onClick={onClose} 
      />

      {/* Main Drawer Panel */}
      <aside className="w-80 sm:w-96 bg-neutral-900/95 backdrop-blur-2xl border-r border-white/10 flex flex-col text-white h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm tracking-wide text-neutral-100">Canva Studio Assets</h2>
              <p className="text-[11px] text-neutral-400">Kho tài nguyên kéo thả trực quan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 border-b border-white/10 bg-black/30 p-1">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center justify-center space-x-1 py-2 rounded-lg text-[11px] font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>Chữ</span>
          </button>

          <button
            onClick={() => setActiveTab('badge')}
            className={`flex items-center justify-center space-x-1 py-2 rounded-lg text-[11px] font-medium transition-all ${
              activeTab === 'badge'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Huy hiệu</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center space-x-1 py-2 rounded-lg text-[11px] font-medium transition-all ${
              activeTab === 'image'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Ảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('slider')}
            className={`flex items-center justify-center space-x-1 py-2 rounded-lg text-[11px] font-medium transition-all ${
              activeTab === 'slider'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <Film className="w-3 h-3" />
            <span>Slide ảnh</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: TEXT */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">Chọn mẫu chữ để thêm vào trang. Bạn có thể nhấn đúp vào chữ trên màn hình để gõ nội dung mới.</p>

              {/* H1 Heading */}
              <button
                onClick={() => {
                  onAddText?.('h1');
                  onClose?.();
                }}
                className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all group flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    Tiêu Đề Lớn (H1)
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">36px · Tựa đề sản phẩm nổi bật</p>
                </div>
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
              </button>

              {/* H2 Heading */}
              <button
                onClick={() => {
                  onAddText?.('h2');
                  onClose?.();
                }}
                className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all group flex items-center justify-between"
              >
                <div>
                  <h4 className="text-base font-semibold text-neutral-200 group-hover:text-blue-400 transition-colors">
                    Tiêu Đề Phụ (H2)
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">22px · Phân mục tính năng hoặc slogan</p>
                </div>
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
              </button>

              {/* Body Text */}
              <button
                onClick={() => {
                  onAddText?.('body');
                  onClose?.();
                }}
                className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-neutral-300 group-hover:text-blue-400 transition-colors">
                    Đoạn văn bản mô tả (Body)
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">15px · Thuyết minh chi tiết, giới thiệu</p>
                </div>
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
              </button>

              {/* Quote / Pill style */}
              <button
                onClick={() => {
                  onAddText?.('quote');
                  onClose?.();
                }}
                className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="text-sm italic font-serif text-amber-200/90 group-hover:text-amber-300 transition-colors">
                    “Thiết kế vượt thời gian, chuẩn mực tương lai”
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Quote nghệ thuật</p>
                </div>
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
              </button>
            </div>
          )}

          {/* TAB 2: LUXURY BADGES */}
          {activeTab === 'badge' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">Các mẫu huy hiệu phong cách Apple & luxury boutique, bo góc mượt mà và phát sáng tinh tế:</p>

              <div className="space-y-2.5">
                {BADGE_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        onAddBadge?.(preset);
                        onClose?.();
                      }}
                      className="cursor-pointer p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/80 border border-white/10 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-200">
                          {preset.title}
                        </span>
                        <Plus className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400" />
                      </div>

                      {/* Preview pill */}
                      <div className="flex justify-start">
                        <span 
                          style={{
                            color: preset.style.color,
                            backgroundColor: preset.style.backgroundColor,
                            borderColor: preset.style.borderColor,
                            fontSize: `${preset.style.fontSize}px`,
                            fontWeight: preset.style.fontWeight,
                            padding: preset.style.padding,
                            borderRadius: preset.style.borderRadius,
                            borderWidth: preset.style.borderWidth,
                            borderStyle: preset.style.borderStyle,
                            letterSpacing: preset.style.letterSpacing,
                            boxShadow: preset.style.boxShadow,
                            display: 'inline-block'
                          }}
                        >
                          {preset.content}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: IMAGES */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">Tải ảnh sản phẩm, tem chứng nhận hoặc logo từ máy tính của bạn:</p>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/5 hover:bg-blue-500/5 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <span className="text-xs text-neutral-300">Đang tải ảnh lên server...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-200">Bấm để tải ảnh từ máy tính</span>
                    <span className="text-[10px] text-neutral-400">PNG, JPG, WebP, SVG (Tối đa 10MB)</span>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {uploadError}
                </p>
              )}

              {/* Or paste URL */}
              <form onSubmit={handleAddCustomUrl} className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-medium text-neutral-300 block">Hoặc dán URL hình ảnh online:</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!customImageUrl.trim()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </form>

              {/* Sample assets */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <span className="text-xs font-medium text-neutral-300">Ảnh mẫu sẵn có:</span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_IMAGES.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onAddImage?.(img.url);
                        onClose?.();
                      }}
                      className="group cursor-pointer rounded-lg overflow-hidden border border-white/10 hover:border-blue-500/60 relative aspect-video bg-neutral-950 transition-all hover:scale-105"
                    >
                      <img 
                        src={img.url} 
                        alt={img.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] text-white font-medium">{img.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMAGE SLIDER */}
          {activeTab === 'slider' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-300 font-medium">Bộ sưu tập Slide động</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Thêm khung trình chiếu ảnh tương tác, tự động chuyển slide và có phím chuyển ảnh mượt mà:
                </p>
              </div>

              {/* Slider Presets */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                  Mẫu Slide Thiết Kế Sẵn:
                </span>
                {SLIDER_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-3 rounded-xl bg-neutral-950/60 border border-white/10 hover:border-blue-500/50 transition-all flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {preset.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400">{preset.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#2997ff] bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        {preset.images.length} ảnh
                      </span>
                    </div>

                    {/* Thumbnail strip */}
                    <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden p-1 bg-black/40 border border-white/5">
                      {preset.images.map((imgUrl, i) => (
                        <div key={i} className="aspect-[4/3] rounded overflow-hidden bg-neutral-900">
                          <img src={imgUrl} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddSlider?.(preset.images, preset.style);
                        onClose?.();
                      }}
                      className="w-full py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Thêm Slide này</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Custom Slider Builder */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                    Tạo Slide Tùy Chỉnh:
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {customSlideImages.length} ảnh đã chọn
                  </span>
                </div>

                {/* Selected custom images */}
                <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {customSlideImages.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 bg-neutral-950/60 p-1.5 rounded-lg border border-white/10">
                      <img src={url} alt={`Custom ${i + 1}`} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                      <span className="text-[10px] text-neutral-300 truncate flex-1 font-mono">{url}</span>
                      <button
                        type="button"
                        onClick={() => setCustomSlideImages(customSlideImages.filter((_, idx) => idx !== i))}
                        className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add image URL to custom list */}
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="Dán link ảnh (https://...)"
                    value={slideUrlInput}
                    onChange={(e) => setSlideUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && slideUrlInput.trim()) {
                        e.preventDefault();
                        setCustomSlideImages([...customSlideImages, slideUrlInput.trim()]);
                        setSlideUrlInput('');
                      }
                    }}
                    className="flex-1 bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (slideUrlInput.trim()) {
                        setCustomSlideImages([...customSlideImages, slideUrlInput.trim()]);
                        setSlideUrlInput('');
                      }
                    }}
                    disabled={!slideUrlInput.trim()}
                    className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Thêm
                  </button>
                </div>

                {/* Create Button */}
                <button
                  type="button"
                  disabled={customSlideImages.length === 0}
                  onClick={() => {
                    if (customSlideImages.length > 0) {
                      onAddSlider?.(customSlideImages, {
                        borderRadius: '20px',
                        autoplay: true,
                        interval: 3500
                      });
                      onClose?.();
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>+ Tạo Slide Trình Chiếu Mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
