'use client';

import { useTranslations } from 'next-intl';
import { ContactForm } from "@/components/forms/constact-form";
import Navbar from '@/components/landing/Navbar';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{t('title')}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('description')}</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div className="bg-card rounded-lg p-8 border shadow-sm">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-primary">{t('officeTitle')}</h2>
                  <address className="not-italic text-muted-foreground space-y-1">
                    <p>{t('address.line1')}</p>
                    <p>{t('address.line2')}</p>
                    <p>{t('address.country')}</p>
                  </address>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('emailTitle')}</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:liftandeat.contact@gmail.com" className="underline underline-offset-4 hover:text-primary transition-colors">
                      liftandeat.contact@gmail.com
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-primary">{t('phoneTitle')}</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="tel:+21623013879"
                      dir="ltr"
                      className="rtl:normal-nums underline underline-offset-4 hover:text-primary transition-colors">
                      +216 (23) 013 879 
                    </a>
                    <p className="text-muted-foreground">
                    <a
                      href="tel:+21629345818"
                      dir="ltr"
                      className="rtl:normal-nums underline underline-offset-4 hover:text-primary transition-colors">
                       +216 (29) 345 818
                    </a>
                  </p>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-8 border shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}