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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 ${
        isScrolled
          ? "shadow-md backdrop-blur-md py-2"
          : "py-4"
      }`}
    >
      <div className="container flex rtl:flex-row-reverse items-center justify-between">
        <div className="flex rtl:flex-row-reverse items-center w-fit">
          <Image
            src={logoImage}
            alt="Lift & Eat App"
            width={80}
            height={80}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold">Lift & Eat</h1>
        </div>
        <div className="hidden md:flex gap-8">
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
        <div className="flex rtl:flex-row-reverse gap-4">
          <ModeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}