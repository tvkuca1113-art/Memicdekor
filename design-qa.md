# Vizuelna i funkcionalna provjera — Memić Dekor

final result: passed

## Izvori i snimci

- Vizuelni smjer: `design/smjernica-desktop.jpg` (1469 × 1071) i `design/smjernica-mobitel.jpg` (860 × 1829).
- Izvedba: `docs/screenshots/pocetna-1440x900.jpg` i `docs/screenshots/pocetna-390x844.jpg`.
- Preglednici: Chromium, CSS viewport 1440 × 900 / 390 × 844. Snimci projekta nastaju pri gustoći 2× i smanjeni su na CSS veličinu. Izvori su za poređenje skalirani proporcionalno na iste širine, bez rastezanja.
- Kombinovani pregled izvora i izvedbe: `/tmp/memic-desktop-comparison.jpg`, `/tmp/memic-mobile-comparison.jpg` (radni uporedni snimci).
- Stanje: početna stranica, zatvoren meni, učitani fontovi i slike. Dodatno pregledani usluge, izbor prostora, galerija, salon i proizvodnja na javnoj stranici.
- Javna adresa: https://memicdekor.vercel.app/

## Nalazi i dorade

1. [P1, riješeno] Prazna mjesta za fotografije. Uvezeno 11 stvarnih fotografija; javna početna ima 12 prikaza slika, sve se učitavaju i nema placeholdera.
2. [P2, riješeno] Previše taman mobilni hero. Ublažen prekrivajući gradijent, posebno na desnoj strani fotografije, i smanjen gornji razmak sadržaja.
3. [P2, riješeno] Prva svjetlija varijanta nije imala dovoljan kontrast malog natpisa na 320 px (3,2:1). Lokalno pojačan gornji dio gradijenta. Nakon popravke svih 20 provjera kontrasta i rasporeda prolazi.

## Pet provjerenih površina

- Tipografija: serifni naslovi DM Serif Display i čitljivi Manrope za tekst; bosanska slova i prijelomi su ispravni. Nema odsijecanja ni pri uvećanju teksta 200 %.
- Raspored: svijetlo zaglavlje, velika fotografija, lijevo poravnati naslov i poziv na upit; na računaru tri kolone usluga i prostora, na mobitelu jedna. Mobilna dugmad i tekst su namjerno veći nego u rasterizovanoj smjernici, zbog čitljivosti i dodira. Zato je hero viši; naslov i glavni CTA ostaju vidljivi bez skrolanja na 390 × 844.
- Boje: plavi akcent logotipa, bijeli tekst na tamnoj fotografiji i tople svijetle pozadine. Kontrast je provjeren na stvarnim pikselima fotografije, uz automatske WCAG provjere.
- Slike: originalni logo umjesto približne verzije u generisanoj smjernici; stvarne fotografije usluga, prostora i projekata. Namjerne razlike: dokumentarne fotografije imaju prirodnu rasvjetu, a ilustrativni hero ostaje označen. Desktop i mobilni izrez se učitavaju odvojeno; nema preuzimanja obje varijante.
- Sadržaj: bosanski (ijekavica), potvrđeni telefon i adresa, zasluge za saradnju s Modimexom, bez izmišljenih projekata. Gazišta i mozaici ostaju u ponudi, ali ih galerija ne predstavlja nepovezanim slikama.

Poređeni su cjelokupna kompozicija i pojedinačni hero, tipografija, dugmad, logo i slike usluga. Razlike u visini hero sekcije i gustoći sadržaja prihvaćene su kao funkcionalna prilagodba responzivne stranice, a ne reprodukcija rastera piksel po piksel.

## Testovi

- `npm run check`: TypeScript, ESLint i 52 unit testa prolaze.
- `npm run build`: produkcijski build prolazi.
- `npm run test:e2e`: 70 testova prolazi prije završnog podešavanja mobilnog gradijenta.
- Poslije posljednje CSS promjene: svih 20 relevantnih testova kontrasta i rasporeda ponovo prolazi (320–1920 px).
- Pokriveni: mobilni meni i fokus, Escape, navigacija, CTA, sidra, forma s greškama i uspjehom preko lokalnog testnog servisa, 301 preusmjerenja, metadata, robots, sitemap, lazy loading, reduced motion i uvećan tekst.
- Javno provjereni: učitavanje svih fotografija na početnoj, odsustvo horizontalnog prelijevanja, otvaranje kontakta i proizvodnje.
- Konzola: nema uočenih grešaka aplikacije; dvije poruke pripadaju proširenju preglednika.
- Stvarna isporuka e-maila nije testirana; testovi forme koriste lokalnu zamjenu servisa. DNS i postavke indeksiranja nisu mijenjani.

## Preostalo

Nema otvorenih P0/P1/P2 nalaza za ovu doradu. Buduće fotografije gazišta i mozaika mogu proširiti galeriju kada firma dostavi odgovarajuće originale.
