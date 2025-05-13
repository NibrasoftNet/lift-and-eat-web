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
    <section
      id="features"
      ref={sectionRef}
      className="section py-20"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 gsap-image">
            <Image
              src={featuresImage}
              width={300}
              height={600}
              alt="Nutrition Plans"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
          <div className="space-y-8 order-1 md:order-2 gsap-text">
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
                    <p className="text-gray-600">{t('featuresCardOneDesc')}</p>
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
                    <p className="text-gray-600">{t('featuresCardTwoDesc')}</p>
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
                    <p className="text-gray-600">{t('featuresCardThreeDesc')}</p>
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