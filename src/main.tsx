import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Start-up spinner (markup + styles live in index.html): keep it until the fonts are in,
// but at least ~0.7s so it never just flashes, then fade it out and remove it.
const preloader = document.getElementById('preloader')
if (preloader) {
  const minTime = new Promise((r) => setTimeout(r, 700))
  const fonts = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 4000))])
  void Promise.all([minTime, fonts]).then(() => {
    preloader.classList.add('is-hidden')
    setTimeout(() => preloader.remove(), 600)
  })
}
