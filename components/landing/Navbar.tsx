import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from "../ModeToggle";
import { LocaleSwitcher } from '../LocaleSwitcher';
import Image from 'next/image';
import { logoImage } from '@/utlis/constant';
import Link from 'next/link';
import { useTranslations } from 'use-intl';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('Landing');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 shadow-lg backdrop-blur-lg border-b border-border py-2"
            : "bg-background/90 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex rtl:flex-row-reverse items-center gap-2 hover:opacity-80 transition-opacity z-50">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={logoImage}
                  alt="Lift & Eat App"
                  width={50}
                  height={50}
                  className="object-contain md:w-[60px] md:h-[60px]"
                />
              </motion.div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Lift & Eat</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors relative group">
                {t('navbarFeatures')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link href="#ai" className="text-sm font-medium hover:text-primary transition-colors relative group">
                {t('navbarAi')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link href="#dashboard" className="text-sm font-medium hover:text-primary transition-colors relative group">
                {t('navbarAnalysis')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <ModeToggle />
              <LocaleSwitcher />
              <Link 
                href="#hero" 
                className="hidden sm:inline-flex bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all text-sm font-medium"
              >
                {t('navbarJoinBeta')}
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[9998] lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-background border-l border-border z-[9999] lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full p-6 pt-24">
                <nav className="flex flex-col gap-4">
                  <Link 
                    href="#features" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors py-3 border-b border-border"
                  >
                    {t('navbarFeatures')}
                  </Link>
                  <Link 
                    href="#ai" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors py-3 border-b border-border"
                  >
                    {t('navbarAi')}
                  </Link>
                  <Link 
                    href="#dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors py-3 border-b border-border"
                  >
                    {t('navbarAnalysis')}
                  </Link>
                </nav>
                <div className="mt-8">
                  <Link 
                    href="#hero" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all text-center font-medium"
                  >
                    {t('navbarJoinBeta')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}