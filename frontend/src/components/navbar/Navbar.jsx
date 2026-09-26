import React, { useState } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '../../contexts/CurrencyContext';
import { ChevronDown, Shield, ShoppingBag, Pencil } from 'lucide-react';

export default function Navbar({ 
  productName = "Aura Vision Pro", 
  productPrice = "", 
  onOpenQuickBuy, 
  onNavigateAdmin, 
  onNavigateHome, 
  isCurrentAdmin,
  onToggleLiveEdit,
  isLiveEditActive = false
}) {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { currency, setCurrency, getCurrencyMeta } = useCurrency();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const activeCurr = getCurrencyMeta();

  return (
    <div className="sticky top-0 z-50 w-full select-none">
      
      {/* 1. Global Apple Navigation Bar (44px) */}
      <header className="w-full apple-nav-glass px-4 sm:px-8 h-11 flex items-center justify-between text-xs text-[#d6d6d6]">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          
          {/* Apple-style Minimal Logo */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer text-[#f5f5f7] hover:text-white transition-colors"
          >
            {/* Minimalist Apple-like Symbol */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span className="font-semibold tracking-tight text-sm text-white">
              {t('nav.brand')}
            </span>
          </div>

          {/* Navigation Links (Apple Center Menu) */}
          {!isCurrentAdmin && (
            <nav className="hidden md:flex items-center gap-8 text-[12px] text-[#a1a1a6]">
              <a href="#overview" className="hover:text-[#f5f5f7] transition-colors">
                {t('nav.products')}
              </a>
              <a href="#innovations" className="hover:text-[#f5f5f7] transition-colors">
                {t('nav.features')}
              </a>
              <a href="#specs" className="hover:text-[#f5f5f7] transition-colors">
                {t('nav.specs')}
              </a>
            </nav>
          )}

          {/* Right Selectors: Language & Currency */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
                className="flex items-center gap-1 text-[11px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors px-1 py-1 rounded"
              >
                <span>{activeLang.flag}</span>
                <span className="hidden sm:inline">{activeLang.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {langOpen && (
                <div className={`absolute top-full mt-2 w-44 rounded-2xl bg-[#1d1d1f] border border-[#424245] p-1.5 shadow-2xl z-50 apple-animate-in ${isRTL ? 'left-0' : 'right-0'}`}>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        language === l.code ? 'bg-[#0071e3] text-white font-medium' : 'text-[#f5f5f7] hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      <span className="text-[10px] opacity-75 font-mono uppercase">
                        {l.defaultCurrency}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Switcher */}
            <div className="relative">
              <button
                onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
                className="flex items-center gap-1 text-[11px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors px-1 py-1 rounded"
              >
                <span>{activeCurr.symbol}</span>
                <span>{activeCurr.code}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {currOpen && (
                <div className={`absolute top-full mt-2 w-44 rounded-2xl bg-[#1d1d1f] border border-[#424245] p-1.5 shadow-2xl z-50 apple-animate-in ${isRTL ? 'left-0' : 'right-0'}`}>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setCurrOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        currency === c.code ? 'bg-[#0071e3] text-white font-medium' : 'text-[#f5f5f7] hover:bg-white/10'
                      }`}
                    >
                      <span className="font-medium text-white">{c.code} ({c.symbol})</span>
                      <span className="text-[10px] text-[#86868b]">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Edit Mode Button */}
            {!isCurrentAdmin && onToggleLiveEdit && (
              <button
                onClick={onToggleLiveEdit}
                title="Chỉnh sửa nội dung trực tiếp như Word"
                className={`px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLiveEditActive
                    ? 'bg-[#0071e3] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-[#a1a1a6] hover:text-[#f5f5f7] border border-white/10'
                }`}
              >
                <Pencil className="w-3 h-3 text-[#2997ff]" />
                <span className="hidden sm:inline">
                  {isLiveEditActive ? 'Đang Sửa Trực Tiếp' : 'Sửa Trực Tiếp (Word)'}
                </span>
              </button>
            )}

            {/* Admin Portal Shortcut */}
            <button
              onClick={onNavigateAdmin}
              title={t('nav.admin')}
              className={`p-1 text-[11px] flex items-center gap-1 transition-colors ${
                isCurrentAdmin ? 'text-[#ff9f0a]' : 'text-[#a1a1a6] hover:text-[#f5f5f7]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav.admin')}</span>
            </button>

          </div>

        </div>
      </header>

      {/* 2. Apple Iconic Product Sub-Navigation Ribbon (52px) */}
      {!isCurrentAdmin && (
        <div className="w-full apple-subnav-glass px-4 sm:px-8 h-[52px] flex items-center border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
            
            {/* Product Title */}
            <div className="text-base sm:text-lg font-semibold tracking-tight text-[#f5f5f7]">
              {productName}
            </div>

            {/* Subnav links + Buy button */}
            <div className="flex items-center gap-5 sm:gap-6 text-xs">
              <a href="#overview" className="hidden sm:inline text-[#f5f5f7] hover:text-[#2997ff] transition-colors">
                Overview
              </a>
              <a href="#specs" className="hidden sm:inline text-[#86868b] hover:text-[#f5f5f7] transition-colors">
                Tech Specs
              </a>

              {productPrice && (
                <span className="hidden sm:inline font-medium text-[#86868b]">
                  {productPrice}
                </span>
              )}

              {/* Apple Signature Blue "Buy" Pill Button */}
              <button
                onClick={onOpenQuickBuy}
                className="apple-btn-blue px-4 py-1.5 text-xs tracking-tight shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('hero.buy_now')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
