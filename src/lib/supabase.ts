import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 'https://ojhwesigpdhpfptkzntl.supabase.co';
export const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHdlc2lncGRocGZwdGt6bnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjczNzQsImV4cCI6MjEwMzUwMzM3NH0.g0RUSM-1I8e-R0Ou7gUOoyGt6zBJqGKHbYdefKAvcAI';

export const SUPABASE_PROJECT_ID = 'ojhwesigpdhpfptkzntl';
export const SUPABASE_PROJECT_NAME = "abirhosensaon-crypto's project";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

export interface SupabaseStatusResponse {
  connected: boolean;
  tableReady?: boolean;
  projectId: string;
  projectName: string;
  url: string;
  latencyMs: number;
  lastSync: string | null;
  status: string;
  error?: string;
}

export async function fetchSupabaseStatus(): Promise<SupabaseStatusResponse> {
  try {
    const res = await fetch('/api/supabase/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e: any) {
    console.warn('Failed to fetch backend Supabase status:', e);
  }
  return {
    connected: false,
    projectId: SUPABASE_PROJECT_ID,
    projectName: SUPABASE_PROJECT_NAME,
    url: SUPABASE_URL,
    latencyMs: 0,
    lastSync: null,
    status: 'Unavailable'
  };
}

export async function triggerSupabaseManualSync(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/supabase/sync-now', { method: 'POST' });
    return await res.json();
  } catch (e: any) {
    return { success: false, message: e.message || 'Sync failed' };
  }
}
