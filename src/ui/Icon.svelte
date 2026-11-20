<script lang="ts">
  import { ICONS, type IconName } from './icons'
  // Décoratif (aria-hidden) sauf si `label` est donné : alors role="img".
  let { name, size = 20, label }: { name: IconName; size?: number; label?: string } = $props()
  const def = $derived(name === 'lys' ? null : ICONS[name])
</script>

{#if name === 'lys'}
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden={label ? undefined : 'true'} focusable="false" role={label ? 'img' : undefined} aria-label={label}>
    <path d="M12 2.5c-2.4 3-2.6 7 0 10.5 2.6-3.5 2.4-7.5 0-10.5z" fill="currentColor" />
    <path d="M11 13.2C8 13.8 4.2 12.4 4.2 9.3c0-2 2.2-2.7 3.4-1.2-1.6.3-1.6 2.5.2 3.4 1.1.6 2.3.6 3.2.4" />
    <path d="M13 13.2c3 .6 6.8-.8 6.8-3.9 0-2-2.2-2.7-3.4-1.2 1.6.3 1.6 2.5-.2 3.4-1.1.6-2.3.6-3.2.4" />
    <rect x="7" y="13.4" width="10" height="2" rx="1" fill="currentColor" stroke="none" />
    <path d="M12 15.6v5M9 21.2c.6-2.2 1.8-3.6 3-4.2 1.2.6 2.4 2 3 4.2" />
  </svg>
{:else if def}
  <svg viewBox="0 0 24 24" width={size} height={size}
    fill={'fill' in def ? 'currentColor' : 'none'} stroke={'fill' in def ? 'none' : 'currentColor'}
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden={label ? undefined : 'true'} focusable="false" role={label ? 'img' : undefined} aria-label={label}>
    <path d={def.d} />
  </svg>
{/if}

<style>
  svg { flex: none; display: inline-block; vertical-align: middle }
</style>
