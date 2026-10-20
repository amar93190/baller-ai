import { LegalPage } from '@/components/LegalPage';
import { APP_NAME, PUBLISHER, SUPPORT_EMAIL } from '@/lib/config';

const contact = SUPPORT_EMAIL ? `à ${SUPPORT_EMAIL}` : 'via l’adresse de contact indiquée sur la fiche de l’app';

export default function Terms() {
  return (
    <LegalPage
      title="Conditions d’utilisation"
      intro={`En utilisant ${APP_NAME}, édité par ${PUBLISHER}, tu acceptes les conditions ci-dessous. Elles sont écrites simplement, lis-les.`}
      sections={[
        {
          title: 'Ce que propose l’app',
          body: [
            `${APP_NAME} aide les joueurs et les joueuses de basket à s’entraîner : missions du jour, programmes inspirés de joueurs et joueuses professionnels, suivi des tirs et des matchs, et coach mental.`,
          ],
        },
        {
          title: 'Ton compte',
          body: [
            'Tu es responsable de ton mot de passe. Un compte est personnel. Tu peux le supprimer à tout moment depuis les Réglages.',
          ],
        },
        {
          title: 'Santé et sécurité',
          body: [
            'Les exercices sont donnés à titre indicatif. Échauffe-toi, écoute ton corps et arrête en cas de douleur. Les conseils du coach mental ne remplacent pas un médecin ou un psychologue.',
          ],
        },
        {
          title: 'Joueurs et joueuses modèles',
          body: [
            'Les programmes « inspirés de » décrivent des styles de jeu. Ils ne sont pas conçus, validés ou soutenus par les joueurs, joueuses, équipes ou ligues cités. Les photos proviennent de Wikimedia Commons, sous licence libre : leurs auteurs sont crédités dans l’app.',
          ],
        },
        {
          title: 'Bon usage',
          body: ['Pas de contenu offensant dans les messages au coach, pas de tentative de contourner la sécurité de l’app.'],
        },
        {
          title: 'Évolutions',
          body: [`L’app et ces conditions peuvent évoluer. En cas de changement important, tu seras prévenu dans l’app. Questions : ${contact}.`],
        },
      ]}
    />
  );
}
