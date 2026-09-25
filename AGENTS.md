<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Projekat: Memić Dekor

- Jezik sadržaja je bosanski (ijekavica: kupatilo, rješenja, mjera, šta). Komentari u kodu su na bosanskom.
- Sav tekst, kontakti, navigacija, fotografije i 301 mapa su u `src/content/`; komponente ne sadrže podatke o firmi.
- Ne dodavati izmišljene tvrdnje (cijene, popuste, recenzije, nagrade, rokove, zalihe, radno vrijeme).
  Nepotvrđeni podaci i porijeklo fotografija su popisani u `docs/PREDAJA.md`.
- Ilustrativne fotografije moraju ostati označene; originalne fotografije se dodaju skriptom `npm run photos:add`.
- Prije predaje: `npm run check`, `npm run build`, `npm run test:e2e` (Playwright 1.56.1 zbog instaliranog Chromiuma).
- Globalni CSS se uvozi prvi u `src/app/layout.tsx`, da bi ga CSS moduli mogli nadjačati.
- Objava je na Vercelu (`docs/VERCEL.md`). Indeksira se samo kanonska domena i samo uz `SITE_INDEXABLE=true`;
  produkciju objavljuje vlasnik.
