import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitInquiry } from '@/lib/contact/submit-inquiry';
import { HONEYPOT_FIELD } from '@/lib/contact/validation';

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

const validFields = {
  name: 'Amra',
  contact: 'amra@primjer.ba',
  space: 'kupatilo',
  message: 'Trebam keramički umivaonik po mjeri.',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('submitInquiry', () => {
  it('vraća greške polja i unesene vrijednosti za neispravan upit', async () => {
    const result = await submitInquiry({ status: 'idle' }, formData({ ...validFields, contact: 'x' }));
    expect(result.status).toBe('invalid');
    expect(result.fieldErrors?.contact).toBeDefined();
    expect(result.values?.message).toBe(validFields.message);
  });

  it('odbija upit s popunjenim skrivenim poljem bez prikaza uspjeha', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await submitInquiry({ status: 'idle' }, formData({ ...validFields, [HONEYPOT_FIELD]: 'http://spam' }));
    expect(result).toMatchObject({ status: 'error', errorCode: 'rejected' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('javlja da slanje nije podešeno kada nedostaju ključevi', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('CONTACT_FROM_EMAIL', '');
    const result = await submitInquiry({ status: 'idle' }, formData(validFields));
    expect(result).toMatchObject({ status: 'error', errorCode: 'not_configured' });
    expect(result.values?.name).toBe('Amra');
  });

  it('prikazuje uspjeh samo nakon potvrde servisa', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-kljuc');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'Web upit <upit@memic.ba>');
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ id: 'poruka-1' })));
    await expect(submitInquiry({ status: 'idle' }, formData(validFields))).resolves.toEqual({ status: 'success' });
  });
});
