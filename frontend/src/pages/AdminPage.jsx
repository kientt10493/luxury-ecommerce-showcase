import React, { useState, useEffect } from 'react';
import { adminApi, productApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { 
  Shield, Key, LogOut, DollarSign, Package, ShoppingCart, 
  Plus, Edit, Trash2, CheckCircle2, Clock, X, Save, ArrowLeft, RefreshCw, Layers,
  Sparkles, Smartphone, Headphones, Watch, Laptop, Image as ImageIcon, Calculator
} from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    id: 'phone',
    name: '📱 Aura Phone 16 Pro',
    slug: 'aura-phone-16-pro',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1200&auto=format&fit=crop',
    translations: {
      en: {
        name: 'Aura Phone 16 Pro',
        tagline: 'Titanium. So strong. So light. So Pro.',
        description: 'Engineered with aerospace-grade titanium and powered by the ground-breaking A18 Pro silicon.',
        features: 'Aerospace-Grade Grade 5 Titanium\n48MP Fusion Camera with 5x Telephoto\nAction Button & Dynamic Island'
      },
      vi: {
        name: 'Aura Phone 16 Pro Max',
        tagline: 'Titanium. Siêu bền. Siêu nhẹ. Đẳng cấp Pro.',
        description: 'Chế tác từ chất liệu titanium chuẩn hàng không vũ trụ cùng sức mạnh vượt trội của chip A18 Pro.',
        features: 'Khung viền Titanium Cấp 5 siêu nhẹ\nCamera Fusion 48MP zoom quang 5x\nNút Tác Vụ thông minh & Dynamic Island'
      },
      ar: {
        name: 'أورا فون 16 برو',
        tagline: 'تيتانيوم. فائق القوة. فائق الخفة. احترافي للغاية.',
        description: 'مصمم بتيتانيوم فضاء ومزود بمعالج A18 Pro فائق القوة لتجربة رائدة.',
        features: 'تيتانيوم من الدرجة الخامسة\nكاميرا فيوجن بدقة 48 ميجابكسل مع تقريب 5x\nزر الإجراءات والجزيرة التفاعلية'
      }
    },
    variant: {
      sku: 'PHONE-PRO-256',
      color: 'Natural Titanium',
      storage: '256GB',
      stock: 40,
      price_usd: 1199.00,
      price_vnd: 29990000.00,
      price_sar: 4499.00
    }
  },
  {
    id: 'headphone',
    name: '🎧 Aura Sound Max',
    slug: 'aura-sound-max',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    translations: {
      en: {
        name: 'Aura Sound Max',
        tagline: 'High-Fidelity Audio. Pure Immersion.',
        description: 'An over-ear listening experience engineered with active noise cancellation and spatial acoustic theater.',
        features: 'Active Noise Cancellation with Transparency Mode\nPersonalized Spatial Audio with Head Tracking\nUltra-breathable knit mesh canopy'
      },
      vi: {
        name: 'Tai Nghe Aura Sound Max',
        tagline: 'Âm thanh độ phân giải cao. Đắm chìm hoàn mỹ.',
        description: 'Trải nghiệm chụp tai đỉnh cao với công nghệ chống ồn chủ động và rạp hát âm thanh không gian.',
        features: 'Chống Ồn Chủ Động & Chế độ Xuyên Âm\nÂm thanh không gian theo dõi chuyển động đầu\nQuai đeo đệm lưới thoáng khí êm ái'
      },
      ar: {
        name: 'سماعات أورا ساوند ماكس',
        tagline: 'صوت عالي الدقة. انغماس صوتي لا مثيل له.',
        description: 'تجربة استماع فريدة فوق الأذن مزودة بإلغاء الضوضاء النشط والصوت المكاني السينمائي.',
        features: 'ميزة إلغاء الضوضاء النشطة ونمط شفافية الصوت\nصوت مكاني مخصص مع تتبع حركات الرأس\nطوق رأس قماشي شبكي فائق الراحة'
      }
    },
    variant: {
      sku: 'HEADPHONE-MAX-SLV',
      color: 'Silver Mist',
      storage: 'Standard',
      stock: 25,
      price_usd: 549.00,
      price_vnd: 13990000.00,
      price_sar: 2099.00
    }
  },
  {
    id: 'watch',
    name: '⌚ Aura Watch Ultra',
    slug: 'aura-watch-ultra',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    translations: {
      en: {
        name: 'Aura Watch Ultra',
        tagline: 'Engineered for Extreme Adventures',
        description: 'Rugged titanium 49mm case with precision dual-frequency GPS and up to 72 hours of battery life.',
        features: '49mm Aerospace Titanium Case\nPrecision Dual-Frequency L1 & L5 GPS\n100m Water Resistance & Depth Gauge'
      },
      vi: {
        name: 'Đồng Hồ Aura Watch Ultra',
        tagline: 'Chế tác cho những cuộc phiêu lưu khắc nghiệt',
        description: 'Vỏ titanium 49mm bền bỉ, tích hợp GPS băng tần kép chuẩn xác và thời lượng pin ấn tượng lên đến 72 giờ.',
        features: 'Vỏ Titanium 49mm siêu cứng cáp\nGPS băng tần kép L1 và L5 siêu chính xác\nChống nước độ sâu 100m và đo độ sâu lặn'
      },
      ar: {
        name: 'ساعة أورا ووتش ألترا',
        tagline: 'مصممة للمغامرات الاستكشافية القاسية',
        description: 'هيكل تيتانيوم مقاس 49 مم مع نظام GPS ثنائي التردد فائق الدقة وعمر بطارية ممتد.',
        features: 'هيكل تيتانيوم فضاء مقاس 49 مم\nنظام GPS دقيق ثنائي التردد L1 وL5\nمقاومة الماء حتى عمق 100 متر ومقياس العمق'
      }
    },
    variant: {
      sku: 'WATCH-ULTRA-49',
      color: 'Titanium Raw',
      storage: 'Cellular',
      stock: 30,
      price_usd: 799.00,
      price_vnd: 20490000.00,
      price_sar: 2999.00
    }
  }
];

export default function AdminPage({ onBackToStore }) {
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [token, setToken] = useState(() => localStorage.getItem('aura_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@2026');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'

  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit / Create Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('vi'); // default to 'vi' for easy editing
  const [productForm, setProductForm] = useState({
    slug: '',
    images: ['https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop'],
    is_featured: false,
    translations: {
      en: { name: '', tagline: '', description: '', features: '' },
      vi: { name: '', tagline: '', description: '', features: '' },
      ar: { name: '', tagline: '', description: '', features: '' }
    },
    variant: {
      sku: '',
      color: '',
      storage: '',
      stock: 10,
      price_usd: 1299.00,
      price_vnd: 32500000.00,
      price_sar: 4870.00
    }
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, ordersRes, productsRes] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getOrders(),
        productApi.getProducts('en', 'USD')
      ]);
      setMetrics(metricsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminApi.login(username, password);
      const accToken = res.data.access_token;
      localStorage.setItem('aura_admin_token', accToken);
      setToken(accToken);
    } catch (err) {
      setLoginError(err.response?.data?.detail || 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_admin_token');
    setToken(null);
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setActiveLangTab('vi');
    setProductForm({
      slug: `product-${Date.now().toString().slice(-4)}`,
      images: ['https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop'],
      is_featured: false,
      translations: {
        en: { name: '', tagline: '', description: '', features: '8K Ultra Retina Display\nSpatial Audio with Dynamic Head Tracking' },
        vi: { name: '', tagline: '', description: '', features: 'Màn hình 8K Siêu võng mạc\nÂm thanh không gian theo dõi chuyển động đầu' },
        ar: { name: '', tagline: '', description: '', features: 'شاشة ريتينا بدقة 8K فائقة\nصوت مكاني مع تتبع ديناميكي للرأس' }
      },
      variant: {
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        color: 'Space Black',
        storage: '512GB',
        stock: 15,
        price_usd: 1299.00,
        price_vnd: 32500000.00,
        price_sar: 4870.00
      }
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (product) => {
    try {
      setLoading(true);
      const res = await adminApi.getProduct(product.id);
      const data = res.data;
      setEditingProduct(product);
      setActiveLangTab('vi');
      setProductForm({
        slug: data.slug,
        images: data.images && data.images.length > 0 ? data.images : [''],
        is_featured: data.is_featured || false,
        translations: data.translations,
        variant: data.variant
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Không thể tải chi tiết sản phẩm để chỉnh sửa.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Load a preset template in 1-click for non-tech users
  const handleApplyPreset = (preset) => {
    setProductForm({
      slug: `${preset.slug}-${Date.now().toString().slice(-3)}`,
      images: [preset.image],
      is_featured: true,
      translations: {
        en: { ...preset.translations.en },
        vi: { ...preset.translations.vi },
        ar: { ...preset.translations.ar }
      },
      variant: {
        ...preset.variant,
        sku: `${preset.variant.sku}-${Date.now().toString().slice(-3)}`
      }
    });
  };

  // Helper: Auto calculate VND and SAR from USD price
  const handleAutoCalcCurrency = () => {
    const usd = Number(productForm.variant.price_usd) || 1000;
    // Standard rates: 1 USD ~ 25,000 VND; 1 USD ~ 3.75 SAR
    const estimatedVnd = Math.round((usd * 25000) / 10000) * 10000;
    const estimatedSar = Math.round(usd * 3.75);
    setProductForm({
      ...productForm,
      variant: {
        ...productForm.variant,
        price_vnd: estimatedVnd,
        price_sar: estimatedSar
      }
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      slug: productForm.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      images: productForm.images,
      is_featured: productForm.is_featured,
      is_active: true,
      translations: [
        {
          language: 'en',
          name: productForm.translations.en.name || productForm.translations.vi.name || productForm.slug,
          tagline: productForm.translations.en.tagline,
          description: productForm.translations.en.description,
          features: productForm.translations.en.features.split('\n').filter(Boolean),
          specifications: { Category: 'Pro Flagship' }
        },
        {
          language: 'vi',
          name: productForm.translations.vi.name || productForm.translations.en.name || productForm.slug,
          tagline: productForm.translations.vi.tagline,
          description: productForm.translations.vi.description,
          features: productForm.translations.vi.features.split('\n').filter(Boolean),
          specifications: { "Phân loại": 'Flagship Cao Cấp' }
        },
        {
          language: 'ar',
          name: productForm.translations.ar.name || productForm.translations.en.name || productForm.slug,
          tagline: productForm.translations.ar.tagline,
          description: productForm.translations.ar.description,
          features: productForm.translations.ar.features.split('\n').filter(Boolean),
          specifications: { "الفئة": 'الفئة الرائدة' }
        }
      ],
      variants: [
        {
          sku: productForm.variant.sku,
          attributes: { color: productForm.variant.color, storage: productForm.variant.storage },
          stock_quantity: Number(productForm.variant.stock),
          prices: [
            { currency: 'USD', price: Number(productForm.variant.price_usd) },
            { currency: 'VND', price: Number(productForm.variant.price_vnd) },
            { currency: 'SAR', price: Number(productForm.variant.price_sar) }
          ]
        }
      ]
    };

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setIsModalOpen(false);
      fetchDashboardData();
      alert('✅ Tạo sản phẩm thành công! Sản phẩm đã xuất hiện trên trang chủ.');
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi website?')) return;
    try {
      await adminApi.deleteProduct(id);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể xóa');
    }
  };

  // If not logged in, render Apple-styled Admin Login screen
  if (!token) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center bg-black text-[#f5f5f7]">
        <div className="w-full max-w-md rounded-[32px] bg-[#161617] p-8 sm:p-10 border border-[#2d2d30] shadow-2xl space-y-6 apple-animate-in">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#1d1d1f] border border-[#333336] flex items-center justify-center text-[#2997ff] mx-auto shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{t('admin.login_title')}</h2>
              <p className="text-xs text-[#86868b] mt-1">Cổng Quản Trị & Đăng Sản Phẩm Mới</p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1a6] mb-2">{t('admin.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-sm focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a1a1a6] mb-2">{t('admin.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-sm focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all"
              />
            </div>

            <button
              type="submit"
              className="apple-btn-blue w-full py-3.5 text-sm font-semibold tracking-normal cursor-pointer mt-2"
            >
              {t('admin.login_button')}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onBackToStore}
              className="text-xs text-[#86868b] hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              <span>Quay lại Cửa Hàng (Storefront)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main View (Apple Style)
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-black text-[#f5f5f7]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[28px] bg-[#161617] p-6 border border-[#2d2d30]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1d1d1f] border border-[#333336] flex items-center justify-center text-[#2997ff]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{t('admin.title')}</h1>
              <span className="text-xs text-[#86868b]">Quản Lý Doanh Thu, Đơn Hàng & Danh Mục Sản Phẩm</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="apple-btn-secondary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              <span>Xem Trang Chủ</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('admin.logout')}</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards in Apple Bento Grid */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="rounded-[24px] bg-[#161617] p-6 border border-[#2d2d30] space-y-3">
              <div className="flex items-center justify-between text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <span>Doanh thu Quốc tế (USD)</span>
                <DollarSign className="w-4 h-4 text-[#2997ff]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {formatPrice(metrics.revenue_by_currency?.USD || 0, 'USD')}
              </div>
              <div className="text-[11px] text-[#86868b]">Qua cổng Stripe Checkout</div>
            </div>

            <div className="rounded-[24px] bg-[#161617] p-6 border border-[#2d2d30] space-y-3">
              <div className="flex items-center justify-between text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <span>Doanh thu Việt Nam (VND)</span>
                <DollarSign className="w-4 h-4 text-[#30d158]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {formatPrice(metrics.revenue_by_currency?.VND || 0, 'VND')}
              </div>
              <div className="text-[11px] text-[#86868b]">Qua chuyển khoản VietQR Napas 24/7</div>
            </div>

            <div className="rounded-[24px] bg-[#161617] p-6 border border-[#2d2d30] space-y-3">
              <div className="flex items-center justify-between text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <span>Doanh thu Trung Đông (SAR)</span>
                <DollarSign className="w-4 h-4 text-[#f5a623]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {formatPrice(metrics.revenue_by_currency?.SAR || 0, 'SAR')}
              </div>
              <div className="text-[11px] text-[#86868b]">Đơn vị tiền tệ Saudi Riyal</div>
            </div>

            <div className="rounded-[24px] bg-[#161617] p-6 border border-[#2d2d30] space-y-3">
              <div className="flex items-center justify-between text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <span>Đơn hàng & Tồn kho</span>
                <ShoppingCart className="w-4 h-4 text-[#2997ff]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {metrics.paid_orders} <span className="text-xs text-[#86868b] font-normal">/ {metrics.total_orders} đơn đã mua</span>
              </div>
              <div className="text-[11px] text-[#30d158] font-medium">
                {metrics.total_stock} sản phẩm sẵn sàng giao
              </div>
            </div>

          </div>
        )}

        {/* Tab Controls (Apple Segmented Picker style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-full bg-[#1c1c1e] border border-[#2c2c2e]">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#0071e3] text-white shadow-md'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              {t('admin.products_tab')}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#0071e3] text-white shadow-md'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              {t('admin.orders_tab')} ({orders.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleOpenCreateModal}
              className="apple-btn-blue px-5 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Sản Phẩm Mới (Non-Tech Friendly)</span>
            </button>
          )}
        </div>

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className="rounded-[28px] bg-[#161617] border border-[#2d2d30] overflow-hidden">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#1d1d1f] border-b border-[#2c2c2e] text-[#86868b] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 text-start">Ảnh</th>
                  <th className="py-3.5 px-6 text-start">Tên Sản Phẩm</th>
                  <th className="py-3.5 px-6 text-start">Mã URL (Slug)</th>
                  <th className="py-3.5 px-6 text-start">Tồn Kho</th>
                  <th className="py-3.5 px-6 text-start">Giá (USD)</th>
                  <th className="py-3.5 px-6 text-end">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262629]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1d1d1f]/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#333336]"
                      />
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-white text-sm">{p.name}</td>
                    <td className="py-3.5 px-6 font-mono text-[#86868b]">{p.slug}</td>
                    <td className="py-3.5 px-6 font-mono font-medium text-[#2997ff]">{p.total_stock} cái</td>
                    <td className="py-3.5 px-6 font-semibold text-[#f5f5f7]">{formatPrice(p.price, 'USD')}</td>
                    <td className="py-3.5 px-6 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-full bg-[#0071e3]/10 text-[#2997ff] hover:bg-[#0071e3]/20 transition-all cursor-pointer"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="rounded-[28px] bg-[#161617] border border-[#2d2d30] overflow-hidden">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#1d1d1f] border-b border-[#2c2c2e] text-[#86868b] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 text-start">Mã Đơn</th>
                  <th className="py-3.5 px-6 text-start">Khách Hàng</th>
                  <th className="py-3.5 px-6 text-start">Cổng Thanh Toán</th>
                  <th className="py-3.5 px-6 text-start">Số Tiền</th>
                  <th className="py-3.5 px-6 text-start">Trạng Thái</th>
                  <th className="py-3.5 px-6 text-start">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262629]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#86868b]">
                      Chưa có đơn hàng nào từ khách hàng.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#1d1d1f]/50 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-[#2997ff]">{o.id}</td>
                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-white">{o.customer_name}</div>
                        <div className="text-[11px] text-[#86868b]">{o.customer_phone}</div>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs text-[#a1a1a6]">{o.payment_method}</td>
                      <td className="py-3.5 px-6 font-semibold text-white">
                        {formatPrice(o.amount, o.currency)}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.payment_status === 'PAID'
                            ? 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-[#86868b] text-[11px]">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Product Creation Modal (Apple Sheet Style - Ultra Friendly for Non-Tech Users) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[32px] bg-[#161617] p-6 sm:p-8 border border-[#2d2d30] shadow-2xl text-start apple-animate-in max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1d1d1f] hover:bg-[#2c2c2e] text-[#86868b] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-white">
                {editingProduct ? `Chỉnh Sửa Sản Phẩm: ${editingProduct.name}` : 'Tạo Sản Phẩm Mới Để Giới Thiệu'}
              </h3>
              <p className="text-xs text-[#86868b] mt-1">
                {editingProduct
                  ? 'Thay đổi giá cả, hình ảnh, thông số kỹ thuật và nội dung bài viết 3 ngôn ngữ.'
                  : 'Dành cho người quản lý: Điền thông tin sản phẩm hoặc chọn mẫu có sẵn để xuất bản ngay lên website.'}
              </p>
            </div>

            {/* Quick 1-Click Preset Template Bar (Only when creating new product) */}
            {!editingProduct && (
              <div className="mb-6 p-4 rounded-2xl bg-[#1d1d1f] border border-[#2c2c2e] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2997ff]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hoặc chọn nhanh 1 mẫu sản phẩm có sẵn (1-Click Fill):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TEMPLATES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-3 py-1.5 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-xs text-[#f5f5f7] border border-[#424245] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Fields with Live Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">
                      Mã Đường Dẫn (Slug - Tự động viết thường, không dấu) *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.slug}
                      placeholder="vd: iphone-16-pro"
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">
                      Đường Dẫn Hình Ảnh (Image URL)
                    </label>
                    <input
                      type="text"
                      value={productForm.images[0] || ''}
                      placeholder="Dán link ảnh tại đây (Unsplash, Imgur...)"
                      onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>
                </div>

                {/* Live Image Preview */}
                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#1c1c1e] border border-[#333336] h-full min-h-[110px]">
                  {productForm.images[0] ? (
                    <img
                      src={productForm.images[0]}
                      alt="Preview"
                      className="w-24 h-24 rounded-xl object-cover shadow-md"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="text-center text-[#86868b] text-[11px] space-y-1">
                      <ImageIcon className="w-6 h-6 mx-auto opacity-50" />
                      <span>Xem trước ảnh</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-language Tabs (English, Vietnamese, Arabic) */}
              <div className="border border-[#2d2d30] rounded-2xl p-4 bg-[#1d1d1f]/60 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
                  <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                    Nội Dung 3 Ngôn Ngữ:
                  </span>
                  <div className="flex gap-1.5">
                    {['vi', 'en', 'ar'].map((langCode) => (
                      <button
                        type="button"
                        key={langCode}
                        onClick={() => setActiveLangTab(langCode)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          activeLangTab === langCode
                            ? 'bg-[#0071e3] text-white shadow'
                            : 'text-[#86868b] hover:text-white'
                        }`}
                      >
                        {langCode === 'vi' ? '🇻🇳 Tiếng Việt' : langCode === 'en' ? '🇺🇸 English' : '🇸🇦 العربية (RTL)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Language Inputs */}
                <div className="space-y-3" dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}>
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">
                      Tên Sản Phẩm ({activeLangTab.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      required={activeLangTab === 'vi' || activeLangTab === 'en'}
                      value={productForm.translations[activeLangTab].name}
                      placeholder={activeLangTab === 'vi' ? "vd: Aura Vision Pro Max" : "e.g. Aura Vision Pro"}
                      onChange={(e) => {
                        const newName = e.target.value;
                        const updated = {
                          ...productForm,
                          translations: {
                            ...productForm.translations,
                            [activeLangTab]: { ...productForm.translations[activeLangTab], name: newName }
                          }
                        };
                        // Auto-fill slug if currently empty
                        if (!productForm.slug || productForm.slug.startsWith('product-')) {
                          updated.slug = newName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        }
                        setProductForm(updated);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">
                      Câu Slogan / Giới Thiệu Ngắn ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={productForm.translations[activeLangTab].tagline}
                      placeholder="vd: Kỷ nguyên mới của điện toán không gian"
                      onChange={(e) => setProductForm({
                        ...productForm,
                        translations: {
                          ...productForm.translations,
                          [activeLangTab]: { ...productForm.translations[activeLangTab], tagline: e.target.value }
                        }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">
                      Các Điểm Nổi Bật (Mỗi dòng 1 tính năng để hiển thị dạng Bento Box)
                    </label>
                    <textarea
                      rows={2}
                      value={productForm.translations[activeLangTab].features}
                      placeholder="Màn hình 8K Siêu võng mạc&#10;Âm thanh không gian đỉnh cao"
                      onChange={(e) => setProductForm({
                        ...productForm,
                        translations: {
                          ...productForm.translations,
                          [activeLangTab]: { ...productForm.translations[activeLangTab], features: e.target.value }
                        }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Regional Pricing & Variant Inputs */}
              <div className="border border-[#2d2d30] rounded-2xl p-4 bg-[#1d1d1f]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider">
                    Cấu Hình & Giá Niêm Yết Theo Từng Quốc Gia
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoCalcCurrency}
                    className="text-[11px] text-[#2997ff] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    title="Tự động tính VND và SAR dựa theo giá USD"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Tự quy đổi từ USD</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">Mã SKU</label>
                    <input
                      type="text"
                      value={productForm.variant.sku}
                      placeholder="SKU-001"
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, sku: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">Màu Sắc</label>
                    <input
                      type="text"
                      value={productForm.variant.color}
                      placeholder="Space Black"
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, color: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">Số Lượng Kho</label>
                    <input
                      type="number"
                      value={productForm.variant.stock}
                      placeholder="10"
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, stock: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs"
                    />
                  </div>
                </div>

                {/* 3 Regional Currencies */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-[#2997ff] font-semibold mb-1">🇺🇸 Giá USD ($)</label>
                    <input
                      type="number"
                      value={productForm.variant.price_usd}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, price_usd: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#2997ff]/40 text-[#2997ff] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#30d158] font-semibold mb-1">🇻🇳 Giá VND (₫)</label>
                    <input
                      type="number"
                      value={productForm.variant.price_vnd}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, price_vnd: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#30d158]/40 text-[#30d158] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#f5a623] font-semibold mb-1">🇸🇦 Giá SAR (﷼)</label>
                    <input
                      type="number"
                      value={productForm.variant.price_sar}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, price_sar: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#f5a623]/40 text-[#f5a623] text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2c2c2e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="apple-btn-secondary px-5 py-2.5 text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="apple-btn-blue px-7 py-2.5 text-xs font-semibold cursor-pointer shadow-lg"
                >
                  {editingProduct ? 'Lưu Thay Đổi Sản Phẩm' : 'Xuất Bản Sản Phẩm Ngay'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
