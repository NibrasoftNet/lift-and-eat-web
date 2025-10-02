import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Lift & Eat',
  description: 'Administration interface for Lift & Eat platform',
  robots: 'noindex, nofollow',
};

// Liste des emails admin autorisés
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    redirect(`/${locale}/login`);
  }

  // Vérifier si l'utilisateur est admin
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous n&apos;avez pas les permissions pour accéder à cette page.</p>
          <p className="text-sm text-gray-500 mt-2">Email: {userEmail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
