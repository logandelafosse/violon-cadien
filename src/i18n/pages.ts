import { dict } from './dict'

// Textes des pages Plan, Vocabulaire et Réglages.
export default dict(
  {
    // --- Plan ---
    plan_titre: 'Le plan · 12 semaines', plan_intro: 'Rien n’est verrouillé : touche n’importe quel jour pour l’ouvrir.',
    leg_fait: 'fait', leg_revision: 'révision', leg_aujourdhui: 'aujourd’hui', plan_jour: 'Jour',
    plan_boucle: 'Semaine bouclée', plan_note_rev: 'Révision notée {n} sur 5',
    // --- Vocabulaire ---
    vocab_search: 'Chercher un mot (français ou anglais)', vocab_ph: 'ex. segondeur, shuffle',
    vocab_count_all: '{n} termes', vocab_count_one: 'Un terme trouvé', vocab_count_n: '{n} termes trouvés',
    vocab_none: 'Aucun mot trouvé. Essaie une autre orthographe ou un mot plus court.',
    // --- Réglages ---
    set_theme_note: 'Drapeau suit le mode clair ou sombre de ton appareil.',
    a4_titre: 'S’accorder sur l’accordéon',
    a4_intro: 'Les vieux accordéons ne sont pas toujours à 440. Règle le diapason sur celui de ton ami : toutes les notes de l’appli suivent.',
    a4_label: 'La de référence (Hz)', a4_aria: 'Diapason en hertz', a4_dec: 'Plus bas', a4_inc: 'Plus haut', a4_play: 'Jouer le La',
    prog_titre: 'Ma progression',
    prog_intro: 'Elle reste dans ce navigateur, sur cet appareil : pas de compte, rien n’est envoyé. Exporte-la de temps en temps, surtout avant de changer de téléphone.',
    export_dernier: 'Dernier export', export_jamais: 'jamais',
    reset_titre: 'Repartir de zéro', reset_intro: 'Efface les jours faits et la série. Les réglages restent.', reset_ouvrir: 'Réinitialiser…',
    reset_garder: 'Garder', reset_titre_ask: 'Effacer {done} et ta série de {streak} ?',
    reset_avertit: 'On ne pourra pas revenir en arrière. Pense à exporter d’abord.',
    n_jour_fait: '{n} jour fait', n_jours_faits: '{n} jours faits', n_jour: '{n} jour', n_jours: '{n} jours',
    foot_gratuit: 'Violon cadien · gratuit, sans compte, hors ligne',
  },
  {
    plan_titre: 'The plan · 12 weeks', plan_intro: 'Nothing is locked: tap any day to open it.',
    leg_fait: 'done', leg_revision: 'review', leg_aujourdhui: 'today', plan_jour: 'Day',
    plan_boucle: 'Week complete', plan_note_rev: 'Review rated {n} out of 5',
    vocab_search: 'Search a word (French or English)', vocab_ph: 'e.g. segondeur, shuffle',
    vocab_count_all: '{n} terms', vocab_count_one: 'One term found', vocab_count_n: '{n} terms found',
    vocab_none: 'No word found. Try another spelling or a shorter word.',
    set_theme_note: 'Flag follows your device’s light or dark mode.',
    a4_titre: 'Match the accordion',
    a4_intro: 'Old accordions are not always at 440. Set the pitch to your friend’s: every note in the app follows.',
    a4_label: 'Reference A (Hz)', a4_aria: 'Reference pitch in hertz', a4_dec: 'Lower', a4_inc: 'Higher', a4_play: 'Play the A',
    prog_titre: 'My progress',
    prog_intro: 'It stays in this browser, on this device: no account, nothing is sent. Export it from time to time, especially before changing phones.',
    export_dernier: 'Last export', export_jamais: 'never',
    reset_titre: 'Start over', reset_intro: 'Erases completed days and the streak. Your settings stay.', reset_ouvrir: 'Reset…',
    reset_garder: 'Keep', reset_titre_ask: 'Erase {done} and your {streak} streak?',
    reset_avertit: 'This cannot be undone. Remember to export first.',
    n_jour_fait: '{n} day done', n_jours_faits: '{n} days done', n_jour: '{n} day', n_jours: '{n} days',
    foot_gratuit: 'Cadien Fiddle · free, no account, works offline',
  },
)
