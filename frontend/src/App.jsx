import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    // Check URL query or path
    if (window.location.pathname.includes('/admin')) return 'admin';
    if (window.location.pathname.includes('/order-success')) return 'success';
    return 'store';
  });

  const [completedOrderId, setCompletedOrderId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('order_id') || '';
  });

  const [activeCurrency, setActiveCurrency] = useState('USD');

  const handleLanguageChangeSyncCurrency = (defaultCurrency) => {
    setActiveCurrency(defaultCurrency);
  };

  const handleOrderSuccess = (orderId) => {
    setCompletedOrderId(orderId);
    setCurrentView('success');
    window.history.pushState({}, '', `/order-success?order_id=${orderId}`);
  };

  const handleBackToStore = () => {
    setCurrentView('store');
    window.history.pushState({}, '', '/');
  };

  const handleNavigateAdmin = () => {
    setCurrentView('admin');
    window.history.pushState({}, '', '/admin');
  };

  return (
    <ErrorBoundary>
      <CurrencyProvider initialCurrency={activeCurrency}>
        <LanguageProvider onLanguageChange={handleLanguageChangeSyncCurrency}>
          {currentView === 'store' && (
            <HomePage
              onNavigateAdmin={handleNavigateAdmin}
              onOrderSuccess={handleOrderSuccess}
            />
          )}

          {currentView === 'admin' && (
            <AdminPage
              onBackToStore={handleBackToStore}
            />
          )}

          {currentView === 'success' && (
            <OrderSuccessPage
              orderId={completedOrderId}
              onBackToStore={handleBackToStore}
            />
          )}
        </LanguageProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}
