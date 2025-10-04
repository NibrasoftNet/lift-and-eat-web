import { useRef } from "react";
import { WaitlistForm } from '@/components/forms/waitlist-form';
import { useTranslations } from "use-intl";
import { analysisImage } from '@/utlis/constant';
import Image from 'next/image';
import { Card, CardContent } from "../ui/card";

const AnalysisSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Landing");

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="section py-8 md:py-12"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 gsap-title">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("dashboardTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6 gsap-text">
            <p className="text-xl">
              {t("dashboardDesc")}
            </p>
            <div className="space-y-4">
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                  <h3 className="font-semibold text-xl mb-2 text-primary">
                    {t("dashboardCardOneTitle")}
                  </h3>
                  <p>
                    {t("dashboardCardOneDesc")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                  <h3 className="font-semibold text-xl mb-2 text-primary">
                    {t("dashboardCardTwoTitle")}
                  </h3>
                  <p>
                    {t("dashboardCardTwoDesc")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                  <h3 className="font-semibold text-xl mb-2 text-primary">
                    {t("dashboardCardThreeTitle")}
                  </h3>
                  <p>
                    {t("dashboardCardThreeDesc")}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 max-w-xl mx-auto w-full">
              <WaitlistForm compact source="analysis" />
            </div>
          </div>
          <div className="gsap-image max-w-[280px] md:max-w-[320px] lg:max-w-[360px] w-full justify-self-center mt-16 md:mt-20">
            <div className="mockup-phone">
              <div className="mockup-screen">
                <Image
                  src={analysisImage}
                  width={360}
                  height={580}
                  alt="Dashboard Analytics"
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 280px"
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

export default AnalysisSection;