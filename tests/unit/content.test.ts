import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { faq } from '@/content/faq';
import { customItems, catalogSections, spaces, categories } from '@/content/offer';
import { pages } from '@/content/pages';
import { legacyRedirects } from '@/content/redirects';
import { services } from '@/content/services';
import { footerNav, mainNav } from '@/content/site';

const root = path.resolve(import.meta.dirname, '../..');
const appDir = path.join(root, 'src/app');

function routeExists(href: string) {
  const pathname = href.split('#')[0];
  if (pathname === '/') return existsSync(path.join(appDir, 'page.tsx'));
  return existsSync(path.join(appDir, pathname.replace(/^\/|\/$/g, ''), 'page.tsx'));
}

/** Id-jevi sekcija koje postoje na stranicama (za provjeru sidara). */
const anchorsByPath: Record<string, Set<string>> = {
  '/proizvodi/': new Set(catalogSections.map((section) => section.id).concat('izrada-po-mjeri')),
  '/proizvodnja/': new Set(customItems.map((item) => item.id).concat('sta-izradujemo', 'kako-radimo', 'za-projekte')),
  '/usluge/': new Set(['rezanje-dijamantnim-alatom', 'rezanje-vodenim-mlazom', 'digitalni-print', 'vas-materijal']),
  '/kontakt/': new Set(['upit']),
  '/': new Set(['upit']),
};

function assertInternalLink(href: string) {
  expect(href.startsWith('/'), `${href} mora biti interni link`).toBe(true);
  expect(routeExists(href), `ruta za ${href} ne postoji`).toBe(true);
  const [pathname, hash] = href.split('#');
  if (hash) {
    expect(anchorsByPath[pathname]?.has(hash), `sidro #${hash} ne postoji na ${pathname}`).toBe(true);
  }
}

describe('navigacija', () => {
  it('svaka stavka navigacije ima stvarnu stranicu', () => {
    expect(mainNav.map((item) => item.label)).toEqual(['Proizvodi', 'Izrada po mjeri', 'Usluge', 'O nama', 'Kontakt']);
    [...mainNav, ...footerNav].forEach((item) => assertInternalLink(item.href));
  });

  it('linkovi iz sadržaja vode na postojeće stranice i sidra', () => {
    services.forEach((service) => assertInternalLink(service.href));
    spaces.flatMap((space) => space.links).forEach((link) => assertInternalLink(link.href));
    categories.forEach((category) => assertInternalLink(category.href));
    faq.forEach((item) => item.link && assertInternalLink(item.link.href));
  });
});

describe('301 mapa', () => {
  it('ima jedinstvene izvore i nikad ne preusmjerava na početnu stranicu', () => {
    const sources = legacyRedirects.map((redirect) => redirect.from);
    expect(new Set(sources).size).toBe(sources.length);
    for (const redirect of legacyRedirects) {
      expect(redirect.to).not.toBe('/');
      assertInternalLink(redirect.to);
    }
  });

  it('ne preusmjerava adrese koje nova stranica zadržava', () => {
    const kept = Object.values(pages).map((page) => page.path);
    for (const redirect of legacyRedirects) expect(kept).not.toContain(redirect.from);
  });
});

describe('metapodaci', () => {
  it('svaka stranica ima jedinstven naslov i opis prihvatljive dužine', () => {
    const titles = Object.values(pages).map((page) => page.title);
    const descriptions = Object.values(pages).map((page) => page.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const page of Object.values(pages)) {
      expect(routeExists(page.path)).toBe(true);
      expect(page.description.length, page.path).toBeGreaterThanOrEqual(110);
      expect(page.description.length, page.path).toBeLessThanOrEqual(160);
    }
    expect(pages.home.title).toBe('Keramika i izrada po mjeri u Mostaru | Memić Dekor');
  });
});

describe('česta pitanja', () => {
  it('odgovara na tražena pitanja', () => {
    expect(faq.map((item) => item.question)).toEqual([
      'Šta se izrađuje po mjeri?',
      'Šta poslati za početni upit?',
      'Mogu li donijeti vlastiti materijal za rezanje?',
      'Šta je digitalni print na keramici?',
      'Gdje mogu pogledati ponudu?',
    ]);
  });
});

// Tekst svih komponenti, stranica i sadržaja za uredničke provjere (bez komentara u kodu).
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function collectSource(dir: string): string {
  return readdirSync(dir)
    .map((name) => path.join(dir, name))
    .map((file) => {
      if (statSync(file).isDirectory()) return collectSource(file);
      return /\.(tsx?|json)$/.test(file) ? stripComments(readFileSync(file, 'utf8')) : '';
    })
    .join('\n');
}

const source = collectSource(path.join(root, 'src')).toLowerCase();

describe('urednička pravila', () => {
  it('ne sadrži izmišljene tvrdnje: cijene, popuste, recenzije, nagrade ni besplatne usluge', () => {
    const forbiddenClaims = [
      'besplatn',
      'popust',
      'akcijsk',
      'recenzij',
      'nagrad',
      'ocjen',
      'garantuj',
      ' km ',
      '€',
      'najbolji',
      'najbolja',
      'najveći',
      'broj 1',
      'zalih',
      'radno vrijeme:',
    ];
    for (const forbidden of forbiddenClaims) {
      expect(source, `pronađeno: „${forbidden}”`).not.toContain(forbidden);
    }
  });

  it('koristi bosanske oblike riječi', () => {
    for (const variant of ['kupaonic', 'suvremen', 'tisuć', 'tjeda', 'obitelj', 'izraditi ćemo', 'umivaonik po mjer ']) {
      expect(source, `pronađeno: „${variant}”`).not.toContain(variant);
    }
    for (const required of ['rješenja', 'mjeri', 'kupatil', 'pločice', 'umivaonik', 'pošaljite upit', 'saznajte više']) {
      expect(source, `nedostaje: „${required}”`).toContain(required);
    }
  });

  it('ne nudi WhatsApp za fiksni telefon', () => {
    expect(source).not.toContain('whatsapp');
    expect(source).not.toContain('wa.me');
  });
});
