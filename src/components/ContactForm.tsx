'use client';

import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { company } from '@/content/site';
import { submitInquiry, type InquiryState } from '@/lib/contact/submit-inquiry';
import {
  FIELD_ORDER,
  HONEYPOT_FIELD,
  LIMITS,
  SPACE_OPTIONS,
  hasErrors,
  normalizeInquiry,
  spaceLabel,
  validateInquiry,
  type FieldErrors,
  type InquiryField,
  type InquiryInput,
} from '@/lib/contact/validation';
import { AlertIcon, ArrowRightIcon, CheckIcon } from './icons';
import styles from './ContactForm.module.css';

const initialState: InquiryState = { status: 'idle' };

const ERROR_COPY: Record<NonNullable<InquiryState['errorCode']>, { title: string; text: string }> = {
  not_configured: {
    title: 'Upit trenutno nije moguće poslati putem forme.',
    text: 'Slanje poruka s ove stranice još nije podešeno, pa vaša poruka nije poslana. Pošaljite je e-mailom ili nas nazovite.',
  },
  provider_error: {
    title: 'Upit nije poslan.',
    text: 'Servis za slanje e-pošte nije prihvatio poruku. Vaš tekst je ostao u formi: pokušajte ponovo za nekoliko minuta ili ga pošaljite e-mailom.',
  },
  network_error: {
    title: 'Upit nije poslan.',
    text: 'Veza sa servisom za slanje nije uspjela. Vaš tekst je ostao u formi: pokušajte ponovo ili ga pošaljite e-mailom.',
  },
  rejected: {
    title: 'Upit nije poslan.',
    text: 'Pošaljite nam poruku e-mailom ili nas nazovite.',
  },
};

function mailtoHref(values?: InquiryInput) {
  const params = new URLSearchParams({ subject: 'Upit s web stranice' });
  if (values) {
    params.set(
      'body',
      [
        `Ime: ${values.name}`,
        `Kontakt: ${values.contact}`,
        `Šta uređujem: ${spaceLabel(values.space) ?? ''}`,
        '',
        values.message,
      ].join('\n'),
    );
  }
  return `${company.email.href}?${params.toString().replace(/\+/g, '%20')}`;
}

function focusField(form: HTMLFormElement, field: InquiryField | undefined) {
  if (!field) return;
  const element =
    field === 'space'
      ? form.querySelector<HTMLInputElement>('input[name="space"]')
      : form.querySelector<HTMLElement>(`[name="${field}"]`);
  element?.focus();
}

type ClientErrors = { forState: InquiryState; errors: FieldErrors };

export type InquiryPrefill = { message: string; space: string };

export function ContactForm({ initialInquiry }: { initialInquiry?: InquiryPrefill }) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const [clientErrors, setClientErrors] = useState<ClientErrors | null>(null);
  const [dismissedSuccess, setDismissedSuccess] = useState<InquiryState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  // Greške iz preglednika vrijede dok server ne vrati novi odgovor.
  const serverErrors = state.status === 'invalid' ? (state.fieldErrors ?? {}) : {};
  const errors = clientErrors && clientErrors.forState === state ? clientErrors.errors : serverErrors;
  const showSuccess = state.status === 'success' && dismissedSuccess !== state;
  const values = state.status === 'success' ? undefined : state.values;

  // Nakon odgovora servera fokus ide na poruku o uspjehu/grešci ili na prvo neispravno polje.
  useEffect(() => {
    if (state.status === 'success' || state.status === 'error') {
      feedbackRef.current?.focus();
    } else if (state.status === 'invalid' && formRef.current) {
      focusField(formRef.current, FIELD_ORDER.find((field) => state.fieldErrors?.[field]));
    }
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validateInquiry(normalizeInquiry(data));
    if (hasErrors(found)) {
      flushSync(() => setClientErrors({ forState: state, errors: found }));
      focusField(form, FIELD_ORDER.find((field) => found[field]));
      return;
    }
    setClientErrors({ forState: state, errors: {} });
    startTransition(() => formAction(data));
  }

  // Greška nestaje čim korisnik ispravi polje; nova polja se ne označavaju prije slanja.
  function handleChange(event: FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as InquiryField;
    if (!errors[name]) return;
    const found = validateInquiry(normalizeInquiry(new FormData(event.currentTarget)));
    const next: FieldErrors = {};
    for (const field of FIELD_ORDER) {
      if (errors[field] && found[field]) next[field] = found[field];
    }
    setClientErrors({ forState: state, errors: next });
  }

  function startNewInquiry() {
    flushSync(() => setDismissedSuccess(state));
    formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  }

  if (showSuccess) {
    return (
      <div ref={feedbackRef} className={styles.success} role="status" tabIndex={-1}>
        <CheckIcon size={28} className={styles.feedbackIcon} />
        <div className={styles.feedbackBody}>
          <p className={styles.feedbackTitle}>Hvala, vaš upit je poslan.</p>
          <p>Odgovorit ćemo vam na e-mail ili telefon koji ste ostavili.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={startNewInquiry}>
            Pošaljite novi upit
          </button>
        </div>
      </div>
    );
  }

  const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined;
  const errorCopy = state.status === 'error' && state.errorCode ? ERROR_COPY[state.errorCode] : null;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onChange={handleChange}
      noValidate
      className={styles.form}
      aria-busy={pending || undefined}
    >
      {errorCopy ? (
        <div ref={feedbackRef} className={styles.error} role="alert" tabIndex={-1}>
          <AlertIcon size={24} className={styles.feedbackIcon} />
          <div className={styles.feedbackBody}>
            <p className={styles.feedbackTitle}>{errorCopy.title}</p>
            <p>{errorCopy.text}</p>
            <p className={styles.fallback}>
              <a href={mailtoHref(state.values)}>Pošaljite e-mail na {company.email.display}</a>
              <a href={company.phone.href}>Nazovite {company.phone.display}</a>
            </p>
          </div>
        </div>
      ) : null}

      <p className={styles.required}>Sva polja su obavezna.</p>

      <div className={styles.field}>
        <label htmlFor={fieldId('ime')} className={styles.label}>
          Ime
        </label>
        <input
          id={fieldId('ime')}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={LIMITS.name.max}
          defaultValue={values?.name}
          className={styles.input}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy(errors.name && fieldId('ime-greska'))}
        />
        {errors.name ? (
          <p id={fieldId('ime-greska')} className={styles.fieldError}>
            <AlertIcon size={16} />
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId('kontakt')} className={styles.label}>
          E-mail ili telefon
        </label>
        <p id={fieldId('kontakt-opis')} className={styles.hint}>
          Na ovaj kontakt ćemo vam odgovoriti.
        </p>
        <input
          id={fieldId('kontakt')}
          name="contact"
          type="text"
          autoComplete="email"
          spellCheck={false}
          required
          maxLength={LIMITS.contact.max}
          defaultValue={values?.contact}
          className={styles.input}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={describedBy(fieldId('kontakt-opis'), errors.contact && fieldId('kontakt-greska'))}
        />
        {errors.contact ? (
          <p id={fieldId('kontakt-greska')} className={styles.fieldError}>
            <AlertIcon size={16} />
            {errors.contact}
          </p>
        ) : null}
      </div>

      <fieldset className={styles.fieldset} data-invalid={errors.space ? true : undefined}>
        <legend className={styles.label}>Šta uređujete?</legend>
        <div className={styles.options}>
          {SPACE_OPTIONS.map((option) => (
            <label key={option.value} className={styles.option}>
              <input
                type="radio"
                name="space"
                value={option.value}
                required
                defaultChecked={(values?.space ?? initialInquiry?.space) === option.value}
                aria-describedby={describedBy(errors.space && fieldId('prostor-greska'))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.space ? (
          <p id={fieldId('prostor-greska')} className={styles.fieldError}>
            <AlertIcon size={16} />
            {errors.space}
          </p>
        ) : null}
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={fieldId('poruka')} className={styles.label}>
          Poruka
        </label>
        <p id={fieldId('poruka-opis')} className={styles.hint}>
          Opišite prostor i šta želite izraditi. Mjere su dobrodošle.
        </p>
        <textarea
          id={fieldId('poruka')}
          name="message"
          rows={6}
          required
          maxLength={LIMITS.message.max}
          defaultValue={values?.message ?? initialInquiry?.message}
          className={`${styles.input} ${styles.textarea}`}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy(fieldId('poruka-opis'), errors.message && fieldId('poruka-greska'))}
        />
        {errors.message ? (
          <p id={fieldId('poruka-greska')} className={styles.fieldError}>
            <AlertIcon size={16} />
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={fieldId('zamka')}>Ostavite ovo polje prazno</label>
        <input id={fieldId('zamka')} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className={`btn ${styles.submit}`} aria-disabled={pending || undefined}>
          {pending ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Šaljem upit…
            </>
          ) : (
            <>
              Pošaljite upit
              <ArrowRightIcon className="btn-icon" size={20} />
            </>
          )}
        </button>
        <p className={styles.note}>
          Fotografije, skice i projekte pošaljite e-mailom na{' '}
          <a href={company.email.href} className="inline-link">
            {company.email.display}
          </a>
          . Podaci iz forme koriste se samo za odgovor na vaš upit.
        </p>
      </div>

      <p className="visually-hidden" role="status" aria-live="polite">
        {pending ? 'Šaljem upit…' : ''}
      </p>
    </form>
  );
}
