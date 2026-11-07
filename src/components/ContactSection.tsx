"use client";

import { useState, memo, useCallback, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, MapPin, Mail, Phone, MessageCircle } from "@/components/icons";
import Link from "next/link";
import CloudflareTurnstile, {
  type CloudflareTurnstileHandle,
} from "@/components/CloudflareTurnstile";
import { trackFormLead, trackPhoneClick } from "@/lib/analytics";
import { clearStatus, showStatus } from "@/lib/status";
import { useI18n } from "@/i18n/LocaleProvider";
import { useHydrated } from "@/hooks/use-hydrated";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { EMAIL, PHONE, WHATSAPP_URL } from "@/lib/site";

// Inlined at build time. If the Cloudflare Pages build environment does not
// define it, the Turnstile widget cannot render and the form can never be
// submitted -- so surface that instead of showing a permanently dead button.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Stable Turnstile action for this surface. functions/api/contact.ts rejects
// any token whose siteverify `action` does not equal this value.
const TURNSTILE_ACTION = "contact";

// The Function allows 10 s for the bot check and 8 s for the email, so past this the
// request has stalled somewhere and the visitor should get the error and a retry.
const REQUEST_TIMEOUT_MS = 20_000;
// When to tell the visitor a slow send is still in progress.
const SLOW_SEND_MS = 8_000;

const ContactSection = memo(function ContactSection() {
  const hydrated = useHydrated();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  // State updates are asynchronous, so a second submit event can arrive before the
  // button is disabled. This is set synchronously.
  const inFlight = useRef(false);
  // One id per message. A retry of the same text sends the same id, and the Function
  // passes it to Resend so the team isn't emailed twice if only the response was lost.
  const submission = useRef<{ id: string; content: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const turnstileRef = useRef<CloudflareTurnstileHandle>(null);
  const { locale, t: dict, lp } = useI18n();
  const t = dict.contactSection;

  useEffect(() => {
    if (!isSubmitting) {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), SLOW_SEND_MS);
    return () => clearTimeout(timer);
  }, [isSubmitting]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setIsSubmitting(true);
    clearStatus();

    const content = `${name}\n${email}\n${message}`;
    if (submission.current?.content !== content) {
      // randomUUID needs a secure context and a 2022 browser; the id is optional.
      const id = globalThis.crypto?.randomUUID?.();
      submission.current = id ? { id, content } : null;
    }

    // AbortController rather than AbortSignal.timeout, which older Safari lacks.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          turnstileToken,
          locale,
          submissionId: submission.current?.id,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to send");
      }

      trackFormLead();

      setSubmitted(true);
      showStatus({ tone: "ok", headline: t.sentTitle, facts: t.sentText(name) });
      setName("");
      setEmail("");
      setMessage("");
      setTurnstileToken("");
      submission.current = null;
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";

      // The token was redeemed (or rejected) by siteverify and cannot be
      // reused. Reset the widget so the retry submits a fresh token.
      turnstileRef.current?.reset();
      setTurnstileToken("");

      showStatus({
        tone: "fail",
        headline: t.errorTitle,
        facts: errorMsg.includes("verification") ? t.errorVerification : t.errorGeneric,
        urgent: true,
        focus: true,
      });
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
      setIsSubmitting(false);
    }
  }, [name, email, message, turnstileToken, locale, t]);

  const contactMethods = useMemo(() => [
    {
      icon: MessageCircle,
      label: t.whatsapp,
      value: "+974 5551 2858",
      ltr: true,
      href: WHATSAPP_URL,
      external: true,
      hasConversion: true,
    },
    {
      icon: Mail,
      label: t.email,
      value: "info@alarabiacarpets.com",
      ltr: true,
      href: "mailto:info@alarabiacarpets.com",
      external: false,
      hasConversion: false,
    },
    {
      icon: MapPin,
      label: t.location,
      value: t.locationValue,
      ltr: false,
      href: "https://maps.google.com/?q=Al+Mansoura+St,+Doha,+Qatar",
      external: true,
      hasConversion: false,
    },
  ], [t]);

  return (
    <section
      id="contact"
      className="relative py-16 sm:py-20 lg:py-28 bg-forest-900 overflow-hidden"
    >
      {/* Background Elements - Smaller on mobile */}
      <div className="absolute inset-0">
        {hydrated && (
          <>
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03] hidden sm:block"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
          </>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-5 lg:px-8">
        {/* CTA Header */}
        {/* No scroll reveal in this section: it is the whole body of /contact, so it
            must be visible from the first paint. Its overflow-hidden would also
            capture a .reveal timeline. */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight">
            {t.titleTop}
            <br />
            <span className="text-gradient">{t.titleBottom}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            {t.subtitle}
          </p>

          {/* Primary CTA */}
          <WhatsAppLink
            source="contact_section_primary"
            className="group ct-primary"
          >
            <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            {t.chat}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </WhatsAppLink>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 max-w-6xl mx-auto">
          {/* Contact Methods */}
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-white mb-6 sm:mb-8">
              {t.getInTouch}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                const className = "group ct-method";
                const content = (
                  <>
                    <div className="ct-icon">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-white/60 mb-0.5 sm:mb-1">{method.label}</p>
                      <p className="text-sm sm:text-base text-white font-medium truncate">{method.ltr ? <bdi dir="ltr">{method.value}</bdi> : method.value}</p>
                    </div>
                  </>
                );
                if (method.hasConversion) {
                  return (
                    <WhatsAppLink key={method.label} href={method.href} source="contact_section_methods" className={className}>
                      {content}
                    </WhatsAppLink>
                  );
                }
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    {...(method.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className={className}
                  >
                    {content}
                  </a>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-white/10">
              <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">{t.quickLinks}</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href={lp("/products")}
                  className="ct-chip"
                >
                  {t.viewProducts}
                </Link>
                <Link
                  href={lp("/about")}
                  className="ct-chip"
                >
                  {t.aboutUs}
                </Link>
                <a
                  href="tel:+97455512858"
                  onClick={() => trackPhoneClick("contact_section_call")}
                  className="ct-chip"
                >
                  {t.callNow}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white mb-5 sm:mb-6">
                {t.sendMessage}
              </h3>

              {submitted ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{t.thanks}</h3>
                  <p className="text-sm sm:text-base text-white/70">{t.thanksText}</p>
                </div>
              ) : !hydrated ? (
                // Stand-in for the form until it hydrates. The form itself is
                // interactive-only markup, so it stays out of the static HTML.
                <div className="ct-skel" aria-hidden="true">
                  <div>
                    <p className="ct-skel-label">{t.name}</p>
                    <div className="ct-skel-field" />
                  </div>
                  <div>
                    <p className="ct-skel-label">{t.emailLabel}</p>
                    <div className="ct-skel-field" />
                  </div>
                  <div>
                    <p className="ct-skel-label">{t.message}</p>
                    <div className="ct-skel-area" />
                  </div>
                  <div className="h-[65px]" />
                  <div className="ct-skel-btn">{t.send}</div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >

                  <div>
                    <label htmlFor="contact-name" className="block text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">{t.name}</label>
                    <Input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      readOnly={isSubmitting}
                      required
                      maxLength={100}
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base"
                      placeholder={t.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">{t.emailLabel}</label>
                    <Input
                      id="contact-email"
                      type="email"
                      dir="ltr"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={isSubmitting}
                      required
                      maxLength={254}
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base"
                      placeholder={t.emailPlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">{t.message}</label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      readOnly={isSubmitting}
                      required
                      maxLength={5000}
                      rows={4}
                      className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 rounded-lg sm:rounded-xl resize-none text-sm sm:text-base"
                      placeholder={t.messagePlaceholder}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    {TURNSTILE_SITE_KEY ? (
                      <>
                        <CloudflareTurnstile
                          ref={turnstileRef}
                          siteKey={TURNSTILE_SITE_KEY}
                          action={TURNSTILE_ACTION}
                          onVerify={(token) => {
                            setTurnstileFailed(false);
                            setTurnstileToken(token);
                          }}
                          onExpire={() => setTurnstileToken("")}
                          onError={() => {
                            setTurnstileToken("");
                            setTurnstileFailed(true);
                          }}
                          theme="dark"
                          language={locale === "ar" ? "ar" : "auto"}
                          className="min-h-[65px]"
                        />
                        {turnstileFailed && (
                          <p role="alert" className="text-sm text-red-300 text-center">
                            {t.checkFailed(PHONE, EMAIL)}
                          </p>
                        )}
                      </>
                    ) : (
                      <p role="alert" className="text-sm text-red-300 text-center">
                        {t.unavailable(PHONE, EMAIL)}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !turnstileToken}
                    className="w-full py-3.5 sm:py-4 bg-white text-forest-900 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <span
                        aria-hidden="true"
                        className="w-4 h-4 rounded-full border-2 border-forest-900/30 border-t-forest-900 animate-spin"
                      />
                    )}
                    {isSubmitting ? t.sending : t.send}
                  </button>
                  {/* Success is only ever shown once the server confirms the send:
                      this is a lead form, and a message that failed must not look sent. */}
                  {/* Always rendered and only its text changes: a live region that is
                      inserted already holding its text is often not announced. */}
                  <p role="status" className="text-xs sm:text-sm text-white/70 text-center empty:hidden">
                    {isSlow ? t.stillSending : ""}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
