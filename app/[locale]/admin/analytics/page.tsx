import { Metadata } from 'next';
import { ModernAnalyticsPage } from '@/components/admin/ModernAnalyticsPage';

export const metadata: Metadata = {
  title: 'Analytics - Admin',
  description: 'Tableau de bord analytique Lift & Eat',
};

export default function AdminAnalyticsPage() {
  return <ModernAnalyticsPage />;
}
