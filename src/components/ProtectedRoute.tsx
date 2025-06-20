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

  console.log(user);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      if (requireAdmin && !user?.isAdmin) {
        navigate('/');
        return;
      }
    }
  }, [isAuthenticated, user?.isAdmin, requireAdmin, loading, navigate]);

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

  // Don't render anything if not authenticated or not admin (when required)
  if (!isAuthenticated || (requireAdmin && !user?.isAdmin)) {
    return null;
  }

  return <>{children}</>;
};