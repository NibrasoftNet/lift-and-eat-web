import { useTranslations } from 'next-intl';
import { Shield, CreditCard, Users, Clock } from 'lucide-react';

const ReassuranceSection = () => {
  const t = useTranslations('Reassurance');

  const reassuranceItems = [
    {
      icon: CreditCard,
      title: t('freeTitle'),
      description: t('freeDesc'),
      highlight: true
    },
    {
      icon: Shield,
      title: t('secureTitle'),
      description: t('secureDesc')
    },
    {
      icon: Users,
      title: t('limitedTitle'),
      description: t('limitedDesc'),
      highlight: true
    },
    {
      icon: Clock,
      title: t('earlyTitle'),
      description: t('earlyDesc')
    }
  ];

  return (
    <section className="py-6 md:py-8 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reassuranceItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className={`text-center p-4 rounded-lg transition-all duration-300 ${
                  item.highlight 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-background/50'
                }`}
              >
                <div className="flex justify-center mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.highlight 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <h3 className={`font-semibold mb-2 ${
                  item.highlight ? 'text-primary' : 'text-foreground'
                }`}>
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReassuranceSection;
