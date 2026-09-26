import React, { useState, useEffect } from 'react';
import { adminApi, productApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { 
  Shield, Key, LogOut, DollarSign, Package, ShoppingCart, 
  Plus, Edit, Trash2, CheckCircle2, Clock, X, Save, ArrowLeft, RefreshCw, Layers
} from 'lucide-react';

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
  const [activeLangTab, setActiveLangTab] = useState('en'); // 'en' | 'vi' | 'ar'
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
      setLoginError(err.response?.data?.detail || 'Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_admin_token');
    setToken(null);
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      slug: `product-${Date.now().toString().slice(-4)}`,
      images: ['https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop'],
      is_featured: false,
      translations: {
        en: { name: '', tagline: '', description: '', features: '8K Ultra Retina\nSpatial Audio with Dynamic Head Tracking' },
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

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      slug: productForm.slug,
      images: productForm.images,
      is_featured: productForm.is_featured,
      is_active: true,
      translations: [
        {
          language: 'en',
          name: productForm.translations.en.name || productForm.slug,
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
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete');
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
              <p className="text-xs text-[#86868b] mt-1">Sign in with Administrator credentials</p>
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
              <span>Back to Storefront</span>
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
              <span className="text-xs text-[#86868b]">Control Center & Inventory Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="apple-btn-secondary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              <span>View Storefront</span>
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
                <span>Revenue (USD)</span>
                <DollarSign className="w-4 h-4 text-[#2997ff]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {formatPrice(metrics.revenue_by_currency?.USD || 0, 'USD')}
              </div>
              <div className="text-[11px] text-[#86868b]">Global Stripe settlement</div>
            </div>

            <div className="rounded-[24px] bg-[#161617] p-6 border border-[#2d2d30] space-y-3">
              <div className="flex items-center justify-between text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <span>Revenue (VND)</span>
                <DollarSign className="w-4 h-4 text-[#30d158]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {formatPrice(metrics.revenue_by_currency?.VND || 0, 'VND')}
              </div>
              <div className="text-[11px] text-[#86868b]">Napas 24/7 VietQR gateway</div>
            </div>

            <div className="rounded-[24px] bg-[#161617] p-6 border border-[#2d2d30] space-y-3">
              <div className="flex items-center justify-between text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <span>Revenue (SAR)</span>
                <DollarSign className="w-4 h-4 text-[#f5a623]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {formatPrice(metrics.revenue_by_currency?.SAR || 0, 'SAR')}
              </div>
              <div className="text-[11px] text-[#86868b]">Middle East regional settlement</div>
            </div>

            <div className="rounded-[24px] bg-[#161617] p-6 border border-[#2d2d30] space-y-3">
              <div className="flex items-center justify-between text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <span>Orders & Inventory</span>
                <ShoppingCart className="w-4 h-4 text-[#2997ff]" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                {metrics.paid_orders} <span className="text-xs text-[#86868b] font-normal">/ {metrics.total_orders} total</span>
              </div>
              <div className="text-[11px] text-[#30d158] font-medium">
                {metrics.total_stock} units currently in stock
              </div>
            </div>

          </div>
        )}

        {/* Tab Controls (Apple Segmented Picker style) */}
        <div className="flex items-center justify-between gap-4">
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
              className="apple-btn-blue px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('admin.add_product')}</span>
            </button>
          )}
        </div>

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className="rounded-[28px] bg-[#161617] border border-[#2d2d30] overflow-hidden">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#1d1d1f] border-b border-[#2c2c2e] text-[#86868b] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 text-start">Image</th>
                  <th className="py-3.5 px-6 text-start">Product</th>
                  <th className="py-3.5 px-6 text-start">Slug</th>
                  <th className="py-3.5 px-6 text-start">Stock</th>
                  <th className="py-3.5 px-6 text-start">Price (USD)</th>
                  <th className="py-3.5 px-6 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262629]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1d1d1f]/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-11 h-11 rounded-xl object-cover border border-[#333336]"
                      />
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-white">{p.name}</td>
                    <td className="py-3.5 px-6 font-mono text-[#86868b]">{p.slug}</td>
                    <td className="py-3.5 px-6 font-mono font-medium text-[#2997ff]">{p.total_stock}</td>
                    <td className="py-3.5 px-6 font-semibold text-[#f5f5f7]">{formatPrice(p.price, 'USD')}</td>
                    <td className="py-3.5 px-6 text-end">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                  <th className="py-3.5 px-6 text-start">Order ID</th>
                  <th className="py-3.5 px-6 text-start">Customer</th>
                  <th className="py-3.5 px-6 text-start">Gateway</th>
                  <th className="py-3.5 px-6 text-start">Amount</th>
                  <th className="py-3.5 px-6 text-start">Status</th>
                  <th className="py-3.5 px-6 text-start">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262629]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#86868b]">
                      No customer orders recorded yet.
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

      {/* Product Creation Modal (Apple Sheet Style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[32px] bg-[#161617] p-6 sm:p-8 border border-[#2d2d30] shadow-2xl text-start apple-animate-in max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1d1d1f] hover:bg-[#2c2c2e] text-[#86868b] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold tracking-tight text-white mb-6">
              Create New Product
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">Product Slug *</label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">Image URL</label>
                  <input
                    type="text"
                    value={productForm.images[0] || ''}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              {/* Multi-language Tabs */}
              <div className="border border-[#2d2d30] rounded-2xl p-4 bg-[#1d1d1f]/60 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#2c2c2e] pb-3">
                  <span className="text-xs font-semibold text-[#86868b] uppercase mr-2">Translations:</span>
                  {['en', 'vi', 'ar'].map((langCode) => (
                    <button
                      type="button"
                      key={langCode}
                      onClick={() => setActiveLangTab(langCode)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeLangTab === langCode
                          ? 'bg-[#0071e3] text-white'
                          : 'text-[#86868b] hover:text-white'
                      }`}
                    >
                      {langCode === 'en' ? '🇺🇸 English' : langCode === 'vi' ? '🇻🇳 Tiếng Việt' : '🇸🇦 العربية (RTL)'}
                    </button>
                  ))}
                </div>

                {/* Active Language Inputs */}
                <div className="space-y-3" dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}>
                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">Product Name ({activeLangTab.toUpperCase()}) *</label>
                    <input
                      type="text"
                      required={activeLangTab === 'en'}
                      value={productForm.translations[activeLangTab].name}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        translations: {
                          ...productForm.translations,
                          [activeLangTab]: { ...productForm.translations[activeLangTab], name: e.target.value }
                        }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">Tagline ({activeLangTab.toUpperCase()})</label>
                    <input
                      type="text"
                      value={productForm.translations[activeLangTab].tagline}
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
                    <label className="block text-xs font-semibold text-[#a1a1a6] mb-1.5">Key Highlights (1 per line)</label>
                    <textarea
                      rows={2}
                      value={productForm.translations[activeLangTab].features}
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
                <div className="text-xs font-semibold text-white uppercase tracking-wider">
                  Default Variant & Regional Fixed Pricing
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">SKU</label>
                    <input
                      type="text"
                      value={productForm.variant.sku}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, sku: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">Color</label>
                    <input
                      type="text"
                      value={productForm.variant.color}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, color: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#86868b] mb-1">Stock</label>
                    <input
                      type="number"
                      value={productForm.variant.stock}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, stock: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-[#2997ff] font-semibold mb-1">USD ($)</label>
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
                    <label className="block text-xs text-[#30d158] font-semibold mb-1">VND (₫)</label>
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
                    <label className="block text-xs text-[#f5a623] font-semibold mb-1">SAR (﷼)</label>
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
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="apple-btn-blue px-6 py-2.5 text-xs cursor-pointer"
                >
                  {t('admin.save')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
