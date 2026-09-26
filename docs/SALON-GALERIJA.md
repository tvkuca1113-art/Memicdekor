# Galerija salona — 26. 9. 2026.

Korisnik je tražio više originalnih fotografija ili videozapisa iz Instagram profila Memić Dekor u sekciji salona. Izmjena zamjenjuje jednu fotografiju galerijom od pet prikaza. Mobilni redoslijed: uvod, galerija, kontakti. Na računaru galerija stoji uz uvod i kontakte.

## Provjereni izvori

| Prikaz | Izvor | Provjera |
| --- | --- | --- |
| Izložbeni prostor | Originalna stranica memic.ba, postojeći `salon.jpg` | Stvarna fotografija salona |
| Novi pult | https://www.instagram.com/p/DQEwGovDP60/ | Izvorni prikaz Reel objave. Opis izričito govori o uređenju salona; na snimku su pult i natpis firme. Preuzeto 640 × 1136 px. |
| Izložbeno kupatilo | Originalna stranica memic.ba, postojeći `kupatilo-salon.jpg` | Izložbena oprema u salonu |
| Detalj pulta | https://www.instagram.com/p/DPvqlxeDFM8/ | Izvorni prikaz Reel objave. Opis potvrđuje novi pult u salonu. Preuzeto 2268 × 4032 px. |
| Sanitarna oprema | Originalna stranica memic.ba, postojeći `sanitarije-salon.jpg` | Tuševi i slavine u salonu |

Instagram je pregledan vizuelno kroz odobreni račun. Dva nova prikaza preuzeta su s URL-ova stvarno prikazanih medija, obrađena skriptom `photos:add` i pohranjena lokalno s izvorima i SHA-256 evidencijom. Nema hotlinkova prema privremenim Instagram CDN adresama.

Video nije preuzet: ugrađeni Instagram video koristi blob izvor, a podržano preuzimanje nije uspjelo. Prikazuje se jasno označen link „Video na Instagramu” na izvornu objavu o novom pultu. Stranica ne učitava Instagram player, kolačiće ni zvuk pri otvaranju.

Starije promotivne objave s isteklim popustima nisu korištene. Projekti kupaca nisu označeni kao salon. Nisu dodavane generisane slike ni nove poslovne tvrdnje.

## Prikaz i upravljanje

- Pet fotografija s vidljivim pregledima i kratkim oznakama.
- Strelice, kružno listanje, odabir dodirom ili tastaturom i horizontalno listanje prstom.
- Bez automatskog mijenjanja slika; vertikalno pomjeranje stranice ostaje slobodno.
- Opis prati odabranu fotografiju; promjena se najavljuje čitaču ekrana.
- Rezervisan omjer glavne fotografije, lokalne optimizovane slike i odgođeno učitavanje.
- Sadržaj i izvori nalaze se u `src/content/salon.ts` i `src/content/images.ts`.

## Provjera

- `npm run check`: TypeScript, ESLint i svih 52 unit testa prolaze.
- `npm run build`: uspješna produkcijska izgradnja.
- `npm run test:e2e`: svih 78 testova prolazi, uključujući galeriju na 390 i 1440 px, učitavanje svih pet fotografija, jedan aktivan odabir, kružno listanje, tastaturu, dostupnost i izvor videa.
- Postojeći testovi rasporeda pokrivaju širine od 320 px; nema horizontalnog prelijevanja.
- Vizuelno pregledani puni snimci sekcije na 390 i 1440 px, s početnom fotografijom i novim pultom. Kadar pulta zadržava natpis firme, opisi prate slike, mali pregledi i kontakti su čitljivi.
- Bosanski tekst pregledan: salon, kupatilo, umivaonik, sljedeća, uporedite, završna obrada. Nema prenesenih promotivnih tvrdnji iz Instagram opisa.
- Prvi pokušaj E2E provjere zaustavljen je jer u okruženju nije bio instaliran preglednik. Nakon službene instalacije Playwright Chromiuma ponovljena je cijela provjera; rezultat iznad odnosi se na završen prolaz.

Snimci: `docs/screenshots/salon/salon-390.jpg`, `pult-390.jpg`, `salon-1440.jpg` i `pult-1440.jpg`. Reproducibilno: `node scripts/capture-salon.mjs` nakon izgradnje.
