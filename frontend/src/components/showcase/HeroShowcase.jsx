import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ChevronRight, Truck, ShieldCheck, Upload, X, Plus, RotateCcw } from 'lucide-react';
import EditableText from '../common/EditableText';

export default function HeroShowcase({ 
  product, 
  allProducts = [], 
  onSelectProduct, 
  onQuickBuy,
  isEditMode = false,
  onUpdateField,
  onUpdateImage,
  onUpdateImageFile,
  onUpdateBadge,
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
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!product) return null;

  const internalKeys = ['floating_images', 'section_order', 'canvas_elements', 'text_offsets', 'block_styles'];
  const displayableSpecs = Object.entries(product.specifications || {})
    .filter(([k, v]) => !internalKeys.includes(k) && typeof v !== 'object')
    .map(([k, v]) => `${k}: ${v}`);

  const mainImage = (product.images && product.images[0]) || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop";

  let hiddenBadges = [];
  try {
    hiddenBadges = textOverrides['hero-hidden-badges'] ? JSON.parse(textOverrides['hero-hidden-badges']) : [];
  } catch (e) {}

  const handleToggleHideBadge = (badgeIdx) => {
    let next;
    if (hiddenBadges.includes(badgeIdx)) {
      next = hiddenBadges.filter((i) => i !== badgeIdx);
    } else {
      next = [...hiddenBadges, badgeIdx];
    }
    onUpdateTextOverride?.('hero-hidden-badges', JSON.stringify(next));
  };

  let hiddenGuarantees = [];
  try {
    hiddenGuarantees = textOverrides['hero-hidden-guarantees'] ? JSON.parse(textOverrides['hero-hidden-guarantees']) : [];
  } catch (e) {}

  const handleToggleHideGuarantee = (gIdx) => {
    let next;
    if (hiddenGuarantees.includes(gIdx)) {
      next = hiddenGuarantees.filter((i) => i !== gIdx);
    } else {
      next = [...hiddenGuarantees, gIdx];
    }
    onUpdateTextOverride?.('hero-hidden-guarantees', JSON.stringify(next));
  };

  return (
    <section id="overview" className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center bg-black overflow-hidden select-none">
      
      {/* Background dramatic ambient illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#1a2333]/40 via-transparent to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Apple Product Model Toggle Pills */}
        {allProducts.length > 1 && !hiddenElements.includes('hero-product-model-pills') && (
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 rounded-full bg-[#161617] border border-[#333336] gap-1">
              {allProducts.map((p) => {
                const isActive = p.id === product.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#2c2c2e] text-white shadow-sm'
                        : 'text-[#86868b] hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Hero Header Area (Apple Headline & Tagline Hierarchy) */}
        <div className="space-y-4 max-w-3xl mx-auto">
          
          {!hiddenElements.includes('hero-eyebrow') && (
            <div>
              <EditableText
                id="hero-eyebrow"
                value={textOverrides?.['hero-eyebrow'] ?? t('hero.eyebrow')}
                isEditing={isEditMode}
                onChange={(val) => onUpdateTextOverride?.('hero-eyebrow', val)}
                blockStyle={blockStyles?.['hero-eyebrow']}
                isSelected={activeBlockId === 'hero-eyebrow'}
                onSelectBlock={onSelectBlock}
                offset={textOffsets?.['hero-eyebrow']}
                onOffsetChange={onUpdateTextOffset}
                className="text-xs sm:text-sm font-semibold tracking-wider text-[#ff9f0a] uppercase"
              />
            </div>
          )}

          {!hiddenElements.includes('hero-product-name') && (
            <div>
              <EditableText
                id="hero-product-name"
                value={product.name}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['hero-product-name']}
                isSelected={activeBlockId === 'hero-product-name'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateField?.('name', val)}
                offset={textOffsets?.['hero-product-name']}
                onOffsetChange={onUpdateTextOffset}
                as="h1"
                className="text-5xl sm:text-7xl font-bold tracking-tight text-[#f5f5f7] leading-[1.05]"
              />
            </div>
          )}

          {!hiddenElements.includes('hero-product-tagline') && (
            <div>
              <EditableText
                id="hero-product-tagline"
                value={product.tagline}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['hero-product-tagline']}
                isSelected={activeBlockId === 'hero-product-tagline'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateField?.('tagline', val)}
                offset={textOffsets?.['hero-product-tagline']}
                onOffsetChange={onUpdateTextOffset}
                as="p"
                className="text-xl sm:text-2xl text-[#86868b] font-normal leading-relaxed max-w-2xl mx-auto"
              />
            </div>
          )}

          {!hiddenElements.includes('hero-product-desc') && (
            <div>
              <EditableText
                id="hero-product-desc"
                value={product.description || ''}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['hero-product-desc']}
                isSelected={activeBlockId === 'hero-product-desc'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateField?.('description', val)}
                offset={textOffsets?.['hero-product-desc']}
                onOffsetChange={onUpdateTextOffset}
                as="p"
                multiline={true}
                placeholder="Nhấp để thêm đoạn văn giới thiệu sản phẩm..."
                className="text-sm sm:text-base text-[#a1a1a6] font-normal leading-relaxed max-w-2xl mx-auto pt-1"
              />
            </div>
          )}

          {/* Pricing Tag */}
          {!hiddenElements.includes('hero-pricing-box') && (
            <div 
              onClick={(e) => {
                if (isEditMode && e.target === e.currentTarget) {
                  onSelectBlock?.({
                    id: 'hero-pricing-box',
                    type: 'Khối Giá Bán',
                    label: 'Khối Hiển Thị Giá Bán',
                    style: blockStyles?.['hero-pricing-box'] || {}
                  });
                }
              }}
              style={{
                ...(blockStyles?.['hero-pricing-box'] || {})
              }}
              className={`pt-2 text-base text-[#86868b] flex items-center justify-center gap-2 rounded-xl transition-all relative group/price ${
                isEditMode ? 'cursor-pointer hover:bg-white/5 p-1.5' : ''
              } ${
                activeBlockId === 'hero-pricing-box' ? 'ring-2 ring-[#0071e3] bg-white/10 p-1.5' : ''
              }`}
              title={isEditMode ? 'Nhấp để chỉnh màu sắc, cỡ chữ khối giá bán bằng Canva Studio' : undefined}
            >
              <EditableText
                id="hero-starting-at"
                value={textOverrides?.['hero-starting-at'] ?? t('hero.starting_at')}
                isEditing={isEditMode}
                onChange={(val) => onUpdateTextOverride?.('hero-starting-at', val)}
                onSelectBlock={onSelectBlock}
                isSelected={activeBlockId === 'hero-starting-at'}
                blockStyle={blockStyles?.['hero-starting-at']}
                allowDrag={false}
              />
              <EditableText
                id="hero-price-amount"
                value={textOverrides?.['hero-price-amount'] ?? formatPrice(product.price)}
                isEditing={isEditMode}
                onChange={(val) => {
                  onUpdateTextOverride?.('hero-price-amount', val);
                  const cleaned = val.replace(/[^0-9.]/g, '');
                  if (cleaned && !isNaN(parseFloat(cleaned))) {
                    onUpdateField?.('price', parseFloat(cleaned));
                  }
                }}
                onSelectBlock={onSelectBlock}
                isSelected={activeBlockId === 'hero-price-amount'}
                blockStyle={blockStyles?.['hero-price-amount']}
                allowDrag={false}
                className="text-white font-semibold text-lg"
              />
              {(product.compare_at_price || isEditMode) && (
                <EditableText
                  id="hero-compare-price"
                  value={textOverrides?.['hero-compare-price'] ?? (product.compare_at_price ? formatPrice(product.compare_at_price) : '')}
                  placeholder="Nhấp thêm giá so sánh..."
                  isEditing={isEditMode}
                  onChange={(val) => {
                    onUpdateTextOverride?.('hero-compare-price', val);
                    const cleaned = val.replace(/[^0-9.]/g, '');
                    if (cleaned && !isNaN(parseFloat(cleaned))) {
                      onUpdateField?.('compare_at_price', parseFloat(cleaned));
                    }
                  }}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'hero-compare-price'}
                  blockStyle={blockStyles?.['hero-compare-price']}
                  allowDrag={false}
                  className="line-through text-[#6e6e73] text-sm"
                />
              )}
              {isEditMode && onDeleteElement && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement('hero-pricing-box');
                  }}
                  className="opacity-0 group-hover/price:opacity-100 p-1 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white transition-opacity cursor-pointer shadow ml-1"
                  title="Xóa/Ẩn khối giá bán"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Apple Action CTAs */}
          {(!hiddenElements.includes('hero-cta-buy') || (!hiddenElements.includes('hero-cta-explore') && !hiddenElements.includes('hero-cta-specs'))) && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {!hiddenElements.includes('hero-cta-buy') && (
                <div className="relative group/btnbuy flex items-center">
                  <button
                    onClick={(e) => {
                      if (isEditMode) {
                        e.preventDefault();
                        onSelectBlock?.({
                          id: 'hero-cta-buy',
                          type: 'Nút Bấm CTA',
                          label: 'Nút Mua Ngay (Hero CTA)',
                          style: blockStyles?.['hero-cta-buy'] || {}
                        });
                        return;
                      }
                      onQuickBuy(product);
                    }}
                    style={{
                      ...(blockStyles?.['hero-cta-buy'] || {})
                    }}
                    className={`apple-btn-blue px-7 py-2.5 text-sm shadow-lg shadow-blue-500/20 font-medium cursor-pointer transition-all ${
                      activeBlockId === 'hero-cta-buy' ? 'ring-2 ring-white scale-105 shadow-blue-500/40' : ''
                    }`}
                    title={isEditMode ? 'Nhấp để đổi màu nền, viền, font chữ của nút Mua Ngay' : undefined}
                  >
                    <EditableText
                      id="hero-cta-buy"
                      value={textOverrides?.['hero-cta-buy'] ?? t('hero.buy_now')}
                      isEditing={isEditMode}
                      onChange={(val) => onUpdateTextOverride?.('hero-cta-buy', val)}
                      onSelectBlock={onSelectBlock}
                      isSelected={activeBlockId === 'hero-cta-buy'}
                      blockStyle={blockStyles?.['hero-cta-buy']}
                      allowDrag={false}
                    />
                  </button>
                  {isEditMode && onDeleteElement && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteElement('hero-cta-buy');
                      }}
                      className="opacity-0 group-hover/btnbuy:opacity-100 absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-opacity cursor-pointer shadow z-10"
                      title="Xóa/Ẩn nút Mua Ngay"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {!hiddenElements.includes('hero-cta-explore') && !hiddenElements.includes('hero-cta-specs') && (
                <div className="relative group/btnexp flex items-center">
                  <a
                    href="#configuration"
                    onClick={(e) => {
                      if (isEditMode) {
                        e.preventDefault();
                        onSelectBlock?.({
                          id: 'hero-cta-explore',
                          type: 'Liên Kết',
                          label: 'Link Khám Phá Thông Số',
                          style: blockStyles?.['hero-cta-explore'] || {}
                        });
                        return;
                      }
                    }}
                    style={{
                      ...(blockStyles?.['hero-cta-explore'] || {})
                    }}
                    className={`apple-link text-sm p-1 rounded-lg transition-all ${
                      activeBlockId === 'hero-cta-explore' ? 'ring-2 ring-[#0071e3] bg-white/10' : ''
                    }`}
                    title={isEditMode ? 'Nhấp để đổi kiểu chữ & màu sắc link khám phá' : undefined}
                  >
                    <EditableText
                      id="hero-cta-explore"
                      value={textOverrides?.['hero-cta-explore'] ?? t('hero.explore_specs')}
                      isEditing={isEditMode}
                      onChange={(val) => onUpdateTextOverride?.('hero-cta-explore', val)}
                      onSelectBlock={onSelectBlock}
                      isSelected={activeBlockId === 'hero-cta-explore'}
                      blockStyle={blockStyles?.['hero-cta-explore']}
                      allowDrag={false}
                    />
                    <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </a>
                  {isEditMode && onDeleteElement && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteElement('hero-cta-explore');
                      }}
                      className="opacity-0 group-hover/btnexp:opacity-100 absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-opacity cursor-pointer shadow z-10"
                      title="Xóa/Ẩn nút Khám Phá"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Hero Dramatic Visual (Floating Hardware Display with Direct Upload & Dropzone) */}
        <div className="relative pt-6 max-w-4xl mx-auto flex items-center justify-center">
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (onUpdateImageFile) {
                  onUpdateImageFile(file);
                } else {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onUpdateImage?.(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />

          {/* In Edit Mode: Persistent Quick Upload Button at top-right */}
          {isEditMode && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-8 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer ring-2 ring-black/80 apple-animate-in"
              title="Nhấn để tải ảnh sản phẩm mới từ máy tính"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>📸 Tải Ảnh Mới</span>
            </button>
          )}

          {/* Floor reflection effect & Dropzone */}
          <div 
            onDragOver={(e) => {
              if (!isEditMode) return;
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              if (!isEditMode) return;
              e.preventDefault();
              setIsDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith('image/')) {
                if (onUpdateImageFile) {
                  onUpdateImageFile(file);
                } else {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onUpdateImage?.(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
            style={{
              ...(blockStyles?.['hero-hardware-frame'] || {})
            }}
            onClick={() => {
              if (isEditMode) {
                onSelectBlock?.({
                  id: 'hero-hardware-frame',
                  type: 'Khung Ảnh Sản Phẩm',
                  label: 'Khung Trưng Bày Phần Cứng Hero',
                  style: blockStyles?.['hero-hardware-frame'] || {}
                });
              }
            }}
            className={`relative w-full aspect-[16/10] max-h-[520px] rounded-[32px] overflow-hidden bg-gradient-to-b from-[#111113] to-[#050505] border transition-all p-4 sm:p-8 flex items-center justify-center shadow-2xl group ${
              isDragOver
                ? 'border-[#0071e3] border-dashed ring-4 ring-[#0071e3]/30 scale-[1.01]'
                : activeBlockId === 'hero-hardware-frame'
                ? 'ring-4 ring-[#0071e3] border-solid'
                : isEditMode
                ? 'border-[#0071e3]/40 border-dashed hover:border-[#0071e3] cursor-pointer'
                : 'border-[#2d2d30]'
            }`}
          >
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* In Edit Mode: Upload Button Overlay */}
            {isEditMode && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="apple-btn-blue px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-2xl cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Tải ảnh từ máy tính (hoặc Kéo Thả File vào đây)</span>
                </button>
                <span className="text-[11px] text-[#a1a1a6]">
                  Hỗ trợ PNG, JPG, WebP độ phân giải cao
                </span>
              </div>
            )}

            {/* Dynamic Apple Floating Badges */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none gap-2">
              {!hiddenBadges.includes(0) && (
                <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-xl truncate max-w-[48%] pointer-events-auto flex items-center gap-1.5">
                  <EditableText
                    id="hero-badge-0"
                    value={product.features?.[0] || displayableSpecs[0] || product.name}
                    isEditing={isEditMode}
                    onChange={(val) => onUpdateBadge?.(0, val)}
                    onSelectBlock={onSelectBlock}
                    isSelected={activeBlockId === 'hero-badge-0'}
                    blockStyle={blockStyles?.['hero-badge-0']}
                    offset={textOffsets?.['hero-badge-0']}
                    onOffsetChange={onUpdateTextOffset}
                    as="span"
                  />
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleToggleHideBadge(0)}
                      className="text-neutral-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                      title="Xóa huy hiệu này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
              {!hiddenBadges.includes(1) && (
                <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-xl truncate max-w-[48%] pointer-events-auto flex items-center gap-1.5 ml-auto">
                  <EditableText
                    id="hero-badge-1"
                    value={product.features?.[1] || displayableSpecs[1] || 'Precision Craft'}
                    isEditing={isEditMode}
                    onChange={(val) => onUpdateBadge?.(1, val)}
                    onSelectBlock={onSelectBlock}
                    isSelected={activeBlockId === 'hero-badge-1'}
                    blockStyle={blockStyles?.['hero-badge-1']}
                    offset={textOffsets?.['hero-badge-1']}
                    onOffsetChange={onUpdateTextOffset}
                    as="span"
                  />
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleToggleHideBadge(1)}
                      className="text-neutral-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                      title="Xóa huy hiệu này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Restore Badges Bar in Edit Mode */}
          {isEditMode && hiddenBadges.length > 0 && (
            <div className="pt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => onUpdateTextOverride?.('hero-hidden-badges', '[]')}
                className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Khôi phục {hiddenBadges.length} huy hiệu ảnh Hero</span>
              </button>
            </div>
          )}

        </div>

        {/* Delivery & Warranty Guarantees */}
        {!hiddenElements.includes('hero-guarantee-pills') && (
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-xs text-[#86868b] border-t border-[#1d1d1f] max-w-2xl mx-auto">
          {!hiddenGuarantees.includes(0) && (
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2997ff]" />
              <EditableText
                id="hero-free-shipping"
                value={textOverrides?.['hero-free-shipping'] ?? t('hero.free_shipping')}
                isEditing={isEditMode}
                onChange={(val) => onUpdateTextOverride?.('hero-free-shipping', val)}
                onSelectBlock={onSelectBlock}
                isSelected={activeBlockId === 'hero-free-shipping'}
                blockStyle={blockStyles?.['hero-free-shipping']}
                allowDrag={false}
              />
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => handleToggleHideGuarantee(0)}
                  className="text-neutral-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                  title="Xóa cam kết giao hàng này"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          {!hiddenGuarantees.includes(1) && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#30d158]" />
              <EditableText
                id="hero-warranty"
                value={textOverrides?.['hero-warranty'] ?? t('hero.warranty')}
                isEditing={isEditMode}
                onChange={(val) => onUpdateTextOverride?.('hero-warranty', val)}
                onSelectBlock={onSelectBlock}
                isSelected={activeBlockId === 'hero-warranty'}
                blockStyle={blockStyles?.['hero-warranty']}
                allowDrag={false}
              />
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => handleToggleHideGuarantee(1)}
                  className="text-neutral-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                  title="Xóa cam kết bảo hành này"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          {isEditMode && hiddenGuarantees.length > 0 && (
            <button
              type="button"
              onClick={() => onUpdateTextOverride?.('hero-hidden-guarantees', '[]')}
              className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Khôi phục {hiddenGuarantees.length} cam kết</span>
            </button>
          )}
        </div>
        )}

      </div>
    </section>
  );
}
