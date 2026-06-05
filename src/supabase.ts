/**
 * ===== إعدادات Supabase =====
 *
 * لربط الموقع بـ Supabase:
 * 1. اذهب إلى https://supabase.com وأنشئ حساباً
 * 2. أنشئ مشروعاً جديداً
 * 3. من Settings > API، انسخ:
 *    - Project URL → VITE_SUPABASE_URL
 *    - anon/public key → VITE_SUPABASE_ANON_KEY
 * 4. ضع القيم في ملف .env
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured =
  supabaseUrl !== '' && supabaseAnonKey !== '' &&
  supabaseUrl !== 'YOUR_SUPABASE_URL';

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

export default supabase;
