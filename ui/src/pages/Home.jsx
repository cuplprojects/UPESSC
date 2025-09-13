import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { PreferencesSection } from "@/components/sections/PreferencesSection";
import { DocumentsSection } from "@/components/sections/DocumentsSection";
import { PaymentSection } from "@/components/sections/PaymentSection";
import { PrintSection } from "@/components/sections/PrintSection";

export default function Home({ sidebarOpen, setSidebarOpen }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [completionStatus, setCompletionStatus] = useState({
    preferences: false,
    documents: false,
    documentsVerified: false,
    payment: false
  });

  // Map routes to sections
  const routeToSection = {
    "/": 1,
    "/preferences": 1,
    "/documents": 2,
    "/payment": 3,
    "/print": 4
  };

  // Show welcome message and redirect to preferences if on root path after login
  useEffect(() => {
    if (isAuthenticated && location === "/") {
      toast({
        title: "Welcome!",
        description: "You have successfully logged in. Let's complete your application.",
        variant: "default",
      });
      setLocation("/preferences");
    }
  }, [isAuthenticated, location, setLocation]);

  // Update completion status based on user data
  useEffect(() => {
    if (user) {
      const newCompletionStatus = {
        preferences: user.preferencesCompleted || false,
        documents: user.documentsCompleted || false,
        documentsVerified: user.documentsVerified || false,
        payment: user.paymentCompleted || false
      };
      
      setCompletionStatus(newCompletionStatus);

      // Set current step based on completion
      if (!user.preferencesCompleted) {
        setCurrentStep(1);
      } else if (!user.documentsCompleted) {
        setCurrentStep(2);
      } else if (!user.paymentCompleted) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4); // All completed
      }
    }
  }, [user, user?.documentsCompleted, user?.preferencesCompleted, user?.paymentCompleted]);

  const sectionToRoute = {
    1: "/preferences",
    2: "/documents",
    3: "/payment",
    4: "/print"
  };

  const activeSection = routeToSection[location] || currentStep;

  const handleSectionChange = (section) => {
    const route = sectionToRoute[section];
    if (route) {
      setLocation(route);
    }
  };

  const handleStepComplete = (data) => {
    if (activeSection === 1) {
      setCompletionStatus(prev => ({ ...prev, preferences: true }));
      setCurrentStep(2);
      setLocation("/documents");
    } else if (activeSection === 2) {
      // Only mark documents complete if they are verified
      if (data?.documentsVerified) {
        setCompletionStatus(prev => ({ ...prev, documents: true, documentsVerified: true }));
        setCurrentStep(3);
        setLocation("/payment");
      } else {
        setCompletionStatus(prev => ({ ...prev, documents: true }));
      }
    } else if (activeSection === 3) {
      setCompletionStatus(prev => ({ ...prev, payment: true }));
      setCurrentStep(4);
      setLocation("/print");
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg" data-testid="text-loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 1:
        return <PreferencesSection />;
      case 2:
        return <DocumentsSection onStepComplete={handleStepComplete} />;
      case 3:
        return <PaymentSection />;
      case 4:
        return <PrintSection />;
      default:
        return <PreferencesSection />;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        applicationStatus={completionStatus}
      />

      <main className="flex-1 min-h-screen" data-testid="main-content">
        {renderActiveSection()}
      </main>
    </div>
  );
}
