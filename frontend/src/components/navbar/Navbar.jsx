import React, { useState } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '../../contexts/CurrencyContext';
import { ChevronDown, Shield, ShoppingBag, Pencil, Plus, Trash2, ChevronLeft, ChevronRight, RotateCcw, Link as LinkIcon } from 'lucide-react';
import SubnavItemEditModal from './SubnavItemEditModal';

export const DEFAULT_SUBNAV_ITEMS = [
  { id: 'item-overview', label: 'Overview', href: '#overview', type: 'link', styleVariant: 'default' },
  { id: 'item-specs', label: 'Tech Specs', href: '#specs', type: 'link', styleVariant: 'default' }
];

export default function Navbar({ 
  productName = "Aura Vision Pro", 
  productPrice = "", 
  onOpenQuickBuy, 
  onNavigateAdmin, 
  onNavigateHome, 
  isCurrentAdmin,
  onToggleLiveEdit,
  isLiveEditActive = false,
  subnavItems = DEFAULT_SUBNAV_ITEMS,
  onUpdateSubnavItems,
  onUpdateProductName
}) {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { currency, setCurrency, getCurrencyMeta } = useCurrency();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);

  // Subnav Edit Modal state
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const activeCurr = getCurrencyMeta();

  const currentItems = Array.isArray(subnavItems) && subnavItems.length > 0 
    ? subnavItems 
    : DEFAULT_SUBNAV_ITEMS;

  const handleOpenAddModal = () => {
    setEditingItem({
      id: `subnav-${Date.now()}`,
      label: 'Mục mới',
      href: '#innovations',
      type: 'link',
      styleVariant: 'default',
      newTab: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (savedItem) => {
    const exists = currentItems.some((it) => it.id === savedItem.id);
    let updated;
    if (exists) {
      updated = currentItems.map((it) => it.id === savedItem.id ? savedItem : it);
    } else {
      updated = [...currentItems, savedItem];
    }
    onUpdateSubnavItems?.(updated);
  };

  const handleDeleteItem = (itemId) => {
    const updated = currentItems.filter((it) => it.id !== itemId);
    onUpdateSubnavItems?.(updated);
  };

  const handleMoveItem = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= currentItems.length) return;
    const updated = [...currentItems];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onUpdateSubnavItems?.(updated);
  };

  const handleResetDefaults = () => {
    onUpdateSubnavItems?.(DEFAULT_SUBNAV_ITEMS);
  };

  const handleNavClick = (e, item) => {
    if (isLiveEditActive) {
      // In edit mode, clicking opens edit modal instead of navigating away
      e.preventDefault();
      handleOpenEditModal(item);
      return;
    }

    if (item.href?.startsWith('#')) {
      e.preventDefault();
      const targetId = item.href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
                className="flex items-center gap-1 text-[11px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors px-1 py-1 rounded cursor-pointer"
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
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
                className="flex items-center gap-1 text-[11px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors px-1 py-1 rounded cursor-pointer"
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
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
              className={`p-1 text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
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
        <div className={`w-full apple-subnav-glass px-4 sm:px-8 min-h-[52px] py-1.5 flex items-center border-t border-white/[0.04] transition-all ${
          isLiveEditActive ? 'bg-[#161617]/95 border-b border-[#0071e3]/40 shadow-lg shadow-blue-500/5' : ''
        }`}>
          <div className="max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Product Title */}
            <div className="flex items-center gap-2">
              <div className="text-base sm:text-lg font-semibold tracking-tight text-[#f5f5f7]">
                {productName}
              </div>
              {isLiveEditActive && (
                <span className="px-2 py-0.5 rounded-md bg-[#0071e3]/20 border border-[#0071e3]/30 text-[10px] text-[#2997ff] font-medium hidden md:inline">
                  Thanh Ribbon Subnav
                </span>
              )}
            </div>

            {/* Right: Subnav items + Price + Buy button */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs">
              
              {/* Dynamic Subnav Items List */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {currentItems.map((item, index) => {
                  const isButton = item.type === 'button';
                  const isGlass = item.styleVariant === 'glass';
                  const isPrimary = item.styleVariant === 'primary' || (!item.styleVariant && isButton);

                  return (
                    <div 
                      key={item.id || index}
                      className={`group relative flex items-center transition-all ${
                        isLiveEditActive ? 'p-1 rounded-xl bg-white/5 border border-white/10 hover:border-[#0071e3]/60 hover:bg-[#0071e3]/10' : ''
                      }`}
                    >
                      {/* Actual Element */}
                      {isButton ? (
                        <a
                          href={item.href || '#overview'}
                          target={item.newTab ? '_blank' : undefined}
                          rel={item.newTab ? 'noreferrer' : undefined}
                          onClick={(e) => handleNavClick(e, item)}
                          className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                            isGlass
                              ? 'bg-white/10 hover:bg-white/20 text-[#f5f5f7] border border-white/20 backdrop-blur-md'
                              : 'apple-btn-blue text-white shadow-sm'
                          }`}
                        >
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <a
                          href={item.href || '#overview'}
                          target={item.newTab ? '_blank' : undefined}
                          rel={item.newTab ? 'noreferrer' : undefined}
                          onClick={(e) => handleNavClick(e, item)}
                          className="px-1.5 py-0.5 text-[#d2d2d7] hover:text-[#2997ff] transition-colors cursor-pointer font-normal text-xs"
                        >
                          {item.label}
                        </a>
                      )}

                      {/* Live Edit Mode Controls on each item */}
                      {isLiveEditActive && (
                        <div className="flex items-center gap-0.5 ml-1.5 bg-[#1d1d1f] p-0.5 rounded-lg border border-white/15 shadow-md">
                          {/* Move Left */}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveItem(index, -1)}
                              title="Dời sang trái"
                              className="p-1 hover:bg-white/10 rounded text-[#86868b] hover:text-white transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}

                          {/* Edit Details */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            title="Tùy chỉnh nút này (Đổi tên, Đổi link, Đổi kiểu dáng)"
                            className="p-1 hover:bg-[#0071e3] rounded text-[#2997ff] hover:text-white transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>

                          {/* Delete Item */}
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Xóa nút này"
                            className="p-1 hover:bg-red-500 rounded text-red-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* Move Right */}
                          {index < currentItems.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveItem(index, 1)}
                              title="Dời sang phải"
                              className="p-1 hover:bg-white/10 rounded text-[#86868b] hover:text-white transition-colors cursor-pointer"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add New Item Button (visible when Live Edit is ON) */}
                {isLiveEditActive && (
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    title="Thêm nút / liên kết điều hướng mới"
                    className="px-2.5 py-1 rounded-xl bg-[#0071e3]/20 hover:bg-[#0071e3]/30 border border-[#0071e3]/40 text-[#2997ff] hover:text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nút</span>
                  </button>
                )}

                {/* Reset to defaults button if modified */}
                {isLiveEditActive && currentItems.length === 0 && (
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Khôi phục mặc định</span>
                  </button>
                )}
              </div>

              {/* Price display */}
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

      {/* Edit Modal for Subnav Items */}
      <SubnavItemEditModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />

    </div>
  );
}
