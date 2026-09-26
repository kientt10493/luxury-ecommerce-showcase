import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸', dir: 'ltr', defaultCurrency: 'USD' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr', defaultCurrency: 'VND' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl', defaultCurrency: 'SAR' }
];

export const LanguageProvider = ({ children, onLanguageChange }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('aura_language') || 'en';
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Update HTML dir and lang attributes
    const isRtl = language === 'ar';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('aura_language', language);

    // Fetch translations JSON
    fetch(`/locales/${language}.json`)
      .then((res) => res.json())
      .then((data) => setTranslations(data))
      .catch((err) => console.error(`Failed to load ${language} translation:`, err));

    if (onLanguageChange) {
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      if (match) {
        onLanguageChange(match.defaultCurrency);
      }
    }
  }, [language]);

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
  };

  // Helper t('nav.brand')
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let current = translations;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return path; // Fallback to key
      }
    }
    if (typeof current === 'string') {
      let str = current;
      Object.keys(params).forEach((p) => {
        str = str.replace(new RegExp(`{{${p}}}`, 'g'), params[p]);
      });
      return str;
    }
    return current;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
