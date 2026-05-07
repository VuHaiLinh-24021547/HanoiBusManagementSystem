import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAccounts } from '../lib/db';

export default function AdminLogin() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const users = getAccounts();
      const user = users.find(u => u.email === email && u.password === password && u.role === role);

      if (user) {
        setStep(2);
      } else {
        setError('Invalid credentials or unauthorized role.');
      }
    }, 1000);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('hanoibus_current_user', JSON.stringify({ email, role, name: 'Staff' }));
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dispatcher');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl shadow-2xl z-10 relative" style={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center shadow-inner" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Staff Portal
          </h2>
          <p className="mt-2 text-sm text-slate-400 italic font-medium">
            Admin & Dispatcher Access
          </p>
        </div>

        {/* Role selector */}
        <div className="flex justify-center space-x-3">
          <button
            className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all ${role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <button
            className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all ${role === 'dispatcher' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            onClick={() => setRole('dispatcher')}
          >
            Dispatcher
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mt-8 space-y-6"
              onSubmit={handleLogin}
            >
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl text-white placeholder-slate-500 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Staff email"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl text-white placeholder-slate-500 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white transition-all shadow-lg overflow-hidden"
                style={{ background: role === 'admin' ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in as {role === 'admin' ? 'Admin' : 'Dispatcher'}
                    <span className="absolute right-4 flex items-center inset-y-0">
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mt-8 space-y-6"
              onSubmit={handleVerifyOTP}
            >
              <div className="text-center mb-6">
                <p className="text-sm text-slate-400">Enter the verification code sent to your device.</p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input type="text" required maxLength={6}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl text-white placeholder-slate-500 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center tracking-widest font-bold text-lg"
                  placeholder="000000"
                />
              </div>
              <button type="submit" disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white transition-all shadow-lg"
                style={{ background: role === 'admin' ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Verify & Login'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setStep(1)}
                  className="text-sm text-slate-400 hover:text-white font-medium transition-colors">
                  Back to credentials
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-xs text-slate-500">
          Passenger? <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in here</a>
        </p>
      </div>
    </div>
  );
}
