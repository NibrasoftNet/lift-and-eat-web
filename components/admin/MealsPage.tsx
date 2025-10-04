'use client';

import { useEffect, useState, useCallback } from 'react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UtensilsCrossed, Filter, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';

// Convex client is provided via context in RootLayout

interface Meal {
  _id: string;
  slug: string;
  name: string;
  nameI18n?: {
    fr: string;
    en?: string;
    ar?: string;
  };
  descriptionI18n?: {
    fr: string;
    en?: string;
    ar?: string;
  };
  nameNormalized: string;
  tags: string[];
  imageKey?: string;
  source: string;
  sourceVersion: number;
  createdAt: number;
}

interface MealIngredient {
  _id: string;
  mealSlug: string;
  ingredientSlug: string;
  quantityGr: number;
  cookingMethod?: string;
}

interface MealsResult {
  items: Meal[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export function MealsPage() {
  const convex = useConvex();
  const [meals, setMeals] = useState<MealsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  const ITEMS_PER_PAGE = 20;

  const loadMeals = useCallback(async () => {
    setLoading(true);
    try {
      let result: MealsResult;

      if (searchQuery.trim()) {
        result = await convex.query(api.assets.searchMeals, {
          query: searchQuery.trim(),
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
      } else if (selectedTag) {
        result = await convex.query(api.assets.listMealsByTag, {
          tag: selectedTag,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
      } else {
        result = await convex.query(api.assets.listMeals, {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
      }

      setMeals(result);

      // Extraire les tags uniques pour le filtre
      if (result.items.length > 0) {
        const allTags = result.items.flatMap(item => item.tags || []);
        const uniqueTags = Array.from(new Set(allTags)).sort();
        setAvailableTags(uniqueTags);
      } else {
        setAvailableTags([]);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  }, [convex, currentPage, searchQuery, selectedTag]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSelectedTag('');
    loadMeals();
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const viewMealDetails = async (slug: string) => {
    try {
      setLoadingIngredients(true);
      const meal = await convex.query(api.assets.getMealBySlug, { slug });
      const ingredients = await convex.query(api.assets.getMealIngredientsBySlug, { slug });
      
      setSelectedMeal(meal);
      setMealIngredients(ingredients);
    } catch (error) {
      console.error('Error loading meal details:', error);
    } finally {
      setLoadingIngredients(false);
    }
  };

  if (loading && !meals) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Catalogue Repas</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogue Repas</h1>
          <p className="text-gray-600 mt-2">
            {meals?.total.toLocaleString()} repas dans la base de données
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un repas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Rechercher
            </Button>
          </form>

          {availableTags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Filtrer par catégorie :</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 10).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleTagFilter(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des repas */}
      <div className="grid grid-cols-1 gap-4">
        {meals?.items.map((meal) => (
          <Card key={meal._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <UtensilsCrossed className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {meal.nameI18n?.fr || meal.name}
                    </h3>
                    {meal.imageKey && (
                      <Badge variant="outline" className="text-xs">
                        📷 Image
                      </Badge>
                    )}
                  </div>
                  
                  {meal.descriptionI18n?.fr && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {meal.descriptionI18n.fr}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {meal.tags.slice(0, 5).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {meal.tags.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{meal.tags.length - 5}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Source:</span> {meal.source} v{meal.sourceVersion}
                    <span className="mx-2">•</span>
                    <span className="font-medium">Créé le:</span> {new Date(meal.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewMealDetails(meal.slug)}
                  className="ml-4"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {meals && meals.total > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} sur {Math.ceil(meals.total / ITEMS_PER_PAGE)}
            <span className="mx-2">•</span>
            {((currentPage - 1) * ITEMS_PER_PAGE + 1).toLocaleString()} - {Math.min(currentPage * ITEMS_PER_PAGE, meals.total).toLocaleString()} sur {meals.total.toLocaleString()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!meals.hasMore || loading}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal détails repas */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  {selectedMeal.nameI18n?.fr || selectedMeal.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMeal(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Traductions */}
              <div>
                <h4 className="font-medium mb-2">Traductions</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div><strong>FR:</strong> {selectedMeal.nameI18n?.fr || selectedMeal.name}</div>
                  {selectedMeal.nameI18n?.en && (
                    <div><strong>EN:</strong> {selectedMeal.nameI18n.en}</div>
                  )}
                  {selectedMeal.nameI18n?.ar && (
                    <div><strong>AR:</strong> {selectedMeal.nameI18n.ar}</div>
                  )}
                </div>
              </div>

              {/* Descriptions */}
              {selectedMeal.descriptionI18n && (
                <div>
                  <h4 className="font-medium mb-2">Descriptions</h4>
                  <div className="space-y-2 text-sm">
                    {selectedMeal.descriptionI18n.fr && (
                      <div>
                        <strong>FR:</strong>
                        <p className="mt-1 text-gray-600">{selectedMeal.descriptionI18n.fr}</p>
                      </div>
                    )}
                    {selectedMeal.descriptionI18n.en && (
                      <div>
                        <strong>EN:</strong>
                        <p className="mt-1 text-gray-600">{selectedMeal.descriptionI18n.en}</p>
                      </div>
                    )}
                    {selectedMeal.descriptionI18n.ar && (
                      <div>
                        <strong>AR:</strong>
                        <p className="mt-1 text-gray-600">{selectedMeal.descriptionI18n.ar}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Composition du repas */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Composition du repas
                </h4>
                {loadingIngredients ? (
                  <div className="animate-pulse space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : mealIngredients.length > 0 ? (
                  <div className="space-y-2">
                    {mealIngredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{ingredient.ingredientSlug}</div>
                          {ingredient.cookingMethod && (
                            <div className="text-sm text-gray-600">
                              Méthode: {ingredient.cookingMethod}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">{ingredient.quantityGr}g</div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Total ingrédients:</strong> {mealIngredients.length}
                        <span className="mx-2">•</span>
                        <strong>Poids total:</strong> {mealIngredients.reduce((sum, ing) => sum + ing.quantityGr, 0)}g
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    Aucun ingrédient trouvé pour ce repas
                  </div>
                )}
              </div>

              {/* Catégories */}
              <div>
                <h4 className="font-medium mb-2">Catégories</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedMeal.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Métadonnées */}
              <div>
                <h4 className="font-medium mb-2">Métadonnées</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Slug:</strong> {selectedMeal.slug}</div>
                  <div><strong>Source:</strong> {selectedMeal.source} (version {selectedMeal.sourceVersion})</div>
                  <div><strong>Créé le:</strong> {new Date(selectedMeal.createdAt).toLocaleDateString('fr-FR')}</div>
                  {selectedMeal.imageKey && (
                    <div><strong>Image:</strong> {selectedMeal.imageKey}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default MealsPage;
