import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard Admin - Lift & Eat',
  description: 'Vue d\'ensemble de la plateforme Lift & Eat',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
