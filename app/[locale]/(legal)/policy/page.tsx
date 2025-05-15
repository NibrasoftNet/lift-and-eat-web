'use client';

import { useTranslations } from 'next-intl';
import GeneralSettingNavbar from '@/components/GeneralSettingNavbar';

export default function PrivacyPage() {
  const t = useTranslations('Privacy');

  return (
    <section
      id="privacy"
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

          <h3 className="text-2xl font-semibold">{t('collectionTitle')}</h3>
          <p>{t('collection')}</p>

          <h3 className="text-2xl font-semibold">{t('usageTitle')}</h3>
          <p>{t('usage')}</p>

          <h3 className="text-2xl font-semibold">{t('protectionTitle')}</h3>
          <p>{t('protection')}</p>

          <h3 className="text-2xl font-semibold">{t('thirdPartyTitle')}</h3>
          <p>{t('thirdParty')}</p>

          <h3 className="text-2xl font-semibold">{t('changesTitle')}</h3>
          <p>{t('changes')}</p>
        </div>
      </div>
    </section>
  );
}