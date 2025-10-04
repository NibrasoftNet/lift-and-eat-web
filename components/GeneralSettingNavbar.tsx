import React from 'react';
import Image from 'next/image';
import { logoImage } from '@/utlis/constant';
import Link from 'next/link';
import { ModeToggle } from '@/components/ModeToggle';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Home } from 'lucide-react';

const GeneralSettingNavbar = () => {
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300`}
    >
      <div className="container flex rtl:flex-row-reverse items-center justify-between">
        <Link href="/" className="flex rtl:flex-row-reverse items-center w-fit hover:opacity-80 transition-opacity">
          <Image
            src={logoImage}
            alt="Lift & Eat App"
            width={80}
            height={80}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold">Lift & Eat</h1>
        </Link>
        <div className="flex rtl:flex-row-reverse gap-4">
          <Link href='/'><Home className='w-10 h-10 hover:bg-gray-100 rounded-md border p-2'/></Link>
          <ModeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default GeneralSettingNavbar;