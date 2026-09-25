import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInquiryEmail, deliverInquiry, getDeliveryConfig } from '@/lib/contact/delivery';
import type { InquiryInput } from '@/lib/contact/validation';

const input: InquiryInput = {
  name: 'Amra',
  contact: 'amra@primjer.ba',
  space: 'kuhinja',
  message: 'Zanima me kuhinjska ploča od keramike.',
};

const env = {
  RESEND_API_KEY: 'test-kljuc',
  CONTACT_FROM_EMAIL: 'Web upit <upit@memic.ba>',
} as unknown as NodeJS.ProcessEnv;

function mockFetch(response: Response | Error) {
  const fn = vi.fn(async () => {
    if (response instanceof Error) throw response;
    return response;
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('getDeliveryConfig', () => {
  it('vraća null kada ključ ili pošiljalac nisu podešeni', () => {
    expect(getDeliveryConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(getDeliveryConfig({ RESEND_API_KEY: 'x' } as unknown as NodeJS.ProcessEnv)).toBeNull();
  });

  it('koristi info@memic.ba kao zadanog primaoca', () => {
    expect(getDeliveryConfig(env)).toMatchObject({ to: 'info@memic.ba', baseUrl: 'https://api.resend.com' });
  });
});

describe('buildInquiryEmail', () => {
  it('sastavlja čitljiv sadržaj i uklanja prelome iz naslova', () => {
    const { subject, text } = buildInquiryEmail({ ...input, name: 'Amra\r\nBcc: napad@primjer.com' }, 'email');
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toContain('Kuhinju');
    expect(text).toContain('E-mail: amra@primjer.ba');
    expect(text).toContain('Zanima me kuhinjska ploča od keramike.');
  });
});

describe('deliverInquiry', () => {
  it('ne šalje ništa ako servis nije podešen', async () => {
    const fetchMock = mockFetch(new Response('{}'));
    await expect(deliverInquiry(input, 'email', {} as NodeJS.ProcessEnv)).resolves.toEqual({
      ok: false,
      reason: 'not_configured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('potvrđuje uspjeh samo kada servis vrati ID poruke', async () => {
    const fetchMock = mockFetch(Response.json({ id: 'poruka-123' }));
    await expect(deliverInquiry(input, 'email', env)).resolves.toEqual({ ok: true, id: 'poruka-123' });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers).toMatchObject({ Authorization: 'Bearer test-kljuc' });
    const payload = JSON.parse(String(init.body));
    expect(payload).toMatchObject({ to: ['info@memic.ba'], reply_to: 'amra@primjer.ba' });
  });

  it('ne postavlja reply_to kada je kontakt telefon', async () => {
    const fetchMock = mockFetch(Response.json({ id: 'poruka-124' }));
    await deliverInquiry({ ...input, contact: '061 123 456' }, 'phone', env);
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(init.body))).not.toHaveProperty('reply_to');
  });

  it('prijavljuje grešku servisa kada odgovor nije uspješan', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch(new Response('{"message":"greška"}', { status: 500 }));
    await expect(deliverInquiry(input, 'email', env)).resolves.toEqual({ ok: false, reason: 'provider_error' });
  });

  it('ne prihvata uspješan HTTP odgovor bez ID-ja poruke', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch(Response.json({}));
    await expect(deliverInquiry(input, 'email', env)).resolves.toEqual({ ok: false, reason: 'provider_error' });
  });

  it('prijavljuje mrežnu grešku', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch(new TypeError('fetch failed'));
    await expect(deliverInquiry(input, 'email', env)).resolves.toEqual({ ok: false, reason: 'network_error' });
  });
});
