<script lang="ts">
  import { GLOSSARY } from '../content/glossary'
  import { i18n, t } from '../i18n.svelte'
</script>

<h2>{t('vocab_titre')}</h2>
<p class="note">{t('vocab_intro')}</p>
<dl>
  {#each GLOSSARY as g}
    <div class="term">
      <dt>{i18n.lang === 'en' ? g.en : g.fr} <small>{i18n.lang === 'en' ? g.fr : g.en}</small></dt>
      <dd>{i18n.lang === 'en' ? g.defEn : g.defFr}</dd>
      <dd class="src">{t('livre')} : « {g.livre} »</dd>
    </div>
  {/each}
</dl>

<style>
  .note { opacity: 0.75; font-size: 0.9rem }
  .term { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; margin: 10px 0 }
  dt { font-weight: 700; color: var(--accent); font-size: 1.05rem }
  dt small { color: var(--fg); font-weight: 400; opacity: 0.85; margin-left: 6px; font-size: 0.85rem }
  dd { margin: 4px 0 0; line-height: 1.45 }
  .src { font-size: 0.8rem; opacity: 0.85; font-style: italic }
</style>
