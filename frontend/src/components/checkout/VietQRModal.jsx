import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { paymentApi } from '../../services/api';
import { X, Copy, Check, Clock, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VietQRModal({ paymentData, onClose, onPaymentSuccess }) {
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isPaid, setIsPaid] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const orderId = paymentData?.order_id;

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!orderId || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await paymentApi.getOrderStatus(orderId);
        if (res.data?.payment_status === 'PAID') {
          setIsPaid(true);
          clearInterval(interval);
          setTimeout(() => {
            onPaymentSuccess(orderId);
          }, 1500);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, isPaid]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulatePayment = async () => {
    setSimulating(true);
    try {
      await paymentApi.simulatePayOSWebhook({
        code: "00",
        desc: "success",
        data: {
          orderCode: paymentData.gateway_order_code,
          amount: paymentData.amount,
          description: paymentData.description,
          order_id: orderId
        }
      });
    } catch (err) {
      console.error('Simulation error:', err);
      setSimulating(false);
    }
  };

  if (!paymentData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-md rounded-[28px] bg-[#1d1d1f] p-6 sm:p-8 border border-[#38383a] shadow-2xl apple-animate-in text-start text-[#f5f5f7]">
        
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-8 h-8 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#a1a1a6] hover:text-white flex items-center justify-center transition-all cursor-pointer`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2c2c2e] text-[#86868b] text-[11px] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>Expires in {formatTimer(timeLeft)}</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {t('vietqr.title')}
          </h3>
          <p className="text-xs text-[#86868b] max-w-xs mx-auto">
            {t('vietqr.instruction')}
          </p>
        </div>

        {/* Main QR Display */}
        <div className="relative p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-2xl mx-auto max-w-[240px] mb-6">
          {isPaid ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-2 text-[#30d158]">
              <CheckCircle2 className="w-14 h-14 stroke-[2.5] animate-bounce" />
              <span className="font-bold text-sm tracking-tight text-[#1d1d1f]">Thanh toán thành công!</span>
            </div>
          ) : (
            <>
              <img
                src={paymentData.qr_code}
                alt="VietQR Payment Code"
                className="w-full aspect-square object-contain"
              />
              <div className="text-[10px] font-mono font-bold text-slate-800 tracking-wider mt-2">
                NAPAS 24/7 • VIETQR
              </div>
            </>
          )}
        </div>

        {/* Transfer Details Card */}
        <div className="space-y-3 text-xs bg-[#161617] p-5 rounded-2xl border border-[#2d2d30] mb-6">
          
          <div className="flex items-center justify-between">
            <span className="text-[#86868b]">{t('vietqr.amount')}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{formatPrice(paymentData.amount, 'VND')}</span>
              <button
                onClick={() => handleCopy(paymentData.amount.toString(), 'amount')}
                className="text-[#86868b] hover:text-white"
              >
                {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#86868b]">{t('vietqr.account')}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-white">{paymentData.account_number}</span>
              <button
                onClick={() => handleCopy(paymentData.account_number, 'acc')}
                className="text-[#86868b] hover:text-white"
              >
                {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#86868b]">{t('vietqr.receiver')}</span>
            <span className="font-medium text-white">{paymentData.account_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#86868b]">{t('vietqr.memo')}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#ff9f0a]">{paymentData.description}</span>
              <button
                onClick={() => handleCopy(paymentData.description, 'memo')}
                className="text-[#86868b] hover:text-white"
              >
                {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Polling Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#86868b] mb-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2997ff]" />
          <span>{t('vietqr.waiting')}</span>
        </div>

        {/* Demo Simulation Action */}
        <button
          onClick={handleSimulatePayment}
          disabled={simulating || isPaid}
          className="w-full py-3 rounded-full apple-btn-secondary text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
          <span>{simulating ? 'Đang xác thực...' : t('vietqr.sim_button')}</span>
        </button>

      </div>
    </div>
  );
}
