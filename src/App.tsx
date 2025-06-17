import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { Home } from "./pages/Home";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { DealDetail } from "./pages/DealDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { About } from "./pages/About";
import { Help } from "./pages/Help";
import { Contact } from "./pages/Contact";
import { Press } from "./pages/Press";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Cookies } from "./pages/Cookies";
import { WhoAreWe } from "./pages/WhoAreWe";
import { Recruiting } from "./pages/Recruiting";
import { Business } from "./pages/Business";
import NotFound from "./pages/NotFound";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

const AppContent = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    const subscription = initialize();
    return () => subscription?.unsubscribe();
  }, [initialize]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deals" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/deal/:id" element={<DealDetail />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/press" element={<Press />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/who-are-we" element={<WhoAreWe />} />
          <Route path="/recruiting" element={<Recruiting />} />
          <Route path="/business" element={<Business />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
