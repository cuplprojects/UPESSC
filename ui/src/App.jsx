// App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Interview from "./components/Template/Interview";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Header onMobileMenuToggle={handleMobileMenuToggle} />}

      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/preferences" element={<Landing />} />
            <Route path="/documents" element={<Landing />} />
            <Route path="/payment" element={<Landing />} />
            <Route path="/print" element={<Landing />} />
            <Route path="/interview-admit-card" element={<Interview />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={<Home sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            />
            <Route
              path="/preferences"
              element={<Home sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            />
            <Route
              path="/documents"
              element={<Home sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            />
            <Route
              path="/payment"
              element={<Home sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            />
            <Route
              path="/print"
              element={<Home sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            />
            <Route path="/interview-admit-card" element={<Interview />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />  {/* no BrowserRouter here */}
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}


export default App;
