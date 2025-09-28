'use client';

import { useTranslations } from 'next-intl';
import Navbar from '@/components/landing/Navbar';

export default function PrivacyPage() {
  const t = useTranslations('Privacy');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{t('title')}</h1>
          </div>
          
          <div className="bg-card rounded-lg p-8 border shadow-sm">
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-muted-foreground">{t('intro')}</p>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-primary">{t('collectionTitle')}</h3>
                <p className="text-muted-foreground">{t('collection')}</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-primary">{t('usageTitle')}</h3>
                <p className="text-muted-foreground">{t('usage')}</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-primary">{t('protectionTitle')}</h3>
                <p className="text-muted-foreground">{t('protection')}</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-primary">{t('thirdPartyTitle')}</h3>
                <p className="text-muted-foreground">{t('thirdParty')}</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-primary">{t('changesTitle')}</h3>
                <p className="text-muted-foreground">{t('changes')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}