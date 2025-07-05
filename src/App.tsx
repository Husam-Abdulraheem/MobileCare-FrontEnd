import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState, createContext } from "react";
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
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("currentUser"));

  // Simple auth guard component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
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
