import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'VND', symbol: '₫', name: 'Việt Nam Đồng', locale: 'vi-VN' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' }
];

export const CurrencyProvider = ({ children, initialCurrency = 'USD' }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('aura_currency') || initialCurrency;
  });

  useEffect(() => {
    localStorage.setItem('aura_currency', currency);
  }, [currency]);

  const setCurrency = (newCurr) => {
    setCurrencyState(newCurr);
  };

  const formatPrice = (amount, customCurrency = null) => {
    const activeCurr = customCurrency || currency;
    const num = Number(amount);
    if (isNaN(num)) return `${amount} ${activeCurr}`;

    try {
      if (activeCurr === 'VND') {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0
        }).format(num);
      } else if (activeCurr === 'SAR') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'SAR',
          currencyDisplay: 'narrowSymbol',
          maximumFractionDigits: 2
        }).format(num);
      } else {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2
        }).format(num);
      }
    } catch (e) {
      return `${num} ${activeCurr}`;
    }
  };

  const getCurrencyMeta = (code = currency) => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getCurrencyMeta, supportedCurrencies: SUPPORTED_CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
