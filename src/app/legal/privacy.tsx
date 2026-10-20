import { LegalPage } from '@/components/LegalPage';
import { APP_NAME, PUBLISHER, SUPPORT_EMAIL } from '@/lib/config';

const contact = SUPPORT_EMAIL ? `écris-nous à ${SUPPORT_EMAIL}` : 'utilise l’adresse de contact indiquée sur la fiche de l’app dans l’App Store ou Google Play';

export default function Privacy() {
  return (
    <LegalPage
      title="Confidentialité"
      intro={`${APP_NAME} est édité par ${PUBLISHER}. Cette page explique quelles données l’app utilise, pourquoi, et comment tu gardes le contrôle dessus.`}
      sections={[
        {
          title: 'Les données que tu nous confies',
          body: [
            'Ton compte : ton prénom, ton adresse e-mail et ton mot de passe. Le mot de passe n’est jamais stocké en clair.',
            'Ton profil de joueur ou de joueuse : poste, numéro, couleur d’équipe, club si tu en indiques un, joueur ou joueuse modèle choisi. Ta fiche joueur : année de naissance, taille, poids, envergure, main forte, niveau, chaussures et pointure, objectifs et rythme d’entraînement. Ces informations servent uniquement à adapter ton coaching et à remplir ta fiche ; elles ne sont jamais vendues ni partagées.',
            'Ton activité : séries de tirs, matchs, exercices validés, missions et points d’expérience.',
          ],
        },
        {
          title: 'Ce que l’app ne collecte pas',
          body: [
            'Pas de géolocalisation, pas d’accès à tes contacts, pas de publicité et pas de traçage entre applications. Nous ne vendons aucune donnée.',
            'Les conversations avec le coach mental ne sont pas enregistrées : l’app retient seulement qu’un échange a eu lieu, pour valider la mission du jour.',
          ],
        },
        {
          title: 'Pourquoi ces données',
          body: [
            'Uniquement pour faire fonctionner l’app : afficher ta progression, calculer ta note et tes missions, et retrouver tes données quand tu te reconnectes sur un autre téléphone.',
          ],
        },
        {
          title: 'Où elles sont stockées',
          body: [
            'Sur ton téléphone, et sur nos serveurs sécurisés (hébergement Supabase, région Union européenne) quand la sauvegarde en ligne est active. Chaque compte n’a accès qu’à ses propres données.',
          ],
        },
        {
          title: 'Coach mental',
          body: [
            'Le coach mental est un outil de motivation sportive. Il ne remplace pas un professionnel de santé. Si tu traverses un moment difficile, parle à un adulte de confiance ou appelle le 3114 (gratuit, 24h/24).',
          ],
        },
        {
          title: 'Joueurs et joueuses mineurs',
          body: [
            'L’app est ouverte dès 13 ans. En France, avant 15 ans, l’accord d’un parent est nécessaire pour créer un compte.',
          ],
        },
        {
          title: 'Tes droits',
          body: [
            'Tu peux consulter, corriger ou supprimer tes données à tout moment. La suppression du compte se fait directement dans Réglages → Supprimer mon compte : elle efface ton compte et toutes tes données, définitivement.',
            `Pour toute autre demande, ${contact}. Tu peux aussi contacter la CNIL (cnil.fr).`,
          ],
        },
      ]}
    />
  );
}
