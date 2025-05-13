import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Apple, Play } from "lucide-react";
import { heroImage } from '@/utlis/constant';
import Image from 'next/image';
import { useTranslations } from 'use-intl';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing');
  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section flex-col mt-10"
    >
      <div className="container mx-auto relative">
        <div className="gsap-text relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('heroTitle')}{" "}
            <span className="text-nutrition-green">{t('heroSubTitle')}.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto mt-4">
            {t('heroSubTitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 px-6 py-6">
              <Apple className="h-6 w-6" />
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold">App Store</span>
              </div>
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 px-6 py-6">
              <Play className="h-6 w-6" />
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold">Google Play</span>
              </div>
            </Button>
          </div>
        </div>
        <div className="flex justify-center gsap-image relative z-20 mt-4">
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