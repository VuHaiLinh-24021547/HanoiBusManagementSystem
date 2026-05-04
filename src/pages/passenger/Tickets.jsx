import { useState } from 'react';
import { QrCode, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tickets() {
  const [ticketType, setTicketType] = useState('single'); // 'single' or 'monthly'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  const price = ticketType === 'single' ? '7,000 VND' : '200,000 VND';
  const label = ticketType === 'single' ? 'Single Journey E-Ticket' : 'Monthly Digital Pass';

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
            onClick={() => {
              setTicketType('single');
              setIsSuccess(false);
            }}
            className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${
              ticketType === 'single' ? 'text-gray-800' : 'text-gray-500'
            }`}
          >
            Single Journey
          </button>
          <button
            onClick={() => {
              setTicketType('monthly');
              setIsSuccess(false);
            }}
            className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${
              ticketType === 'monthly' ? 'text-gray-800' : 'text-gray-500'
            }`}
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
                <div className="bg-white border-2 border-green-500 rounded-2xl p-5 flex items-center justify-between shadow-sm cursor-pointer transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    DEFAULT
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-base">VNPay e-Wallet</div>
                      <div className="text-sm text-gray-500">Balance: 500,000 VND</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
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

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-80 flex items-center justify-center gap-2 text-lg mt-8"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    Pay {price} securely
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-start space-y-4 max-w-lg"
            >
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                <p className="text-gray-500 text-base mt-1">
                  Your {label} is now active and ready to use.
                </p>
              </div>
              <div className="w-full h-px bg-gray-100 my-4" />
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-semibold text-gray-800">#HNB-94821</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="font-semibold text-gray-800">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-semibold text-gray-800">{price}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsSuccess(false)}
                className="w-full py-4 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Buy Another Ticket
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: Ticket Preview */}
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

        {/* Transaction History Placeholder */}
        <div className="max-w-md mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-gray-500" />
              Recent Purchases
            </h3>
            <button className="text-sm font-semibold text-[var(--color-primary)] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Single Journey E-Ticket</div>
                    <div className="text-xs text-gray-500">May {10 - i}, 2026 • 08:30 AM</div>
                  </div>
                </div>
                <div className="font-bold text-gray-800 text-sm">
                  7,000 VND
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
