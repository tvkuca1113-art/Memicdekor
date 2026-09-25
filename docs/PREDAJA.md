# Predaja: redizajn stranice Memić Dekor

Stanje na dan 25. 9. 2026. Grana: `claude/new-session-w62h05`.

> **Važno ograničenje rada:** domena `memic.ba` (kao i web.archive.org, Instagram i Facebook) bila je
> blokirana mrežnom politikom radnog okruženja. Originalne stranice nisu otvorene niti preuzete, a tri
> navedene originalne fotografije nisu preuzete. Sadržaj je zasnovan na provjerenim podacima iz zadatka i
> na isječcima javnog indeksa pretraživača za stranice memic.ba (vidi „Evidencija nepotvrđenih podataka”).
> Mjesta za originalne fotografije su jasno označena i popunjavaju se jednom naredbom (vidi niže).

## 1. Šta je implementirano

- Next.js 16.3.6 (App Router), React 19, TypeScript, CSS moduli. Sve stranice su statički generisane,
  a sadržaj i metapodaci su u serverskom HTML-u.
- Stranice: `/`, `/proizvodi/`, `/proizvodnja/`, `/usluge/`, `/digital-print/`, `/water-jet/`, `/o-nama/`,
  `/kontakt/` i stranica 404. Adrese stranica koje postoje na memic.ba su zadržane.
- Početna po traženom redoslijedu: hero, „Od ideje do izrade.”, „Šta uređujete?”, „Keramika i oprema za
  vaš prostor.”, „Detalji iz ponude i izrade.”, „Posjetite naš salon u Mostaru.”, česta pitanja,
  „Recite nam šta uređujete.” (forma) i podnožje.
- Zaglavlje: originalni logo (samo obrezane prozirne margine), navigacija, telefon od 1280 px, dugme
  „Pošaljite upit” od 640 px, a sklopivi meni ispod 1080 px. Meni je nativni modalni `<dialog>`:
  Escape ga zatvara, fokus se vraća na dugme, a pozadina je inertna i ne skrola se.
- Hero: art direction preko `<picture>` (portretna fotografija do 767 px, pejzažna od 768 px). Preuzima
  se samo jedna varijanta, uz `fetchpriority="high"` i rani preload s `media` upitom. Tekst je u normalnom
  toku dokumenta, uz napomenu „Ilustrativni prikaz prostora.”
- Forma za upit (Ime, E-mail ili telefon, Šta uređujete?, Poruka) koristi Server Action.
  - Ista validacija radi u pregledniku i na serveru.
  - Tokom slanja prikazuje se stanje slanja, a greške su razumljive i vezane za polja preko `aria-describedby`.
  - Uspjeh se prikazuje tek kada servis za e-poštu vrati ID poruke.
  - Pri grešci uneseni tekst ostaje u formi, uz link za slanje iste poruke e-mailom i poziv na telefon.
  - Forma radi i bez JavaScripta (server vraća greške), a skriveno polje štiti od automatskih poruka.
  - Upload fotografija namjerno nije dodan: korisnik se upućuje na info@memic.ba.
- SEO:
  - `lang="bs"`, jedan H1 po stranici i jedinstveni title i description.
  - Canonical, Open Graph i Twitter kartica, `sitemap.xml` i `robots.txt`.
  - JSON-LD `HomeGoodsStore` (podtip `LocalBusiness`) i `BreadcrumbList`, bez koordinata, radnog
    vremena, ocjena i cijena.
  - 301 mapa starih URL-ova.
  - Pregled je `noindex`; produkcija se indeksira samo uz `SITE_INDEXABLE=true`.
- Sav tekst, kontakti, navigacija, fotografije i preusmjerenja su u tipiziranim datotekama u `src/content/`.

## 2. Pokretanje i pregledna verzija

```bash
npm install
npm run build
npm run start                 # http://localhost:3000
```

Za razvoj: `npm run dev`. Konfiguracija je u `.env.example`.

Javna pregledna ni produkcijska verzija **nisu objavljene**, jer objava zahtijeva posebno odobrenje.
Kod je na grani `claude/new-session-w62h05`. Ako je repozitorij povezan s Vercelom, pregledna verzija
nastaje automatski za tu granu i ostaje `noindex`, jer Vercel preview nikad nije indeksabilan.

## 3. Screenshotovi

Snimljeni su s gustoćom 2× i smanjeni na CSS veličinu, iz produkcijske izvedbe:

| Datoteka | Prikaz |
| --- | --- |
| [pocetna-390x844.jpg](screenshots/pocetna-390x844.jpg) | Mobitel, prvi ekran |
| [pocetna-768x1024.jpg](screenshots/pocetna-768x1024.jpg) | Tablet, prvi ekran |
| [pocetna-1440x900.jpg](screenshots/pocetna-1440x900.jpg) | Računar, prvi ekran |
| [pocetna-cijela-390.jpg](screenshots/pocetna-cijela-390.jpg) | Cijela početna, mobitel |
| [pocetna-cijela-1440.jpg](screenshots/pocetna-cijela-1440.jpg) | Cijela početna, računar |
| [meni-390x844.jpg](screenshots/meni-390x844.jpg) | Otvoren mobilni meni |
| [kontakt-cijela-390.jpg](screenshots/kontakt-cijela-390.jpg) | Kontakt i forma, mobitel |
| [proizvodi-1440x900.jpg](screenshots/proizvodi-1440x900.jpg) | Proizvodi |
| [water-jet-1440x900.jpg](screenshots/water-jet-1440x900.jpg) | Podstranica usluge s mjestom za fotografiju |

Ponovno snimanje: `npm run build && npm run start`, zatim `npm run screenshots`.

## 4. Rezultati provedenih provjera

### Automatske provjere (sve prolaze)

| Provjera | Rezultat |
| --- | --- |
| `npm run typecheck` (TypeScript) | bez grešaka |
| `npm run lint` (ESLint, Next core-web-vitals) | bez grešaka i upozorenja |
| `npm test` (Vitest) | 43/43 |
| `npm run build` | 8 stranica + sitemap, robots i ikona statički generisani |
| `npm run test:e2e` (Playwright, Chromium 141) | 70/70 |

E2E testovi pokrivaju:
- **Navigacija:** sve stavke, `aria-current` i povratak logom na početnu i na vrh.
- **Sidra i link za preskakanje:** sidra ne završavaju ispod sticky zaglavlja, a link za preskakanje vodi na sadržaj.
- **Meni:** Escape, povratak fokusa, fokus zarobljen u meniju, rad nakon skrolanja i dodirne površine od najmanje 44 px.
- **FAQ:** radi mišem i tastaturom.
- **Kontakt linkovi:** `tel:+38736281301` i `mailto:info@memic.ba`, bez WhatsAppa.
- **Forma:**
  - validacija i fokus na prvo neispravno polje;
  - stanje slanja i uspjeh tek nakon potvrde servisa, uz provjeru sadržaja poruke koju je primio servis;
  - greška servisa i slanje bez podešenog servisa;
  - rad bez JavaScripta.
- **SEO:** title, description, canonical, Open Graph, robots, hijerarhija naslova i JSON-LD na svih 8
  stranica, sitemap, robots.txt, 301 mapa i 404.
- **Raspored:** bez horizontalnog skrolanja i bez preklapanja u zaglavlju na 320, 360, 390, 430, 768,
  1024, 1440 i 1920 px, te na svim stranicama.
- **Mjere:** zaglavlja, loga, naslova i dugmeta na 390 i 1440 px.
- **Hero fotografija:** samo jedna varijanta po uređaju.
- **Uvećan tekst (200 %):** bez odsijecanja.
- **Kretanje:** `prefers-reduced-motion` se poštuje.
- **Lijene slike:** slike ispod prvog ekrana se učitavaju lijeno.
- **Pristupačnost:** axe-core bez nalaza (WCAG 2.0/2.1/2.2 A i AA) na svih 8 stranica, na 1440 i 390 px,
  te u stanjima otvorenog menija, forme s greškama i otvorenih pitanja.

Ručno je provjereno i da skripta za fotografije odbija lažne i premale datoteke. Njen puni tok je
isproban s privremenom datotekom, koja je zatim uklonjena: slika se ugradi, a stara `wp-content` adresa
vodi 301 na novu.

### Kontrast teksta preko fotografije (izmjereno na stvarnoj izvedbi)

Iz DOM-a se uzima položaj svakog reda teksta. Tekst se zatim sakrije, a za svaki piksel pozadine
(fotografija i gradijent) računa se WCAG kontrast s bojom teksta. Tabela prikazuje **najmanju**
vrijednost, tj. najsvjetliji piksel iza teksta. Pragovi su 4,5:1 za normalan tekst i 3:1 za naslov.

| Ekran | Nadnaslov | H1 | Opis | Pogledajte proizvodnju | Napomena |
| --- | --- | --- | --- | --- | --- |
| 320×700 | 8,03 | 8,61 | 6,55 | 9,65 | 8,98 |
| 390×844 | 14,78 | 9,28 | 6,93 | 9,09 | 9,12 |
| 768×1024 | 12,40 | 9,28 | 12,50 | 12,95 | 12,33 |
| 1024×768 | 11,76 | 10,60 | 14,75 | 12,15 | 13,01 |
| 1440×900 | 14,39 | 10,33 | 14,07 | 8,43 | 12,86 |
| 1920×1080 | 14,41 | 9,22 | 12,99 | 16,34 | 13,51 |

Kontrast na jednobojnim podlogama provjerava axe; nalaza nema. Računske vrijednosti ključnih boja:
- tekst #171A1C na #F7F5F1: 16,1:1;
- sporedni tekst #5B6065 na #F7F5F1: 5,8:1, a na #EFEBE4: 5,3:1;
- bijelo na #0068B5: 5,8:1, a na #00538F (hover): 8,0:1;
- #0068B5 kao link na #F7F5F1: 5,3:1.

### Performanse: Lighthouse 13.5, laboratorijski (simulirano)

Ovo su **laboratorijske** vrijednosti na lokalnoj produkcijskoj izvedbi (Chromium 141). Mobilni profil
Lighthouse simulira sporo 4G (RTT 150 ms, ~1,6 Mbit/s) i 4× sporiji procesor.

| Stranica | Profil | Performance | FCP | LCP | TBT | CLS | Accessibility | Best practices |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Početna | mobitel (medijan 3 mjerenja) | 95 | 1,1 s | 2,9 s | 40 ms | 0 | 100 | 100 |
| Početna | računar | 100 | 0,3 s | 0,7 s | 0 ms | 0 | 100 | 100 |
| Kontakt | mobitel | 95 | 0,9 s | 2,8 s | 110 ms | 0 | 100 | 100 |
| Kontakt | računar | 100 | 0,3 s | 0,6 s | 0 ms | 0 | 100 | 100 |
| Water jet | mobitel | 99 | 0,9 s | 2,2 s | 30 ms | 0 | 100 | 100 |

- **SEO kategorija u pregledu:** iznosi 69 samo zato što je pregled namjerno `noindex`. U produkcijskom
  načinu (`SITE_INDEXABLE=true`) ista provjera daje SEO 100 za `/`, `/kontakt/` i `/proizvodi/`.
- **LCP element:** na mobitelu je to hero fotografija (AVIF, ~34 KB za 750 px). Bez simuliranog
  usporavanja izmjereni LCP je 133 ms.
- **Isprobane optimizacije:**
  - Responzivni logo niskog prioriteta smanjio je simulirani mobilni LCP s 3,3 na 2,9 s.
  - `inlineCss` i uklanjanje preloada fontova nisu donijeli korist, pa su vraćeni.
- **Terenski podaci (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 na 75. percentilu) još ne postoje**, jer
  stranica nije objavljena. TBT iz laboratorije nije mjera INP-a. Nakon objave pratite CrUX/Search Console
  ili RUM (npr. Vercel Speed Insights).

### Poređenje sa smjernicama (slike 04 i 05)

| Stavka | Stanje |
| --- | --- |
| Logo | Originalni PNG, samo bez prozirnih margina, WebP bez gubitaka. Širina je 172 px na mobitelu i 252 px na računaru. Logo u smjernici je generisan, pa je proporcija originala šira i niža. |
| Zaglavlje | 84 px na računaru i 68 px na mobitelu. Navigacija i dugme kao u smjernici. Telefon se prikazuje od 1280 px, kada ima mjesta. |
| Prijelomi naslova | „Keramika po / mjeri vašeg / prostora.” na računaru i na mobitelu, kao u smjernicama. |
| Veličine naslova | 84 px na 1440 px, 44 px na 390 px i 41 px na 320 px. |
| Tekst i fotografija | Tekst je lijevo, keramičko ostrvo desno, a tamni gradijent je ispod teksta. Na mobitelu je gradijent jači u zoni teksta, a ostrvo se vidi ispod dugmadi. |
| Glavno dugme | Jedno dominantno plavo dugme. Na 390 px zauzima punu širinu (350 × 54 px) i vidljivo je bez skrolanja. |
| Bočne margine | 20 px na mobitelu; na računaru je sadržaj širok najviše 1280 px. |
| Usluge na mobitelu | Jedan stupac (naslov, fotografija, opis, link); na računaru tri stupca s tankim razdjelnicima. |
| Fotografije | Hero fotografije su priložene u rezoluciji 1440 × 810 i 768 × 960 px. Na 1920 px i na 3× ekranima prikazuju se uvećano, pa su blago meke. Preporučuju se veće izvorne datoteke. Fotografije usluga su mjesta u pripremi, jer originali nisu bili dostupni. |

Priložene datoteke nisu bile istim redoslijedom kao u opisu zadatka. Namjena je zato određena po
sadržaju:
- 5.png je logo;
- 3.jpg (pejzažna) je hero za računar;
- 2.jpg (portretna) je hero za mobitel;
- 4.jpg je desktop smjernica;
- 1.jpg je mobilna smjernica.

## 5. Preostali konfiguracijski zadaci

1. **Originalne fotografije.** Omogućite pristup domeni `memic.ba` (postavke okruženja → Network
   access), pa pokrenite `npm run photos:fetch` (postolje, digitalni print, water jet). Fotografije salona,
   umivaonika, kuhinjskih ploča, gazišta i mozaika dodajte s
   `npm run photos:add -- <id> <datoteka> "izvor"`. Zatim pokrenite `npm run build`. Id-jevi su u
   `src/content/images.ts`. Nakon dodavanja provjerite alt tekstove i kadriranje (`focus`).
2. **Slanje forme.**
   - Otvorite Resend račun i verifikujte domenu memic.ba (DNS zapisi SPF/DKIM).
   - Postavite `RESEND_API_KEY` i `CONTACT_FROM_EMAIL` (npr. `Web upit <upit@memic.ba>`).
   - **Stvarna dostava još nije testirana**, jer nema ključa: testirana je samo sa zamjenskim servisom.
     Nakon podešavanja pošaljite probni upit.
   - Ako firma radije koristi svoj SMTP, `src/lib/contact/delivery.ts` je jedino mjesto za izmjenu.
3. **Domena i indeksiranje.**
   - Na produkciji postavite `SITE_URL=https://memic.ba` i `SITE_INDEXABLE=true`.
   - Nakon objave prijavite sitemap u Google Search Console i Bing Webmaster Tools.
4. **Potvrda podataka** (vidi tabelu u odjeljku 6): adresa „294” ili „bb”, lokacija na Google kartama,
   aktuelne boje bazenske keramike, model B2351MC, izvoz na tržišta zapadne Evrope i rad na većim projektima.
5. **Stari URL-ovi.**
   - Preuzmite puni popis sa starog WordPressa (`/wp-sitemap.xml` ili `/sitemap_index.xml`) i za
     proizvode dodajte pojedinačna pravila u `src/content/redirects.ts`. Trenutno opšta pravila vode
     ostatak kataloga na `/proizvodi/`.
   - Odlučite o `/novosti/`, `/opste-informacije/` i `/test/`; sada vraćaju 404, jer sadržaj nije bio dostupan.
6. **Kazino sadržaj na staroj stranici.** Stanje nije moglo biti provjereno. Javni indeks nije vratio
   kazino stranice pod memic.ba, ali to ne isključuje kompromitaciju. Nova stranica ne preuzima nijedan stari
   HTML ni skriptu. Prije migracije pregledajte WordPress:
   - korisnike, pluginove i teme;
   - `wp_options` (siteurl/home);
   - `.htaccess`, cron i PHP datoteke u `uploads`;
   - Search Console → Security issues te `site:memic.ba casino` u Googleu.
   Staru instalaciju isključite nakon prelaska.
7. **Logo u vektoru** (SVG/PDF/AI) za oštriji prikaz i kvalitetniju ikonu (favicon/apple-touch-icon).
   Trenutni izvor je PNG od 550 × 200 px.
8. **Politika privatnosti.** Forma prikuplja lične podatke. Kratka napomena postoji, a pravni tekst treba
   pripremiti s firmom.
9. **Hosting i zaglavlja.** Stranica treba Node.js server (npr. Vercel) zbog forme. Nakon izbora hostinga
   po želji dodajte Content-Security-Policy.
10. **Društvene mreže.** Potvrdite profil `@memicdekor_`; u indeksu se pojavljuje i `@memic_dekor_mostar`.

## 6. Evidencija ilustrativnih fotografija i nepotvrđenih podataka

### Fotografije

| Fotografija | Gdje | Porijeklo | Status |
| --- | --- | --- | --- |
| Kuhinja s keramičkim ostrvom (računar i mobitel) | Hero početne, OG slika | Priloženo uz zadatak | **Ilustrativni prikaz, nije projekat firme.** Označeno u hero sekciji („Ilustrativni prikaz prostora.”) i u podnožju. |
| OG slika (`public/og/memic-dekor.jpg`) | Dijeljenje na mrežama | Hero fotografija i originalni logo | Ilustrativno |
| Postolje za umivaonik (Grigio Luna) | Usluge (rezanje), `/proizvodnja/`, `/proizvodi/` | memic.ba (URL u `photo-sources.json`) | Nije preuzeto (blokirana domena). Prikazuje gotov proizvod, pa je opisano kao „Gotov proizvod”, a ne kao postupak rezanja. Opis je izveden iz imena datoteke; potvrditi uz fotografiju. |
| Digitalni print | Usluge, `/digital-print/` | memic.ba | Nije preuzeto; alt tekst potvrditi uz fotografiju |
| Water jet | Usluge, `/water-jet/` | memic.ba | Nije preuzeto. Ne tvrdi se vlasništvo ni model mašine. |
| Salon, umivaonici, kuhinjske ploče, gazišta, mozaici | Salon, „Detalji iz ponude i izrade”, `/o-nama/` | Treba dostaviti firma | Mjesta u pripremi |

Zasluge fotografa i partnera nisu mogle biti provjerene na memic.ba. Kada su poznate, upišite ih u polje
`credit` u `src/content/images.ts`; prikazuju se ispod fotografije („Foto: …”). Fotografije drugih brendova
ne treba prikazivati kao Memić projekte.

### Podaci

„Zadatak” znači provjereni podatak iz opisa zadatka. „Indeks” znači isječak javnog indeksa pretraživača
za stranice memic.ba: stranica nije otvorena direktno, pa podatak treba potvrditi.

| Podatak | Gdje se koristi | Izvor | Status |
| --- | --- | --- | --- |
| Memić Dekor d.o.o., +387 36 281 301, info@memic.ba | Svuda, JSON-LD | Zadatak i indeks | Potvrđeno |
| Maršala Tita 294, 88000 Mostar | Svuda, JSON-LD | Zadatak i indeks | Potvrditi: raniji kontakt je navodio „Maršala Tita bb”, a jedna stranica „294 – Bišće polje” |
| Faks +387 36 281 302, memicdekor@bih.net.ba | Ne koristi se | Indeks (stara kontakt stranica) | Odlučiti da li je još aktuelno |
| Link lokacije (Google karte, pretraga adrese) | Salon, kontakt | Sastavljeno od adrese, bez koordinata | Provjeriti da pretraga pokazuje salon |
| Ponuda: pločice, veliki formati, umivaonici, sanitarna oprema; izrada umivaonika, ploča, stolova, gazišta, okapnica, mozaika | Više stranica | Zadatak | Potvrđeno |
| Rezanje dijamantnim alatom i vodenim mlazom, digitalni print | Usluge | Zadatak i indeks | Potvrđeno |
| Water jet: keramika, staklo, željezo, kamen; abraziv (granulirano staklo ili pijesak); bez pukotina | `/water-jet/` | Indeks | Potvrditi |
| Digitalni print: vlastita fotografija, panorama, lik iz filma, umjetničko djelo; kopiranje dekora iz kolekcije dizajnera | `/digital-print/` | Indeks | Potvrditi |
| Podgradni umivaonici: izbor keramike i dimenzija; oblici mala i velika elipsa, kocka, pravougaonik | Proizvodi, proizvodnja | Indeks | Potvrditi |
| Nadgradni umivaonici: od jednostavnih do „mramornih ili zlatnih” | Proizvodi | Indeks | Potvrditi |
| Mozaik u plavim, bež i narandžastim tonovima; bazenska keramika u plavim i zelenim | Proizvodi | Indeks („trenutno u ponudi”) | Potvrditi da je aktuelno |
| Model B2351MC (Sanitarija → WC šolje) | Proizvodi, 301 | Indeks | Potvrditi |
| Proizvodnja u sklopu izložbenog salona; rezanje pločica i izrada mozaika kao osnovna djelatnost | Više stranica | Indeks | Potvrditi |
| Izvoz na tržišta zapadne Evrope; prihvatanje većih obima posla | `/proizvodnja/`, `/o-nama/` | Indeks | Potvrditi |
| Misija (kvalitetni proizvodi, savremena tehnologija, projekti od industrijskih do umjetničkih) | `/o-nama/`, `/usluge/` | Indeks | Potvrditi |
| Radno vrijeme | Ne navodi se | – | Nije potvrđeno; stranica upućuje na telefon |

Namjerno nije preuzeto: cijene i „akcijske cijene”, rokovi, broj godina rada i projekata, recenzije,
godina osnivanja iz vanjskih registara, zalihe i besplatne usluge.

## 7. Upute za uređivanje sadržaja

Svi tekstovi i podaci su u `src/content/`. Nakon izmjene pokrenite `npm run check` i `npm run build`.

| Šta mijenjate | Datoteka | Napomena |
| --- | --- | --- |
| Telefon, e-mail, adresa, link karte, društvene mreže | `site.ts` (`company`, `socialProfiles`) | Automatski se ažuriraju zaglavlje, meni, podnožje, kontakt, forma i JSON-LD |
| Glavna navigacija i podnožje | `site.ts` (`mainNav`, `footerNav`) | Svaka stavka mora imati postojeću stranicu (provjerava test) |
| Title, description, naziv u mrvicama | `pages.ts` | Description 110–160 znakova (provjerava test) |
| Tri usluge na početnoj | `services.ts` | `photo` je ključ iz `images.ts` |
| „Šta uređujete?”, kategorije, katalog, izrada po mjeri, koraci | `offer.ts` | `id` je sidro (npr. `/proizvodi/#umivaonici`) |
| Česta pitanja | `faq.ts` | Kratki odgovori, bez obećanja rokova i cijena |
| Opisi, alt tekstovi, zasluge fotografija | `images.ts` | `origin`: `original` ili `illustrative` |
| Nova originalna fotografija | `npm run photos:add -- salon ./salon.jpg "Fotografija firme"` | Provjera formata i veličine, uklanjanje EXIF/GPS, max 2400 px |
| Stari URL → nova stranica | `redirects.ts` | Uvijek 301 na najbližu stranicu, nikad na početnu |
| Boje, pisma, razmaci | `src/app/globals.css` (tokeni u `:root`) | Kontrast ponovo provjerite testom `tests/e2e/contrast.spec.ts` |
| Hero fotografije | `design/` i `npm run assets` | Zamijenite `hero-desktop-izvorna.jpg` i `hero-mobitel-izvorna.jpg`, pa pokrenite `npm run assets` i kontrastni test |

Pravopis: koriste se bosanski oblici (kupatilo, rješenja, mjera, pločice, umivaonik, šta). Test
`tests/unit/content.test.ts` upozorava na hrvatske ili srpske varijante i na zabranjene tvrdnje
(besplatno, popust, recenzije, nagrade, cijene).
