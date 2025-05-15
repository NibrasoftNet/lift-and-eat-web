'use client';

import { useTranslations } from 'next-intl';
import { ContactForm } from "@/components/forms/constact-form";
import GeneralSettingNavbar from '@/components/GeneralSettingNavbar';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <section className="container flex flex-col items-center justify-center">
      <GeneralSettingNavbar />
      <div className="max-w-5xl grid gap-6 lg:grid-cols-2 lg:gap-12 justify-items-center mt-20">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">{t('officeTitle')}</h2>
            <address className="not-italic text-muted-foreground">
              <p>{t('address.line1')}</p>
              <p>{t('address.line2')}</p>
              <p>{t('address.country')}</p>
            </address>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">{t('emailTitle')}</h2>
            <p className="text-muted-foreground">
              <a href="mailto:hello@example.com" className="underline underline-offset-4 hover:text-primary">
                contact.liftandeat@gmail.com
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">{t('phoneTitle')}</h2>
            <p className="text-muted-foreground">
              <a
                href="tel:+1234567890"
                dir="ltr"
                className="rtl:normal-nums underline underline-offset-4 hover:text-primary">
                +216 (23) 013 879
              </a>
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}