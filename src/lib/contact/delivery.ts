// Dostava upita e-mailom preko Resend API-ja (https://resend.com/docs/api-reference/emails/send-email).
// Uspjeh se vraća samo kada servis potvrdi prijem i vrati ID poruke.
// Potrebne varijable okruženja: RESEND_API_KEY, CONTACT_FROM_EMAIL; opcionalno CONTACT_TO_EMAIL.

import { spaceLabel, type ContactType, type InquiryInput } from './validation';

export type DeliveryFailure = 'not_configured' | 'provider_error' | 'network_error';

export type DeliveryResult = { ok: true; id: string } | { ok: false; reason: DeliveryFailure };

type DeliveryConfig = {
  apiKey: string;
  from: string;
  to: string;
  baseUrl: string;
};

const DEFAULT_RECIPIENT = 'info@memic.ba';
const DEFAULT_API_BASE = 'https://api.resend.com';
const TIMEOUT_MS = 10_000;

export function getDeliveryConfig(env: NodeJS.ProcessEnv = process.env): DeliveryConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !from) return null;
  return {
    apiKey,
    from,
    to: env.CONTACT_TO_EMAIL?.trim() || DEFAULT_RECIPIENT,
    // Samo za automatske testove s lokalnim zamjenskim servisom.
    baseUrl: (env.RESEND_API_BASE_URL?.trim() || DEFAULT_API_BASE).replace(/\/+$/, ''),
  };
}

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export function buildInquiryEmail(input: InquiryInput, contactType: ContactType) {
  const space = spaceLabel(input.space) ?? input.space;
  const subject = singleLine(`Upit s web stranice: ${space} – ${input.name}`).slice(0, 200);
  const text = [
    'Novi upit s web stranice memic.ba',
    '',
    `Ime: ${input.name}`,
    `${contactType === 'email' ? 'E-mail' : 'Telefon'}: ${input.contact}`,
    `Šta uređuje: ${space}`,
    '',
    'Poruka:',
    input.message,
  ].join('\n');
  return { subject, text };
}

export async function deliverInquiry(
  input: InquiryInput,
  contactType: ContactType,
  env: NodeJS.ProcessEnv = process.env,
): Promise<DeliveryResult> {
  const config = getDeliveryConfig(env);
  if (!config) return { ok: false, reason: 'not_configured' };

  const { subject, text } = buildInquiryEmail(input, contactType);
  const payload: Record<string, unknown> = {
    from: config.from,
    to: [config.to],
    subject,
    text,
  };
  if (contactType === 'email') payload.reply_to = input.contact;

  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch (error) {
    console.error('[upit] Slanje nije uspjelo (mreža ili isteklo vrijeme).', error);
    return { ok: false, reason: 'network_error' };
  }

  if (!response.ok) {
    console.error(`[upit] Servis za e-mail je odbio poruku (HTTP ${response.status}).`);
    return { ok: false, reason: 'provider_error' };
  }

  const data: unknown = await response.json().catch(() => null);
  const id = data && typeof data === 'object' && 'id' in data ? (data as { id: unknown }).id : undefined;
  if (typeof id !== 'string' || id.length === 0) {
    console.error('[upit] Servis za e-mail nije vratio ID poruke.');
    return { ok: false, reason: 'provider_error' };
  }
  return { ok: true, id };
}
