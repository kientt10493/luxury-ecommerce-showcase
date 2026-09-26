import React, { useState } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '../../contexts/CurrencyContext';
import { Globe, DollarSign, Shield, Zap, Sparkles, ChevronDown } from 'lucide-react';

export default function Navbar({ onOpenQuickBuy, onNavigateAdmin, onNavigateHome, isCurrentAdmin }) {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { currency, setCurrency, getCurrencyMeta } = useCurrency();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const activeCurr = getCurrencyMeta();

  return (
    <header className="sticky top-0 z-40 w-full glass-nav px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/40 to-white/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400/60 transition-all">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse-subtle" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {t('nav.brand')}
            </span>
            <span className="hidden sm:inline-block text-[10px] tracking-widest text-cyan-400/80 font-mono block uppercase">
              {t('nav.tagline')}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        {!isCurrentAdmin && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#products" className="hover:text-cyan-400 transition-colors">
              {t('nav.products')}
            </a>
            <a href="#innovations" className="hover:text-cyan-400 transition-colors">
              {t('nav.features')}
            </a>
            <a href="#specs" className="hover:text-cyan-400 transition-colors">
              {t('nav.specs')}
            </a>
          </nav>
        )}

        {/* Right Actions: Language Switcher, Currency Selector, Admin & CTA */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-all"
            >
              <span>{activeLang.flag}</span>
              <span className="hidden sm:inline">{activeLang.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langOpen && (
              <div className={`absolute top-full mt-2 w-44 rounded-xl glass-panel p-1.5 shadow-2xl z-50 animate-modal ${isRTL ? 'left-0' : 'right-0'}`}>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                      language === l.code ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {l.defaultCurrency}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all"
            >
              <span>{activeCurr.symbol}</span>
              <span>{activeCurr.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400/70" />
            </button>

            {currOpen && (
              <div className={`absolute top-full mt-2 w-48 rounded-xl glass-panel p-1.5 shadow-2xl z-50 animate-modal ${isRTL ? 'left-0' : 'right-0'}`}>
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                      currency === c.code ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-semibold text-cyan-200">{c.code} ({c.symbol})</span>
                    <span className="text-[10px] text-slate-400">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Portal Toggle */}
          <button
            onClick={onNavigateAdmin}
            title={t('nav.admin')}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              isCurrentAdmin
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden lg:inline">{t('nav.admin')}</span>
          </button>

          {/* Quick Buy CTA */}
          {!isCurrentAdmin && (
            <button
              onClick={onOpenQuickBuy}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>{t('nav.quick_buy')}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
