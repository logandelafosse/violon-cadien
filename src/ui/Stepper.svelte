<script lang="ts">
  // Compteur − / + autour d'un vrai champ numérique (garde le rôle « spinbutton », les flèches et la saisie).
  let { value = $bindable(), min, max, step = 1, label, decLabel, incLabel, disabled = false }:
    { value: number; min: number; max: number; step?: number; label: string; decLabel: string; incLabel: string; disabled?: boolean } = $props()

  const clamp = (n: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))
  const bump = (d: number) => { value = clamp(value + d * step) }
  function commit(e: Event & { currentTarget: HTMLInputElement }) {
    value = clamp(Number(e.currentTarget.value))
    e.currentTarget.value = String(value)
  }
</script>

<span class="stepper" class:disabled>
  <button type="button" aria-label={decLabel} disabled={disabled || value <= min} onclick={() => bump(-1)}>−</button>
  <input type="number" inputmode="numeric" aria-label={label} {min} {max} {step} {value} {disabled} onchange={commit} />
  <button type="button" aria-label={incLabel} disabled={disabled || value >= max} onclick={() => bump(1)}>+</button>
</span>

<style>
  .stepper { display: inline-flex; align-items: center; border: 2px solid var(--fg); border-radius: var(--r); height: 48px; overflow: hidden; background: var(--card) }
  .stepper.disabled { border-color: var(--line) }
  button { width: 44px; height: 100%; min-height: 0; border: 0; background: transparent; color: var(--fg); font-size: 1.375rem; font-weight: 700; cursor: pointer }
  button:disabled { color: var(--muted); cursor: default }
  input { width: 56px; height: 100%; min-height: 0; border: 0; background: transparent; color: var(--fg); font-size: 1.25rem; font-weight: 700; text-align: center; font-variant-numeric: tabular-nums; -moz-appearance: textfield; appearance: textfield }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0 }
</style>
