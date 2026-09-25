import { describe, expect, it } from 'vitest';
import {
  LIMITS,
  classifyContact,
  hasErrors,
  normalizeInquiry,
  validateInquiry,
  type InquiryInput,
} from '@/lib/contact/validation';

const valid: InquiryInput = {
  name: 'Amra',
  contact: 'amra@primjer.ba',
  space: 'kupatilo',
  message: 'Trebam podgradni umivaonik po mjeri.',
};

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe('classifyContact', () => {
  it.each([
    ['ime@primjer.ba', 'email'],
    ['ime.prezime+upit@firma.com', 'email'],
    ['061 123 456', 'phone'],
    ['+387 36 281 301', 'phone'],
    ['036/281-301', 'phone'],
    ['(036) 281 301', 'phone'],
  ])('prepoznaje %s kao %s', (value, expected) => {
    expect(classifyContact(value)).toBe(expected);
  });

  it.each(['', 'ime@', 'ime@primjer', 'pozovite me', '12345', '+387 36 281 301 999 999 999'])(
    'odbija neispravan kontakt „%s”',
    (value) => {
      expect(classifyContact(value)).toBeNull();
    },
  );
});

describe('validateInquiry', () => {
  it('prihvata ispravan upit', () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it('traži sva obavezna polja s razumljivim porukama', () => {
    const errors = validateInquiry({ name: '', contact: '', space: '', message: '' });
    expect(errors).toEqual({
      name: 'Upišite ime.',
      contact: 'Upišite e-mail adresu ili broj telefona.',
      space: 'Odaberite šta uređujete.',
      message: 'Napišite kratku poruku.',
    });
    expect(hasErrors(errors)).toBe(true);
  });

  it('provjerava dužine i dozvoljene opcije', () => {
    const errors = validateInquiry({
      name: 'A',
      contact: 'nije-kontakt',
      space: 'garaza',
      message: 'Kratko',
    });
    expect(errors.name).toMatch(/najmanje 2/);
    expect(errors.contact).toMatch(/ispravnu e-mail adresu/);
    expect(errors.space).toMatch(/ponuđenih opcija/);
    expect(errors.message).toMatch(/najmanje 10/);
  });

  it('ograničava predugu poruku', () => {
    const errors = validateInquiry({ ...valid, message: 'a'.repeat(LIMITS.message.max + 1) });
    expect(errors.message).toMatch(/najviše 3000/);
  });
});

describe('normalizeInquiry', () => {
  it('uklanja suvišne razmake i ujednačava prelome redova', () => {
    const result = normalizeInquiry(
      formData({ name: '  Amra   Memić ', contact: ' 061 123 456 ', space: 'kuhinja', message: ' Red 1\r\nRed 2 ' }),
    );
    expect(result).toEqual({ name: 'Amra Memić', contact: '061 123 456', space: 'kuhinja', message: 'Red 1\nRed 2' });
  });

  it('vraća prazne vrijednosti za polja koja nedostaju', () => {
    expect(normalizeInquiry(new FormData())).toEqual({ name: '', contact: '', space: '', message: '' });
  });
});
