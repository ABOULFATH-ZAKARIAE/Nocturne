# Security notes

What this site is: a static site (HTML, CSS, JS, pictures). No server code, no database, no logins,
no forms, no cookies, no analytics. Nothing a visitor types is sent anywhere.

What protects it once it is online:
- `public/_headers` (Netlify / Cloudflare Pages) and `vercel.json` (Vercel) set security headers:
  a strict Content-Security-Policy (only this site's own files may load or run), HTTPS only (HSTS),
  no framing (clickjacking), no MIME sniffing, a strict referrer policy, and no camera/mic/location.
- No third-party requests at all (fonts are self-hosted), so the strict policy needs no exceptions.
- No `innerHTML` / `eval` / user input in the code, so there is nothing to inject into.

Before every release:
1. `npm audit` — must say "found 0 vulnerabilities".
2. `npm run build` — must finish with no errors.
3. After deploying, test the headers at https://securityheaders.com (aim for A or A+).

When a booking form or any backend is added later, it needs its own review: input validation,
spam protection, rate limiting, a privacy policy, and secrets kept in the host's environment
settings (never in the code or in `.env` files that get committed).
