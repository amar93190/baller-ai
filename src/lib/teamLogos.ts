/**
 * Logos affichés en motif de fond, en opacité basse, sur l'écran Coach.
 *
 * ⚠️ Les logos d'équipes réelles (NBA, clubs…) sont des marques déposées.
 * OK pour la maquette de l'école, mais avant de soumettre l'app sur l'App Store
 * ou Google Play : passe SHOW_BACKGROUND_LOGOS à false, ou remplace les images
 * par des logos dont tu as les droits.
 *
 * Pour ajouter un logo : dépose un PNG à fond transparent dans
 * assets/images/ puis ajoute une ligne require(...) ci-dessous.
 */
export const SHOW_BACKGROUND_LOGOS = true;

export const TEAM_LOGOS: number[] = [
  // Logo Baller AI en attendant les logos d'équipes.
  require('../../assets/images/logo.png'),
];
