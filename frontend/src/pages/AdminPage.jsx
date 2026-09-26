import React, { useState, useEffect } from 'react';
import { adminApi, productApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { 
  Shield, Key, LogOut, DollarSign, Package, ShoppingCart, 
  Plus, Edit, Trash2, CheckCircle2, Clock, X, Save, ArrowLeft, RefreshCw
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
        en: { name: '', tagline: '', description: '', features: '8K Display\nSpatial Audio' },
        vi: { name: '', tagline: '', description: '', features: 'Màn hình 8K\nÂm thanh không gian' },
        ar: { name: '', tagline: '', description: '', features: 'شاشة 8K\nصوت مكاني' }
      },
      variant: {
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        color: 'Titanium Gray',
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
          specifications: { Category: 'Luxury Spatial' }
        },
        {
          language: 'vi',
          name: productForm.translations.vi.name || productForm.translations.en.name || productForm.slug,
          tagline: productForm.translations.vi.tagline,
          description: productForm.translations.vi.description,
          features: productForm.translations.vi.features.split('\n').filter(Boolean),
          specifications: { "Phân loại": 'Điện toán không gian' }
        },
        {
          language: 'ar',
          name: productForm.translations.ar.name || productForm.translations.en.name || productForm.slug,
          tagline: productForm.translations.ar.tagline,
          description: productForm.translations.ar.description,
          features: productForm.translations.ar.features.split('\n').filter(Boolean),
          specifications: { "الفئة": 'الحوسبة المكانية' }
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

  // If not logged in, render Admin Login screen
  if (!token) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center bg-grid">
        <div className="w-full max-w-md glass-panel p-8 sm:p-10 border-white/20 shadow-2xl space-y-6 animate-modal">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white">{t('admin.login_title')}</h2>
            <p className="text-xs text-slate-400">Restricted portal for showcase management</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('admin.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('admin.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-sm shadow-xl transition-all"
            >
              {t('admin.login_button')}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onBackToStore}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main View
  return (
    <div className="min-h-screen py-10 px-4 lg:px-8 bg-grid">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-6 border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('admin.title')}</h1>
              <span className="text-xs text-slate-400 font-mono">Logged in as Administrator</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('admin.logout')}</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-5 border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Revenue (USD)</span>
                <DollarSign className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatPrice(metrics.revenue_by_currency?.USD || 0, 'USD')}
              </div>
            </div>

            <div className="glass-panel p-5 border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Revenue (VND)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatPrice(metrics.revenue_by_currency?.VND || 0, 'VND')}
              </div>
            </div>

            <div className="glass-panel p-5 border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Revenue (SAR)</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatPrice(metrics.revenue_by_currency?.SAR || 0, 'SAR')}
              </div>
            </div>

            <div className="glass-panel p-5 border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Orders & Inventory</span>
                <ShoppingCart className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {metrics.paid_orders} <span className="text-xs text-slate-400 font-normal">/ {metrics.total_orders} orders</span>
              </div>
              <div className="text-[11px] text-cyan-400">
                {metrics.total_stock} items total in stock
              </div>
            </div>

          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('admin.products_tab')}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('admin.orders_tab')} ({orders.length})
          </button>
        </div>

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Showcase Catalog</h2>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin.add_product')}</span>
              </button>
            </div>

            <div className="glass-panel overflow-hidden border-white/10">
              <table className="w-full text-start text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-start">Image</th>
                    <th className="py-3 px-4 text-start">Product Name</th>
                    <th className="py-3 px-4 text-start">Slug</th>
                    <th className="py-3 px-4 text-start">Stock</th>
                    <th className="py-3 px-4 text-start">Price (USD)</th>
                    <th className="py-3 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{p.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{p.slug}</td>
                      <td className="py-3 px-4 font-mono text-cyan-300">{p.total_stock}</td>
                      <td className="py-3 px-4 font-bold text-slate-200">{formatPrice(p.price, 'USD')}</td>
                      <td className="py-3 px-4 text-end">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="glass-panel overflow-hidden border-white/10">
            <table className="w-full text-start text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-start">Order ID</th>
                  <th className="py-3 px-4 text-start">Customer</th>
                  <th className="py-3 px-4 text-start">Gateway</th>
                  <th className="py-3 px-4 text-start">Amount</th>
                  <th className="py-3 px-4 text-start">Status</th>
                  <th className="py-3 px-4 text-start">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-300">{o.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{o.customer_name}</div>
                        <div className="text-[11px] text-slate-400">{o.customer_phone}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">{o.payment_method}</td>
                      <td className="py-3 px-4 font-bold text-white">
                        {formatPrice(o.amount, o.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.payment_status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
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

      {/* Product Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 border-white/20 shadow-2xl text-start animate-modal max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              Create New Showcase Product
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Product Slug *</label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={productForm.images[0] || ''}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Multi-language Tabs */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02] space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase mr-2">Translations:</span>
                  {['en', 'vi', 'ar'].map((langCode) => (
                    <button
                      type="button"
                      key={langCode}
                      onClick={() => setActiveLangTab(langCode)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                        activeLangTab === langCode
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {langCode === 'en' ? '🇺🇸 English' : langCode === 'vi' ? '🇻🇳 Tiếng Việt' : '🇸🇦 العربية (RTL)'}
                    </button>
                  ))}
                </div>

                {/* Active Language Inputs */}
                <div className="space-y-3" dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Product Name ({activeLangTab.toUpperCase()}) *</label>
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
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Tagline ({activeLangTab.toUpperCase()})</label>
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
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={productForm.translations[activeLangTab].description}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        translations: {
                          ...productForm.translations,
                          [activeLangTab]: { ...productForm.translations[activeLangTab], description: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Regional Pricing & Variant Inputs */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02] space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase">
                  Default Variant & Regional Fixed Pricing
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">SKU</label>
                    <input
                      type="text"
                      value={productForm.variant.sku}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, sku: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Color</label>
                    <input
                      type="text"
                      value={productForm.variant.color}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, color: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Stock</label>
                    <input
                      type="number"
                      value={productForm.variant.stock}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, stock: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-cyan-300 font-bold mb-1">USD ($)</label>
                    <input
                      type="number"
                      value={productForm.variant.price_usd}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, price_usd: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-emerald-300 font-bold mb-1">VND (₫)</label>
                    <input
                      type="number"
                      value={productForm.variant.price_vnd}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, price_vnd: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-amber-300 font-bold mb-1">SAR (﷼)</label>
                    <input
                      type="number"
                      value={productForm.variant.price_sar}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        variant: { ...productForm.variant, price_sar: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/40 text-amber-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-extrabold shadow-lg"
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
