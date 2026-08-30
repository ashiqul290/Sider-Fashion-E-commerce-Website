import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  Factory, 
  Send, 
  CheckCircle2,
  ExternalLink,
  Building2,
  ShieldCheck,
  Facebook
} from 'lucide-react';
import { BRAND_CONTACTS } from '../data/products';
import { useCart } from '../context/CartContext';

export const ContactSection: React.FC = () => {
  const { openWhatsAppChat } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry / Retail Order');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  const handleWhatsAppContact = (phoneNum: string) => {
    openWhatsAppChat(
      `Hello Sider Fashion! I am contacting you from the website contact page regarding: ${subject}.\nName: ${name || 'Customer'}\nPhone: ${phone || 'N/A'}\nMessage: ${message || 'Please connect with me.'}`,
      phoneNum
    );
  };

  return (
    <section id="contact-section" className="py-16 sm:py-24 bg-black border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 bg-amber-950/60 border border-amber-900/60 px-3 py-1 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Connect with Sider Fashion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
            Contact &amp; Factory Location
          </h2>
          <p className="text-base text-zinc-400 font-bangla">
            আমাদের কারখানা ও সেলস টিমের সাথে সরাসরি যোগাযোগ করুন — আশুলিয়া, সাভার, ঢাকা।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Contact Cards & Location Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Location Card */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-amber-500 text-black shrink-0 font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-sans">
                    Factory &amp; Business Address
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {BRAND_CONTACTS.locationDisplay}
                  </h3>
                  <p className="text-xs text-zinc-300 font-bangla mt-1">
                    আশুলিয়া, সাভার, ঢাকা (সাভার শিল্পাঞ্চল ও ইপিজেড এর সন্নিকটে)
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Recognizable landmark: Located in the renowned Savar apparel manufacturing zone, Dhaka, Bangladesh.
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Working Hours: <strong className="text-white">{BRAND_CONTACTS.workingHours}</strong></span>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Callouts */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-white space-y-5 shadow-lg">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>Call &amp; WhatsApp Hotlines</span>
                </h4>
                <p className="text-xs text-zinc-400 font-bangla mt-1">
                  উভয় নম্বরেই কল ও হোয়াটসঅ্যাপে সার্বক্ষণিক যোগাযোগ করতে পারবেন:
                </p>
              </div>

              {/* Phone 1 */}
              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-400 font-semibold font-mono">Primary Helpline</div>
                  <div className="text-lg font-extrabold text-white">{BRAND_CONTACTS.primaryPhone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${BRAND_CONTACTS.primaryPhone}`}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors cursor-pointer border border-zinc-700"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleWhatsAppContact(BRAND_CONTACTS.primaryPhone)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>

              {/* Phone 2 */}
              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-400 font-semibold font-mono">Secondary / Wholesale Desk</div>
                  <div className="text-lg font-extrabold text-white">{BRAND_CONTACTS.secondaryPhone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${BRAND_CONTACTS.secondaryPhone}`}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors cursor-pointer border border-zinc-700"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleWhatsAppContact(BRAND_CONTACTS.secondaryPhone)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>

              {/* Email info */}
              <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email: <span className="text-zinc-300">{BRAND_CONTACTS.email}</span></span>
              </div>
            </div>

            {/* Social Media / Facebook & WhatsApp Card */}
            <div id="contact-social-card" className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Facebook className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Follow Sider Fashion on Facebook
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Stay updated with our latest products, collections and offers.
                  </p>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  id="contact-facebook-follow-btn"
                  href={BRAND_CONTACTS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-all shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <Facebook className="w-4 h-4 fill-white" />
                  <span>Follow on Facebook</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <button
                  id="contact-whatsapp-chat-btn"
                  onClick={() => handleWhatsAppContact(BRAND_CONTACTS.primaryPhone)}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-all shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp Chat</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-sm">
              
              {!submitted ? (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Send a Message (মেসেজ পাঠান)
                    </h3>
                    <p className="text-xs text-zinc-400 font-bangla mt-1">
                      পোশাকের সাইজ, খুচরা বা পাইকারি অর্ডার সংক্রান্ত যেকোনো প্রশ্নের জন্য মেসেজ দিন।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                        Your Name *
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 text-sm bg-zinc-950 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone-input"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 text-sm bg-zinc-950 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                      Inquiry Type
                    </label>
                    <select
                      id="contact-subject-select"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 text-sm bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="General Inquiry / Retail Order">General Inquiry / Retail Order (খুচরা অর্ডার)</option>
                      <option value="Wholesale & Bulk Supply">Wholesale &amp; Bulk Supply (পাইকারি সরবরাহ)</option>
                      <option value="Exchange or Return Query">Exchange or Return Query (এক্সচেঞ্জ/রিটার্ন)</option>
                      <option value="Custom Garments Manufacturing">Custom Garments Manufacturing (কাস্টম উৎপাদন)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message-input"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your question or request here..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 text-sm bg-zinc-950 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-lg text-sm transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-4 h-4 text-black" />
                      <span>Send Inquiry</span>
                    </button>

                    <button
                      id="contact-instant-whatsapp-btn"
                      type="button"
                      onClick={() => handleWhatsAppContact(BRAND_CONTACTS.primaryPhone)}
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Thank You, {name}!
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto font-bangla">
                    আপনার বার্তাটি আমাদের সাভার কাস্টমার সাপোর্ট টিমের কাছে পৌঁছেছে। আমরা দ্রুত আপনার নম্বর <strong>{phone}</strong> এ রেসপন্স করব।
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold text-amber-400 hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
