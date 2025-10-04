import { useRef } from "react";
import { motion } from 'framer-motion';
import { heroImage } from '@/utlis/constant';
import Image from 'next/image';
import { useTranslations } from 'use-intl';
import AndroidStoreIcon from '@/components/icons/AndroidStoreIcon';
import AppleStoreIcon from '@/components/icons/AppleStoreIcon';
import Link from 'next/link';
import { WaitlistForm } from '@/components/forms/waitlist-form';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing');
  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section pt-24 md:pt-32 lg:pt-36 pb-12 md:pb-16 lg:pb-20 relative overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="gsap-text text-center lg:text-left order-2 lg:order-1 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              {t('heroTitle')}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('heroSubTitle')}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0"
            >
              {t('heroDescription')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <WaitlistForm className="max-w-md mx-auto lg:mx-0" compact source="hero" />
            </motion.div>
          </motion.div>
          
          {/* Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center gsap-image order-1 lg:order-2"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mockup-phone max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[320px] w-full shadow-2xl"
            >
              <div className="mockup-screen relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[30px] blur-xl" />
                <Image
                  src={heroImage}
                  alt="Lift & Eat App"
                  width={320}
                  height={640}
                  priority
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 300px, (min-width: 640px) 260px, 220px"
                  className="w-full h-auto object-cover relative z-10"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;