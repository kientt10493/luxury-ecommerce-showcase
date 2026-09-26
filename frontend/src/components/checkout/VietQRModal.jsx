import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { paymentApi } from '../../services/api';
import { X, Copy, Check, Clock, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VietQRModal({ paymentData, onClose, onPaymentSuccess }) {
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isPaid, setIsPaid] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const orderId = paymentData?.order_id;

  // 15-minute countdown timer
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

  // Live status polling every 2 seconds
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

  // Demo simulator button: triggers PayOS webhook
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
      // The polling loop will detect it and update
    } catch (err) {
      console.error('Simulation error:', err);
      setSimulating(false);
    }
  };

  if (!paymentData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 border-cyan-500/30 shadow-2xl animate-modal text-start">
        
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('vietqr.expires_in')}: {formatTimer(timeLeft)}</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {t('vietqr.title')}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {t('vietqr.instruction')}
          </p>
        </div>

        {/* Main QR Display */}
        <div className="relative p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-xl mx-auto max-w-[260px] mb-6">
          {isPaid ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-emerald-600">
              <CheckCircle2 className="w-16 h-16 stroke-[2.5] animate-bounce" />
              <span className="font-extrabold text-base tracking-wide uppercase">Thanh toán thành công!</span>
            </div>
          ) : (
            <>
              <img
                src={paymentData.qr_code}
                alt="VietQR Dynamic Payment Code"
                className="w-full aspect-square object-contain"
              />
              <div className="text-[10px] font-mono font-bold text-slate-700 tracking-wider mt-2">
                NAPAS 24/7 • VIETQR
              </div>
            </>
          )}
        </div>

        {/* Transfer Details Card */}
        <div className="space-y-2.5 text-xs bg-black/40 p-4 rounded-xl border border-white/10 mb-6">
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t('vietqr.amount')}:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300 text-sm">{formatPrice(paymentData.amount, 'VND')}</span>
              <button
                onClick={() => handleCopy(paymentData.amount.toString(), 'amount')}
                className="text-slate-400 hover:text-white"
              >
                {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t('vietqr.account')}:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white">{paymentData.account_number}</span>
              <button
                onClick={() => handleCopy(paymentData.account_number, 'acc')}
                className="text-slate-400 hover:text-white"
              >
                {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t('vietqr.receiver')}:</span>
            <span className="font-semibold text-white">{paymentData.account_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t('vietqr.memo')}:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-300">{paymentData.description}</span>
              <button
                onClick={() => handleCopy(paymentData.description, 'memo')}
                className="text-slate-400 hover:text-white"
              >
                {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Polling Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-6">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>{t('vietqr.waiting')}</span>
        </div>

        {/* Simulation / Demo Button */}
        <button
          onClick={handleSimulatePayment}
          disabled={simulating || isPaid}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-cyan-400/40 text-cyan-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{simulating ? 'Đang xác nhận...' : t('vietqr.sim_button')}</span>
        </button>

      </div>
    </div>
  );
}
