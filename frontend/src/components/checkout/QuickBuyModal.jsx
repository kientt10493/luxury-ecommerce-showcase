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

  const [gateway, setGateway] = useState(currency === 'VND' ? 'PAYOS_VIETQR' : 'STRIPE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product || !variant) return null;

  const priceObj = variant.prices?.find((p) => p.currency === currency) || variant.prices?.[0];
  const priceAmount = priceObj ? priceObj.price : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
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
        const res = await paymentApi.createPayOSPayment(payload);
        setLoading(false);
        onLaunchVietQR(res.data);
      } else {
        const res = await paymentApi.createStripeSession(payload);
        setLoading(false);
        if (res.data.checkout_url.includes('gateway=STRIPE_MOCK_SUCCESS')) {
          await paymentApi.simulatePayOSWebhook({
            code: "00",
            data: { order_id: res.data.order_id }
          });
          onOrderSuccess(res.data.order_id);
        } else {
          window.location.href = res.data.checkout_url;
        }
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-[28px] bg-[#1d1d1f] p-6 sm:p-8 border border-[#38383a] shadow-2xl apple-animate-in text-start text-[#f5f5f7]">
        
        {/* Apple Close button */}
        <button
          onClick={onClose}
          className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-8 h-8 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#a1a1a6] hover:text-white flex items-center justify-center transition-all cursor-pointer`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
            <Lock className="w-3.5 h-3.5 text-[#30d158]" />
            <span>Apple-grade End-to-End Encryption</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {t('checkout.title')}
          </h3>
          <p className="text-xs text-[#86868b]">
            {t('checkout.subtitle')}
          </p>
        </div>

        {/* Order Preview Badge */}
        <div className="p-4 rounded-2xl bg-[#161617] border border-[#2d2d30] flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={variant.variant_image || product.images?.[0]}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-contain bg-black/40 border border-white/10"
            />
            <div>
              <div className="text-sm font-semibold text-white">{product.name}</div>
              <div className="text-xs text-[#86868b]">{variant.attributes?.color} • {variant.attributes?.storage}</div>
            </div>
          </div>
          <div className="text-end">
            <div className="text-base font-bold text-white">{formatPrice(priceAmount)}</div>
            <div className="text-[10px] text-[#86868b] uppercase font-mono">{currency}</div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-[#a1a1a6] mb-1.5">
              {t('checkout.customer_name')} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl bg-[#161617] border border-[#333336] text-white text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#a1a1a6] mb-1.5">
                {t('checkout.customer_email')} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#161617] border border-[#333336] text-white text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#a1a1a6] mb-1.5">
                {t('checkout.customer_phone')} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
                className="w-full px-4 py-3 rounded-xl bg-[#161617] border border-[#333336] text-white text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a1a1a6] mb-1.5">
              {t('checkout.shipping_address')}
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Delivery address"
              className="w-full px-4 py-2.5 rounded-xl bg-[#161617] border border-[#333336] text-white text-sm focus:outline-none focus:border-[#0071e3] transition-colors resize-none"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 space-y-2">
            <label className="block text-xs font-medium text-[#a1a1a6]">
              Payment Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setGateway('PAYOS_VIETQR')}
                className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  gateway === 'PAYOS_VIETQR'
                    ? 'border-[#0071e3] bg-[#0071e3]/10 text-white'
                    : 'border-[#333336] bg-[#161617] text-[#86868b] hover:border-[#555559]'
                }`}
              >
                <QrCode className="w-5 h-5 text-[#2997ff]" />
                <div>
                  <div className="text-xs font-semibold text-white">VietQR / PayOS</div>
                  <div className="text-[10px] text-[#86868b]">Napas 24/7 Bank Transfer</div>
                </div>
              </div>

              <div
                onClick={() => setGateway('STRIPE')}
                className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  gateway === 'STRIPE'
                    ? 'border-[#0071e3] bg-[#0071e3]/10 text-white'
                    : 'border-[#333336] bg-[#161617] text-[#86868b] hover:border-[#555559]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#2997ff]" />
                <div>
                  <div className="text-xs font-semibold text-white">Credit Card / Stripe</div>
                  <div className="text-[10px] text-[#86868b]">Visa, Master, Apple Pay</div>
                </div>
              </div>
            </div>
          </div>

          {/* Apple Submit Pill Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full apple-btn-blue text-white font-medium text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('checkout.processing')}</span>
                </>
              ) : (
                <>
                  <span>Place Order • {formatPrice(priceAmount)}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
