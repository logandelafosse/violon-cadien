import { stopAll } from './audio/engine'

/** Route courante (ancre sans le « # »). Les pages la lisent ; seul `go` et le navigateur la modifient. */
export const router = $state({ route: typeof location !== 'undefined' ? location.hash.slice(1) || '/' : '/' })

/** Va à une route (ex. `/jour/7`). Le changement d'ancre déclenche `hashchange`, qui met à jour l'état. */
export const go = (r: string) => { location.hash = r }

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    stopAll() // le son s'arrête à chaque changement de page
    router.route = location.hash.slice(1) || '/'
    window.scrollTo(0, 0)
  })
}
