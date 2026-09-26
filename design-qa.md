# Provjera dizajna — usluge i radovi Memić Dekora

final result: passed

Lokalna provjera i provjera javne objave završene su uspješno. Prethodna završena provjera uvodne fotografije sačuvana je u `docs/qa/uvod-2026-09-26.md`.

## Opseg i smjernica

Korisnik traži jasniju i zanimljiviju prezentaciju usluga i stvarnih radova uz postojeću neprekinutu uvodnu fotografiju. Odabrani smjer je ista tipografija i paleta, veće izvorne fotografije, izbor radova po kategorijama i direktan upit za odabrani primjer. Ovo je promjena strukture prema stvarnom sadržaju, a ne kopiranje rasporeda referentne stranice.

Izvori i odluke: `docs/PREZENTACIJA-USLUGA-2026-09-26.md`. Početno stanje: `docs/research/usluge-v2/01-prije.png`. Završne lokalne površine: `docs/screenshots/prezentacija-v2/`, pri 390 × 844 i 1440 × 900 px. Snimci pojedinačnih sekcija obuhvataju cijelu sekciju; dijalozi i uvod su snimci vidljivog ekrana. Snimljeno pri gustoći 2 i svedeno na CSS širinu.

## Nalazi i popravke

1. [P1, riješeno] Fotografija gotovog umivaonika uz rezanje nije objašnjavala predmet usluge. Zamijenjena je izvornim gazištima uz izričit natpis da je riječ o gotovoj izradi. Digitalni print ima motiv Starog mosta; water jet ima izvornu fotografiju postupka.
2. [P1, riješeno] Mala galerija bez opisa nije jasno razdvajala Memićev doprinos od ostatka interijera. Sada šest radova ima opis obima izrade, provjerene detalje, odgovarajuće zasluge i link na izvornu objavu.
3. [P2, riješeno] Korisnik je nakon odabira rada morao sam ponoviti kontekst u formi. Novi CTA prenosi naziv rada i vrstu prostora u promjenjivu poruku, uz provjeru dozvoljenih identifikatora na serveru.
4. [P2, riješeno] Dug opis projekta na mobitelu mogao je udaljiti dugme za zatvaranje. Dugme sada ostaje pri vrhu dijaloga i nakon skrolanja. Tastatura, Escape i povratak fokusa provjereni su.
5. [P2, riješeno] Kvadratni desktop kadar nepotrebno je povećavao i odsijecao izvornu fotografiju digitalnog printa. Usluge koriste 4:3 kadar; fotografija i tekst pregledani su ponovo.
6. Snimanje cijele sekcije u prvom pokušaju postavilo je fiksno zaglavlje usred izvezene slike. Ovo je bio artefakt snimanja, ne položaj zaglavlja pri normalnom korištenju. Završni snimci izdvojeni su iz preglednikovog snimka cijele stranice pri vrhu.

## Vizuelni i jezički pregled

- Jedinstvena uvodna scena, logo, boje i fontovi zadržani su. Poveznica „Naši radovi” vodi direktno na novu galeriju.
- Slike, natpisi, naslovi, praznine, CTA i oštrina pregledani su na desktop i mobilnim snimcima. Originali ostaju neizmijenjeni osim optimizacije veličine; uvećani pregled prikazuje cijelu fotografiju.
- Umivaonici, stol, komoda, kuhinjske keramičke površine i zidna obloga odgovaraju svojim opisima. Drvena radna ploča u projektu zidne obloge nije predstavljena kao keramika.
- Mobilni prikaz usluga otvara opis i sliku unutar odabrane stavke. Desktop prikazuje fotografiju pored izbora. Galerija ima tri, dvije ili jednu kolonu prema raspoloživoj širini.
- Pregledani su bosanski pravopis i ijekavica. Ispravljeni su zarez prije „te” i formulacija o gazištima i okapnicama. Kontakti su usklađeni s originalnom stranicom.

## Funkcionalni dokazi

TypeScript i ESLint: uspješni. Unit testovi: 52 uspješna. Produkcijska izvedba: uspješna. Playwright: 76 uspješnih testova. Nakon završnog 4:3 kadra: dodatnih 19 uspješnih ciljanih provjera rasporeda i novih interakcija.

Obuhvaćeni su filteri, promjene slika, zatvaranje i fokus dijaloga, predpopunjavanje forme, izbor usluge, relevantni linkovi, navigacija, prikaz pri 320–1920 px, tekst uvećan 200 %, pristupačnost provjerenih stanja i postojeće SEO provjere. Stvarna poruka nije poslana; testovi forme koriste lokalni servis.

## Javna objava

URL: https://memicdekor.vercel.app/

Objavljena implementacija: `f64ff4071963ae215150cb6898dcff70cfa9c182`. Vercel: SUCCESS. Javna stranica provjerena je u pregledniku pri 1363 × 936 px; mobilni prikaz provjeren je lokalno na istoj produkcijskoj izvedbi.

- Filter „Stolovi” ostavio je dva rada. Otvoren je projekat stola i komode, pa druga fotografija komode. Slika se uspješno učitala, uz tačan opis i zasluge partneru. Nema horizontalnog prelijevanja.
- „Želim slično rješenje” otvorilo je kontakt stranicu s nazivom rada u poruci i odabranim drugim prostorom. Vrh sekcije upita: 100,375 px; donji rub zaglavlja: 85 px. Poruka nije poslana.
- Izbor „Digitalni print” promijenio je fotografiju, opis, primjene i link na `/digital-print/`. Potvrđeno je učitavanje izvorne fotografije.
- Dokazi javne objave: `docs/screenshots/prezentacija-v2/objavljeni-projekat.jpg` i `objavljene-usluge.jpg`.
- Zajedničko vizuelno poređenje: `docs/screenshots/prezentacija-v2/poredjenje-usluga.jpg`. Početno i završno stanje prikazuju zadanu uslugu pri ulasku u sekciju nakon klika na njen naslov. Slike su normalizovane na istu veličinu radi poređenja. Raspored je namjerno promijenjen; ne očekuje se pikselna podudarnost.
- Završni pregled na računaru i mobitelu: `docs/screenshots/prezentacija-v2/pregled-redizajna.jpg`. To je kompozicija stvarnih snimaka, ne generisana maketa.

Nakon popravki nema otvorenih P0/P1/P2 nalaza u provjerenim stanjima. Ova provjera nije formalna potvrda potpune WCAG usklađenosti niti mjerenje poslovne konverzije. Estetska ocjena konačnog smjera ostaje korisniku.
