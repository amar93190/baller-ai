-- Baller AI — schéma initial
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller → Run.

-- Données de chaque joueur ou joueuse : profil, matchs, séries, XP… (un document JSON par compte).
create table if not exists public.player_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Sécurité : chaque compte ne peut lire et écrire QUE sa propre ligne.
alter table public.player_state enable row level security;

create policy "Lire ses données" on public.player_state
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Créer ses données" on public.player_state
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Modifier ses données" on public.player_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Supprimer ses données" on public.player_state
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Suppression du compte depuis l'app (obligatoire sur l'App Store).
-- Supprime l'utilisateur connecté ; ses données partent avec (on delete cascade).
create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Non connecté';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;
