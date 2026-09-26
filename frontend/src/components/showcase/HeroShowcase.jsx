import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Layers, Cpu, Eye } from 'lucide-react';

export default function HeroShowcase({ product, onSelectProduct, onQuickBuy }) {
  const { t, isRTL } = useLanguage();
  const { formatPrice, currency } = useCurrency();

  if (!product) return null;

  const mainImage = (product.images && product.images[0]) || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="relative pt-12 pb-20 px-4 lg:px-8 overflow-hidden bg-grid">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text / Info Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-start">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.eyebrow')}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              {product.name}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              {product.tagline}
            </p>

            {/* Pricing Tag */}
            <div className="pt-2 flex items-baseline justify-center lg:justify-start gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                {t('hero.starting_at')}
              </span>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </div>
              {product.compare_at_price && (
                <span className="text-base line-through text-slate-500">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onQuickBuy(product)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>{t('hero.buy_now')}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <a
                href="#specs"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{t('hero.explore_specs')}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-2 gap-4 border-t border-white/10 text-xs text-slate-400 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t('hero.free_shipping')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('hero.warranty')}</span>
              </div>
            </div>

          </div>

          {/* Right Product Visual Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Center glow behind device */}
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="relative group w-full max-w-lg aspect-square rounded-3xl overflow-hidden glass-panel p-6 border-white/15 shadow-2xl flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Floating Feature Badges */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">Micro-OLED 4K</div>
                    <div className="text-[11px] text-slate-400">23M Pixels Ultra Reality</div>
                  </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">Dual Neural Chip</div>
                    <div className="text-[11px] text-slate-400">Sub-12ms Latency</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
