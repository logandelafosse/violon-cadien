<script lang="ts">
  // Vue plein écran du mode pupitre (une étape à la fois). Base vide : App.svelte la monte quand
  // `pupitre.on` est vrai sur une page de jour ; la branche feat/mode-pupitre la remplit.
  import Today from './Today.svelte'
  let { dayNum }: { dayNum: number } = $props()
</script>

<!-- Tant que la vue n'existe pas, on retombe sur la page du jour normale. -->
<Today {dayNum} />
