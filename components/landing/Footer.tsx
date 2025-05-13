import { Instagram, Mail, MessageSquare, Twitter } from "lucide-react";
import { useTranslations } from "use-intl";
import Image from 'next/image';
import { logoImage } from '@/utlis/constant';

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
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footerNavigationTitle")}</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-gray-400 hover:text-white transition-colors">{t("footerNavHome")}</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">{t("footerNavFeatures")}</a></li>
              <li><a href="#ai" className="text-gray-400 hover:text-white transition-colors">{t("footerNavAiPlanning")}</a></li>
              <li><a href="#dashboard" className="text-gray-400 hover:text-white transition-colors">{t("footerNavDashboard")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footerLegalTitle")}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t("footerPrivacyPolicy")}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t("footerTermsOfService")}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t("footerCookiePolicy")}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t("footerContactUs")}</a></li>
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