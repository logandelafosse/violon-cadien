<script lang="ts">
  import { GLOSSARY } from '../content/glossary'
  import { searchGlossary } from '../content/glossarySearch'
  import { i18n, t, tf } from '../i18n.svelte'
  import Icon from './Icon.svelte'

  let q = $state('')
  const results = $derived(searchGlossary(GLOSSARY, q))
  const searching = $derived(q.trim().length > 0)
  const count = $derived(
    !searching ? tf('vocab_count_all', { n: GLOSSARY.length }) : results.length === 1 ? t('vocab_count_one') : tf('vocab_count_n', { n: results.length }),
  )
  const other = $derived(i18n.lang === 'en' ? 'fr' : 'en')
</script>

<h2>{t('vocab_titre')}</h2>
<p class="intro">{t('vocab_intro')}</p>

<label class="search">{t('vocab_search')}
  <input type="search" bind:value={q} placeholder={t('vocab_ph')} enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" />
</label>
<p class="count" role="status">{results.length ? count : t('vocab_none')}</p>

{#if results.length}
  <dl>
    {#each results as g (g.fr)}
      <div class="term">
        <dt>{i18n.lang === 'en' ? g.en : g.fr} <span class="alt" lang={other}>{i18n.lang === 'en' ? g.fr : g.en}</span></dt>
        <dd>{i18n.lang === 'en' ? g.defEn : g.defFr}</dd>
        <dd class="src">
          <figure>
            <span class="q"><Icon name="quote" size={20} /></span>
            <figcaption>{t('livre')} : « <span lang="en">{g.livre}</span> »</figcaption>
          </figure>
        </dd>
      </div>
    {/each}
  </dl>
{/if}

<style>
  h2 { margin: 4px 0 var(--s-2); font-size: var(--t-xl) }
  .intro { margin: 0 0 var(--s-3); color: var(--muted); font-size: var(--t-sm) }
  .search { display: flex; flex-direction: column; gap: 6px; font-size: var(--t-sm); font-weight: 700; color: var(--muted) }
  .search input { min-height: 52px; box-sizing: border-box; padding: 0 14px; border: 2px solid var(--fg); border-radius: var(--r); background: var(--card); color: var(--fg); font-size: var(--t-md); font-weight: 400 }
  .search input::placeholder { color: var(--muted) }
  .count { margin: var(--s-2) 0 var(--s-3); font-size: var(--t-sm); color: var(--muted) }
  dl { margin: 0 }
  .term { background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: var(--s-4); margin: 0 0 var(--s-3); display: flex; flex-direction: column; gap: var(--s-2) }
  dt { font-family: var(--font-title); font-weight: 700; font-size: var(--t-lg); line-height: var(--lh-tight); color: var(--fg) }
  .alt { font-family: var(--font-text); font-weight: 400; font-style: italic; font-size: var(--t-base); color: var(--muted); margin-left: var(--s-2) }
  dd { margin: 0; line-height: var(--lh) }
  .src { margin: 0 }
  figure { margin: 4px 0 0; display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: 10px; background: var(--bg) }
  .q { flex: none; margin-top: 1px; color: var(--accent); display: inline-flex }
  figcaption { font-size: var(--t-sm); line-height: 1.45; font-style: italic; color: var(--muted) }
</style>
