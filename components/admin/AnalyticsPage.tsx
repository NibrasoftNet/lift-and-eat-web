'use client';

import { useEffect, useState, useCallback } from 'react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  Calendar,
  Clock,
  Eye,
  Zap
} from 'lucide-react';

//

interface DailyActiveUsersResult {
  day: string;
  dau: number;
}

interface DailyEventCountsResult {
  day: string;
  items: Array<{
    eventType: string;
    count: number;
  }>;
}

interface TopViewedAssetsResult {
  kind: 'ingredient' | 'meal';
  from: string;
  to: string;
  items: Array<{
    slug: string;
    count: number;
  }>;
}

interface LatencyStatsResult {
  eventType: string;
  from: string;
  to: string;
  count: number;
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  min: number;
  max: number;
}

interface ActiveUsersForDayResult {
  day: string;
  total: number;
  items: Array<{
    id: string;
    userId?: string;
    anonymousId?: string;
    user?: unknown;
  }>;
}

export function AnalyticsPage() {
  const convex = useConvex();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  });
  
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      from: weekAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  });

  const [dauData, setDauData] = useState<DailyActiveUsersResult | null>(null);
  const [eventsData, setEventsData] = useState<DailyEventCountsResult | null>(null);
  const [topIngredientsData, setTopIngredientsData] = useState<TopViewedAssetsResult | null>(null);
  const [topMealsData, setTopMealsData] = useState<TopViewedAssetsResult | null>(null);
  const [latencyData, setLatencyData] = useState<LatencyStatsResult | null>(null);
  const [activeUsersData, setActiveUsersData] = useState<ActiveUsersForDayResult | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalyticsData = useCallback(async () => {
    const isInitialLoad = loading;
    if (!isInitialLoad) setRefreshing(true);
    
    try {
      // Charger toutes les métriques depuis Convex
      const [dauResult, eventsResult, topIngredientsResult, topMealsResult, latencyResult, activeUsersResult] = await Promise.all([
        convex.query(api.analytics.dailyActiveUsers, { day: selectedDate }),
        convex.query(api.analytics.dailyEventCounts, { day: selectedDate }),
        convex.query(api.analytics.topViewedAssets, { kind: 'ingredient', from: dateRange.from, to: dateRange.to, limit: 20 }),
        convex.query(api.analytics.topViewedAssets, { kind: 'meal', from: dateRange.from, to: dateRange.to, limit: 20 }),
        convex.query(api.analytics.latencyStats, { eventType: 'ingredient_detail_viewed', from: dateRange.from, to: dateRange.to }).catch(() => null),
        convex.query(api.analytics.listActiveUsersForDay, { day: selectedDate }),
      ]);

      setDauData(dauResult);
      setEventsData(eventsResult);
      setTopIngredientsData(topIngredientsResult);
      setTopMealsData(topMealsResult);
      setLatencyData(latencyResult);
      setActiveUsersData(activeUsersResult);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [convex, selectedDate, dateRange]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalEvents = eventsData?.items.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Tableau de bord analytique Lift & Eat</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </Button>
      </div>

      {/* Contrôles de date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Période d&apos;analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jour sélectionné (DAU, événements)
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Période début (Top assets, latence)
              </label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Période fin
              </label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DAU</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dauData?.dau.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs actifs le {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total des interactions le {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Ingrédients</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topIngredientsData?.items.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingrédients consultés ({dateRange.from} - {dateRange.to})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latence P95</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latencyData?.p95 ? `${Math.round(latencyData.p95)}ms` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Temps de réponse asset_view
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Événements par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Événements par type ({new Date(selectedDate).toLocaleDateString('fr-FR')})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsData?.items.length ? (
              <div className="space-y-3">
                {eventsData.items
                  .sort((a, b) => b.count - a.count)
                  .map((event) => (
                    <div key={event.eventType} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium">{event.eventType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold">{event.count.toLocaleString()}</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(event.count / Math.max(...eventsData.items.map(e => e.count))) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Aucun événement trouvé pour cette date
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top ingrédients consultés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Ingrédients consultés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topIngredientsData?.items.length ? (
              <div className="space-y-2">
                {topIngredientsData.items.slice(0, 8).map((item, index) => (
                  <div key={item.slug} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm font-medium">{item.slug}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {item.count.toLocaleString()} vues
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Aucune donnée pour cette période
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top repas consultés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Repas consultés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topMealsData?.items.length ? (
              <div className="space-y-2">
                {topMealsData.items.slice(0, 8).map((item, index) => (
                  <div key={item.slug} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm font-medium">{item.slug}</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {item.count.toLocaleString()} vues
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Aucune donnée pour cette période
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques de latence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Statistiques de latence (asset_view)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latencyData && latencyData.count > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(latencyData.avg)}ms
                    </div>
                    <div className="text-xs text-gray-600">Moyenne</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(latencyData.p50)}ms
                    </div>
                    <div className="text-xs text-gray-600">P50 (médiane)</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <div className="text-lg font-bold text-orange-600">
                      {Math.round(latencyData.p95)}ms
                    </div>
                    <div className="text-xs text-gray-600">P95</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-600">
                      {Math.round(latencyData.p99)}ms
                    </div>
                    <div className="text-xs text-gray-600">P99</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  Basé sur {latencyData.count.toLocaleString()} événements
                  <br />
                  Min: {Math.round(latencyData.min)}ms • Max: {Math.round(latencyData.max)}ms
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Aucune donnée de latence pour cette période
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Utilisateurs actifs détaillés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs actifs détaillés ({new Date(selectedDate).toLocaleDateString('fr-FR')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeUsersData?.items.length ? (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Total: {activeUsersData.total} utilisateurs actifs
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activeUsersData.items.slice(0, 20).map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="font-mono">
                        {user.userId ? `User: ${user.userId.slice(0, 8)}...` : `Anon: ${user.anonymousId?.slice(0, 8)}...`}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.userId ? 'Authentifié' : 'Anonyme'}
                    </div>
                  </div>
                ))}
                {activeUsersData.items.length > 20 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    ... et {activeUsersData.items.length - 20} autres utilisateurs
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucun utilisateur actif trouvé pour cette date
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
