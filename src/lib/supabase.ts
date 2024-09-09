import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
//import { Database } from '@/database.types';
import { AppState } from 'react-native'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = 'https://ymutynvqptxvymukzvve.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltdXR5bnZxcHR4dnltdWt6dnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NDk0NDUsImV4cCI6MjA0MTAyNTQ0NX0.auWX_4CnfqE5_BELI7iXdyxj3CNKOiG1ockw9EILxII';

console.log(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})