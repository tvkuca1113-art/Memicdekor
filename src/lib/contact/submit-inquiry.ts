'use server';

import { deliverInquiry, type DeliveryFailure } from './delivery';
import {
  HONEYPOT_FIELD,
  classifyContact,
  hasErrors,
  normalizeInquiry,
  validateInquiry,
  type FieldErrors,
  type InquiryInput,
} from './validation';

export type InquiryState = {
  status: 'idle' | 'invalid' | 'error' | 'success';
  fieldErrors?: FieldErrors;
  errorCode?: DeliveryFailure | 'rejected';
  /** Uneseni podaci se vraćaju samo kada upit nije poslan, da se ne izgube. */
  values?: InquiryInput;
};

export async function submitInquiry(_previous: InquiryState, formData: FormData): Promise<InquiryState> {
  const values = normalizeInquiry(formData);

  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return { status: 'error', errorCode: 'rejected', values };
  }

  const fieldErrors = validateInquiry(values);
  if (hasErrors(fieldErrors)) {
    return { status: 'invalid', fieldErrors, values };
  }

  const contactType = classifyContact(values.contact);
  if (!contactType) {
    return { status: 'invalid', fieldErrors: { contact: 'Upišite ispravnu e-mail adresu ili broj telefona.' }, values };
  }

  const result = await deliverInquiry(values, contactType);
  if (!result.ok) {
    return { status: 'error', errorCode: result.reason, values };
  }
  return { status: 'success' };
}
