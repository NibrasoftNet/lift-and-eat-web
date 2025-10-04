import { useTranslations } from "use-intl";
import Image from 'next/image';
import { logoImage } from '@/utlis/constant';
import Link from 'next/link';
import FacebookIcon from '@/components/icons/FacebookIcon';
import TiktokIcon from '@/components/icons/TiktokIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { WaitlistForm } from '@/components/forms/waitlist-form';

const Footer = () => {
  const t = useTranslations("Landing");

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={logoImage}
                alt="Lift & Eat App"
                width={80}
                height={80}
                className="object-contain"
              />
              <h3 className="text-xl font-bold">Lift & Eat</h3>
            </div>
            <p className="text-gray-400 max-w-md">
              {t("footerDescription")}
            </p>
            <div className="mt-4 max-w-md">
              <WaitlistForm compact source="footer" />
            </div>
            <div className="flex space-x-4 mt-6">
              <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon svgClassName="h-10 w-10" />
              </Link>
              <Link href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" >
                <TiktokIcon svgClassName="h-10 w-10" />
              </Link>
              <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon svgClassName="h-10 w-10" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footerNavigationTitle")}</h4>
            <ul className="space-y-2">
              <li><Link href="#hero" className="text-gray-400 hover:text-white transition-colors">{t("footerNavHome")}</Link></li>
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">{t("footerNavFeatures")}</Link></li>
              <li><Link href="#ai" className="text-gray-400 hover:text-white transition-colors">{t("footerNavAiPlanning")}</Link></li>
              <li><Link href="#dashboard" className="text-gray-400 hover:text-white transition-colors">{t("footerNavDashboard")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footerLegalTitle")}</h4>
            <ul className="space-y-2">
              <li><Link href="/policy" className="text-gray-400 hover:text-white transition-colors">{t("footerPrivacyPolicy")}</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">{t("footerTermsOfService")}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{t("footerContactUs")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Lift & Eat. {t("footerRights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;