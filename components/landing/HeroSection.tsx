import { useRef } from "react";
import { heroImage } from '@/utlis/constant';
import Image from 'next/image';
import { useTranslations } from 'use-intl';
import AndroidStoreIcon from '@/components/icons/AndroidStoreIcon';
import AppleStoreIcon from '@/components/icons/AppleStoreIcon';
import Link from 'next/link';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing');
  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section min-h-screen flex items-center"
    >
      <div className="container mx-auto relative">
        <div className="gsap-text relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('heroTitle')}{" "}
            <span className="text-primary">{t('heroSubTitle')}</span>
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mt-4">
            {t('heroSubTitle')}
          </p>
          <h4 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('heroDownload')}
          </h4>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
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
        <div className="flex justify-center gsap-image relative z-20 mt-24">
          <div className="mockup-phone">
            <div className="mockup-screen">
              <Image
                src={heroImage}
                alt="Lift & Eat App"
                width={300}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;