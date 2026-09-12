import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, UserRound, X } from 'lucide-react';

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  membershipId?: string;
  membershipApplied?: boolean;
}

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile | null;
  onLogin: (profile: CustomerProfile) => void;
  forceMembershipForm?: boolean;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onLogin,
  forceMembershipForm = false,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAuth = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    const cleanPhone = phone.trim();
    if (!cleanEmail || !cleanPhone || !name.trim()) {
      setIsSuccess(false);
      setMessage('Please complete your name, phone number and email.');
      return;
    }
    const account = {
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      membershipId: '455014',
      membershipApplied: true
    };
    localStorage.setItem('sider_customer_account', JSON.stringify(account));
    localStorage.setItem('sider_membership_code', '455014');
    onLogin(account);
    setIsSuccess(true);
    setMessage('Membership application submitted successfully.');
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 text-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold">{profile ? 'My Profile' : 'Apply for Membership'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer" aria-label="Close profile">
            <X className="h-5 w-5" />
          </button>
        </div>

        {profile && (!forceMembershipForm || profile.membershipApplied) ? (
          <div className="space-y-4 p-5">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-sm font-bold">{profile.name}</div>
              <div className="mt-1 text-xs text-zinc-400">{profile.phone}</div>
              <div className="mt-1 text-xs text-zinc-400">{profile.email}</div>
              <div className="mt-3 border-t border-zinc-800 pt-3 text-xs font-bold text-amber-400">
                Membership ID: <span className="font-mono text-white">{profile.membershipId || '455014'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">Membership status</label>
              <div className="rounded-lg border border-emerald-700/50 bg-emerald-950/40 px-3 py-2 text-xs font-semibold text-emerald-400">
                {profile.membershipApplied ? 'Application submitted' : 'Not applied'}
              </div>
            </div>
            {message && <div className={`flex items-center gap-1.5 text-xs font-medium ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}><CheckCircle2 className="h-4 w-4" />{message}</div>}
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-3 p-5">
            <p className="text-xs leading-relaxed text-zinc-400">Login লাগবে না। আপনার তথ্য দিয়ে membership-এর জন্য আবেদন করুন।</p>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500" />
            {message && <div className={`text-xs font-medium ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>{message}</div>}
            <button type="submit" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-bold hover:bg-emerald-500 cursor-pointer">Apply for Membership</button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};