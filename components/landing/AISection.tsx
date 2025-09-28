import { useRef } from "react";
import { useTranslations } from 'use-intl';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { aiAssistantImage } from '@/utlis/constant';

const AISection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing');

  return (
    <section
      id="ai"
      ref={sectionRef}
      className="section py-8 md:py-12"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 gsap-title">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('aiSectionTitle')}{" "}
            <span className="text-nutrition-blue">AI</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="space-y-6 gsap-text">
            <p className="text-lg">
              {t('aiSectionDesc')}
            </p>
            <div className="space-y-6">
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                <h3 className="font-semibold text-xl mb-2">
                  {t('aiSectionCardOneTitle')}
                </h3>
                <p>
                  {t('aiSectionCardOneDesc')}
                </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                <h3 className="font-semibold text-xl mb-2">
                  {t('aiSectionCardTwoTitle')}
                </h3>
                <p>
                  {t('aiSectionCardTwoDesc')}
                </p>
                </CardContent>
              </Card>

            <Card className="border-l-4 border-primary gsap-feature">
              <CardContent className="p-4 flex flex-col items-start gap-4">
                <h3 className="font-semibold text-xl mb-2">
                  {t('aiSectionCardThreeTitle')}
                </h3>
                <p>
                  {t('aiSectionCardThreeDesc')}
                </p>
              </CardContent>
            </Card>
            </div>
          </div>
          <div className="gsap-image max-w-[260px] md:max-w-[280px] lg:max-w-[300px] w-full justify-self-center mt-16 md:mt-20">
            <div className="mockup-phone">
              <div className="mockup-screen">
                <Image
                  src={aiAssistantImage}
                  width={300}
                  height={600}
                  alt="AI Meal Planning"
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 280px, 260px"
                  unoptimized={true}
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

export default AISection;