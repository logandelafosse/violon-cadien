// Jeu d'icônes de la maquette (grille de 24, trait de 2 px à bouts ronds, currentColor).
// `fill: true` = icône pleine (lecture, étoile) ; sinon tracé.
export const ICONS = {
  play: { d: 'M7 4.5v15l12.5-7.5z', fill: true },
  pause: { d: 'M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z', fill: true },
  stop: { d: 'M6 6h12v12H6z', fill: true },
  repeat: { d: 'M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4' },
  listen: { d: 'M4 9.5h4l5-4.5v14l-5-4.5H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11' },
  drone: { d: 'M3 12h2M7 9v6M11 6v12M15 9v6M19 11v2' },
  metronome: { d: 'M8.5 3h7l3.5 18H5zM5.8 17h12.4M12 17l5-11' },
  timer: { d: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2M10 2h4' },
  song: { d: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
  tune: { d: 'M9 3v7a3 3 0 0 0 6 0V3M12 13v8M9.5 21h5' },
  pupitre: { d: 'M5 4h14l-2 8H7zM12 12v8M8 21l4-1 4 1' },
  star: { d: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z', fill: true },
  check: { d: 'M4.5 12.5l5 5 10-11' },
  next: { d: 'M5 12h14M13 6l6 6-6 6' },
  today: { d: 'M4 6.5h16v13.5H4zM4 10.5h16M8.5 3.5v5M15.5 3.5v5M10 14h4v3h-4z' },
  plan: { d: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
  songs: { d: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
  vocab: { d: 'M4 5.5C6.5 4 9.5 4 12 5.5v14C9.5 18 6.5 18 4 19.5zM20 5.5C17.5 4 14.5 4 12 5.5v14c2.5-1.5 5.5-1.5 8 0z' },
  settings: { d: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4' },
  theme: { d: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 3v18M12 7h4M12 11h5.5M12 15h5M12 19h2' },
  lang: { d: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9s1.2-6.4 3.7-9z' },
  export: { d: 'M12 3v12M7 10l5 5 5-5M4 20h16' },
  import: { d: 'M12 15V3M7 8l5-5 5 5M4 20h16' },
  reset: { d: 'M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5' },
  chevron: { d: 'M6 9l6 6 6-6' },
  revision: { d: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM8 12.5l2.7 2.7L16 9.5' },
  quote: { d: 'M6 17c-1.5-1-2-2.6-2-4.5C4 9.5 6 7.5 9 7M15 17c-1.5-1-2-2.6-2-4.5 0-3 2-5 5-5.5' },
  close: { d: 'M6 6l12 12M18 6L6 18' },
} as const satisfies Record<string, { d: string; fill?: true }>

/** `lys` (fleur de lys) est un ornement à plusieurs éléments, dessiné directement dans Icon.svelte. */
export type IconName = keyof typeof ICONS | 'lys'
