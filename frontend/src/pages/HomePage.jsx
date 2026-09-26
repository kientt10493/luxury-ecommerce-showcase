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
import DraggableFloatingImage from '../components/common/DraggableFloatingImage';
import { Loader2, Shield, X, Key } from 'lucide-react';

export default function HomePage({ onNavigateAdmin, onOrderSuccess }) {
  const { language, t } = useLanguage();
  const { currency, formatPrice } = useCurrency();

  const [products, setProducts] = useState([]);
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Edit Mode state (Word-style in-place editing & Drag-and-drop)
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('Admin@2026');
  const [authError, setAuthError] = useState('');

  // Drag & drop floating images and section ordering state
  const [floatingImages, setFloatingImages] = useState([]);
  const [sectionOrder, setSectionOrder] = useState(['hero', 'configurator', 'bento', 'specs']);

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
          const prodData = detailRes.data;
          setActiveProduct(prodData);
          if (prodData.variants && prodData.variants.length > 0) {
            setSelectedVariant(prodData.variants[0]);
          }
          // Load floating images & section order from specifications
          if (prodData.specifications?.floating_images) {
            setFloatingImages(prodData.specifications.floating_images);
          } else {
            setFloatingImages([]);
          }
          if (prodData.specifications?.section_order) {
            setSectionOrder(prodData.specifications.section_order);
          } else {
            setSectionOrder(['hero', 'configurator', 'bento', 'specs']);
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

  // Reorder Bento feature highlights (Drag & Drop or Swap)
  const handleReorderFeatures = (sourceIdx, targetIdx) => {
    if (!activeProduct) return;
    const list = [...(activeProduct.features || [])];
    while (list.length < 4) {
      list.push(`Feature ${list.length + 1}`);
    }
    const temp = list[sourceIdx];
    list[sourceIdx] = list[targetIdx];
    list[targetIdx] = temp;
    setActiveProduct((prev) => ({
      ...prev,
      features: list
    }));
    setHasChanges(true);
  };

  // Update Hero Hardware main image directly (Upload or Drop)
  const handleUpdateHeroImage = (dataUrl) => {
    if (!activeProduct) return;
    const newImages = [...(activeProduct.images || [])];
    if (newImages.length > 0) {
      newImages[0] = dataUrl;
    } else {
      newImages.push(dataUrl);
    }
    setActiveProduct((prev) => ({
      ...prev,
      images: newImages
    }));
    setHasChanges(true);
  };

  // Update hero badges
  const handleUpdateBadge = (index, val) => {
    handleUpdateFeature(index, val);
  };

  // Floating Image Handlers
  const handleAddFloatingImage = (dataUrl) => {
    const newImg = {
      id: `float-${Date.now()}`,
      src: dataUrl,
      x: Math.min(window.innerWidth - 260, 40 + floatingImages.length * 30),
      y: 160 + floatingImages.length * 40,
      width: 220,
      caption: ''
    };
    setFloatingImages((prev) => [...prev, newImg]);
    setHasChanges(true);
  };

  const handleUpdateFloatingImagePosition = (id, x, y) => {
    setFloatingImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
    setHasChanges(true);
  };

  const handleUpdateFloatingImageWidth = (id, width) => {
    setFloatingImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, width } : item))
    );
    setHasChanges(true);
  };

  const handleDeleteFloatingImage = (id) => {
    setFloatingImages((prev) => prev.filter((item) => item.id !== id));
    setHasChanges(true);
  };

  // Section Ordering Handler
  const handleMoveSection = (fromIdx, toIdx) => {
    const list = [...sectionOrder];
    const item = list.splice(fromIdx, 1)[0];
    list.splice(toIdx, 0, item);
    setSectionOrder(list);
    setHasChanges(true);
  };

  // Save changes live to backend SQLite database
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

      const baseSpecs = fullData.specifications || {};
      const updatedSpecs = {
        ...baseSpecs,
        floating_images: floatingImages,
        section_order: sectionOrder
      };

      const payload = {
        slug: fullData.slug,
        images: activeProduct.images || fullData.images,
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
          specifications: updatedSpecs
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
      alert('✅ Đã lưu trực tiếp toàn bộ nội dung, vị trí ảnh và thứ tự khối thành công lên website!');
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
          if (res.data.specifications?.floating_images) {
            setFloatingImages(res.data.specifications.floating_images);
          }
          if (res.data.specifications?.section_order) {
            setSectionOrder(res.data.specifications.section_order);
          }
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
        <main className="relative">
          {/* Dynamic Section Ordering */}
          {sectionOrder.map((sectionKey) => {
            if (sectionKey === 'hero') {
              return (
                <HeroShowcase
                  key="hero"
                  product={activeProduct}
                  allProducts={products}
                  onSelectProduct={handleSelectProduct}
                  onQuickBuy={(p) => handleOpenQuickBuy(p)}
                  isEditMode={isEditMode}
                  onUpdateField={handleUpdateField}
                  onUpdateImage={handleUpdateHeroImage}
                  onUpdateBadge={handleUpdateBadge}
                />
              );
            }

            if (sectionKey === 'configurator' && activeProduct) {
              return (
                <VariantPicker
                  key="configurator"
                  product={activeProduct}
                  selectedVariant={selectedVariant}
                  onSelectVariant={setSelectedVariant}
                  onBuyNow={(p, v) => handleOpenQuickBuy(p, v)}
                />
              );
            }

            if (sectionKey === 'bento' && activeProduct) {
              return (
                <BentoFeatures 
                  key="bento"
                  product={activeProduct} 
                  isEditMode={isEditMode}
                  onUpdateFeature={handleUpdateFeature}
                  onUpdateField={handleUpdateField}
                  onReorderFeatures={handleReorderFeatures}
                />
              );
            }

            if (sectionKey === 'specs' && activeProduct) {
              return (
                <TechSpecs key="specs" product={activeProduct} />
              );
            }

            return null;
          })}
        </main>
      )}

      {/* Custom Draggable Floating Images on Website */}
      {floatingImages.map((imgItem) => (
        <DraggableFloatingImage
          key={imgItem.id}
          item={imgItem}
          isEditMode={isEditMode}
          onUpdatePosition={handleUpdateFloatingImagePosition}
          onUpdateWidth={handleUpdateFloatingImageWidth}
          onDelete={handleDeleteFloatingImage}
        />
      ))}

      {/* Floating Apple Live Drag & Drop Editor Dock */}
      <LiveEditorBar
        isEditMode={isEditMode}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSaveLive}
        onReset={handleReset}
        onExit={() => setIsEditMode(false)}
        onAddFloatingImage={handleAddFloatingImage}
        sectionOrder={sectionOrder}
        onMoveSection={handleMoveSection}
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
                <p className="text-[11px] text-[#86868b]">Mở quyền sửa văn bản & kéo thả trực tiếp</p>
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
