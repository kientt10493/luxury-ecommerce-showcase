import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { paymentApi } from '../services/api';
import { CheckCircle2, PackageCheck, Sparkles, ArrowLeft, Mail, Clock, ShieldCheck } from 'lucide-react';

export default function OrderSuccessPage({ orderId, onBackToStore }) {
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive luxury confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#f59e0b', '#ffffff']
      });
    } catch (e) {}

    // Fetch order details
    if (orderId) {
      paymentApi.getOrderStatus(orderId)
        .then((res) => {
          setOrder(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen py-24 px-4 lg:px-8 flex items-center justify-center bg-grid">
      <div className="relative w-full max-w-xl glass-panel p-8 sm:p-12 border-emerald-500/30 shadow-2xl text-center space-y-8 animate-modal">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            {t('success.status')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {t('success.title')}
          </h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto font-light">
            {t('success.subtitle')}
          </p>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-black/50 p-6 rounded-2xl border border-white/10 text-start space-y-4 text-xs">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-slate-400">{t('success.order_id')}</span>
            <span className="font-mono font-bold text-cyan-300 text-sm">{orderId || "ORD-2026-CONFIRMED"}</span>
          </div>

          {order && (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Product Acquisition</span>
                <span className="font-bold text-white text-end">{order.product_name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Customer</span>
                <span className="font-medium text-white">{order.customer_name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">{t('success.amount_paid')}</span>
                <span className="font-black text-emerald-300 text-base">
                  {formatPrice(order.amount, order.currency)}
                </span>
              </div>
            </>
          )}

          <div className="pt-2 flex items-center gap-2 text-slate-400 text-[11px]">
            <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{t('success.support')}</span>
          </div>

        </div>

        {/* Return Button */}
        <div>
          <button
            onClick={onBackToStore}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('success.continue_shopping')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
