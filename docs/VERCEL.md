# Objava na Vercelu – korak po korak

Ovo uputstvo vodi od GitHub repozitorija do stranice na adresi memic.ba. Koraci 1–3 daju radnu
stranicu na adresi `*.vercel.app`, koja se ne indeksira. Koraci 4–7 su prelazak na memic.ba i uključivanje
pretraživača; radite ih tek kada je sadržaj potvrđen.

## Šta je već pripremljeno u kodu

| Stavka | Gdje | Opis |
| --- | --- | --- |
| Postavke za Vercel | `vercel.json` | Next.js, build `npm run build`, serverske funkcije u regiji `fra1` (Frankfurt, najbliža Mostaru) |
| Node.js verzija | `package.json` → `engines.node` | `22.x`, ista verzija na kojoj su rađeni svi testovi |
| Adresa stranice | `src/lib/site-config.ts` | Ako `SITE_URL` nije postavljen, na Vercelu se koristi produkcijska domena projekta, a u pregledima adresa grane |
| Zaštita od indeksiranja | `next.config.ts`, `src/app/robots.ts` | Pregledi (preview) se nikad ne indeksiraju. Produkcija se indeksira samo uz `SITE_INDEXABLE=true` i samo na kanonskoj domeni; `*.vercel.app` i `www` dobijaju `X-Robots-Tag: noindex` |
| Provjera prije objave | `src/lib/deploy-readiness.ts` | Na početku svakog builda, i u Vercel build logu, ispisuje šta još nedostaje: slanje forme, fotografije, indeksiranje |
| 301 preusmjerenja | `src/content/redirects.ts` | Stari WordPress URL-ovi; Vercel ih izvršava prije same stranice |

Provjereno lokalno: `vercel build --prod` (Vercel CLI 60.0.1) završava s „Build completed successfully”.
U izlazu su:
- 10 pravila 301;
- sigurnosna i noindex zaglavlja;
- funkcije na `nodejs22.x`;
- optimizacija slika u AVIF/WebP.

> **Plan:** Vercelov besplatni Hobby plan je prema Vercelovim uslovima namijenjen ličnoj, nekomercijalnoj
> upotrebi. Za stranicu firme predviđen je Pro plan. Provjerite aktuelne uslove na vercel.com/pricing
> prije objave.

## Korak 1: Kod u granu `main`

Vercel objavljuje produkciju iz grane `main`. Spojite pull request s redizajnom u `main` na GitHubu:
otvorite pull request → **Merge pull request**. Svaki kasniji push u `main` automatski pravi novu
produkcijsku verziju. Druge grane dobijaju preview verzije.

## Korak 2: Uvoz projekta na Vercel

1. Na vercel.com: **Add New… → Project → Import Git Repository**.
2. Povežite GitHub i odaberite `tvkuca1113-art/Memicdekor`. Ako repozitorij nije na listi, izaberite
   **Adjust GitHub App Permissions** i dozvolite Vercel aplikaciji pristup tom repozitoriju.
3. Postavke ostavite kako ih Vercel prepozna: Framework **Next.js**, Root Directory `./`. Build i Install
   komande su zadane, a build komandu određuje `vercel.json`.
4. Varijable okruženja za prvu objavu nisu obavezne (vidi korak 4).
5. **Deploy**. Nakon 1–2 minute dobijate adresu oblika `https://<projekt>.vercel.app`.

U build logu (Deployments → deployment → Building) potražite blok „Memić Dekor – provjera prije objave”.
Linije sa znakom `!` su stvari koje treba riješiti prije prelaska na memic.ba.

## Korak 3: Provjera na adresi `*.vercel.app`

- Otvorite sve stranice iz menija na mobitelu i računaru.
- Probni stari URL: `https://<projekt>.vercel.app/shop/` vodi na `/proizvodi/`.
- Forma: bez podešenog Resenda javlja da poruka nije poslana i nudi e-mail i telefon. To je očekivano.
- `https://<projekt>.vercel.app/robots.txt` sadrži `Disallow: /`, jer indeksiranje još nije uključeno.

Preview verzije drugih grana mogu tražiti prijavu na Vercel. To je zadana zaštita pregleda (Settings →
Deployment Protection) i ne utiče na produkcijsku domenu.

## Korak 4: Varijable okruženja

Vercel → projekat → **Settings → Environment Variables**. Nakon svake izmjene pokrenite novu objavu
(Deployments → posljednji deployment → **Redeploy**), jer se vrijednosti ugrađuju pri buildu.

| Naziv | Vrijednost | Okruženje | Kada |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | ključ iz Resenda (`re_…`) | Production (po želji i Preview) | Korak 5 |
| `CONTACT_FROM_EMAIL` | `Web upit <upit@memic.ba>` | Production (i Preview ako je ključ tamo) | Korak 5; domena mora biti verifikovana u Resendu |
| `CONTACT_TO_EMAIL` | `info@memic.ba` | Production | Opcionalno; ovo je zadana vrijednost |
| `SITE_URL` | `https://memic.ba` | samo Production | Korak 6, kada memic.ba pokazuje na Vercel |
| `SITE_INDEXABLE` | `true` | samo Production | Korak 7, posljednji |

Ne postavljajte `SITE_URL` za Preview. Pregledi tada koriste vlastitu adresu i ostaju `noindex`.

## Korak 5: Slanje forme preko Resenda

1. Napravite račun na resend.com → **Domains → Add Domain** → `memic.ba`. Region: EU (Irska).
2. Resend prikazuje DNS zapise (DKIM `resend._domainkey`, te MX i SPF za poddomenu `send`). Dodajte ih kod
   pružaoca DNS usluge za memic.ba. Ti zapisi ne diraju postojeće MX zapise za info@memic.ba.
3. Kada domena pokaže **Verified**: **API Keys → Create API Key** (Sending access), pa ključ upišite u
   `RESEND_API_KEY` na Vercelu, uz `CONTACT_FROM_EMAIL`.
4. Pokrenite **Redeploy** i pošaljite probni upit. Provjerite da je stigao na info@memic.ba i pogledajte
   Resend → Logs. Forma prikazuje „Hvala, vaš upit je poslan.” samo kada Resend potvrdi prijem.

## Korak 6: Domena memic.ba

1. Vercel → **Settings → Domains → Add** `memic.ba`, zatim i `www.memic.ba`. Za `www` odaberite
   preusmjerenje na `memic.ba`.
2. Kod pružaoca DNS usluge za memic.ba **promijenite samo** zapise koje Vercel prikaže:
   - `A` zapis za `@` (Vercel trenutno navodi `76.76.21.21`);
   - `CNAME` za `www` (vrijednost koju prikaže Vercel).

   **Ne mijenjajte nameservere i ne brišite MX i TXT zapise**, jer o njima zavisi e-pošta
   info@memic.ba. Dan ranije smanjite TTL na 300 s, da prelazak bude brži.
3. Sačekajte da Vercel pokaže **Valid Configuration**; SSL certifikat se izdaje automatski.
4. Postavite `SITE_URL=https://memic.ba` (Production) i pokrenite **Redeploy**.
5. Provjerite stare adrese na novoj stranici, npr. `https://memic.ba/product/bazenska-keramika/`
   (vodi 301 na `/proizvodi/#bazenska-keramika`).

## Korak 7: Uključivanje pretraživača (posljednji korak)

Prije toga:
- dodane su originalne fotografije (`npm run photos:fetch` ili `npm run photos:add`, pa push u `main`);
- potvrđeni su podaci iz `docs/PREDAJA.md`, odjeljak 6;
- forma je testirana;
- stara WordPress instalacija je pregledana (kazino sadržaj).

Zatim:
1. `SITE_INDEXABLE=true` (samo Production) → **Redeploy**. U build logu treba pisati
   „Indeksiranje uključeno, samo za host memic.ba” i ne smije biti linija sa `!`.
2. Provjera:
   - `https://memic.ba/robots.txt` sadrži `Allow: /` i `Sitemap: https://memic.ba/sitemap.xml`;
   - `curl -I https://<projekt>.vercel.app` vraća `x-robots-tag: noindex, nofollow`.
3. Google Search Console: dodajte domenu memic.ba (verifikacija DNS TXT zapisom) i prijavite
   `https://memic.ba/sitemap.xml`. Isto u Bing Webmaster Tools.
4. Nakon nekoliko dana pratite izvještaj o 404 greškama i po potrebi dopunite `src/content/redirects.ts`.

## Svakodnevni rad

- Izmjena teksta ili fotografija: uredite `src/content/…` (vidi `README.md`), pokrenite `npm run check` i
  `npm run build`, pa push u `main`. Vercel objavljuje automatski.
- Rizičnije izmjene radite na posebnoj grani: Vercel pravi preview adresu za provjeru prije spajanja u `main`.
- Vraćanje na prethodnu verziju: Deployments → prethodni produkcijski deployment → **Instant Rollback**
  ili **Promote to Production**.

## Česti problemi

| Problem | Rješenje |
| --- | --- |
| Build javlja nepodržanu Node.js verziju | U `package.json` promijenite `engines.node` na verziju koju Vercel nudi (npr. `24.x`), pa pokrenite testove |
| Forma javlja da poruka nije poslana | Provjerite `RESEND_API_KEY` i `CONTACT_FROM_EMAIL`, verifikaciju domene u Resendu i Resend → Logs |
| memic.ba i dalje ima `noindex` | Da li je `SITE_INDEXABLE=true` postavljen za Production, da li je `SITE_URL=https://memic.ba` i da li je pokrenut Redeploy? |
| Stranica pokazuje staru WordPress stranicu | DNS još nije propagiran ili A zapis nije promijenjen; provjerite status domene na Vercelu |
| Fotografije i dalje pokazuju „u pripremi” | Fotografija nije dodana skriptom ili promjena nije pushana u `main` |
