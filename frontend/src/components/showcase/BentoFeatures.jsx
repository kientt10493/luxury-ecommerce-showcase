import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Eye, Cpu, Headphones, Shield, Sparkles } from 'lucide-react';

export default function BentoFeatures() {
  const { t } = useLanguage();

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
          <p className="text-lg text-[#86868b] max-w-xl font-normal">
            {t('bento.subtitle')}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: 4K Displays (Large 8 Cols) */}
          <div className="md:col-span-8 p-8 sm:p-10 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-8 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2997ff]">
              <Eye className="w-6 h-6" />
            </div>

            <div className="space-y-3 max-w-lg">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                23 million pixels.<br />
                <span className="text-[#86868b]">3D display system.</span>
              </h3>
              <p className="text-[#86868b] text-base leading-relaxed font-normal">
                Featuring custom dual micro-OLED displays that pack more pixels than a 4K television into each eye. The three-element optic system creates an expansive, sharp canvas anywhere you look.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
              <span>120Hz ProMotion</span>
              <span>•</span>
              <span>Wide Color (P3)</span>
              <span>•</span>
              <span>Sub-millimeter Tracking</span>
            </div>
          </div>

          {/* Bento Card 2: Neural Silicon (4 Cols) */}
          <div className="md:col-span-4 p-8 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff9f0a]">
              <Cpu className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Dual-chip performance.
              </h3>
              <p className="text-[#86868b] text-sm leading-relaxed">
                M2 runs visionOS while the new R1 chip streams images to the displays within 12 milliseconds — 8x faster than the blink of an eye.
              </p>
            </div>

            <div className="text-[11px] text-[#ff9f0a] font-mono">
              Virtually lag-free real-time view
            </div>
          </div>

          {/* Bento Card 3: Spatial Audio (4 Cols) */}
          <div className="md:col-span-4 p-8 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#30d158]">
              <Headphones className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Spatial Audio. Everywhere.
              </h3>
              <p className="text-[#86868b] text-sm leading-relaxed">
                Dual-driver audio pods positioned right next to each ear deliver personalized sound matching your physical room acoustics.
              </p>
            </div>

            <div className="text-[11px] text-[#30d158] font-mono">
              Ray-traced acoustic tuning
            </div>
          </div>

          {/* Bento Card 4: Aerospace Titanium (8 Cols) */}
          <div className="md:col-span-8 p-8 sm:p-10 rounded-[32px] bg-[#161617] border border-[#2d2d30] hover:border-[#424245] transition-all flex flex-col justify-between space-y-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#bf5af2]">
              <Shield className="w-6 h-6" />
            </div>

            <div className="space-y-3 max-w-lg">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Aerospace-grade titanium.<br />
                <span className="text-[#86868b]">Strong. Light. Pro.</span>
              </h3>
              <p className="text-[#86868b] text-base leading-relaxed font-normal">
                Crafted from a custom alloy frame that gently curves around your face. Modular parts let you tailor your fit with millimeter precision.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
              <span>Lightweight Design</span>
              <span>•</span>
              <span>Thermal Cooling</span>
              <span>•</span>
              <span>Zero Flex Frame</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
