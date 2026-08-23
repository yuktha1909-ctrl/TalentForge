'use client';

/**
 * ProtectedRoute — Client-side route guard HOC.
 *
 * Wrap any page that requires authentication:
 *
 *   export default ProtectedRoute(MyPage);
 *
 * Optional `allowedRoles` restricts access to specific roles.
 * Unauthenticated users are redirected to /login.
 * Unauthorised roles are redirected to their own dashboard.
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteOptions {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: ProtectedRouteOptions = {}
) {
  const { allowedRoles } = options;

  function GuardedPage(props: P) {
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Redirect to the user's own dashboard if they hit a role-restricted page
        router.replace(`/dashboard/${role}`);
      }
    }, [isAuthenticated, role, router]);

    // Render nothing while redirect is in progress
    if (!isAuthenticated) {
      return null;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  }

  GuardedPage.displayName = `ProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return GuardedPage;
}

export default ProtectedRoute;
