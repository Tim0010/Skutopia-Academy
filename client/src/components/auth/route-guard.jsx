import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LoadingPage } from '@/components/ui/loading';

export function RouteGuard({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate(redirectTo);
      return;
    }

    // Check user roles if specified
    if (allowedRoles.length > 0) {
      const userRole = user?.publicMetadata?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        navigate('/unauthorized');
      }
    }
  }, [isLoaded, isSignedIn, user, allowedRoles, navigate, redirectTo]);

  if (!isLoaded) {
    return <LoadingPage message="Checking authentication..." />;
  }

  if (!isSignedIn) {
    return null;
  }

  return children;
}
