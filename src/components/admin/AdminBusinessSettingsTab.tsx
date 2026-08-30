import React, { useState } from 'react';
import { 
  Settings, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Truck, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  DollarSign, 
  Facebook, 
  Globe,
  HelpCircle,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  Share2,
  Layers,
  AlertCircle
} from 'lucide-react';
import { BusinessSettings, ContactItem, SocialLinkItem } from '../../types/adminTypes';
import { AdminStoreService, DEFAULT_CONTACTS, DEFAULT_SOCIAL_LINKS } from '../../services/adminStoreService';

interface AdminBusinessSettingsTabProps {
  onRefresh: () => void;
  adminName: string;
}

export const AdminBusinessSettingsTab: React.FC<AdminBusinessSettingsTabProps> = ({
  onRefresh,
  adminName
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'contacts' | 'socials'>('general');
  const [settings, setSettings] = useState<BusinessSettings>(AdminStoreService.getSettings());
  const [contacts, setContacts] = useState<ContactItem[]>(AdminStoreService.getContacts());
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(AdminStoreService.getSocialLinks());
  
  // Contact Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
  const [contactType, setContactType] = useState<ContactItem['type']>('hotline');
  const [contactLabel, setContactLabel] = useState('');
  const [contactLabelBn, setContactLabelBn] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [contactIsPrimary, setContactIsPrimary] = useState(false);
  const [contactIsActive, setContactIsActive] = useState(true);

  // Social Link Modal State
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLinkItem | null>(null);
  const [socialPlatform, setSocialPlatform] = useState<SocialLinkItem['platform']>('facebook');
  const [socialDisplayName, setSocialDisplayName] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [socialIsActive, setSocialIsActive] = useState(true);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- General Settings Save ---
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    AdminStoreService.saveSettings(settings, adminName);
    showToast('Business & Storefront settings updated in real-time!');
    onRefresh();
  };

  // --- Contact CRUD Handlers ---
  const handleOpenAddContact = () => {
    setEditingContact(null);
    setContactType('phone');
    setContactLabel('');
    setContactLabelBn('');
    setContactValue('');
    setContactIsPrimary(false);
    setContactIsActive(true);
    setIsContactModalOpen(true);
  };

  const handleOpenEditContact = (c: ContactItem) => {
    setEditingContact(c);
    setContactType(c.type);
    setContactLabel(c.label);
    setContactLabelBn(c.labelBn || '');
    setContactValue(c.value);
    setContactIsPrimary(!!c.isPrimary);
    setContactIsActive(c.isActive !== false);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactLabel.trim() || !contactValue.trim()) return;

    const itemToSave: ContactItem = {
      id: editingContact ? editingContact.id : `contact-${Date.now()}`,
      type: contactType,
      label: contactLabel.trim(),
      labelBn: contactLabelBn.trim() || contactLabel.trim(),
      value: contactValue.trim(),
      isPrimary: contactIsPrimary,
      isActive: contactIsActive,
      displayOrder: editingContact ? editingContact.displayOrder : contacts.length + 1
    };

    let updated: ContactItem[];
    if (editingContact) {
      updated = contacts.map(c => c.id === itemToSave.id ? itemToSave : c);
      showToast(`Contact "${itemToSave.label}" updated.`);
    } else {
      updated = [...contacts, itemToSave];
      showToast(`Contact "${itemToSave.label}" added.`);
    }

    setContacts(updated);
    AdminStoreService.saveContacts(updated, adminName);
    setIsContactModalOpen(false);
    onRefresh();
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    AdminStoreService.saveContacts(updated, adminName);
    showToast('Contact deleted.');
    onRefresh();
  };

  const handleToggleContactActive = (id: string) => {
    const updated = contacts.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    setContacts(updated);
    AdminStoreService.saveContacts(updated, adminName);
    showToast('Contact visibility updated.');
    onRefresh();
  };

  const handleMoveContact = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contacts.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...contacts];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    // update order
    updated.forEach((c, idx) => c.displayOrder = idx + 1);
    setContacts(updated);
    AdminStoreService.saveContacts(updated, adminName);
    onRefresh();
  };

  // --- Social Media CRUD Handlers ---
  const handleOpenAddSocial = () => {
    setEditingSocial(null);
    setSocialPlatform('facebook');
    setSocialDisplayName('');
    setSocialUrl('');
    setSocialIsActive(true);
    setIsSocialModalOpen(true);
  };

  const handleOpenEditSocial = (s: SocialLinkItem) => {
    setEditingSocial(s);
    setSocialPlatform(s.platform);
    setSocialDisplayName(s.displayName);
    setSocialUrl(s.url);
    setSocialIsActive(s.isActive !== false);
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialDisplayName.trim() || !socialUrl.trim()) return;

    const itemToSave: SocialLinkItem = {
      id: editingSocial ? editingSocial.id : `social-${Date.now()}`,
      platform: socialPlatform,
      displayName: socialDisplayName.trim(),
      url: socialUrl.trim(),
      isActive: socialIsActive,
      displayOrder: editingSocial ? editingSocial.displayOrder : socialLinks.length + 1
    };

    let updated: SocialLinkItem[];
    if (editingSocial) {
      updated = socialLinks.map(s => s.id === itemToSave.id ? itemToSave : s);
      showToast(`Social link "${itemToSave.displayName}" updated.`);
    } else {
      updated = [...socialLinks, itemToSave];
      showToast(`Social link "${itemToSave.displayName}" added.`);
    }

    setSocialLinks(updated);
    AdminStoreService.saveSocialLinks(updated, adminName);
    setIsSocialModalOpen(false);
    onRefresh();
  };

  const handleDeleteSocial = (id: string) => {
    const updated = socialLinks.filter(s => s.id !== id);
    setSocialLinks(updated);
    AdminStoreService.saveSocialLinks(updated, adminName);
    showToast('Social link deleted.');
    onRefresh();
  };

  const handleToggleSocialActive = (id: string) => {
    const updated = socialLinks.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
    setSocialLinks(updated);
    AdminStoreService.saveSocialLinks(updated, adminName);
    showToast('Social link visibility updated.');
    onRefresh();
  };

  const handleMoveSocial = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === socialLinks.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...socialLinks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((s, idx) => s.displayOrder = idx + 1);
    setSocialLinks(updated);
    AdminStoreService.saveSocialLinks(updated, adminName);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-black text-stone-950 font-sans">Business &amp; System Configuration</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage hotlines, official contacts, social links, courier rates, and payment gateways.
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSection('general')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'general' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            General &amp; Rates
          </button>
          <button
            onClick={() => setActiveSection('contacts')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'contacts' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveSection('socials')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'socials' ? 'bg-white text-stone-950 shadow-xs font-black' : 'text-stone-600'
            }`}
          >
            Social Media ({socialLinks.length})
          </button>
        </div>
      </div>

      {/* SECTION 1: GENERAL SETTINGS */}
      {activeSection === 'general' && (
        <form onSubmit={handleSaveGeneral} className="space-y-6">

          {/* Contact Numbers & Factory Info */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Phone className="w-4 h-4 text-amber-700" />
              <h3 className="font-black text-stone-900 text-sm">Primary Brand Information &amp; Hotlines</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={settings.brandName || 'Sider Fashion'}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Retail Hotline *</label>
                <input
                  type="text"
                  required
                  value={settings.primaryPhone}
                  onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Wholesale / Factory Hotline *</label>
                <input
                  type="text"
                  required
                  value={settings.secondaryPhone}
                  onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value, wholesalePhone: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Factory Location</label>
                <input
                  type="text"
                  value={settings.factoryAddress}
                  onChange={(e) => setSettings({ ...settings, factoryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Business Operating Hours</label>
                <input
                  type="text"
                  value={settings.workingHours}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Courier & Delivery Rates */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Truck className="w-4 h-4 text-amber-700" />
              <h3 className="font-black text-stone-900 text-sm">Delivery Rates &amp; Shipping Policy</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Inside Dhaka Delivery (৳) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={settings.deliveryFeeInsideDhaka}
                  onChange={(e) => setSettings({ ...settings, deliveryFeeInsideDhaka: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Outside Dhaka Delivery (৳) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={settings.deliveryFeeOutsideDhaka}
                  onChange={(e) => setSettings({ ...settings, deliveryFeeOutsideDhaka: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Free Delivery Minimum (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Financial & Fraud Settings */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <h3 className="font-black text-stone-900 text-sm">Inventory &amp; Security Thresholds</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Low Stock Alert Threshold (Pcs)</label>
                <input
                  type="number"
                  min={1}
                  value={settings.lowStockThreshold || 10}
                  onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="dupTrxBlock"
                  checked={settings.enableDuplicateTrxBlock}
                  onChange={(e) => setSettings({ ...settings, enableDuplicateTrxBlock: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="dupTrxBlock" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Block Duplicate TrxID Submissions
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="suspiciousAuto"
                  checked={settings.enableAutoSuspiciousFlag}
                  onChange={(e) => setSettings({ ...settings, enableAutoSuspiciousFlag: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="suspiciousAuto" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Auto-Flag High Risk Orders
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save General Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: CONTACTS MANAGEMENT (Item 2) */}
      {activeSection === 'contacts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-black text-stone-900 text-sm">Official Contacts &amp; Helpdesks</h3>
              <p className="text-xs text-stone-500">Live phone, WhatsApp, email, and factory contact points displayed on website &amp; footer.</p>
            </div>

            <button
              onClick={handleOpenAddContact}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Order</th>
                    <th className="py-3 px-4">Contact Label &amp; Type</th>
                    <th className="py-3 px-4">Value / Number / Address</th>
                    <th className="py-3 px-4 text-center">Primary</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {contacts.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Reorder Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveContact(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-stone-200 text-stone-500 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveContact(idx, 'down')}
                            disabled={idx === contacts.length - 1}
                            className="p-1 rounded hover:bg-stone-200 text-stone-500 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Label & Type */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{c.label}</div>
                        <div className="text-[11px] text-stone-500 font-bangla">{c.labelBn}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-amber-50 text-amber-800 text-[10px] font-mono font-bold capitalize">
                          {c.type}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">
                        {c.value}
                      </td>

                      {/* Primary */}
                      <td className="py-3 px-4 text-center">
                        {c.isPrimary ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Primary</span>
                        ) : (
                          <span className="text-stone-400 text-[10px]">Standard</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleContactActive(c.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            c.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {c.isActive !== false ? 'Active (Live)' : 'Hidden'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditContact(c)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                            title="Edit Contact"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SOCIAL MEDIA MANAGEMENT (Item 3) */}
      {activeSection === 'socials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-black text-stone-900 text-sm">Social Media Channels &amp; Links</h3>
              <p className="text-xs text-stone-500">Facebook, Instagram, TikTok, YouTube, WhatsApp, Messenger links displayed across the store.</p>
            </div>

            <button
              onClick={handleOpenAddSocial}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Platform</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((s, idx) => (
              <div key={s.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-mono font-bold uppercase">
                      {s.platform}
                    </span>
                    <button
                      onClick={() => handleToggleSocialActive(s.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        s.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {s.isActive !== false ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-bold text-stone-900 text-sm">{s.displayName}</h4>
                    <a 
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-amber-700 hover:underline break-all block mt-1"
                    >
                      {s.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveSocial(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-stone-100 text-stone-500 disabled:opacity-30 cursor-pointer"
                      title="Move Left/Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSocial(idx, 'down')}
                      disabled={idx === socialLinks.length - 1}
                      className="p-1 rounded hover:bg-stone-100 text-stone-500 disabled:opacity-30 cursor-pointer"
                      title="Move Right/Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditSocial(s)}
                      className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSocial(s.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Social Platform"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">
                {editingContact ? 'Edit Official Contact' : 'Add New Contact Point'}
              </h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Contact Type *</label>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value as ContactItem['type'])}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-medium cursor-pointer"
                >
                  <option value="hotline">Phone Hotline</option>
                  <option value="whatsapp">WhatsApp Live Chat</option>
                  <option value="wholesale">Wholesale &amp; Factory Contact</option>
                  <option value="email">Official Email</option>
                  <option value="factory">Factory Address</option>
                  <option value="showroom">Showroom / Store Address</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Label (English) *</label>
                <input
                  type="text"
                  required
                  value={contactLabel}
                  onChange={(e) => setContactLabel(e.target.value)}
                  placeholder="e.g. 24/7 Retail Hotline"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Label (Bangla)</label>
                <input
                  type="text"
                  value={contactLabelBn}
                  onChange={(e) => setContactLabelBn(e.target.value)}
                  placeholder="e.g. ২৪/৭ রিটেইল হটলাইন"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-bangla"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Value (Phone, WhatsApp, Email, or Address) *</label>
                <input
                  type="text"
                  required
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="e.g. 01712773063 or Ashulia, Savar"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactIsPrimary}
                    onChange={(e) => setContactIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span className="text-xs font-bold text-stone-800">Set as Primary</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactIsActive}
                    onChange={(e) => setContactIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span className="text-xs font-bold text-stone-800">Active Live</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOCIAL MODAL */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-black text-stone-950 text-base">
                {editingSocial ? 'Edit Social Link' : 'Add Social Platform'}
              </h3>
              <button onClick={() => setIsSocialModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Platform *</label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-medium cursor-pointer"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="whatsapp">WhatsApp Channel</option>
                  <option value="messenger">Messenger</option>
                  <option value="other">Other Platform</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Display Name *</label>
                <input
                  type="text"
                  required
                  value={socialDisplayName}
                  onChange={(e) => setSocialDisplayName(e.target.value)}
                  placeholder="e.g. Sider Fashion Official Page"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">URL / Link *</label>
                <input
                  type="url"
                  required
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={socialIsActive}
                    onChange={(e) => setSocialIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span className="text-xs font-bold text-stone-800">Active on Public Store</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
