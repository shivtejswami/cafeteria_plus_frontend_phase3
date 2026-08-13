'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { HelpContactCategory } from './types';

/** Picking this option reveals a free-text box for the user's own category. */
const OTHER_CATEGORY = 'other';

interface FormErrors {
  category?: string;
  otherCategory?: string;
  subject?: string;
  message?: string;
  contactEmail?: string;
}

interface HelpContactFormProps {
  categories: HelpContactCategory[];
  defaultEmail: string;
  cancelHref: string;
  /** Called with the contact email and generated reference on success. */
  onSuccess: (email: string, reference: string) => void;
  /** Where the request is POSTed. Defaults to the shared support endpoint. */
  endpoint?: string;
}

export default function HelpContactForm({
  categories,
  defaultEmail,
  cancelHref,
  onSuccess,
  endpoint = '/api/support/contact',
}: HelpContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState(defaultEmail);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!categoryOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [categoryOpen]);

  const selectedCategory = categories.find((c) => c.value === category);
  const isOtherCategory = category === OTHER_CATEGORY;
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim());
  const isValid = Boolean(
    category &&
      (!isOtherCategory || otherCategory.trim()) &&
      subject.trim() &&
      message.trim() &&
      emailIsValid &&
      message.length <= 500
  );

  function clearFieldError(field: keyof FormErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setServerError('');
  }

  const validate = useCallback((): boolean => {
    const next: FormErrors = {};
    if (!category) next.category = 'Please select a category.';
    else if (category === OTHER_CATEGORY && !otherCategory.trim()) {
      next.otherCategory = 'Please tell us what your request is about.';
    }
    if (!subject.trim()) next.subject = 'Please enter a subject.';
    if (!message.trim()) next.message = 'Please describe the issue.';
    else if (message.length > 500) next.message = 'Message must be 500 characters or fewer.';
    if (!contactEmail.trim()) next.contactEmail = 'Please enter a contact email.';
    else if (!emailIsValid) next.contactEmail = 'Please enter a valid email address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [category, otherCategory, subject, message, contactEmail, emailIsValid]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const formEl = formRef.current;
    if (!formEl) return;

    const formData = new FormData(formEl);
    const reference = 'SR-' + Date.now().toString(36).slice(-6).toUpperCase();

    // Bots fill the hidden field; let them "succeed" without hitting the API.
    const honeypot = formData.get('phone_alt');
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      onSuccess(contactEmail.trim(), reference);
      return;
    }

    formData.delete('phone_alt');
    formData.set('category', isOtherCategory ? otherCategory.trim() : category);
    formData.set('subject', subject.trim());
    formData.set('message', message.trim());
    formData.set('email', contactEmail.trim());

    setIsSending(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) {
        setServerError('Something went wrong. Please try again.');
        setIsSending(false);
        return;
      }
      onSuccess(contactEmail.trim(), reference);
    } catch {
      setServerError('A network error occurred. Please check your connection and try again.');
      setIsSending(false);
    }
  }

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="phone_alt"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          readOnly
          className="sr-only"
        />

        <div className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold mb-1.5 text-ink" htmlFor="help-category">
              Category <span className="text-brick">*</span>
            </label>
            <div ref={categoryRef} className="relative">
              <button
                id="help-category"
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className={`w-full h-11 px-4 rounded-xl text-left text-base sm:text-[14px] flex items-center justify-between gap-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-canvas border ${category ? 'text-ink' : 'text-subtle'} ${errors.category ? 'border-brick' : 'border-line'}`}
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
              >
                {selectedCategory?.label || 'Select a category'}
                <span className="w-4 h-4 flex items-center justify-center shrink-0 text-subtle">
                  <i className={`${categoryOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-base`}></i>
                </span>
              </button>
              {categoryOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl py-1 z-20 max-h-60 overflow-y-auto border border-line shadow-card"
                  role="listbox"
                >
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        setCategory(c.value);
                        setCategoryOpen(false);
                        clearFieldError('category');
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[14px] transition-colors duration-100 hover:bg-iris-50 ${c.value === category ? 'bg-iris-50 text-iris font-medium' : 'bg-transparent text-ink'}`}
                      role="option"
                      aria-selected={c.value === category}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.category && (
              <p className="flex items-center gap-1 mt-1.5 text-[12px] text-brick">
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-error-warning-line text-sm"></i>
                </span>
                {errors.category}
              </p>
            )}

            {isOtherCategory && (
              <div className="mt-3">
                <label htmlFor="help-other-category" className="block text-[13px] font-semibold mb-1.5 text-ink">
                  Tell us what it&apos;s about <span className="text-brick">*</span>
                </label>
                <input
                  id="help-other-category"
                  type="text"
                  value={otherCategory}
                  onChange={(e) => {
                    setOtherCategory(e.target.value);
                    clearFieldError('otherCategory');
                  }}
                  maxLength={60}
                  placeholder="e.g. Data export, Integration, Training"
                  className={`w-full h-11 px-4 rounded-xl text-base sm:text-[14px] transition-all duration-150 outline-none focus:outline-none focus:ring-0 text-ink bg-canvas border ${errors.otherCategory ? 'border-brick' : 'border-line'}`}
                />
                {errors.otherCategory && (
                  <p className="flex items-center gap-1 mt-1.5 text-[12px] text-brick">
                    <span className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className="ri-error-warning-line text-sm"></i>
                    </span>
                    {errors.otherCategory}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="help-subject" className="block text-[13px] font-semibold mb-1.5 text-ink">
              Subject <span className="text-brick">*</span>
            </label>
            <input
              id="help-subject"
              type="text"
              name="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                clearFieldError('subject');
              }}
              placeholder="Brief description of your issue"
              className={`w-full h-11 px-4 rounded-xl text-base sm:text-[14px] transition-all duration-150 outline-none focus:outline-none focus:ring-0 text-ink bg-canvas border ${errors.subject ? 'border-brick' : 'border-line'}`}
            />
            {errors.subject && (
              <p className="flex items-center gap-1 mt-1.5 text-[12px] text-brick">
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-error-warning-line text-sm"></i>
                </span>
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="help-message" className="block text-[13px] font-semibold mb-1.5 text-ink">
              Message <span className="text-brick">*</span>
            </label>
            <textarea
              id="help-message"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                clearFieldError('message');
              }}
              rows={5}
              maxLength={500}
              placeholder="Include what you were trying to do and what happened."
              className={`w-full px-4 py-3 rounded-xl text-base sm:text-[14px] resize-none transition-all duration-150 outline-none focus:outline-none focus:ring-0 text-ink bg-canvas border ${errors.message ? 'border-brick' : 'border-line'}`}
            />
            <div className="flex items-center justify-between gap-3 mt-1.5">
              <span className={`text-[11px] ${message.length > 500 ? 'text-brick' : 'text-subtle'}`}>
                {message.length}/500
              </span>
              {errors.message && (
                <p className="flex items-center gap-1 text-[12px] text-brick">
                  <span className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-error-warning-line text-sm"></i>
                  </span>
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold mb-1.5 text-ink">
              Attachment <span className="font-normal text-subtle">(optional — PNG or JPG, up to 5 MB)</span>
            </label>
            <button
              type="button"
              onClick={() => setAttachments((prev) => [...prev, `screenshot_${prev.length + 1}.png`])}
              className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 h-11 px-4 rounded-xl text-[14px] font-medium transition-colors duration-150 hover:bg-sage-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 whitespace-nowrap text-iris bg-canvas border border-dashed border-sage-200"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-attachment-2 text-base"></i>
              </span>
              Add file
            </button>
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((name, i) => (
                  <div key={`${name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-canvas border border-line">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 flex items-center justify-center shrink-0 text-muted">
                        <i className="ri-file-line text-lg"></i>
                      </span>
                      <span className="text-[13px] truncate text-ink">{name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150 hover:bg-brick-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris text-subtle"
                      aria-label={`Remove ${name}`}
                    >
                      <i className="ri-close-line text-base"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="help-email" className="block text-[13px] font-semibold mb-1.5 text-ink">
              Contact email <span className="text-brick">*</span>
            </label>
            <input
              id="help-email"
              type="email"
              name="email"
              value={contactEmail}
              onChange={(e) => {
                setContactEmail(e.target.value);
                clearFieldError('contactEmail');
              }}
              className={`w-full h-11 px-4 rounded-xl text-base sm:text-[14px] transition-all duration-150 outline-none focus:outline-none focus:ring-0 text-ink bg-canvas border ${errors.contactEmail ? 'border-brick' : 'border-line'}`}
            />
            <p className="text-[11px] mt-1.5 text-subtle">SFWG will reply to this address.</p>
            {errors.contactEmail && (
              <p className="flex items-center gap-1 mt-1.5 text-[12px] text-brick">
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-error-warning-line text-sm"></i>
                </span>
                {errors.contactEmail}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-[#fdf8ed] border border-gold-100">
          <p className="text-[12px] flex items-start gap-1.5 text-gold">
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0 mt-px">
              <i className="ri-information-line text-sm"></i>
            </span>
            Please do not include students&apos; personal information in your message.
          </p>
        </div>

        {serverError && (
          <div className="mt-4 p-3 rounded-xl flex items-start gap-2 bg-brick-50 border border-[#f5c2c2]">
            <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-px text-brick">
              <i className="ri-error-warning-line text-base"></i>
            </span>
            <p className="text-[13px] flex-1 text-brick">{serverError}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="submit"
            disabled={!isValid || isSending}
            className="inline-flex justify-center items-center gap-2 h-11 px-6 rounded-full text-[14px] font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-sage text-white"
          >
            {isSending ? (
              <>
                <span className="w-4 h-4 flex items-center justify-center animate-spin">
                  <i className="ri-loader-4-line text-base"></i>
                </span>
                Sending…
              </>
            ) : (
              <>
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-mail-send-line text-base"></i>
                </span>
                Submit request
              </>
            )}
          </button>
          <Link
            href={cancelHref}
            className="inline-flex justify-center items-center h-11 px-5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-surface-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-muted bg-canvas border border-line"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
