import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { PreferencesSection } from "@/components/sections/PreferencesSection";
import { DocumentsSection } from "@/components/sections/DocumentsSection";
import { PaymentSection } from "@/components/sections/PaymentSection";
import { PrintSection } from "@/components/sections/PrintSection";

export default function Home({ sidebarOpen, setSidebarOpen }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
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

  // Redirect root to preferences on first load for consistency
  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/preferences", { replace: true });
      setCurrentPath("/preferences");
    } else {
      setCurrentPath(window.location.pathname);
    }
  }, [navigate]);

  // No auth-bound user state; keep default completion status.

  const sectionToRoute = {
    1: "/preferences",
    2: "/documents",
    3: "/payment",
    4: "/print"
  };

  const activeSection = routeToSection[currentPath] || currentStep;

  const handleSectionChange = (section) => {
    const route = sectionToRoute[section];
    if (route) {
      navigate(route);
      setCurrentPath(route);
    }
  };

  const handleStepComplete = (data) => {
    if (activeSection === 1) {
      setCompletionStatus(prev => ({ ...prev, preferences: true }));
      setCurrentStep(2);
      navigate("/documents");
      setCurrentPath("/documents");
    } else if (activeSection === 2) {
      // Only mark documents complete if they are verified
      if (data?.documentsVerified) {
        setCompletionStatus(prev => ({ ...prev, documents: true, documentsVerified: true }));
        setCurrentStep(3);
        navigate("/payment");
        setCurrentPath("/payment");
      } else {
        setCompletionStatus(prev => ({ ...prev, documents: true }));
      }
    } else if (activeSection === 3) {
      setCompletionStatus(prev => ({ ...prev, payment: true }));
      setCurrentStep(4);
      navigate("/print");
      setCurrentPath("/print");
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

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
