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
  Trash2,
  MousePointerClick,
  Square,
  Star,
  Zap,
  ShoppingBag,
  Truck,
  Battery,
  Cpu,
  Clock,
  Crown,
  Globe,
  Wifi,
  Bell,
  Gift,
  Compass,
  Headphones,
  Watch,
  Layers,
  Heart
} from 'lucide-react';
import { adminApi } from '../../../services/api';
import CanvaIconRenderer, { ICON_MAP } from './CanvaIconRenderer';

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
  }
];

const BUTTON_PRESETS = [
  {
    id: 'btn-apple-blue',
    label: 'Mua Ngay • Apple Store',
    link: '#configuration',
    style: {
      background: 'linear-gradient(135deg, #0071e3 0%, #0077ed 100%)',
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
      padding: '12px 28px',
      borderRadius: '9999px',
      boxShadow: '0 10px 25px -5px rgba(0, 113, 227, 0.5)'
    }
  },
  {
    id: 'btn-gold-vip',
    label: 'Đặt Trước Bản Hoàng Gia VIP',
    link: '#configuration',
    style: {
      background: 'linear-gradient(135deg, #fde047 0%, #ca8a04 100%)',
      color: '#000000',
      fontSize: 14,
      fontWeight: '700',
      padding: '12px 28px',
      borderRadius: '9999px',
      boxShadow: '0 10px 25px -5px rgba(202, 138, 4, 0.45)'
    }
  },
  {
    id: 'btn-glass-pill',
    label: 'Xem Thông Số Kỹ Thuật →',
    link: '#specs',
    style: {
      background: 'rgba(255, 255, 255, 0.12)',
      color: '#f5f5f7',
      fontSize: 13,
      fontWeight: '500',
      padding: '10px 24px',
      borderRadius: '9999px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(16px)'
    }
  },
  {
    id: 'btn-emerald-cta',
    label: 'Nhận Ưu Đãi Trả Góp 0%',
    link: '#configuration',
    style: {
      background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
      padding: '12px 26px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
    }
  }
];

const CONTAINER_PRESETS = [
  {
    id: 'box-dark-glass',
    title: 'Khung Kính Tối Dark Glass',
    desc: 'Hiệu ứng kính mờ chiều sâu Apple cao cấp',
    content: '',
    style: {
      backgroundColor: 'rgba(22, 22, 23, 0.85)',
      backdropFilter: 'blur(24px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
    }
  },
  {
    id: 'box-gold-glow',
    title: 'Khung Vàng Hoàng Kim',
    desc: 'Viền sáng ánh vàng tinh tế quý tộc',
    content: '',
    style: {
      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(0, 0, 0, 0.88))',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(234, 179, 8, 0.4)',
      boxShadow: '0 0 35px rgba(234, 179, 8, 0.2)'
    }
  },
  {
    id: 'box-frosted',
    title: 'Khung Pha Lê Frosted Glass',
    desc: 'Kính mờ xuyên thấu rực rỡ',
    content: '',
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(30px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
    }
  }
];

const SPECIAL_SYMBOLS = [
  { name: '5 Sao Uy Tín', symbol: '★★★★★', color: '#fde047', size: 22 },
  { name: 'Logo Quả Táo', symbol: '', color: '#ffffff', size: 32 },
  { name: 'Tia Sét Sức Mạnh', symbol: '⚡', color: '#38bdf8', size: 28 },
  { name: 'Ngôi Sao Tỏa Sáng', symbol: '✦ ✦ ✦', color: '#fde047', size: 24 },
  { name: 'Vương Miện', symbol: '♛', color: '#fbbf24', size: 30 },
  { name: 'Kim Cương', symbol: '💎', color: '#60a5fa', size: 28 },
  { name: 'Biểu Tượng Aura', symbol: '❖', color: '#2dd4bf', size: 28 },
  { name: 'Tiền Tệ VNĐ', symbol: '₫', color: '#4ade80', size: 28 },
  { name: 'Tiền Tệ USD', symbol: '$', color: '#4ade80', size: 28 }
];

const CURATED_ICONS = [
  { name: 'Star', label: 'Ngôi sao', icon: Star },
  { name: 'ShieldCheck', label: 'Bảo hành', icon: ShieldCheck },
  { name: 'Sparkles', label: 'Lấp lánh', icon: Sparkles },
  { name: 'Flame', label: 'Hot', icon: Flame },
  { name: 'Zap', label: 'Tốc độ', icon: Zap },
  { name: 'Award', label: 'Giải thưởng', icon: Award },
  { name: 'Gem', label: 'Kim cương', icon: Gem },
  { name: 'Heart', label: 'Yêu thích', icon: Heart },
  { name: 'Check', label: 'Đạt chuẩn', icon: Check },
  { name: 'ShoppingBag', label: 'Mua sắm', icon: ShoppingBag },
  { name: 'Truck', label: 'Giao hàng', icon: Truck },
  { name: 'Battery', label: 'Pin trâu', icon: Battery },
  { name: 'Cpu', label: 'Vi xử lý', icon: Cpu },
  { name: 'Clock', label: 'Thời gian', icon: Clock },
  { name: 'Crown', label: 'Hoàng gia', icon: Crown },
  { name: 'Globe', label: 'Toàn cầu', icon: Globe },
  { name: 'Wifi', label: 'Kết nối', icon: Wifi },
  { name: 'Bell', label: 'Thông báo', icon: Bell },
  { name: 'Gift', label: 'Quà tặng', icon: Gift },
  { name: 'Compass', label: 'Định vị', icon: Compass },
  { name: 'Headphones', label: 'Âm thanh', icon: Headphones },
  { name: 'Watch', label: 'Đồng hồ', icon: Watch },
  { name: 'Layers', label: 'Đa tầng', icon: Layers }
];

const SLIDER_PRESETS = [
  {
    id: 'slider-chrono-thumbs',
    title: 'Chrono Titan (Kèm Hàng Thumbnails)',
    desc: 'Trình chiếu ảnh lớn + hàng ảnh thu nhỏ trực quan bên dưới',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop'
    ],
    style: {
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      autoplay: true,
      interval: 3500,
      showThumbnails: true
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
      interval: 4000,
      showThumbnails: false
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
      interval: 3200,
      showThumbnails: true
    }
  }
];

export default function CanvaDrawer({
  isOpen = false,
  onClose,
  onAddText,
  onAddBadge,
  onAddButton,
  onAddContainer,
  onAddIcon,
  onAddSymbol,
  onAddImage,
  onAddSlider
}) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'elements' | 'icons' | 'badge' | 'image' | 'slider'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Slider custom builder states
  const [customSlideImages, setCustomSlideImages] = useState([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop'
  ]);
  const [slideUrlInput, setSlideUrlInput] = useState('');
  const [sliderThumbnailsMode, setSliderThumbnailsMode] = useState(true);
  const [isUploadingSlideMulti, setIsUploadingSlideMulti] = useState(false);
  const [slideUploadStatus, setSlideUploadStatus] = useState('');

  const fileInputRef = useRef(null);
  const slideMultiFileRef = useRef(null);

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

  const handleSlideMultiUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingSlideMulti(true);
    setSlideUploadStatus(`0/${files.length}`);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        setSlideUploadStatus(`${i + 1}/${files.length}`);
        const res = await adminApi.uploadImage(files[i]);
        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setCustomSlideImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err) {
      console.error('Lỗi tải nhiều ảnh cho slide:', err);
      alert('Có lỗi khi tải ảnh từ máy tính. Vui lòng thử lại!');
    } finally {
      setIsUploadingSlideMulti(false);
      setSlideUploadStatus('');
      if (slideMultiFileRef.current) slideMultiFileRef.current.value = '';
    }
  };

  return (
    <div data-canva-drawer="true" className="fixed inset-y-0 left-0 z-50 flex shadow-2xl animate-in slide-in-from-left duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10" 
        onClick={onClose} 
      />

      {/* Main Drawer Panel */}
      <aside className="w-84 sm:w-96 bg-neutral-900/95 backdrop-blur-2xl border-r border-white/10 flex flex-col text-white h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm tracking-wide text-neutral-100">Canva Studio Assets</h2>
              <p className="text-[11px] text-neutral-400">Kho tài nguyên kéo thả & tạo mới</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Pills) */}
        <div className="flex items-center gap-1 border-b border-white/10 bg-black/40 p-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Chữ & Ký tự</span>
          </button>

          <button
            onClick={() => setActiveTab('elements')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'elements'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Nút & Khối</span>
          </button>

          <button
            onClick={() => setActiveTab('icons')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'icons'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Icon</span>
          </button>

          <button
            onClick={() => setActiveTab('badge')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'badge'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Huy hiệu</span>
          </button>

          <button
            onClick={() => setActiveTab('slider')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'slider'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Slide ảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'image'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Ảnh</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: TEXT & SPECIAL SYMBOLS */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-300 font-medium">Mẫu chữ & Ký tự đặc biệt</p>
                <p className="text-[11px] text-neutral-400">Chọn mẫu để thêm vào trang. Nhấp đúp trực tiếp để gõ nội dung mới.</p>
              </div>

              {/* Headings */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onAddText?.('h1');
                    onClose?.();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400">
                      Tiêu Đề Lớn (H1)
                    </h3>
                    <p className="text-[10px] text-neutral-400">36px · Tựa đề sản phẩm nổi bật</p>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
                </button>

                <button
                  onClick={() => {
                    onAddText?.('h2');
                    onClose?.();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-blue-400">
                      Tiêu Đề Phụ (H2)
                    </h4>
                    <p className="text-[10px] text-neutral-400">22px · Slogan, tính năng</p>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
                </button>

                <button
                  onClick={() => {
                    onAddText?.('body');
                    onClose?.();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="text-xs text-neutral-300 group-hover:text-blue-400">
                      Đoạn văn thuyết minh (Body)
                    </p>
                    <p className="text-[10px] text-neutral-400">15px · Giới thiệu chi tiết</p>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
                </button>
              </div>

              {/* Special Symbols Grid */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                  Ký tự & Biểu tượng nghệ thuật:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SPECIAL_SYMBOLS.map((sym, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onAddSymbol?.(sym.symbol, { color: sym.color, fontSize: sym.size });
                        onClose?.();
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-blue-500/50 flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer"
                      title={sym.name}
                    >
                      <span style={{ color: sym.color, fontSize: `${sym.size}px` }}>{sym.symbol}</span>
                      <span className="text-[9px] text-neutral-400 group-hover:text-white truncate max-w-full">
                        {sym.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUTTONS & CONTAINERS */}
          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-300 font-medium">Nút bấm & Khối nền Container</p>
                <p className="text-[11px] text-neutral-400">Tạo các nút bấm tương tác CTA và khối nền kính mờ sang trọng:</p>
              </div>

              {/* Buttons */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                  Mẫu Nút Bấm CTA:
                </span>
                {BUTTON_PRESETS.map((btn) => (
                  <div
                    key={btn.id}
                    onClick={() => {
                      onAddButton?.(btn.label, btn.style);
                      onClose?.();
                    }}
                    className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/80 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div 
                      style={{
                        background: btn.style.background,
                        color: btn.style.color,
                        fontSize: `${btn.style.fontSize}px`,
                        fontWeight: btn.style.fontWeight,
                        padding: btn.style.padding,
                        borderRadius: btn.style.borderRadius,
                        boxShadow: btn.style.boxShadow,
                        display: 'inline-block'
                      }}
                      className="text-xs"
                    >
                      {btn.label}
                    </div>
                    <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
                  </div>
                ))}
              </div>

              {/* Containers */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                  Mẫu Khối Nền Tự Do (Container):
                </span>
                {CONTAINER_PRESETS.map((box) => (
                  <div
                    key={box.id}
                    onClick={() => {
                      onAddContainer?.(box.content, box.style);
                      onClose?.();
                    }}
                    className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/80 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-blue-400">{box.title}</h4>
                      <p className="text-[10px] text-neutral-400">{box.desc}</p>
                    </div>
                    <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ICONS */}
          {activeTab === 'icons' && (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-300 font-medium">Kho Biểu tượng (Lucide Icons)</p>
                <p className="text-[11px] text-neutral-400">Bấm vào icon để thêm ngay lên trang, sau đó kéo thả và phóng to thu nhỏ tùy ý:</p>
              </div>

              <div className="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {CURATED_ICONS.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onAddIcon?.(item.name, { fontSize: 36, color: '#2997ff' });
                        onClose?.();
                      }}
                      className="p-3 rounded-xl bg-white/5 hover:bg-[#0071e3]/20 border border-white/10 hover:border-blue-500/60 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
                      title={item.label}
                    >
                      <IconComp className="w-6 h-6 text-[#2997ff] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-neutral-300 group-hover:text-white truncate max-w-full">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: BADGES */}
          {activeTab === 'badge' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">Các mẫu huy hiệu phong cách Apple & luxury boutique, bo góc mượt mà và phát sáng tinh tế:</p>

              <div className="space-y-2.5">
                {BADGE_PRESETS.map((preset) => (
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
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SLIDER (WITH LOCAL MULTI-UPLOAD & THUMBNAILS OPTION) */}
          {activeTab === 'slider' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-300 font-medium">Trình chiếu ảnh tương tác (Slide)</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Cho phép upload nhiều ảnh trực tiếp từ máy tính, tùy chọn hiển thị kèm hàng thumbnail:
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

              {/* Custom Slider Builder with Multi-file Upload */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                    Tạo Slide Tùy Chỉnh:
                  </span>
                  <span className="text-[10px] text-[#2997ff] font-mono">
                    {customSlideImages.length} ảnh trong slide
                  </span>
                </div>

                {/* Multiple Local Files Upload Dropzone */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={slideMultiFileRef}
                  className="hidden"
                  onChange={handleSlideMultiUpload}
                />

                <div
                  onClick={() => slideMultiFileRef.current?.click()}
                  className="border-2 border-dashed border-blue-500/40 hover:border-blue-500 rounded-xl p-3 text-center cursor-pointer transition-colors bg-blue-500/5 hover:bg-blue-500/10 group"
                >
                  {isUploadingSlideMulti ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-xs text-neutral-200">Đang tải ảnh ({slideUploadStatus})...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Upload className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-blue-300">
                        📸 Tải lên nhiều ảnh từ máy tính
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] text-neutral-400 mt-0.5">Chọn nhiều file cùng lúc (PNG, JPG, WebP)</p>
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

                {/* Add image URL input */}
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="Dán thêm link ảnh online..."
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

                {/* Thumbnail mode switch */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-neutral-300">Hiển thị hàng ảnh thu nhỏ (Thumbnails):</span>
                  <input
                    type="checkbox"
                    checked={sliderThumbnailsMode}
                    onChange={(e) => setSliderThumbnailsMode(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
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
                        interval: 3500,
                        showThumbnails: sliderThumbnailsMode
                      });
                      onClose?.();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>+ Tạo Slide Trình Chiếu ({customSlideImages.length} ảnh)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: STATIC IMAGE */}
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
                    <span className="text-[10px] text-neutral-400">PNG, JPG, WebP, SVG</span>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {uploadError}
                </p>
              )}

              {/* URL input */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-medium text-neutral-300 block">Hoặc dán URL hình ảnh:</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageUrl.trim()) {
                        onAddImage?.(customImageUrl.trim());
                        setCustomImageUrl('');
                        onClose?.();
                      }
                    }}
                    disabled={!customImageUrl.trim()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </aside>
    </div>
  );
}
