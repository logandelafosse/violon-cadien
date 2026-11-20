<script lang="ts">
  import Icon from './Icon.svelte'
  import { THEMES, theme, setTheme, swatchFor, type Theme } from '../theme.svelte'
  import { t, type Key } from '../i18n.svelte'

  // Groupe de choix unique (radiogroup) : flèches, Home/Fin, tabindex itinérant. Pastilles coniques tirées des tokens.
  let prefersDark = $state(typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  $effect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => (prefersDark = mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  })

  const cone = (c: [string, string, string, string]) => `conic-gradient(${c[0]} 0 25%, ${c[1]} 0 50%, ${c[2]} 0 75%, ${c[3]} 0)`
  let buttons: HTMLButtonElement[] = []

  function onkey(e: KeyboardEvent, i: number) {
    const last = THEMES.length - 1
    const to = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % THEMES.length
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i + last) % THEMES.length
      : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (to < 0) return
    e.preventDefault()
    setTheme(THEMES[to])
    buttons[to]?.focus()
  }
</script>

<div class="picker" role="radiogroup" aria-label={t('theme')}>
  {#each THEMES as th, i (th)}
    {@const on = theme.name === th}
    <button bind:this={buttons[i]} type="button" role="radio" aria-checked={on} tabindex={on ? 0 : -1} class="th" class:on
      onclick={() => setTheme(th as Theme)} onkeydown={(e) => onkey(e, i)}>
      <span class="swatch" style="background:{cone(swatchFor(th, prefersDark))}" aria-hidden="true">
        {#if on}<span class="badge"><Icon name="check" size={14} /></span>{/if}
      </span>
      <span class="name">{t(('th_' + th) as Key)}</span>
    </button>
  {/each}
</div>

<style>
  .picker { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: var(--s-2) }
  .th { min-height: 88px; border-radius: var(--r); border: 2px solid var(--line); background: var(--card); color: var(--fg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--s-2); padding: var(--s-2); cursor: pointer }
  .th.on { border-color: var(--accent); font-weight: 700 }
  .swatch { position: relative; width: 56px; height: 56px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgb(127 127 127 / 0.55); display: inline-block }
  .badge { position: absolute; right: -4px; bottom: -4px; width: 22px; height: 22px; border-radius: 50%; background: var(--accent); color: var(--on-accent); display: flex; align-items: center; justify-content: center }
  .name { font-size: var(--t-sm) }
</style>
