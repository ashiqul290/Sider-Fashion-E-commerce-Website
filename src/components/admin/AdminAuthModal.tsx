import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  X, 
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Clock,
  Send
} from 'lucide-react';
import { AdminUser } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

type AuthMode = 'login' | 'forgot_request' | 'forgot_verify';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
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

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    
    if (!email.trim()) {
      setErrorMessage(selectedRole === 'owner' ? 'Please enter Store Owner email.' : 'Please enter Staff email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await AdminStoreService.loginAdminAsync(email.trim(), password.trim(), selectedRole);
      if (res && res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res?.error || 'Invalid credentials. Please verify your admin email and password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await AdminStoreService.requestPasswordReset(resetEmail.trim());
      if (res && res.success) {
        setSuccessMessage(res.message || 'আপনার নিবন্ধিত ইমেইলে ৬-সংখ্যার সিকিউরিটি কোড পাঠানো হয়েছে।');
        setAuthMode('forgot_verify');
      } else {
        setErrorMessage(res?.error || 'এই ইমেইলটি কোনো নিবন্ধিত অ্যাডমিন অ্যাকাউন্টের সাথে মিলছে না।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'কোড পাঠাতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!verificationCode.trim()) {
      setErrorMessage('অনুগ্রহ করে ৬-সংখ্যার ভেরিফিকেশন কোডটি দিন।');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মেলেনি।');
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
        setSuccessMessage(res.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন লগইন করুন।');
        setEmail(resetEmail);
        setPassword(newPassword);
        setAuthMode('login');
      } else {
        setErrorMessage(res?.error || 'ভুল বা মেয়াদোত্তীর্ণ ভেরিফিকেশন কোড।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-auth-modal-overlay" className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="admin-auth-modal-container" className="bg-white rounded-3xl max-w-md w-full p-7 space-y-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-lg shadow-sm">
              S
            </div>
            <div>
              <h3 className="font-black text-stone-950 text-lg font-sans">Sider Fashion</h3>
              <p className="text-xs text-amber-900 font-bold uppercase tracking-wider">
                {authMode === 'login' ? 'Staff & Admin Security Access' : 'Password Recovery'}
              </p>
            </div>
          </div>
          <button 
            id="admin-auth-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div id="admin-auth-error-box" className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div id="admin-auth-success-box" className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4" id="admin-login-form">
            
            {/* Role-Based Selector Tabs */}
            <div className="bg-stone-100 p-1.5 rounded-2xl border border-stone-200 flex items-center gap-1.5">
              <button
                id="admin-modal-role-owner-btn"
                type="button"
                onClick={() => {
                  setSelectedRole('owner');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'owner'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-black'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <span>👑 Store Owner</span>
              </button>
              <button
                id="admin-modal-role-staff-btn"
                type="button"
                onClick={() => {
                  setSelectedRole('staff');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'staff'
                    ? 'bg-stone-900 text-white shadow-sm font-black'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <span>👥 Staff Admin</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {selectedRole === 'owner' ? 'Store Owner Email Address' : 'Staff Admin Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'owner' ? "Enter Store Owner Email" : "Enter Staff Admin Email"}
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  id="admin-forgot-password-btn"
                  onClick={() => {
                    setResetEmail(email);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setAuthMode('forgot_request');
                  }}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Secure Admin Login</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: FORGOT PASSWORD - REQUEST 6-DIGIT CODE */}
        {authMode === 'forgot_request' && (
          <form onSubmit={handleRequestResetCode} className="space-y-4" id="admin-forgot-request-form">
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Password Reset Verification</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Enter your registered admin email. A single-use 6-digit verification code valid for 15 minutes will be generated.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="abirhosensaon@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthMode('login');
                }}
                className="w-1/3 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                id="admin-send-code-btn"
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-stone-950 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Code...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Get Verification Code</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: FORGOT PASSWORD - VERIFY CODE & RESET */}
        {authMode === 'forgot_verify' && (
          <form onSubmit={handleVerifyAndResetPassword} className="space-y-4" id="admin-forgot-verify-form">
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Security Verification Code (১০ মিনিট মেয়াদ)</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                আপনার <strong>{resetEmail}</strong> অ্যাডমিন ইমেইল ইনবক্সে পাঠানো ৬-সংখ্যার কোডটি প্রবেশ করান।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                id="admin-verification-code"
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-widest font-mono font-bold text-base py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                New Password (minimum 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-confirm-password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAuthMode('forgot_request')}
                className="w-1/3 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                id="admin-reset-submit-btn"
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Reset Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
