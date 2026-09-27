import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Check, Truck, ShieldCheck, Zap, Palette, Plus, Settings, X } from 'lucide-react';
import EditableText from '../common/EditableText';
import ColorSwatchesModal from './ColorSwatchesModal';
import { LUXURY_COLOR_PRESETS, getDefaultColorGradient } from './colorPresets';

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
  onSelectBlock,
  textOverrides = {},
  onUpdateTextOverride,
  hiddenElements = [],
  onDeleteElement
}) {
  const { t } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [colorImageOverride, setColorImageOverride] = useState(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setColorImageOverride(null);
  }, [product?.id]);

  const images = product?.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop"];

  // 1. Build and synchronize color swatches list
  const colorSwatches = useMemo(() => {
    try {
      if (textOverrides?.['config-color-swatches']) {
        const parsed = JSON.parse(textOverrides['config-color-swatches']);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // Fallback: build from product.variants
    if (product?.variants && product.variants.length > 0) {
      const seen = new Set();
      const derived = [];
      product.variants.forEach((v, idx) => {
        const colorName = v.attributes?.color || `Color ${idx + 1}`;
        if (!seen.has(colorName)) {
          seen.add(colorName);
          const foundPreset = LUXURY_COLOR_PRESETS.find(p => p.name.toLowerCase() === colorName.toLowerCase());
          derived.push({
            id: `variant-color-${v.id}`,
            name: colorName,
            color: foundPreset ? foundPreset.color : getDefaultColorGradient(colorName),
            hex: foundPreset ? foundPreset.hex : '#484b50',
            image: v.variant_image || images[idx % images.length] || images[0],
            variantId: v.id
          });
        }
      });
      if (derived.length > 0) return derived;
    }

    return LUXURY_COLOR_PRESETS.slice(0, 4).map((p, i) => ({
      id: `color-default-${i}`,
      name: p.name,
      color: p.color,
      hex: p.hex,
      image: p.sampleImage
    }));
  }, [textOverrides?.['config-color-swatches'], product?.variants, images]);

  const [selectedColorId, setSelectedColorId] = useState(() => colorSwatches[0]?.id || null);

  // Keep selectedColorId valid if colorSwatches list changes
  useEffect(() => {
    if (colorSwatches.length > 0 && !colorSwatches.some(s => s.id === selectedColorId)) {
      setSelectedColorId(colorSwatches[0].id);
    }
  }, [colorSwatches, selectedColorId]);

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

  // Active image priority: Color swatch image (switched on click) -> current variant image -> gallery image
  const activeImage = colorImageOverride || currentVariant.variant_image || images[activeImageIndex] || images[0];

  // Handler when a user selects a color swatch
  const handleSelectColorSwatch = (swatch) => {
    setSelectedColorId(swatch.id);
    if (swatch.image) {
      setColorImageOverride(swatch.image);
    }
    onUpdateTextOverride?.('config-selected-color-label', swatch.name);

    // If there is a matching variant in database, also switch active variant
    if (product.variants) {
      const match = product.variants.find(
        (v) => (swatch.variantId && v.id === swatch.variantId) ||
               (v.attributes?.color && v.attributes.color.toLowerCase() === swatch.name.toLowerCase())
      );
      if (match) {
        onSelectVariant(match);
      }
    }
  };

  const handleUpdateSwatchesList = (updatedSwatches) => {
    onUpdateTextOverride?.('config-color-swatches', JSON.stringify(updatedSwatches));
  };

  const handleOpenColorManager = () => {
    setIsColorModalOpen(true);
    onSelectBlock?.({
      id: 'config-color-swatches',
      type: 'Bảng Màu Sắc',
      label: 'Tùy Chọn Màu Sắc & Ảnh Slideshow',
      style: blockStyles?.['config-color-swatches'] || {},
      colorSwatches: colorSwatches,
      onUpdateSwatches: handleUpdateSwatchesList
    });
  };

  return (
    <section id="configuration" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0b0b0c] border-t border-[#1d1d1f]">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Apple Style Buy Header */}
        <div className="space-y-2 text-start">
          <div>
            <EditableText
              id="config-header-title"
              value={textOverrides?.['config-header-title'] ?? `Buy ${product.name}`}
              isEditing={isEditMode}
              onChange={(val) => onUpdateTextOverride?.('config-header-title', val)}
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
              value={textOverrides?.['config-header-subtitle'] ?? `From ${formatPrice(currentPrice)} with Apple-grade warranty. Free express delivery.`}
              isEditing={isEditMode}
              onChange={(val) => onUpdateTextOverride?.('config-header-subtitle', val)}
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
          
          {/* Left Column: Sticky Device Gallery (Slideshow linked with color selection) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-4">
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-[#161617] border border-[#2d2d30] p-6 flex items-center justify-center shadow-xl group">
              <img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain rounded-2xl transition-all duration-700 ease-out apple-animate-in"
              />

              {/* SKU label in bottom left */}
              <div className="absolute bottom-5 left-5 text-[11px] font-mono text-[#86868b] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                {currentVariant.sku}
              </div>

              {/* Edit mode hint */}
              {isEditMode && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-blue-400 font-medium">
                  📸 Ảnh đồng bộ theo màu sắc
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                {images.map((img, idx) => {
                  const isCurrentThumb = !colorImageOverride && activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setColorImageOverride(null);
                        setActiveImageIndex(idx);
                      }}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-[#161617] cursor-pointer ${
                        isCurrentThumb ? 'border-[#0071e3] scale-105 shadow-md shadow-blue-500/30' : 'border-[#333336] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover rounded-xl" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Apple Configurator Steps */}
          <div className="lg:col-span-6 space-y-10 text-start">
            
            {/* Step 1: Finish / Color Selection */}
            {!hiddenElements.includes('config-color-swatches') && (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <EditableText
                  id="config-step1-title"
                  value={textOverrides?.['config-step1-title'] ?? "Finish. Pick your favorite color."}
                  isEditing={isEditMode}
                  onChange={(val) => onUpdateTextOverride?.('config-step1-title', val)}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'config-step1-title'}
                  blockStyle={blockStyles?.['config-step1-title']}
                  allowDrag={false}
                  className="text-base font-semibold text-[#f5f5f7]"
                />
                <EditableText
                  id="config-selected-color-label"
                  value={textOverrides?.['config-selected-color-label'] ?? (colorSwatches.find(s => s.id === selectedColorId)?.name || currentVariant.attributes?.color || '')}
                  isEditing={isEditMode}
                  onChange={(val) => onUpdateTextOverride?.('config-selected-color-label', val)}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'config-selected-color-label'}
                  blockStyle={blockStyles?.['config-selected-color-label']}
                  allowDrag={false}
                  className="text-xs text-[#2997ff] font-medium"
                />
              </div>

              {/* Metallic Color Swatches with Slideshow Image Sync & Canva Controls */}
              <div className="flex flex-wrap items-center gap-4 py-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {colorSwatches.map((swatch, idx) => {
                    const isSelected = selectedColorId ? swatch.id === selectedColorId : idx === 0;

                    return (
                      <div key={swatch.id || idx} className="relative group/swatch">
                        <button
                          type="button"
                          onClick={() => handleSelectColorSwatch(swatch)}
                          title={`${swatch.name} — Bấm để chuyển ảnh slideshow sang màu này`}
                          className={`relative w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                            isSelected 
                              ? 'scale-110 ring-2 ring-[#0071e3] ring-offset-2 ring-offset-[#0b0b0c] shadow-lg shadow-blue-500/30' 
                              : 'opacity-80 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ background: swatch.color || swatch.hex || '#484b50' }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Edit Controls in Edit Mode */}
                {isEditMode && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenColorManager}
                      className="px-3 py-1.5 rounded-full bg-blue-500/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow"
                      title="Mở Canva Studio tùy chỉnh màu sắc, đổi mã màu hex/gradient và liên kết ảnh cho từng màu"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>🎨 Tùy Chỉnh Màu (Canva)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newIdx = colorSwatches.length;
                        const preset = LUXURY_COLOR_PRESETS[newIdx % LUXURY_COLOR_PRESETS.length];
                        const newSwatch = {
                          id: `color-${Date.now()}`,
                          name: preset.name,
                          color: preset.color,
                          hex: preset.hex,
                          image: preset.sampleImage
                        };
                        const next = [...colorSwatches, newSwatch];
                        handleUpdateSwatchesList(next);
                        handleSelectColorSwatch(newSwatch);
                      }}
                      className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer shadow"
                      title="Thêm nút màu mới ngay lập tức"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Màu</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Step 2: Storage / Edition Options */}
            {!hiddenElements.includes('config-variant-tabs') && (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <EditableText
                  id="config-step2-title"
                  value={textOverrides?.['config-step2-title'] ?? "Storage. How much space do you need?"}
                  isEditing={isEditMode}
                  onChange={(val) => onUpdateTextOverride?.('config-step2-title', val)}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'config-step2-title'}
                  blockStyle={blockStyles?.['config-step2-title']}
                  allowDrag={false}
                  className="text-base font-semibold text-[#f5f5f7]"
                />
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
                        <div>
                          <EditableText
                            id={`variant-storage-${v.id}`}
                            value={textOverrides?.[`variant-storage-${v.id}`] ?? storageLabel}
                            isEditing={isEditMode}
                            onChange={(val) => onUpdateTextOverride?.(`variant-storage-${v.id}`, val)}
                            onSelectBlock={onSelectBlock}
                            isSelected={activeBlockId === `variant-storage-${v.id}`}
                            blockStyle={blockStyles?.[`variant-storage-${v.id}`]}
                            allowDrag={false}
                            className="text-lg font-bold text-white tracking-tight"
                          />
                        </div>
                        <div>
                          <EditableText
                            id={`variant-color-${v.id}`}
                            value={textOverrides?.[`variant-color-${v.id}`] ?? colorLabel}
                            isEditing={isEditMode}
                            onChange={(val) => onUpdateTextOverride?.(`variant-color-${v.id}`, val)}
                            onSelectBlock={onSelectBlock}
                            isSelected={activeBlockId === `variant-color-${v.id}`}
                            blockStyle={blockStyles?.[`variant-color-${v.id}`]}
                            allowDrag={false}
                            className="text-xs text-[#86868b]"
                          />
                        </div>
                      </div>

                      <div className="text-end">
                        <div>
                          <EditableText
                            id={`variant-price-${v.id}`}
                            value={textOverrides?.[`variant-price-${v.id}`] ?? formatPrice(vPrice)}
                            isEditing={isEditMode}
                            onChange={(val) => onUpdateTextOverride?.(`variant-price-${v.id}`, val)}
                            onSelectBlock={onSelectBlock}
                            isSelected={activeBlockId === `variant-price-${v.id}`}
                            blockStyle={blockStyles?.[`variant-price-${v.id}`]}
                            allowDrag={false}
                            className="text-base font-semibold text-[#f5f5f7]"
                          />
                        </div>
                        <div>
                          <EditableText
                            id={`variant-stock-status-${v.id}`}
                            value={textOverrides?.[`variant-stock-status-${v.id}`] ?? (v.stock_quantity > 0 ? 'Ready to ship' : 'Out of stock')}
                            isEditing={isEditMode}
                            onChange={(val) => onUpdateTextOverride?.(`variant-stock-status-${v.id}`, val)}
                            onSelectBlock={onSelectBlock}
                            isSelected={activeBlockId === `variant-stock-status-${v.id}`}
                            blockStyle={blockStyles?.[`variant-stock-status-${v.id}`]}
                            allowDrag={false}
                            className="text-[11px] text-[#30d158] font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {/* Step 3: Apple Order Summary Box */}
            {!hiddenElements.includes('picker-summary-card') && (
            <div 
              style={{
                ...(blockStyles?.['picker-summary-card'] || {})
              }}
              onClick={(e) => {
                if (isEditMode && e.target === e.currentTarget) {
                  onSelectBlock?.({
                    id: 'picker-summary-card',
                    type: 'Khối Tóm Tắt Đơn',
                    label: 'Khối Tóm Tắt Đặt Hàng',
                    style: blockStyles?.['picker-summary-card'] || {}
                  });
                }
              }}
              className={`p-6 rounded-[24px] bg-[#161617] border transition-all space-y-5 relative group/summary ${
                activeBlockId === 'picker-summary-card'
                  ? 'ring-2 ring-[#0071e3] border-[#0071e3]'
                  : isEditMode
                  ? 'border-[#0071e3]/40 border-dashed hover:border-[#0071e3] cursor-pointer'
                  : 'border-[#2d2d30]'
              }`}
            >
              {isEditMode && onDeleteElement && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement('picker-summary-card');
                  }}
                  className="opacity-0 group-hover/summary:opacity-100 absolute -top-2.5 -right-2.5 p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-opacity cursor-pointer shadow z-10"
                  title="Xóa/Ẩn khối tóm tắt đơn"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              
              <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-4">
                <div>
                  <EditableText
                    id="picker-summary-prodname"
                    value={textOverrides?.['picker-summary-prodname'] ?? product.name}
                    isEditing={isEditMode}
                    onChange={(val) => onUpdateTextOverride?.('picker-summary-prodname', val)}
                    onSelectBlock={onSelectBlock}
                    isSelected={activeBlockId === 'picker-summary-prodname'}
                    blockStyle={blockStyles?.['picker-summary-prodname']}
                    allowDrag={false}
                    className="text-sm font-semibold text-white"
                  />
                  <div className="text-xs text-[#86868b]">{currentVariant.attributes?.color} • {currentVariant.attributes?.storage}</div>
                </div>
                <div className="text-end">
                  <div>
                    <EditableText
                      id="picker-summary-price"
                      value={textOverrides?.['picker-summary-price'] ?? formatPrice(currentPrice)}
                      isEditing={isEditMode}
                      onChange={(val) => onUpdateTextOverride?.('picker-summary-price', val)}
                      onSelectBlock={onSelectBlock}
                      isSelected={activeBlockId === 'picker-summary-price'}
                      blockStyle={blockStyles?.['picker-summary-price']}
                      allowDrag={false}
                      className="text-xl font-bold text-white"
                    />
                  </div>
                  {(currentComparePrice || isEditMode) && (
                    <div>
                      <EditableText
                        id="picker-summary-compare-price"
                        value={textOverrides?.['picker-summary-compare-price'] ?? (currentComparePrice ? formatPrice(currentComparePrice) : '')}
                        placeholder="Thêm giá so sánh..."
                        isEditing={isEditMode}
                        onChange={(val) => onUpdateTextOverride?.('picker-summary-compare-price', val)}
                        onSelectBlock={onSelectBlock}
                        isSelected={activeBlockId === 'picker-summary-compare-price'}
                        blockStyle={blockStyles?.['picker-summary-compare-price']}
                        allowDrag={false}
                        className="text-xs line-through text-[#6e6e73]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery readiness */}
              {!hiddenElements.includes('config-delivery-note') && (
              <div className="flex items-center gap-3 text-xs text-[#86868b]">
                <Truck className="w-4 h-4 text-[#2997ff] shrink-0" />
                <EditableText
                  id="config-delivery-note"
                  value={textOverrides?.['config-delivery-note'] ?? "Complimentary express delivery in 24 hours."}
                  isEditing={isEditMode}
                  onChange={(val) => onUpdateTextOverride?.('config-delivery-note', val)}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'config-delivery-note'}
                  blockStyle={blockStyles?.['config-delivery-note']}
                  allowDrag={false}
                  className="text-xs text-[#86868b]"
                />
              </div>
              )}

              {/* Big Apple Buy Pill Button */}
              {!hiddenElements.includes('picker-buy-button') && !hiddenElements.includes('config-cta-add') && (
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
                <EditableText
                  id="config-buy-button-text"
                  value={textOverrides?.['config-buy-button-text'] ?? (currentVariant.stock_quantity > 0 ? `${t('hero.buy_now')} • ${formatPrice(currentPrice)}` : t('variant.out_of_stock'))}
                  isEditing={isEditMode}
                  onChange={(val) => onUpdateTextOverride?.('config-buy-button-text', val)}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'config-buy-button-text'}
                  blockStyle={blockStyles?.['config-buy-button-text']}
                  allowDrag={false}
                />
              </button>
              )}

            </div>
            )}

          </div>

        </div>

      </div>

      {/* Canva Color Swatches Studio Modal */}
      <ColorSwatchesModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        swatches={colorSwatches}
        onUpdateSwatches={handleUpdateSwatchesList}
        onSelectColorSwatch={handleSelectColorSwatch}
        activeColorId={selectedColorId}
      />
    </section>
  );
}
