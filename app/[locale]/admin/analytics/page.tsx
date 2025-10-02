import { Metadata } from 'next';
import { AnalyticsPage } from '@/components/admin/AnalyticsPage';

export const metadata: Metadata = {
  title: 'Analytics - Admin',
  description: 'Tableau de bord analytique Lift & Eat',
};

export default function AdminAnalyticsPage() {
  return <AnalyticsPage />;
}
