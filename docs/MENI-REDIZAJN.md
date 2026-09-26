# Otvoreni meni — Memić Dekor

## Smjer

Meni koristi istu toplu podlogu, serifne naslove, plavi akcent i originalnu fotografiju keramike kao ostatak stranice. Ponuda je grupisana u tri glavna ulaza: Proizvodi, Izrada po mjeri i Usluge. Kratki opisi objašnjavaju razliku. Početna, O nama i Kontakt ostaju neposredno ispod, uz poseban ulaz u radove.

Na mobitelu je raspored u jednoj koloni. Na tabletu se fotografija prikazuje uz navigaciju. Sadržaj se može skrolati na nižim ekranima, dok zatvaranje, upit i kontakti ostaju dostupni. Nema automatskog videa, dodatne biblioteke za animacije ni obaveznog čekanja prijelaza. Fotografija se učitava tek kada je meni otvoren.

## Istraživanje i primjena

| Izvor | Primijenjena ideja |
| --- | --- |
| [Humaan — Marvell Tile & Stone](https://www.humaan.com/work/marvell-tile-stone) | Urednički raspored, fotografija materijala i mirna hijerarhija. Studija navodi Awwwards Site of the Day i Developer Award 2026. |
| [Marvell](https://www.marvellco.com.au/) | Vizuelno pregledana stranica i navigacija projekata; jasan ulaz u radove. |
| [Mutina](https://www.mutina.it/en/) | Vizuelno pregledane kolekcije u meniju; odnos jasnih kategorija i fotografija materijala. |
| [Clay](https://clay.global/) | Pregled strukture glavnih linkova i dosljednosti identiteta. |
| [Ramotion — Website Navigation](https://www.ramotion.com/blog/website-navigation/) | Prepoznatljivi nazivi, jasna hijerarhija i dosljedna navigacija. |
| [Bricks forum — klikabilne stavke menija](https://forum.bricksbuilder.io/t/mobile-menu-full-width-clickable-navigation-menu-items/4228) | Cijeli red glavne stavke je klikabilan; svaka dodirna površina ima najmanje 44 px visine. |
| [Reddit — rasprava o navigaciji](https://www.reddit.com/r/web_design/comments/1d542qe/) i [druga rasprava](https://www.reddit.com/r/web_design/comments/fb62zs/) | Pregledani indeksirani odlomci, jer direktno otvaranje nije uspjelo. Korisničke diskusije su dodatni kontekst, a ne dokaz univerzalno boljeg rješenja. Vidljiva navigacija na računaru je sačuvana. |
| [WAI — Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Zadržan nativni dialog, fokus unutar menija, Escape, povrat fokusa i blokirano skrolanje pozadine. |

Preuzeti su principi rasporeda, bez kopiranja tuđih fotografija, brendiranja ili koda. Fotografija je postojeći originalni detalj pulta Memić Dekora (`salonPultDetalj`); porijeklo je evidentirano u sadržaju i manifestu fotografija.

## Tekst i podaci

Sadržaj menija je u `src/content/menu.ts`; linkovi i kontakti dolaze iz postojećih podataka firme. Provjereni su nazivi, dijakritički znakovi i bosanska ijekavica: „po mjeri”, „prema vašim mjerama”, „Pošaljite upit”. Nisu dodavane nove tvrdnje o firmi.

## Provjera

Vizuelni snimci lokalne produkcijske izvedbe nalaze se u `docs/screenshots/meni-v2/`: 320 × 568, 390 × 844, 768 × 1024 i 844 × 390. Skripta: `node scripts/capture-menu.mjs`.

Automatizirane provjere uključuju navigaciju, fokus, Escape, dodirne površine, WCAG provjere preko axe i dostupnost zatvaranja/upita nakon skrolanja na malim ekranima. Emulacija Chromiuma ne zamjenjuje provjeru na fizičkom iPhone uređaju.

Rezultat: `npm run check` prolazi (TypeScript, ESLint i 52 testa), `npm run build` prolazi, a cjeloviti skup Playwright provjera ima 80 uspješnih testova. Nakon završnog zbijanja rasporeda za vodoravne ekrane ponovljeni su build, snimci i svih 7 testova mobilnog menija; svi prolaze.
