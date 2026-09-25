# Memić Dekor – web stranica

Redizajn stranice [memic.ba](https://memic.ba) za Memić Dekor d.o.o., studio keramike iz Mostara:
keramika, sanitarna oprema i izrada po mjeri. Stranica je statički generisana (Next.js), bez korisničkih
računa, webshopa i baze podataka. Jedini serverski dio je slanje forme za upit.

Detaljna predaja (provjere, preostali zadaci, evidencija fotografija i nepotvrđenih podataka, upute za
uređivanje): **[docs/PREDAJA.md](docs/PREDAJA.md)**.

## Tehnologija

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- CSS moduli i globalni dizajn tokeni (`src/app/globals.css`), bez UI biblioteka
- Pisma: DM Serif Display (naslovi) i Manrope (tekst), preko `next/font` (self-hosted, latin + latin-ext)
- Slike: `next/image` / `getImageProps` (AVIF/WebP, srcset), art direction za naslovnu fotografiju
- Forma: Server Action + Resend HTTP API (bez dodatnog paketa)
- Testovi: Vitest (jedinični), Playwright + axe-core (e2e, pristupačnost, kontrast)

## Pokretanje

Potrebno: Node.js 20.9+ (testirano na 22).

```bash
npm install
npm run dev          # razvoj: http://localhost:3000
npm run build        # produkcijska izvedba
npm run start        # posluživanje izvedbe: http://localhost:3000
```

Konfiguracija je u varijablama okruženja; primjer je u [`.env.example`](.env.example):

| Varijabla | Namjena |
| --- | --- |
| `SITE_URL` | Javna domena (zadano `https://memic.ba`) za canonical, sitemap, Open Graph i JSON-LD |
| `SITE_INDEXABLE` | `true` samo na produkciji; inače `noindex` + `robots.txt` Disallow |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` | Slanje forme; bez njih forma javlja da poruka nije poslana |
| `CONTACT_TO_EMAIL` | Primalac upita (zadano `info@memic.ba`) |

## Provjere

```bash
npm run check        # typecheck + lint + jedinični testovi
npm run build && npm run test:e2e   # Playwright: navigacija, meni, forma, SEO, raspored, a11y, kontrast
```

E2E testovi sami pokreću dva servera (`next start` na portovima 3200 i 3201) i lokalnu zamjenu za
Resend API (port 3299), pa provjeravaju i uspješno slanje i greške bez stvarnog slanja e-pošte.
Playwright je vezan na verziju 1.56.1 zbog instaliranog Chromiuma; na drugom računaru pokrenite
`npx playwright install chromium`.

## Struktura

```
src/
  app/            stranice (/, /proizvodi/, /proizvodnja/, /usluge/, /digital-print/, /water-jet/,
                  /o-nama/, /kontakt/), 404, sitemap.ts, robots.ts, globalni stilovi
  components/     zaglavlje, meni, podnožje, sekcije početne, forma, zajedničke komponente
  content/        SAV TEKST I PODACI: kontakti, navigacija, usluge, ponuda, FAQ, fotografije,
                  metapodaci stranica, 301 mapa
  lib/            SEO, JSON-LD, konfiguracija domene, validacija i slanje upita
scripts/          priprema slika, dodavanje originalnih fotografija, screenshotovi
design/           izvorni logo, izvorne naslovne fotografije i vizuelne smjernice (ne objavljuje se)
docs/             predaja i screenshotovi
tests/            jedinični (Vitest) i e2e (Playwright) testovi
```

## Brze upute za uređivanje

- **Kontakti, adresa, društvene mreže, navigacija:** `src/content/site.ts`
- **Naslovi i opisi stranica (SEO):** `src/content/pages.ts`
- **Usluge na početnoj:** `src/content/services.ts`
- **Ponuda, katalog, izrada po mjeri, „Šta uređujete?”:** `src/content/offer.ts`
- **Česta pitanja:** `src/content/faq.ts`
- **Fotografije (opisi, porijeklo, zasluge):** `src/content/images.ts`
- **Nova originalna fotografija:** `npm run photos:add -- <id> <datoteka> "izvor"` pa `npm run build`
- **Stari URL-ovi (301):** `src/content/redirects.ts`

Nakon izmjene pokrenite `npm run check` i `npm run build`. Detalji su u [docs/PREDAJA.md](docs/PREDAJA.md).
