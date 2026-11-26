import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (SIL Open Font License), bundled with the site: no request to Google Fonts.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter-tight/latin-600.css'
import '@fontsource/inter-tight/latin-800.css'
import './index.css'

// always start the film from the top (browsers otherwise jump back to the old scroll position)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
