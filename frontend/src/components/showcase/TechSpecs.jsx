import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TechSpecs({ product }) {
  const { t } = useLanguage();

  if (!product) return null;

  const internalKeys = ['floating_images', 'section_order', 'canvas_elements'];
  const rawSpecs = Object.entries(product.specifications || {})
    .filter(([key, value]) => !internalKeys.includes(key) && typeof value !== 'object');

  const specs = rawSpecs.length > 0 ? rawSpecs : [
    ["Model Identifier", product.slug?.toUpperCase() || 'FLAGSHIP-01'],
    ["Available Finishes", product.variants?.map(v => v.attributes?.color).filter(Boolean).join(', ') || 'Space Black'],
    ["Configuration Options", product.variants?.map(v => v.attributes?.storage).filter(Boolean).join(', ') || 'Standard'],
    ["Inventory & Delivery", `${product.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 10} units in stock • Free 24h shipping`],
    ["Coverage", "2-Year global warranty with dedicated concierge support"]
  ];

  return (
    <section id="specs" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0b0c] border-t border-[#1d1d1f] text-start">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Specifications
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f5f7]">
            {product.name} Tech Specs
          </h2>
          <p className="text-base text-[#86868b]">
            {t('specs.subtitle')}
          </p>
        </div>

        {/* Minimalist Apple Specs List with Hairline Dividers */}
        <div className="border-t border-[#333336] divide-y divide-[#262629]">
          {specs.map(([label, value], idx) => (
            <div
              key={idx}
              className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline"
            >
              <div className="sm:col-span-4 text-sm font-semibold text-white">
                {label}
              </div>
              <div className="sm:col-span-8 text-sm text-[#a1a1a6] leading-relaxed">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
