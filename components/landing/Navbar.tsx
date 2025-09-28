import { useState, useEffect } from "react";
import { ModeToggle } from "../ModeToggle";
import { LocaleSwitcher } from '../LocaleSwitcher';
import Image from 'next/image';
import { logoImage } from '@/utlis/constant';
import Link from 'next/link';
import { useTranslations } from 'use-intl';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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
    <nav
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 px-4 ${
        isScrolled
          ? "bg-background shadow-md backdrop-blur-md border-b border-border py-2"
          : "bg-background py-4"
      }`}
    >
      <div className="container flex items-center justify-between md:grid md:grid-cols-3">
        <div className="hidden md:flex gap-8 justify-self-start">
          <Link href="#features" className="hover:underline underline-offset-4 transition-all easy-in-out">
            {t('navbarFeatures')}
          </Link>
          <Link href="#ai" className="hover:underline underline-offset-4 transition-all easy-in-out">
            {t('navbarAi')}
          </Link>
          <Link href="#dashboard" className="hover:underline underline-offset-4 transition-all easy-in-out">
            {t('navbarAnalysis')}
          </Link>
        </div>
        <Link href="/" className="flex rtl:flex-row-reverse items-center w-fit justify-self-center hover:opacity-80 transition-opacity">
          <Image
            src={logoImage}
            alt="Lift & Eat App"
            width={60}
            height={60}
            className="object-contain md:w-[80px] md:h-[80px]"
          />
          <h1 className="text-xl md:text-2xl font-bold">Lift & Eat</h1>
        </Link>
        <div className="flex rtl:flex-row-reverse items-center gap-2 md:gap-4 justify-self-end">
          <ModeToggle />
          <LocaleSwitcher />
          <Link href="#hero" className="hidden sm:inline-flex bg-primary text-primary-foreground px-3 py-2 md:px-4 rounded-md hover:bg-primary/90 transition-colors text-sm md:text-base">
            {t('navbarJoinBeta')}
          </Link>
        </div>
      </div>
    </nav>
  );
}