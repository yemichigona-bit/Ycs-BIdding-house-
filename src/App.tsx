import Waitlist from "./pages/Waitlist";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { HostDashboard } from '@/pages/host/Dashboard';
import { HostListings } from '@/pages/host/Listings';
import { HostCreateListing } from '@/pages/host/CreateListing';
import { HostEditListing } from '@/pages/host/EditListing';
import { HostOrders } from '@/pages/host/Orders';
import { BuyerDashboard } from '@/pages/buyer/Dashboard';
import { BuyerOrders } from '@/pages/buyer/Orders';
import { BuyerBids } from '@/pages/buyer/Bids';
import { BuyerWatchlist } from '@/pages/buyer/Watchlist';
import { Marketplace } from '@/pages/Marketplace';
import { ProductDetail } from '@/pages/ProductDetail';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'host' | 'buyer' }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'host' ? '/host/dashboard' : '/buyer/dashboard'} replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={user.role === 'host' ? '/host/dashboard' : '/buyer/dashboard'} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/waitlist" element={<Waitlist />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/:id" element={<ProductDetail />} />
      
      {/* Host Routes */}
      <Route path="/host/dashboard" element={
        <ProtectedRoute allowedRole="host">
          <HostDashboard />
        </ProtectedRoute>
      } />
      <Route path="/host/listings" element={
        <ProtectedRoute allowedRole="host">
          <HostListings />
        </ProtectedRoute>
      } />
      <Route path="/host/listings/new" element={
        <ProtectedRoute allowedRole="host">
          <HostCreateListing />
        </ProtectedRoute>
      } />
      <Route path="/host/listings/:id/edit" element={
        <ProtectedRoute allowedRole="host">
          <HostEditListing />
        </ProtectedRoute>
      } />
      <Route path="/host/orders" element={
        <ProtectedRoute allowedRole="host">
          <HostOrders />
        </ProtectedRoute>
      } />
      
      {/* Buyer Routes */}
      <Route path="/buyer/dashboard" element={
        <ProtectedRoute allowedRole="buyer">
          <BuyerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/buyer/orders" element={
        <ProtectedRoute allowedRole="buyer">
          <BuyerOrders />
        </ProtectedRoute>
      } />
      <Route path="/buyer/bids" element={
        <ProtectedRoute allowedRole="buyer">
          <BuyerBids />
        </ProtectedRoute>
      } />
      <Route path="/buyer/watchlist" element={
        <ProtectedRoute allowedRole="buyer">
          <BuyerWatchlist />
        </ProtectedRoute>
      } />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/marketplace" replace />} />
      <Route path="*" element={<Navigate to="/marketplace" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
