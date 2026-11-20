/** Un module de textes : le français fixe les clés, l'anglais doit avoir exactement les mêmes (vérifié à la compilation). */
export interface Dict<F extends Record<string, string>> { fr: F; en: Record<keyof F, string> }

export function dict<F extends Record<string, string>>(fr: F, en: Record<keyof F, string>): Dict<F> {
  return { fr, en }
}
