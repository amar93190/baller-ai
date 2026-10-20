# Baller AI

Coach de basket de poche pour **joueurs et joueuses** : missions du jour et XP, programmes inspirés de joueurs et joueuses pros,
statistiques (exercices, programme, matchs), carte joueur façon 2K et coach mental.

Expo SDK 58 · React Native 0.88 · Expo Router · TypeScript · Supabase (comptes et sauvegarde en ligne).

## Lancer l'app

```bash
npm install
npx expo run:ios                         # version de développement dans le simulateur
npx expo run:ios --configuration Release # version finale, sans serveur
npx expo run:ios --device                # sur l'iPhone branché (compte Apple ajouté dans Xcode)
```

Sans configuration, l'app fonctionne en **mode local** : comptes et données restent sur le téléphone.
Pour les comptes en ligne : `docs/BACKEND.md`. Pour la sortie sur les stores : `docs/RELEASE.md`.

## Organisation

| Dossier | Contenu |
|---|---|
| `src/app/` | Écrans (Expo Router). `(tabs)/` : Accueil, Entraînement, Stats, Coach, Ma carte |
| `src/app/onboarding/` | Inscription du profil en 3 étapes : joueur/joueuse et poste, modèle, maillot |
| `src/components/` | Composants d'interface (boutons, champs, carte joueur, missions…) |
| `src/lib/` | Logique : comptes (`auth`), synchro cloud (`sync`), XP et missions, modèles, stats |
| `src/store/` | État de l'app : session (`session.tsx`) et données du joueur (`player.tsx`) |
| `supabase/migrations/` | Schéma de la base et règles de sécurité |
| `docs/` | Guides backend et publication |

## Réglages avant publication

- `src/lib/config.ts` : adresse de contact et éditeur affichés dans les pages légales.
- `src/lib/models.ts` : `USE_REAL_PLAYER_NAMES` (droit à l'image des joueurs et joueuses réels).
- `src/lib/teamLogos.ts` : motif de logos du coach.

## Outils de test (développement uniquement)

- `ballerai://dev` : connecte un compte de test (`?account=f` pour une joueuse, `&seed=1` pour remplir d'exemples).
- `DevRemote` : navigation à distance pour tester les écrans dans le simulateur (lit `http://localhost:8099/nav.json`).

Ces deux outils n'existent pas dans la version publiée (`__DEV__`).
