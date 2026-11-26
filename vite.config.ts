import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// The public address of the site. Change SITE_URL once you deploy (e.g. https://night-garage.vercel.app),
// or set VITE_SITE_URL in a .env file. It goes into index.html (canonical, social previews),
// robots.txt and sitemap.xml.
const SITE_URL = 'http://localhost:5173'

function seoFiles(site: string): Plugin {
  return {
    name: 'seo-files',
    // fill %SITE_URL% in index.html
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', site),
    // write robots.txt + sitemap.xml next to the built site
    generateBundle() {
      if (this.meta.watchMode) return
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n` })
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const site = (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL || SITE_URL).replace(/\/$/, '')
  return {
    plugins: [react(), seoFiles(site)],
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 500,
      rolldownOptions: {
        output: {
          // Split the big 3D libraries into their own files: they rarely change, so a returning
          // visitor's browser keeps them cached and only re-downloads our small app code.
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 2 },
              { name: 'gsap', test: /node_modules[\\/]gsap[\\/]/, priority: 1 },
            ],
          },
        },
      },
    },
  }
})
