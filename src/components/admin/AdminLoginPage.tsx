import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Shield, 
  Users, 
  Store, 
  Check,
  X
} from 'lucide-react';
import { AdminUser } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStore: () => void;
}

type AuthMode = 'login' | 'forgot_request' | 'forgot_verify';

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToStore
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<'owner' | 'staff'>('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Intelligent Back/Close navigation:
  // If user came from within the website -> returns to previous page
  // If no previous page or external direct URL -> navigates to Sider Fashion home
  const handleBackOrClose = () => {
    if (typeof window !== 'undefined') {
      const hasPreviousInternalPage = 
        window.history.length > 1 && 
        (document.referrer?.includes(window.location.host) || Boolean(window.history.state));

      if (hasPreviousInternalPage) {
        window.history.back();
        // Fallback safety timeout if history.back() stays on /admin
        setTimeout(() => {
          if (window.location.pathname.toLowerCase().includes('/admin')) {
            onBackToStore();
          }
        }, 150);
        return;
      }
    }
    onBackToStore();
  };

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    
    if (!email.trim()) {
      setErrorMessage(
        selectedRole === 'owner' 
          ? 'অনুগ্রহ করে স্টোর ওনারের ইমেইল ঠিকানা দিন (Please enter Store Owner email).'
          : 'অনুগ্রহ করে স্টাফ/অ্যাডমিনের ইমেইল ঠিকানা দিন (Please enter Staff/Admin email).'
      );
      return;
    }
    if (!password) {
      setErrorMessage('অনুগ্রহ করে আপনার পাসওয়ার্ড দিন (Please enter your password).');
      return;
    }

    setLoading(true);

    try {
      const res = await AdminStoreService.loginAdminAsync(email.trim(), password, selectedRole);
      if (res && res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res?.error || 'ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'লগইন কানেকশন ত্রুটি। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetEmail.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নিবন্ধিত অ্যাডমিন ইমেইল ঠিকানা দিন।');
      return;
    }

    setLoading(true);

    try {
      const res = await AdminStoreService.requestPasswordReset(resetEmail.trim());
      if (res && res.success) {
        setSuccessMessage(res.message || 'আপনার নিবন্ধিত ইমেইলে ৬-সংখ্যার সিকিউরিটি ভেরিফিকেশন কোড পাঠানো হয়েছে (১০ মিনিট মেয়াদ)।');
        setAuthMode('forgot_verify');
      } else {
        setErrorMessage(res?.error || 'এই ইমেইলটি কোনো নিবন্ধিত অ্যাডমিন অ্যাকাউন্টের সাথে মিলছে না।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'কোড পাঠাতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!verificationCode.trim()) {
      setErrorMessage('অনুগ্রহ করে ইমেইলে প্রাপ্ত ৬-সংখ্যার ভেরিফিকেশন কোডটি দিন।');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মেলেনি।');
      return;
    }

    setLoading(true);

    try {
      const res = await AdminStoreService.verifyAndResetPassword(
        resetEmail.trim(),
        verificationCode.trim(),
        newPassword.trim(),
        confirmPassword.trim()
      );
      if (res && res.success) {
        setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
        setEmail(resetEmail);
        setPassword(newPassword);
        setAuthMode('login');
      } else {
        setErrorMessage(res?.error || 'ভুল বা মেয়াদোত্তীর্ণ ভেরিফিকেশন কোড।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'পাসওয়ার্ড পরিবর্তন সম্পন্ন হতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-login-page-root" className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* Top Bar Navigation */}
      <header className="border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
              S
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight font-sans">Sider Fashion</span>
              <span className="text-[11px] text-amber-400 font-semibold ml-2.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                Staff &amp; Admin Portal
              </span>
            </div>
          </div>

          {/* Top Corner Back / Close Button */}
          <button
            id="admin-login-corner-back-btn"
            type="button"
            onClick={handleBackOrClose}
            aria-label="Back to website"
            title="Return to website or previous page"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Back to Website</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md relative">

          {/* Main Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

            {/* Card Top-Corner Close (×) Button */}
            <button
              id="admin-login-card-close-btn"
              type="button"
              onClick={handleBackOrClose}
              aria-label="Close and return to website"
              title="Close and return to website"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700/80 flex items-center justify-center transition-all cursor-pointer z-10 active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>

            {/* View: Login Mode */}
            {authMode === 'login' && (
              <div className="space-y-6">
                
                {/* Form Header */}
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                    Admin Sign In
                  </h1>
                  <p className="text-xs text-stone-400 font-sans">
                    Restricted access for Store Owner &amp; General Admins
                  </p>
                </div>

                {/* Role-Based Selector Tabs */}
                <div className="bg-stone-950 p-1.5 rounded-2xl border border-stone-800 flex items-center gap-1.5 shadow-inner">
                  <button
                    id="admin-login-role-owner-btn"
                    type="button"
                    onClick={() => {
                      setSelectedRole('owner');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'owner'
                        ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>👑 স্টোর ওনার (Owner)</span>
                  </button>
                  <button
                    id="admin-login-role-staff-btn"
                    type="button"
                    onClick={() => {
                      setSelectedRole('staff');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'staff'
                        ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>👥 স্টাফ অ্যাডমিন (Staff)</span>
                  </button>
                </div>

                {/* Role Description Notice */}
                <div className={`px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed flex items-center gap-2.5 transition-all ${
                  selectedRole === 'owner' 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                }`}>
                  {selectedRole === 'owner' ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Store Owner Master Login:</strong> Complete administrative, account security &amp; financial control.</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>General Admin / Staff Login:</strong> Operational control over orders, stock, products &amp; delivery.</span>
                    </>
                  )}
                </div>

                {/* Status Alerts */}
                {errorMessage && (
                  <div id="admin-login-error-alert" className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div id="admin-login-success-alert" className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{successMessage}</span>
                  </div>
                )}

                {/* Login Form */}
                <form id="admin-login-form" onSubmit={handleLogin} className="space-y-4">
                  
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                      <span>{selectedRole === 'owner' ? 'Store Owner Email' : 'Staff / General Admin Email'}</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={selectedRole === 'owner' ? "Enter Store Owner Email" : "Enter Staff Admin Email"}
                        className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-700/90 rounded-xl text-stone-100 placeholder:text-stone-500 text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-300">
                        Password
                      </label>
                      <button
                        id="admin-login-forgot-btn"
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setAuthMode('forgot_request');
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-stone-950 border border-stone-700/90 rounded-xl text-stone-100 placeholder:text-stone-500 text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="admin-login-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In to Admin Panel</span>
                      </>
                    )}
                  </button>

                </form>

              </div>
            )}

            {/* View: Forgot Password Step 1 - Request Code */}
            {authMode === 'forgot_request' && (
              <div className="space-y-6">
                
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                    Reset Admin Password
                  </h1>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    Enter your registered admin email address. A 6-digit verification code will be generated (valid for 15 minutes).
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form id="admin-forgot-request-form" onSubmit={handleRequestResetCode} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">
                      Registered Admin Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-forgot-email"
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="e.g. abirhosensaon@gmail.com"
                        className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-700/90 rounded-xl text-stone-100 placeholder:text-stone-500 text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <button
                    id="admin-send-reset-code-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Send 6-Digit Verification Code</span>
                      </>
                    )}
                  </button>

                  <button
                    id="admin-back-to-login-btn"
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-stone-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </form>

              </div>
            )}

            {/* View: Forgot Password Step 2 - Verify Code & Reset */}
            {authMode === 'forgot_verify' && (
              <div className="space-y-6">
                
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                    Verify Code &amp; New Password
                  </h1>
                  <p className="text-xs text-stone-400">
                    Resetting password for <strong className="text-amber-400">{resetEmail}</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300">ইমেইল ভেরিফিকেশন কোড (১০ মিনিট মেয়াদ)</div>
                    <div className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                      আপনার <strong className="text-amber-400">{resetEmail}</strong> ইনবক্সে প্রেরিত ৬-সংখ্যার কোডটি নিচে দিন।
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form id="admin-forgot-verify-form" onSubmit={handleVerifyAndResetPassword} className="space-y-4">
                  
                  {/* 6-Digit Code */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">
                      6-Digit Verification Code
                    </label>
                    <input
                      id="admin-reset-code"
                      type="text"
                      required
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full px-4 py-3 bg-stone-950 border border-stone-700/90 rounded-xl text-stone-100 placeholder:text-stone-600 text-center font-mono text-lg tracking-widest font-bold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        id="admin-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 bg-stone-950 border border-stone-700/90 rounded-xl text-stone-100 placeholder:text-stone-500 text-sm focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-200"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">
                      Confirm New Password
                    </label>
                    <input
                      id="admin-confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-stone-950 border border-stone-700/90 rounded-xl text-stone-100 placeholder:text-stone-500 text-sm focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <button
                    id="admin-submit-new-password-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying &amp; Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Set New Password &amp; Continue</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_request');
                      setErrorMessage(null);
                    }}
                    className="w-full py-2 text-xs font-bold text-stone-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Request New Code</span>
                  </button>

                </form>

              </div>
            )}

          </div>

          {/* Security Guarantee Badges */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                PBKDF2 Salted Hashing
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Rate-Limit Protected
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              All logins &amp; administrative activities are recorded in the security audit trail.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-4 px-4 text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Sider Fashion Master Administration. Own Manufacturing Hub — Ashulia, Savar.
      </footer>

    </div>
  );
};
