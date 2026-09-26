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
import { Loader2 } from 'lucide-react';

export default function HomePage({ onNavigateAdmin, onOrderSuccess }) {
  const { language, t } = useLanguage();
  const { currency, formatPrice } = useCurrency();

  const [products, setProducts] = useState([]);
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

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

          {/* Apple Bento Highlights */}
          {activeProduct && (
            <BentoFeatures product={activeProduct} />
          )}

          {/* Apple Tech Specs */}
          {activeProduct && (
            <TechSpecs product={activeProduct} />
          )}
        </main>
      )}

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
