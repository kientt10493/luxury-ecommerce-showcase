import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sliders, CheckCircle2 } from 'lucide-react';

export default function TechSpecs({ product }) {
  const { t } = useLanguage();

  if (!product || !product.specifications) return null;

  const specs = Object.entries(product.specifications);

  return (
    <section id="specs" className="py-20 px-4 lg:px-8 border-t border-white/10">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>AURA ENGINEERING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('specs.title')}
          </h2>
          <p className="text-slate-400 text-sm font-light">
            {t('specs.subtitle')}
          </p>
        </div>

        {/* Specs Table */}
        <div className="glass-panel overflow-hidden border-white/15 divide-y divide-white/10 shadow-2xl">
          {specs.map(([label, value], idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 px-6 py-5 hover:bg-white/[0.02] transition-colors items-center gap-2 sm:gap-6"
            >
              <div className="sm:col-span-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{label}</span>
              </div>
              <div className="sm:col-span-8 text-sm font-medium text-white">
                {value}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
