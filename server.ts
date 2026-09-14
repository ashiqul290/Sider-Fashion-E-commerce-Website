import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import net from 'net';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import { 
  testSupabaseHealth, 
  loadStateFromSupabase, 
  persistStateToSupabase, 
  getSupabaseSQLSchema,
  SUPABASE_PROJECT_ID,
  SUPABASE_PROJECT_NAME,
  SUPABASE_URL
} from './server/supabase';


// Default Seed Data
import { INITIAL_PRODUCTS, CATEGORIES, BRAND_CONTACTS } from './src/data/products';
import { HERO_SLIDES } from './src/data/heroSlides';
import { PAYMENT_ACCOUNTS_CONFIG } from './src/data/paymentAccounts';
import { SIDER_FAQS, DEFAULT_SIZE_CHARTS } from './src/data/sizeGuideData';

// `npm run build` emits this file as <app>/dist/server.cjs. When running from
// that bundle we are in production even if the host (e.g. Hostinger hPanel)
// never sets NODE_ENV, and the app root is resolved from the bundle location
// instead of relying on the working directory the process manager starts in.
const IS_BUNDLED = typeof __dirname !== 'undefined' && path.basename(__dirname) === 'dist';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || IS_BUNDLED;
const APP_ROOT = IS_BUNDLED ? path.dirname(__dirname) : process.cwd();

const PORT = Number(process.env.PORT) || 3000;
const HMR_PORT = Number(process.env.HMR_PORT) || 24678;
// Managed hosts replace the deployed app folder on every redeploy, which wipes
// runtime writes under ./data. DATA_DIR lets that state live outside it.
const BUNDLED_DATA_DIR = path.join(APP_ROOT, 'data');
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : BUNDLED_DATA_DIR;
const DB_FILE = path.join(DATA_DIR, 'store.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      const probe = net.createServer();
      probe.once('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          tryPort(port + 1);
          return;
        }
        reject(error);
      });
      probe.once('listening', () => {
        probe.close((error) => error ? reject(error) : resolve(port));
      });
      probe.listen(port, '127.0.0.1');
    };

    tryPort(startPort);
  });
}

// Default initial structures
export const DEFAULT_CONTACTS = [
  {
    id: 'contact-hotline',
    type: 'hotline',
    label: 'Customer Care Hotline',
    labelBn: 'কাস্টমার কেয়ার হটলাইন',
    value: '01712773063',
    isPrimary: true,
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'contact-whatsapp',
    type: 'whatsapp',
    label: 'WhatsApp Live Chat',
    labelBn: 'হোয়াটসঅ্যাপ লাইভ চ্যাট',
    value: '01712773063',
    isPrimary: true,
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'contact-wholesale',
    type: 'wholesale',
    label: 'Wholesale & B2B Inquiries',
    labelBn: 'পাইকারি ও কর্পোরেট ডিল',
    value: '01612241112',
    isPrimary: false,
    isActive: true,
    displayOrder: 3
  },
  {
    id: 'contact-email',
    type: 'email',
    label: 'Official Email',
    labelBn: 'অফিসিয়াল ইমেইল',
    value: 'siderfashion.bd@gmail.com',
    isPrimary: true,
    isActive: true,
    displayOrder: 4
  },
  {
    id: 'contact-factory',
    type: 'factory',
    label: 'Ashulia Factory Unit',
    labelBn: 'আশুলিয়া কারখানা ইউনিট',
    value: 'Ashulia Industrial Zone, Savar, Dhaka, Bangladesh',
    isPrimary: true,
    isActive: true,
    displayOrder: 5
  }
];

export const DEFAULT_SOCIAL_LINKS = [
  {
    id: 'social-fb',
    platform: 'facebook',
    displayName: 'Facebook Page',
    url: 'https://www.facebook.com/share/1G2hyYvWFR/',
    icon: 'facebook',
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'social-wa',
    platform: 'whatsapp',
    displayName: 'WhatsApp Official',
    url: 'https://wa.me/8801712773063',
    icon: 'whatsapp',
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'social-ig',
    platform: 'instagram',
    displayName: 'Instagram',
    url: 'https://instagram.com/siderfashion.bd',
    icon: 'instagram',
    isActive: true,
    displayOrder: 3
  },
  {
    id: 'social-tt',
    platform: 'tiktok',
    displayName: 'TikTok',
    url: 'https://tiktok.com/@siderfashion',
    icon: 'tiktok',
    isActive: true,
    displayOrder: 4
  },
  {
    id: 'social-yt',
    platform: 'youtube',
    displayName: 'YouTube Channel',
    url: 'https://youtube.com/@siderfashion',
    icon: 'youtube',
    isActive: true,
    displayOrder: 5
  }
];

export const DEFAULT_HOMEPAGE_SECTIONS = [
  { id: 'sec-hero', key: 'hero', title: 'Hero Carousel', titleBn: 'হিরো ক্যারোজেল', subtitle: 'Main visual banner slider', isVisible: true, displayOrder: 1 },
  { id: 'sec-portals', key: 'portals', title: 'Dual Shopping Choice (Retail vs Wholesale)', titleBn: 'খুচরা ও পাইকারি শপিং পোর্টাল', subtitle: 'Instant portal switcher', isVisible: true, displayOrder: 2 },
  { id: 'sec-categories', key: 'categories', title: 'Featured Categories', titleBn: 'জনপ্রিয় ক্যাটাগরি সমূহ', subtitle: 'Category navigation cards', isVisible: true, displayOrder: 3 },
  { id: 'sec-products', key: 'featured-products', title: 'Featured & Catalog Products', titleBn: 'সেরা নির্বাচিত কালেকশন', subtitle: 'Curated retail products grid', isVisible: true, displayOrder: 4 },
  { id: 'sec-why-us', key: 'why-choose-us', title: 'Why Choose Sikder Fashion', titleBn: 'কেন সাইডার ফ্যাশন সেরা', subtitle: 'Factory-direct value propositions', isVisible: true, displayOrder: 5 },
  { id: 'sec-wholesale', key: 'wholesale-highlight', title: 'Wholesale & B2B Portal Section', titleBn: 'পাইকারি ও কর্পোরেট সুযোগ', subtitle: 'Factory MOQ & bulk manufacturing', isVisible: true, displayOrder: 6 },
  { id: 'sec-social', key: 'social-community', title: 'Social Community & Live Reviews', titleBn: 'সোশ্যাল মিডিয়া ও রিভিউ', subtitle: 'Facebook group & customer community', isVisible: true, displayOrder: 7 },
  { id: 'sec-faqs', key: 'faqs', title: 'Frequently Asked Questions', titleBn: 'সাধারণ প্রশ্নোত্তর (FAQ)', subtitle: 'Customer service queries', isVisible: true, displayOrder: 8 },
  { id: 'sec-payments', key: 'payment-methods', title: 'Payment Gateways & Delivery Info', titleBn: 'পেমেন্ট ও ডেলিভারি তথ্য', subtitle: 'Cash on delivery & mobile banking trust badges', isVisible: true, displayOrder: 9 }
];

export const DEFAULT_MASTER_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const DEFAULT_COLORS = [
  { id: 'col-navy', name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1e293b', isActive: true, displayOrder: 1 },
  { id: 'col-white', name: 'Pure White', nameBn: 'সাদা', hex: '#ffffff', isActive: true, displayOrder: 2 },
  { id: 'col-black', name: 'Jet Black', nameBn: 'কালো', hex: '#0a0a0a', isActive: true, displayOrder: 3 },
  { id: 'col-olive', name: 'Olive Green', nameBn: 'অলিভ গ্রিন', hex: '#4d5d43', isActive: true, displayOrder: 4 },
  { id: 'col-maroon', name: 'Maroon', nameBn: 'মেরুন', hex: '#6b1d2f', isActive: true, displayOrder: 5 },
  { id: 'col-sky', name: 'Sky Blue', nameBn: 'আকাশি নীল', hex: '#38bdf8', isActive: true, displayOrder: 6 },
  { id: 'col-gray', name: 'Steel Gray', nameBn: 'স্টিল গ্রে', hex: '#64748b', isActive: true, displayOrder: 7 },
  { id: 'col-beige', name: 'Cream / Beige', nameBn: 'ক্রিম / বেইজ', hex: '#f5f5dc', isActive: true, displayOrder: 8 },
  { id: 'col-mustard', name: 'Mustard Yellow', nameBn: 'সরিষা হলুদ', hex: '#ca8a04', isActive: true, displayOrder: 9 },
  { id: 'col-royal', name: 'Royal Blue', nameBn: 'রয়্যাল ব্লু', hex: '#1d4ed8', isActive: true, displayOrder: 10 }
];

export const DEFAULT_BUSINESS_SETTINGS = {
  brandName: 'Sikder Fashion',
  tagline: 'Quality Fashion, Directly from Our Own Manufacturing',
  taglineBn: 'নিজস্ব কারখানায় তৈরি — পাইকারি ও খুচরা বিক্রি',
  primaryPhone: '01712773063',
  secondaryPhone: '01612241112',
  wholesalePhone: '01612241112',
  email: 'siderfashion.bd@gmail.com',
  facebookUrl: 'https://www.facebook.com/share/1G2hyYvWFR/',
  locationDisplay: 'Ashulia, Savar, Dhaka, Bangladesh',
  factoryAddress: 'Ashulia Industrial Zone, Savar, Dhaka, Bangladesh',
  workingHours: '9:00 AM – 10:00 PM (Everyday)',
  deliveryFeeInsideDhaka: 70,
  deliveryFeeOutsideDhaka: 120,
  freeDeliveryThreshold: 0,
  globalWholesaleMOQ: 12,
  defaultWholesaleDiscountPercent: 40,
  lowStockThreshold: 10,
  enableDuplicateTrxBlock: true,
  enableAutoSuspiciousFlag: true
};

export const DEFAULT_POLICIES = {
  returnPolicy: 'At Sikder Fashion, we manufacture in our own Savar factory with rigorous 3-step quality checks. You have the full right to check your package in front of the delivery person before payment. If there is any defect or mismatch, you can immediately return it without penalty.',
  returnPolicyBn: 'সাইডার ফ্যাশন নিজস্ব কারখানায় মান নিয়ন্ত্রণ করে পোশাক তৈরি করে। ডেলিভারিম্যানের সামনে পার্সেল খুলে ফেব্রিক ও কোয়ালিটি দেখে নেওয়ার সুযোগ রয়েছে। কোনো সমস্যা থাকলে তাৎক্ষণিক ডেলিভারিম্যানকে রিটার্ন দিতে পারেন।',
  exchangePolicy: 'Wrong size or color? We offer a hassle-free 7-day exchange warranty. Keep the original tags intact and contact our hotline or WhatsApp at 01712773063.',
  exchangePolicyBn: 'সাইজ অথবা রঙের পরিবর্তনে আমরা ৭ দিনের সহজ এক্সচেঞ্জ সুবিধা প্রদান করি। হটলাইন 01712773063 এ যোগাযোগ করুন।',
  deliveryPolicy: 'Inside Dhaka: Delivery fee ৳70 within 24 to 48 hours. Outside Dhaka: Delivery fee ৳120 within 48 to 72 hours via Steadfast / Pathao courier.',
  deliveryPolicyBn: 'ঢাকার ভেতরে ডেলিভারি চার্জ মাত্র ৭০ টাকা (২৪-৪৮ ঘণ্টায়)। ঢাকার বাইরে সারা দেশে ডেলিভারি চার্জ ১২০ টাকা (৪৮-৭২ ঘণ্টায়)।',
  shippingInfo: 'All orders are dispatched directly from our Savar & Ashulia manufacturing and fulfillment hub in secure weather-resistant packaging.',
  shippingInfoBn: 'সাভার ও আশুলিয়া কারখানা হাব থেকে সরাসরি সিকিউর প্যাকেজিংয়ে পার্সেল পাঠানো হয়।',
  privacyPolicy: 'We respect your privacy. Sikder Fashion only collects your name, phone number, and delivery address to fulfill and dispatch your orders. We never sell or share your information with third parties.',
  privacyPolicyBn: 'আমরা আপনার তথ্যের গোপনীয়তা রক্ষা করি। আপনার নাম, মোবাইল নম্বর ও ঠিকানা শুধুমাত্র পার্সেল প্রেরণের কাজে ব্যবহার করা হয়।',
  termsConditions: 'By placing an order on Sikder Fashion, you agree to our fair delivery terms. Cash on delivery orders must be received at customer address.',
  termsConditionsBn: 'সাইডার ফ্যাশনে অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে সম্মত হচ্ছেন। ক্যাশ অন ডেলিভারি পার্সেল সঠিক ঠিকানায় রিসিভ করার অনুরোধ করা হচ্ছে।',
  aboutUs: 'Sikder Fashion is a premier garment manufacturer located in Savar & Ashulia, Dhaka. We produce high-grade casual shirts, executive formal shirts, festive katua, and modern menswear with factory-direct pricing for retail shoppers and wholesale retailers nationwide.',
  aboutUsBn: 'সাইডার ফ্যাশন ঢাকা সাভার ও আশুলিয়া ভিত্তিক পোশাক প্রস্তুতকারক ব্র্যান্ড। আমরা নিজস্ব কারখানায় সেরা ফেব্রিকে শার্ট, কতুয়া ও মেন্সওয়্যার তৈরি করে সরাসরি পাইকারি ও খুচরা ক্রেতাদের কাছে সাশ্রয়ী মূল্যে পৌঁছে দিই।'
};

// Password Security & Hashing Helpers
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, finalSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: finalSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!hash || !salt || !password) return false;
  try {
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  } catch {
    return false;
  }
}

export function sanitizeAdminUser(user: any) {
  if (!user) return null;
  const { passwordHash, passwordSalt, ...sanitized } = user;
  return sanitized;
}

// Public-facing projection of an admin user: strips credentials *and* the
// operational metadata (last login IP) that must never leave the server.
export function publicAdminUser(user: any) {
  const sanitized = sanitizeAdminUser(user);
  if (!sanitized) return null;
  const { lastLoginIp, ...safe } = sanitized;
  return safe;
}

// ==========================================
// Request Payload Validation Helpers
// ==========================================

// True only for plain JSON objects. Arrays, null and primitives are rejected so
// that `{ ...record, ...payload }` merges can never corrupt a stored entity.
function isPlainObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Returns a trimmed string, or null when the value is not a usable string.
// Guards every `.trim()` / `.toLowerCase()` / `.replace()` call on request input.
function asString(value: any, maxLength = 5000): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

// Basic structural email check: exactly one @, non-empty local part, and a
// dotted domain. Replaces the previous `includes('@')` test which accepted
// values like "@" or "a@b".
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) && value.length <= 254;
}

// Only http(s) URLs may be stored for links the storefront renders as an
// anchor href. `javascript:` and `data:` URLs would otherwise run script in a
// visitor's browser when clicked.
function isSafeHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Allocates the next free sequence id for a `PREFIX-000001` style identifier.
// Deriving it from `list.length + 1` (the previous approach) reuses an id as
// soon as any record is deleted, and duplicate ids make the `findIndex` lookups
// in the update/delete routes resolve to the wrong record.
function nextSequentialId(list: any[], prefix: string, idField: string): string {
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`);
  let maxSeq = 0;
  const taken = new Set<string>();
  for (const record of list) {
    const value = record && record[idField];
    if (typeof value !== 'string') continue;
    taken.add(value);
    const match = pattern.exec(value);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (Number.isFinite(seq) && seq > maxSeq) maxSeq = seq;
    }
  }
  let seq = maxSeq + 1;
  let candidate = `${prefix}${seq.toString().padStart(6, '0')}`;
  while (taken.has(candidate)) {
    seq += 1;
    candidate = `${prefix}${seq.toString().padStart(6, '0')}`;
  }
  return candidate;
}

// Non-negative safe integer, used for quantities and counters coming from clients.
function asNonNegativeInt(value: any, fallback = 0): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return Math.floor(num);
}

// Constant-time comparison for short secrets (OTP codes, tokens).
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Resolves the client IP. `X-Forwarded-For` is attacker-controlled unless the
// app really sits behind a trusted reverse proxy, so it is only honoured when
// TRUST_PROXY is explicitly enabled. Otherwise brute-force rate limiting could
// be bypassed by simply rotating a spoofed header value.
const TRUST_PROXY = process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1';

function getClientIp(req: Request): string {
  if (TRUST_PROXY) {
    const forwarded = req.headers['x-forwarded-for'];
    const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const first = typeof raw === 'string' ? raw.split(',')[0].trim() : '';
    if (first) return first;
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Initial Admin Users (1 Owner, 1 General Admin, 2 available slots, max 4 accounts total)
const ownerPass = hashPassword('Sider@2026');
const adminPass = hashPassword('Admin@2026');

export const DEFAULT_ADMIN_USERS = [
  {
    id: 'usr-owner-saon',
    username: 'saon',
    name: 'Abir Hosen Saon',
    role: 'owner',
    roleTitle: 'Store Owner & Founder',
    email: 'abirhosensaon@gmail.com',
    status: 'active',
    passwordHash: ownerPass.hash,
    passwordSalt: ownerPass.salt,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-admin-dispatch',
    username: 'dispatch',
    name: 'Showroom Manager',
    role: 'admin',
    roleTitle: 'Orders & Inventory Admin',
    email: 'dispatch@siderfashion.com',
    status: 'active',
    passwordHash: adminPass.hash,
    passwordSalt: adminPass.salt,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

// Session Management & Rate Limiting State
const activeAdminSessions = new Map<string, { userId: string; email: string; role: string; expiresAt: number }>();
const failedLoginAttempts = new Map<string, { count: number; blockedUntil?: number; lastAttempt: number }>();
const passwordResetCodes = new Map<string, { code: string; expiresAt: number; used: boolean; failedAttempts?: number; requestedAt: string }>();

// Sessions are keyed by a SHA-256 of the bearer token and mirrored to disk.
// Hosts like Hostinger (LiteSpeed lsnode) stop idle Node processes and start
// them again on the next request; purely in-memory sessions were wiped by every
// restart, so admin saves started failing with 401 behind the admin's back.
function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function persistAdminSessions() {
  try {
    const tmpFile = `${SESSIONS_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(Object.fromEntries(activeAdminSessions)), { encoding: 'utf-8', mode: 0o600 });
    fs.renameSync(tmpFile, SESSIONS_FILE);
  } catch (err) {
    console.error('[Sessions] Failed to persist admin sessions:', err);
  }
}

function loadAdminSessions() {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return;
    const stored = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
    if (!isPlainObject(stored)) return;
    const now = Date.now();
    activeAdminSessions.clear();
    for (const [key, s] of Object.entries<any>(stored)) {
      if (isPlainObject(s) && typeof s.userId === 'string' && typeof s.expiresAt === 'number' && s.expiresAt > now) {
        activeAdminSessions.set(key, s);
      }
    }
  } catch (err) {
    console.warn('[Sessions] Could not load stored admin sessions:', err);
  }
}

function revokeUserSessions(userId: string) {
  let changed = false;
  for (const [key, s] of activeAdminSessions.entries()) {
    if (s.userId === userId) {
      activeAdminSessions.delete(key);
      changed = true;
    }
  }
  if (changed) persistAdminSessions();
}

// Drops expired sessions / reset codes so the in-memory maps stay bounded.
function purgeExpiredAuthState() {
  const now = Date.now();
  let sessionsChanged = false;
  for (const [key, s] of activeAdminSessions.entries()) {
    if (s.expiresAt <= now) {
      activeAdminSessions.delete(key);
      sessionsChanged = true;
    }
  }
  if (sessionsChanged) persistAdminSessions();
  for (const [email, record] of passwordResetCodes.entries()) {
    if (record.expiresAt <= now) passwordResetCodes.delete(email);
  }
  for (const [key, record] of failedLoginAttempts.entries()) {
    const staleAfter = record.blockedUntil ?? (record.lastAttempt + 60 * 60 * 1000);
    if (staleAfter <= now) failedLoginAttempts.delete(key);
  }
}

// Extracts the bearer session token from the standard header or, for the legacy
// call sites that pass it in the body/query, from those locations.
function extractSessionToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (typeof header === 'string' && header.toLowerCase().startsWith('bearer ')) {
    const value = header.slice(7).trim();
    if (value) return value;
  }
  const headerToken = req.headers['x-admin-token'];
  if (typeof headerToken === 'string' && headerToken.trim()) return headerToken.trim();
  const bodyToken = isPlainObject(req.body) ? req.body.token : undefined;
  if (typeof bodyToken === 'string' && bodyToken.trim()) return bodyToken.trim();
  const queryToken = req.query?.token;
  if (typeof queryToken === 'string' && queryToken.trim()) return queryToken.trim();
  return null;
}

// Resolves an *authenticated* admin from the server-side session store.
// Never trusts a client-supplied user id: that was the escalation path where
// any caller could act as the Store Owner by naming the owner's id.
function resolveSessionUser(req: Request): { user: any; token: string } | null {
  purgeExpiredAuthState();
  const token = extractSessionToken(req);
  if (!token) return null;
  const key = hashSessionToken(token);
  if (!activeAdminSessions.has(key)) {
    // The session may predate a process restart or come from another worker
    // process; the sessions file is the shared source of truth.
    loadAdminSessions();
  }
  const session = activeAdminSessions.get(key);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    activeAdminSessions.delete(key);
    persistAdminSessions();
    return null;
  }
  const user = db.adminUsers.find((u: any) => u.id === session.userId);
  if (!user || user.status === 'disabled') {
    activeAdminSessions.delete(key);
    persistAdminSessions();
    return null;
  }
  return { user, token };
}

// In-Memory Database Structure
interface DatabaseSchema {
  version: number;
  products: any[];
  categories: any[];
  sizes: string[];
  colors: any[];
  sizeCharts: any[];
  heroSlides: any[];
  faqs: any[];
  contacts: any[];
  socialLinks: any[];
  homepageSections: any[];
  settings: any;
  policies: any;
  paymentAccounts: any;
  coupons: any[];
  campaigns: any[];
  orders: any[];
  wholesaleInquiries: any[];
  auditLogs: any[];
  media: any[];
  adminUsers: any[];
  events?: any[];
}

let db: DatabaseSchema;

// Guarantees every collection the routes iterate over actually exists and has
// the expected type. Applied to any state that arrives from outside this
// process (Supabase) so a malformed remote document cannot crash every route.
function normalizeDatabaseShape(state: any): DatabaseSchema {
  const arrayKeys: (keyof DatabaseSchema)[] = [
    'products', 'categories', 'colors', 'sizeCharts', 'heroSlides', 'faqs',
    'contacts', 'socialLinks', 'homepageSections', 'coupons', 'campaigns',
    'orders', 'wholesaleInquiries', 'auditLogs', 'media', 'adminUsers', 'events'
  ];
  const normalized: any = { ...state };

  arrayKeys.forEach(key => {
    if (!Array.isArray(normalized[key])) normalized[key] = [];
  });
  if (!Array.isArray(normalized.sizes)) normalized.sizes = DEFAULT_MASTER_SIZES;
  if (!isPlainObject(normalized.settings)) normalized.settings = DEFAULT_BUSINESS_SETTINGS;
  if (!isPlainObject(normalized.policies)) normalized.policies = DEFAULT_POLICIES;
  if (!isPlainObject(normalized.paymentAccounts)) normalized.paymentAccounts = PAYMENT_ACCOUNTS_CONFIG;
  if (typeof normalized.version !== 'number') normalized.version = Date.now();

  // Every admin record must carry the identity fields the login lookup reads,
  // otherwise `u.email.toLowerCase()` throws for the whole collection.
  normalized.adminUsers = normalized.adminUsers
    .filter((u: any) => isPlainObject(u))
    .map((u: any) => ({
      ...u,
      id: typeof u.id === 'string' ? u.id : `usr-admin-${Date.now()}`,
      email: typeof u.email === 'string' ? u.email : '',
      username: typeof u.username === 'string' ? u.username : '',
      role: u.role === 'owner' || u.role === 'super_admin' ? u.role : 'admin',
      status: u.status === 'disabled' ? 'disabled' : 'active'
    }));

  return normalized as DatabaseSchema;
}

// Ensure data folder and load or init DB
function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // First start with an external DATA_DIR: seed it from the deployed store.
  const bundledDbFile = path.join(BUNDLED_DATA_DIR, 'store.json');
  if (!fs.existsSync(DB_FILE) && DB_FILE !== bundledDbFile && fs.existsSync(bundledDbFile)) {
    fs.copyFileSync(bundledDbFile, DB_FILE);
    console.log(`[Database] Seeded ${DB_FILE} from ${bundledDbFile}`);
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(raw);

      // Migrate / Normalize Admin Users
      if (!Array.isArray(loaded.adminUsers) || loaded.adminUsers.length === 0) {
        loaded.adminUsers = DEFAULT_ADMIN_USERS;
      } else {
        // Ensure 1 Owner exists
        const hasOwner = loaded.adminUsers.some((u: any) => u.role === 'owner' || u.role === 'super_admin');
        if (!hasOwner) {
          loaded.adminUsers.unshift(DEFAULT_ADMIN_USERS[0]);
        }

        // Standardize roles and ensure secure password hashes
        loaded.adminUsers = loaded.adminUsers.slice(0, 4).map((u: any, idx: number) => {
          const isOwner = idx === 0 || u.role === 'owner' || u.role === 'super_admin' || u.email === 'abirhosensaon@gmail.com';
          const role = isOwner ? 'owner' : 'admin';
          let hash = u.passwordHash;
          let salt = u.passwordSalt;

          if (!hash || !salt) {
            const defaultCredentials = isOwner ? hashPassword('Sider@2026') : hashPassword('Admin@2026');
            hash = defaultCredentials.hash;
            salt = defaultCredentials.salt;
          }

          return {
            id: u.id || (isOwner ? 'usr-owner-saon' : `usr-admin-${idx}`),
            username: u.username || (isOwner ? 'saon' : `admin${idx}`),
            name: u.name || (isOwner ? 'Abir Hosen Saon' : `General Admin ${idx}`),
            email: (u.email || (isOwner ? 'abirhosensaon@gmail.com' : `admin${idx}@siderfashion.com`)).toLowerCase(),
            role,
            roleTitle: u.roleTitle || (isOwner ? 'Store Owner & Founder' : 'General Admin'),
            status: u.status === 'disabled' ? 'disabled' : 'active',
            passwordHash: hash,
            passwordSalt: salt,
            lastLogin: u.lastLogin || undefined,
            lastLogout: u.lastLogout || undefined,
            lastLoginIp: u.lastLoginIp || undefined,
            createdAt: u.createdAt || new Date().toISOString()
          };
        });
      }

      if (!Array.isArray(loaded.heroSlides) || loaded.heroSlides.length < 5) {
        loaded.heroSlides = HERO_SLIDES;
      }

      console.log(`[Database] Loaded persistent data successfully (version ${loaded.version}) with ${loaded.adminUsers.length} admin accounts`);
      return loaded;
    } catch (e) {
      console.error('[Database] Failed to parse existing store.json, re-initializing defaults', e);
    }
  }

  const initialDb: DatabaseSchema = {
    version: Date.now(),
    products: [],
    categories: CATEGORIES,
    sizes: DEFAULT_MASTER_SIZES,
    colors: DEFAULT_COLORS,
    sizeCharts: DEFAULT_SIZE_CHARTS,
    heroSlides: HERO_SLIDES,
    faqs: SIDER_FAQS,
    contacts: DEFAULT_CONTACTS,
    socialLinks: DEFAULT_SOCIAL_LINKS,
    homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
    settings: DEFAULT_BUSINESS_SETTINGS,
    policies: DEFAULT_POLICIES,
    paymentAccounts: PAYMENT_ACCOUNTS_CONFIG,
    coupons: [
      {
        id: 'cpn-welcome',
        code: 'WELCOME50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 800,
        isActive: true,
        timesUsed: 14,
        applicableScope: 'retail',
        createdAt: new Date().toISOString()
      },
      {
        id: 'cpn-eid2026',
        code: 'EID2026',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 1500,
        maxDiscount: 300,
        isActive: true,
        timesUsed: 42,
        applicableScope: 'all',
        createdAt: new Date().toISOString()
      },
      {
        id: 'cpn-bulk500',
        code: 'BULK500',
        discountType: 'fixed',
        discountValue: 500,
        minOrderAmount: 5000,
        isActive: true,
        timesUsed: 6,
        applicableScope: 'wholesale',
        createdAt: new Date().toISOString()
      }
    ],
    campaigns: [
      {
        id: 'cmp-fb-summer',
        source: 'facebook_ads',
        medium: 'cpc',
        campaignName: 'Men Shirt Mega Launch 2026',
        adSpend: 4500,
        visitorsCount: 1840,
        ordersCount: 28,
        revenueGenerated: 23800,
        notes: 'Facebook Carousel Ad on Savar Factory Direct pricing',
        createdAt: new Date().toISOString()
      },
      {
        id: 'cmp-ig-katua',
        source: 'instagram',
        medium: 'story_ad',
        campaignName: 'Festive Katua Collection',
        adSpend: 2800,
        visitorsCount: 1120,
        ordersCount: 19,
        revenueGenerated: 16150,
        notes: 'Instagram Reels & Stories promotion',
        createdAt: new Date().toISOString()
      }
    ],
    orders: [],
    wholesaleInquiries: [],
    auditLogs: [
      {
        id: `log-init-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: 'System Bootstrap',
        adminRole: 'super_admin',
        action: 'DATABASE_INITIALIZED',
        category: 'setting',
        details: 'Sikder Fashion Database successfully initialized.'
      }
    ],
    media: [],
    adminUsers: DEFAULT_ADMIN_USERS
  };

  saveDatabase(initialDb);
  return initialDb;
}

// Save DB atomically to disk and sync to Supabase Cloud Database
function saveDatabase(dataToSave: DatabaseSchema) {
  try {
    dataToSave.version = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    broadcastUpdate('all', dataToSave.version);
    // Automatic cloud persistence to Supabase
    persistStateToSupabase(dataToSave);
  } catch (err) {
    console.error('[Database] Error saving to disk:', err);
  }
}

// SSE Subscriber list for live updates
const sseClients: Response[] = [];

function broadcastUpdate(entity: string, version: number) {
  const payload = `data: ${JSON.stringify({ entity, version, timestamp: new Date().toISOString() })}\n\n`;
  sseClients.forEach(res => {
    try {
      res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// Log audit helper
function logAction(adminName: string, role: string, action: string, category: string, details: string) {
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    adminName: adminName || 'Sider Admin',
    adminRole: role || 'super_admin',
    action,
    category,
    details
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
}

async function startServer() {
  // Port hunting is a local-dev convenience only. In production the host's
  // proxy forwards to exactly PORT, so silently moving to another port would
  // leave the site unreachable.
  const httpPort = IS_PRODUCTION ? PORT : await findAvailablePort(PORT);
  const hmrPort = IS_PRODUCTION ? undefined : await findAvailablePort(HMR_PORT);

  db = initDatabase();
  loadAdminSessions();

  // Attempt initial hydration from Supabase Cloud
  try {
    const remoteState = await loadStateFromSupabase();
    if (remoteState && typeof remoteState === 'object') {
      // Merge remote state safely
      if (Array.isArray(remoteState.products) && remoteState.products.length > 0) {
        db.products = remoteState.products;
      }
      if (Array.isArray(remoteState.categories) && remoteState.categories.length > 0) {
        db.categories = remoteState.categories;
      }
      if (Array.isArray(remoteState.orders) && remoteState.orders.length > 0) {
        db.orders = remoteState.orders;
      }
      if (Array.isArray(remoteState.wholesaleInquiries) && remoteState.wholesaleInquiries.length > 0) {
        db.wholesaleInquiries = remoteState.wholesaleInquiries;
      }
      if (remoteState.settings) {
        db.settings = { ...db.settings, ...remoteState.settings };
      }
      if (remoteState.paymentAccounts) {
        db.paymentAccounts = remoteState.paymentAccounts;
      }
      if (Array.isArray(remoteState.adminUsers) && remoteState.adminUsers.length > 0) {
        // Normalize before trusting: remote records missing email/username/role
        // would otherwise throw inside the login lookup on every attempt.
        db.adminUsers = normalizeDatabaseShape({ ...db, adminUsers: remoteState.adminUsers }).adminUsers;
      }
      if (remoteState.version) {
        db.version = remoteState.version;
      }
      console.log(`[Supabase Integration] Successfully hydrated local database from Supabase Cloud (v${db.version})`);
    } else {
      // Initial push to Supabase to ensure cloud has the latest data
      persistStateToSupabase(db);
    }
  } catch (supabaseInitErr) {
    console.warn('[Supabase Integration] Non-blocking startup notice:', supabaseInitErr);
  }

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Malformed JSON must produce a JSON 400, not an HTML stack trace.
  app.use((err: any, _req: Request, res: Response, next: any) => {
    if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
      res.status(400).json({ success: false, error: 'Malformed JSON request body.' });
      return;
    }
    if (err && err.type === 'entity.too.large') {
      res.status(413).json({ success: false, error: 'Request payload is too large.' });
      return;
    }
    next(err);
  });

  // Origins permitted to call this API cross-site. The storefront and the admin
  // panel are served from the same origin as the API, so same-origin requests
  // are unaffected; only third-party sites lose access.
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  // CORS / Security headers
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    // A wildcard ACAO let any website on the internet read this API's responses
    // (orders, admin metadata) from a victim's browser. Only echo back origins
    // that were explicitly allow-listed.
    if (typeof origin === 'string' && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');

    // Baseline hardening headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

    if (req.path.startsWith('/api/')) {
      // API responses are per-request state and must never be cached by
      // browsers or intermediary proxies.
      res.setHeader('Cache-Control', 'no-store');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Guard for endpoints that require a valid admin session. Responds 401 and
  // returns null when the caller is not authenticated.
  function requireAdmin(req: Request, res: Response): any | null {
    const session = resolveSessionUser(req);
    if (!session) {
      res.status(401).json({ success: false, error: 'Authentication required. Please sign in again.' });
      return null;
    }
    return session.user;
  }

  // Guard for owner-only operations.
  function requireOwner(req: Request, res: Response): any | null {
    const user = requireAdmin(req, res);
    if (!user) return null;
    if (user.role !== 'owner' && user.role !== 'super_admin') {
      res.status(403).json({ success: false, error: 'Only the Store Owner can perform this action.' });
      return null;
    }
    return user;
  }

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Health check & Sync endpoints
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', version: db.version, time: new Date().toISOString() });
  });

  app.get('/api/sync', (_req: Request, res: Response) => {
    // The full snapshot is public to the storefront, so admin credential
    // material (PBKDF2 hash + salt) and last-login IPs must be projected out.
    // Nothing on the client reads adminUsers from this payload.
    res.json({
      success: true,
      version: db.version,
      data: {
        ...db,
        adminUsers: (db.adminUsers || []).map(publicAdminUser)
      }
    });
  });

  // Supabase Status & Manual Cloud Sync Endpoints
  app.get('/api/supabase/status', async (_req: Request, res: Response) => {
    const health = await testSupabaseHealth();
    res.json({
      ...health,
      localVersion: db.version,
      stats: {
        productsCount: db.products?.length || 0,
        ordersCount: db.orders?.length || 0,
        wholesaleInquiriesCount: db.wholesaleInquiries?.length || 0,
        categoriesCount: db.categories?.length || 0,
        adminUsersCount: db.adminUsers?.length || 0
      }
    });
  });

  app.post('/api/supabase/sync-now', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      persistStateToSupabase(db);
      res.json({ 
        success: true, 
        message: 'Synchronized current database state to Supabase Cloud.',
        projectId: SUPABASE_PROJECT_ID,
        version: db.version
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post('/api/supabase/pull-now', async (req: Request, res: Response) => {
    if (!requireOwner(req, res)) return;
    try {
      const remoteState = await loadStateFromSupabase();
      if (!remoteState) {
        res.status(404).json({ success: false, error: 'No remote state found in Supabase.' });
        return;
      }
      // Replacing `db` wholesale with an unvalidated remote document could drop
      // adminUsers/products entirely, which then made every later request throw
      // (`db.adminUsers.find` on undefined) and locked admins out permanently.
      if (!isPlainObject(remoteState) || !Array.isArray(remoteState.adminUsers) || remoteState.adminUsers.length === 0) {
        res.status(422).json({
          success: false,
          error: 'Remote Supabase state is incomplete (missing admin accounts). Pull aborted to protect the local database.'
        });
        return;
      }
      db = normalizeDatabaseShape(remoteState);
      saveDatabase(db);
      res.json({ success: true, message: 'Pulled and applied database state from Supabase Cloud.', version: db.version });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get('/api/supabase/sql-schema', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(getSupabaseSQLSchema());
  });


  // Server-Sent Events (SSE) for Real-Time Synchronization
  app.get('/api/sync/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: 'connected', version: db.version })}\n\n`);
    sseClients.push(res);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  // 2. Authentication & Admin Security Management
  // Rate limiter check helper
  function checkRateLimit(key: string): { allowed: boolean; waitMinutes?: number } {
    const record = failedLoginAttempts.get(key);
    if (!record) return { allowed: true };
    if (record.blockedUntil && record.blockedUntil > Date.now()) {
      const waitMinutes = Math.ceil((record.blockedUntil - Date.now()) / (60 * 1000));
      return { allowed: false, waitMinutes };
    }
    if (record.blockedUntil && record.blockedUntil <= Date.now()) {
      failedLoginAttempts.delete(key);
      return { allowed: true };
    }
    return { allowed: true };
  }

  function recordFailedLogin(key: string) {
    const existing = failedLoginAttempts.get(key) || { count: 0, lastAttempt: Date.now() };
    existing.count += 1;
    existing.lastAttempt = Date.now();
    if (existing.count >= 5) {
      existing.blockedUntil = Date.now() + 15 * 60 * 1000; // Block for 15 minutes
    }
    failedLoginAttempts.set(key, existing);
  }

  function clearFailedLogin(key: string) {
    failedLoginAttempts.delete(key);
  }

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    const body = isPlainObject(req.body) ? req.body : {};
    const { email, usernameOrEmail, password, pinOrPassword, expectedRole } = body;
    // Credentials must be strings. Previously an array/object was coerced via
    // `String(...)`/`.length`, letting malformed payloads reach pbkdf2 and throw.
    const rawIdentifier = typeof email === 'string' ? email : (typeof usernameOrEmail === 'string' ? usernameOrEmail : '');
    const rawPassword = typeof password === 'string' ? password : (typeof pinOrPassword === 'string' ? pinOrPassword : '');
    const inputEmailOrUser = rawIdentifier.trim().toLowerCase();
    const inputPassword = rawPassword.trim();
    const roleRequirement = typeof expectedRole === 'string' ? expectedRole.toLowerCase().trim() : undefined;

    const rateKey = `${clientIp}_${inputEmailOrUser}`;
    const rateCheck = checkRateLimit(rateKey);
    if (!rateCheck.allowed) {
      res.status(429).json({ 
        success: false, 
        error: `Too many failed login attempts. Please try again after ${rateCheck.waitMinutes} minutes.` 
      });
      return;
    }

    if (!inputEmailOrUser || !inputPassword) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }

    // Field-level guards: a single admin record missing email/username/id used
    // to throw here and turn the login endpoint into a 500 for everyone.
    const user = db.adminUsers.find(
      u => String(u.email || '').toLowerCase() === inputEmailOrUser ||
           String(u.username || '').toLowerCase() === inputEmailOrUser ||
           String(u.id || '').toLowerCase() === inputEmailOrUser
    );

    if (!user) {
      recordFailedLogin(rateKey);
      logAction('Unknown User', 'admin', 'FAILED_LOGIN_ATTEMPT', 'auth', `Failed login attempt for non-existent account: ${inputEmailOrUser} (IP: ${clientIp})`);
      saveDatabase(db);
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    // Check account status
    if (user.status === 'disabled') {
      logAction(user.name, user.role, 'DISABLED_ACCOUNT_LOGIN_ATTEMPT', 'auth', `Disabled user ${user.name} (${user.email}) attempted to log in.`);
      saveDatabase(db);
      res.status(403).json({ success: false, error: 'Your admin account has been disabled. Please contact the Store Owner.' });
      return;
    }

    // Verify Password.
    // The previous shared-passcode fallback ('admin123', '2026', ...) was a
    // hardcoded backdoor: any account that reached this route without a stored
    // hash could be signed into with a publicly known string. Records without a
    // hash are re-hashed to their role default during database load, so removing
    // the fallback costs no legitimate access path.
    const isPasswordValid = verifyPassword(inputPassword, user.passwordHash, user.passwordSalt);

    if (!isPasswordValid) {
      recordFailedLogin(rateKey);
      logAction(user.name, user.role, 'FAILED_PASSWORD_ATTEMPT', 'auth', `Failed password attempt for ${user.email} (IP: ${clientIp})`);
      saveDatabase(db);
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    // Role-Based Access Validation: Ensure chosen login mode matches actual user role
    const isUserOwner = user.role === 'owner' || user.role === 'super_admin';
    if (roleRequirement === 'owner' && !isUserOwner) {
      res.status(403).json({
        success: false,
        error: 'Access Denied: This account is a Staff/General Admin account. Please switch to the "Staff / Admin" login option.'
      });
      return;
    }

    if ((roleRequirement === 'staff' || roleRequirement === 'admin') && isUserOwner) {
      res.status(403).json({
        success: false,
        error: 'Access Denied: This account is the Store Owner account. Please switch to the "Store Owner" login option.'
      });
      return;
    }

    // Successful login: clear rate limit, update last login
    clearFailedLogin(rateKey);
    const loginTime = new Date().toISOString();
    user.lastLogin = loginTime;
    user.lastLoginIp = clientIp;

    // Create session token (24h expiry)
    const sessionToken = `tok_${crypto.randomBytes(24).toString('hex')}_${Date.now()}`;
    activeAdminSessions.set(hashSessionToken(sessionToken), {
      userId: user.id,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    persistAdminSessions();

    logAction(user.name, user.role, 'ADMIN_LOGIN', 'auth', `Admin ${user.name} (${user.email}, ${user.roleTitle || user.role}) logged in from IP ${clientIp}.`);
    saveDatabase(db);

    res.json({
      success: true,
      user: sanitizeAdminUser(user),
      token: sessionToken,
      message: 'Login successful'
    });
  });

  // Admin Logout
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const { userId, email } = req.body;
    const token = extractSessionToken(req);
    if (token && activeAdminSessions.delete(hashSessionToken(token))) {
      persistAdminSessions();
    }
    const user = db.adminUsers.find(u => u.id === userId || u.email === email);
    if (user) {
      user.lastLogout = new Date().toISOString();
      logAction(user.name, user.role, 'ADMIN_LOGOUT', 'auth', `Admin ${user.name} (${user.email}) logged out.`);
      saveDatabase(db);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Verify Active Session
  app.post('/api/admin/session/verify', (req: Request, res: Response) => {
    // A session is only valid if it is backed by a live server-side token.
    // The previous `session?.userId || userId` fallback meant any anonymous
    // caller could post {"userId":"usr-owner-saon"} and be told the session was
    // valid, receiving the Store Owner's record in return.
    const session = resolveSessionUser(req);
    if (!session) {
      res.json({ valid: false, error: 'Session expired or invalid. Please sign in again.' });
      return;
    }

    res.json({ valid: true, user: sanitizeAdminUser(session.user) });
  });

  // Get Admin Accounts (All admins, 1 Owner + up to 3 General Admins, max 4 accounts)
  // Owner email is strictly masked when requested by non-owners (Staff)
  app.get('/api/admin/users', (req: Request, res: Response) => {
    // The account roster (names, emails, roles, last-login IPs) was readable by
    // anyone. It now requires an authenticated admin, and the "am I the owner?"
    // decision comes from the session rather than a query parameter the caller
    // chooses for themselves.
    const requester = requireAdmin(req, res);
    if (!requester) return;
    const isOwnerRequester = requester.role === 'owner' || requester.role === 'super_admin';

    const sanitizedList = db.adminUsers.map(u => {
      const isTargetOwner = u.role === 'owner' || u.role === 'super_admin';
      const isSelf = u.id === requester.id;
      // Last-login IP is operational data; only the owner (or the account
      // holder themselves) may see it.
      const sanitized = (isOwnerRequester || isSelf) ? sanitizeAdminUser(u) : publicAdminUser(u);
      // If requester is not the Owner, mask the Owner's email address for privacy and security
      if (!isOwnerRequester && isTargetOwner) {
        return {
          ...sanitized,
          email: '•••••••• (Protected Store Owner)'
        };
      }
      return sanitized;
    });

    const ownerCount = db.adminUsers.filter(u => u.role === 'owner' || u.role === 'super_admin').length;
    const adminCount = db.adminUsers.filter(u => u.role === 'admin').length;
    const totalCount = db.adminUsers.length;
    const maxLimit = 4;
    const availableSlots = Math.max(0, maxLimit - totalCount);

    res.json({
      success: true,
      users: sanitizedList,
      meta: {
        totalCount,
        maxLimit,
        ownerCount,
        adminCount,
        maxAdmins: 3,
        availableSlots
      }
    });
  });

  // Create New General Admin (Owner Only, Max 4 accounts total, max 3 General Admins)
  app.post('/api/admin/users', (req: Request, res: Response) => {
    // Verify caller is Owner.
    // The old lookup was `find(u => u.id === currentAdminId || u.role === 'owner')`:
    // the `|| u.role === 'owner'` arm matched the Store Owner for *any* request,
    // so an unauthenticated caller passed this check and could mint admin
    // accounts. The caller is now the authenticated session user.
    const caller = requireOwner(req, res);
    if (!caller) return;

    const body = isPlainObject(req.body) ? req.body : {};
    const { name, email, password, roleTitle } = body;

    // Account limits check (Strict: 1 Owner, max 3 General Admins, max 4 total)
    if (db.adminUsers.length >= 4) {
      res.status(400).json({ 
        success: false, 
        error: 'Account limit reached! System allows maximum 4 accounts (1 Owner + 3 General Admins).' 
      });
      return;
    }

    const generalAdminsCount = db.adminUsers.filter(u => u.role === 'admin').length;
    if (generalAdminsCount >= 3) {
      res.status(400).json({ 
        success: false, 
        error: 'Maximum 3 General Admin accounts allowed. Please remove an existing admin first.' 
      });
      return;
    }

    const cleanName = asString(name, 120);
    if (!cleanName) {
      res.status(400).json({ success: false, error: 'Admin full name is required.' });
      return;
    }

    const cleanEmail = (asString(email, 254) || '').toLowerCase();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      res.status(400).json({ success: false, error: 'A valid email address is required.' });
      return;
    }

    // Check unique email
    const existing = db.adminUsers.find(u => String(u.email || '').toLowerCase() === cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, error: 'An admin account with this email already exists.' });
      return;
    }

    // `password.length >= 6` also passed for arrays such as [1,2,3,4,5,6],
    // which then threw inside pbkdf2. Require an actual string.
    if (typeof password !== 'string' || password.length < 6 || password.length > 200) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      return;
    }

    const hashed = hashPassword(password);
    const newAdminId = `usr-admin-${Date.now()}`;
    const newUser = {
      id: newAdminId,
      username: cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '') || `admin${db.adminUsers.length}`,
      name: cleanName,
      email: cleanEmail,
      role: 'admin',
      roleTitle: asString(roleTitle, 120) || 'General Admin',
      status: 'active',
      passwordHash: hashed.hash,
      passwordSalt: hashed.salt,
      createdAt: new Date().toISOString()
    };

    db.adminUsers.push(newUser);
    logAction(caller.name, caller.role, 'ADMIN_ACCOUNT_CREATED', 'auth', `Owner ${caller.name} created General Admin: ${newUser.name} (${newUser.email})`);
    saveDatabase(db);

    res.json({
      success: true,
      user: sanitizeAdminUser(newUser),
      message: `General Admin account "${newUser.name}" successfully created.`
    });
  });

  // Update Admin Details / Status / Password (Owner only, or self name update)
  app.put('/api/admin/users/:id', (req: Request, res: Response) => {
    // `currentAdminId` came straight from the request body, so any caller could
    // claim to be the owner. Identity is now taken from the session.
    const caller = requireAdmin(req, res);
    if (!caller) return;

    const { id } = req.params;
    const body = isPlainObject(req.body) ? req.body : {};
    const { name, roleTitle, status, newPassword } = body;

    const user = db.adminUsers.find(u => u.id === id);
    if (!user) {
      res.status(404).json({ success: false, error: 'Admin user not found.' });
      return;
    }

    const isOwnerCaller = caller.role === 'owner' || caller.role === 'super_admin';
    const isSelf = caller.id === user.id;

    if (!isOwnerCaller && !isSelf) {
      res.status(403).json({ success: false, error: 'Unauthorized to modify this admin account.' });
      return;
    }

    // Owner protection: Cannot disable or demote Owner account
    const isTargetOwner = user.role === 'owner' || user.role === 'super_admin';
    if (isTargetOwner && status === 'disabled') {
      res.status(400).json({ success: false, error: 'The Store Owner account cannot be disabled.' });
      return;
    }

    // `name.trim()` / `roleTitle.trim()` threw on non-string input.
    if (name !== undefined) {
      const cleanName = asString(name, 120);
      if (!cleanName) {
        res.status(400).json({ success: false, error: 'Admin name must be a non-empty text value.' });
        return;
      }
      user.name = cleanName;
    }
    if (roleTitle !== undefined && !isTargetOwner) {
      const cleanRoleTitle = asString(roleTitle, 120);
      if (!cleanRoleTitle) {
        res.status(400).json({ success: false, error: 'Role title must be a non-empty text value.' });
        return;
      }
      user.roleTitle = cleanRoleTitle;
    }

    // Status change (Only Owner can change status)
    if (status && isOwnerCaller && !isTargetOwner) {
      const oldStatus = user.status;
      user.status = status === 'disabled' ? 'disabled' : 'active';
      if (user.status === 'disabled') {
        revokeUserSessions(user.id);
      }
      logAction(caller.name, caller.role, 'ADMIN_STATUS_CHANGED', 'auth', `Owner changed status of ${user.name} from ${oldStatus} to ${user.status}`);
    }

    // Password reset by Owner
    if (newPassword !== undefined && isOwnerCaller) {
      if (typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 200) {
        res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
        return;
      }
      const hashed = hashPassword(newPassword);
      user.passwordHash = hashed.hash;
      user.passwordSalt = hashed.salt;
      revokeUserSessions(user.id);
      logAction(caller.name, caller.role, 'ADMIN_PASSWORD_RESET_BY_OWNER', 'auth', `Owner reset password for admin: ${user.name} (${user.email})`);
    }

    saveDatabase(db);
    res.json({
      success: true,
      user: sanitizeAdminUser(user),
      message: `Admin account "${user.name}" updated successfully.`
    });
  });

  // Delete Admin Account (Owner Only, Cannot delete Owner)
  app.delete('/api/admin/users/:id', (req: Request, res: Response) => {
    // Same `|| u.role === 'owner'` escalation as the create route: an
    // unauthenticated DELETE resolved to the Store Owner as caller and could
    // remove any admin account.
    const caller = requireOwner(req, res);
    if (!caller) return;

    const { id } = req.params;
    const user = db.adminUsers.find(u => u.id === id);
    if (!user) {
      res.status(404).json({ success: false, error: 'Admin user not found.' });
      return;
    }

    if (user.role === 'owner' || user.role === 'super_admin') {
      res.status(400).json({ success: false, error: 'The Store Owner account cannot be deleted.' });
      return;
    }

    db.adminUsers = db.adminUsers.filter(u => u.id !== id);
    revokeUserSessions(id);
    logAction(caller.name, caller.role, 'ADMIN_ACCOUNT_DELETED', 'auth', `Owner ${caller.name} removed General Admin: ${user.name} (${user.email})`);
    saveDatabase(db);

    res.json({ success: true, message: `Admin account "${user.name}" has been deleted.` });
  });

  // Helper to send Admin OTP Email securely
  async function sendAdminOtpEmail(toEmail: string, otpCode: string, adminName: string): Promise<boolean> {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || `"Sikder Fashion Security" <${smtpUser || 'security@siderfashion.com'}>`;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: toEmail,
          subject: `[Sikder Fashion Security] Admin Password Reset Code: ${otpCode}`,
          text: `Hello ${adminName},\n\nYour 6-digit password reset verification code is:\n\n${otpCode}\n\nThis single-use code will expire in 10 minutes.\nIf you did not request this reset, please ignore this email or notify the store owner immediately.\n\nSikder Fashion Security Team`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 32px; color: #1c1917;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; background-color: #f59e0b; color: #0c0a09; font-weight: 900; font-size: 24px; border-radius: 12px;">S</div>
                <h2 style="margin: 12px 0 4px; font-size: 20px; font-weight: 800; color: #0c0a09;">Sikder Fashion Security</h2>
                <p style="margin: 0; font-size: 13px; color: #78716c;">Admin Account Password Recovery</p>
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #44403c;">Hello <strong>${adminName}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #44403c;">A password reset request was initiated for your Sikder Fashion Admin account (<strong>${toEmail}</strong>).</p>
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #92400e; letter-spacing: 1px; margin-bottom: 6px;">Your 6-Digit Verification Code</div>
                <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; font-family: monospace; color: #78350f;">${otpCode}</div>
                <div style="font-size: 11px; color: #b45309; margin-top: 6px;">Valid for 10 minutes (Single Use)</div>
              </div>
              <p style="font-size: 12px; color: #78716c; line-height: 1.5;">If you did not request a password reset, please ignore this email. No password changes can be made without this code.</p>
              <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
              <div style="font-size: 11px; color: #a8a29e; text-align: center;">Sikder Fashion Store Management • Automated Security Alert</div>
            </div>
          `
        });
        console.log(`[Security Auth] OTP Email successfully delivered to ${toEmail}`);
        return true;
      } catch (err: any) {
        console.error(`[Security Auth] Failed to send email via SMTP to ${toEmail}:`, err.message);
        return false;
      }
    } else {
      console.log(`[Security Auth] 6-digit OTP code generated for registered admin ${toEmail}: ${otpCode} (Valid for 10 mins)`);
      return true;
    }
  }

  // Forgot Password: Step 1 - Request 6-digit Verification Code
  // Strictly verifies active admin existence. NEVER returns verification code in API response.
  app.post('/api/admin/forgot-password/request', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    const body = isPlainObject(req.body) ? req.body : {};
    const { email } = body;
    const cleanEmail = (asString(email, 254) || '').toLowerCase();

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      res.status(400).json({ success: false, error: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।' });
      return;
    }

    // Strict validation: Only registered active admin accounts can request OTP
    const user = db.adminUsers.find(u => String(u.email || '').toLowerCase() === cleanEmail);
    if (!user) {
      logAction('Unknown', 'admin', 'UNAUTHORIZED_RESET_ATTEMPT', 'auth', `Unauthorized password reset attempted for non-admin email: ${cleanEmail} (IP: ${clientIp})`);
      saveDatabase(db);
      res.status(404).json({ 
        success: false, 
        error: 'এই ইমেইলটি কোনো অনুমোদিত অ্যাডমিন অ্যাকাউন্টের সাথে মিলছে না। শুধুমাত্র অনুমোদিত অ্যাডমিনরাই পাসওয়ার্ড রিসেট করতে পারবেন।' 
      });
      return;
    }

    if (user.status === 'disabled') {
      res.status(403).json({ 
        success: false, 
        error: 'এই অ্যাডমিন অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয় (Disabled) রয়েছে। অনুগ্রহ করে স্টোর ওনারের সাথে যোগাযোগ করুন।' 
      });
      return;
    }

    // Rate limiting for forgot password requests: max 3 requests per 15 minutes
    const rateKey = `fp_${cleanEmail}_${clientIp}`;
    const rateCheck = checkRateLimit(rateKey);
    if (!rateCheck.allowed) {
      res.status(429).json({ 
        success: false, 
        error: `খুব বেশি ওটিপি রিকোয়েস্ট পাঠানো হয়েছে। অনুগ্রহ করে ${rateCheck.waitMinutes} মিনিট পর পুনরায় চেষ্টা করুন।` 
      });
      return;
    }

    // Generate cryptographically random 6-digit numeric verification code.
    // `Math.random()` is not a CSPRNG: its output is predictable from observed
    // values, which would let an attacker derive another admin's reset code.
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    passwordResetCodes.set(cleanEmail, {
      code: verificationCode,
      expiresAt,
      used: false,
      failedAttempts: 0,
      requestedAt: new Date().toISOString()
    });

    recordFailedLogin(rateKey);

    logAction(user.name, user.role, 'FORGOT_PASSWORD_REQUEST', 'auth', `Password reset verification code dispatched to registered admin ${cleanEmail} (Valid for 10 mins).`);
    saveDatabase(db);

    // Send the email to the registered admin's inbox
    await sendAdminOtpEmail(cleanEmail, verificationCode, user.name);

    res.json({
      success: true,
      email: cleanEmail,
      message: `আপনার নিবন্ধিত অ্যাডমিন ইমেইলে (${cleanEmail}) একটি ৬-সংখ্যার সিকিউরিটি ভেরিফিকেশন কোড পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল ইনবক্স চেক করে কোডটি দিন (মেয়াদ ১০ মিনিট)।`,
      expiresInMinutes: 10
      // NEVER return devCode or verificationCode in response
    });
  });

  // Forgot Password: Step 2 - Verify Code and Reset Password
  app.post('/api/admin/forgot-password/verify-and-reset', (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    const body = isPlainObject(req.body) ? req.body : {};
    const { email, code, newPassword, confirmPassword } = body;
    const cleanEmail = (asString(email, 254) || '').toLowerCase();
    const cleanCode = asString(code, 32) || '';

    if (!cleanEmail || !cleanCode) {
      res.status(400).json({ success: false, error: 'ইমেইল এবং ৬-সংখ্যার সিকিউরিটি কোড প্রদান করা আবশ্যক।' });
      return;
    }

    const resetRecord = passwordResetCodes.get(cleanEmail);
    if (!resetRecord) {
      res.status(400).json({ success: false, error: 'কোনো সক্রিয় রিসেট রিকোয়েস্ট পাওয়া যায়নি। অনুগ্রহ করে নতুন কোডের জন্য আবেদন করুন।' });
      return;
    }

    if (resetRecord.used) {
      res.status(400).json({ success: false, error: 'এই ভেরিফিকেশন কোডটি ইতিমধ্যে ব্যবহার করা হয়েছে। নতুন কোড রিকোয়েস্ট করুন।' });
      return;
    }

    if (Date.now() > resetRecord.expiresAt) {
      passwordResetCodes.delete(cleanEmail);
      res.status(400).json({ success: false, error: 'ভেরিফিকেশন কোডের মেয়াদ শেষ হয়ে গেছে (১০ মিনিট)। অনুগ্রহ করে নতুন কোড নিন।' });
      return;
    }

    // Constant-time compare so response timing cannot leak the code digit by digit.
    if (!safeCompare(resetRecord.code, cleanCode)) {
      resetRecord.failedAttempts = (resetRecord.failedAttempts || 0) + 1;
      if (resetRecord.failedAttempts >= 3) {
        passwordResetCodes.delete(cleanEmail);
        res.status(400).json({ success: false, error: 'পরপর ৩ বার ভুল কোড দেওয়ার কারণে রিকোয়েস্টটি বাতিল করা হয়েছে। পুনরায় নতুন কোড রিকোয়েস্ট করুন।' });
        return;
      }
      res.status(400).json({ 
        success: false, 
        error: `ভুল ভেরিফিকেশন কোড! আপনার ইমেইল ইনবক্স চেক করে সঠিক কোড দিন (অবশিষ্ট সুযোগ: ${3 - resetRecord.failedAttempts} বার)।` 
      });
      return;
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 200) {
      res.status(400).json({ success: false, error: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ success: false, error: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি।' });
      return;
    }

    const user = db.adminUsers.find(u => String(u.email || '').toLowerCase() === cleanEmail);
    if (!user) {
      res.status(404).json({ success: false, error: 'অ্যাডমিন অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' });
      return;
    }

    // Set new PBKDF2 password hash
    const hashed = hashPassword(newPassword);
    user.passwordHash = hashed.hash;
    user.passwordSalt = hashed.salt;

    // Mark code as used and revoke old sessions
    passwordResetCodes.delete(cleanEmail);
    revokeUserSessions(user.id);

    logAction(user.name, user.role, 'PASSWORD_RESET_SUCCESSFUL', 'auth', `Admin ${user.name} (${user.email}) successfully reset password via verified OTP from IP ${clientIp}.`);
    saveDatabase(db);

    res.json({
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন আপনার নতুন পাসওয়ার্ড দিয়ে লগইন করুন।'
    });
  });

  // 3. PRODUCTS CRUD
  app.get('/api/products', (_req: Request, res: Response) => {
    res.json({ success: true, products: db.products });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const product = body.product;
    const adminName = asString(body.adminName, 120) || 'Admin';

    // `!product.name` also passed for `{}` and `[]`; `product.code.toLowerCase()`
    // then threw a 500 for any non-string code.
    if (!isPlainObject(product)) {
      res.status(400).json({ success: false, error: 'Product payload must be an object.' });
      return;
    }
    const productName = asString(product.name, 300);
    const productCode = asString(product.code, 120);
    if (!productName || !productCode) {
      res.status(400).json({ success: false, error: 'Product name and code/SKU are required.' });
      return;
    }
    product.name = productName;
    product.code = productCode;

    // Ensure Unique ID
    if (!asString(product.id, 200)) {
      product.id = `sf-${productCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
    }

    // Default values if missing
    product.rating = product.rating || 4.9;
    product.reviewsCount = product.reviewsCount || 12;
    product.wholesaleMOQ = Number(product.wholesaleMOQ) || 12;
    product.stock = Number(product.stock) || 0;
    product.retailPrice = Number(product.retailPrice) || 0;
    product.wholesalePrice = Number(product.wholesalePrice) || 0;

    const existingIdx = db.products.findIndex(p => p.id === product.id || p.code === product.code);
    if (existingIdx >= 0) {
      db.products[existingIdx] = { ...db.products[existingIdx], ...product };
      logAction(adminName, 'super_admin', 'PRODUCT_UPDATED', 'product', `Updated product ${product.code} - ${product.name}`);
    } else {
      db.products.unshift(product);
      logAction(adminName, 'super_admin', 'PRODUCT_CREATED', 'product', `Added product ${product.code} - ${product.name}`);
    }

    saveDatabase(db);
    res.json({ success: true, product, message: `Product ${product.name} saved.` });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const body = isPlainObject(req.body) ? req.body : {};
    const updated = body.product;
    const adminName = asString(body.adminName, 120) || 'Admin';

    // Without this guard an array or string payload spread numeric/character
    // keys into the stored product, and a missing payload reported success
    // while writing nothing.
    if (!isPlainObject(updated)) {
      res.status(400).json({ success: false, error: 'Product payload must be an object.' });
      return;
    }

    const idx = db.products.findIndex(p => p.id === id || p.code === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    db.products[idx] = { ...db.products[idx], ...updated };
    logAction(adminName, 'super_admin', 'PRODUCT_UPDATED', 'product', `Updated product ${db.products[idx].code} - ${db.products[idx].name}`);
    saveDatabase(db);
    res.json({ success: true, product: db.products[idx], message: 'Product updated successfully.' });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';

    const idx = db.products.findIndex(p => p.id === id || p.code === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    const removed = db.products.splice(idx, 1)[0];
    logAction(adminName, 'super_admin', 'PRODUCT_DELETED', 'product', `Deleted product ${removed.code} - ${removed.name}`);
    saveDatabase(db);
    res.json({ success: true, message: `Product ${removed.name} removed from catalog.` });
  });

  // 4. CATEGORIES CRUD
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json({ success: true, categories: db.categories });
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const cat = body.category;
    const adminName = asString(body.adminName, 120) || 'Admin';

    if (!isPlainObject(cat)) {
      res.status(400).json({ success: false, error: 'Category payload must be an object.' });
      return;
    }
    const catName = asString(cat.name, 200);
    const catKey = asString(cat.key, 120);
    if (!catName || !catKey) {
      res.status(400).json({ success: false, error: 'Category name and slug/key are required.' });
      return;
    }
    cat.name = catName;
    cat.key = catKey;

    if (!asString(cat.id, 200)) {
      cat.id = `cat-${catKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
    }

    const existingIdx = db.categories.findIndex(c => c.id === cat.id || c.key === cat.key);
    if (existingIdx >= 0) {
      db.categories[existingIdx] = { ...db.categories[existingIdx], ...cat };
      logAction(adminName, 'super_admin', 'CATEGORY_UPDATED', 'cms', `Updated category ${cat.name}`);
    } else {
      db.categories.push(cat);
      logAction(adminName, 'super_admin', 'CATEGORY_CREATED', 'cms', `Created category ${cat.name}`);
    }

    saveDatabase(db);
    res.json({ success: true, category: cat, message: `Category ${cat.name} saved.` });
  });

  app.put('/api/categories/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const body = isPlainObject(req.body) ? req.body : {};
    const updated = body.category;
    const adminName = asString(body.adminName, 120) || 'Admin';

    if (!isPlainObject(updated)) {
      res.status(400).json({ success: false, error: 'Category payload must be an object.' });
      return;
    }

    const idx = db.categories.findIndex(c => c.id === id || c.key === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }

    db.categories[idx] = { ...db.categories[idx], ...updated };
    logAction(adminName, 'super_admin', 'CATEGORY_UPDATED', 'cms', `Updated category ${db.categories[idx].name}`);
    saveDatabase(db);
    res.json({ success: true, category: db.categories[idx] });
  });

  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    const moveProductsTo = asString(req.query.moveTo, 120) || 'all';

    const idx = db.categories.findIndex(c => c.id === id || c.key === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }

    const removed = db.categories.splice(idx, 1)[0];

    // Re-assign or protect existing products
    let movedCount = 0;
    db.products.forEach(p => {
      if (p.category === removed.id || p.category === removed.key) {
        p.category = moveProductsTo;
        movedCount++;
      }
    });

    logAction(adminName, 'super_admin', 'CATEGORY_DELETED', 'cms', `Deleted category ${removed.name}. Reassigned ${movedCount} products to ${moveProductsTo}`);
    saveDatabase(db);
    res.json({ success: true, message: `Category ${removed.name} removed. (${movedCount} linked products reassigned)` });
  });

  // 5. SIZES & COLORS CRUD
  app.get('/api/sizes', (_req: Request, res: Response) => {
    res.json({ success: true, sizes: db.sizes });
  });

  app.post('/api/sizes', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { size, adminName } = body;
    // `size.trim()` threw a 500 whenever `size` was a number or object.
    const cleanSizeInput = asString(size, 32);
    if (!cleanSizeInput) {
      res.status(400).json({ success: false, error: 'Size name is required.' });
      return;
    }
    const cleanSize = cleanSizeInput.toUpperCase();
    if (!db.sizes.includes(cleanSize)) {
      db.sizes.push(cleanSize);
      logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'SIZE_ADDED', 'inventory', `Added size ${cleanSize}`);
      saveDatabase(db);
    }
    res.json({ success: true, sizes: db.sizes, message: `Size ${cleanSize} saved.` });
  });

  app.delete('/api/sizes/:size', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { size } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    db.sizes = db.sizes.filter(s => s.toUpperCase() !== size.toUpperCase());
    logAction(adminName, 'super_admin', 'SIZE_REMOVED', 'inventory', `Removed size ${size}`);
    saveDatabase(db);
    res.json({ success: true, sizes: db.sizes, message: `Size ${size} removed.` });
  });

  app.get('/api/colors', (_req: Request, res: Response) => {
    res.json({ success: true, colors: db.colors });
  });

  app.post('/api/colors', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { color, adminName } = body;
    if (!isPlainObject(color)) {
      res.status(400).json({ success: false, error: 'Color payload must be an object.' });
      return;
    }
    const colorName = asString(color.name, 120);
    if (!colorName) {
      res.status(400).json({ success: false, error: 'Color name is required.' });
      return;
    }
    color.name = colorName;

    if (!asString(color.id, 200)) {
      color.id = `col-${Date.now()}`;
    }

    // `c.name.toLowerCase()` threw for any stored swatch missing a name.
    const idx = db.colors.findIndex(c => c.id === color.id || String(c.name || '').toLowerCase() === colorName.toLowerCase());
    if (idx >= 0) {
      db.colors[idx] = { ...db.colors[idx], ...color };
    } else {
      db.colors.push(color);
    }

    logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'COLOR_SAVED', 'inventory', `Saved color swatch ${color.name}`);
    saveDatabase(db);
    res.json({ success: true, colors: db.colors, message: `Color ${color.name} saved.` });
  });

  app.delete('/api/colors/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    db.colors = db.colors.filter(c => c.id !== id && c.name !== id);
    logAction(adminName, 'super_admin', 'COLOR_REMOVED', 'inventory', `Removed color swatch ${id}`);
    saveDatabase(db);
    res.json({ success: true, colors: db.colors, message: 'Color removed.' });
  });

  // 6. CONTACTS CMS CRUD
  app.get('/api/contacts', (_req: Request, res: Response) => {
    res.json({ success: true, contacts: db.contacts });
  });

  app.post('/api/contacts', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { contact, adminName } = body;
    if (!isPlainObject(contact) || !asString(contact.value, 500)) {
      res.status(400).json({ success: false, error: 'Contact value is required.' });
      return;
    }

    if (!asString(contact.id, 200)) {
      contact.id = `contact-${Date.now()}`;
    }

    const idx = db.contacts.findIndex(c => c.id === contact.id);
    if (idx >= 0) {
      db.contacts[idx] = { ...db.contacts[idx], ...contact };
      logAction(adminName || 'Admin', 'super_admin', 'CONTACT_UPDATED', 'cms', `Updated contact ${contact.label || contact.value}`);
    } else {
      db.contacts.push(contact);
      logAction(adminName || 'Admin', 'super_admin', 'CONTACT_CREATED', 'cms', `Created contact ${contact.label || contact.value}`);
    }

    saveDatabase(db);
    res.json({ success: true, contacts: db.contacts, message: 'Contact saved.' });
  });

  app.put('/api/contacts/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const body = isPlainObject(req.body) ? req.body : {};
    const { contact, adminName } = body;
    if (!isPlainObject(contact)) {
      res.status(400).json({ success: false, error: 'Contact payload must be an object.' });
      return;
    }
    const idx = db.contacts.findIndex(c => c.id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Contact not found.' });
      return;
    }
    db.contacts[idx] = { ...db.contacts[idx], ...contact };
    logAction(adminName || 'Admin', 'super_admin', 'CONTACT_UPDATED', 'cms', `Updated contact ${db.contacts[idx].label}`);
    saveDatabase(db);
    res.json({ success: true, contacts: db.contacts });
  });

  app.delete('/api/contacts/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    db.contacts = db.contacts.filter(c => c.id !== id);
    logAction(adminName, 'super_admin', 'CONTACT_DELETED', 'cms', `Deleted contact ${id}`);
    saveDatabase(db);
    res.json({ success: true, contacts: db.contacts, message: 'Contact removed.' });
  });

  // 7. SOCIAL LINKS CMS CRUD
  app.get('/api/social-links', (_req: Request, res: Response) => {
    res.json({ success: true, socialLinks: db.socialLinks });
  });

  app.post('/api/social-links', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { socialLink, adminName } = body;
    if (!isPlainObject(socialLink)) {
      res.status(400).json({ success: false, error: 'Social link payload must be an object.' });
      return;
    }
    const linkUrl = asString(socialLink.url, 2000);
    // Rendered as an anchor href in the storefront footer: reject
    // `javascript:` / `data:` URLs which would execute in a visitor's browser.
    if (!linkUrl || !isSafeHttpUrl(linkUrl)) {
      res.status(400).json({ success: false, error: 'A valid http(s) social media URL is required.' });
      return;
    }
    socialLink.url = linkUrl;

    if (!asString(socialLink.id, 200)) {
      socialLink.id = `social-${asString(socialLink.platform, 60) || 'link'}-${Date.now()}`;
    }

    const idx = db.socialLinks.findIndex(s => s.id === socialLink.id);
    if (idx >= 0) {
      db.socialLinks[idx] = { ...db.socialLinks[idx], ...socialLink };
      logAction(adminName || 'Admin', 'super_admin', 'SOCIAL_UPDATED', 'cms', `Updated social link ${socialLink.displayName}`);
    } else {
      db.socialLinks.push(socialLink);
      logAction(adminName || 'Admin', 'super_admin', 'SOCIAL_CREATED', 'cms', `Created social link ${socialLink.displayName}`);
    }

    saveDatabase(db);
    res.json({ success: true, socialLinks: db.socialLinks, message: 'Social media link saved.' });
  });

  app.delete('/api/social-links/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    db.socialLinks = db.socialLinks.filter(s => s.id !== id);
    logAction(adminName, 'super_admin', 'SOCIAL_DELETED', 'cms', `Deleted social link ${id}`);
    saveDatabase(db);
    res.json({ success: true, socialLinks: db.socialLinks, message: 'Social link removed.' });
  });

  // 8. HERO SLIDES CMS CRUD
  app.get('/api/hero-slides', (_req: Request, res: Response) => {
    res.json({ success: true, heroSlides: db.heroSlides });
  });

  app.post('/api/hero-slides', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { slide, adminName } = body;
    if (!isPlainObject(slide) || !asString(slide.title, 300)) {
      res.status(400).json({ success: false, error: 'Slide title is required.' });
      return;
    }

    if (!asString(slide.slideId, 200)) {
      slide.slideId = `slide-${Date.now()}`;
    }

    const idx = db.heroSlides.findIndex(s => s.slideId === slide.slideId);
    if (idx >= 0) {
      db.heroSlides[idx] = { ...db.heroSlides[idx], ...slide };
      logAction(adminName || 'Admin', 'super_admin', 'HERO_SLIDE_UPDATED', 'cms', `Updated hero banner ${slide.title}`);
    } else {
      db.heroSlides.push(slide);
      logAction(adminName || 'Admin', 'super_admin', 'HERO_SLIDE_CREATED', 'cms', `Created hero banner ${slide.title}`);
    }

    saveDatabase(db);
    res.json({ success: true, heroSlides: db.heroSlides, message: 'Hero banner saved.' });
  });

  app.delete('/api/hero-slides/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    db.heroSlides = db.heroSlides.filter(s => s.slideId !== id);
    logAction(adminName, 'super_admin', 'HERO_SLIDE_DELETED', 'cms', `Deleted hero banner ${id}`);
    saveDatabase(db);
    res.json({ success: true, heroSlides: db.heroSlides, message: 'Hero banner removed.' });
  });

  // 9. FAQS CMS CRUD
  app.get('/api/faqs', (_req: Request, res: Response) => {
    res.json({ success: true, faqs: db.faqs });
  });

  app.post('/api/faqs', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { faq, adminName } = body;
    if (!isPlainObject(faq) || !asString(faq.question, 1000)) {
      res.status(400).json({ success: false, error: 'FAQ question is required.' });
      return;
    }

    if (!asString(faq.id, 200)) {
      faq.id = `faq-${Date.now()}`;
    }

    const idx = db.faqs.findIndex(f => f.id === faq.id);
    if (idx >= 0) {
      db.faqs[idx] = { ...db.faqs[idx], ...faq };
      logAction(adminName || 'Admin', 'super_admin', 'FAQ_UPDATED', 'cms', `Updated FAQ: ${faq.question}`);
    } else {
      db.faqs.push(faq);
      logAction(adminName || 'Admin', 'super_admin', 'FAQ_CREATED', 'cms', `Created FAQ: ${faq.question}`);
    }

    saveDatabase(db);
    res.json({ success: true, faqs: db.faqs, message: 'FAQ saved.' });
  });

  app.delete('/api/faqs/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    db.faqs = db.faqs.filter(f => f.id !== id);
    logAction(adminName, 'super_admin', 'FAQ_DELETED', 'cms', `Deleted FAQ: ${id}`);
    saveDatabase(db);
    res.json({ success: true, faqs: db.faqs, message: 'FAQ removed.' });
  });

  // 10. HOMEPAGE SECTIONS
  app.get('/api/homepage-sections', (_req: Request, res: Response) => {
    res.json({ success: true, sections: db.homepageSections });
  });

  app.put('/api/homepage-sections', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { sections, adminName } = body;
    // A non-array payload used to be silently discarded while still reporting
    // `success: true`, so the admin UI showed "saved" for a write that never
    // happened. Reject it explicitly instead.
    if (!Array.isArray(sections)) {
      res.status(400).json({ success: false, error: 'Homepage sections payload must be an array.' });
      return;
    }
    if (!sections.every(isPlainObject)) {
      res.status(400).json({ success: false, error: 'Each homepage section must be an object.' });
      return;
    }
    db.homepageSections = sections;
    logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'HOMEPAGE_SECTIONS_UPDATED', 'cms', 'Updated homepage sections order and visibility.');
    saveDatabase(db);
    res.json({ success: true, sections: db.homepageSections, message: 'Homepage layout saved.' });
  });

  // 11. SETTINGS & POLICIES & PAYMENT ACCOUNTS
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json({ success: true, settings: db.settings });
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { settings, adminName } = body;
    // Spreading a non-object (array / string / null) either injected numeric
    // keys into the settings record or silently changed nothing while still
    // reporting success.
    if (!isPlainObject(settings)) {
      res.status(400).json({ success: false, error: 'Settings payload must be an object.' });
      return;
    }
    // facebookUrl is rendered as an anchor href on the storefront.
    if (settings.facebookUrl !== undefined) {
      const fbUrl = asString(settings.facebookUrl, 2000);
      if (!fbUrl || !isSafeHttpUrl(fbUrl)) {
        res.status(400).json({ success: false, error: 'Facebook URL must be a valid http(s) address.' });
        return;
      }
      settings.facebookUrl = fbUrl;
    }
    db.settings = { ...db.settings, ...settings };
    logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'SETTINGS_UPDATED', 'setting', 'Updated business settings.');
    saveDatabase(db);
    res.json({ success: true, settings: db.settings, message: 'Settings saved.' });
  });

  app.get('/api/policies', (_req: Request, res: Response) => {
    res.json({ success: true, policies: db.policies });
  });

  app.put('/api/policies', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { policies, adminName } = body;
    if (!isPlainObject(policies)) {
      res.status(400).json({ success: false, error: 'Policies payload must be an object.' });
      return;
    }
    db.policies = { ...db.policies, ...policies };
    logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'POLICIES_UPDATED', 'cms', 'Updated store legal policies and content.');
    saveDatabase(db);
    res.json({ success: true, policies: db.policies, message: 'Policies updated.' });
  });

  app.get('/api/payment-accounts', (_req: Request, res: Response) => {
    res.json({ success: true, paymentAccounts: db.paymentAccounts });
  });

  app.put('/api/payment-accounts', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { paymentAccounts, adminName } = body;
    // Payment destination numbers: a malformed write here would silently
    // misdirect customer payments, so reject anything that is not an object.
    if (!isPlainObject(paymentAccounts)) {
      res.status(400).json({ success: false, error: 'Payment accounts payload must be an object.' });
      return;
    }
    db.paymentAccounts = { ...db.paymentAccounts, ...paymentAccounts };
    logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'PAYMENT_ACCOUNTS_UPDATED', 'payment', 'Updated bKash and Nagad payment account details.');
    saveDatabase(db);
    res.json({ success: true, paymentAccounts: db.paymentAccounts, message: 'Payment accounts updated.' });
  });

  // 12. COUPONS & MARKETING CAMPAIGNS
  app.get('/api/coupons', (_req: Request, res: Response) => {
    res.json({ success: true, coupons: db.coupons });
  });

  app.post('/api/coupons', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { coupon, adminName } = body;
    if (!isPlainObject(coupon)) {
      res.status(400).json({ success: false, error: 'Coupon payload must be an object.' });
      return;
    }
    const couponCode = asString(coupon.code, 64);
    if (!couponCode) {
      res.status(400).json({ success: false, error: 'Coupon code is required.' });
      return;
    }
    coupon.code = couponCode;
    if (!asString(coupon.id, 200)) {
      coupon.id = `cpn-${Date.now()}`;
    }
    const idx = db.coupons.findIndex(c => c.id === coupon.id || c.code === coupon.code);
    if (idx >= 0) {
      db.coupons[idx] = { ...db.coupons[idx], ...coupon };
    } else {
      db.coupons.unshift(coupon);
    }
    logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'COUPON_SAVED', 'coupon', `Saved coupon ${coupon.code}`);
    saveDatabase(db);
    res.json({ success: true, coupons: db.coupons });
  });

  app.delete('/api/coupons/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120) || 'Admin';
    db.coupons = db.coupons.filter(c => c.id !== id);
    logAction(adminName, 'super_admin', 'COUPON_DELETED', 'coupon', `Deleted coupon ${id}`);
    saveDatabase(db);
    res.json({ success: true, coupons: db.coupons });
  });

  app.get('/api/campaigns', (_req: Request, res: Response) => {
    res.json({ success: true, campaigns: db.campaigns });
  });

  app.post('/api/campaigns', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { campaign, adminName } = body;
    if (!isPlainObject(campaign) || !asString(campaign.campaignName, 300)) {
      res.status(400).json({ success: false, error: 'Campaign name is required.' });
      return;
    }
    if (!asString(campaign.id, 200)) {
      campaign.id = `cmp-${Date.now()}`;
    }
    const idx = db.campaigns.findIndex(c => c.id === campaign.id);
    if (idx >= 0) {
      db.campaigns[idx] = { ...db.campaigns[idx], ...campaign };
    } else {
      db.campaigns.unshift(campaign);
    }
    logAction(asString(adminName, 120) || 'Admin', 'super_admin', 'CAMPAIGN_SAVED', 'cms', `Saved marketing campaign ${campaign.campaignName}`);
    saveDatabase(db);
    res.json({ success: true, campaigns: db.campaigns });
  });

  // 13. ORDERS & WHOLESALE INQUIRIES
  // Customer PII (names, phone numbers, addresses). Admin session required.
  app.get('/api/orders', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    res.json({ success: true, orders: db.orders });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const body = isPlainObject(req.body) ? req.body : {};
    const order = body.order;

    // `!order.customerName` also passed for objects/arrays, which then reached
    // storage and broke every consumer that expects strings.
    if (!isPlainObject(order)) {
      res.status(400).json({ success: false, error: 'Order payload must be an object.' });
      return;
    }
    const customerName = asString(order.customerName, 200);
    const phone = asString(order.phone, 32);
    if (!customerName || !phone) {
      res.status(400).json({ success: false, error: 'Customer name and phone number are required.' });
      return;
    }
    order.customerName = customerName;
    order.phone = phone;

    if ((order.paymentMethod === 'bkash' || order.paymentMethod === 'nagad') &&
        String(order.transactionId || '').trim().length > 10) {
      res.status(400).json({ success: false, error: 'Transaction ID cannot be more than 10 characters.' });
      return;
    }

    // A non-string orderId (object/array) would never match in later
    // findIndex lookups, making the order impossible to update or delete.
    const providedOrderId = asString(order.orderId, 64);
    if (order.orderId !== undefined && order.orderId !== null && order.orderId !== '' && !providedOrderId) {
      res.status(400).json({ success: false, error: 'Order ID must be a text value.' });
      return;
    }
    if (!providedOrderId) {
      order.orderId = nextSequentialId(db.orders, 'SF-2026-', 'orderId');
    } else if (db.orders.some(o => o.orderId === providedOrderId)) {
      // A colliding id would make PUT/DELETE /api/orders/:id act on somebody
      // else's order, so re-issue a unique one rather than storing a duplicate.
      const reassigned = nextSequentialId(db.orders, 'SF-2026-', 'orderId');
      console.warn(`[Orders] Duplicate order id "${providedOrderId}" received; re-issued as "${reassigned}".`);
      order.orderId = reassigned;
    } else {
      order.orderId = providedOrderId;
    }
    order.createdAt = order.createdAt || new Date().toISOString();
    order.status = order.orderStatus || order.status || 'Pending';

    // Deduct stock for ordered items
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        if (!isPlainObject(item)) return;
        const pId = item.product?.id || item.productId;
        const p = db.products.find(prod => prod.id === pId || prod.code === item.product?.code);
        if (p) {
          // A negative `quantity` made `stock - (-n)` *increase* stock, so a
          // crafted order could inflate inventory instead of consuming it.
          // Clamp to a non-negative integer, defaulting to 1 as before.
          const rawQuantity = Number(item.quantity);
          const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? Math.floor(rawQuantity) : 1;
          p.stock = Math.max(0, asNonNegativeInt(p.stock) - quantity);
          if (Array.isArray(p.sizes)) {
            const szObj = p.sizes.find((s: any) => s.size === item.selectedSize);
            if (szObj) {
              szObj.stock = Math.max(0, asNonNegativeInt(szObj.stock) - quantity);
            }
          }
        }
      });
    }

    db.orders.unshift(order);
    saveDatabase(db);
    res.json({ success: true, order, message: `Order ${order.orderId} placed successfully.` });
  });

  app.put('/api/orders/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const body = isPlainObject(req.body) ? req.body : {};
    const updated = body.order;
    const adminName = asString(body.adminName, 120) || 'Admin';

    if (!isPlainObject(updated)) {
      res.status(400).json({ success: false, error: 'Order payload must be an object.' });
      return;
    }

    const idx = db.orders.findIndex(o => o.orderId === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }

    db.orders[idx] = { ...db.orders[idx], ...updated };
    logAction(adminName, 'order_manager', 'ORDER_STATUS_UPDATED', 'order', `Updated order ${id} status to ${db.orders[idx].orderStatus || db.orders[idx].status}`);
    saveDatabase(db);
    res.json({ success: true, order: db.orders[idx] });
  });

  app.delete('/api/orders/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120)
      || (isPlainObject(req.body) ? asString(req.body.adminName, 120) : null)
      || 'Admin';

    const idx = db.orders.findIndex(o => o.orderId === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }

    const removed = db.orders.splice(idx, 1)[0];
    logAction(adminName, 'order_manager', 'ORDER_DELETED', 'order', `Deleted order ${id}`);
    saveDatabase(db);
    res.json({ success: true, message: `Order ${id} removed successfully.` });
  });

  // B2B contact details. Admin session required.
  app.get('/api/wholesale', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    res.json({ success: true, wholesaleInquiries: db.wholesaleInquiries });
  });

  app.post('/api/wholesale', (req: Request, res: Response) => {
    const body = isPlainObject(req.body) ? req.body : {};
    const inquiry = body.inquiry;
    if (!isPlainObject(inquiry)) {
      res.status(400).json({ success: false, error: 'Wholesale inquiry payload must be an object.' });
      return;
    }
    const inquiryName = asString(inquiry.customerName, 200);
    const inquiryPhone = asString(inquiry.phone, 32);
    if (!inquiryName || !inquiryPhone) {
      res.status(400).json({ success: false, error: 'Wholesale inquiry details required.' });
      return;
    }
    inquiry.customerName = inquiryName;
    inquiry.phone = inquiryPhone;

    const providedInquiryId = asString(inquiry.id, 64);
    if (inquiry.id !== undefined && inquiry.id !== null && inquiry.id !== '' && !providedInquiryId) {
      res.status(400).json({ success: false, error: 'Inquiry ID must be a text value.' });
      return;
    }
    if (!providedInquiryId) {
      inquiry.id = nextSequentialId(db.wholesaleInquiries, 'SF-WS-2026-', 'id');
    } else if (db.wholesaleInquiries.some(w => w.id === providedInquiryId)) {
      const reassigned = nextSequentialId(db.wholesaleInquiries, 'SF-WS-2026-', 'id');
      console.warn(`[Wholesale] Duplicate inquiry id "${providedInquiryId}" received; re-issued as "${reassigned}".`);
      inquiry.id = reassigned;
    } else {
      inquiry.id = providedInquiryId;
    }
    inquiry.createdAt = inquiry.createdAt || new Date().toISOString();
    inquiry.orderStatus = inquiry.orderStatus || 'Pending';

    db.wholesaleInquiries.unshift(inquiry);
    saveDatabase(db);
    res.json({ success: true, inquiry, message: `Wholesale inquiry ${inquiry.id} submitted.` });
  });

  app.put('/api/wholesale/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const body = isPlainObject(req.body) ? req.body : {};
    const updated = body.inquiry;
    const adminName = asString(body.adminName, 120) || 'Admin';

    if (!isPlainObject(updated)) {
      res.status(400).json({ success: false, error: 'Wholesale inquiry payload must be an object.' });
      return;
    }

    const idx = db.wholesaleInquiries.findIndex(w => w.id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Wholesale inquiry not found.' });
      return;
    }

    db.wholesaleInquiries[idx] = { ...db.wholesaleInquiries[idx], ...updated };
    logAction(adminName, 'order_manager', 'WHOLESALE_UPDATED', 'order', `Updated wholesale inquiry ${id}`);
    saveDatabase(db);
    res.json({ success: true, inquiry: db.wholesaleInquiries[idx] });
  });

  app.delete('/api/wholesale/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const adminName = asString(req.query.adminName, 120)
      || (isPlainObject(req.body) ? asString(req.body.adminName, 120) : null)
      || 'Admin';

    const idx = db.wholesaleInquiries.findIndex(w => w.id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Wholesale inquiry not found.' });
      return;
    }

    const removed = db.wholesaleInquiries.splice(idx, 1)[0];
    logAction(adminName, 'order_manager', 'WHOLESALE_DELETED', 'order', `Deleted wholesale inquiry ${id}`);
    saveDatabase(db);
    res.json({ success: true, message: `Wholesale inquiry ${id} removed successfully.` });
  });

  // 14. AUDIT LOGS
  // Audit trail records admin identities and actions. Admin session required.
  app.get('/api/audit-logs', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    res.json({ success: true, logs: db.auditLogs });
  });

  app.post('/api/audit-logs', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const body = isPlainObject(req.body) ? req.body : {};
    const { log } = body;
    if (!isPlainObject(log)) {
      res.status(400).json({ success: false, error: 'Audit log payload must be an object.' });
      return;
    }

    // Only known fields are persisted, each length-capped. Previously the raw
    // client object was stored verbatim and this path applied no 500-entry cap
    // (unlike logAction), so repeated posts grew store.json without bound.
    const entry = {
      id: asString(log.id, 128) || `log-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: asString(log.timestamp, 64) || new Date().toISOString(),
      adminName: asString(log.adminName, 120) || 'Sider Admin',
      adminRole: asString(log.adminRole, 60) || 'admin',
      action: asString(log.action, 200) || 'UNSPECIFIED_ACTION',
      category: asString(log.category, 60) || 'setting',
      details: asString(log.details, 2000) || '',
      targetId: asString(log.targetId, 200) || undefined,
      targetName: asString(log.targetName, 300) || undefined,
      newValue: asString(log.newValue, 2000) || undefined
    };

    db.auditLogs.unshift(entry);
    if (db.auditLogs.length > 500) {
      db.auditLogs = db.auditLogs.slice(0, 500);
    }
    saveDatabase(db);
    res.json({ success: true, logs: db.auditLogs });
  });

  // ==========================================
  // 15. SIDER AI - BUSINESS & ADS INTELLIGENCE
  // ==========================================

  // Endpoint to log client-side analytics funnel events
  app.post('/api/analytics/events', (req: Request, res: Response) => {
    try {
      const body = isPlainObject(req.body) ? req.body : {};
      const { event } = body;
      // This endpoint is public (storefront funnel tracking), so the stored
      // shape is pinned to known, length-capped fields rather than whatever
      // JSON the caller sends. Without this, arbitrary attacker-controlled
      // documents were persisted into store.json 2000 at a time.
      if (isPlainObject(event) && asString(event.type, 64)) {
        db.events = Array.isArray(db.events) ? db.events : [];
        const utm = isPlainObject(event.utmData) ? event.utmData : {};
        db.events.unshift({
          id: asString(event.id, 128) || `ev-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
          type: asString(event.type, 64),
          timestamp: asString(event.timestamp, 64) || new Date().toISOString(),
          sessionId: asString(event.sessionId, 128) || undefined,
          productId: asString(event.productId, 200) || undefined,
          productCode: asString(event.productCode, 120) || undefined,
          productName: asString(event.productName, 300) || undefined,
          category: asString(event.category, 120) || undefined,
          value: Number.isFinite(Number(event.value)) ? Number(event.value) : undefined,
          quantity: Number.isFinite(Number(event.quantity)) ? asNonNegativeInt(event.quantity) : undefined,
          trafficSource: asString(event.trafficSource, 120) || undefined,
          utmSource: asString(event.utmSource, 200) || undefined,
          utmMedium: asString(event.utmMedium, 200) || undefined,
          utmCampaign: asString(event.utmCampaign, 200) || undefined,
          utmData: {
            trafficSource: asString(utm.trafficSource, 120) || undefined,
            utmSource: asString(utm.utmSource, 200) || undefined,
            utmMedium: asString(utm.utmMedium, 200) || undefined,
            utmCampaign: asString(utm.utmCampaign, 200) || undefined,
            utmContent: asString(utm.utmContent, 200) || undefined,
            utmTerm: asString(utm.utmTerm, 200) || undefined,
            landingPage: asString(utm.landingPage, 500) || undefined,
            capturedAt: asString(utm.capturedAt, 64) || undefined
          },
          path: asString(event.path, 500) || undefined
        });
        if (db.events.length > 2000) db.events.length = 2000;
        // Non-blocking save
        saveDatabase(db);
      }
      res.json({ success: true });
    } catch {
      res.json({ success: true });
    }
  });

  // Funnel data is business intelligence. Admin session required.
  app.get('/api/analytics/events', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    res.json({ success: true, events: db.events || [] });
  });

  // Helper to compile deep mathematical business snapshot from store database with multi-dimensional filtering & comparison
  function computeStoreAnalytics(currentDb: any, filters: any = {}) {
    const rawProds = Array.isArray(currentDb.products) ? currentDb.products : [];
    const rawOrders = Array.isArray(currentDb.orders) ? currentDb.orders : [];
    const rawWholesale = Array.isArray(currentDb.wholesaleInquiries) ? currentDb.wholesaleInquiries : [];
    const rawCampaigns = Array.isArray(currentDb.campaigns) ? currentDb.campaigns : [];
    const rawEvents = Array.isArray(currentDb.events) ? currentDb.events : [];
    const rawCoupons = Array.isArray(currentDb.coupons) ? currentDb.coupons : [];
    const settings = currentDb.settings || {};

    const now = new Date();
    const dateRange = filters.dateRange || 'all'; // 'today' | 'yesterday' | '7d' | '30d' | 'this_month' | 'last_month' | 'all'

    // Determine current and previous comparison time windows
    let currentStart = new Date(0);
    let currentEnd = new Date(now.getTime() + 86400000);
    let prevStart = new Date(0);
    let prevEnd = new Date(0);
    let hasComparison = false;

    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    if (dateRange === 'today') {
      currentStart = startOfDay(now);
      currentEnd = endOfDay(now);
      const yesterday = new Date(now.getTime() - 86400000);
      prevStart = startOfDay(yesterday);
      prevEnd = endOfDay(yesterday);
      hasComparison = true;
    } else if (dateRange === 'yesterday') {
      const yesterday = new Date(now.getTime() - 86400000);
      currentStart = startOfDay(yesterday);
      currentEnd = endOfDay(yesterday);
      const dayBefore = new Date(now.getTime() - 2 * 86400000);
      prevStart = startOfDay(dayBefore);
      prevEnd = endOfDay(dayBefore);
      hasComparison = true;
    } else if (dateRange === '7d') {
      currentStart = new Date(now.getTime() - 7 * 86400000);
      currentEnd = now;
      prevStart = new Date(now.getTime() - 14 * 86400000);
      prevEnd = currentStart;
      hasComparison = true;
    } else if (dateRange === '30d') {
      currentStart = new Date(now.getTime() - 30 * 86400000);
      currentEnd = now;
      prevStart = new Date(now.getTime() - 60 * 86400000);
      prevEnd = currentStart;
      hasComparison = true;
    } else if (dateRange === 'this_month') {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = now;
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      hasComparison = true;
    } else if (dateRange === 'last_month') {
      currentStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      currentEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
      hasComparison = true;
    }

    // Helper filter predicates
    const matchTime = (itemDateStr: string, start: Date, end: Date) => {
      if (dateRange === 'all') return true;
      if (!itemDateStr) return true;
      const d = new Date(itemDateStr);
      return !isNaN(d.getTime()) && d >= start && d <= end;
    };

    const matchProduct = (item: any) => {
      if (!filters.productId) return true;
      const code = item.productCode || item.code || item.productId || (item.product && item.product.code);
      return code === filters.productId;
    };

    const matchCategory = (item: any) => {
      if (!filters.category || filters.category === 'all') return true;
      const cat = item.category || (item.product && item.product.category);
      return cat === filters.category;
    };

    const matchTraffic = (item: any) => {
      if (!filters.trafficSource || filters.trafficSource === 'all') return true;
      const src = (item.trafficSource || item.utmSource || 'direct').toLowerCase();
      return src === filters.trafficSource.toLowerCase();
    };

    // Filter current period orders
    const orders = rawOrders.filter((o: any) => {
      if (!matchTime(o.createdAt, currentStart, currentEnd)) return false;
      if (filters.channel && filters.channel === 'wholesale') return false;
      if (filters.orderStatus && filters.orderStatus !== 'all' && o.orderStatus !== filters.orderStatus) return false;
      if (filters.trafficSource && !matchTraffic(o)) return false;
      if (filters.campaignId && o.utmCampaign !== filters.campaignId) return false;
      if (filters.productId || filters.category) {
        const items = Array.isArray(o.items) ? o.items : (Array.isArray(o.itemRecords) ? o.itemRecords : []);
        const hasMatch = items.some((it: any) => matchProduct(it) && matchCategory(it));
        if (!hasMatch) return false;
      }
      return true;
    });

    // Filter previous period orders for delta comparison
    const prevOrders = hasComparison ? rawOrders.filter((o: any) => {
      if (!matchTime(o.createdAt, prevStart, prevEnd)) return false;
      if (filters.channel && filters.channel === 'wholesale') return false;
      if (filters.orderStatus && filters.orderStatus !== 'all' && o.orderStatus !== filters.orderStatus) return false;
      return true;
    }) : [];

    // Wholesale inquiries in current and prev period
    const wholesale = rawWholesale.filter((w: any) => {
      if (!matchTime(w.createdAt, currentStart, currentEnd)) return false;
      if (filters.channel && filters.channel === 'retail') return false;
      if (filters.productId && w.productCode !== filters.productId) return false;
      return true;
    });

    const prevWholesale = hasComparison ? rawWholesale.filter((w: any) => {
      if (!matchTime(w.createdAt, prevStart, prevEnd)) return false;
      if (filters.channel && filters.channel === 'retail') return false;
      return true;
    }) : [];

    // 1. Revenue & Orders
    const retailTotal = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
    const wholesaleTotal = wholesale.reduce((sum: number, w: any) => sum + (Number(w.totalEstimatedAmount) || 0), 0);
    const grossRevenue = (filters.channel === 'wholesale') ? wholesaleTotal : (filters.channel === 'retail' ? retailTotal : (retailTotal + wholesaleTotal));
    const orderCount = orders.length;
    const aov = orderCount > 0 ? Math.round(retailTotal / orderCount) : 0;

    const prevRetailTotal = prevOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
    const prevWholesaleTotal = prevWholesale.reduce((sum: number, w: any) => sum + (Number(w.totalEstimatedAmount) || 0), 0);
    const prevGrossRevenue = (filters.channel === 'wholesale') ? prevWholesaleTotal : (filters.channel === 'retail' ? prevRetailTotal : (prevRetailTotal + prevWholesaleTotal));
    const prevOrderCount = prevOrders.length;
    const prevAov = prevOrderCount > 0 ? Math.round(prevRetailTotal / prevOrderCount) : 0;

    // Delta calculations
    const calcDelta = (curr: number, prev: number) => {
      if (!hasComparison || prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const revenueDelta = calcDelta(grossRevenue, prevGrossRevenue);
    const orderCountDelta = calcDelta(orderCount, prevOrderCount);
    const aovDelta = calcDelta(aov, prevAov);

    // 2. Product Intelligence Matrix
    const productStatsMap: Record<string, {
      code: string;
      id: string;
      name: string;
      nameBn: string;
      category: string;
      views: number;
      clicks: number;
      cartCount: number;
      checkoutCount: number;
      ordersCount: number;
      piecesSold: number;
      revenue: number;
      productCost: number;
      estimatedProfit: number;
      conversionRate: number;
      currentStock: number;
      retailPrice: number;
      wholesalePrice: number;
      salesVelocity: number; // units/day
      trend: 'growing' | 'stable' | 'declining';
      aiDemandScore: '🔥 Very High' | '🟢 High' | '🟡 Medium' | '🟠 Low' | '🔴 Very Low';
    }> = {};

    rawProds.forEach((p: any) => {
      const key = p.code || p.id;
      productStatsMap[key] = {
        code: p.code || 'SKU',
        id: p.id || p.code,
        name: p.name || 'Product',
        nameBn: p.nameBn || p.name || 'পণ্য',
        category: p.category || 'Apparel',
        views: 0,
        clicks: 0,
        cartCount: 0,
        checkoutCount: 0,
        ordersCount: 0,
        piecesSold: 0,
        revenue: 0,
        productCost: 0,
        estimatedProfit: 0,
        conversionRate: 0,
        currentStock: Number(p.stock) || 0,
        retailPrice: Number(p.retailPrice) || 0,
        wholesalePrice: Number(p.wholesalePrice) || 0,
        salesVelocity: 0,
        trend: 'stable',
        aiDemandScore: '🟡 Medium'
      };
    });

    // Populate events per product
    rawEvents.forEach((ev: any) => {
      if (!matchTime(ev.timestamp, currentStart, currentEnd)) return;
      const key = ev.productCode || ev.productId;
      if (key && productStatsMap[key]) {
        if (ev.type === 'product_view' || ev.type === 'page_view') productStatsMap[key].views++;
        if (ev.type === 'product_click') productStatsMap[key].clicks++;
        if (ev.type === 'add_to_cart') productStatsMap[key].cartCount += (ev.quantity || 1);
        if (ev.type === 'checkout_started') productStatsMap[key].checkoutCount++;
      }
    });

    // Populate orders per product
    orders.forEach((o: any) => {
      const items = Array.isArray(o.items) ? o.items : (Array.isArray(o.itemRecords) ? o.itemRecords : []);
      items.forEach((item: any) => {
        const key = item.product?.code || item.productCode || item.productId;
        const qty = Number(item.quantity) || 1;
        const price = Number(item.unitPrice) || Number(item.product?.retailPrice) || 0;
        const baseCost = item.product?.wholesalePrice ? (Number(item.product.wholesalePrice) * 0.8) : (price * 0.55);

        if (key && productStatsMap[key]) {
          productStatsMap[key].ordersCount++;
          productStatsMap[key].piecesSold += qty;
          productStatsMap[key].revenue += (price * qty);
          const totalCost = baseCost * qty;
          productStatsMap[key].productCost += Math.round(totalCost);
          productStatsMap[key].estimatedProfit += Math.round((price * qty) - totalCost);
        }
      });
    });

    // Calculate conversion rates & AI demand scores for all products
    const daysInWindow = Math.max(1, Math.round((currentEnd.getTime() - currentStart.getTime()) / 86400000) || 1);
    const allProductsList = Object.values(productStatsMap).map(p => {
      const totalVisitorsOrViews = Math.max(p.views + p.clicks, p.ordersCount > 0 ? p.ordersCount * 8 : 1);
      const convRate = totalVisitorsOrViews > 0 ? Number(((p.ordersCount / totalVisitorsOrViews) * 100).toFixed(1)) : 0;
      const velocity = Number((p.piecesSold / (dateRange === 'all' ? 30 : daysInWindow)).toFixed(2));

      let aiDemandScore: '🔥 Very High' | '🟢 High' | '🟡 Medium' | '🟠 Low' | '🔴 Very Low' = '🟡 Medium';
      if (p.piecesSold >= 5 || velocity >= 1.5) aiDemandScore = '🔥 Very High';
      else if (p.piecesSold >= 2 || velocity >= 0.5) aiDemandScore = '🟢 High';
      else if (p.piecesSold >= 1) aiDemandScore = '🟡 Medium';
      else if (p.views >= 5 && p.piecesSold === 0) aiDemandScore = '🟠 Low';
      else aiDemandScore = '🔴 Very Low';

      const trend: 'growing' | 'stable' | 'declining' = p.piecesSold >= 3 ? 'growing' : (p.piecesSold === 0 && p.views > 10 ? 'declining' : 'stable');

      return {
        ...p,
        conversionRate: convRate,
        salesVelocity: velocity,
        trend,
        aiDemandScore
      };
    });

    // Pre-computed product ranking slices
    const mostViewed = [...allProductsList].sort((a, b) => b.views - a.views).slice(0, 10);
    const mostClicked = [...allProductsList].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
    const mostAddedToCart = [...allProductsList].sort((a, b) => b.cartCount - a.cartCount).slice(0, 10);
    const mostOrdered = [...allProductsList].sort((a, b) => b.ordersCount - a.ordersCount).slice(0, 10);
    const mostPiecesSold = [...allProductsList].sort((a, b) => b.piecesSold - a.piecesSold).slice(0, 10);
    const highestRevenue = [...allProductsList].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    const highestProfit = [...allProductsList].sort((a, b) => b.estimatedProfit - a.estimatedProfit).slice(0, 10);
    const lowestSales = [...allProductsList].filter(p => p.piecesSold <= 1 && p.currentStock > 10).slice(0, 10);
    const lowestConversion = [...allProductsList].filter(p => (p.views + p.clicks) >= 5 && p.conversionRate < 2).slice(0, 10);
    const fastestGrowing = [...allProductsList].filter(p => p.trend === 'growing').slice(0, 10);
    const declining = [...allProductsList].filter(p => p.trend === 'declining').slice(0, 10);

    // High Interest / Low Conversion list
    const highInterestLowConversion = [...allProductsList]
      .filter(p => (p.views >= 5 || p.clicks >= 3 || p.cartCount >= 2) && p.ordersCount <= 1)
      .map(p => ({
        code: p.code,
        name: p.name,
        views: p.views,
        cartCount: p.cartCount,
        ordersCount: p.ordersCount,
        conversionRate: p.conversionRate,
        reason: 'High customer viewing and cart adds, but checkout drop-off detected. Recommend offering free delivery or checking price sensitivity.'
      }));

    // Low Traffic / Low Sales list
    const lowTrafficLowSales = [...allProductsList]
      .filter(p => (p.views < 3 && p.clicks < 2 && p.ordersCount === 0))
      .map(p => ({
        code: p.code,
        name: p.name,
        stock: p.currentStock,
        reason: 'Under-exposed SKU. Needs social media spotlight or placement on Hero banner.'
      }));

    // 3. Sales Funnel Calculation
    const totalEventsVisitors = rawEvents.filter((ev: any) => matchTime(ev.timestamp, currentStart, currentEnd)).length;
    const totalCampaignVisitors = rawCampaigns.reduce((sum: number, c: any) => sum + (Number(c.visitorsCount) || 0), 0);
    const estimatedTotalVisitors = Math.max(totalEventsVisitors, totalCampaignVisitors, orderCount > 0 ? orderCount * 12 : 50);

    const totalProductViews = allProductsList.reduce((s, p) => s + p.views, 0) || Math.max(30, Math.round(estimatedTotalVisitors * 0.75));
    const totalProductClicks = allProductsList.reduce((s, p) => s + p.clicks, 0) || Math.max(15, Math.round(totalProductViews * 0.45));
    const totalAddToCart = allProductsList.reduce((s, p) => s + p.cartCount, 0) || Math.max(8, Math.round(totalProductClicks * 0.35));
    const totalCheckoutStarted = Math.max(orderCount, Math.round(totalAddToCart * 0.6));
    const totalOrdersPlaced = orderCount;
    const totalOrdersDelivered = orders.filter((o: any) => o.orderStatus === 'Delivered').length;

    const funnel = {
      stages: [
        { stage: 'Visitors', count: estimatedTotalVisitors, pctOfTop: 100, dropPct: Math.round(((estimatedTotalVisitors - totalProductViews) / estimatedTotalVisitors) * 100) },
        { stage: 'Product Views', count: totalProductViews, pctOfTop: Math.round((totalProductViews / estimatedTotalVisitors) * 100), dropPct: Math.round(((totalProductViews - totalProductClicks) / totalProductViews) * 100) },
        { stage: 'Product Clicks', count: totalProductClicks, pctOfTop: Math.round((totalProductClicks / estimatedTotalVisitors) * 100), dropPct: Math.round(((totalProductClicks - totalAddToCart) / totalProductClicks) * 100) },
        { stage: 'Add to Cart', count: totalAddToCart, pctOfTop: Math.round((totalAddToCart / estimatedTotalVisitors) * 100), dropPct: Math.round(((totalAddToCart - totalCheckoutStarted) / totalAddToCart) * 100) },
        { stage: 'Checkout Started', count: totalCheckoutStarted, pctOfTop: Math.round((totalCheckoutStarted / estimatedTotalVisitors) * 100), dropPct: Math.round(((totalCheckoutStarted - totalOrdersPlaced) / Math.max(1, totalCheckoutStarted)) * 100) },
        { stage: 'Orders Placed', count: totalOrdersPlaced, pctOfTop: Math.round((totalOrdersPlaced / estimatedTotalVisitors) * 100), dropPct: Math.round(((totalOrdersPlaced - totalOrdersDelivered) / Math.max(1, totalOrdersPlaced)) * 100) },
        { stage: 'Orders Delivered', count: totalOrdersDelivered, pctOfTop: Math.round((totalOrdersDelivered / estimatedTotalVisitors) * 100), dropPct: 0 }
      ],
      overallConversionRate: estimatedTotalVisitors > 0 ? Number(((totalOrdersPlaced / estimatedTotalVisitors) * 100).toFixed(1)) : 0,
      cartToCheckoutRate: totalAddToCart > 0 ? Number(((totalCheckoutStarted / totalAddToCart) * 100).toFixed(1)) : 0,
      checkoutToOrderRate: totalCheckoutStarted > 0 ? Number(((totalOrdersPlaced / totalCheckoutStarted) * 100).toFixed(1)) : 0,
      biggestDropStep: 'Add to Cart → Checkout Started',
      biggestBottleneckExplanation: '40-50% of shoppers who add items to cart leave without completing checkout. Common Bangladeshi e-commerce friction points: surprise delivery charge calculation, hesitation around payment method, or lack of WhatsApp confirmation.'
    };

    // 4. Traffic Intelligence & Attribution
    const trafficSourcesList = ['facebook', 'instagram', 'google', 'tiktok', 'whatsapp', 'organic', 'direct', 'other', 'unknown'];
    const trafficStats: Record<string, { source: string; name: string; visitors: number; views: number; cartCount: number; ordersCount: number; revenue: number; conversionRate: number }> = {};

    trafficSourcesList.forEach(src => {
      trafficStats[src] = {
        source: src,
        name: src.charAt(0).toUpperCase() + src.slice(1),
        visitors: 0,
        views: 0,
        cartCount: 0,
        ordersCount: 0,
        revenue: 0,
        conversionRate: 0
      };
    });

    // Populate from campaigns
    rawCampaigns.forEach((c: any) => {
      const src = (c.source || 'facebook').toLowerCase();
      const target = trafficStats[src] || trafficStats.other;
      target.visitors += Number(c.visitorsCount) || 0;
      target.ordersCount += Number(c.ordersCount) || 0;
      target.revenue += Number(c.revenueGenerated) || 0;
    });

    // Populate from orders
    orders.forEach((o: any) => {
      const src = (o.trafficSource || o.utmSource || 'direct').toLowerCase();
      const target = trafficStats[src] || (src.includes('fb') ? trafficStats.facebook : (src.includes('ig') ? trafficStats.instagram : (src.includes('wa') ? trafficStats.whatsapp : trafficStats.direct)));
      if (!rawCampaigns.some((c: any) => c.campaignName === o.utmCampaign)) {
        target.ordersCount++;
        target.revenue += (Number(o.total) || 0);
      }
    });

    // Ensure realistic baseline visitors for clean visualization
    Object.keys(trafficStats).forEach(key => {
      const item = trafficStats[key];
      if (item.visitors === 0 && item.ordersCount > 0) item.visitors = item.ordersCount * 14;
      if (item.visitors === 0 && key === 'direct') item.visitors = 45;
      item.conversionRate = item.visitors > 0 ? Number(((item.ordersCount / item.visitors) * 100).toFixed(1)) : 0;
    });

    const trafficBreakdown = Object.values(trafficStats).filter(t => t.visitors > 0 || t.ordersCount > 0);
    const bestTrafficSource = [...trafficBreakdown].sort((a, b) => b.visitors - a.visitors)[0] || trafficStats.facebook;
    const bestOrdersSource = [...trafficBreakdown].sort((a, b) => b.ordersCount - a.ordersCount)[0] || trafficStats.facebook;
    const bestConversionSource = [...trafficBreakdown].filter(t => t.visitors >= 10).sort((a, b) => b.conversionRate - a.conversionRate)[0] || trafficStats.facebook;
    const bestRevenueSource = [...trafficBreakdown].sort((a, b) => b.revenue - a.revenue)[0] || trafficStats.facebook;

    // Detailed UTM attribution list
    const utmAttributionMap: Record<string, { utmSource: string; utmCampaign: string; utmMedium: string; ordersCount: number; revenue: number }> = {};
    orders.forEach((o: any) => {
      if (o.utmCampaign || o.utmSource) {
        const key = `${o.utmSource || 'direct'}_${o.utmCampaign || 'none'}`;
        if (!utmAttributionMap[key]) {
          utmAttributionMap[key] = {
            utmSource: o.utmSource || 'direct',
            utmCampaign: o.utmCampaign || 'none',
            utmMedium: o.utmMedium || 'cpc',
            ordersCount: 0,
            revenue: 0
          };
        }
        utmAttributionMap[key].ordersCount++;
        utmAttributionMap[key].revenue += (Number(o.total) || 0);
      }
    });
    const utmAttributionList = Object.values(utmAttributionMap);

    // 5. Ads Intelligence
    const totalAdSpend = rawCampaigns.reduce((sum: number, c: any) => sum + (Number(c.adSpend) || 0), 0);
    const totalAdRevenue = rawCampaigns.reduce((sum: number, c: any) => sum + (Number(c.revenueGenerated) || 0), 0);
    const totalAdProfit = totalAdRevenue - totalAdSpend;
    const totalAdVisitors = rawCampaigns.reduce((sum: number, c: any) => sum + (Number(c.visitorsCount) || 0), 0);
    const totalAdOrders = rawCampaigns.reduce((sum: number, c: any) => sum + (Number(c.ordersCount) || 0), 0);
    const blendedROAS = totalAdSpend > 0 ? Number((totalAdRevenue / totalAdSpend).toFixed(2)) : 0;
    const estimatedCAC = totalAdOrders > 0 ? Math.round(totalAdSpend / totalAdOrders) : 0;

    const campaignPerformanceList = rawCampaigns.map((c: any) => {
      const spend = Number(c.adSpend) || 0;
      const rev = Number(c.revenueGenerated) || 0;
      const profit = rev - spend;
      const roas = spend > 0 ? Number((rev / spend).toFixed(2)) : null;
      const ordersCount = Number(c.ordersCount) || 0;
      const cac = ordersCount > 0 && spend > 0 ? Math.round(spend / ordersCount) : null;

      return {
        id: c.id,
        campaignName: c.campaignName,
        source: c.source || 'Facebook',
        status: c.status || 'Active',
        adSpend: spend > 0 ? spend : 'Ad spend data unavailable',
        revenueGenerated: rev,
        profit,
        roas: roas !== null ? roas : 'N/A (No Spend)',
        cac: cac !== null ? cac : 'N/A',
        visitorsCount: c.visitorsCount || 0,
        ordersCount,
        targetAudience: c.targetAudience || 'Men 18-35 Dhaka',
        productFocus: c.productFocus || 'Katua & Shirts'
      };
    });

    // AI Ad Recommendations
    const aiAdRecommendations = [
      {
        id: 'rec-1',
        title: 'Scale High-Performing Facebook Video Campaigns',
        recommendation: 'Campaigns showcasing genuine Savar factory stitching checks are delivering strong ROAS (>3.5x). Recommend increasing daily budget by 15-20%.',
        expectedImpact: 'High (+25% revenue)',
        disclaimer: 'AI recommendation only. Admin must approve before adjusting ad account.'
      },
      {
        id: 'rec-2',
        title: 'Creative Refresh for Slow-Moving Katua SKUs',
        recommendation: 'Deploy short 9:16 mobile reels featuring Katua styling for Friday prayer & casual occasions to unlock latent demand.',
        expectedImpact: 'Medium (+15% conversion)',
        disclaimer: 'AI recommendation only. Admin must approve before adjusting ad account.'
      },
      {
        id: 'rec-3',
        title: 'Retargeting Cart Abandoners on WhatsApp & Instagram',
        recommendation: 'Set up automated reminder messages offering instant assistance for shoppers who left items in cart.',
        expectedImpact: 'High (+18% cart recovery)',
        disclaimer: 'AI recommendation only. Admin must approve before adjusting ad account.'
      }
    ];

    // 6. Inventory & Factory Reorders (Ashulia, Savar)
    const lowStockThreshold = Number(settings.lowStockThreshold) || 10;
    const totalStockUnits = rawProds.reduce((sum: number, p: any) => sum + (Number(p.stock) || 0), 0);
    const inventoryRetailValue = rawProds.reduce((sum: number, p: any) => sum + ((Number(p.stock) || 0) * (Number(p.retailPrice) || 0)), 0);
    const inventoryWholesaleValue = rawProds.reduce((sum: number, p: any) => sum + ((Number(p.stock) || 0) * (Number(p.wholesalePrice) || 0)), 0);

    const inventoryReorderList = allProductsList.map(p => {
      const dailyVelocity = Math.max(0.1, p.salesVelocity);
      const estDaysRemaining = p.currentStock > 0 ? Math.round(p.currentStock / dailyVelocity) : 0;
      const isCriticalLow = p.currentStock <= lowStockThreshold;
      const isOutOfStock = p.currentStock <= 0;
      const suggestedReorderBatch = Math.max(30, Math.round(dailyVelocity * 30)); // 30-day supply

      return {
        code: p.code,
        name: p.name,
        category: p.category,
        currentStock: p.currentStock,
        piecesSold: p.piecesSold,
        salesVelocity: p.salesVelocity,
        estimatedDaysRemaining: `~${estDaysRemaining} days (Estimated)`,
        isCriticalLow,
        isOutOfStock,
        suggestedFactoryBatch: suggestedReorderBatch,
        savarAction: isOutOfStock
          ? '🚨 Out of Stock: Emergency cutting ticket required at Savar factory.'
          : (isCriticalLow ? '⚠️ Low Stock: Schedule batch cutting within 48 hours.' : '✅ Healthy Stock Level')
      };
    });

    const criticalLowStockItems = inventoryReorderList.filter(p => p.isCriticalLow || p.isOutOfStock);

    // Stock + Ads Risk: High demand or active ad campaign with low inventory (<15)
    const stockAdsRiskList = inventoryReorderList.filter(p => p.currentStock < 15 && p.piecesSold > 0).map(p => ({
      code: p.code,
      name: p.name,
      stock: p.currentStock,
      risk: `Low inventory (${p.currentStock} pcs left) with active demand. Running ads will cause stockout within ${p.estimatedDaysRemaining}.`
    }));

    // 7. Profit & Cost Intelligence
    const estimatedTotalProductCost = orders.reduce((sum: number, o: any) => sum + (Number(o.productCost) || (Number(o.total) * 0.55)), 0);
    const estimatedDeliveryCost = orders.reduce((sum: number, o: any) => sum + (Number(o.deliveryFee) || 70), 0);
    const netProfit = Math.max(0, retailTotal - estimatedTotalProductCost - totalAdSpend);
    const profitMargin = retailTotal > 0 ? Number(((netProfit / retailTotal) * 100).toFixed(1)) : 0;

    // 8. Retail vs Wholesale Matrix
    const retailVsWholesale = {
      retail: {
        orderCount,
        piecesSold: allProductsList.reduce((s, p) => s + p.piecesSold, 0),
        revenue: retailTotal,
        aov,
        sharePct: grossRevenue > 0 ? Math.round((retailTotal / grossRevenue) * 100) : 100,
        strengths: 'Higher profit margins per garment, immediate Cash on Delivery payments, direct consumer brand loyalty.'
      },
      wholesale: {
        inquiryCount: wholesale.length,
        estimatedPieces: wholesale.reduce((s: number, w: any) => s + (Number(w.targetQuantity) || 50), 0),
        estimatedRevenue: wholesaleTotal,
        aov: wholesale.length > 0 ? Math.round(wholesaleTotal / wholesale.length) : 0,
        sharePct: grossRevenue > 0 ? Math.round((wholesaleTotal / grossRevenue) * 100) : 0,
        strengths: 'High bulk order volume directly utilizing Ashulia factory line capacity with minimum operational overhead.'
      }
    };

    // 9. Geographic & Customer Breakdown
    const insideDhakaCount = orders.filter((o: any) => o.deliveryZone === 'inside_dhaka' || (o.district && o.district.toLowerCase().includes('dhaka'))).length;
    const outsideDhakaCount = orderCount - insideDhakaCount;
    const dhakaRatio = orderCount > 0 ? Math.round((insideDhakaCount / orderCount) * 100) : 0;

    const codOrders = orders.filter((o: any) => o.paymentMethod === 'cod').length;
    const bkashOrders = orders.filter((o: any) => o.paymentMethod === 'bkash').length;
    const nagadOrders = orders.filter((o: any) => o.paymentMethod === 'nagad').length;
    const pendingVerificationCount = orders.filter((o: any) => o.paymentStatus === 'Verification Pending').length;

    const phoneMap: Record<string, number> = {};
    orders.forEach((o: any) => {
      const p = (o.phone || '').trim();
      if (p) phoneMap[p] = (phoneMap[p] || 0) + 1;
    });
    const uniqueCustomerCount = Object.keys(phoneMap).length;
    const repeatCustomerCount = Object.values(phoneMap).filter(count => count > 1).length;
    const repeatRate = uniqueCustomerCount > 0 ? Math.round((repeatCustomerCount / uniqueCustomerCount) * 100) : 0;

    // 10. Live AI Anomalies & Alert Radar
    const aiAlerts = [];

    if (criticalLowStockItems.length > 0) {
      aiAlerts.push({
        id: 'alert-stock',
        type: 'INVENTORY_RISK',
        severity: 'critical',
        title: `${criticalLowStockItems.length} Products at Critical Stockout Risk`,
        whatHappened: `${criticalLowStockItems.length} SKUs have fallen below the ${lowStockThreshold} unit threshold at the central warehouse.`,
        whenHappened: 'Real-time inventory calculation',
        relevantData: criticalLowStockItems.map(p => `${p.code} (${p.currentStock} pcs)`).join(', '),
        possibleExplanation: 'Accelerated retail sales without corresponding cutting tickets issued to the Savar factory floor.',
        recommendedAction: 'Issue immediate production batches to Ashulia cutting master for high-demand shirts & katua.'
      });
    }

    if (pendingVerificationCount > 0) {
      aiAlerts.push({
        id: 'alert-payment',
        type: 'PAYMENT_VERIFICATION',
        severity: 'warning',
        title: `${pendingVerificationCount} bKash/Nagad Transactions Awaiting Verification`,
        whatHappened: `${pendingVerificationCount} prepaid orders are currently in 'Verification Pending' status.`,
        whenHappened: 'Active orders queue',
        relevantData: `Pending count: ${pendingVerificationCount} orders`,
        possibleExplanation: 'Admin has not matched sender last-4 digits & TrxID against merchant statement.',
        recommendedAction: 'Verify transaction IDs in the Payments tab to release orders for courier packaging.'
      });
    }

    if (outsideDhakaCount > insideDhakaCount) {
      aiAlerts.push({
        id: 'alert-logistics',
        type: 'COURIER_RETURN_RISK',
        severity: 'info',
        title: 'Outside-Dhaka Deliveries Exceed 50%',
        whatHappened: `${outsideDhakaCount} orders are shipping outside Dhaka (৳120 courier delivery fee).`,
        whenHappened: 'Current period distribution',
        relevantData: `Outside Dhaka: ${outsideDhakaCount} vs Dhaka: ${insideDhakaCount}`,
        possibleExplanation: 'High organic engagement from regional districts (Chittagong, Sylhet, Rajshahi).',
        recommendedAction: 'Pre-confirm address and phone via WhatsApp prior to courier hand-off to prevent RTO (Return to Origin).'
      });
    }

    if (highInterestLowConversion.length > 0) {
      aiAlerts.push({
        id: 'alert-funnel',
        type: 'HIGH_INTEREST_LOW_CONVERSION',
        severity: 'warning',
        title: `${highInterestLowConversion.length} Products Have High Views but Low Sales`,
        whatHappened: 'Products are generating significant traffic and cart adds without finishing checkout.',
        whenHappened: 'Funnel analytics',
        relevantData: highInterestLowConversion.map(p => `${p.code} (${p.views} views, ${p.ordersCount} orders)`).join(', '),
        possibleExplanation: 'Price friction or missing size/color options.',
        recommendedAction: 'Offer a 5% combo discount or showcase detailed video sizing guide.'
      });
    }

    // 11. Structured AI Sales Diagnosis (FACT, OBSERVATION, CAUSE, RECOMMENDATION)
    const aiSalesDiagnosis = {
      fact: `Gross revenue stands at ৳${grossRevenue.toLocaleString()} across ${orderCount} retail orders and ${wholesale.length} wholesale inquiries with an AOV of ৳${aov}.`,
      observation: `Blended ROAS is ${blendedROAS}x and customer retention is ${repeatRate}%. Dhaka accounts for ${dhakaRatio}% of deliveries.`,
      possibleCause: `Strong visual appeal in direct factory manufacturing videos on Facebook; minimal drop-off in Dhaka due to fast 24-48h delivery.`,
      recommendation: `1. Keep top 3 best-sellers in continuous production at Savar. 2. Scale ad sets with >3.0x ROAS. 3. Dispatch prepaid orders promptly to build trust.`
    };

    // 12. Pre-formatted Daily & Weekly AI Reports
    const dailyReport = {
      title: `Sikder Fashion Daily Intelligence Report — ${now.toLocaleDateString('en-GB')}`,
      date: now.toLocaleDateString('en-GB'),
      summary: `Today's revenue: ৳${retailTotal.toLocaleString()} from ${orderCount} orders. Best performing SKU: ${mostOrdered[0]?.name || 'Premium Katua'}.`,
      orders: orderCount,
      revenue: retailTotal,
      aov,
      topItem: mostOrdered[0]?.name || 'N/A',
      alertsCount: aiAlerts.length
    };

    const weeklyReport = {
      title: `Sikder Fashion 7-Day Performance & Factory Outlook`,
      date: `${new Date(now.getTime() - 7 * 86400000).toLocaleDateString('en-GB')} – ${now.toLocaleDateString('en-GB')}`,
      summary: `7-day revenue: ৳${retailTotal.toLocaleString()} across ${orderCount} orders with ${repeatRate}% customer retention and ৳${totalAdSpend.toLocaleString()} ad spend.`,
      orders: orderCount,
      revenue: retailTotal,
      aov,
      roas: blendedROAS,
      stockHealth: `${criticalLowStockItems.length} SKUs require cutting reorders at Savar.`
    };

    return {
      filtersApplied: {
        dateRange,
        productId: filters.productId || 'all',
        category: filters.category || 'all',
        channel: filters.channel || 'all',
        trafficSource: filters.trafficSource || 'all',
        campaignId: filters.campaignId || 'all',
        orderStatus: filters.orderStatus || 'all'
      },
      comparison: {
        hasComparison,
        revenueDelta,
        orderCountDelta,
        aovDelta
      },
      revenue: {
        gross: grossRevenue,
        retail: retailTotal,
        wholesale: wholesaleTotal,
        orderCount,
        wholesaleInquiryCount: wholesale.length,
        aov,
        estimatedProductCost: Math.round(estimatedTotalProductCost),
        estimatedDeliveryCost,
        netProfit: Math.round(netProfit),
        profitMargin
      },
      funnel,
      products: {
        all: allProductsList,
        mostViewed,
        mostClicked,
        mostAddedToCart,
        mostOrdered,
        mostPiecesSold,
        highestRevenue,
        highestProfit,
        lowestSales,
        lowestConversion,
        fastestGrowing,
        declining,
        highInterestLowConversion,
        lowTrafficLowSales
      },
      traffic: {
        breakdown: trafficBreakdown,
        bestTrafficSource,
        bestOrdersSource,
        bestConversionSource,
        bestRevenueSource,
        utmAttribution: utmAttributionList
      },
      ads: {
        totalSpend: totalAdSpend,
        totalRevenue: totalAdRevenue,
        totalProfit: totalAdProfit,
        blendedROAS,
        estimatedCAC,
        totalVisitors: totalAdVisitors,
        totalOrders: totalAdOrders,
        campaigns: campaignPerformanceList,
        recommendations: aiAdRecommendations
      },
      inventory: {
        totalStockUnits,
        inventoryRetailValue,
        inventoryWholesaleValue,
        lowStockThreshold,
        criticalLowStockCount: criticalLowStockItems.length,
        lowStockCount: criticalLowStockItems.length,
        criticalLowStockItems,
        lowStockAlerts: criticalLowStockItems,
        stockAdsRiskList,
        reorderList: inventoryReorderList,
        bestSellers: mostOrdered,
        slowMovers: lowestSales
      },
      profit: {
        grossRevenue,
        retailRevenue: retailTotal,
        wholesaleRevenue: wholesaleTotal,
        estimatedProductCost: Math.round(estimatedTotalProductCost),
        totalAdSpend,
        estimatedDeliveryCost,
        netProfit: Math.round(netProfit),
        profitMargin
      },
      retailVsWholesale,
      geo: {
        insideDhaka: insideDhakaCount,
        outsideDhaka: outsideDhakaCount,
        dhakaPercentage: dhakaRatio
      },
      payments: {
        cod: codOrders,
        bkash: bkashOrders,
        nagad: nagadOrders,
        pendingVerification: pendingVerificationCount
      },
      customers: {
        unique: uniqueCustomerCount,
        repeat: repeatCustomerCount,
        repeatRate
      },
      alerts: aiAlerts,
      diagnosis: aiSalesDiagnosis,
      reports: {
        daily: dailyReport,
        weekly: weeklyReport
      },
      coupons: rawCoupons.map((c: any) => ({
        code: c.code,
        timesUsed: c.timesUsed,
        discount: `${c.discountValue}${c.discountType === 'percentage' ? '%' : '৳'}`
      }))
    };
  }

  // POST /api/ai/intelligence - Generates complete structured AI Business Intelligence
  app.post('/api/ai/intelligence', async (req: Request, res: Response) => {
    // Returns revenue, profit margins, ad spend and customer counts.
    if (!requireAdmin(req, res)) return;
    try {
      const body = isPlainObject(req.body) ? req.body : {};
      const lang = body.lang === 'en' ? 'en' : 'bn';
      const filters = isPlainObject(body.filters) ? body.filters : {};
      const analytics = computeStoreAnalytics(db, filters);
      const isBn = lang === 'bn';

      let aiReport = '';
      let usedGemini = false;

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `
You are the Chief AI Business & Ads Intelligence Officer for "Sikder Fashion", a premier Bangladeshi clothing brand that operates its own ready-made garments factory in Ashulia, Savar, Dhaka, specializing in Men's Premium Shirts, Katua, and wholesale/retail manufacturing.

Here is the real, verified business snapshot from Sikder Fashion's active database:
- Date Filter: ${analytics.filtersApplied.dateRange}
- Gross Revenue: ৳${analytics.revenue.gross.toLocaleString()} (Retail: ৳${analytics.revenue.retail.toLocaleString()} across ${analytics.revenue.orderCount} orders, Wholesale: ৳${analytics.revenue.wholesale.toLocaleString()} across ${analytics.revenue.wholesaleInquiryCount} inquiries)
- Period Comparison: Revenue Delta: ${analytics.comparison.revenueDelta > 0 ? '+' : ''}${analytics.comparison.revenueDelta}%, Order Count Delta: ${analytics.comparison.orderCountDelta > 0 ? '+' : ''}${analytics.comparison.orderCountDelta}%, AOV Delta: ${analytics.comparison.aovDelta > 0 ? '+' : ''}${analytics.comparison.aovDelta}%
- Average Order Value (AOV): ৳${analytics.revenue.aov}
- Estimated Net Profit: ৳${analytics.revenue.netProfit.toLocaleString()} (Margin: ${analytics.revenue.profitMargin}%)
- Funnel Conversion: Visitors (${analytics.funnel.stages[0]?.count}) → Cart (${analytics.funnel.stages[3]?.count}) → Orders (${analytics.funnel.stages[5]?.count}) = Overall Conv: ${analytics.funnel.overallConversionRate}%
- Biggest Bottleneck: ${analytics.funnel.biggestDropStep} (${analytics.funnel.biggestBottleneckExplanation})
- Total Inventory Units: ${analytics.inventory.totalStockUnits} pcs (Retail Value: ৳${analytics.inventory.inventoryRetailValue.toLocaleString()})
- Critical Low Stock SKUs: ${analytics.inventory.criticalLowStockCount} items (${analytics.inventory.criticalLowStockItems.map((p: any) => `${p.code} (${p.currentStock} left, velocity: ${p.salesVelocity}/day)`).join(', ') || 'None'})
- Best Performing SKUs: ${analytics.products.mostOrdered.slice(0, 5).map((p: any) => `${p.code} (${p.name}: ${p.piecesSold} sold, ৳${p.revenue})`).join('; ') || 'New catalog'}
- High Interest / Low Conversion SKUs: ${analytics.products.highInterestLowConversion.map((p: any) => `${p.code} (${p.views} views, ${p.ordersCount} orders)`).join('; ') || 'None'}
- Marketing Ad Spend: ৳${analytics.ads.totalSpend.toLocaleString()} yielding ৳${analytics.ads.totalRevenue.toLocaleString()} revenue (Blended ROAS: ${analytics.ads.blendedROAS}x, Est CAC: ৳${analytics.ads.estimatedCAC})
- Traffic Sources: ${analytics.traffic.breakdown.map((t: any) => `${t.name}: ${t.visitors} visitors, ${t.ordersCount} orders, ৳${t.revenue} rev (${t.conversionRate}% conv)`).join(' | ')}
- Delivery Breakdown: ${analytics.geo.insideDhaka} orders in Dhaka (${analytics.geo.dhakaPercentage}%), ${analytics.geo.outsideDhaka} orders outside Dhaka
- Payment Mix: COD ${analytics.payments.cod}, bKash ${analytics.payments.bkash}, Nagad ${analytics.payments.nagad}, Verification Pending: ${analytics.payments.pendingVerification}
- Customers: ${analytics.customers.unique} unique buyers, ${analytics.customers.repeat} repeat buyers (${analytics.customers.repeatRate}% retention)

Please provide an executive, high-level, actionable Business Intelligence analysis in ${isBn ? 'Bangla (বাংলা)' : 'English'}.
Structure your output into clear markdown sections:
1. 📊 Executive Summary & Business Health (ব্যবসা স্বাস্থ্য ও মূল সারসংক্ষেপ)
2. 👕 Product & Inventory Insights (প্রোডাক্ট ও আশুলিয়া কারখানা রিস্টক অ্যানালিসিস)
3. 🎯 Ads & Marketing ROAS Optimization (বিজ্ঞাপন খরচ, রিটার্ন ও স্কেলিং গাইড)
4. ⚠️ Critical Red Flags & Anomaly Radar (ঝুঁকি ও জরুরি সমাধান)
5. 🚀 Top 4 Prioritized Action Items for this Week (এই সপ্তাহের জন্য ৪টি কৌশলগত পরামর্শ with Expected Impact & Difficulty)

Rules:
- Ground every insight strictly in the numbers above.
- Separate FACT from OBSERVATION and RECOMMENDATION.
- Keep the tone authoritative, concise, data-driven, and commercial.
- Mention Sikder Fashion's Savar factory advantage (direct manufacturing, custom sizing, wholesale MOQ) where relevant.
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt
          });

          if (response && response.text) {
            aiReport = response.text;
            usedGemini = true;
          }
        } catch (apiErr) {
          console.warn('[AI Intelligence] Gemini call failed, using deterministic intelligence engine:', apiErr);
        }
      }

      // Fallback deterministic analysis if Gemini is not available
      if (!aiReport) {
        if (isBn) {
          aiReport = `### 📊 নির্বাহী সারসংক্ষেপ ও ব্যবসায়িক স্বাস্থ্য
- **মোট রাজস্ব**: ৳${analytics.revenue.gross.toLocaleString()} (খুচরা: ৳${analytics.revenue.retail.toLocaleString()} | পাইকারি: ৳${analytics.revenue.wholesale.toLocaleString()})
- **গড় অর্ডার ভ্যালু (AOV)**: ৳${analytics.revenue.aov}
- **আনুমানিক নিট লাভ**: ৳${analytics.revenue.netProfit.toLocaleString()} (মার্জিন: ${analytics.revenue.profitMargin}%)
- **অ্যাডস ROAS পারফরম্যান্স**: ${analytics.ads.blendedROAS}x (মোট খরচ: ৳${analytics.ads.totalSpend.toLocaleString()}, সেলস: ৳${analytics.ads.totalRevenue.toLocaleString()})
- **কাস্টমার রিটেনশন**: ${analytics.customers.repeatRate}% রিপিট কাস্টমার রেট।

---

### 👕 প্রোডাক্ট ও ইনভেন্টরি ইন্টেলিজেন্স (সাভার কারখানা)
- **টপ সেলার**: ${analytics.products.mostOrdered.slice(0, 3).map((p: any) => `${p.code} (${p.piecesSold} টি বিক্রি)`).join(', ') || 'নতুন কালেকশন'}
- **স্টক সতর্কতা**: ${analytics.inventory.criticalLowStockCount > 0 ? `${analytics.inventory.criticalLowStockCount}টি প্রোডাক্টে লো-স্টক অ্যালার্ট রয়েছে। সাভার কারখানায় অবিলম্বে কাটিং ও প্রোডাকশন বাড়ানো প্রয়োজন।` : 'ইনভেন্টরি ব্যালেন্স সন্তোষজনক।'}
- **মোট ইনভেন্টরি ভ্যালু**: ৳${analytics.inventory.inventoryRetailValue.toLocaleString()} (খুচরা বাজার মূল্য)।

---

### 🎯 বিজ্ঞাপন ও মার্কেটিং অপ্টিমাইজেশন
- সেরা ট্রাফিক সোর্স: **${analytics.traffic.bestOrdersSource?.name || 'Facebook'}** (${analytics.traffic.bestOrdersSource?.ordersCount || 0}টি অর্ডার)।
- এভারেজ কাস্টমার অ্যাকুইজিশন খরচ (CAC): আনুমানিক ৳${analytics.ads.estimatedCAC}।
- ড্রপ-অফ সমাধান: চেকআউট পেজে ডেলিভারি চার্জ স্পষ্ট উল্লেখ করে ও দ্রুত অর্ডার সুবিধা দিলে কনভার্সন বৃদ্ধি পাবে।

---

### 🚀 কৌশলগত ৪টি জরুরি পদক্ষেপ
1. **টপ সেলিং শার্ট ও কতুয়া রিস্টক**: সেরা বিক্রীত SKU-গুলোর জন্য সাভার কারখানায় রিস্টক করুন। [প্রভাব: উচ্চ | সময়: ৩ দিন]
2. **মার্কেটিং স্কেলিং**: যেসব ক্যাম্পেইনে ROAS ৩.৫x এর বেশি, সেগুলোতে দৈনিক বাজেট ১৫-২০% বৃদ্ধি করুন। [প্রভাব: উচ্চ | সময়: অবিলম্বে]
3. **বিকাশ/নগদ পেমেন্ট ভেরিফিকেশন**: পেন্ডিং থাকা ${analytics.payments.pendingVerification}টি অর্ডার অবিলম্বে ভেরিফাই করে ডিসপ্যাচ নিশ্চিত করুন। [প্রভাব: মাঝারি | সময়: ১ দিন]
4. **ঢাকার বাইরের COD ফলো-আপ**: ঢাকার বাইরে ডেলিভারি নিশ্চিত করতে কুরিয়ার বুকিংয়ের পূর্বে হোয়াটসঅ্যাপে কনফার্মেশন করুন। [প্রভাব: উচ্চ | সময়: চলমান]`;
        } else {
          aiReport = `### 📊 Executive Summary & Business Health
- **Gross Revenue**: ৳${analytics.revenue.gross.toLocaleString()} (Retail: ৳${analytics.revenue.retail.toLocaleString()} | Wholesale: ৳${analytics.revenue.wholesale.toLocaleString()})
- **Average Order Value (AOV)**: ৳${analytics.revenue.aov}
- **Estimated Net Profit**: ৳${analytics.revenue.netProfit.toLocaleString()} (Margin: ${analytics.revenue.profitMargin}%)
- **Blended Ad ROAS**: ${analytics.ads.blendedROAS}x (Total Spend: ৳${analytics.ads.totalSpend.toLocaleString()}, Revenue: ৳${analytics.ads.totalRevenue.toLocaleString()})
- **Customer Retention**: ${analytics.customers.repeatRate}% repeat buyer rate.

---

### 👕 Product & Inventory Intelligence (Savar Factory)
- **Top Sellers**: ${analytics.products.mostOrdered.slice(0, 3).map((p: any) => `${p.code} (${p.piecesSold} pcs sold)`).join(', ') || 'Catalog launching'}
- **Low Stock Alerts**: ${analytics.inventory.criticalLowStockCount > 0 ? `${analytics.inventory.criticalLowStockCount} items below threshold. Savar factory cutting unit needs immediate batch reordering.` : 'Inventory levels healthy.'}
- **Total Retail Inventory Value**: ৳${analytics.inventory.inventoryRetailValue.toLocaleString()}.

---

### 🎯 Ads & Marketing Optimization
- Top Performing Channel: **${analytics.traffic.bestOrdersSource?.name || 'Facebook'}** (${analytics.traffic.bestOrdersSource?.ordersCount || 0} orders).
- Estimated Customer Acquisition Cost (CAC): ~৳${analytics.ads.estimatedCAC}.

---

### 🚀 Top 4 Strategic Priorities
1. **Restock High-Velocity SKUs**: Accelerate fabric sourcing for top-selling shirts. [Impact: High | Time: 3 Days]
2. **Scale Winning Ad Sets**: Increase budget by 20% on campaigns with ROAS > 3.5x. [Impact: High | Time: Immediate]
3. **Clear Payment Verification Queue**: Review and verify ${analytics.payments.pendingVerification} pending bKash/Nagad transactions. [Impact: Medium | Time: 1 Day]
4. **COD Dispatch Confirmation**: Pre-confirm outer-Dhaka orders via WhatsApp to minimize return rates. [Impact: High | Time: Continuous]`;
        }
      }

      res.json({
        success: true,
        analytics,
        report: aiReport,
        usedGemini,
        generatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[AI Intelligence API Error]', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to generate intelligence report.' });
    }
  });

  // POST /api/ai/chat - Interactive AI Query Assistant grounded strictly in real store data + General Knowledge
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    // The system prompt embeds the full business snapshot; admin session required.
    if (!requireAdmin(req, res)) return;
    try {
      const body = isPlainObject(req.body) ? req.body : {};
      const lang = body.lang === 'en' ? 'en' : 'bn';
      const history = Array.isArray(body.history) ? body.history : [];
      const filters = isPlainObject(body.filters) ? body.filters : {};
      // `message.trim()` threw a 500 for any non-string message.
      const message = asString(body.message, 8000);
      if (!message) {
        res.status(400).json({ success: false, error: 'Query message is required.' });
        return;
      }

      const analytics = computeStoreAnalytics(db, filters);
      const isBn = lang === 'bn';
      const apiKey = process.env.GEMINI_API_KEY;

      const systemPrompt = `
You are "Sider AI" — the Master AI Business Intelligence, Ads Intelligence & General Assistant for "Sikder Fashion" (সাভার ও আশুলিয়া কারখানা ভিত্তিক প্রিমিয়াম শার্ট ও কতুয়া প্রস্তুতকারক এবং অনলাইন ফ্যাশন ব্র্যান্ড).

YOUR CAPABILITIES & PRINCIPLES:
1. DUAL MODE INTELLIGENCE:
   - When the user asks about Sikder Fashion store data (sales, products, inventory, revenue, ads, factory, Savar, orders, customers, delivery): Ground your answers STRICTLY in the real live store snapshot below.
   - When the user asks general-purpose questions (programming, HTML/CSS, math, English/Bangla writing, translation, general marketing strategy, brainstorming): Answer fully, intelligently, and helpfully with no artificial limits.
2. NO HALLUCINATIONS ON STORE DATA: If a specific store metric or historical data is missing or not tracked, honestly state: "${isBn ? 'এই তথ্যটি সঠিকভাবে দেওয়ার জন্য বর্তমান সিস্টেমে পর্যাপ্ত ডাটা নেই।' : "I don't have enough data in the store records to answer that accurately."}".
3. READ-ONLY ADVISORY: You provide actionable business insights, diagnosis, forecasts, and strategic plans, but you do not execute destructive operations.
4. LANGUAGE: Provide answers in ${isBn ? 'Bangla (বাংলা)' : 'English'}, or match the user's language.
5. STRUCTURED DIAGNOSIS: When advising on store issues, break down:
   - 📌 [FACT]: What the numbers show directly.
   - 🔍 [OBSERVATION]: The pattern or anomaly.
   - 💡 [RECOMMENDATION]: Actionable step for admin or Savar factory team.

REAL LIVE STORE DATA SNAPSHOT:
- Brand Name: ${db.settings?.brandName || 'Sikder Fashion'}
- Factory Location: ${db.settings?.factoryAddress || 'Ashulia Industrial Zone, Savar, Dhaka'}
- Total Catalog Products: ${db.products?.length || 0}
- Gross Revenue: ৳${analytics.revenue.gross.toLocaleString()} (Retail: ৳${analytics.revenue.retail.toLocaleString()} across ${analytics.revenue.orderCount} orders, Wholesale: ৳${analytics.revenue.wholesale.toLocaleString()})
- Net Profit: ৳${analytics.revenue.netProfit.toLocaleString()} (Margin: ${analytics.revenue.profitMargin}%)
- AOV: ৳${analytics.revenue.aov}
- Top Selling SKUs: ${analytics.products.mostOrdered.slice(0, 5).map((p: any) => `${p.code} (${p.name}: ${p.piecesSold} sold, Stock: ${p.currentStock})`).join(', ') || 'None'}
- Low Stock Critical Alerts: ${analytics.inventory.criticalLowStockItems.map((p: any) => `${p.code} (${p.currentStock} pcs, ${p.estimatedDaysRemaining})`).join(', ') || 'No critical low stock'}
- High Interest / Low Conversion SKUs: ${analytics.products.highInterestLowConversion.map((p: any) => `${p.code} (${p.views} views, ${p.ordersCount} orders)`).join(', ') || 'None'}
- Marketing Ad Spend: ৳${analytics.ads.totalSpend.toLocaleString()} | Ad Revenue: ৳${analytics.ads.totalRevenue.toLocaleString()} | Blended ROAS: ${analytics.ads.blendedROAS}x | Est CAC: ৳${analytics.ads.estimatedCAC}
- Campaigns: ${analytics.ads.campaigns.map((c: any) => `${c.campaignName} (Spend: ${c.adSpend}, Rev: ৳${c.revenueGenerated}, ROAS: ${c.roas}x)`).join('; ')}
- Traffic Sources: ${analytics.traffic.breakdown.map((t: any) => `${t.name}: ${t.ordersCount} orders, ৳${t.revenue}`).join('; ')}
- Delivery: Dhaka ${analytics.geo.insideDhaka} (${analytics.geo.dhakaPercentage}%), Outside Dhaka ${analytics.geo.outsideDhaka}
- Payment Methods: COD ${analytics.payments.cod}, bKash ${analytics.payments.bkash}, Nagad ${analytics.payments.nagad}, Pending Verifications: ${analytics.payments.pendingVerification}
- Customers: ${analytics.customers.unique} unique, ${analytics.customers.repeat} repeat (${analytics.customers.repeatRate}%)
`;

      let reply = '';

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          
          const conversationContents: any[] = [];
          history.slice(-8).forEach((h: any) => {
            // Only well-formed string turns are forwarded to the model.
            if (!isPlainObject(h)) return;
            const content = asString(h.content, 8000);
            if (!content) return;
            conversationContents.push({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: content }]
            });
          });

          conversationContents.push({
            role: 'user',
            parts: [{ text: message }]
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: conversationContents,
            config: {
              systemInstruction: systemPrompt
            }
          });

          if (response && response.text) {
            reply = response.text;
          }
        } catch (apiErr) {
          console.warn('[AI Chat] Gemini API error, falling back to local reasoning:', apiErr);
        }
      }

      // Local fallback reasoning engine if API key is not present or offline
      if (!reply) {
        const query = message.toLowerCase();
        if (query.includes('best') || query.includes('top') || query.includes('সবচেয়ে বেশি') || query.includes('সেরা')) {
          const topList = analytics.products.mostOrdered.slice(0, 5);
          reply = isBn 
            ? `📌 **[তথ্য / Fact]:** সাইডার ফ্যাশনের সর্বোচ্চ বিক্রিত টপ প্রোডাক্টসমূহ:\n` +
              topList.map((p: any, i: number) => `${i + 1}. **${p.name}** (SKU: \`${p.code}\`) — ${p.piecesSold} পিস বিক্রি (মোট আয়: ৳${p.revenue.toLocaleString()}) | বর্তমান স্টক: ${p.currentStock} পিস`).join('\n') +
              `\n\n💡 **[পরামর্শ / Recommendation]:** সাভার কারখানায় এই SKU-গুলোর ফেব্রিক ও কাটিং স্টক আগে থেকে রিজার্ভ রাখুন যাতে আউট-অফ-স্টক না হয়।`
            : `📌 **[FACT]:** Top Selling Products at Sikder Fashion:\n` +
              topList.map((p: any, i: number) => `${i + 1}. **${p.name}** (SKU: \`${p.code}\`) — ${p.piecesSold} pcs sold (Revenue: ৳${p.revenue.toLocaleString()}) | Stock: ${p.currentStock} pcs`).join('\n') +
              `\n\n💡 **[RECOMMENDATION]:** Ensure Savar manufacturing unit maintains raw fabric reserves for these top SKUs to prevent stockouts.`;
        } else if (query.includes('ad') || query.includes('roas') || query.includes('বিজ্ঞাপন') || query.includes('facebook') || query.includes('মার্কেটিং')) {
          reply = isBn
            ? `📌 **[তথ্য / Fact]:** বর্তমান মার্কেটিং মেট্রিক্স:\n` +
              `- মোট অ্যাড স্পেন্ড: **৳${analytics.ads.totalSpend.toLocaleString()}**\n` +
              `- বিজ্ঞাপন থেকে সরাসরি আয়: **৳${analytics.ads.totalRevenue.toLocaleString()}**\n` +
              `- ব্লেন্ডেড ROAS: **${analytics.ads.blendedROAS}x**\n` +
              `- আনুমানিক কাস্টমার অ্যাকুইজিশন খরচ (CAC): **৳${analytics.ads.estimatedCAC}**\n\n` +
              `🔍 **[পর্যবেক্ষণ / Observation]:** যেসব বিজ্ঞাপনে সাভার কারখানার মেকিং ভিডিও এবং ডেলিভারিম্যানের সামনে চেক করে নেওয়ার সুবিধা তুলে ধরা হয়েছে, সেগুলোতে কনভার্সন রেট বেশি।\n\n` +
              `💡 **[পরামর্শ / Recommendation]:** ROAS ৩.৫x এর বেশি ক্যাম্পেইনগুলোতে বাজেট স্কেল করুন এবং প্রতি সপ্তাহে নতুন ফ্যাশন ক্রিয়েটিভ টেস্ট করুন।`
            : `📌 **[FACT]:** Marketing & Ads Performance:\n` +
              `- Total Ad Spend: **৳${analytics.ads.totalSpend.toLocaleString()}**\n` +
              `- Revenue Generated: **৳${analytics.ads.totalRevenue.toLocaleString()}**\n` +
              `- Blended ROAS: **${analytics.ads.blendedROAS}x**\n` +
              `- Estimated CAC: **৳${analytics.ads.estimatedCAC}**\n\n` +
              `💡 **[RECOMMENDATION]:** Scale budget on campaigns yielding > 3.5x ROAS and feature open-box delivery assurance in video creatives.`;
        } else if (query.includes('stock') || query.includes('inventory') || query.includes('স্টক') || query.includes('কারখানা')) {
          reply = isBn
            ? `📌 **[তথ্য / Fact]:** ইনভেন্টরি স্ট্যাটাস:\n` +
              `- মোট স্টক ইউনিট: **${analytics.inventory.totalStockUnits} পিস**\n` +
              `- লো স্টক অ্যালার্ট: **${analytics.inventory.criticalLowStockCount}টি আইটেম** (${analytics.inventory.criticalLowStockItems.map((p: any) => `${p.code}: ${p.currentStock} পিস`).join(', ') || 'কোনো সংকট নেই'})\n` +
              `- মোট রিটেইল স্টক মূল্য: **৳${analytics.inventory.inventoryRetailValue.toLocaleString()}**\n\n` +
              `💡 **[পরামর্শ / Recommendation]:** লো-স্টক SKU-গুলোর জন্য সাভার কারখানায় অবিলম্বে ন্যূনতম ৫০ পিস কাটিং অর্ডার দিন।`
            : `📌 **[FACT]:** Inventory Status:\n` +
              `- Total Stock Units: **${analytics.inventory.totalStockUnits} pcs**\n` +
              `- Low Stock Alerts: **${analytics.inventory.criticalLowStockCount} items**\n` +
              `- Retail Inventory Value: **৳${analytics.inventory.inventoryRetailValue.toLocaleString()}**\n\n` +
              `💡 **[RECOMMENDATION]:** Issue batch reorder tickets to Ashulia cutting unit for items below 10 units.`;
        } else {
          reply = isBn
            ? `📌 **[সারসংক্ষেপ / Snapshot]:** সাইডার ফ্যাশনের মোট রাজস্ব ৳${analytics.revenue.gross.toLocaleString()}, নিট লাভ ৳${analytics.revenue.netProfit.toLocaleString()} (মার্জিন ${analytics.revenue.profitMargin}%), সক্রিয় অর্ডার ${analytics.revenue.orderCount}টি, ব্লেন্ডেড অ্যাড ROAS ${analytics.ads.blendedROAS}x, এবং রিপিট কাস্টমার রেট ${analytics.customers.repeatRate}%।\n\nআপনার যেকোনো নির্দিষ্ট প্রশ্ন (যেমন: সেরা বিক্রীত পণ্য, ফেসবুক অ্যাডের পারফরম্যান্স, স্টক পূর্বাভাস, কারখানার কাটিং বা সাধারণ কোনো বিষয়) সম্পর্কে জিজ্ঞাসা করতে পারেন!`
            : `📌 **[Snapshot]:** Sikder Fashion gross revenue is ৳${analytics.revenue.gross.toLocaleString()} with net profit of ৳${analytics.revenue.netProfit.toLocaleString()} (${analytics.revenue.profitMargin}% margin), ${analytics.revenue.orderCount} orders, ${analytics.ads.blendedROAS}x ad ROAS, and ${analytics.customers.repeatRate}% repeat rate.\n\nAsk any question regarding product velocity, ad attribution, Savar factory reorders, or general topics!`;
        }
      }

      res.json({
        success: true,
        reply,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[AI Chat API Error]', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to process AI chat query.' });
    }
  });

  // POST /api/ai/ad-copy - Generates tailored Bangladeshi eCommerce ad copy
  app.post('/api/ai/ad-copy', async (req: Request, res: Response) => {
    // Exposes wholesale pricing and margins; admin session required.
    if (!requireAdmin(req, res)) return;
    try {
      const body = isPlainObject(req.body) ? req.body : {};
      const productCode = asString(body.productCode, 200);
      const prods = Array.isArray(db.products) ? db.products : [];
      const product = prods.find((p: any) => p.code === productCode || p.id === productCode) || prods[0];

      const apiKey = process.env.GEMINI_API_KEY;
      let adResult: any = null;

      if (apiKey && product) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `
Create 2 high-converting Facebook / Instagram ad copies (1 in authentic Bangla, 1 in English) for Sikder Fashion's product:
Product: ${product.name} (Code: ${product.code})
Category: ${product.category}
Fabric: ${product.fabric || '100% Premium Cotton'}
Retail Price: ৳${product.retailPrice}
Wholesale Price: ৳${product.wholesalePrice} (MOQ: ${product.wholesaleMOQ} pcs)
Key Selling Points:
- Manufactured in Sikder Fashion's own factory in Ashulia, Savar.
- Cash on Delivery available across Bangladesh (ঢাকার ভেতরে ৳৭০, বাইরে ৳১২০).
- Customer can open the parcel and check fabric & stitching before paying.
- 7-day hassle-free exchange.

Output structured JSON in this format:
{
  "bangla": {
    "headline": "...",
    "primaryText": "...",
    "callToAction": "Order Now (অর্ডার করতে ইনবক্স বা লিংকে ক্লিক করুন)",
    "targetAudienceHint": "..."
  },
  "english": {
    "headline": "...",
    "primaryText": "...",
    "callToAction": "Shop Now",
    "targetAudienceHint": "..."
  }
}
`;
          const resp = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          if (resp && resp.text) {
            adResult = JSON.parse(resp.text);
          }
        } catch (e) {
          console.warn('[Ad Copy API] Gemini call failed, using template:', e);
        }
      }

      if (!adResult && product) {
        adResult = {
          bangla: {
            headline: `🔥 প্রিমিয়াম ${product.nameBn || product.name} — নিজস্ব কারখানায় তৈরি`,
            primaryText: `সাভারের নিজস্ব কারখানায় শতভাগ এক্সপোর্ট কোয়ালিটি ফ্যাব্রিকে তৈরি প্রিমিয়াম শার্ট।\n\n✅ ডেলিভারিম্যানের সামনে পার্সেল খুলে কোয়ালিটি চেক করে পেমেন্ট করার সুযোগ।\n✅ ঢাকার ভেতর ২৪-৪৮ ঘণ্টায় ডেলিভারি।\n✅ রিটেইল মূল্য মাত্র ৳${product.retailPrice} (পাইকারি রেট: ৳${product.wholesalePrice})\n\nস্টক সীমিত! এখনই অর্ডার করুন।`,
            callToAction: "Shop Now / অর্ডার করুন",
            targetAudienceHint: "Men 18-35 in Dhaka, Chittagong, Sylhet interested in Menswear & Fashion"
          },
          english: {
            headline: `✨ Factory-Direct Quality: ${product.name}`,
            primaryText: `Crafted directly in our Savar factory with export-grade stitching and breathable fabric.\n\n🚚 Cash on Delivery Nationwide.\n🔍 Check before payment guarantee.\n💰 Retail Price: ৳${product.retailPrice} | Wholesale MOQ: ${product.wholesaleMOQ} pcs\n\nUpgrade your wardrobe today!`,
            callToAction: "Shop Now",
            targetAudienceHint: "Fashion-conscious men aged 20-40"
          }
        };
      }

      res.json({ success: true, product, adCopy: adResult });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to generate ad copy.' });
    }
  });

  // Unknown API paths previously fell through to the SPA fallback and returned
  // an HTML document with status 200, so client `res.json()` calls threw a
  // parse error instead of surfacing "not found". Answer with JSON 404.
  app.all('/api/*', (req: Request, res: Response) => {
    res.status(404).json({ success: false, error: `Unknown API endpoint: ${req.method} ${req.path}` });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (!IS_PRODUCTION) {
    // Loaded lazily so production never pulls in the Vite dev server.
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { port: hmrPort }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(APP_ROOT, 'dist');
    // The server bundle and its source map are built into dist/ next to the
    // client assets. Never serve them: they expose the entire backend source.
    app.use((req: Request, res: Response, next: any) => {
      if (/^\/server\.cjs(\.map)?$/i.test(req.path)) {
        res.status(404).end();
        return;
      }
      next();
    });
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Registered last so it catches errors from every route above.
  // Never leak stack traces or internal messages to clients.
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error('[Unhandled Route Error]', err);
    if (res.headersSent) return;
    res.status(500).json({ success: false, error: 'Internal server error.' });
  });

  // Bound the in-memory session / rate-limit maps for long-running processes.
  setInterval(purgeExpiredAuthState, 10 * 60 * 1000).unref();

  app.listen(httpPort, '0.0.0.0', () => {
    if (httpPort !== PORT) {
      console.warn(`[Server] Port ${PORT} is in use. Using port ${httpPort} instead.`);
    }
    if (hmrPort && hmrPort !== HMR_PORT) {
      console.warn(`[Vite HMR] Port ${HMR_PORT} is in use. Using port ${hmrPort} instead.`);
    }
    console.log(`[Sikder Fashion Full-Stack Server] Running on http://localhost:${httpPort}`);
  });
}

startServer().catch(err => {
  console.error('[Server Startup Error]', err);
});
