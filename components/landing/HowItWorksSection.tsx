import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { ScanLine, Brain, TrendingUp } from 'lucide-react';

const HowItWorksSection = () => {
  const t = useTranslations('HowItWorks');

  const steps = [
    {
      icon: ScanLine,
      title: t('step1Title'),
      description: t('step1Description'),
      number: '01'
    },
    {
      icon: Brain,
      title: t('step2Title'),
      description: t('step2Description'),
      number: '02'
    },
    {
      icon: TrendingUp,
      title: t('step3Title'),
      description: t('step3Description'),
      number: '03'
    }
  ];

  return (
    <section id="how-it-works" className="section py-8 md:py-12 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative border-2 hover:border-primary/50 transition-colors duration-300">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Connection Lines (Desktop only) */}
        <div className="hidden md:block relative -mt-16 mb-8">
          <div className="flex justify-center items-center max-w-5xl mx-auto">
            <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-primary/30 ml-32"></div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent mr-32"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
