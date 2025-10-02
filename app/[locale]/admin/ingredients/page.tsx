import { Metadata } from 'next';
import { IngredientsPage } from '@/components/admin/IngredientsPage';

export const metadata: Metadata = {
  title: 'Catalogue Ingrédients - Admin',
  description: 'Gestion du catalogue d\'ingrédients Lift & Eat',
};

export default function AdminIngredientsPage() {
  return <IngredientsPage />;
}
