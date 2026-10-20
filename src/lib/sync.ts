import { supabase } from '@/lib/supabase';

/**
 * Sauvegarde en ligne des données du joueur (table player_state, une ligne par compte).
 * Sans Supabase, ces fonctions ne font rien : les données restent sur le téléphone.
 */
export async function pullState<T>(userId: string): Promise<{ data: T; updatedAt: string } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('player_state').select('data, updated_at').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return { data: data.data as T, updatedAt: data.updated_at as string };
}

export async function pushState(userId: string, state: unknown, updatedAt: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('player_state').upsert({ user_id: userId, data: state, updated_at: updatedAt });
}
