'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  UtensilsCrossed, 
  BarChart3, 
  Users, 
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { logoImage } from '@/utlis/constant';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Catalogue',
    icon: Package,
    children: [
      {
        name: 'Ingrédients',
        href: '/admin/ingredients',
        icon: Package,
      },
      {
        name: 'Repas',
        href: '/admin/meals',
        icon: UtensilsCrossed,
      },
    ],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Support',
    href: '/admin/support',
    icon: Users,
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function ResponsiveAdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Catalogue']);
  const pathname = usePathname();
  const locale = (pathname?.split('/')?.[1] || 'en');

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  const NavItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="px-3 pb-6 flex-1">
      <ul className="space-y-1">
        {navigation.map((item) => {
          const isExpanded = expandedItems.includes(item.name);
          const isActive = pathname === `/${locale}${item.href}`;

          return (
            <li key={item.name}>
              {item.href ? (
                <Link
                  href={`/${locale}${item.href}`}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={cn(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-4 border-primary'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5", isActive && "text-primary")} />
                  {item.name}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && item.children && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => {
                          const isChildActive = pathname === `/${locale}${child.href}`;
                          return (
                            <li key={child.name}>
                              <Link
                                href={`/${locale}${child.href}`}
                                onClick={() => isMobile && setIsOpen(false)}
                                className={cn(
                                  'flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200',
                                  isChildActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                )}
                              >
                                <child.icon className="mr-3 h-4 w-4" />
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={logoImage} alt="Lift & Eat" width={40} height={40} className="object-contain" />
          <div>
            <h1 className="text-lg font-bold">Admin</h1>
            <p className="text-xs text-muted-foreground">Lift & Eat</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Navigation</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tableau de bord admin</p>
            </div>
            <NavItems isMobile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col shadow-sm"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Image src={logoImage} alt="Lift & Eat" width={50} height={50} className="object-contain" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lift & Eat</p>
            </div>
          </div>
        </div>
        <NavItems />
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">Version</p>
            <p className="text-2xl font-bold text-primary">v1.0.0</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
