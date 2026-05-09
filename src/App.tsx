import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider, useAuth } from '@/lib/auth';

import Index from './pages/Index';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseBuilder from './pages/CourseBuilder';
import CourseDetail from './pages/CourseDetail';
import NFTGallery from './pages/NFTGallery';
import Workshops from './pages/Workshops';
import AITutor from './pages/AITutor';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './pages/NotFound';
import { WalletSync } from './components/WalletSync';

import '@solana/wallet-adapter-react-ui/styles.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

const App = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <I18nProvider>
            <AuthProvider>
              <WalletSync />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/create" element={<CourseBuilder />} />
                  <Route path="/courses/:id/edit" element={<CourseBuilder />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/nfts" element={<NFTGallery />} />
                  <Route path="/workshops" element={<Workshops />} />
                  <Route path="/ai-tutor" element={<AITutor />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </I18nProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
