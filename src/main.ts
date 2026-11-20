import { mount } from 'svelte'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/pupitre.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
