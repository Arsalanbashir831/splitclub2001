
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

// Import pages
import { Home } from '@/pages/Home';
import Index from '@/pages/Index';
import { Login } from '@/pages/Login';
import { ShareDeal } from '@/pages/ShareDeal';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { DealDetail } from '@/pages/DealDetail';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { FAQ } from '@/pages/FAQ';
import { Help } from '@/pages/Help';
import { Press } from '@/pages/Press';
import { Business } from '@/pages/Business';
import { WhoAreWe } from '@/pages/WhoAreWe';
import { Recruiting } from '@/pages/Recruiting';
import { Careers } from '@/pages/Careers';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { Cookies } from '@/pages/Cookies';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function AppContent() {
  useScrollToTop();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deals" element={<Index />} />
      <Route path="/deal/:id" element={<DealDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/help" element={<Help />} />
      <Route path="/press" element={<Press />} />
      <Route path="/business" element={<Business />} />
      <Route path="/who-are-we" element={<WhoAreWe />} />
      <Route path="/recruiting" element={<Recruiting />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      
      {/* Protected Routes */}
      <Route path="/share-deal" element={
        <ProtectedRoute>
          <ShareDeal />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth store
    const subscription = initialize();
    
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <AppContent />
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
