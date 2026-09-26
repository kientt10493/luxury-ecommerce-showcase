import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Check, Truck, ShieldCheck, Zap } from 'lucide-react';
import EditableText from '../common/EditableText';

export default function VariantPicker({ 
  product, 
  selectedVariant, 
  onSelectVariant, 
  onBuyNow,
  isEditMode = false,
  textOffsets = {},
  onUpdateTextOffset,
  blockStyles = {},
  activeBlockId,
  onSelectBlock
}) {
  const { t } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!product || !product.variants || product.variants.length === 0) return null;

  const currentVariant = selectedVariant || product.variants[0];

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

  // Helper color gradient map for metallic swatches
  const getColorGradient = (colorName = "") => {
    const c = colorName.toLowerCase();
    if (c.includes('gray') || c.includes('titan') || c.includes('xám') || c.includes('رمادي')) {
      return 'linear-gradient(135deg, #8a8d91 0%, #484b50 100%)';
    }
    if (c.includes('silver') || c.includes('bạc') || c.includes('فضي')) {
      return 'linear-gradient(135deg, #f5f5f7 0%, #a2a3a5 100%)';
    }
    if (c.includes('black') || c.includes('đen') || c.includes('huyền') || c.includes('أسود')) {
      return 'linear-gradient(135deg, #333336 0%, #161617 100%)';
    }
    if (c.includes('gold') || c.includes('vàng') || c.includes('ذهبي')) {
      return 'linear-gradient(135deg, #fcebc2 0%, #c8aa76 100%)';
    }
    return 'linear-gradient(135deg, #5e6573 0%, #2f343f 100%)';
  };

  return (
    <section id="configuration" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0b0b0c] border-t border-[#1d1d1f]">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Apple Style Buy Header */}
        <div className="space-y-2 text-start">
          <div>
            <EditableText
              id="config-header-title"
              value={`Buy ${product.name}`}
              isEditing={isEditMode}
              blockStyle={blockStyles?.['config-header-title']}
              isSelected={activeBlockId === 'config-header-title'}
              onSelectBlock={onSelectBlock}
              offset={textOffsets?.['config-header-title']}
              onOffsetChange={onUpdateTextOffset}
              as="h2"
              className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f5f7]"
            />
          </div>
          <div>
            <EditableText
              id="config-header-subtitle"
              value={`From ${formatPrice(currentPrice)} with Apple-grade warranty. Free express delivery.`}
              isEditing={isEditMode}
              blockStyle={blockStyles?.['config-header-subtitle']}
              isSelected={activeBlockId === 'config-header-subtitle'}
              onSelectBlock={onSelectBlock}
              offset={textOffsets?.['config-header-subtitle']}
              onOffsetChange={onUpdateTextOffset}
              as="p"
              className="text-base text-[#86868b]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Sticky Device Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-4">
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-[#161617] border border-[#2d2d30] p-6 flex items-center justify-center shadow-xl">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain rounded-2xl transition-all duration-500"
              />

              {/* SKU label in bottom left */}
              <div className="absolute bottom-5 left-5 text-[11px] font-mono text-[#86868b] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                {currentVariant.sku}
              </div>
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-[#161617] ${
                      activeImageIndex === idx ? 'border-[#0071e3] scale-105' : 'border-[#333336] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Apple Configurator Steps */}
          <div className="lg:col-span-6 space-y-10 text-start">
            
            {/* Step 1: Finish / Color Selection */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-[#f5f5f7]">
                  Finish. <span className="text-[#86868b] font-normal">Pick your favorite color.</span>
                </span>
                <span className="text-xs text-[#2997ff] font-medium">
                  {currentVariant.attributes?.color}
                </span>
              </div>

              {/* Metallic Color Swatches */}
              <div className="flex items-center gap-4 py-2">
                {product.variants.map((v) => {
                  const isSelected = v.id === currentVariant.id;
                  const colorLabel = v.attributes?.color || "";
                  return (
                    <button
                      key={v.id}
                      onClick={() => onSelectVariant(v)}
                      title={colorLabel}
                      className={`relative w-10 h-10 rounded-full transition-transform flex items-center justify-center ${
                        isSelected ? 'scale-110 ring-2 ring-[#0071e3] ring-offset-2 ring-offset-[#0b0b0c]' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ background: getColorGradient(colorLabel) }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Storage / Edition Options */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-[#f5f5f7]">
                  Storage. <span className="text-[#86868b] font-normal">How much space do you need?</span>
                </span>
              </div>

              <div className="space-y-3">
                {product.variants.map((v) => {
                  const isSelected = v.id === currentVariant.id;
                  const vPrice = getVariantPrice(v);
                  const storageLabel = v.attributes?.storage || v.sku;
                  const colorLabel = v.attributes?.color || "";

                  return (
                    <div
                      key={v.id}
                      onClick={() => onSelectVariant(v)}
                      className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#0071e3] bg-[#0071e3]/10 shadow-sm'
                          : 'border-[#333336] bg-[#161617] hover:border-[#555559]'
                      }`}
                    >
                      <div>
                        <div className="text-lg font-bold text-white tracking-tight">
                          {storageLabel}
                        </div>
                        <div className="text-xs text-[#86868b]">
                          {colorLabel}
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="text-base font-semibold text-[#f5f5f7]">
                          {formatPrice(vPrice)}
                        </div>
                        <div className="text-[11px] text-[#30d158] font-medium">
                          {v.stock_quantity > 0 ? 'Ready to ship' : 'Out of stock'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Apple Order Summary Box */}
            <div 
              style={{
                ...(blockStyles?.['picker-summary-card'] || {})
              }}
              onClick={() => {
                if (isEditMode) {
                  onSelectBlock?.({
                    id: 'picker-summary-card',
                    type: 'Khối Tóm Tắt Đơn',
                    label: 'Khối Tóm Tắt Đặt Hàng',
                    style: blockStyles?.['picker-summary-card'] || {}
                  });
                }
              }}
              className={`p-6 rounded-[24px] bg-[#161617] border transition-all space-y-5 ${
                activeBlockId === 'picker-summary-card'
                  ? 'ring-2 ring-[#0071e3] border-[#0071e3]'
                  : isEditMode
                  ? 'border-[#0071e3]/40 border-dashed hover:border-[#0071e3] cursor-pointer'
                  : 'border-[#2d2d30]'
              }`}
            >
              
              <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-4">
                <div>
                  <div className="text-sm font-semibold text-white">{product.name}</div>
                  <div className="text-xs text-[#86868b]">{currentVariant.attributes?.color} • {currentVariant.attributes?.storage}</div>
                </div>
                <div className="text-end">
                  <div className="text-xl font-bold text-white">{formatPrice(currentPrice)}</div>
                  {currentComparePrice && (
                    <div className="text-xs line-through text-[#6e6e73]">{formatPrice(currentComparePrice)}</div>
                  )}
                </div>
              </div>

              {/* Delivery readiness */}
              <div className="flex items-center gap-3 text-xs text-[#86868b]">
                <Truck className="w-4 h-4 text-[#2997ff] shrink-0" />
                <span>Complimentary express delivery in 24 hours.</span>
              </div>

              {/* Big Apple Buy Pill Button */}
              <button
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectBlock?.({
                      id: 'picker-buy-button',
                      type: 'Nút Mua Hàng',
                      label: 'Nút Mua Hàng (Variant Picker)',
                      style: blockStyles?.['picker-buy-button'] || {}
                    });
                    return;
                  }
                  onBuyNow(product, currentVariant);
                }}
                disabled={currentVariant.stock_quantity <= 0}
                style={{
                  ...(blockStyles?.['picker-buy-button'] || {})
                }}
                className={`w-full py-3.5 rounded-full text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  activeBlockId === 'picker-buy-button'
                    ? 'ring-2 ring-white scale-[1.02] shadow-blue-500/50'
                    : currentVariant.stock_quantity > 0
                    ? 'apple-btn-blue text-white'
                    : 'bg-[#2c2c2e] text-[#6e6e73] cursor-not-allowed'
                }`}
                title={isEditMode ? 'Nhấp để đổi màu sắc, font chữ nút Mua Hàng' : undefined}
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

      </div>
    </section>
  );
}
