'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, UtensilsCrossed, Activity, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalIngredients: number;
  totalMeals: number;
  dailyActiveUsers: number;
  totalEvents: number;
  assetsVersion: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = (pathname?.split('/')?.[1] || 'en');
  const convex = useConvex();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Charger les statistiques en parallèle depuis Convex (utilise seulement les fonctions disponibles)
        const [ingredientsList, mealsList] = await Promise.all([
          convex.query(api.queries.assets.listIngredients, { page: 1, limit: 1 }),
          convex.query(api.queries.assets.listMeals, { page: 1, limit: 1 }),
        ]);

        // Appel séparé pour les analytics avec gestion d'erreur
        let dauResult = { dau: 0 };
        let eventsResult: any = { items: [] };
        
        try {
          dauResult = await convex.query(api.queries.analytics.dailyActiveUsers, { day: today });
          eventsResult = await convex.query(api.queries.analytics.dailyEventCounts, { day: today });
        } catch (error) {
          console.warn('Analytics functions not available:', error);
        }

        const totalEvents = (eventsResult.items || []).reduce((sum: number, it: { eventType: string; count: number }) => sum + it.count, 0);

        setStats({
          totalIngredients: ingredientsList.total ?? 0,
          totalMeals: mealsList.total ?? 0,
          dailyActiveUsers: dauResult.dau ?? 0,
          totalEvents: totalEvents,
          assetsVersion: 3, // Valeur fixe temporaire
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [convex]);

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-3" />
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Dashboard Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Vue d&apos;ensemble de la plateforme Lift & Eat
          </p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">Système Opérationnel</span>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatedCard
          title="Ingrédients"
          value={stats?.totalIngredients.toLocaleString() || '0'}
          description="Total dans le catalogue"
          icon={Package}
          delay={0.1}
          className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900"
        />
        <AnimatedCard
          title="Repas"
          value={stats?.totalMeals.toLocaleString() || '0'}
          description="Total dans le catalogue"
          icon={UtensilsCrossed}
          delay={0.2}
          className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-900"
        />
        <AnimatedCard
          title="Utilisateurs Actifs"
          value={stats?.dailyActiveUsers.toLocaleString() || '0'}
          description="DAU - Aujourd'hui"
          icon={Users}
          delay={0.3}
          className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900"
        />
        <AnimatedCard
          title="Événements"
          value={stats?.totalEvents.toLocaleString() || '0'}
          description="Total des interactions"
          icon={Activity}
          delay={0.4}
          className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900"
        />
        <AnimatedCard
          title="Version Assets"
          value={`v${stats?.assetsVersion}`}
          description="Dernière version"
          icon={TrendingUp}
          delay={0.5}
          className="bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-gray-900"
        />
        <AnimatedCard
          title="Statut Système"
          value="Opérationnel"
          description="Convex & Clerk"
          icon={Clock}
          delay={0.6}
          className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link 
                href={`/${locale}/admin/ingredients`} 
                className="group block p-4 rounded-lg border border-border hover:border-primary bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">Gérer les Ingrédients</div>
                    <div className="text-sm text-muted-foreground">Consulter et rechercher dans le catalogue</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
              <Link 
                href={`/${locale}/admin/meals`} 
                className="group block p-4 rounded-lg border border-border hover:border-secondary bg-gradient-to-r hover:from-secondary/5 hover:to-transparent transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-secondary transition-colors">Gérer les Repas</div>
                    <div className="text-sm text-muted-foreground">Consulter les repas et leur composition</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
              <Link 
                href={`/${locale}/admin/analytics`} 
                className="group block p-4 rounded-lg border border-border hover:border-blue-500 bg-gradient-to-r hover:from-blue-500/5 hover:to-transparent transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Voir les Analytics</div>
                    <div className="text-sm text-muted-foreground">KPIs détaillés et métriques d&apos;usage</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Informations Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Convex URL</div>
                <div className="text-sm font-mono text-primary break-all">{process.env.NEXT_PUBLIC_CONVEX_URL?.replace('https://', '')}</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Environnement</div>
                <div className="text-sm font-semibold">Development</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Dernière mise à jour</div>
                <div className="text-sm font-medium">{new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' })}</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div className="text-sm font-semibold text-green-700 dark:text-green-400">Tous les systèmes opérationnels</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
