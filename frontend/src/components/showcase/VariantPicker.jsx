import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Check, Package, Zap, Clock, ShieldAlert } from 'lucide-react';

export default function VariantPicker({ product, selectedVariant, onSelectVariant, onBuyNow }) {
  const { t } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product || !product.variants || product.variants.length === 0) return null;

  const currentVariant = selectedVariant || product.variants[0];

  // Helper to extract regional price for current currency
  const getVariantPrice = (v) => {
    if (!v.prices) return 0;
    const match = v.prices.find((p) => p.currency === currency);
    return match ? match.price : (v.prices[0] ? v.prices[0].price : 0);
  };

  const getVariantComparePrice = (v) => {
    if (!v.prices) return null;
    const match = v.prices.find((p) => p.currency === currency);
    return match ? match.compare_at_price : null;
  };

  const currentPrice = getVariantPrice(currentVariant);
  const currentComparePrice = getVariantComparePrice(currentVariant);

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop"];

  const activeImage = currentVariant.variant_image || images[activeImageIndex] || images[0];

  return (
    <section id="products" className="py-20 px-4 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            {product.slug.toUpperCase()}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {product.name}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Gallery with Thumbnails (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border-white/15 p-4 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl transition-all duration-500"
              />
              
              {/* Active SKU badge */}
              <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-cyan-300">
                SKU: {currentVariant.sku}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/20' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Configurator & Purchase Panel (5 Cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 space-y-8 border-white/15 shadow-2xl">
            
            {/* Header: Title & Dynamic Price */}
            <div className="space-y-2 border-b border-white/10 pb-6">
              <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
                {product.name}
              </div>
              <div className="flex items-baseline gap-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {formatPrice(currentPrice)}
                </div>
                {currentComparePrice && (
                  <div className="text-sm line-through text-slate-500">
                    {formatPrice(currentComparePrice)}
                  </div>
                )}
              </div>
            </div>

            {/* Variant Selector List */}
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>{t('variant.edition')}</span>
                <span className="text-cyan-400 font-mono text-[11px]">
                  {currentVariant.sku}
                </span>
              </label>

              <div className="space-y-2.5">
                {product.variants.map((v) => {
                  const isSelected = v.id === currentVariant.id;
                  const vPrice = getVariantPrice(v);
                  const colorAttr = v.attributes?.color || "";
                  const storageAttr = v.attributes?.storage || "";

                  return (
                    <div
                      key={v.id}
                      onClick={() => onSelectVariant(v)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-white/30'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">
                            {colorAttr} {storageAttr ? `• ${storageAttr}` : ''}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {v.sku}
                          </div>
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="text-sm font-extrabold text-slate-200">
                          {formatPrice(vPrice)}
                        </div>
                        <div className="text-[11px] text-cyan-400">
                          {v.stock_quantity > 0 ? `${v.stock_quantity} left` : 'Out of Stock'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inventory Status Indicator */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-2.5">
              {currentVariant.stock_quantity > 3 ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-medium">{t('variant.in_stock')}</span>
                </>
              ) : currentVariant.stock_quantity > 0 ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-300 font-medium">
                    {t('variant.low_stock', { count: currentVariant.stock_quantity })}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-rose-400 font-medium">{t('variant.out_of_stock')}</span>
                </>
              )}
            </div>

            {/* Buy Now Button */}
            <button
              onClick={() => onBuyNow(product, currentVariant)}
              disabled={currentVariant.stock_quantity <= 0}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                currentVariant.stock_quantity > 0
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-cyan-500/25'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {currentVariant.stock_quantity > 0
                  ? `${t('hero.buy_now')} • ${formatPrice(currentPrice)}`
                  : t('variant.out_of_stock')}
              </span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
