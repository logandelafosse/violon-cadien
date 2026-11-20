// Plan complet des 84 jours. Les jours 1 à 21 ont leur contenu écrit (days.ts / songDays.ts) ; les autres sont un aperçu.
// Chaque gamme reçoit plusieurs jours de chansons et de motifs différents, y compris les triades.
export interface WeekInfo { semaine: number; titre: string; titreEn: string }
export interface Outline { jour: number; titre: string; titreEn: string }

export const WEEKS: WeekInfo[] = [
  { semaine: 1, titre: 'Le violon accordé un ton plus bas', titreEn: 'The retuned fiddle' },
  { semaine: 2, titre: 'Gamme de Do majeur', titreEn: 'C major scale' },
  { semaine: 3, titre: 'Do majeur : chansons et triades', titreEn: 'C major: songs and triads' },
  { semaine: 4, titre: 'Sol majeur : gamme, chansons, triades', titreEn: 'G major: scale, songs, triads' },
  { semaine: 5, titre: 'Fa majeur : gamme, chansons, triades', titreEn: 'F major: scale, songs, triads' },
  { semaine: 6, titre: 'Gamme pentatonique', titreEn: 'Pentatonic scale' },
  { semaine: 7, titre: 'Doubler les cordes', titreEn: 'Doubling the strings' },
  { semaine: 8, titre: 'Seconder le two-step', titreEn: 'Seconding the two-step' },
  { semaine: 9, titre: 'Seconder la valse', titreEn: 'Seconding the waltz' },
  { semaine: 10, titre: 'Formes, fins et harmonie de ténor', titreEn: 'Forms, endings and tenor harmony' },
  { semaine: 11, titre: 'Lead et segondeur, tour à tour', titreEn: 'Lead and segondeur, taking turns' },
  { semaine: 12, titre: 'À l’oreille et avec l’accordéon', titreEn: 'By ear and with the accordion' },
]

const o = (jour: number, titre: string, titreEn: string): Outline => ({ jour, titre, titreEn })
export const OUTLINE: Outline[] = [
  // Semaine 4 : Sol
  o(22, 'Sol majeur : les deux cordes', 'G major: the two strings'),
  o(23, 'Sol majeur : l’octave grave', 'G major: the low octave'),
  o(24, 'Sol majeur : deux octaves', 'G major: two octaves'),
  o(25, 'Chansons en Sol : pas conjoints', 'Songs in G: stepwise'),
  o(26, 'Chansons en Sol : sauts de tierce', 'Songs in G: leaps of a third'),
  o(27, 'Triades de Sol : Sol-Si-Ré, Do-Mi-Sol, Ré-Fa♯-La', 'G triads: G-B-D, C-E-G, D-F♯-A'),
  o(28, 'Révision : Do et Sol', 'Review: C and G'),
  // Semaine 5 : Fa
  o(29, 'Fa majeur : les deux cordes graves', 'F major: the two low strings'),
  o(30, 'Si♭ contre Si', 'B♭ versus B'),
  o(31, 'Fa majeur : deux octaves', 'F major: two octaves'),
  o(32, 'Chansons en Fa : pas conjoints', 'Songs in F: stepwise'),
  o(33, 'Chansons en Fa : sauts de tierce', 'Songs in F: leaps of a third'),
  o(34, 'Triades de Fa : Fa-La-Do, Si♭-Ré-Fa, Do-Mi-Sol', 'F triads: F-A-C, B♭-D-F, C-E-G'),
  o(35, 'Révision : Do, Sol et Fa', 'Review: C, G and F'),
  // Semaine 6 : pentatonique
  o(36, 'Pentatonique de Do', 'C pentatonic'),
  o(37, 'Pentatonique de Sol', 'G pentatonic'),
  o(38, 'Pentatonique de Fa', 'F pentatonic'),
  o(39, 'Chansons pentatoniques : two-step', 'Pentatonic songs: two-step'),
  o(40, 'Chansons pentatoniques : valse', 'Pentatonic songs: waltz'),
  o(41, 'Appel et réponse sur trois notes', 'Call and response on three notes'),
  o(42, 'Révision : gammes, triades, pentatoniques', 'Review: scales, triads, pentatonics'),
  // Semaine 7 : doubler les cordes
  o(43, 'Unissons et octaves', 'Unisons and octaves'),
  o(44, 'Doubler les cordes : l’accord de Do', 'Doubling the strings: the C chord'),
  o(45, 'Doubler les cordes : l’accord de Sol', 'Doubling the strings: the G chord'),
  o(46, 'Doubler les cordes : Fa, et Si♭ pour la tonalité de Fa', 'Doubling the strings: F, and B♭ for the key of F'),
  o(47, 'Les accords 1, 4, 5 en Do', 'The 1, 4, 5 chords in C'),
  o(48, 'Les accords 1, 4, 5 en Sol et en Fa', 'The 1, 4, 5 chords in G and F'),
  o(49, 'Révision : doublings', 'Review: doublings'),
  // Semaine 8 : seconder le two-step
  o(50, 'Basse droite en Do', 'Straight bassing in C'),
  o(51, 'Basse droite avec les deux accords de l’accordéon', 'Straight bassing with the accordion’s two chords'),
  o(52, 'Archet rythmique', 'Rhythm bow'),
  o(53, 'Archet rythmique avec changements d’accord', 'Rhythm bow with chord changes'),
  o(54, 'Archet shuffle : le long et les deux courts', 'Shuffle bow: the long and the two shorts'),
  o(55, 'Archet shuffle avec les accords', 'Shuffle bow with the chords'),
  o(56, 'Révision : les trois façons de seconder', 'Review: the three ways of seconding'),
  // Semaine 9 : seconder la valse
  o(57, 'Valse : le pied (trois – UN – deux – trois)', 'Waltz: the foot (three – ONE – two – three)'),
  o(58, 'Valse : basse droite', 'Waltz: straight bassing'),
  o(59, 'Valse : archet rythmique', 'Waltz: rhythm bow'),
  o(60, 'Valse : archet shuffle', 'Waltz: shuffle bow'),
  o(61, 'La valse à deux temps', 'The two-time waltz'),
  o(62, 'Valses en Sol et en Fa', 'Waltzes in G and F'),
  o(63, 'Révision : seconder la valse', 'Review: seconding the waltz'),
  // Semaine 10
  o(64, 'Formes : 1-5-1-5 contre 1-4-1-5', 'Forms: 1-5-1-5 versus 1-4-1-5'),
  o(65, 'Compter les mesures, annoncer les changements', 'Counting bars, anticipating changes'),
  o(66, 'Les fins : le court 5 avant la maison, la fin sur le 4', 'Endings: the short 5 before home, the 4 ending'),
  o(67, 'L’harmonie de ténor (le second violon moderne)', 'Tenor harmony (the modern second fiddle)'),
  o(68, 'Oreille : reconnaître 1, 4 et 5', 'Ear training: recognising 1, 4 and 5'),
  o(69, 'Glisser dans les accords', 'Sliding into the chords'),
  o(70, 'Révision : formes et fins', 'Review: forms and endings'),
  // Semaine 11
  o(71, 'Chanson en Do : le lead du two-step', 'Song in C: leading the two-step'),
  o(72, 'Chanson en Do : seconder le two-step', 'Song in C: seconding the two-step'),
  o(73, 'Chanson en Do : le lead de la valse', 'Song in C: leading the waltz'),
  o(74, 'Chanson en Do : seconder la valse', 'Song in C: seconding the waltz'),
  o(75, 'Changer de rôle : lead puis segondeur', 'Switching roles: lead then segondeur'),
  o(76, 'Chanson en Sol : lead et segondeur', 'Song in G: lead and segondeur'),
  o(77, 'Chanson en Fa : lead et segondeur', 'Song in F: lead and segondeur'),
  // Semaine 12
  o(78, 'Trouver la tonalité à l’oreille', 'Finding the key by ear'),
  o(79, 'Entendre le pousser-tirer de l’accordéon', 'Hearing the accordion’s push-pull'),
  o(80, 'Répondre à des phrases à l’oreille', 'Echoing phrases by ear'),
  o(81, 'Simulation de session', 'Session simulation'),
  o(82, 'Préparer une session avec l’ami', 'Preparing a session with your friend'),
  o(83, 'Dernier passage : gammes et seconding', 'Final run-through: scales and seconding'),
  o(84, 'Évaluation finale', 'Final assessment'),
]
