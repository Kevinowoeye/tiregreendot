/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import {
  Profile,
  Account,
  Transaction,
  Transfer,
  Beneficiary,
  DebitCard,
  Loan,
  Notification,
  SupportTicket,
  AuditLog,
  AppSettings,
  BillPayment,
  MobileRecharge,
  Announcement,
  EmailLog,
} from '../types';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ucyglwcuuabobeeomfde.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_8HK6rNTnqarhLuxVkzU5bA_-o-dZNDj';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder') &&
  !SUPABASE_ANON_KEY.includes('placeholder')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Complete PostgreSQL Database Schema TypeScript Definitions for Supabase
 */
export interface DatabaseSchema {
  profiles: Profile;
  accounts: Account;
  transactions: Transaction;
  transfers: Transfer;
  beneficiaries: Beneficiary;
  debit_cards: DebitCard;
  loans: Loan;
  notifications: Notification;
  support_tickets: SupportTicket;
  audit_logs: AuditLog;
  app_settings: AppSettings;
  bill_payments: BillPayment;
  mobile_recharges: MobileRecharge;
  announcements: Announcement;
  email_logs: EmailLog;
}

/**
 * Supabase Data Access Helper for Greendot Bank
 */
export const supabaseDb = {
  async getTable<T>(tableName: keyof DatabaseSchema): Promise<T[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from(tableName as string).select('*');
      if (error) throw error;
      return (data as T[]) || [];
    } catch (err) {
      console.error(`Error fetching table ${tableName} from Supabase:`, err);
      return [];
    }
  },

  async upsertRecord<T>(tableName: keyof DatabaseSchema, record: Partial<T>): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from(tableName as string).upsert(record as any);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error upserting into ${tableName}:`, err);
      return false;
    }
  },

  async deleteRecord(tableName: keyof DatabaseSchema, idColumn: string, idValue: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from(tableName as string).delete().eq(idColumn, idValue);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      return false;
    }
  }
};

/**
 * Helper to fetch or synchronize current session user from Supabase auth or fallback state
 */
export async function getSupabaseAuthUser(): Promise<any | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
  } catch (err) {
    console.warn('Supabase auth session check failed:', err);
    return null;
  }
}
