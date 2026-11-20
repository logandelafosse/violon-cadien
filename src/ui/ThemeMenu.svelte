<script lang="ts">
  import Icon from './Icon.svelte'
  import ThemePicker from './ThemePicker.svelte'
  import { theme } from '../theme.svelte'
  import { t, tf, type Key } from '../i18n.svelte'

  // Bouton de thème (icône 44 px) qui ouvre un panneau de choix : un « disclosure » accessible.
  // Le panneau reste ouvert après un choix pour pouvoir comparer les thèmes ; Échap, un clic dehors
  // ou la sortie du focus le ferment ; Échap rend le focus au bouton.
  let open = $state(false)
  let root = $state<HTMLElement>()
  let trigger = $state<HTMLButtonElement>()
  let panel = $state<HTMLElement>()
  const panelId = $props.id()
  const current = $derived(t(('th_' + theme.name) as Key))

  function close(returnFocus: boolean) {
    if (!open) return
    open = false
    if (returnFocus) trigger?.focus()
  }

  // à l'ouverture, le focus va sur le thème actif pour pouvoir naviguer aux flèches tout de suite
  $effect(() => {
    if (open) panel?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')?.focus()
  })

  const onpointerdown = (e: PointerEvent) => { if (open && root && !root.contains(e.target as Node)) close(false) }
  const onkeydown = (e: KeyboardEvent) => { if (open && e.key === 'Escape') { e.preventDefault(); close(true) } }
  const onfocusout = (e: FocusEvent) => {
    const to = e.relatedTarget as Node | null
    if (open && to && root && !root.contains(to)) close(false)
  }
</script>

<svelte:window {onpointerdown} {onkeydown} />

<div class="menu" bind:this={root} {onfocusout}>
  <button bind:this={trigger} type="button" class="btn" aria-label={tf('theme_bouton', { n: current })}
    aria-expanded={open} aria-controls={panelId} onclick={() => (open = !open)}>
    <Icon name="theme" size={22} />
  </button>
  {#if open}
    <div id={panelId} class="panel" role="group" aria-label={t('theme')} bind:this={panel}>
      <div class="head">
        <span class="ttl">{t('theme')}</span>
        <button type="button" class="x" aria-label={t('theme_fermer')} onclick={() => close(true)}><Icon name="close" size={20} /></button>
      </div>
      <ThemePicker />
      <p class="note">{t('theme_note')}</p>
    </div>
  {/if}
</div>

<style>
  .btn { width: 44px; height: 44px; padding: 0; border-radius: var(--r); border: 2px solid var(--line); background: var(--card); color: var(--fg); display: flex; align-items: center; justify-content: center; cursor: pointer }
  .btn[aria-expanded='true'] { border-color: var(--accent) }
  /* ancré au bloc positionné de l'en-tête (rangée du titre), pour ne jamais déborder de l'écran */
  .panel { position: absolute; right: 0; top: calc(100% + 6px); z-index: 30; width: min(360px, 100%); background: var(--card); color: var(--fg); border: 2px solid var(--line); border-radius: var(--r-lg); padding: var(--s-3); box-shadow: 0 8px 24px rgb(0 0 0 / 0.25); display: flex; flex-direction: column; gap: var(--s-3) }
  .head { display: flex; align-items: center; justify-content: space-between }
  .ttl { font-family: var(--font-title); font-weight: 700; font-size: var(--t-md) }
  .x { width: 44px; height: 44px; padding: 0; border: 0; border-radius: var(--r); background: transparent; color: var(--fg); display: flex; align-items: center; justify-content: center; cursor: pointer }
  .note { margin: 0; font-size: var(--t-sm); color: var(--muted) }
</style>
