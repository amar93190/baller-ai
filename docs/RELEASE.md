# Sortir Baller AI sur l'App Store et Google Play

Ce qui est **déjà prêt** dans le projet :

- Comptes : inscription, connexion, mot de passe oublié, déconnexion, **suppression du compte** (règle 5.1.1 d'Apple).
- Pages **Confidentialité** et **Conditions d'utilisation** dans l'app (Réglages et écran d'accueil).
- Icône, écran de démarrage, intro vidéo, nom « Baller AI », identifiant `com.ballerai.app`.
- `ITSAppUsesNonExemptEncryption = false` : pas de question sur le chiffrement à chaque envoi.
- `eas.json` avec les profils `development`, `preview` (TestFlight / test interne) et `production`.
- Mises à jour à distance (EAS Update) configurées sur le projet `@keytsu/baller-ai`.

## À faire de ton côté (comptes et informations personnelles)

1. **Backend** : brancher Supabase → `docs/BACKEND.md`.
2. **Contact** : renseigner `SUPPORT_EMAIL` et `PUBLISHER` dans `src/lib/config.ts`.
3. **Comptes développeur**
   - Apple Developer Program (99 $/an) : <https://developer.apple.com/programs/>. Si tu as moins de 18 ans, c'est un parent qui ouvre le compte.
   - Google Play Console (25 $ une fois). Pour un compte personnel, il faut un **test fermé de 14 jours avec 12 testeurs** avant la publication.
4. **Droits à l'image** : avant une sortie publique, passer `USE_REAL_PLAYER_NAMES = false` dans
   `src/lib/models.ts`. Les noms et photos de joueurs et joueuses réels sont alors remplacés par des profils descriptifs (« La Shooteuse »…).
   Garder les vrais noms suppose un accord des intéressés ou de leurs agents.

## Compiler et envoyer

```bash
npx eas-cli@latest build --platform ios --profile production   # build App Store (dans le cloud)
npx eas-cli@latest submit --platform ios --latest               # envoi vers App Store Connect / TestFlight
npx eas-cli@latest build --platform android --profile production
npx eas-cli@latest submit --platform android --latest
```

## Fiche App Store (App Store Connect)

| Champ | Proposition |
|---|---|
| Nom | Baller AI |
| Sous-titre (30 car.) | Ton coach de basket de poche |
| Catégorie | Sports (secondaire : Santé et forme) |
| Âge | 13+ (contenu : aucun ; le coach mental n'est pas un service médical) |
| Mots-clés | basket, entraînement, tir, stats, coach, mental, WNBA, NBA, progression |
| Confidentialité (App Privacy) | Coordonnées (e-mail, prénom) et Contenu utilisateur (stats, séries, matchs), liés à l'identité, **non utilisés pour le suivi**, pour le fonctionnement de l'app |
| URL de confidentialité | Obligatoire : publie le texte de l'écran Confidentialité sur une page web (Notion, Google Sites…) |
| Captures | iPhone 6,9" : 3 à 10 captures (Accueil, Entraînement, Stats, Ma carte, Coach) |

## Avant d'appuyer sur « Envoyer »

- [ ] Tester l'inscription, la connexion, la déconnexion et la suppression du compte avec Supabase branché.
- [ ] Tester sur un vrai iPhone (TestFlight) : intro, onglets, saisie d'un match, d'une série, d'un exercice.
- [ ] Vérifier que `SUPPORT_EMAIL` s'affiche dans les pages légales.
- [ ] Choisir : vrais noms de joueurs avec accord, ou profils descriptifs.
- [ ] L'écran de test `/dev` n'existe qu'en développement (`__DEV__`) : rien à faire.
