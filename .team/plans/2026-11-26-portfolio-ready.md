# Plan: make Nocturne Op. 1 portfolio-ready (ready for Vercel)

## Current state
- Stack: Vite 8 + React 19 + TypeScript 6, GSAP 3 (ScrollTrigger) + Lenis, fonts via @fontsource. npm. Static site, no backend, no database.
- Git: local repo, branch `main`, 1 commit `ffb0e26 chore: initial Nocturne Op. 1 site`. No remote (user's choice: local only for now).
- Baseline (runner, Haiku):
  - Lint: 0 errors, 0 warnings
  - Typecheck (`tsc -b`): pass
  - Tests: **none** (no test script, no test files) → coverage 0%
  - Build: pass (JS 43.9 kB app + 113 kB GSAP + 219 kB React; gzip 12.9 / 44.5 / 68.3 kB)
  - `npm audit`: 0 vulnerabilities
  - Largest file: `src/index.css` 283 lines; no file over 300 lines
- No `CLAUDE.md`, no `.claude/rules/`. The team templates (Next.js, NestJS, React Native) don't match a Vite site, so no template adoption; Docs writes a short project `CLAUDE.md` instead.
- README is still the default Vite template text.
- No CI workflow. `vercel.json` + `public/_headers` (security headers) exist. `vite.config.ts` has `SITE_URL = 'http://localhost:5173'` (real domain unknown).
- `public/favicon.svg` is the default Vite logo; `public/icons.svg` looks unused.

## Definition of done for this run
The team standards checklist, plus:
- Keyboard users can reach every link/button with a visible focus ring; the custom cursor never hides focus.
- Reduced-motion visitors get a calm, complete page.
- Tests cover the site's logic (see open question 1 for the coverage scope).
- README is recruiter-ready and shows the live preview images, stack, and how it was built (AI stills + code).

## Squads in this run
planning → build → review (+ designer REVIEW) → security → docs → devops → final.
- **Design squad skipped:** no new screens; the design is already approved by the user. The Designer still reviews the UI in the Review squad and records Nocturne in `design/REGISTRY.md` (team repo) so future brands can't repeat it.

## Tasks
| # | Task | Squad · lane | Files it owns | Depends on | Risk |
|---|------|--------------|---------------|------------|------|
| 1 | Add Vitest + Testing Library + jsdom; `test` and `test:coverage` scripts; tests for content integrity (every scene/gallery/paint image exists in `public/film`, every `data-scene` id exists in `SCENES`, every `INDEX` id exists), `Split` (aria-label, letters), `ready` helpers, preloader URL list | build · frontend | `package.json`, `vitest.config.ts`, `src/**/*.test.ts(x)`, `src/test/**` | — | med |
| 2 | Accessibility: `:focus-visible` rings, a skip link, keyboard arrows on the paint radio group, check muted-text contrast, keep custom cursor off for keyboard users | build · frontend | `src/index.css`, `src/site/PaintSection.tsx`, `src/site/Nav.tsx`, `src/site/Cursor.tsx` | — | low |
| 3 | Code-quality limits: split long effect functions (>50 lines) in `Stage.tsx`, `Gallery.tsx`, `Preloader.tsx` into named helpers, no behaviour change | build · frontend | `src/site/Stage.tsx`, `src/site/Gallery.tsx`, `src/site/Preloader.tsx` | 1 | med |
| 4 | Brand assets: Nocturne favicon (SVG), remove unused `icons.svg`, `SITE_URL` read from `VITE_SITE_URL` with the localhost fallback | build · frontend | `public/favicon.svg`, `public/icons.svg`, `vite.config.ts`, `index.html` | — | low |
| 5 | README (recruiter-ready), project `CLAUDE.md` (commands, structure, rules), update `CREDITS.md`/`SECURITY.md` if needed | docs | `README.md`, `CLAUDE.md`, `CREDITS.md`, `SECURITY.md` | 1–4 | low |
| 6 | CI workflow (lint, typecheck, test, build, audit) for when the repo goes to GitHub; `.env.example` with `VITE_SITE_URL`; review `vercel.json` + `_headers` | devops | `.github/workflows/ci.yml`, `.env.example`, `vercel.json`, `public/_headers` | 1, 4 | low |

All Build tasks are one lane (`frontend`): a single builder, run in order 1 → 2/4 → 3.

## Design
No UI changes beyond accessibility (focus rings, skip link) and the favicon. DESIGN.md does not exist; the Designer reviews against the current site and WCAG 2.2 AA, and records the design in the registry.

## Contract
Not needed (no backend).

## Out of scope
- Creating the GitHub repo, pushing, and deploying to Vercel (needs a remote; user chose local git for now).
- New sections, copy or images. The next brand. The Reel (that's the Studio squad later).

## Risks and open questions
1. **Coverage scope.** The page is mostly scroll animation (GSAP/ScrollTrigger), which jsdom can't run for real. Proposal: 80% on the logic files (`content.ts`, `Split.tsx`, `ready.ts`, preloader URL list, `Nav`, `ChapterIndex`), and the animation components checked by the screenshot audit instead. Alternative: 80% on all of `src/` with GSAP mocked (slower, tests mostly mocks).
2. **Live domain** unknown → `VITE_SITE_URL` stays a `[TODO]` until Vercel gives the URL.
3. **Task 3 refactor** touches the animation engine; Review must recheck the screenshots, not only the code.
