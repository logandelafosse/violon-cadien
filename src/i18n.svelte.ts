export type Lang = 'fr' | 'en'
const KEY = 'cfd.lang'

function initial(): Lang {
  try {
    const s = localStorage.getItem(KEY)
    if (s === 'fr' || s === 'en') return s
  } catch { /* ignoré */ }
  return 'fr'
}

export const i18n = $state<{ lang: Lang }>({ lang: initial() })

export function setLang(l: Lang) {
  i18n.lang = l
  try { localStorage.setItem(KEY, l) } catch { /* ignoré */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = l
    document.title = t('titre_court')
  }
}

const D = {
  fr: {
    titre_court: 'Violon cadien', titre: 'Violon cadien, jour après jour', langue: 'Langue',
    serie: 'Série', jour: 'jour', jours: 'jours', faits: 'faits',
    accord_ligne: 'Violon accordé un ton plus bas', accordeon: 'accordéon en Do',
    plan: 'Plan de 12 semaines', revision: 'révision', bientot: 'Bientôt',
    plan_note: 'Les jours grisés arrivent bientôt. Aucun jour n’est verrouillé : reviens en arrière quand tu veux.',
    reglages: 'Réglages', exporter: 'Exporter ma progression',
    export_note: 'Ta progression est sauvegardée dans ce navigateur seulement. Exporte-la de temps en temps.',
    semaine: 'Semaine', jour_n: 'Jour', apprendre: 'Apprendre', pratiquer: 'Pratiquer', revue: 'Révision', min: 'min',
    lien_chanson: '♪ Pratique avec une chanson →', a_ecouter: 'À écouter', autoeval: 'Autoévaluation',
    fait_le: '✓ Fait le', annuler: 'annuler', marquer: 'Marquer comme fait',
    bravo: 'Bravo !', fini: 'Tu as fini tous les jours disponibles. Les suivants arrivent bientôt.',
    nav_jour: 'Aujourd’hui', nav_plan: 'Plan', nav_chansons: 'Chansons', nav_reglages: 'Réglages',
    ecouter: '▶ Écouter', bourdon: '♪ Bourdon', stop_bourdon: '■ Arrêter le bourdon', metro: '⏱ Métronome', stop: '■ Arrêter', tempo: 'Tempo',
    sonore: 'Sonore', doigte: 'Doigté', les_deux: 'Les deux',
    sonne_en: 'Sonne en', forme_de: 'doigté de la forme', manche_aria: 'Manche du violon en première position',
    corde_de: 'Corde de', doigt: 'doigt', sonne: 'sonne', doigte_n: 'doigté',
    ch_titre: 'Chansons pour pratiquer',
    ch_intro: 'Mélodies originales, en Do, Sol ou Fa. Les noms sont les notes sonores ; le chiffre est le doigt (0 = corde à vide).',
    songs_from: 'Pour cette leçon, tu t’exerces sur les chansons de la leçon',
    two_step: 'two-step · 2 temps', valse: 'valse · 3 temps', jouer: '▶ Jouer (4 fois)',
    melodie: 'Mélodie', accompagnement: 'Accompagnement',
    ch_note: 'Décompte d’une mesure au début. Coupe la mélodie pour jouer par-dessus, ou coupe l’accompagnement pour t’entendre seul.',
    ch_manches: 'Chaque mesure est <b>un violon à quatre cordes</b> (Fa, Do, Sol, Ré, de gauche à droite ; le haut est le sillet). Les ronds sont à l’endroit où tu poses le doigt, avec le chiffre du doigt (0 = corde à vide). La petite lettre donne l’ordre des notes, et le trait pointillé suit la mélodie.',
    mesure: 'Mesure',
    segondeur: 'Segondeur', sty_off: 'Aucun', sty_droite: 'Basse droite', sty_rythme: 'Archet rythmique', sty_shuffle: 'Archet shuffle',
    desc_droite: 'Tu fais sonner les cordes en remplissage sous le lead : un coup d’archet par temps, le temps 1 un peu plus fort.',
    desc_rythme: 'Tu trouves la note du lead et tu te sers de l’archet pour le rythme, comme on gratte une guitare : bas-haut en croches.',
    desc_shuffle: 'Un long coup d’archet qui roule des cordes graves vers les aiguës, puis deux petits coups sciés sur les cordes aiguës : DAH-da-da (le « Nashville shuffle »).',
    seconde_note: 'Ces trois façons de seconder sont celles du livret de Dewey Balfa et Tracy Schwarz ; la façon de les jouer ici est ma lecture, à comparer avec les enregistrements.',
    doublings: 'Doublings : les deux cordes de chaque accord', doublings_note: 'Doubler les cordes, c’est jouer deux cordes à la fois. Voici les doublings des accords de cette chanson.',
    nav_vocab: 'Vocabulaire', vocab_titre: 'Vocabulaire du seconding', vocab_intro: 'Les mots viennent du livret de Dewey Balfa et Tracy Schwarz (Folkways, 1976), avec des équivalents en français à valider.', livre: 'Dans le livret',
    plan_semaine: 'Semaine', plan_apercu: 'Aperçu : cette leçon n’est pas encore écrite.', triade: 'Triade',
    theme: 'Thème', th_drapeau: 'Drapeau', th_bayou: 'Bayou', th_papier: 'Vieux papier', th_minuit: 'Minuit', th_epure: 'Épuré',
    // --- accordeur / calibrage (audio) ---
    tuner_ouvrir: 'Accordeur au micro (facultatif)', tuner_fermer: 'Fermer l’accordeur', tuner_titre: 'Accordeur',
    tuner_demarrer: 'Activer le micro', tuner_arret: 'Arrêter',
    tuner_attente: 'Joue une corde à vide…', tuner_cible: 'Corde visée', tuner_cents: 'cents',
    tuner_juste: 'Juste', tuner_bas: 'Un peu bas : serre légèrement', tuner_haut: 'Un peu haut : desserre légèrement',
    tuner_tres_bas: 'Trop bas : serre', tuner_tres_haut: 'Trop haut : desserre',
    tuner_refuse: 'Micro refusé. Autorise-le dans les réglages du navigateur, ou accorde à l’oreille avec les cordes ci-dessus.',
    tuner_absent: 'Aucun micro disponible sur cet appareil.', tuner_erreur: 'Impossible de démarrer le micro.',
    tuner_ref: 'La4 de référence', tuner_ref_note: 'Les cordes, bourdons et chansons suivent cette référence.',
    calib_titre: 'Caler sur l’accordéon', calib_aide: 'Fais sonner une note de l’accordéon (un Do par exemple) et laisse-la tenir.',
    calib_mesure: 'Mesuré', calib_propose: 'La4 proposé', calib_appliquer: 'Appliquer', calib_reset: 'Revenir à 440 Hz',
    calib_note: 'Un accordéon ne se réaccorde pas : c’est le violon qui s’y ajuste.',
  },
  en: {
    titre_court: 'Cadien Fiddle', titre: 'Cadien Fiddle, Day by Day', langue: 'Language',
    serie: 'Streak', jour: 'day', jours: 'days', faits: 'done',
    accord_ligne: 'Fiddle tuned down a whole step', accordeon: 'C accordion',
    plan: '12-week plan', revision: 'review', bientot: 'Coming soon',
    plan_note: 'Greyed-out days are coming soon. Nothing is locked: go back whenever you like.',
    reglages: 'Settings', exporter: 'Export my progress',
    export_note: 'Your progress is saved in this browser only. Export it from time to time.',
    semaine: 'Week', jour_n: 'Day', apprendre: 'Learn', pratiquer: 'Practice', revue: 'Review', min: 'min',
    lien_chanson: '♪ Practice with a song →', a_ecouter: 'Listen for', autoeval: 'Self-check',
    fait_le: '✓ Done on', annuler: 'undo', marquer: 'Mark as done',
    bravo: 'Well done!', fini: 'You have finished all the available days. More are coming soon.',
    nav_jour: 'Today', nav_plan: 'Plan', nav_chansons: 'Songs', nav_reglages: 'Settings',
    ecouter: '▶ Listen', bourdon: '♪ Drone', stop_bourdon: '■ Stop drone', metro: '⏱ Metronome', stop: '■ Stop', tempo: 'Tempo',
    sonore: 'Sounding', doigte: 'Fingered', les_deux: 'Both',
    sonne_en: 'Sounds in', forme_de: 'fingered as the', manche_aria: 'Fiddle fingerboard in first position',
    corde_de: 'String', doigt: 'finger', sonne: 'sounds', doigte_n: 'fingered',
    ch_titre: 'Songs to practice with',
    ch_intro: 'Original tunes in C, G or F. Names are the sounding notes; the number is the finger (0 = open string).',
    songs_from: 'For this lesson you practise on the songs of lesson',
    two_step: 'two-step · 2 beats', valse: 'waltz · 3 beats', jouer: '▶ Play (4 times)',
    melodie: 'Melody', accompagnement: 'Backing',
    ch_note: 'There is a one-bar count-in. Mute the melody to play over it, or mute the backing to hear yourself alone.',
    ch_manches: 'Each bar is <b>a four-string fiddle</b> (left to right: F, C, G, D; the top is the nut). The circles sit where you put your finger, with the finger number (0 = open string). The small letter gives the order of the notes, and the dotted line follows the melody.',
    mesure: 'Bar',
    segondeur: 'Second fiddle (segondeur)', sty_off: 'None', sty_droite: 'Straight bassing', sty_rythme: 'Rhythm bow', sty_shuffle: 'Shuffle bow',
    desc_droite: 'You sound the strings as a filler under the lead: one bow stroke per beat, with beat 1 a little stronger.',
    desc_rythme: 'You find the lead’s note and use the bow for rhythm, like strumming a guitar: down-up in eighth notes.',
    desc_shuffle: 'One long bow stroke that rolls from the low strings to the high ones, then two small sawing strokes on the high strings: DAH-da-da (the “Nashville shuffle”).',
    seconde_note: 'These three ways of seconding come from the Dewey Balfa and Tracy Schwarz booklet; how they are played here is my reading, to be compared with the recordings.',
    doublings: 'Doublings: the two strings of each chord', doublings_note: 'Doubling the strings means playing two strings at once. Here are the doublings for the chords of this song.',
    nav_vocab: 'Glossary', vocab_titre: 'Seconding glossary', vocab_intro: 'The words come from the Dewey Balfa and Tracy Schwarz booklet (Folkways, 1976), with French equivalents still to be confirmed.', livre: 'In the booklet',
    plan_semaine: 'Week', plan_apercu: 'Preview: this lesson is not written yet.', triade: 'Triad',
    theme: 'Theme', th_drapeau: 'Flag', th_bayou: 'Bayou', th_papier: 'Old paper', th_minuit: 'Midnight', th_epure: 'Minimal',
    // --- tuner / calibration (audio) ---
    tuner_ouvrir: 'Microphone tuner (optional)', tuner_fermer: 'Close tuner', tuner_titre: 'Tuner',
    tuner_demarrer: 'Turn on microphone', tuner_arret: 'Stop',
    tuner_attente: 'Play an open string…', tuner_cible: 'Target string', tuner_cents: 'cents',
    tuner_juste: 'In tune', tuner_bas: 'A little flat: tighten slightly', tuner_haut: 'A little sharp: loosen slightly',
    tuner_tres_bas: 'Too flat: tighten', tuner_tres_haut: 'Too sharp: loosen',
    tuner_refuse: 'Microphone denied. Allow it in your browser settings, or tune by ear with the strings above.',
    tuner_absent: 'No microphone available on this device.', tuner_erreur: 'Could not start the microphone.',
    tuner_ref: 'Reference A4', tuner_ref_note: 'The strings, drones and songs follow this reference.',
    calib_titre: 'Match the accordion', calib_aide: 'Sound a note on the accordion (a C for example) and hold it.',
    calib_mesure: 'Measured', calib_propose: 'Suggested A4', calib_appliquer: 'Apply', calib_reset: 'Back to 440 Hz',
    calib_note: 'An accordion cannot be retuned: the fiddle adjusts to it.',
  },
} as const

export type Key = keyof (typeof D)['fr']
export const t = (k: Key) => D[i18n.lang][k]
