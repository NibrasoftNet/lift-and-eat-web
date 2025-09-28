import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { featuresImage } from '@/utlis/constant';
import Image from 'next/image';
import { useTranslations } from 'use-intl';

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing');

  return (
    <section id="features" className="section py-8 md:py-12" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div className="order-2 md:order-1 gsap-image max-w-[260px] md:max-w-[280px] lg:max-w-[300px] w-full justify-self-center mt-24 md:mt-28">
            <div className="mockup-phone">
              <div className="mockup-screen">
                <Image
                  src={featuresImage}
                  width={300}
                  height={570}
                  alt="Nutrition Plans"
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 280px, 260px"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6 md:space-y-7 order-1 md:order-2 gsap-text">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('featuresTitle')}
              </h2>
              <p className="text-gray-700 mb-6">
                {t('featuresDescription')}
              </p>
            </div>
            <div className="space-y-4">
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex items-start gap-4">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('featuresCardOneTitle')}
                    </h3>
                    <p>{t('featuresCardOneDesc')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex items-start gap-4">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('featuresCardTwoTitle')}
                    </h3>
                    <p>{t('featuresCardTwoDesc')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex items-start gap-4">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('featuresCardThreeTitle')}
                    </h3>
                    <p>{t('featuresCardThreeDesc')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;