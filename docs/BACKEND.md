# Backend Baller AI — brancher Supabase (≈ 10 minutes)

## Pourquoi Supabase

| Besoin | Ce que fournit Supabase |
|---|---|
| Inscription, connexion, mot de passe oublié | **Supabase Auth** (e-mail + mot de passe, e-mails de confirmation inclus) |
| Sauvegarder les données de chaque joueur/joueuse | **Base Postgres** (table `player_state`) |
| Sécurité : chacun ne voit que ses données | **Row Level Security**, déjà écrite dans la migration |
| Suppression de compte (exigée par Apple) | Fonction `delete_account()` dans la migration |
| Hébergement en Europe (RGPD) | Région **Paris** ou **Frankfurt** au choix |
| Prix | **Gratuit** jusqu'à 50 000 utilisateurs actifs par mois |

C'est aussi la solution recommandée par la documentation Expo.

## Tant que ce n'est pas branché

L'app fonctionne déjà entièrement en **mode local** : les comptes (mot de passe haché) et les données
restent sur le téléphone. Seul « mot de passe oublié » ne peut pas envoyer d'e-mail.
Dans Réglages, le compte affiche « Sur ce téléphone ». Une fois Supabase branché, il affiche « Sauvegardé ».

## Étapes

1. **Créer le compte et le projet**
   - Va sur <https://supabase.com> → *Start your project* → connecte-toi (GitHub ou e-mail).
   - *New project* : nom `baller-ai`, un mot de passe de base de données (garde-le pour toi),
     **Region : West EU (Paris)** ou **Central EU (Frankfurt)**. La politique de confidentialité de l'app annonce un hébergement en Union européenne.

2. **Créer la base**
   - Menu *SQL Editor* → *New query*.
   - Colle tout le contenu de `supabase/migrations/0001_init.sql` → *Run*.

3. **Régler l'authentification**
   - *Authentication → Sign In / Providers → Email* : activé (par défaut).
   - *Confirm email* : laisse activé pour la sortie publique. L'app gère déjà l'écran « Vérifie tes e-mails ».
   - *Authentication → Emails* : tu peux traduire les modèles d'e-mail en français.

4. **Brancher l'app**
   - *Project Settings → API* : copie **Project URL** et la clé **publishable** (`sb_publishable_…`, ou *anon public* sur les anciens projets).
   - Dans le dossier du projet : copie `.env.example` en `.env.local` et colle les 2 valeurs.
   - Pour les builds EAS, ajoute aussi ces 2 variables dans expo.dev → projet → *Environment variables*.

5. **Recompiler** : `npx expo run:ios` (ou `npx expo start` si tu utilises un build de développement).

⚠️ Ne mets **jamais** le mot de passe de la base ni une clé *secret* / *service_role* dans l'app.
La clé *publishable* est faite pour être publique : la sécurité vient des règles RLS.

## Comment l'app synchronise

- Toutes les données du joueur sont un seul document JSON (`player_state.data`), une ligne par compte.
- À l'ouverture : l'app compare la copie du téléphone et celle du cloud, et garde la plus récente.
- À chaque action : sauvegarde immédiate sur le téléphone, envoi au cloud 1,5 s après la dernière action.
- Code : `src/lib/auth.ts`, `src/lib/sync.ts`, `src/store/session.tsx`, `src/store/player.tsx`.
