import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Lock, 
  Mail, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  UserCheck, 
  UserX, 
  Plus, 
  Shield
} from 'lucide-react';
import { AdminUser } from '../../types/adminTypes';
import { AdminStoreService } from '../../services/adminStoreService';

interface AdminAccountsTabProps {
  onRefresh: () => void;
  adminName: string;
  currentUser: AdminUser;
}

export const AdminAccountsTab: React.FC<AdminAccountsTabProps> = ({
  onRefresh,
  adminName,
  currentUser
}) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<any>({ totalCount: 0, maxLimit: 4, ownerCount: 1, adminCount: 0, availableSlots: 0 });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal / Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Admin Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('Order & Inventory Admin');
  const [showNewPass, setShowNewPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = currentUser?.role === 'owner' || currentUser?.role === 'super_admin';

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res = await AdminStoreService.fetchAdminUsers(currentUser?.id);
      if (res && res.users) {
        setUsers(res.users);
        if (res.meta) setMeta(res.meta);
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: 'Failed to load admin accounts.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      setAlert({ type: 'error', message: 'Only the Store Owner can create General Admin accounts.' });
      return;
    }

    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    try {
      const res = await AdminStoreService.createAdminUser(
        newName.trim(),
        newEmail.trim().toLowerCase(),
        newPassword.trim(),
        newRoleTitle.trim(),
        currentUser.id
      );

      if (res.success) {
        setAlert({ type: 'success', message: `General Admin "${newName}" created successfully.` });
        setIsAddModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        setNewRoleTitle('Order & Inventory Admin');
        await loadAccounts();
        onRefresh();
      } else {
        setAlert({ type: 'error', message: res.error || 'Failed to create account.' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Error creating admin.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (targetUser: AdminUser) => {
    if (!isOwner) {
      setAlert({ type: 'error', message: 'Only the Store Owner can disable or activate accounts.' });
      return;
    }

    if (targetUser.role === 'owner' || targetUser.role === 'super_admin') {
      setAlert({ type: 'error', message: 'The Store Owner account cannot be disabled.' });
      return;
    }

    const nextStatus = targetUser.status === 'disabled' ? 'active' : 'disabled';
    const confirmMsg = nextStatus === 'disabled' 
      ? `Disable login access for "${targetUser.name}" (${targetUser.email})?`
      : `Re-activate login access for "${targetUser.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await AdminStoreService.updateAdminUser(
        targetUser.id,
        { status: nextStatus },
        currentUser.id
      );

      if (res.success) {
        setAlert({ 
          type: 'success', 
          message: `Account "${targetUser.name}" is now ${nextStatus === 'disabled' ? 'Disabled' : 'Active'}.` 
        });
        await loadAccounts();
        onRefresh();
      } else {
        setAlert({ type: 'error', message: res.error || 'Failed to update status.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: 'Error updating account status.' });
    }
  };

  const handleDeleteAdmin = async (targetUser: AdminUser) => {
    if (!isOwner) {
      setAlert({ type: 'error', message: 'Only the Store Owner can delete accounts.' });
      return;
    }

    if (targetUser.role === 'owner' || targetUser.role === 'super_admin') {
      setAlert({ type: 'error', message: 'The Store Owner account cannot be deleted.' });
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently remove admin "${targetUser.name}" (${targetUser.email})? This action frees up 1 admin slot.`)) {
      return;
    }

    try {
      const res = await AdminStoreService.deleteAdminUser(targetUser.id, currentUser.id);
      if (res.success) {
        setAlert({ type: 'success', message: `Admin account "${targetUser.name}" removed.` });
        await loadAccounts();
        onRefresh();
      } else {
        setAlert({ type: 'error', message: res.error || 'Failed to delete account.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: 'Error deleting account.' });
    }
  };

  const totalAccounts = users.length;
  const ownerAccounts = users.filter(u => u.role === 'owner' || u.role === 'super_admin');
  const generalAdmins = users.filter(u => u.role === 'admin' || (u.role !== 'owner' && u.role !== 'super_admin'));
  const canAddMore = isOwner && totalAccounts < 4 && generalAdmins.length < 3;

  return (
    <div id="admin-accounts-tab-root" className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              Admin &amp; Security Architecture
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Maximum 4 Staff Accounts Allowed
            </span>
          </div>
          <h2 className="text-xl font-black text-stone-900 mt-1">
            Admin Accounts &amp; Access Control
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Strict Multi-Admin Security Architecture: 1 Store Owner + up to 3 General Admins.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="admin-refresh-accounts-btn"
            onClick={loadAccounts}
            disabled={loading}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {isOwner && (
            <button
              id="admin-add-new-admin-btn"
              onClick={() => setIsAddModalOpen(true)}
              disabled={!canAddMore}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create General Admin ({4 - totalAccounts} left)</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert Notice */}
      {alert && (
        <div className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
          alert.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-start gap-2">
            {alert.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />}
            <span className="font-medium">{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-stone-400 hover:text-stone-600 text-xs font-bold">Dismiss</button>
        </div>
      )}

      {/* 4 Slots Capacity Status Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">1 Store Owner</div>
            <div className="text-sm font-black text-stone-900">
              {ownerAccounts.length > 0 ? ownerAccounts[0].name : 'Saon (Owner)'}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold">Active • Master Access</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">General Admins</div>
            <div className="text-sm font-black text-stone-900">
              {generalAdmins.length} of 3 Slots Filled
            </div>
            <div className="text-[10px] text-stone-500">
              Orders, Stock &amp; Content
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">System Capacity</div>
            <div className="text-sm font-black text-stone-900">
              {totalAccounts} / 4 Accounts
            </div>
            <div className="text-[10px] text-amber-700 font-bold">
              {4 - totalAccounts} available slots
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Authentication</div>
            <div className="text-sm font-black text-stone-900">
              PBKDF2 Hashed
            </div>
            <div className="text-[10px] text-stone-500">
              Rate-limiting (5 max attempts)
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-stone-900 text-base">Registered Admin Team</h3>
            <p className="text-xs text-stone-500">Accounts authorized to access the Sider Store Management system.</p>
          </div>
          <div className="text-xs font-bold text-stone-500">
            Current User: <span className="text-amber-700 font-black">{currentUser?.name}</span> ({isOwner ? 'Store Owner' : 'General Admin'})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200/70 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Admin Name &amp; Role</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {users.map((u) => {
                const isThisOwner = u.role === 'owner' || u.role === 'super_admin';
                const isSelf = u.id === currentUser?.id || u.email === currentUser?.email;

                return (
                  <tr key={u.id} className={`hover:bg-stone-50/80 transition-colors ${u.status === 'disabled' ? 'opacity-60 bg-stone-50/50' : ''}`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          isThisOwner ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-white'
                        }`}>
                          {u.name ? u.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-stone-200 text-stone-800">YOU</span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500">{u.roleTitle || (isThisOwner ? 'Store Owner' : 'General Admin')}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-700">
                      <div className="flex items-center gap-1.5">
                        {isThisOwner && !isOwner ? (
                          <div className="flex items-center gap-1.5 text-stone-400 font-sans italic text-xs">
                            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="text-stone-500 font-medium">•••••••• (Protected Owner Email)</span>
                          </div>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-stone-400" />
                            <span>{u.email}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isThisOwner ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Store Owner (Master)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <Users className="w-3 h-3" />
                          <span>General Admin</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.status === 'disabled' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <UserX className="w-3 h-3" />
                          <span>Disabled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <UserCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {u.lastLogin ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{new Date(u.lastLogin).toLocaleDateString()} {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Not logged in yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Owner Actions for General Admins */}
                        {isOwner && !isThisOwner && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                u.status === 'disabled' 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                              title={u.status === 'disabled' ? 'Activate Account' : 'Disable Account'}
                            >
                              {u.status === 'disabled' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => handleDeleteAdmin(u)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                              title="Delete Admin Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {isThisOwner && (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            Permanent Owner
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Architecture Guidance */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-950 space-y-2">
        <div className="font-bold flex items-center gap-2 text-amber-900">
          <ShieldAlert className="w-4 h-4" />
          <span>Sider Fashion Admin Security Protocol</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-amber-900 text-[11px] leading-relaxed">
          <li><strong>Single Store Owner:</strong> Full master authority over finances, ad spends, system settings, and administrator account creations.</li>
          <li><strong>General Admins (Max 3):</strong> Assigned to order processing, inventory sync, live courier dispatching, and catalog updates.</li>
          <li><strong>Zero-Old-Password Friction:</strong> Admins can easily update passwords or recover access using a single-use 6-digit verification code with 15-minute validity.</li>
          <li><strong>Brute-force Shield:</strong> Any IP with 5 consecutive incorrect password entries is blocked for 15 minutes.</li>
        </ul>
      </div>

      {/* MODAL 1: CREATE NEW GENERAL ADMIN (OWNER ONLY) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">Add New General Admin</h3>
                  <p className="text-[11px] text-stone-500">Slot {totalAccounts + 1} of 4</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Shakil Ahmed"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="shakil@siderfashion.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Role Title</label>
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  placeholder="e.g. Savar Dispatch Manager"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Initial Password (min 6 chars)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create secure password"
                    className="w-full pl-3 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-stone-950 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
