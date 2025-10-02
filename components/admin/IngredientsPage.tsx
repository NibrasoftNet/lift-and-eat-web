'use client';

import { useEffect, useState, useCallback } from 'react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Package } from 'lucide-react';

// Convex client is provided via context in RootLayout

interface Ingredient {
  _id: string;
  slug: string;
  name: string;
  nameI18n?: { fr: string; en?: string; ar?: string };
  descriptionI18n?: { fr: string; en?: string; ar?: string };
  nameNormalized: string;
  tags: string[];
  imageKey?: string;
  source: string;
  sourceVersion: number;
  createdAt: number;
  unit?: string;
  macrosPer100g?: { kcal: number; protein: number; carbs: number; fat: number };
}

interface IngredientsResult {
  items: Ingredient[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export function IngredientsPage() {
  const convex = useConvex();
  const [ingredients, setIngredients] = useState<IngredientsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const ITEMS_PER_PAGE = 20;

  const loadIngredients = useCallback(async () => {
    setLoading(true);
    try {
      let result: IngredientsResult;

      if (searchQuery.trim()) {
        result = await convex.query(api.assets.searchIngredients, {
          query: searchQuery.trim(),
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
      } else if (selectedTag) {
        result = await convex.query(api.assets.listIngredientsByTag, {
          tag: selectedTag,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
      } else {
        result = await convex.query(api.assets.listIngredients, {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
      }

      setIngredients(result);

      if (result.items.length > 0) {
        const allTags = result.items.flatMap(item => item.tags || []);
        const unique = Array.from(new Set(allTags)).sort();
        setAvailableTags(unique);
      } else {
        setAvailableTags([]);
      }
    } catch (error) {
      console.error('Error loading ingredients:', error);
    } finally {
      setLoading(false);
    }
  }, [convex, currentPage, searchQuery, selectedTag]);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogue Ingrédients</h1>
          <p className="text-gray-600 mt-2">
            {ingredients?.total.toLocaleString() || 0} ingrédients dans la base de données
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un ingrédient..."
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
              <p className="text-sm font-medium text-gray-700 mb-2">Filtrer par tag :</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 12).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'secondary'}
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

      {/* Liste des ingrédients */}
      <div className="grid grid-cols-1 gap-4">
        {ingredients?.items.map((ing) => (
          <Card key={ing._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ing.nameI18n?.fr || ing.name}
                    </h3>
                  </div>

                  {ing.descriptionI18n?.fr && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {ing.descriptionI18n.fr}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {ing.tags.slice(0, 5).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {ing.tags.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{ing.tags.length - 5}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    {ing.macrosPer100g && (
                      <>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="text-lg font-bold text-orange-600">{ing.macrosPer100g.kcal}</div>
                          <div className="text-xs text-gray-600">kcal</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{ing.macrosPer100g.protein}g</div>
                          <div className="text-xs text-gray-600">protéines</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{ing.macrosPer100g.carbs}g</div>
                          <div className="text-xs text-gray-600">glucides</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="text-lg font-bold text-purple-600">{ing.macrosPer100g.fat}g</div>
                          <div className="text-xs text-gray-600">lipides</div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Source:</span> {ing.source} v{ing.sourceVersion}
                    <span className="mx-2">•</span>
                    <span className="font-medium">Créé le:</span> {new Date(ing.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
