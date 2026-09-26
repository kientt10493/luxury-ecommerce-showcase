import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { paymentApi } from '../../services/api';
import { X, Lock, CreditCard, QrCode, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function QuickBuyModal({ product, variant, onClose, onLaunchVietQR, onOrderSuccess }) {
  const { t, isRTL, language } = useLanguage();
  const { currency, formatPrice } = useCurrency();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Default gateway based on currency: VND -> VietQR, else -> Stripe
  const [gateway, setGateway] = useState(currency === 'VND' ? 'PAYOS_VIETQR' : 'STRIPE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product || !variant) return null;

  // Find price for active currency
  const priceObj = variant.prices?.find((p) => p.currency === currency) || variant.prices?.[0];
  const priceAmount = priceObj ? priceObj.price : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      product_id: product.id,
      variant_id: variant.id,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      currency: currency,
      language: language
    };

    try {
      if (gateway === 'PAYOS_VIETQR') {
        // Create PayOS VietQR
        const res = await paymentApi.createPayOSPayment(payload);
        setLoading(false);
        onLaunchVietQR(res.data);
      } else {
        // Create Stripe Session
        const res = await paymentApi.createStripeSession(payload);
        setLoading(false);
        // Check if demo sandbox simulation
        if (res.data.checkout_url.includes('gateway=STRIPE_MOCK_SUCCESS')) {
          // Trigger webhook simulation to mark as PAID
          await paymentApi.simulatePayOSWebhook({
            code: "00",
            data: { order_id: res.data.order_id }
          });
          onOrderSuccess(res.data.order_id);
        } else {
          // Redirect to real Stripe Checkout URL
          window.location.href = res.data.checkout_url;
        }
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 border-white/20 shadow-2xl animate-modal text-start">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>256-BIT SECURE CHECKOUT</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {t('checkout.title')}
          </h3>
          <p className="text-xs text-slate-400">
            {t('checkout.subtitle')}
          </p>
        </div>

        {/* Item Summary Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={variant.variant_image || product.images?.[0]}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-white/15"
            />
            <div>
              <div className="text-sm font-bold text-white">{product.name}</div>
              <div className="text-xs text-slate-400 font-mono">
                {variant.sku} • {variant.attributes?.color}
              </div>
            </div>
          </div>
          <div className="text-end">
            <div className="text-base font-extrabold text-cyan-300">
              {formatPrice(priceAmount)}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">
              {currency}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Form Fields */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {t('checkout.customer_name')} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe / Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t('checkout.customer_email')} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t('checkout.customer_phone')} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+84 912345678"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {t('checkout.shipping_address')}
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="City, District, Street address"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>

          {/* Payment Gateway Selector */}
          <div className="pt-2 space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Payment Gateway
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* VietQR Option */}
              <div
                onClick={() => setGateway('PAYOS_VIETQR')}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                  gateway === 'PAYOS_VIETQR'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">VietQR / PayOS</div>
                  <div className="text-[10px] text-slate-400">Chuyển khoản Napas 24/7</div>
                </div>
              </div>

              {/* Stripe Option */}
              <div
                onClick={() => setGateway('STRIPE')}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                  gateway === 'STRIPE'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Stripe Checkout</div>
                  <div className="text-[10px] text-slate-400">Visa / Master / Apple Pay</div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('checkout.processing')}</span>
                </>
              ) : (
                <>
                  <span>{t('checkout.submit_payment')} • {formatPrice(priceAmount)}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('checkout.secure_badge')}</span>
            </span>
          </div>

        </form>

      </div>
    </div>
  );
}
