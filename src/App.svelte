<script lang="ts">
  import { setLang, i18n } from './i18n.svelte'
  import { setTheme, theme } from './theme.svelte'
  import { router, go } from './router.svelte'
  import { currentDay } from './state/store.svelte'
  import { pupitre } from './pupitre.svelte'
  import Header from './ui/Header.svelte'
  import TabBar from './ui/TabBar.svelte'
  import Songs from './ui/Songs.svelte'
  import Glossary from './ui/Glossary.svelte'
  import Today from './pages/Today.svelte'
  import Plan from './pages/Plan.svelte'
  import Settings from './pages/Settings.svelte'
  import Pupitre from './pages/Pupitre.svelte'

  setLang(i18n.lang)
  setTheme(theme.name)

  const route = $derived(router.route)
  const page = $derived(
    route === '/plan' ? 'plan'
    : route.startsWith('/chansons') ? 'songs'
    : route === '/vocabulaire' ? 'vocab'
    : route === '/reglages' ? 'settings'
    : 'day',
  )
  const dayNum = $derived(route.startsWith('/jour/') ? Number(route.slice(6)) : currentDay())
  const songDay = $derived(Number(route.split('/')[2]) || Math.min(currentDay(), 84))
</script>

{#if pupitre.on && page === 'day'}
  <Pupitre {dayNum} />
{:else}
  <div class="shell">
    <Header />
    <main>
      {#if page === 'plan'}<Plan />
      {:else if page === 'songs'}<Songs jour={songDay} onjour={(n) => go(`/chansons/${n}`)} />
      {:else if page === 'vocab'}<Glossary />
      {:else if page === 'settings'}<Settings />
      {:else}<Today {dayNum} />{/if}
    </main>
  </div>
  <TabBar />
{/if}

<style>
  .shell { max-width: 640px; margin: 0 auto; padding: 16px 16px calc(96px + env(safe-area-inset-bottom)) }
</style>
