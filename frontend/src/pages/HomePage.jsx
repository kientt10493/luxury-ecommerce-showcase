import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { productApi, adminApi } from '../services/api';
import Navbar from '../components/navbar/Navbar';
import HeroShowcase from '../components/showcase/HeroShowcase';
import VariantPicker from '../components/showcase/VariantPicker';
import BentoFeatures from '../components/showcase/BentoFeatures';
import TechSpecs from '../components/showcase/TechSpecs';
import QuickBuyModal from '../components/checkout/QuickBuyModal';
import VietQRModal from '../components/checkout/VietQRModal';
import LiveEditorBar from '../components/navbar/LiveEditorBar';
import { Loader2, Shield, X, Key } from 'lucide-react';

export default function HomePage({ onNavigateAdmin, onOrderSuccess }) {
  const { language, t } = useLanguage();
  const { currency, formatPrice } = useCurrency();

  const [products, setProducts] = useState([]);
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Edit Mode state (Word-style in-place editing)
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('Admin@2026');
  const [authError, setAuthError] = useState('');

  // Modals state
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutVariant, setCheckoutVariant] = useState(null);
  const [vietQRData, setVietQRData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    productApi.getProducts(language, currency)
      .then((res) => {
        if (!isMounted) return;
        setProducts(res.data);
        if (res.data.length > 0) {
          const targetId = activeProductId || res.data[0].id;
          if (!activeProductId) {
            setActiveProductId(targetId);
          }
          return productApi.getProductDetail(targetId, language, currency);
        }
      })
      .then((detailRes) => {
        if (!isMounted) return;
        if (detailRes && detailRes.data) {
          setActiveProduct(detailRes.data);
          if (detailRes.data.variants && detailRes.data.variants.length > 0) {
            setSelectedVariant(detailRes.data.variants[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeProductId, language, currency]);

  const handleSelectProduct = (prod) => {
    setActiveProductId(prod.id);
    setHasChanges(false);
  };

  // Toggle Live Edit
  const handleToggleLiveEdit = () => {
    if (isEditMode) {
      setIsEditMode(false);
      return;
    }
    const token = localStorage.getItem('aura_admin_token');
    if (!token) {
      setShowAuthModal(true);
    } else {
      setIsEditMode(true);
    }
  };

  const handleQuickAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await adminApi.login(adminUsername, adminPassword);
      localStorage.setItem('aura_admin_token', res.data.access_token);
      setShowAuthModal(false);
      setIsEditMode(true);
    } catch (err) {
      setAuthError('Mật khẩu không chính xác. Vui lòng thử lại.');
    }
  };

  // In-place text field update
  const handleUpdateField = (field, value) => {
    if (!activeProduct) return;
    setActiveProduct((prev) => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // In-place feature highlight update
  const handleUpdateFeature = (index, value) => {
    if (!activeProduct) return;
    const currentFeatures = [...(activeProduct.features || [])];
    while (currentFeatures.length <= index) {
      currentFeatures.push('');
    }
    currentFeatures[index] = value;
    setActiveProduct((prev) => ({
      ...prev,
      features: currentFeatures
    }));
    setHasChanges(true);
  };

  // Save changes live to backend
  const handleSaveLive = async () => {
    if (!activeProduct) return;
    setIsSaving(true);
    try {
      const res = await adminApi.getProduct(activeProduct.id);
      const fullData = res.data;

      const updatedTranslations = {
        ...fullData.translations,
        [language]: {
          name: activeProduct.name,
          tagline: activeProduct.tagline,
          description: activeProduct.description,
          features: (activeProduct.features || []).join('\n')
        }
      };

      const payload = {
        slug: fullData.slug,
        images: fullData.images,
        is_featured: fullData.is_featured,
        is_active: true,
        translations: ['en', 'vi', 'ar'].map((langKey) => ({
          language: langKey,
          name: updatedTranslations[langKey]?.name || fullData.slug,
          tagline: updatedTranslations[langKey]?.tagline || '',
          description: updatedTranslations[langKey]?.description || '',
          features: typeof updatedTranslations[langKey]?.features === 'string'
            ? updatedTranslations[langKey]?.features.split('\n').filter(Boolean)
            : (updatedTranslations[langKey]?.features || []),
          specifications: fullData.specifications || {}
        })),
        variants: [
          {
            sku: fullData.variant.sku,
            attributes: { color: fullData.variant.color, storage: fullData.variant.storage },
            stock_quantity: Number(fullData.variant.stock),
            prices: [
              { currency: 'USD', price: Number(fullData.variant.price_usd) },
              { currency: 'VND', price: Number(fullData.variant.price_vnd) },
              { currency: 'SAR', price: Number(fullData.variant.price_sar) }
            ]
          }
        ]
      };

      await adminApi.updateProduct(activeProduct.id, payload);
      setHasChanges(false);
      alert('✅ Đã lưu trực tiếp nội dung thành công lên website!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Không thể lưu thay đổi trực tiếp. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (activeProductId) {
      setLoading(true);
      productApi.getProductDetail(activeProductId, language, currency)
        .then((res) => {
          setActiveProduct(res.data);
          setHasChanges(false);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleOpenQuickBuy = (productToBuy = null, variantToBuy = null) => {
    const prod = productToBuy || activeProduct;
    const v = variantToBuy || selectedVariant || (prod?.variants?.[0]);
    setCheckoutProduct(prod);
    setCheckoutVariant(v);
    setQuickBuyOpen(true);
  };

  const handleLaunchVietQR = (qrPaymentData) => {
    setQuickBuyOpen(false);
    setVietQRData(qrPaymentData);
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      
      {/* Apple Double Navigation (Global 44px + Subnav 52px) */}
      <Navbar
        productName={activeProduct?.name || "Aura Vision Pro"}
        productPrice={activeProduct ? formatPrice(activeProduct.price) : ""}
        onOpenQuickBuy={() => handleOpenQuickBuy()}
        onNavigateAdmin={onNavigateAdmin}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        isCurrentAdmin={false}
        onToggleLiveEdit={handleToggleLiveEdit}
        isLiveEditActive={isEditMode}
      />

      {loading && !activeProduct ? (
        <div className="h-[75vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#0071e3]" />
          <span className="text-xs text-[#86868b] tracking-wider">
            Loading {t('nav.brand')} Storefront...
          </span>
        </div>
      ) : (
        <main>
          {/* Hero Section */}
          <HeroShowcase
            product={activeProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onQuickBuy={(p) => handleOpenQuickBuy(p)}
            isEditMode={isEditMode}
            onUpdateField={handleUpdateField}
          />

          {/* Apple Store Configurator Section */}
          {activeProduct && (
            <VariantPicker
              product={activeProduct}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              onBuyNow={(p, v) => handleOpenQuickBuy(p, v)}
            />
          )}

          {/* Apple Bento Highlights with Live Edit */}
          {activeProduct && (
            <BentoFeatures 
              product={activeProduct} 
              isEditMode={isEditMode}
              onUpdateFeature={handleUpdateFeature}
              onUpdateField={handleUpdateField}
            />
          )}

          {/* Apple Tech Specs */}
          {activeProduct && (
            <TechSpecs product={activeProduct} />
          )}
        </main>
      )}

      {/* Floating Apple Live Editor Dock */}
      <LiveEditorBar
        isEditMode={isEditMode}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSaveLive}
        onReset={handleReset}
        onExit={() => setIsEditMode(false)}
      />

      {/* Apple Iconic Footer */}
      <footer className="border-t border-[#1d1d1f] bg-[#0b0b0c] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#6e6e73]">
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="border-b border-[#1d1d1f] pb-4 leading-relaxed font-light">
            1. Trade‑in values will vary based on the condition, year, and configuration of your eligible trade‑in device. Not all devices are eligible for credit. Prices quoted are inclusive of local taxes where applicable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              Copyright © 2026 AURA Inc. All rights reserved.
            </div>

            <div className="flex items-center gap-4 text-[#86868b]">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:underline">Terms of Use</a>
              <span>|</span>
              <a href="#" className="hover:underline">Sales Policy</a>
              <span>|</span>
              <a href="#" className="hover:underline">Legal</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Admin Auth Dialog for Live Edit */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-[28px] bg-[#161617] p-7 border border-[#2d2d30] shadow-2xl text-start apple-animate-in space-y-5">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/30 flex items-center justify-center text-[#2997ff]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Xác Thực Quản Trị</h3>
                <p className="text-[11px] text-[#86868b]">Mở quyền sửa văn bản trực tiếp như Word</p>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleQuickAuth} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#a1a1a6] mb-1">Tài khoản</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#a1a1a6] mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <button
                type="submit"
                className="apple-btn-blue w-full py-2.5 text-xs font-semibold cursor-pointer shadow-lg mt-2"
              >
                Kích Hoạt Chế Độ Sửa Ngay
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {quickBuyOpen && checkoutProduct && checkoutVariant && (
        <QuickBuyModal
          product={checkoutProduct}
          variant={checkoutVariant}
          onClose={() => setQuickBuyOpen(false)}
          onLaunchVietQR={handleLaunchVietQR}
          onOrderSuccess={(orderId) => {
            setQuickBuyOpen(false);
            onOrderSuccess(orderId);
          }}
        />
      )}

      {/* VietQR Live Modal */}
      {vietQRData && (
        <VietQRModal
          paymentData={vietQRData}
          onClose={() => setVietQRData(null)}
          onPaymentSuccess={(orderId) => {
            setVietQRData(null);
            onOrderSuccess(orderId);
          }}
        />
      )}

    </div>
  );
}
