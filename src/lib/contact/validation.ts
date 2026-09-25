// Validacija upita: ista pravila u pregledniku i na serveru.

export const SPACE_OPTIONS = [
  { value: 'kuhinja', label: 'Kuhinju' },
  { value: 'kupatilo', label: 'Kupatilo' },
  { value: 'drugi-prostor', label: 'Drugi prostor' },
  { value: 'nesto-drugo', label: 'Nešto drugo' },
] as const;

export type SpaceValue = (typeof SPACE_OPTIONS)[number]['value'];

export type InquiryInput = {
  name: string;
  contact: string;
  space: string;
  message: string;
};

export type InquiryField = keyof InquiryInput;
export type FieldErrors = Partial<Record<InquiryField, string>>;

/** Skriveno polje koje popunjavaju samo automatski programi (zaštita od neželjenih poruka). */
export const HONEYPOT_FIELD = 'adresa_stranice';

/** Redoslijed polja u formi, za fokus na prvo neispravno polje. */
export const FIELD_ORDER: InquiryField[] = ['name', 'contact', 'space', 'message'];

export const LIMITS = {
  name: { min: 2, max: 100 },
  contact: { max: 120 },
  message: { min: 10, max: 3000 },
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()/.-]+$/;

export type ContactType = 'email' | 'phone';

export function classifyContact(value: string): ContactType | null {
  const trimmed = value.trim();
  if (EMAIL_PATTERN.test(trimmed)) return 'email';
  const digits = trimmed.replace(/\D/g, '');
  if (PHONE_PATTERN.test(trimmed) && digits.length >= 6 && digits.length <= 15) return 'phone';
  return null;
}

export function spaceLabel(value: string): string | undefined {
  return SPACE_OPTIONS.find((option) => option.value === value)?.label;
}

function readField(source: FormData, field: InquiryField): string {
  const value = source.get(field);
  return typeof value === 'string' ? value : '';
}

/** Čisti unos: uklanja razmake na krajevima i ujednačava prelome redova. */
export function normalizeInquiry(source: FormData): InquiryInput {
  return {
    name: readField(source, 'name').trim().replace(/\s+/g, ' '),
    contact: readField(source, 'contact').trim(),
    space: readField(source, 'space').trim(),
    message: readField(source, 'message').replace(/\r\n/g, '\n').trim(),
  };
}

export function validateInquiry(input: InquiryInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.name) {
    errors.name = 'Upišite ime.';
  } else if (input.name.length < LIMITS.name.min) {
    errors.name = `Ime treba imati najmanje ${LIMITS.name.min} znaka.`;
  } else if (input.name.length > LIMITS.name.max) {
    errors.name = `Ime može imati najviše ${LIMITS.name.max} znakova.`;
  }

  if (!input.contact) {
    errors.contact = 'Upišite e-mail adresu ili broj telefona.';
  } else if (input.contact.length > LIMITS.contact.max || !classifyContact(input.contact)) {
    errors.contact = 'Upišite ispravnu e-mail adresu (npr. ime@primjer.ba) ili broj telefona (npr. 061 123 456).';
  }

  if (!input.space) {
    errors.space = 'Odaberite šta uređujete.';
  } else if (!spaceLabel(input.space)) {
    errors.space = 'Odaberite jednu od ponuđenih opcija.';
  }

  if (!input.message) {
    errors.message = 'Napišite kratku poruku.';
  } else if (input.message.length < LIMITS.message.min) {
    errors.message = `Poruka treba imati najmanje ${LIMITS.message.min} znakova.`;
  } else if (input.message.length > LIMITS.message.max) {
    errors.message = `Poruka može imati najviše ${LIMITS.message.max} znakova.`;
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
