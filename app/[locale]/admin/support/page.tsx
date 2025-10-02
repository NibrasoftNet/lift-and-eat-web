import { Metadata } from 'next';
import { SupportPage } from '@/components/admin/SupportPage';

export const metadata: Metadata = {
  title: 'Support Utilisateur - Admin',
  description: 'Support et gestion des utilisateurs Lift & Eat',
};

export default function AdminSupportPage() {
  return <SupportPage />;
}
