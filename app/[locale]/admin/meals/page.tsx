import { Metadata } from 'next';
import { MealsPage } from '@/components/admin/MealsPage';

export const metadata: Metadata = {
  title: 'Catalogue Repas - Admin',
  description: 'Gestion du catalogue de repas Lift & Eat',
};

export default function AdminMealsPage() {
  return <MealsPage />;
}
