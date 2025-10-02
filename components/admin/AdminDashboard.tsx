'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, UtensilsCrossed, Activity, TrendingUp, Clock } from 'lucide-react';

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

        // Charger les statistiques en parallèle depuis Convex
        const [ingredientsCount, mealsCount, dauResult, eventsResult, assetsVersion] = await Promise.all([
          convex.query(api.assets.countIngredients, {}),
          convex.query(api.assets.countMeals, {}),
          convex.query(api.analytics.dailyActiveUsers, { day: today }),
          convex.query(api.analytics.dailyEventCounts, { day: today }),
          convex.query(api.assets.getAssetsVersion, {}),
        ]);

        const totalEvents = (eventsResult.items || []).reduce((sum: number, it: { eventType: string; count: number }) => sum + it.count, 0);

        setStats({
          totalIngredients: ingredientsCount.count ?? 0,
          totalMeals: mealsCount.count ?? 0,
          dailyActiveUsers: dauResult.dau ?? 0,
          totalEvents: totalEvents,
          assetsVersion: assetsVersion.version ?? 0,
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Vue d&apos;ensemble de la plateforme Lift & Eat</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingrédients</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalIngredients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total dans le catalogue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repas</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMeals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total dans le catalogue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs (Aujourd&apos;hui)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.dailyActiveUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              DAU - Daily Active Users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements (Aujourd&apos;hui)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total des interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Version Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v{stats?.assetsVersion}</div>
            <p className="text-xs text-muted-foreground">
              Dernière version des données
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut Système</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Opérationnel</div>
            <p className="text-xs text-muted-foreground">
              Convex & Clerk connectés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href={`/${locale}/admin/ingredients`} 
              className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Gérer les Ingrédients</div>
              <div className="text-sm text-gray-600">Consulter et rechercher dans le catalogue</div>
            </a>
            <a 
              href={`/${locale}/admin/meals`} 
              className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Gérer les Repas</div>
              <div className="text-sm text-gray-600">Consulter les repas et leur composition</div>
            </a>
            <a 
              href={`/${locale}/admin/analytics`} 
              className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Voir les Analytics</div>
              <div className="text-sm text-gray-600">KPIs détaillés et métriques d&apos;usage</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations Système</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Convex URL</span>
              <span className="text-sm font-mono">{process.env.NEXT_PUBLIC_CONVEX_URL?.replace('https://', '')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Environnement</span>
              <span className="text-sm font-medium">Development</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dernière mise à jour</span>
              <span className="text-sm">{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
