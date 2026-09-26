# Provjera dizajna — Memić Dekor, 26. septembar 2026.

final result: passed

## Cilj i dokazi

Korisnik je odabrao istu kuhinjsku scenu kao jedinstvenu pozadinu i tražio kompaktniji tekst. Vizuelna smjernica: `docs/design/puna-pozadina-smjernica.jpg` (390 × 998 px, normalizovano iz generisanog prikaza). Implementacija: `docs/screenshots/pocetna-390x844.jpg`, `pocetna-1440x900.jpg` i cijele stranice u istom direktoriju. Stanje: početna na vrhu, meni zatvoren, odabrana kuhinja.

## Iteracije

1. [P1] Postojeći portretni kadar 4:5 je pri pokrivanju ekrana 390 × 844 odsijecao slavinu. Dokaz: prva zajednička usporedba `docs/design/poredjenje-mobitel.jpg`. Popravka: zaseban vertikalni kadar iste ilustracije 9:19,5, dok je desktop zadržan.
2. [P2] Na 320 × 700 opis preko fotografije nije dostizao 4,5:1 (izmjereno 4,09). Popravka: sjenčenje na uskom ekranu.
3. [P2] Novi kadar je na 390 × 844 pomjerio svijetlu površinu iza natpisa „Studio keramike · Mostar” (3,07:1). Popravka: lokalni sloj ispod donjeg lijevog teksta; gornji dio fotografije i desni rub ostaju otvoreni. Popravka potvrđena u završnoj zajedničkoj usporedbi i ponovljenim testovima na šest širina. Na 390 × 844 izmjeren je 2. percentil kontrasta 5,63:1 za natpis i 8,51:1 za naslov; to nije tvrdnja da svaki pojedini piksel ima isti kontrast.

## Pregled površina

- Tipografija: DM Serif Display / Manrope, naslov smanjen na 39,39 px na 390 px. Prijelom u dva reda umjesto tri je namjeran: korisnik traži da tekst manje zaklanja fotografiju. Desktop 73,44 px.
- Raspored: jedna fotografija pokriva uvod i zaglavlje. CTA je kompaktan, najmanje 48 px visok. Navigacija kroz sadržaj ostaje vidljiva pri dnu uvoda. Hero je prilagođen visini stvarnog viewporta, a ne rasterizovan na dimenzije makete.
- Boje: postojeća plava brenda, topla svijetla podloga, tamna sekcija usluga. Završna provjera kontrasta prošla je na šest veličina ekrana.
- Slike: stvarni originali za ponudu, projekte i salon; ilustracija uvoda jasno označena. Nema zamjenskih nacrtanih slika ili novog loga.
- Sadržaj: bosanski pravopis, izvorni kontakti; u galeriji zasluge partneru bez pogrešnog označavanja kao fotografa. Bez izmišljenih recenzija, statistika ili nagrada.

## Funkcionalni dokazi

Provjereni su izbor prostora mišem i tastaturom, meni, CTA, sidra, FAQ, telefonski i e-mail linkovi. Testovi forme koriste lokalni servis; stvarna dostava nije testirana. Provjera na 320–1920 px uključuje prelijevanje i uvećanje teksta 200 %. npm run check: 52 testa, TypeScript i ESLint uspješni. Produkcijska izvedba uspješna. Playwright: 71 test uspješan, pa dodatnih 6 provjera kontrasta nakon ublažavanja prijelaza sjenčenja.

## Kontrolna lista

- Mjerenje kontrasta i završna zajednička usporedba: završeni.
- Fokusirani pregled loga, naslova, dugmadi i fotografske oštrine na istom prikazu: završen.
- Raspored pri 390 × 844 i 1440 × 900, meni i sekcije: provjereni.
- Objava i provjera u cloud pregledniku: završene na javnoj stranici, bez preostalih P0/P1/P2 nalaza.

## Namjerna odstupanja i gustoća

Snimci su napravljeni u pregledniku pri deviceScaleFactor 2, zatim smanjeni na CSS širinu. Izvorni mockup 784 × 2008 px normalizovan je na 390 × 998 px. Usporedba stavlja izvor i prvih 998 px stvarne stranice jedan pored drugog. Stvarni mobilni viewport je 390 × 844: uvod ispunjava tu visinu, pa sljedeća sekcija dolazi niže nego na maketi. Kompaktni naslov u dva reda, veći dodirni ciljevi i izvorni logo su namjerni funkcionalni izbori prema korisnikovom zahtjevu. Gornji dio kadra ostaje otvoren, slavina vidljiva i fotografija neprekinuta. Nema preostalih vizuelnih P0/P1/P2 nalaza nakon lokalne provjere. Subjektivna potvrda estetskog smjera ostaje korisniku.

## Provjera objavljene stranice

URL: https://memicdekor.vercel.app/

Objavljena implementacija: `dfab3038c237917571192ad3fa10f2694695dd46`; Vercel status SUCCESS. Provjereno u cloud pregledniku pri 1363 × 936 px. Dokaz: `docs/screenshots/objavljena-pocetna.jpg`.

- Uvodna fotografija učitana je i neprekinuto pokriva cijeli uvod iza zaglavlja; horizontalno prelijevanje nije prisutno.
- Klik na „Kupatilo” promijenio je odabranu karticu, fotografiju umivaonika, opis i povezane stranice. Strelica udesno zatim je odabrala „Dnevni boravak” i fotografiju stolića.
- „Pošaljite upit” otvorio je `/#upit`. Vrh sekcije bio je na 100,28 px, ispod donjeg ruba zaglavlja na 85 px.
- U pregledanim zapisima konzole nema greške aplikacije. Prisutni su raniji zapisi ekstenzije preglednika s izvorom `chrome-extension://…`, nevezani za aplikaciju.
- Stvarna poruka putem kontakt forme nije poslana. Njeno ponašanje provjereno je lokalnim automatizovanim testovima navedenim iznad.

Završena je provjera lokalne izvedbe i javne objave. Ovaj rezultat ne predstavlja garanciju svih mogućih uređaja niti formalnu potvrdu potpune WCAG usklađenosti.
