import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Auth Pages (lazy-loaded)
import React, { Suspense, lazy } from 'react';
const Auth = lazy(() => import("./pages/auth/Auth"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Onboarding = lazy(() => import("./pages/auth/Onboarding"));

// Main App Pages (lazy-loaded)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Feed = lazy(() => import("./pages/Feed"));
const Forums = lazy(() => import("./pages/Forums"));
const Events = lazy(() => import("./pages/Events"));
const Magazines = lazy(() => import("./pages/Magazines"));
const Learning = lazy(() => import("./pages/Learning"));
const Profile = lazy(() => import("./pages/Profile"));
const Community = lazy(() => import("./pages/Community"));
const Messages = lazy(() => import("./pages/Messages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Layout Components
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}>
              <Routes>
                {/* Auth Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/login" element={<Auth />} />
                <Route path="/auth/signup" element={<Auth />} />

                {/* Protected App Routes */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="feed" element={<Feed />} />
                  <Route path="forums" element={<Forums />} />
                  <Route path="events" element={<Events />} />
                  <Route path="magazines" element={<Magazines />} />
                  <Route path="learning" element={<Learning />} />
                  <Route path="profile/:username" element={<Profile />} />
                  <Route path="community" element={<Community />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="admin" element={<AdminDashboard />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
