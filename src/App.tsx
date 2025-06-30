import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GdprConsent } from "./components/GdprConsent";
import { Home } from "./pages/Home";
import Deals from "./pages/Deals";
import { Login } from "./pages/Login";
import ShareDeal from "./pages/ShareDeal";
import { DealDetail } from "./pages/DealDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Help } from "./pages/Help";
import { FAQ } from "./pages/FAQ";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Cookies } from "./pages/Cookies";
import { Business } from "./pages/Business";
import { Careers } from "./pages/Careers";
import { Press } from "./pages/Press";
import { Recruiting } from "./pages/Recruiting";
import { WhoAreWe } from "./pages/WhoAreWe";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 1,
		},
	},
});

function useScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

function AppContent() {
	const scrollToTop = useScrollToTop();

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/deals"
					element={
						<ProtectedRoute>
							<Deals />
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route
					path="/share-deal"
					element={
						<ProtectedRoute>
							<ShareDeal />
						</ProtectedRoute>
					}
				/>
				<Route path="/deal/:id" element={<DealDetail />} />
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin"
					element={
						<ProtectedRoute requireAdmin={true}>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/help" element={<Help />} />
				<Route path="/faq" element={<FAQ />} />
				<Route path="/terms" element={<Terms />} />
				<Route path="/privacy" element={<Privacy />} />
				<Route path="/cookies" element={<Cookies />} />
				<Route path="/business" element={<Business />} />
				<Route path="/careers" element={<Careers />} />
				<Route path="/press" element={<Press />} />
				<Route path="/recruiting" element={<Recruiting />} />
				<Route path="/who-are-we" element={<WhoAreWe />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
			<Footer />
			<Toaster />
		</div>
	);
}

function App() {
	const { initialize } = useAuthStore();

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<AppContent />
			</Router>
		</QueryClientProvider>
	);
}

export default App;
