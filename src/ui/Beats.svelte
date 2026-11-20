<script lang="ts">
  import { t } from '../i18n.svelte'
  // Points des temps : le temps en cours grossit et se remplit, avec son numéro. Le temps 1 porte toujours un anneau
  // d'accent 2 et un trait dessous : on le reconnaît sans la couleur. count = 2 (two-step) ou 3 (valse).
  let { count, current = -1 }: { count: 2 | 3; current?: number } = $props()
</script>

<span class="beats" role="img" aria-label={current >= 0 ? `${t('temps_n')} ${current + 1}/${count}` : `${count} ${t('temps_pl')}`}>
  {#each Array(count) as _, i}
    <span class="col">
      <span class="dot" class:now={current === i} class:first={i === 0}>{i + 1}</span>
      <span class="bar" class:first={i === 0}></span>
    </span>
  {/each}
</span>

<style>
  .beats { display: inline-flex; gap: var(--s-4); align-items: center }
  .col { display: flex; flex-direction: column; align-items: center; gap: 6px }
  .dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--muted); color: var(--muted); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--t-sm); box-sizing: border-box; transition: all 80ms }
  .dot.now { width: 40px; height: 40px; background: var(--accent); border-color: var(--accent); color: var(--on-accent); font-size: var(--t-md) }
  .dot.first { box-shadow: 0 0 0 3px var(--card), 0 0 0 5px var(--accent2) }
  .bar { width: 20px; height: 4px; border-radius: 2px; background: transparent }
  .bar.first { background: var(--accent2) }
</style>
