import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Auth Pages
import Auth from "./pages/auth/Auth";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Onboarding from "./pages/auth/Onboarding";

// Main App Pages
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Forums from "./pages/Forums";
import Events from "./pages/Events";
import Magazines from "./pages/Magazines";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import auth from "./components/auth"

// Layout Components
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
