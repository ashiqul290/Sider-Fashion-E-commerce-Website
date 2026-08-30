import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration: uses environment variables if set, otherwise defaults to provided credentials
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ojhwesigpdhpfptkzntl.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHdlc2lncGRocGZwdGt6bnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjczNzQsImV4cCI6MjEwMzUwMzM3NH0.g0RUSM-1I8e-R0Ou7gUOoyGt6zBJqGKHbYdefKAvcAI';
export const SUPABASE_PROJECT_ID = 'ojhwesigpdhpfptkzntl';
export const SUPABASE_PROJECT_NAME = "abirhosensaon-crypto's project";

let supabaseClient: SupabaseClient | null = null;
let lastSyncTimestamp: string | null = null;
let lastSyncStatus: 'success' | 'failed' | 'idle' | 'syncing' = 'idle';
let lastSyncError: string | null = null;
let isConnected = false;

/**
 * Get or initialize the Supabase client
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log(`[Supabase] Client initialized for project ${SUPABASE_PROJECT_ID} (${SUPABASE_URL})`);
  }
  return supabaseClient;
}

/**
 * Helper to identify if table is not yet created in Supabase database or schema cache
 */
function isTableNotFoundOrSchemaPending(error: any): boolean {
  if (!error) return false;
  const code = String(error.code || '');
  const msg = String(error.message || '').toLowerCase();
  return (
    code === 'PGRST205' ||
    code === 'PGRST204' ||
    code === 'PGRST116' ||
    code === '42P01' ||
    msg.includes('schema cache') ||
    msg.includes('could not find the table') ||
    msg.includes('does not exist')
  );
}

/**
 * Health and connectivity test to Supabase
 */
export async function testSupabaseHealth(): Promise<{
  connected: boolean;
  tableReady: boolean;
  projectId: string;
  projectName: string;
  url: string;
  latencyMs: number;
  lastSync: string | null;
  status: string;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    const client = getSupabase();
    // Test connection with a lightweight check
    const { data, error } = await client
      .from('sider_store_state')
      .select('version, updated_at')
      .limit(1);

    const latencyMs = Date.now() - startTime;
    const tableMissing = isTableNotFoundOrSchemaPending(error);

    isConnected = true;
    return {
      connected: true,
      tableReady: !tableMissing && !error,
      projectId: SUPABASE_PROJECT_ID,
      projectName: SUPABASE_PROJECT_NAME,
      url: SUPABASE_URL,
      latencyMs,
      lastSync: lastSyncTimestamp,
      status: tableMissing
        ? 'Connected to Supabase (Schema SQL pending in Supabase SQL Editor)'
        : 'Connected & Synced with Supabase'
    };
  } catch (err: any) {
    isConnected = false;
    return {
      connected: false,
      tableReady: false,
      projectId: SUPABASE_PROJECT_ID,
      projectName: SUPABASE_PROJECT_NAME,
      url: SUPABASE_URL,
      latencyMs: Date.now() - startTime,
      lastSync: lastSyncTimestamp,
      status: 'Disconnected',
      error: err.message || 'Connection failed'
    };
  }
}

/**
 * Attempts to hydrate database state from Supabase on startup
 */
export async function loadStateFromSupabase(): Promise<any | null> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('sider_store_state')
      .select('state, version, updated_at')
      .eq('id', 'master')
      .single();

    if (error) {
      if (isTableNotFoundOrSchemaPending(error)) {
        // Table hasn't been created yet or row doesn't exist
        console.log('[Supabase Hydrate] Table "sider_store_state" pending in Supabase. Initializing cleanly from local state.');
        return null;
      }
      console.warn('[Supabase Hydrate] Notice fetching remote state:', error.message);
      return null;
    }

    if (data && data.state) {
      lastSyncTimestamp = data.updated_at || new Date().toISOString();
      lastSyncStatus = 'success';
      console.log(`[Supabase Hydrate] Successfully pulled remote state (version: ${data.version}) from Supabase.`);
      return typeof data.state === 'string' ? JSON.parse(data.state) : data.state;
    }
  } catch (err: any) {
    console.warn('[Supabase Hydrate] Safe fallback during load:', err.message);
  }
  return null;
}

// Debounce timer for persisting to Supabase
let persistTimeout: NodeJS.Timeout | null = null;

/**
 * Persists the current database state to Supabase asynchronously
 */
export function persistStateToSupabase(dbState: any): void {
  if (persistTimeout) {
    clearTimeout(persistTimeout);
  }

  persistTimeout = setTimeout(async () => {
    try {
      lastSyncStatus = 'syncing';
      const client = getSupabase();
      const nowIso = new Date().toISOString();
      const version = dbState.version || Date.now();

      // 1. Primary Upsert into sider_store_state table
      const { error: stateError } = await client
        .from('sider_store_state')
        .upsert(
          {
            id: 'master',
            version,
            state: dbState,
            updated_at: nowIso
          },
          { onConflict: 'id' }
        );

      if (stateError) {
        if (isTableNotFoundOrSchemaPending(stateError)) {
          console.log('[Supabase Sync] Notice: Table "sider_store_state" will be populated once SQL Schema is run in Supabase SQL Editor.');
        } else {
          console.warn('[Supabase Sync] Upsert notice:', stateError.message);
        }
      } else {
        lastSyncTimestamp = nowIso;
        lastSyncStatus = 'success';
        lastSyncError = null;
        console.log(`[Supabase Sync] Successfully persisted store state (v${version}) to Supabase.`);
      }

      // 2. Granular sync for Orders (if table exists)
      if (Array.isArray(dbState.orders) && dbState.orders.length > 0) {
        try {
          const ordersToSync = dbState.orders.slice(0, 50).map((o: any) => ({
            id: o.orderId || o.id,
            order_id: o.orderId || o.id,
            customer_name: o.customerName,
            phone: o.phone,
            district: o.district,
            total: o.total,
            payment_method: o.paymentMethod,
            payment_status: o.paymentStatus,
            order_status: o.orderStatus || o.status,
            created_at: o.createdAt || nowIso,
            raw_data: o
          }));

          await client
            .from('sider_orders')
            .upsert(ordersToSync, { onConflict: 'id' });
        } catch {
          // ignore granular sync error if table does not exist
        }
      }

      // 3. Granular sync for Wholesale Inquiries (if table exists)
      if (Array.isArray(dbState.wholesaleInquiries) && dbState.wholesaleInquiries.length > 0) {
        try {
          const wsToSync = dbState.wholesaleInquiries.slice(0, 50).map((w: any) => ({
            id: w.id,
            customer_name: w.customerName,
            business_name: w.businessName,
            phone: w.phone,
            product_code: w.productCode,
            quantity: w.targetQuantity || w.quantity,
            estimated_total: w.totalEstimatedAmount || w.estimatedTotal,
            order_status: w.orderStatus || w.status,
            created_at: w.createdAt || nowIso,
            raw_data: w
          }));

          await client
            .from('sider_wholesale_inquiries')
            .upsert(wsToSync, { onConflict: 'id' });
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      lastSyncStatus = 'failed';
      lastSyncError = err.message;
      console.warn('[Supabase Sync] Error during async sync:', err.message);
    }
  }, 800);
}

/**
 * Returns complete PostgreSQL SQL script for Supabase SQL Editor
 */
export function getSupabaseSQLSchema(): string {
  return `-- ==========================================
-- SIDER FASHION - SUPABASE DATABASE SCHEMA
-- Project ID: ojhwesigpdhpfptkzntl
-- Project Name: abirhosensaon-crypto's project
-- ==========================================

-- 1. Master State & Configuration Store Table
CREATE TABLE IF NOT EXISTS public.sider_store_state (
  id VARCHAR(64) PRIMARY KEY,
  version BIGINT NOT NULL,
  state JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Retail & Wholesale Orders Table
CREATE TABLE IF NOT EXISTS public.sider_orders (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) UNIQUE,
  customer_name TEXT,
  phone VARCHAR(32),
  district VARCHAR(64),
  total NUMERIC,
  payment_method VARCHAR(32),
  payment_status VARCHAR(32),
  order_status VARCHAR(32),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  raw_data JSONB
);

-- 3. Wholesale & B2B Inquiries Table
CREATE TABLE IF NOT EXISTS public.sider_wholesale_inquiries (
  id VARCHAR(64) PRIMARY KEY,
  customer_name TEXT,
  business_name TEXT,
  phone VARCHAR(32),
  product_code VARCHAR(64),
  quantity INT,
  estimated_total NUMERIC,
  order_status VARCHAR(32),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  raw_data JSONB
);

-- 4. Enable Row Level Security (RLS) & Policies for public read/write via anon key
ALTER TABLE public.sider_store_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sider_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sider_wholesale_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anon key full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sider_store_state' AND policyname = 'Anon All Access State'
  ) THEN
    CREATE POLICY "Anon All Access State" ON public.sider_store_state FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sider_orders' AND policyname = 'Anon All Access Orders'
  ) THEN
    CREATE POLICY "Anon All Access Orders" ON public.sider_orders FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sider_wholesale_inquiries' AND policyname = 'Anon All Access WS'
  ) THEN
    CREATE POLICY "Anon All Access WS" ON public.sider_wholesale_inquiries FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;
}
