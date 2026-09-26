import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ChevronRight, Truck, ShieldCheck } from 'lucide-react';
import EditableText from '../common/EditableText';

export default function HeroShowcase({ 
  product, 
  allProducts = [], 
  onSelectProduct, 
  onQuickBuy,
  isEditMode = false,
  onUpdateField
}) {
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  if (!product) return null;

  const mainImage = (product.images && product.images[0]) || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop";

  return (
    <section id="overview" className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center bg-black overflow-hidden select-none">
      
      {/* Background dramatic ambient illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#1a2333]/40 via-transparent to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Apple Product Model Toggle Pills */}
        {allProducts.length > 1 && (
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
          
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-[#ff9f0a] uppercase">
            {t('hero.eyebrow')}
          </div>

          <div>
            <EditableText
              value={product.name}
              isEditing={isEditMode}
              onChange={(val) => onUpdateField?.('name', val)}
              as="h1"
              className="text-5xl sm:text-7xl font-bold tracking-tight text-[#f5f5f7] leading-[1.05]"
            />
          </div>

          <div>
            <EditableText
              value={product.tagline}
              isEditing={isEditMode}
              onChange={(val) => onUpdateField?.('tagline', val)}
              as="p"
              className="text-xl sm:text-2xl text-[#86868b] font-normal leading-relaxed max-w-2xl mx-auto"
            />
          </div>

          <div>
            <EditableText
              value={product.description || ''}
              isEditing={isEditMode}
              onChange={(val) => onUpdateField?.('description', val)}
              as="p"
              multiline={true}
              placeholder="Nhấp để thêm đoạn văn giới thiệu sản phẩm..."
              className="text-sm sm:text-base text-[#a1a1a6] font-normal leading-relaxed max-w-2xl mx-auto pt-1"
            />
          </div>

          {/* Pricing Tag */}
          <div className="pt-2 text-base text-[#86868b] flex items-center justify-center gap-2">
            <span>{t('hero.starting_at')}</span>
            <span className="text-white font-semibold text-lg">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="line-through text-[#6e6e73] text-sm">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Apple Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onQuickBuy(product)}
              className="apple-btn-blue px-7 py-2.5 text-sm shadow-lg shadow-blue-500/20 font-medium cursor-pointer"
            >
              {t('hero.buy_now')}
            </button>

            <a
              href="#configuration"
              className="apple-link text-sm"
            >
              <span>{t('hero.explore_specs')}</span>
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </a>
          </div>

        </div>

        {/* Hero Dramatic Visual (Floating Hardware Display) */}
        <div className="relative pt-6 max-w-4xl mx-auto flex items-center justify-center">
          
          {/* Floor reflection effect */}
          <div className="relative w-full aspect-[16/10] max-h-[520px] rounded-[32px] overflow-hidden bg-gradient-to-b from-[#111113] to-[#050505] border border-[#2d2d30] p-4 sm:p-8 flex items-center justify-center shadow-2xl group">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Dynamic Apple Floating Badges */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none gap-2">
              <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-xl truncate max-w-[48%]">
                {product.features?.[0] || Object.values(product.specifications || {})[0] || product.name}
              </div>
              <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-xl truncate max-w-[48%]">
                {product.features?.[1] || Object.values(product.specifications || {})[1] || 'Precision Craft'}
              </div>
            </div>
          </div>

        </div>

        {/* Delivery & Warranty Guarantees */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-xs text-[#86868b] border-t border-[#1d1d1f] max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2997ff]" />
            <span>{t('hero.free_shipping')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#30d158]" />
            <span>{t('hero.warranty')}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
