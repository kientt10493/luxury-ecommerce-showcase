import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Eye, Cpu, Headphones, Shield, Sparkles, Zap, Layers, CheckCircle2, Award } from 'lucide-react';

export default function BentoFeatures({ product }) {
  const { t } = useLanguage();

  if (!product) return null;

  const features = product.features || [];
  const specs = product.specifications || {};
  const specEntries = Object.entries(specs);

  // Dynamic feature highlights derived from actual product data
  const feature1 = features[0] || product.tagline || product.name;
  const feature2 = features[1] || (specEntries[0] ? `${specEntries[0][0]}: ${specEntries[0][1]}` : 'Engineered Performance');
  const feature3 = features[2] || (specEntries[1] ? `${specEntries[1][0]}: ${specEntries[1][1]}` : 'Sensory Immersion');
  const feature4 = features[3] || (specEntries[2] ? `${specEntries[2][0]}: ${specEntries[2][1]}` : `${product.name} Craftsmanship`);

  // Key spec tags for Card 1 bottom bar
  const highlightTags = specEntries.length > 0 
    ? specEntries.slice(0, 3).map(([key, val]) => `${key}: ${val}`)
    : ['Precision Engineered', 'Apple Quality Standard', 'Tested & Certified'];

  return (
    <section id="innovations" className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-start">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Apple Style Section Headline */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[#ff9f0a] uppercase tracking-wider">
            {t('bento.badge')}
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#f5f5f7]">
            Get the highlights.
          </h2>
          <p className="text-lg text-[#86868b] max-w-2xl font-normal leading-relaxed">
            {product.tagline || t('bento.subtitle')}
          </p>
        </div>

        {/* Dynamic Apple Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Main Flagship Breakthrough (Large 8 Cols) */}
          <div className="md:col-span-8 p-8 sm:p-10 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-8 group shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2997ff]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="text-xs uppercase tracking-wider text-[#2997ff] font-semibold">
                {product.name}
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {feature1}
              </h3>
              <p className="text-[#86868b] text-base leading-relaxed font-normal">
                {product.description || t('bento.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
              {highlightTags.map((tag, idx) => (
                <React.Fragment key={idx}>
                  <span>{tag}</span>
                  {idx < highlightTags.length - 1 && <span className="text-[#424245]">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bento Card 2: Computational Silicon / Architecture (4 Cols) */}
          <div className="md:col-span-4 p-8 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-6 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff9f0a]">
              <Cpu className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-white leading-snug">
                {feature2}
              </h3>
              <p className="text-[#86868b] text-sm leading-relaxed">
                {specEntries[0] 
                  ? `Engineered with ${specEntries[0][0]}: ${specEntries[0][1]} for uncompromised fidelity.` 
                  : 'Engineered with bespoke hardware telemetry and micro-architecture for instant responsiveness.'}
              </p>
            </div>

            <div className="text-[11px] text-[#ff9f0a] font-mono font-medium">
              {specEntries[0] ? `${specEntries[0][0]} • Optimized` : 'Peak Efficiency'}
            </div>
          </div>

          {/* Bento Card 3: Sensory & Telemetry (4 Cols) */}
          <div className="md:col-span-4 p-8 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-6 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#30d158]">
              <Zap className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-white leading-snug">
                {feature3}
              </h3>
              <p className="text-[#86868b] text-sm leading-relaxed">
                {specEntries[1]
                  ? `Advanced integration featuring ${specEntries[1][0]}: ${specEntries[1][1]}.`
                  : 'Continuous telemetry feedback calibrated for real-time human interaction.'}
              </p>
            </div>

            <div className="text-[11px] text-[#30d158] font-mono font-medium">
              {specEntries[1] ? `${specEntries[1][0]} • Certified` : 'Precision Tuned'}
            </div>
          </div>

          {/* Bento Card 4: Materials & Craftsmanship (Large 8 Cols) */}
          <div className="md:col-span-8 p-8 sm:p-10 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-8 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#bf5af2]">
              <Shield className="w-6 h-6" />
            </div>

            <div className="space-y-4 max-w-lg">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {feature4}
              </h3>
              <p className="text-[#86868b] text-base leading-relaxed font-normal">
                {specEntries[2]
                  ? `Every component conforms to the highest industrial specifications, combining ${specEntries[2][0]}: ${specEntries[2][1]} with aerospace-grade durability.`
                  : 'Formed from premium materials selected for structural integrity, tactile satisfaction, and prolonged endurance.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
              <span>{product.variants?.length || 1} Configurations</span>
              <span className="text-[#424245]">•</span>
              <span>Global 2-Year Coverage</span>
              <span className="text-[#424245]">•</span>
              <span>100% Recyclable Packaging</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
