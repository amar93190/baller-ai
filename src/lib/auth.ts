import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import { supabase } from '@/lib/supabase';

export type Account = { id: string; email: string; name: string };
export type Result<T = void> = { ok: true; value: T } | { ok: false; error: string };

/**
 * Comptes joueurs.
 * - Mode « cloud » : Supabase Auth, dès que EXPO_PUBLIC_SUPABASE_URL et la clé sont renseignées.
 * - Mode « local » : comptes stockés sur le téléphone (mot de passe haché), pour développer
 *   et présenter l'app sans backend. Les données ne quittent pas l'appareil.
 */
export const authMode: 'cloud' | 'local' = supabase ? 'cloud' : 'local';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateSignUp(name: string, email: string, password: string): string | null {
  if (name.trim().length < 2) return 'Entre ton prénom.';
  if (!EMAIL.test(email.trim())) return 'Cette adresse e-mail n’est pas valide.';
  if (password.length < 8) return 'Le mot de passe doit faire au moins 8 caractères.';
  return null;
}

// ---------- Mode local ----------
type LocalAccount = { id: string; email: string; name: string; salt: string; hash: string };
const ACCOUNTS = 'baller-ai/accounts';
const SESSION = 'baller-ai/session';

async function localAccounts(): Promise<Record<string, LocalAccount>> {
  try {
    return JSON.parse((await AsyncStorage.getItem(ACCOUNTS)) ?? '{}');
  } catch {
    return {};
  }
}
const saveAccounts = (a: Record<string, LocalAccount>) => AsyncStorage.setItem(ACCOUNTS, JSON.stringify(a));
const hashPassword = (password: string, salt: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
const publicAccount = (a: LocalAccount): Account => ({ id: a.id, email: a.email, name: a.name });

// ---------- Messages d'erreur Supabase en français ----------
function frenchError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'E-mail ou mot de passe incorrect.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Un compte existe déjà avec cet e-mail.';
  if (m.includes('email not confirmed')) return 'Confirme ton adresse e-mail avec le lien reçu, puis reconnecte-toi.';
  if (m.includes('password')) return 'Mot de passe trop faible : au moins 8 caractères.';
  if (m.includes('network') || m.includes('fetch')) return 'Pas de connexion internet. Réessaie dans un instant.';
  if (m.includes('rate limit')) return 'Trop de tentatives. Patiente une minute.';
  return 'Une erreur est survenue. Réessaie.';
}

export const auth = {
  async current(): Promise<Account | null> {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;
      return u ? { id: u.id, email: u.email ?? '', name: (u.user_metadata?.name as string) ?? '' } : null;
    }
    const id = await AsyncStorage.getItem(SESSION);
    if (!id) return null;
    const found = Object.values(await localAccounts()).find((a) => a.id === id);
    return found ? publicAccount(found) : null;
  },

  async signUp(name: string, email: string, password: string): Promise<Result<Account | 'confirm-email'>> {
    const invalid = validateSignUp(name, email, password);
    if (invalid) return { ok: false, error: invalid };
    const mail = email.trim().toLowerCase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email: mail, password, options: { data: { name: name.trim() } } });
      if (error) return { ok: false, error: frenchError(error.message) };
      // Si la confirmation d'e-mail est activée, il n'y a pas encore de session.
      if (!data.session || !data.user) return { ok: true, value: 'confirm-email' };
      return { ok: true, value: { id: data.user.id, email: mail, name: name.trim() } };
    }
    const accounts = await localAccounts();
    if (accounts[mail]) return { ok: false, error: 'Un compte existe déjà avec cet e-mail.' };
    const salt = Crypto.randomUUID();
    const account: LocalAccount = { id: Crypto.randomUUID(), email: mail, name: name.trim(), salt, hash: await hashPassword(password, salt) };
    await saveAccounts({ ...accounts, [mail]: account });
    await AsyncStorage.setItem(SESSION, account.id);
    return { ok: true, value: publicAccount(account) };
  },

  async signIn(email: string, password: string): Promise<Result<Account>> {
    const mail = email.trim().toLowerCase();
    if (!mail || !password) return { ok: false, error: 'Entre ton e-mail et ton mot de passe.' };
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: mail, password });
      if (error || !data.user) return { ok: false, error: frenchError(error?.message ?? '') };
      return { ok: true, value: { id: data.user.id, email: mail, name: (data.user.user_metadata?.name as string) ?? '' } };
    }
    const account = (await localAccounts())[mail];
    if (!account || (await hashPassword(password, account.salt)) !== account.hash) return { ok: false, error: 'E-mail ou mot de passe incorrect.' };
    await AsyncStorage.setItem(SESSION, account.id);
    return { ok: true, value: publicAccount(account) };
  },

  async resetPassword(email: string): Promise<Result> {
    const mail = email.trim().toLowerCase();
    if (!EMAIL.test(mail)) return { ok: false, error: 'Cette adresse e-mail n’est pas valide.' };
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(mail);
      return error ? { ok: false, error: frenchError(error.message) } : { ok: true, value: undefined };
    }
    return { ok: false, error: 'La réinitialisation par e-mail sera disponible quand les comptes en ligne seront activés.' };
  },

  async signOut(): Promise<void> {
    if (supabase) await supabase.auth.signOut();
    else await AsyncStorage.removeItem(SESSION);
  },

  /** Supprime le compte et toutes ses données (obligatoire sur l'App Store). */
  async deleteAccount(account: Account): Promise<Result> {
    if (supabase) {
      const { error } = await supabase.rpc('delete_account');
      if (error) return { ok: false, error: frenchError(error.message) };
      await supabase.auth.signOut();
      return { ok: true, value: undefined };
    }
    const accounts = await localAccounts();
    delete accounts[account.email];
    await saveAccounts(accounts);
    await AsyncStorage.removeItem(SESSION);
    return { ok: true, value: undefined };
  },

  onChange(cb: (account: Account | null) => void): () => void {
    if (!supabase) return () => {};
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      cb(u ? { id: u.id, email: u.email ?? '', name: (u.user_metadata?.name as string) ?? '' } : null);
    });
    return () => data.subscription.unsubscribe();
  },
};
