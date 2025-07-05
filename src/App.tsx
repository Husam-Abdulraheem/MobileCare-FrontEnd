import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState, createContext, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RepairOrders from "./pages/RepairOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Statistics from "./pages/Statistics";
import TrackOrder from "./pages/TrackOrder";
import PrintOrder from "./pages/PrintOrder";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// Auth context
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_: boolean) => { },
  authLoading: true,
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Simple auth guard component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authLoading }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <RepairOrders />
                  </ProtectedRoute>
                } />
                <Route path="/statistics" element={
                  <ProtectedRoute>
                    <Statistics />
                  </ProtectedRoute>
                } />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/print/:orderId" element={<ProtectedRoute><PrintOrder /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
