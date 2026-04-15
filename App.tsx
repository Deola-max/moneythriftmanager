
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SavingsProvider } from './contexts/SavingsContext';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { AdminRoute } from './components/Layout/AdminRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ROUTE_PATHS } from './constants';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SavingsProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-0">
              <Routes>
              <Route path={ROUTE_PATHS.HOME} element={<HomePage />} />
              <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
              <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTE_PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />
                {/* Admin routes */}
                <Route element={<AdminRoute />}>
                  <Route path={ROUTE_PATHS.ADMIN} element={<AdminPage />} />
                </Route>
                {/* Add other protected routes here */}
              </Route>
              
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </SavingsProvider>
    </AuthProvider>
  );
};

export default App;
