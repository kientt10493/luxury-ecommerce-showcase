import React, { useState, useRef, useEffect } from 'react';
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
  Heart,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Palette,
  Link as LinkIcon,
  Sliders,
  Copy,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  RotateCcw,
  Eye,
  Undo2
} from 'lucide-react';
import { adminApi } from '../../../services/api';
import CanvaIconRenderer, { ICON_MAP } from './CanvaIconRenderer';
import CanvaBlockInspector from './CanvaBlockInspector';
import { BUTTON_PRESETS, BUTTON_CATEGORIES } from './buttonPresets';
import { SYMBOL_CATEGORIES } from './symbolPresets';

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

export const ELEMENT_FRIENDLY_NAMES = {
  'hero-cta-buy': 'Nút Mua Ngay (Hero CTA)',
  'hero-cta-specs': 'Nút Khám Phá Thông Số Kỹ Thuật',
  'hero-pricing-box': 'Khối Hiển Thị Giá Bán',
  'hero-product-model-pills': 'Thanh Chọn Model Sản Phẩm',
  'hero-guarantee-pills': 'Huy Hiệu Cam Kết & Bảo Hành',
  'hero-eyebrow': 'Nhãn Phụ Đầu Trang (Eyebrow)',
  'hero-product-name': 'Tiêu Đề Tên Sản Phẩm Hero',
  'hero-product-tagline': 'Khẩu Hiệu Sản Phẩm (Tagline)',
  'hero-product-desc': 'Đoạn Văn Giới Thiệu Sản Phẩm',
  'config-color-swatches': 'Bảng Lựa Chọn Màu Sắc',
  'config-variant-tabs': 'Tab Cấu Hình Dung Lượng',
  'config-cta-add': 'Nút Mua Ngay / Thêm Vào Giỏ (Config)',
  'config-pricing-box': 'Bảng Giá Chi Tiết Cấu Hình',
  'bento-card-0': 'Thẻ Bento 01: Màn hình Micro-OLED 4K',
  'bento-card-1': 'Thẻ Bento 02: Eye Tracking & Cử Chỉ 3D',
  'bento-card-2': 'Thẻ Bento 03: Khung Carbon Titanium',
  'bento-card-3': 'Thẻ Bento 04: Spatial Audio Đa Chiều',
  'bento-badge': 'Huy Hiệu Kiến Trúc Đột Phá Bento',
  'bento-title': 'Tiêu Đề Khối Bento Features',
  'bento-subtitle': 'Mô Tả Phụ Khối Bento Features',
  'specs-title': 'Tiêu Đề Bảng Thông Số Kỹ Thuật',
  'specs-subtitle': 'Mô Tả Bảng Thông Số Kỹ Thuật',
  'specs-table': 'Bảng Liệt Kê Thông Số Kỹ Thuật Chi Tiết'
};


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

const PROP_FONT_FAMILIES = [
  { name: 'Inter (Hiện đại, Sắc nét)', value: "'Inter', sans-serif" },
  { name: 'Outfit (Đột phá công nghệ)', value: "'Outfit', sans-serif" },
  { name: 'Playfair Display (Sang trọng)', value: "'Playfair Display', serif" },
  { name: 'Cinzel (Hoàng gia)', value: "'Cinzel', serif" },
  { name: 'Fira Code (Monospace)', value: "'Fira Code', monospace" }
];

const PROP_TEXT_COLORS = [
  { name: 'Trắng Tinh', value: '#ffffff' },
  { name: 'Xám Titan', value: '#a1a1a6' },
  { name: 'Vàng Gold', value: '#fde047' },
  { name: 'Xanh Apple', value: '#2997ff' },
  { name: 'Ngọc Lục Bảo', value: '#34d399' },
  { name: 'Đỏ Ruby', value: '#f43f5e' },
  { name: 'Tím Cyber', value: '#c084fc' },
  { name: 'Cam Amber', value: '#fb923c' },
  { name: 'Đen Obsidian', value: '#09090b' }
];

const PROP_BG_PRESETS = [
  { name: 'Trong suốt', value: 'transparent', border: 'none', filter: 'none' },
  { name: 'Kính Tối', value: 'rgba(22,22,23,0.85)', border: '1px solid rgba(255,255,255,0.15)', filter: 'blur(20px)' },
  { name: 'Kính Mờ', value: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)', filter: 'blur(16px)' },
  { name: 'Vàng Hoàng Kim', value: 'linear-gradient(135deg,rgba(234,179,8,0.22),rgba(0,0,0,0.85))', border: '1px solid rgba(234,179,8,0.45)', filter: 'blur(12px)' },
  { name: 'Xanh Sapphire', value: 'linear-gradient(135deg,rgba(41,151,255,0.25),rgba(0,0,0,0.88))', border: '1px solid rgba(41,151,255,0.45)', filter: 'blur(16px)' },
  { name: 'Titan Đen', value: 'rgba(10,10,12,0.95)', border: '1px solid rgba(255,255,255,0.1)', filter: 'none' }
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
  onAddSlider,
  selectedElement = null,
  onUpdateStyle,
  onUpdateContent,
  onUpdateAnchor,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  allAnchors = [],
  activeBlock = null,
  blockStyles = {},
  onUpdateBlockStyle,
  onResetBlockStyle,
  onClearActiveBlock,
  sectionOrder = ['hero', 'configurator', 'bento', 'specs'],
  onMoveSection,
  onSelectBlock,
  pageDimensions = {
    widthMode: '100%',
    customWidth: '100%',
    minHeight: 'auto',
    paddingX: 0,
    paddingY: 0,
    backgroundColor: '',
    align: 'center'
  },
  onUpdatePageDimensions,
  hiddenElements = [],
  onRestoreElement,
  onRestoreAllElements,
  onDeleteBlock,
  onDuplicateBlock
}) {
  const [activeTab, setActiveTab] = useState(activeBlock ? 'block' : 'page');
  const [selectedButtonCategory, setSelectedButtonCategory] = useState('all');
  const [selectedSymbolCategory, setSelectedSymbolCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [propAnchorInput, setPropAnchorInput] = useState('');
  const [propLinkInput, setPropLinkInput] = useState('');

  // Auto-switch to block inspector tab when a block is selected on the website
  useEffect(() => {
    if (activeBlock) {
      setActiveTab('block');
    }
  }, [activeBlock?.id]);

  // Auto-switch to properties tab when an overlay element is selected
  useEffect(() => {
    if (selectedElement) {
      setActiveTab('properties');
    }
  }, [selectedElement?.id]);

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

  // Auto-switch to Properties tab when a new element is selected
  useEffect(() => {
    if (selectedElement?.id) {
      setActiveTab('properties');
      setPropAnchorInput(selectedElement.anchor || '');
      setPropLinkInput(selectedElement.style?.link || '');
    }
  }, [selectedElement?.id]);

  // Derived values from selected element (non-hook computed before early return)
  const pStyle = selectedElement?.style || {};
  const pFontSize = typeof pStyle.fontSize === 'number' ? pStyle.fontSize : (parseInt(pStyle.fontSize) || 16);
  const pColor = pStyle.color || '#ffffff';
  const pBgColor = typeof pStyle.backgroundColor === 'string' ? pStyle.backgroundColor : '';
  const pFontFamily = pStyle.fontFamily || '';
  const pIsBold = pStyle.fontWeight === 'bold' || Number(pStyle.fontWeight) >= 700;
  const pIsItalic = pStyle.fontStyle === 'italic';
  const pTextAlign = pStyle.textAlign || 'left';
  const pOpacity = Math.round((pStyle.opacity ?? 1) * 100);
  const pBorderRadius = pStyle.borderRadius ? String(pStyle.borderRadius) : '';
  const pBoxShadow = pStyle.boxShadow || '';
  const pLink = pStyle.link || '';
  const pAnchor = selectedElement?.anchor || '';
  const pIsTextLike = ['text', 'badge', 'button', 'symbol'].includes(selectedElement?.type || '');

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
      {/* Backdrop (visible only on mobile so user on desktop can click website blocks) */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10 sm:hidden" 
        onClick={onClose} 
      />

      {/* Main Drawer Panel (unified Canva Studio Assets & Block Inspector) */}
      <aside className="w-84 sm:w-[420px] md:w-[460px] bg-neutral-900/95 backdrop-blur-2xl border-r border-white/10 flex flex-col text-white h-full shadow-[25px_0_60px_rgba(0,0,0,0.85)]">
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
          {/* 1. Block Inspector Tab (When any block on website is selected) */}
          {activeBlock && (
            <button
              onClick={() => setActiveTab('block')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                activeTab === 'block'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-400 hover:text-white hover:bg-blue-500/15 border border-blue-500/30'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Chỉnh sửa Khối</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          )}

          {/* 2. Kích thước Trang (Page Canvas Dimensions) Tab */}
          <button
            onClick={() => setActiveTab('page')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'page'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-cyan-400 hover:text-white hover:bg-cyan-500/15 border border-cyan-500/30'
            }`}
            title="Điều chỉnh chiều rộng (Width) và chiều cao/độ dài (Length) của toàn bộ website"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Kích thước Trang</span>
          </button>

          {/* 3. Thứ tự Khối (Trước - Sau / Layers) Tab */}
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'layers'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-purple-400 hover:text-white hover:bg-purple-500/15 border border-purple-500/30'
            }`}
            title="Sắp xếp thứ tự các khối hiển thị trước - sau trên trang web"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Thứ tự Khối</span>
          </button>

          {/* 4. Canvas Element Properties Tab */}
          {selectedElement && (
            <button
              onClick={() => setActiveTab('properties')}
              className={'flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ' + (activeTab === 'properties' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-400 hover:text-white hover:bg-emerald-500/15 border border-emerald-500/30')}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Chỉnh sửa Element</span>
            </button>
          )}

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
            onClick={() => setActiveTab('text')}
            className={'flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ' + (activeTab === 'text' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5')}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Chữ & Ký tự</span>
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

          {/* 5. Khôi phục phần tử đã ẩn / xóa Tab */}
          <button
            onClick={() => setActiveTab('restore')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'restore'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                : 'text-amber-400 hover:text-white hover:bg-amber-500/15 border border-amber-500/30'
            }`}
            title="Khôi phục lại các phần tử UI đã bị xóa hoặc ẩn khỏi website"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục</span>
            {hiddenElements?.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none animate-pulse">
                {hiddenElements.length}
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ══ 0. BLOCK INSPECTOR (Tùy chỉnh khối website đã chọn) ══ */}
          {activeTab === 'block' && activeBlock && (
            <div className="space-y-4">
              <CanvaBlockInspector
                embedded={true}
                activeBlock={activeBlock}
                blockStyle={blockStyles[activeBlock.id] || {}}
                onUpdateStyle={(patch) => onUpdateBlockStyle?.(activeBlock.id, patch)}
                onResetStyle={() => onResetBlockStyle?.(activeBlock.id)}
                onClose={onClearActiveBlock}
                sectionOrder={sectionOrder}
                onMoveSection={onMoveSection}
                onDeleteBlock={(id) => {
                  onDeleteBlock?.(id);
                  onClearActiveBlock?.();
                }}
                onDuplicateBlock={onDuplicateBlock}
              />
            </div>
          )}

          {/* ══ KÍCH THƯỚC TRANG (LENGTH + WIDTH CANVAS RESIZER) ══ */}
          {activeTab === 'page' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-blue-950/40 border border-cyan-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                  <span>Kích thước Trang Web (Page Canvas Resizer)</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Tùy chỉnh linh hoạt độ rộng (<strong className="text-white font-medium">Width</strong>) và chiều cao/độ dài tối thiểu (<strong className="text-white font-medium">Length</strong>) cho toàn bộ trang web. Trang sẽ tự động co giãn trực quan theo kích thước bạn chọn.
                </p>
              </div>

              {/* 1. Mẫu Thiết Bị & Độ Rộng Nhanh (Preset Widths) */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                  Độ Rộng Mẫu (Device Presets):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '100% Toàn Màn Hình', value: '100%', icon: Monitor, desc: 'Co giãn theo cửa sổ' },
                    { label: '4K Ultra (1920px)', value: '1920px', icon: Monitor, desc: 'Màn hình máy tính lớn' },
                    { label: 'MacBook Pro (1600px)', value: '1600px', icon: Laptop, desc: 'Laptop độ phân giải cao' },
                    { label: 'Desktop Chuẩn (1440px)', value: '1440px', icon: Laptop, desc: 'Khung hiển thị chuẩn' },
                    { label: 'Laptop Nhỏ (1200px)', value: '1200px', icon: Laptop, desc: 'Màn hình 13-14 inch' },
                    { label: 'Tablet Dọc (768px)', value: '768px', icon: Tablet, desc: 'iPad / Máy tính bảng' },
                    { label: 'Mobile (390px)', value: '390px', icon: Smartphone, desc: 'iPhone / Điện thoại' },
                  ].map((preset) => {
                    const isSelected = pageDimensions.customWidth === preset.value;
                    const IconComp = preset.icon;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          onUpdatePageDimensions?.({
                            ...pageDimensions,
                            widthMode: preset.value === '100%' ? '100%' : 'fixed',
                            customWidth: preset.value
                          });
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-600/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/50'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-neutral-400'}`} />
                          <span className="font-mono text-[10px] text-neutral-400 font-semibold">{preset.value}</span>
                        </div>
                        <div className="font-medium text-[11px] truncate">{preset.label}</div>
                        <div className="text-[9px] text-neutral-400 truncate">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Thanh Trượt & Nhập Chiều Rộng Tùy Chỉnh (Custom Width) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-neutral-300">Độ Rộng Tùy Chỉnh (Custom Width):</span>
                  <span className="font-mono font-bold text-cyan-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {pageDimensions.customWidth || '100%'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="360"
                    max="2560"
                    step="10"
                    value={
                      pageDimensions.customWidth && pageDimensions.customWidth.includes('px')
                        ? parseInt(pageDimensions.customWidth)
                        : 1440
                    }
                    onChange={(e) => {
                      const val = `${e.target.value}px`;
                      onUpdatePageDimensions?.({
                        ...pageDimensions,
                        widthMode: 'fixed',
                        customWidth: val
                      });
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdatePageDimensions?.({
                        ...pageDimensions,
                        widthMode: '100%',
                        customWidth: '100%'
                      });
                    }}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono whitespace-nowrap text-neutral-200 cursor-pointer"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* 3. Chiều Cao / Độ Dài Trang Tối Thiểu (Min-Height / Length) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-neutral-300">Chiều Cao/Độ Dài Tối Thiểu (Length):</span>
                  <span className="font-mono font-bold text-blue-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {pageDimensions.minHeight || 'auto'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="600"
                    max="5000"
                    step="50"
                    value={
                      pageDimensions.minHeight && pageDimensions.minHeight.includes('px')
                        ? parseInt(pageDimensions.minHeight)
                        : 1200
                    }
                    onChange={(e) => {
                      const val = `${e.target.value}px`;
                      onUpdatePageDimensions?.({
                        ...pageDimensions,
                        minHeight: val
                      });
                    }}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdatePageDimensions?.({
                        ...pageDimensions,
                        minHeight: 'auto'
                      });
                    }}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono whitespace-nowrap text-neutral-200 cursor-pointer"
                  >
                    Tự động
                  </button>
                </div>
                <div className="flex gap-1.5 pt-1">
                  {['auto', '100vh', '1400px', '2200px', '3500px'].map((hVal) => (
                    <button
                      key={hVal}
                      type="button"
                      onClick={() => onUpdatePageDimensions?.({ ...pageDimensions, minHeight: hVal })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                        pageDimensions.minHeight === hVal
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-white/5 text-neutral-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {hVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Canh Lề Canvas (Alignment) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                <label className="text-[11px] font-medium text-neutral-300 block">
                  Vị Trí Căn Lề Trang Web:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Canh Trái', value: 'left', icon: AlignLeft },
                    { label: 'Canh Giữa (Chuẩn)', value: 'center', icon: AlignCenter },
                    { label: 'Canh Phải', value: 'right', icon: AlignRight }
                  ].map((alignOpt) => {
                    const isSelected = (pageDimensions.align || 'center') === alignOpt.value;
                    const AlignIcon = alignOpt.icon;
                    return (
                      <button
                        key={alignOpt.value}
                        type="button"
                        onClick={() => onUpdatePageDimensions?.({ ...pageDimensions, align: alignOpt.value })}
                        className={`p-2 rounded-lg border text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-600/30 border-cyan-400 text-white font-semibold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <AlignIcon className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{alignOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Khoảng Đệm Lề (Padding X & Y) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-300">
                    <span>Đệm Trái/Phải (X):</span>
                    <span className="font-mono text-cyan-400 font-bold">{pageDimensions.paddingX || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="4"
                    value={pageDimensions.paddingX || 0}
                    onChange={(e) => onUpdatePageDimensions?.({ ...pageDimensions, paddingX: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-300">
                    <span>Đệm Trên/Dưới (Y):</span>
                    <span className="font-mono text-blue-400 font-bold">{pageDimensions.paddingY || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="4"
                    value={pageDimensions.paddingY || 0}
                    onChange={(e) => onUpdatePageDimensions?.({ ...pageDimensions, paddingY: parseInt(e.target.value) })}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* 6. Màu Nền Canvas (Background Color) */}
              <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-neutral-300">Màu Nền Trang Web:</span>
                  <span className="font-mono text-[10px] text-neutral-400">{pageDimensions.backgroundColor || 'Mặc định (#000)'}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { label: 'Đen Obsidian', val: '#000000' },
                    { label: 'Kính Tối Dark', val: '#0b0b0e' },
                    { label: 'Titan Xám', val: '#18181b' },
                    { label: 'Đêm Sâu Midnight', val: '#070b19' },
                    { label: 'Rượu Vang Đỏ', val: '#16080e' },
                  ].map((bg) => (
                    <button
                      key={bg.val}
                      type="button"
                      onClick={() => onUpdatePageDimensions?.({ ...pageDimensions, backgroundColor: bg.val })}
                      className={`h-7 rounded-lg border transition-all cursor-pointer relative ${
                        pageDimensions.backgroundColor === bg.val
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                          : 'border-white/15 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: bg.val }}
                      title={bg.label}
                    />
                  ))}
                </div>
              </div>

              {/* 7. Nút Reset về Mặc Định */}
              <button
                type="button"
                onClick={() => {
                  onUpdatePageDimensions?.({
                    widthMode: '100%',
                    customWidth: '100%',
                    minHeight: 'auto',
                    paddingX: 0,
                    paddingY: 0,
                    backgroundColor: '',
                    align: 'center'
                  });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại Kích Thước Chuẩn (100% Full Width)</span>
              </button>
            </div>
          )}

          {/* ══ SẮP XẾP THỨ TỰ CÁC KHỐI HIỂN THỊ TRƯỚC - SAU ══ */}
          {activeTab === 'layers' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Sắp xếp thứ tự các khối hiển thị (Trước - Sau)</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Các khối nằm ở trên sẽ hiển thị <strong className="text-white font-bold">trước</strong> (đầu trang), các khối nằm ở dưới sẽ hiển thị <strong className="text-white font-bold">sau</strong> khi người dùng cuộn xem website. Bấm mũi tên để đổi vị trí hiển thị.
                </p>
              </div>

              {/* Sections List */}
              <div className="space-y-2">
                {sectionOrder.map((secKey, index) => {
                  const labelMap = {
                    hero: '1. Khối Giới Thiệu Hero Showcase',
                    configurator: '2. Trình Chọn Cấu Hình & Mua Hàng',
                    bento: '3. Thẻ Đột Phá Bento Highlights',
                    specs: '4. Bảng Thông Số Kỹ Thuật Tech Specs'
                  };
                  const label = labelMap[secKey] || secKey;
                  const isCurrentSelected = activeBlock?.id === `section-${secKey}` || activeBlock?.sectionKey === secKey;

                  return (
                    <div
                      key={secKey}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrentSelected
                          ? 'bg-blue-600/20 border-blue-500/60 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center font-mono font-bold text-[11px] text-blue-400 flex-shrink-0 shadow-inner">
                          #{index + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {label}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {index === 0 ? '✨ Hiển thị đầu trang' : index === sectionOrder.length - 1 ? '🏁 Hiển thị cuối trang' : `Vị trí thứ ${index + 1}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Move Up (Lên trước) */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => onMoveSection?.(index, index - 1)}
                          title="Hiển thị lên trước (Dời lên trên)"
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            index === 0
                              ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/5 text-neutral-500'
                              : 'bg-purple-600/30 hover:bg-purple-600 border-purple-500/40 text-purple-200 hover:text-white'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down (Xuống sau) */}
                        <button
                          type="button"
                          disabled={index === sectionOrder.length - 1}
                          onClick={() => onMoveSection?.(index, index + 1)}
                          title="Hiển thị ra sau (Dời xuống dưới)"
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            index === sectionOrder.length - 1
                              ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/5 text-neutral-500'
                              : 'bg-purple-600/30 hover:bg-purple-600 border-purple-500/40 text-purple-200 hover:text-white'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit block button */}
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBlock?.({
                              id: `section-${secKey}`,
                              type: 'Khối Section',
                              label: label,
                              sectionKey: secKey,
                              style: blockStyles[`section-${secKey}`] || {}
                            });
                            setActiveTab('block');
                          }}
                          title="Chỉnh sửa màu nền, ảnh nền và bo góc cho khối này"
                          className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Palette className="w-3 h-3 text-amber-300" />
                          <span>Sửa</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ PROPERTIES PANEL ══ */}
          {activeTab === 'properties' && selectedElement && (
            <div className="space-y-4">

              {/* Identity + Quick Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/25 border border-blue-500/30 text-[#2997ff] text-[10px] font-mono capitalize">
                    {selectedElement.type}
                  </span>
                  {pAnchor && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono">
                      {'#' + pAnchor}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => onBringForward?.()} title="L\u00ean tr\u01b0\u1edbc" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => onSendBackward?.()} title="Xu\u1ed1ng sau" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => onDuplicate?.()} title="Nh\u00e2n b\u1ea3n" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 hover:text-white transition-colors cursor-pointer">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => onDelete?.()} title="X\u00f3a kh\u1ed1i n\u00e0y" className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* TYPOGRAPHY */}
              {pIsTextLike && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block">\u2756 Font ch\u1eef &amp; V\u0103n b\u1ea3n</span>

                  {/* Font Size */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-300">C\u1ee1 ch\u1eef</span>
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl px-1.5 py-1 border border-white/10">
                      <button type="button" onClick={() => onUpdateStyle?.({ fontSize: Math.max(10, pFontSize - 2) })} className="p-1 hover:text-blue-400 cursor-pointer text-neutral-300">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-[11px] font-mono font-semibold text-[#2997ff]">{pFontSize}px</span>
                      <button type="button" onClick={() => onUpdateStyle?.({ fontSize: Math.min(120, pFontSize + 2) })} className="p-1 hover:text-blue-400 cursor-pointer text-neutral-300">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Font Family */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-neutral-400">Ki\u1ec3u font</span>
                    <select
                      value={pFontFamily}
                      onChange={e => onUpdateStyle?.({ fontFamily: e.target.value })}
                      className="bg-black/60 text-white border border-white/15 rounded-xl px-2.5 py-1.5 text-[11px] outline-none focus:border-blue-500 cursor-pointer w-full"
                    >
                      <option value="">-- M\u1eb7c \u0111\u1ecbnh (SF Pro) --</option>
                      {PROP_FONT_FAMILIES.map(f => (
                        <option key={f.value} value={f.value}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bold / Italic / Alignment */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => onUpdateStyle?.({ fontWeight: pIsBold ? 'normal' : 'bold' })} className={'p-2 rounded-xl border transition-all cursor-pointer ' + (pIsBold ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white')} title="In \u0111\u1eadm">
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => onUpdateStyle?.({ fontStyle: pIsItalic ? 'normal' : 'italic' })} className={'p-2 rounded-xl border transition-all cursor-pointer ' + (pIsItalic ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white')} title="In nghi\u00eang">
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10">
                      {[['left', AlignLeft, 'C\u0103n tr\u00e1i'], ['center', AlignCenter, 'C\u0103n gi\u1eefa'], ['right', AlignRight, 'C\u0103n ph\u1ea3i']].map(([val, Icon, label]) => (
                        <button key={val} type="button" onClick={() => onUpdateStyle?.({ textAlign: val })} className={'p-1.5 rounded-lg cursor-pointer transition-colors ' + (pTextAlign === val ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white')} title={label}>
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Color Swatches */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-neutral-400">M\u00e0u ch\u1eef</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {PROP_TEXT_COLORS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => onUpdateStyle?.({ color: c.value })}
                          className={'w-6 h-6 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ' + (pColor.toLowerCase() === c.value.toLowerCase() ? 'border-white ring-2 ring-blue-500 scale-110' : 'border-white/20')}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                      <label className="flex items-center gap-1 px-1.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer">
                        <Palette className="w-3 h-3 text-blue-400" />
                        <input type="color" value={pColor.startsWith('#') ? pColor : '#ffffff'} onChange={e => onUpdateStyle?.({ color: e.target.value })} className="w-4 h-4 rounded border-none bg-transparent cursor-pointer" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* BACKGROUND */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block">\u2756 N\u1ec1n &amp; M\u00e0u kh\u1ed1i</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PROP_BG_PRESETS.map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => onUpdateStyle?.({
                        backgroundColor: (p.value.includes('gradient') || p.value === 'transparent') ? undefined : p.value,
                        background: p.value.includes('gradient') ? p.value : (p.value === 'transparent' ? 'transparent' : undefined),
                        border: p.border !== 'none' ? p.border : undefined,
                        backdropFilter: p.filter !== 'none' ? p.filter : undefined
                      })}
                      className="p-2 rounded-xl border border-white/10 hover:border-blue-500/60 bg-white/5 hover:bg-white/10 transition-all cursor-pointer text-left"
                    >
                      <div
                        className="w-full h-4 rounded mb-1.5 border border-white/10"
                        style={{ background: p.value !== 'transparent' ? p.value : 'repeating-conic-gradient(#555 0% 25%,#222 0% 50%) 0/8px 8px' }}
                      />
                      <span className="text-[10px] text-neutral-200">{p.name}</span>
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-neutral-300">M\u00e0u n\u1ec1n t\u00f9y ch\u1ec9nh</span>
                  <input type="color" value={pBgColor.startsWith('#') ? pBgColor : '#000000'} onChange={e => onUpdateStyle?.({ backgroundColor: e.target.value, background: undefined })} className="ml-auto w-5 h-5 rounded border-none bg-transparent cursor-pointer" />
                </label>
              </div>

              {/* EFFECTS */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block">\u2756 Bo g\u00f3c &amp; Hi\u1ec7u \u1ee9ng</span>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-400">Bo g\u00f3c</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[['Vu\u00f4ng', '0px'], ['Bo nh\u1eb9', '8px'], ['Chu\u1ea9n', '16px'], ['L\u1edbn', '24px'], ['Pill', '9999px']].map(([name, val]) => (
                      <button key={val} type="button" onClick={() => onUpdateStyle?.({ borderRadius: val })} className={'px-2.5 py-1 rounded-xl border text-[10px] transition-all cursor-pointer ' + (pBorderRadius === val ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white')}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="text-[11px] text-neutral-300 w-12 flex-shrink-0">\u0110\u1ed9 m\u1edd</span>
                  <input type="range" min="10" max="100" value={pOpacity} onChange={e => onUpdateStyle?.({ opacity: Number(e.target.value) / 100 })} className="flex-1 h-1 accent-blue-500 cursor-pointer" />
                  <span className="text-[10px] font-mono text-[#2997ff] w-7 text-right flex-shrink-0">{pOpacity}%</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[['Kh\u00f4ng b\u00f3ng', 'none'], ['Xanh Glow', '0 0 20px rgba(41,151,255,0.5)'], ['V\u00e0ng Glow', '0 0 20px rgba(234,179,8,0.5)'], ['B\u00f3ng 3D', '0 20px 50px rgba(0,0,0,0.85)']].map(([name, val]) => (
                    <button key={name} type="button" onClick={() => onUpdateStyle?.({ boxShadow: val })} className={'px-2 py-1.5 rounded-xl border text-[10px] transition-all cursor-pointer ' + (pBoxShadow === val ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white')}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ANCHOR TAG */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block">\u2756 Th\u1ebb neo (Anchor Tag)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400 font-mono">#</span>
                  <input
                    type="text"
                    placeholder="ten-the-neo"
                    value={propAnchorInput}
                    onChange={e => setPropAnchorInput(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, ''))}
                    onKeyDown={e => { if (e.key === 'Enter') onUpdateAnchor?.(propAnchorInput.trim() || null); }}
                    className="flex-1 bg-black/60 border border-white/15 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none focus:border-emerald-500 font-mono"
                  />
                  <button type="button" onClick={() => onUpdateAnchor?.(propAnchorInput.trim() || null)} disabled={!propAnchorInput.trim()} className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-semibold cursor-pointer shadow">
                    L\u01b0u
                  </button>
                  {pAnchor && (
                    <button type="button" onClick={() => { onUpdateAnchor?.(null); setPropAnchorInput(''); }} className="px-2 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 text-[10px] cursor-pointer">
                      X\u00f3a
                    </button>
                  )}
                </div>
                {pAnchor && <p className="text-[10px] text-emerald-400 font-mono">{'Th\u1ebb hi\u1ec7n t\u1ea1i: #' + pAnchor}</p>}
              </div>

              {/* BUTTON LINK */}
              {selectedElement.type === 'button' && (
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block">\u2756 Li\u00ean k\u1ebft n\u00fat b\u1ea5m</span>
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="#ten-the-neo ho\u1eb7c https://..."
                      value={propLinkInput}
                      onChange={e => setPropLinkInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') onUpdateStyle?.({ link: propLinkInput.trim() }); }}
                      className="flex-1 bg-black/60 border border-white/15 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none focus:border-blue-500 font-mono"
                    />
                    <button type="button" onClick={() => onUpdateStyle?.({ link: propLinkInput.trim() })} className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold cursor-pointer shadow">
                      L\u01b0u
                    </button>
                  </div>
                  {allAnchors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500">Th\u1ebb neo tr\u00ean trang:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {allAnchors.map(a => (
                          <button
                            key={a.anchor}
                            type="button"
                            onClick={() => { const v = '#' + a.anchor; setPropLinkInput(v); onUpdateStyle?.({ link: v }); }}
                            className={'px-2 py-1 rounded-lg text-[10px] border transition-colors cursor-pointer font-mono ' + (pLink === '#' + a.anchor ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-emerald-400 hover:border-blue-500/60')}
                          >
                            {'#' + a.anchor}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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

              {/* Special Symbols Catalog */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                    Kho Ký Hiệu & Biểu Tượng Phong Phú:
                  </span>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSymbolCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedSymbolCategory === 'all'
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    Tất cả
                  </button>
                  {SYMBOL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedSymbolCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                        selectedSymbolCategory === cat.id
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Render Symbol Items by Category */}
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {SYMBOL_CATEGORIES
                    .filter((cat) => selectedSymbolCategory === 'all' || selectedSymbolCategory === cat.id)
                    .map((cat) => (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          <span>{cat.name}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {cat.items.map((sym, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                onAddSymbol?.(sym.symbol, {
                                  color: sym.color || '#ffffff',
                                  fontSize: sym.size || 24,
                                  ...(sym.isPill ? {
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    borderRadius: '9999px',
                                    padding: '6px 14px',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                  } : {})
                                });
                                onClose?.();
                              }}
                              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-400/60 flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer text-center"
                              title={sym.name}
                            >
                              <span
                                style={{ color: sym.color || '#ffffff', fontSize: `${Math.min(sym.size || 24, 28)}px` }}
                                className="transition-transform group-hover:scale-110"
                              >
                                {sym.symbol}
                              </span>
                              <span className="text-[9px] text-neutral-400 group-hover:text-white truncate max-w-full">
                                {sym.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUTTONS & CONTAINERS */}
          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-300 font-medium">Kho Mẫu Nút Bấm Đẳng Cấp & Khối Nền</p>
                <p className="text-[11px] text-neutral-400">Các mẫu nút bấm CTA phong cách Apple, Luxury Gold, Cyberpunk & 3D hiện đại:</p>
              </div>

              {/* Category Filter Pills for Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {BUTTON_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedButtonCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedButtonCategory === cat.id
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Buttons List */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {BUTTON_PRESETS
                  .filter((btn) => selectedButtonCategory === 'all' || btn.category === selectedButtonCategory)
                  .map((btn) => (
                    <div
                      key={btn.id}
                      onClick={() => {
                        onAddButton?.(btn.text, btn.style);
                        onClose?.();
                      }}
                      className="p-3 rounded-2xl bg-neutral-950/70 hover:bg-neutral-900 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between cursor-pointer group gap-3"
                    >
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {btn.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                            {btn.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate">{btn.desc}</p>
                        <div className="pt-1">
                          <span
                            style={{
                              background: btn.style.background || btn.style.backgroundColor,
                              color: btn.style.color,
                              fontSize: `${Math.min(btn.style.fontSize || 13, 13)}px`,
                              fontWeight: btn.style.fontWeight,
                              padding: '6px 16px',
                              borderRadius: btn.style.borderRadius,
                              border: btn.style.border,
                              boxShadow: btn.style.boxShadow,
                              display: 'inline-block'
                            }}
                            className="text-xs truncate max-w-full"
                          >
                            {btn.text}
                          </span>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-blue-600 text-neutral-400 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
              </div>

              {/* Containers */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                  Mẫu Khối Nền Kính Tự Do (Container):
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
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ 5. TAB KHÔI PHỤC PHẦN TỬ ĐÃ ẨN / XÓA (RESTORE HIDDEN ELEMENTS) ══ */}
          {activeTab === 'restore' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-rose-950/40 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Quản Lý Phần Tử Đã Ẩn / Xóa ({hiddenElements?.length || 0})</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Khi bạn xóa bất kỳ nút bấm, khối giới thiệu, thẻ bento hay thông số nào trên giao diện, chúng sẽ được lưu vào danh sách an toàn này để bạn có thể khôi phục lại bất kỳ lúc nào chỉ với 1 click.
                </p>
              </div>

              {hiddenElements?.length === 0 ? (
                <div className="py-10 px-4 text-center rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">Không có phần tử nào bị xóa hoặc ẩn</h4>
                  <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                    Tất cả các phần tử trên trang web đang hiển thị đầy đủ. Bạn có thể nhấn vào bất kỳ khối nào trên giao diện và bấm nút Xóa (hoặc phím Delete) để ẩn đi.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-white/10">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Phần tử đã ẩn ({hiddenElements.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => onRestoreAllElements?.()}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-medium border border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Khôi phục tất cả</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {hiddenElements.map((elemId) => {
                      const friendlyName = ELEMENT_FRIENDLY_NAMES[elemId] || `Phần tử UI: #${elemId}`;
                      return (
                        <div
                          key={elemId}
                          className="p-3 rounded-xl bg-white/5 hover:bg-white/[0.08] border border-white/10 transition-all flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">{friendlyName}</h4>
                            <p className="text-[10px] font-mono text-neutral-400 truncate">ID: {elemId}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRestoreElement?.(elemId)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1 cursor-pointer flex-shrink-0"
                            title="Khôi phục phần tử này hiển thị lại trên trang"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Khôi phục</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </aside>
    </div>
  );
}
