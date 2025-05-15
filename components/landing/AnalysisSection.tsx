import { useRef } from "react";
import { Button } from "@/components/ui/button";
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
      className="section"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 gsap-title">
          <h2 className="text-3xl md:text-5xl font-bold">
            {t("dashboardTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 gsap-text">
            <p className="text-xl">
              {t("dashboardDesc")}
            </p>
            <div className="space-y-6">
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                  <h3 className="font-semibold text-xl mb-2 text-nutrition-light-green">
                    {t("dashboardCardOneTitle")}
                  </h3>
                  <p>
                    {t("dashboardCardOneDesc")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                  <h3 className="font-semibold text-xl mb-2 text-nutrition-light-green">
                    {t("dashboardCardTwoTitle")}
                  </h3>
                  <p>
                    {t("dashboardCardTwoDesc")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-primary gsap-feature">
                <CardContent className="p-4 flex flex-col items-start gap-4">
                  <h3 className="font-semibold text-xl mb-2 text-nutrition-light-green">
                    {t("dashboardCardThreeTitle")}
                  </h3>
                  <p>
                    {t("dashboardCardThreeDesc")}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="mt-6 bg-primary hover:bg-nutrition-light-green text-white px-8 py-6 text-lg">
              {t("dashboardCta")}
            </Button>
          </div>
          <div className="gsap-image">
            <Image
              src={analysisImage}
              width={300}
              height={600}
              alt="Dashboard Analytics"
              unoptimized={true}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;