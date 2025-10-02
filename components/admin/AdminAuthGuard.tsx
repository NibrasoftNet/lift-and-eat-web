'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Les permissions admin sont vérifiées côté serveur dans app/[locale]/admin/layout.tsx

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/login');
      return;
    }

    // TODO: Vérifier si l'utilisateur est admin
    // Pour l'instant, on accepte tous les utilisateurs authentifiés
    // Dans un vrai environnement, il faudrait vérifier via:
    // - ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress || '')
    // - ou via un rôle dans Clerk
    // - ou via une table admin dans Convex

  }, [isLoaded, userId, user, router]);

  if (!isLoaded || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // TODO: Ajouter la vérification admin réelle ici
  // if (!isAdmin) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
  //         <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
