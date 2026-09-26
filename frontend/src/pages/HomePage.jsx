import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { productApi } from '../services/api';
import Navbar from '../components/navbar/Navbar';
import HeroShowcase from '../components/showcase/HeroShowcase';
import VariantPicker from '../components/showcase/VariantPicker';
import BentoFeatures from '../components/showcase/BentoFeatures';
import TechSpecs from '../components/showcase/TechSpecs';
import QuickBuyModal from '../components/checkout/QuickBuyModal';
import VietQRModal from '../components/checkout/VietQRModal';
import { Sparkles, Loader2, ShieldCheck, Heart } from 'lucide-react';

export default function HomePage({ onNavigateAdmin, onOrderSuccess }) {
  const { language, t } = useLanguage();
  const { currency } = useCurrency();

  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutVariant, setCheckoutVariant] = useState(null);
  const [vietQRData, setVietQRData] = useState(null);

  // Load products when language or currency changes
  useEffect(() => {
    setLoading(true);
    productApi.getProducts(language, currency)
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) {
          const firstSlug = res.data[0].slug;
          return productApi.getProductDetail(firstSlug, language, currency);
        }
      })
      .then((detailRes) => {
        if (detailRes) {
          setActiveProduct(detailRes.data);
          if (detailRes.data.variants && detailRes.data.variants.length > 0) {
            setSelectedVariant(detailRes.data.variants[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, [language, currency]);

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
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-cyan-500 selection:text-black">
      
      {/* Navigation */}
      <Navbar
        onOpenQuickBuy={() => handleOpenQuickBuy()}
        onNavigateAdmin={onNavigateAdmin}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        isCurrentAdmin={false}
      />

      {loading && !activeProduct ? (
        <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            Calibrating Luxury Showcase...
          </span>
        </div>
      ) : (
        <main>
          {/* Hero Section */}
          <HeroShowcase
            product={activeProduct}
            onSelectProduct={setActiveProduct}
            onQuickBuy={(p) => handleOpenQuickBuy(p)}
          />

          {/* Catalog & Variant Configurator Section */}
          {activeProduct && (
            <VariantPicker
              product={activeProduct}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              onBuyNow={(p, v) => handleOpenQuickBuy(p, v)}
            />
          )}

          {/* Bento Grid Innovation Highlights */}
          <BentoFeatures />

          {/* Tabbed Tech Specifications Table */}
          {activeProduct && (
            <TechSpecs product={activeProduct} />
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 lg:px-8 text-center text-xs text-slate-500 space-y-4 bg-black/40">
        <div className="flex items-center justify-center gap-2 text-slate-300 font-bold tracking-widest">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AURA GLOBAL SHOWCASE</span>
        </div>
        <p className="max-w-md mx-auto text-slate-400 font-light">
          Engineered for international clientele across the United States, Vietnam, and the Middle East. Real-time fixed pricing in USD, VND, and SAR.
        </p>
        <div className="text-[11px] text-slate-600 font-mono">
          © 2026 AURA Inc. All Rights Reserved. Compliant with Stripe & Napas 24/7 VietQR.
        </div>
      </footer>

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
