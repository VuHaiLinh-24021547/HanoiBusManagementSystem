import { useState, useEffect, useRef } from 'react';
import { QrCode, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, History, ArrowRight, X, Clock, Upload, ImagePlus, AlertCircle, Tag, RotateCcw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addTicket, getTicketsByUser, getAccountByEmail } from '../../lib/db';

// ── Promo codes: code → { type: 'percent'|'fixed', value, label } ─────────
const PROMO_CODES = {
  HANOI10:  { type: 'percent', value: 10,     label: '10% off'        },
  STUDENT20: { type: 'percent', value: 20,    label: '20% off'        },
  SAVE5K:   { type: 'fixed',   value: 5000,   label: '-5,000 VND'    },
  NEWUSER:  { type: 'percent', value: 15,     label: '15% off'        },
  METRO30:  { type: 'fixed',   value: 30000,  label: '-30,000 VND'   },
};

/** Returns numeric VND amount from price string like '200,000 VND' */
function parseVND(str) {
  return parseInt(str.replace(/[^0-9]/g, ''), 10);
}
/** Formats number to '200,000 VND' */
function formatVND(n) {
  return n.toLocaleString('vi-VN') + ' VND';
}

export default function Tickets() {
  const session = JSON.parse(localStorage.getItem('hanoibus_current_user') || '{}');

  const [ticketType, setTicketType] = useState('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaymentError, setIsPaymentError] = useState(false);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [studentIdPhoto, setStudentIdPhoto] = useState(null); // base64 data URL
  const [photoDragOver, setPhotoDragOver] = useState(false);
  const photoInputRef = useRef(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // For QR modal
  const [showConfirm, setShowConfirm] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // PROMO_CODES entry | null
  const [promoError, setPromoError] = useState('');

  // Load purchase history on mount
  useEffect(() => {
    if (session.email) {
      setPurchases(getTicketsByUser(session.email));
    }
  }, []);

  // Resolve current account and wallet balance
  const account = getAccountByEmail(session.email);
  const walletBalance = account?.balance ?? 0;

  // Base price (numeric)
  let baseAmount = ticketType === 'single' ? 7000 : (isStudent ? 100000 : 200000);
  let label = 'Single Journey E-Ticket';
  if (ticketType === 'monthly') {
    label = isStudent ? 'Student Monthly Pass' : 'Monthly Digital Pass';
  }

  // Apply discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round(baseAmount * appliedPromo.value / 100);
    } else {
      discountAmount = Math.min(appliedPromo.value, baseAmount);
    }
  }
  const finalAmount = Math.max(0, baseAmount - discountAmount);
  const price = formatVND(finalAmount);
  const basePrice = formatVND(baseAmount);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError('Please enter a promo code.'); return; }
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code.');
      setAppliedPromo(null);
    }
  };
  const removePromo = () => { setAppliedPromo(null); setPromoInput(''); setPromoError(''); };

  // True when the wallet cannot cover the ticket price
  const hasInsufficientBalance = walletBalance < finalAmount;

  const handlePhotoFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setStudentIdPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setIsPaymentError(false);
    setTimeout(() => {
      // Hard-fail immediately if wallet balance is insufficient
      if (walletBalance < finalAmount) {
        setIsProcessing(false);
        setIsPaymentError(true);
        setPaymentErrorMsg(`Insufficient balance in your VNPay e-Wallet. Your balance is ${formatVND(walletBalance)}, but the ticket costs ${price}. Please top up and try again.`);
        return;
      }

      // Simulate payment gateway: ~20% chance of failure
      const FAILURE_RATE = 0.2;
      const errors = [
        'Your bank declined the transaction. Please try a different payment method.',
        'Payment gateway timeout. Please check your connection and retry.',
        'Insufficient balance in your VNPay e-Wallet.',
        'Transaction blocked by your bank\'s security policy. Please contact your bank.',
      ];
      if (Math.random() < FAILURE_RATE) {
        const msg = errors[Math.floor(Math.random() * errors.length)];
        setIsProcessing(false);
        setIsPaymentError(true);
        setPaymentErrorMsg(msg);
        return;
      }

      try {
        const ticket = addTicket({
          email: session.email || 'guest',
          type: ticketType,
          label,
          price,
          basePrice: discountAmount > 0 ? basePrice : null,
          discountAmount: discountAmount > 0 ? formatVND(discountAmount) : null,
          promoCode: appliedPromo?.code || null,
          isStudent: ticketType === 'monthly' && isStudent,
          studentIdPhoto: isStudent ? studentIdPhoto : null,
        });
        setCurrentTicket(ticket);
        setPurchases(getTicketsByUser(session.email));
        setIsProcessing(false);
        setIsSuccess(true);
      } catch (err) {
        setIsProcessing(false);
        setIsPaymentError(true);
        setPaymentErrorMsg('An unexpected error occurred. Your card was not charged.');
      }
    }, 1800);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setIsPaymentError(false);
    setCurrentTicket(null);
    setStudentIdPhoto(null);
    setIsStudent(false);
    setPromoInput('');
    setAppliedPromo(null);
    setPromoError('');
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-8">
      {/* Left Column: Purchase Form */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Digital Ticketing</h1>
          <p className="text-gray-500">Purchase tickets or top up your monthly pass.</p>
        </div>

        {/* Ticket Selection */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex relative w-full lg:w-2/3">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-in-out ${
              ticketType === 'single' ? 'translate-x-0' : 'translate-x-full ml-3'
            }`}
          />
          <button
            onClick={() => { setTicketType('single'); setIsSuccess(false); }}
            className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${ticketType === 'single' ? 'text-gray-800' : 'text-gray-500'}`}
          >
            Single Journey
          </button>
          <button
            onClick={() => { setTicketType('monthly'); setIsSuccess(false); }}
            className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${ticketType === 'monthly' ? 'text-gray-800' : 'text-gray-500'}`}
          >
            Monthly Pass
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 max-w-lg"
            >
              {/* Payment Method */}
              <div className="space-y-3">
                <h2 className="font-bold text-gray-800 text-lg">Select Payment Method</h2>
                <div className={`bg-white border-2 rounded-2xl p-5 flex items-center justify-between shadow-sm cursor-pointer relative overflow-hidden ${
                    hasInsufficientBalance ? 'border-red-300' : 'border-green-500'
                  }`}>
                  <div className={`absolute top-0 right-0 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg ${
                    hasInsufficientBalance ? 'bg-red-400' : 'bg-green-500'
                  }`}>DEFAULT</div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      hasInsufficientBalance ? 'bg-red-50' : 'bg-green-50'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${hasInsufficientBalance ? 'text-red-500' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-base">VNPay e-Wallet</div>
                      <div className={`text-sm font-semibold ${
                        hasInsufficientBalance ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        Balance: {formatVND(walletBalance)}
                        {hasInsufficientBalance && ' — Insufficient'}
                      </div>
                    </div>
                  </div>
                  {hasInsufficientBalance
                    ? <AlertCircle className="w-6 h-6 text-red-400" />
                    : <CheckCircle2 className="w-6 h-6 text-green-500" />
                  }
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm cursor-pointer hover:border-gray-300 transition-colors opacity-70 hover:opacity-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-base">Visa ending in 4242</div>
                      <div className="text-sm text-gray-500">Expires 12/28</div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  Promo Code
                </h2>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-bold text-green-700">{appliedPromo.code}</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{appliedPromo.label}</span>
                    </div>
                    <button onClick={removePromo} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                      placeholder="Enter promo code"
                      className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow ${
                        promoError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    />
                    <button
                      onClick={applyPromo}
                      className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />{promoError}
                  </p>
                )}
              </div>

              {ticketType === 'monthly' && (
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isStudent}
                        onChange={(e) => setIsStudent(e.target.checked)}
                        className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)] transition-all cursor-pointer"
                      />
                      <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors">I am a student (50% Off)</span>
                  </label>
                  <AnimatePresence>
                    {isStudent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-1 space-y-2">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Upload Student ID Card Photo</p>

                          {/* Drop zone */}
                          <div
                            onClick={() => photoInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setPhotoDragOver(true); }}
                            onDragLeave={() => setPhotoDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setPhotoDragOver(false); handlePhotoFile(e.dataTransfer.files[0]); }}
                            className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 overflow-hidden ${
                              photoDragOver
                                ? 'border-[var(--color-primary)] bg-green-50'
                                : studentIdPhoto
                                ? 'border-[var(--color-primary)] bg-white'
                                : 'border-blue-200 bg-white hover:border-[var(--color-primary)] hover:bg-green-50/30'
                            }`}
                            style={{ minHeight: studentIdPhoto ? 'auto' : 96 }}
                          >
                            {studentIdPhoto ? (
                              <>
                                <img
                                  src={studentIdPhoto}
                                  alt="Student ID"
                                  className="w-full max-h-48 object-cover rounded-xl"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setStudentIdPhoto(null); }}
                                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent py-2 px-3 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                  <span className="text-white text-xs font-semibold">Photo uploaded — click to change</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 py-5 px-4">
                                <ImagePlus className="w-8 h-8 text-blue-400" />
                                <p className="text-sm font-semibold text-gray-700">Click or drag & drop</p>
                                <p className="text-xs text-gray-400">JPG, PNG, HEIC — max 5 MB</p>
                              </div>
                            )}
                          </div>

                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoFile(e.target.files[0])}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Insufficient balance warning */}
              {hasInsufficientBalance && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700">Insufficient wallet balance</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Your VNPay balance ({formatVND(walletBalance)}) is lower than the ticket price ({price}). Please top up your wallet to proceed.
                    </p>
                  </div>
                </div>
              )}

              {/* Price summary strip */}
              <div className="bg-gray-50 rounded-2xl px-5 py-4 mt-6 space-y-1.5">
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Original price</span>
                    <span className="line-through text-gray-400">{basePrice}</span>
                  </div>
                )}
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">Discount ({appliedPromo.label})</span>
                    <span className="text-green-600 font-semibold">-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black pt-1 border-t border-gray-200">
                  <span className="text-gray-800">Total</span>
                  <span className="text-[var(--color-primary)]">{price}</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                disabled={isProcessing || (ticketType === 'monthly' && isStudent && !studentIdPhoto) || hasInsufficientBalance}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-2"
              >
                <ShieldCheck className="w-6 h-6" />
                Pay {price} securely
              </button>
            </motion.div>
          ) : isPaymentError ? (
            /* ── Payment Error Screen ── */
            <motion.div
              key="error-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-red-100 flex flex-col items-center space-y-4 max-w-lg"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
                <p className="text-gray-500 text-base mt-1">Your card was <strong>not</strong> charged.</p>
              </div>
              <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 leading-relaxed">{paymentErrorMsg}</p>
              </div>
              <div className="w-full space-y-3 pt-2">
                <button
                  onClick={() => { setIsPaymentError(false); setShowConfirm(true); }}
                  className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retry Payment
                </button>
                <button
                  onClick={resetForm}
                  className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
                >
                  Cancel & Go Back
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Success Screen ── */
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center space-y-4 max-w-lg"
            >
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                <p className="text-gray-500 text-base mt-1">Your {currentTicket?.label} is now active and ready to use.</p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center w-full py-4">
                <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentTicket?.qrData}`}
                    alt="Ticket QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">Scan this code when boarding</p>
              </div>

              <div className="w-full h-px bg-gray-100 my-2" />
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-semibold text-gray-800">#{currentTicket?.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="font-semibold text-gray-800">{currentTicket ? formatDate(currentTicket.purchasedAt) : ''}</span>
                </div>
                {currentTicket?.basePrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Original Price</span>
                    <span className="line-through text-gray-400">{currentTicket.basePrice}</span>
                  </div>
                )}
                {currentTicket?.discountAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({currentTicket.promoCode})</span>
                    <span className="font-semibold text-green-600">-{currentTicket.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black border-t border-gray-100 pt-1.5">
                  <span className="text-gray-700">Amount Paid</span>
                  <span className="text-[var(--color-primary)]">{currentTicket?.price}</span>
                </div>
              </div>
              {currentTicket?.isStudent && currentTicket?.studentIdPhoto && (
                <div className="w-full">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1.5">Student ID Card</p>
                  <img
                    src={currentTicket.studentIdPhoto}
                    alt="Student ID"
                    className="w-full max-h-32 object-cover rounded-xl border border-gray-100"
                  />
                </div>
              )}
              <button
                onClick={resetForm}
                className="w-full py-4 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Buy Another Ticket
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: Ticket Preview + History */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h2 className="font-bold text-gray-800 text-xl">Ticket Preview</h2>

        {/* Ticket Card */}
        <div className={`relative p-8 rounded-[32px] text-white shadow-2xl overflow-hidden transition-colors duration-500 w-full max-w-md ${
          ticketType === 'single'
            ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30'
            : 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/30'
        }`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <div className="text-white/80 text-sm font-bold uppercase tracking-wider mb-2">
                {ticketType === 'single' ? 'Standard Fare' : 'Student / Adult'}
              </div>
              <div className="text-3xl font-black leading-tight">{label}</div>
            </div>
            {ticketType === 'single' ? <QrCode className="w-12 h-12 opacity-80" /> : <CreditCard className="w-12 h-12 opacity-80" />}
          </div>
          <div className="flex justify-between items-end relative z-10">
            <div>
              <div className="text-white/80 text-sm mb-1">Total Amount</div>
              <div className="text-4xl font-bold">{price}</div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm mb-1">Valid for</div>
              <div className="text-xl font-bold">{ticketType === 'single' ? '1 Ride' : '30 Days'}</div>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="max-w-md mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-gray-500" />
              Recent Purchases
            </h3>
            <span className="text-sm text-gray-400 font-medium">{purchases.length} ticket{purchases.length !== 1 ? 's' : ''}</span>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
              <QrCode className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No tickets purchased yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {purchases.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md hover:border-[var(--color-primary)] transition-all cursor-pointer group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{ticket.label}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(ticket.purchasedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800 text-sm">{ticket.price}</div>
                    <div className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">View QR →</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm flex flex-col items-center gap-5"
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-gray-800 text-lg">{selectedTicket.label}</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${selectedTicket.qrData}`}
                  alt="Ticket QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Scan this code when boarding</p>

              <div className="w-full h-px bg-gray-100" />
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-semibold text-gray-800">#{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Purchased</span>
                  <span className="font-semibold text-gray-800">{formatDate(selectedTicket.purchasedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-semibold text-gray-800">{selectedTicket.price}</span>
                </div>
                {selectedTicket.isStudent && selectedTicket.studentIdPhoto && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">Student ID Card</span>
                    <img
                      src={selectedTicket.studentIdPhoto}
                      alt="Student ID"
                      className="w-full max-h-36 object-cover rounded-xl border border-gray-100"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Payment Confirmation Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Confirm Payment</h3>
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="px-6 py-5 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Summary</p>

                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Ticket type</span>
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                </div>

                {ticketType === 'monthly' && isStudent && studentIdPhoto && (
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Student ID</span>
                    <img
                      src={studentIdPhoto}
                      alt="Student ID"
                      className="h-10 w-16 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Valid for</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {ticketType === 'single' ? '1 Ride' : '30 Days'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Payment method</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    VNPay e-Wallet
                  </div>
                </div>

                {appliedPromo && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Original price</span>
                      <span className="text-sm line-through text-gray-400">{basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />{appliedPromo.code} ({appliedPromo.label})
                      </span>
                      <span className="text-sm font-semibold text-green-600">-{formatVND(discountAmount)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-base font-bold text-gray-800">Total</span>
                  <span className="text-xl font-black text-[var(--color-primary)]">{price}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    handleCheckout();
                  }}
                  className="flex-2 flex-grow-[2] py-3.5 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold text-sm shadow-lg shadow-green-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Confirm & Pay
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
