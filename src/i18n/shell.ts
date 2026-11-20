import { dict } from './dict'

// Textes de la coque : en-tête (titre, thème, langue, progression) et barre d'onglets.
export default dict(
  {
    sous_titre: 'jour après jour',
    theme_bouton: 'Thème : {n}',
    theme_fermer: 'Fermer le choix du thème',
    theme_note: 'Drapeau suit le mode clair ou sombre de ton appareil.',
    prog_label: '{done} jours faits sur {total}, semaine {w} sur {weeks}',
    nav_label: 'Navigation principale',
  },
  {
    sous_titre: 'Day by Day',
    theme_bouton: 'Theme: {n}',
    theme_fermer: 'Close the theme choice',
    theme_note: 'Flag follows your device’s light or dark mode.',
    prog_label: '{done} days done out of {total}, week {w} of {weeks}',
    nav_label: 'Main navigation',
  },
)
