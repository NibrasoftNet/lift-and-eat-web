'use client';

import { useTranslations } from 'next-intl';
import GeneralSettingNavbar from '@/components/GeneralSettingNavbar';

export default function TermsPage() {
  const t = useTranslations('Terms');

  return (
    <section
      id="terms"
      className="section py-16 flex flex-col items-center"
    >
      <GeneralSettingNavbar />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold">
            {t('title')}
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-relaxed max-w-4xl mx-auto">
          <p>{t('intro')}</p>

          <h3 className="text-2xl font-semibold">{t('usageTitle')}</h3>
          <p>{t('usage')}</p>

          <h3 className="text-2xl font-semibold">{t('dataTitle')}</h3>
          <p>{t('data')}</p>

          <h3 className="text-2xl font-semibold">{t('liabilityTitle')}</h3>
          <p>{t('liability')}</p>

          <h3 className="text-2xl font-semibold">{t('updatesTitle')}</h3>
          <p>{t('updates')}</p>
        </div>
      </div>
    </section>
  );
}