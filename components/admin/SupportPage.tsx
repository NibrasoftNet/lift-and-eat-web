'use client';

import { useState } from 'react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Users, 
  User, 
  Calendar,
  Heart,
  Package,
  UtensilsCrossed,
  Activity,
  Settings
} from 'lucide-react';

// Convex client is provided via context in RootLayout

interface UserProfile {
  _id: string;
  userId: string;
  createdAt?: number;
  updatedAt?: number;
  locale?: string;
  appVersion?: string;
  platform?: string;
  displayName?: string;
  avatarUrl?: string;
  preferences?: unknown;
}

interface Plan {
  _id: string;
  userId: string;
  name: string;
  goal?: string;
  unit?: string;
  initialWeight?: number;
  targetWeight?: number;
  calories?: number;
  carbs?: number;
  fat?: number;
  protein?: number;
  durationWeeks?: number;
  startDate?: string;
  current?: boolean;
  completed?: boolean;
  clientId?: string;
  createdAt: number;
  updatedAt: number;
}

interface PlanEntry {
  _id: string;
  userId: string;
  day: string;
  slot: string;
  kind: string;
  refType: string;
  refKey: string;
  quantity: number;
  unit?: string;
  planId?: string;
  clientId?: string;
  idempotenceKey: string;
  createdAt: number;
  updatedAt: number;
}

interface SavedMeal {
  _id: string;
  userId: string;
  refType: string;
  refKey: string;
  note?: string;
  createdAt: number;
}

interface UserData {
  profile: UserProfile | null;
  plans: Plan[];
  recentEntries: PlanEntry[];
  savedMeals: SavedMeal[];
}

export function SupportPage() {
  const convex = useConvex();
  const [searchUserId, setSearchUserId] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUserId.trim()) return;

    setLoading(true);
    setError(null);
    setUserData(null);

    try {
      const [profile, plans, recentEntries, savedMeals] = await Promise.all([
        convex.query(api.admin.getUserProfile, { userId: searchUserId.trim() }),
        convex.query(api.admin.getUserPlans, { userId: searchUserId.trim() }),
        convex.query(api.admin.getUserEntries, { userId: searchUserId.trim(), limit: 25 }),
        convex.query(api.admin.getUserSavedMeals, { userId: searchUserId.trim() }),
      ]);

      setUserData({
        profile: profile || null,
        plans: plans || [],
        recentEntries: recentEntries || [],
        savedMeals: savedMeals || [],
      });
    } catch (err) {
      console.error('Error searching user:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Utilisateur</h1>
          <p className="text-gray-600 mt-2">Recherche et consultation des données utilisateur</p>
        </div>
      </div>

      {/* Recherche utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher un utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={searchUser} className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={"Entrez l\'ID utilisateur Clerk (ex: user_2xxx...)"}
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Recherche...' : 'Rechercher'}
            </Button>
          </form>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Configuration requise</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Pour accéder aux données utilisateur, il faut créer des endpoints admin spéciaux dans Convex :
                </p>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                  <li><code>queries.admin.getUserProfile(userId)</code></li>
                  <li><code>queries.admin.getUserPlans(userId)</code></li>
                  <li><code>queries.admin.getUserEntries(userId, limit?)</code></li>
                  <li><code>queries.admin.getUserSavedMeals(userId)</code></li>
                </ul>
                <p className="text-sm text-yellow-700 mt-2">
                  Ces endpoints doivent vérifier les permissions admin avant de retourner les données.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Erreur */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <Activity className="h-5 w-5" />
              <span className="font-medium">Erreur</span>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Données utilisateur */}
      {userData && (
        <div className="space-y-6">
          {/* Profil utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>ID:</strong> {userData.profile.userId}</div>
                      <div><strong>Nom:</strong> {userData.profile.displayName || 'Non défini'}</div>
                      <div><strong>Locale:</strong> {userData.profile.locale || 'Non défini'}</div>
                      <div><strong>Plateforme:</strong> {userData.profile.platform || 'Non défini'}</div>
                      <div><strong>Version app:</strong> {userData.profile.appVersion || 'Non défini'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Dates</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Créé le:</strong>{' '}
                        {userData.profile.createdAt
                          ? new Date(userData.profile.createdAt).toLocaleDateString('fr-FR')
                          : '—'}
                      </div>
                      {userData.profile.updatedAt && (
                        <div><strong>Mis à jour le:</strong> {new Date(userData.profile.updatedAt).toLocaleDateString('fr-FR')}</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Profil utilisateur non trouvé
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plans nutritionnels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Plans nutritionnels ({userData.plans.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.plans.length > 0 ? (
                <div className="space-y-3">
                  {userData.plans.map((plan) => (
                    <div key={plan._id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{plan.name}</h4>
                        <div className="flex gap-2">
                          {plan.current && <Badge variant="default">Actuel</Badge>}
                          {plan.completed && <Badge variant="secondary">Terminé</Badge>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {plan.goal && <div><strong>Objectif:</strong> {plan.goal}</div>}
                        {plan.calories && <div><strong>Calories:</strong> {plan.calories}</div>}
                        {plan.initialWeight && <div><strong>Poids initial:</strong> {plan.initialWeight}{plan.unit}</div>}
                        {plan.targetWeight && <div><strong>Poids cible:</strong> {plan.targetWeight}{plan.unit}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Aucun plan nutritionnel trouvé
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entrées récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Entrées récentes ({userData.recentEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.recentEntries.length > 0 ? (
                <div className="space-y-2">
                  {userData.recentEntries.slice(0, 10).map((entry) => (
                    <div key={entry._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {entry.kind === 'meal' ? (
                          <UtensilsCrossed className="h-4 w-4 text-green-600" />
                        ) : (
                          <Package className="h-4 w-4 text-blue-600" />
                        )}
                        <div>
                          <div className="font-medium">{entry.refKey}</div>
                          <div className="text-sm text-gray-600">
                            {entry.day} • {entry.slot} • {entry.quantity}{entry.unit || 'g'}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.refType}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Aucune entrée récente trouvée
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repas favoris */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Repas favoris ({userData.savedMeals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.savedMeals.length > 0 ? (
                <div className="space-y-2">
                  {userData.savedMeals.map((savedMeal) => (
                    <div key={savedMeal._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="font-medium">{savedMeal.refKey}</div>
                          {savedMeal.note && (
                            <div className="text-sm text-gray-600">{savedMeal.note}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs mb-1">
                          {savedMeal.refType}
                        </Badge>
                        <div>{new Date(savedMeal.createdAt).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Aucun repas favori trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Guide d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Guide d&apos;utilisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Comment utiliser cette page :</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600">
              <li>Entrez l&apos;ID utilisateur Clerk (commence par &quot;user_&quot;)</li>
              <li>Cliquez sur &quot;Rechercher&quot; pour charger les données</li>
              <li>Consultez le profil, les plans, les entrées et les favoris</li>
              <li>Utilisez ces informations pour le support client</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Endpoints Convex à créer :</h4>
            <div className="text-sm space-y-1 text-gray-600">
              <code className="block bg-gray-100 p-2 rounded">queries.admin.getUserProfile(userId: string)</code>
              <code className="block bg-gray-100 p-2 rounded">queries.admin.getUserPlans(userId: string)</code>
              <code className="block bg-gray-100 p-2 rounded">queries.admin.getUserEntries(userId: string, limit?: number)</code>
              <code className="block bg-gray-100 p-2 rounded">queries.admin.getUserSavedMeals(userId: string)</code>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note de sécurité :</strong> Ces endpoints doivent vérifier que l&apos;utilisateur connecté 
              a les permissions admin avant de retourner des données sensibles d&apos;autres utilisateurs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
