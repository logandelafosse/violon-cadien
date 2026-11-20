<script lang="ts" generics="V extends string">
  import Icon from './Icon.svelte'
  // Boutons à choix unique : un groupe de <button aria-pressed>, avec une coche sur le choix actif (jamais la couleur seule).
  let { options, value, onselect, label, check = true }:
    { options: { value: V; label: string; title?: string; lang?: string }[]; value: V; onselect: (v: V) => void; label: string; check?: boolean } = $props()
</script>

<div class="seg" role="group" aria-label={label}>
  {#each options as o (o.value)}
    <button type="button" aria-pressed={value === o.value} title={o.title} lang={o.lang} class:on={value === o.value} onclick={() => onselect(o.value)}>
      {#if check && value === o.value}<Icon name="check" size={16} />{/if}{o.label}
    </button>
  {/each}
</div>

<style>
  .seg { display: inline-flex; border: 2px solid var(--accent); border-radius: var(--r); overflow: hidden }
  button { min-height: 44px; min-width: 46px; padding: 0 var(--s-3); border: 0; background: transparent; color: var(--accent); font-weight: 400; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px }
  button.on { background: var(--accent); color: var(--on-accent); font-weight: 700 }
</style>
