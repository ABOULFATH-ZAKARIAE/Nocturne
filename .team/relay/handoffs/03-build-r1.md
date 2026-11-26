# Handoff — build (round 1)
Date: 2026-11-26 20:25
Verdict: DONE

## What this squad did
- `6137447 test: add vitest suite with 80% coverage on logic files` — Vitest + Testing Library + jsdom, `test` / `test:coverage` scripts, `src/site/preload.ts` (pure `filmUrls`) extracted for testing, 8 test files / 58 tests
- `72838f9 feat: keyboard accessibility` — `:focus-visible` rings, skip link to `#main`, paint swatches as roving-tabindex radiogroup with arrow keys, custom cursor switches off while the keyboard is used
- `6652707 feat: Nocturne favicon, read VITE_SITE_URL, remove unused icons.svg` (icons.svg sent to the Recycle Bin, then committed as deleted)
- `b180cdf refactor: split long Stage and Preloader functions into named helpers` — no behaviour change (Gallery effect was already 22 lines, left as is)

## Gate checks (real output, quoted)
| Check | Result |
|---|---|
| npm run lint (runner) | 0 errors, 0 warnings |
| npx tsc -b (runner + laptop) | pass |
| npm run test:coverage (runner + laptop) | 8 files, 58 passed / 58; statements 100% (69/69), branches 100% (16/16), functions 100% (31/31), lines 100% (51/51) |
| npx vite build (runner + laptop) | pass; app JS 44.81 kB (gzip 13.26 kB) |
| npm audit (runner) | found 0 vulnerabilities |
| lanes (`git status`) | only planned files + new test/config files changed |
| screenshot audit (lead) | desktop 1440x810 ×15 and phone 390x844 ×8: same visuals as before, no page errors, no horizontal overflow |

## Workers
| Worker | Lane | Status | Files |
|---|---|---|---|
| builder (sonnet) | frontend | DONE | see commits |
| runner (haiku) | checks | DONE | none |

## Open findings
- LOW | src/site/Split.tsx:14 | non-breaking space written as a literal character | write `' '`
- LOW | .gitignore | `coverage/` not ignored (text reporter used for now) | add `coverage`
- LOW | process | builder wrote first test files with a shell heredoc (standards: use Write) | note for /team-review
- MEDIUM | laptop | Node v22.17.0 is below what jsdom deps ask for (>=22.19 / 22.22) — `npm install` warns EBADENGINE; tests still pass | update Node to the current 22 LTS or 24

## For the next squad
1. Reviewers: correctness + quality lenses on the 4 commits; look closely at `Stage.tsx` (diff vs `61803d3`: helper order must stay drift → dissolve → sweep → drive → flicker → torch → intro), `Preloader.tsx` (same URL set/order via `filmUrls`), skip link z-index 110 over the preloader.
2. Designer REVIEW (UI): focus ring offset on `.btn`/`.paint`, skip link look, WCAG 2.2 AA; then add Nocturne to `design/REGISTRY.md` in the team repo.

## Decisions for the user
- Update Node on the laptop (MEDIUM above)? Not blocking.
