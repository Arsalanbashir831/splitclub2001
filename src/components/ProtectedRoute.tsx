
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const navigate = useNavigate();

  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - loading:', loading);
  console.log('ProtectedRoute - requireAdmin:', requireAdmin);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        console.log('Not authenticated, redirecting to login');
        navigate('/login');
        return;
      }
      
      if (requireAdmin && !user?.isAdmin) {
        console.log('Admin required but user is not admin, redirecting to home');
        navigate('/');
        return;
      }
    }
  }, [isAuthenticated, user, requireAdmin, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Don't render anything if admin is required but user is not admin
  if (requireAdmin && !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
