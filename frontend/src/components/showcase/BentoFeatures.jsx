import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Eye, Cpu, Compass, Shield, BatteryCharging, Headphones, Sparkles } from 'lucide-react';

export default function BentoFeatures() {
  const { t } = useLanguage();

  return (
    <section id="innovations" className="py-24 px-4 lg:px-8 border-t border-white/10 bg-grid">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('bento.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t('bento.title')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            {t('bento.subtitle')}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Micro-OLED 4K (Large 2 Cols) */}
          <div className="md:col-span-2 glass-panel p-8 sm:p-10 space-y-6 glow-card relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Eye className="w-6 h-6" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-bold text-white">
                Dual Micro-OLED 4K Optical Matrix
              </h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Featuring 23 million pixels across two postal-stamp-sized displays. Each lens system is crafted with three-element optics to deliver razor-sharp clarity across your entire field of view.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-cyan-300">
              <div>• 120Hz PROMOTION</div>
              <div>• 96% DCI-P3 COLOR</div>
              <div>• HDR ULTRA-DYNAMIC</div>
            </div>
          </div>

          {/* Card 2: Neural Processing (1 Col) */}
          <div className="glass-panel p-8 space-y-6 glow-card">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Bespoke Dual-Silicon
              </h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Parallel M2 and R1 micro-architectures process real-time telemetry from 12 cameras in under 12 milliseconds.
              </p>
            </div>
          </div>

          {/* Card 3: Spatial Audio (1 Col) */}
          <div className="glass-panel p-8 space-y-6 glow-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Ray-Traced Spatial Audio
              </h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Dual-driver audio pods positioned right next to each ear match acoustic properties of your room seamlessly.
              </p>
            </div>
          </div>

          {/* Card 4: Aerospace Titanium (Large 2 Cols) */}
          <div className="md:col-span-2 glass-panel p-8 sm:p-10 space-y-6 glow-card relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-bold text-white">
                Aerospace-Grade Alloy Chassis
              </h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Milled from a solid billet of Grade 5 Titanium for the highest strength-to-weight ratio of any luxury wearable in existence, finished with an anti-reflective PVD coating.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-emerald-300">
              <div>• 448G ULTRALIGHT</div>
              <div>• CARBON CORE</div>
              <div>• ZERO THERMAL FLEX</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
