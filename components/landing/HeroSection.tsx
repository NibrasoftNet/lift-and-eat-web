import { useRef } from "react";
import { heroImage } from '@/utlis/constant';
import Image from 'next/image';
import { useTranslations } from 'use-intl';
import AndroidStoreIcon from '@/components/icons/AndroidStoreIcon';
import AppleStoreIcon from '@/components/icons/AppleStoreIcon';
import Link from 'next/link';
import { WaitlistForm } from '@/components/forms/waitlist-form';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing');
  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section pt-32 md:pt-36 pb-8 md:pb-12"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="gsap-text text-center px-4 order-2 lg:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              {t('heroTitle')} {" "}
              <span className="text-primary">{t('heroSubTitle')}</span>
            </h1>
            <p className="text-base md:text-lg max-w-md mx-auto mt-2">
              {t('heroDescription')}
            </p>
            <WaitlistForm className="mt-4 mx-auto" compact source="hero" />
            
            <div className="mt-6">
              <h4 className="text-xl md:text-2xl font-bold leading-tight mb-3">
                {t('heroDownload')}
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href='https://play.google.com'
                  target="_blank" rel="noopener noreferrer"
                  className='cursor-pointer'>
                  <AndroidStoreIcon />
                </Link>
                <Link
                  href='https://www.apple.com'
                  target="_blank" rel="noopener noreferrer"
                  className='cursor-pointer'>
                  <AppleStoreIcon />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gsap-image order-1 lg:order-2 mt-4 md:mt-6 lg:mt-10">
            <div className="mockup-phone max-w-[200px] md:max-w-[240px] lg:max-w-[280px] w-full">
              <div className="mockup-screen">
                <Image
                  src={heroImage}
                  alt="Lift & Eat App"
                  width={150}
                  height={400}
                  sizes="(min-width: 1024px) 280px, (min-width: 768px) 240px, 200px"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;