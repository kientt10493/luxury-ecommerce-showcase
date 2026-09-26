import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { paymentApi } from '../services/api';
import { CheckCircle2, ArrowLeft, Mail, Package } from 'lucide-react';

export default function OrderSuccessPage({ orderId, onBackToStore }) {
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#0071e3', '#2997ff', '#30d158', '#f5f5f7']
      });
    } catch (e) {}

    if (orderId) {
      paymentApi.getOrderStatus(orderId)
        .then((res) => {
          setOrder(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-black text-[#f5f5f7]">
      <div className="w-full max-w-lg rounded-[32px] bg-[#161617] p-8 sm:p-12 border border-[#2d2d30] shadow-2xl text-center space-y-8 apple-animate-in">
        
        {/* Apple Style Checkmark */}
        <div className="w-16 h-16 rounded-full bg-[#30d158]/10 text-[#30d158] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#30d158] uppercase tracking-wider">
            Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t('success.title')}
          </h1>
          <p className="text-sm text-[#86868b] max-w-sm mx-auto">
            {t('success.subtitle')}
          </p>
        </div>

        {/* Order Receipt Card */}
        <div className="bg-[#1d1d1f] p-6 rounded-2xl border border-[#333336] text-start space-y-4 text-xs">
          
          <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
            <span className="text-[#86868b]">{t('success.order_id')}</span>
            <span className="font-mono font-bold text-white text-sm">{orderId || "ORD-2026-CONFIRMED"}</span>
          </div>

          {order && (
            <>
              <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
                <span className="text-[#86868b]">Product</span>
                <span className="font-medium text-white">{order.product_name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
                <span className="text-[#86868b]">Customer</span>
                <span className="font-medium text-white">{order.customer_name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
                <span className="text-[#86868b]">{t('success.amount_paid')}</span>
                <span className="font-bold text-[#30d158] text-base">
                  {formatPrice(order.amount, order.currency)}
                </span>
              </div>
            </>
          )}

          <div className="pt-1 flex items-center gap-2 text-[#86868b] text-[11px]">
            <Mail className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
            <span>{t('success.support')}</span>
          </div>

        </div>

        {/* Return Button */}
        <div>
          <button
            onClick={onBackToStore}
            className="apple-btn-blue px-8 py-3 text-sm flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('success.continue_shopping')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
