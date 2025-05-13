import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { heroImage } from '@/utlis/constant';
import Image from 'next/image';
import { useTranslations } from 'use-intl';
import AndroidStoreIcon from '@/components/icons/AndroidStoreIcon';
import AppleStoreIcon from '@/components/icons/AppleStoreIcon';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing');
  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section hero-bg min-h-screen flex items-center"
    >
      <div className="container mx-auto relative">
        <div className="gsap-text relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('heroTitle')}{" "}
            <span className="text-primary">{t('heroSubTitle')}.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto mt-4">
            {t('heroSubTitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button className="hover:bg-gray-800 text-white flex items-center gap-2 p-2">
              <AppleStoreIcon />
              <span className="font-semibold">App Store</span>
            </Button>
            <Button className="hover:bg-gray-800 text-white flex items-center gap-2 p-2">
              <AndroidStoreIcon />
              <span className="font-semibold">Google Play</span>
            </Button>
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