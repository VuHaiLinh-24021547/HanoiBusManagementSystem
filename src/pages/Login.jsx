import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Mail, Lock, KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAccounts, addAccount, getAccountByEmail, updateAccount } from '../lib/db';

export default function Login() {
  const [step, setStep] = useState(1); // 1: Email/Pass, 2: OTP
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = 'passenger';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Validate with db
      const users = getAccounts();
      const user = users.find(u => u.email === email && u.password === password && u.role === 'passenger');
      
      if (user || (email === 'demo@hanoibus.vn' && password === 'demo')) { // Fallback demo account
        setStep(2);
      } else {
        setError('Invalid email, password, or role.');
      }
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const users = getAccounts();
      if (users.find(u => u.email === email)) {
        setError('Email already exists.');
        return;
      }
      
      addAccount({ name, email, password, role });
      
      // Auto login after registration
      setStep(2);
    }, 1000);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Save current session
      localStorage.setItem('hanoibus_current_user', JSON.stringify({ email, role, name: name || 'User' }));

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'dispatcher') {
        navigate('/dispatcher');
      } else {
        navigate('/home');
      }
    }, 1000);
  };

  // --- Forgot Password Handlers ---
  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const account = getAccountByEmail(forgotEmail);
      if (!account) {
        setError('No account found with this email.');
        return;
      }
      setForgotStep(2);
    }, 1000);
  };

  const handleForgotOTPVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep(3);
    }, 1000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const account = getAccountByEmail(forgotEmail);
      if (account) {
        updateAccount(account.id, { password: newPassword });
        setResetSuccess(true);
        setTimeout(() => {
          setIsForgotPassword(false);
          setForgotStep(1);
          setForgotEmail('');
          setNewPassword('');
          setConfirmPassword('');
          setResetSuccess(false);
          setError('');
        }, 2000);
      }
    }, 1000);
  };

  const exitForgotPassword = () => {
    setIsForgotPassword(false);
    setForgotStep(1);
    setForgotEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setResetSuccess(false);
  };

  // --- Forgot Password UI ---
  const renderForgotPassword = () => (
    <motion.div
      key="forgot-password"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="mt-8 space-y-6"
    >
      {resetSuccess ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6 space-y-3"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">Password Reset!</h3>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </motion.div>
      ) : (
        <>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  forgotStep === s ? 'bg-[var(--color-primary)] text-white scale-110' :
                  forgotStep > s ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>{forgotStep > s ? '✓' : s}</div>
                {s < 3 && <div className={`w-8 h-0.5 ${forgotStep > s ? 'bg-green-300' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mb-2">
            {forgotStep === 1 && 'Enter your email'}
            {forgotStep === 2 && 'Verify OTP code'}
            {forgotStep === 3 && 'Set new password'}
          </p>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">{error}</div>
          )}

          {forgotStep === 1 && (
            <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email" required value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                />
              </div>
              <button type="submit" disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all shadow-md">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Send OTP<span className="absolute right-4 flex items-center inset-y-0"><ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span></>}
              </button>
            </form>
          )}

          {forgotStep === 2 && (
            <form onSubmit={handleForgotOTPVerify} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600">We've sent a verification code to <span className="font-semibold">{forgotEmail}</span></p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" required maxLength={6}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-center tracking-widest font-bold text-lg"
                  placeholder="000000"
                />
              </div>
              <button type="submit" disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all shadow-md">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify Code'}
              </button>
            </form>
          )}

          {forgotStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showNewPass ? 'text' : 'password'} required value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="New password"
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showNewPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPass ? 'text' : 'password'} required value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showConfirmPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <button type="submit" disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all shadow-md">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="text-center">
            <button type="button" onClick={exitForgotPassword}
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </button>
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-[var(--color-primary)] rounded-b-[40%] shadow-lg transform -translate-y-10" />
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-2xl z-10 relative">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
            <Bus className="h-10 w-10 text-[var(--color-primary)]" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            HanoiBus
          </h2>
          <p className="mt-2 text-sm text-gray-500 italic font-medium">
            {isForgotPassword ? 'Reset Your Password' : 'Smart Urban Transit'}
          </p>
        </div>



        <AnimatePresence mode="wait">
          {isForgotPassword ? (
            renderForgotPassword()
          ) : step === 1 ? (
            <motion.form 
              key={isRegistering ? "register" : "login"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mt-8 space-y-6" 
              onSubmit={isRegistering ? handleRegister : handleLogin}
            >
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                {isRegistering && (
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      placeholder="Full Name"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="Email address"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="Password"
                  />
                </div>
              </div>

              {!isRegistering && (
                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); }}
                      className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
                      Forgot your password?
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all shadow-md overflow-hidden"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRegistering ? 'Create Account' : 'Sign in'}
                    <span className="absolute right-4 flex items-center inset-y-0">
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mt-8 space-y-6" 
              onSubmit={handleVerifyOTP}
            >
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  We've sent a one-time code to your registered mobile number.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-center tracking-widest font-bold text-lg"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all shadow-md"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Verify & Login'
                )}
              </button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                  Back to email/password
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        {step === 1 && !isForgotPassword && (
          <p className="mt-8 text-center text-sm text-gray-600">
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="font-bold text-[var(--color-primary)] hover:underline focus:outline-none"
            >
              {isRegistering ? "Sign in here" : "Register here"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
