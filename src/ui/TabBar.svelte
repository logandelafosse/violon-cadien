<script lang="ts">
  import { router } from '../router.svelte'
  import { t, type Key } from '../i18n.svelte'
  import Icon from './Icon.svelte'
  import type { IconName } from './icons'

  const route = $derived(router.route)
  const tabs: { href: string; icon: IconName; key: Key; on: (r: string) => boolean }[] = [
    { href: '#/', icon: 'today', key: 'nav_jour', on: (r) => r === '/' || r.startsWith('/jour/') },
    { href: '#/plan', icon: 'plan', key: 'nav_plan', on: (r) => r === '/plan' },
    { href: '#/chansons', icon: 'songs', key: 'nav_chansons', on: (r) => r.startsWith('/chansons') },
    { href: '#/vocabulaire', icon: 'vocab', key: 'nav_vocab', on: (r) => r === '/vocabulaire' },
    { href: '#/reglages', icon: 'settings', key: 'nav_reglages', on: (r) => r === '/reglages' },
  ]
</script>

<nav aria-label={t('nav_label')}>
  <div class="grid">
    {#each tabs as tab (tab.href)}
      {@const on = tab.on(route)}
      <a href={tab.href} class:on aria-current={on ? 'page' : undefined}>
        <span class="pill"><Icon name={tab.icon} size={22} /></span>
        <span class="lbl">{t(tab.key)}</span>
      </a>
    {/each}
  </div>
</nav>

<style>
  nav { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; background: var(--card); border-top: 1px solid var(--line); padding: 6px 4px calc(10px + env(safe-area-inset-bottom)) }
  .grid { max-width: 640px; margin: 0 auto; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 2px }
  a { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; min-height: 56px; text-decoration: none; font-size: var(--t-xs); letter-spacing: -0.01em; color: var(--muted); font-weight: 400 }
  a.on { color: var(--fg); font-weight: 700 }
  .pill { display: flex; align-items: center; justify-content: center; width: 56px; height: 30px; border-radius: var(--r-pill); color: inherit; transition: background-color 0.15s, color 0.15s }
  a.on .pill { background: var(--accent); color: var(--on-accent) }
</style>
