import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMemo, useEffect, useState } from "react";
import { 
  User,
  GraduationCap, 
  FileUp, 
  CreditCard, 
  Printer, 
  Check, 
  AlertTriangle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ 
  activeSection, 
  onSectionChange, 
  isOpen, 
  onClose,
  applicationStatus 
}) {
  const { language, t } = useLanguage();

  const sections = useMemo(() => [
  {
    id: 1,
    title: t('progress.preferences'),
    icon: GraduationCap,
    status: applicationStatus?.preferences ? "completed" : activeSection === 1 ? "active" : "pending",
    statusText: applicationStatus?.preferences ? t('progress.completed') : activeSection === 1 ? t('progress.inProgress') : t('progress.pending'),
    isEnabled: !applicationStatus?.preferences, // Lock if submitted
  },
  {
    id: 2,
    title: t('progress.documents'),
    icon: FileUp,
    status: applicationStatus?.documents ? "completed" : activeSection === 2 ? "active" : "pending",
    statusText: applicationStatus?.documents ? t('progress.completed') : activeSection === 2 ? t('progress.inProgress') : t('progress.pending'),
    isEnabled: !applicationStatus?.documents, // Lock if submitted
  },
  {
    id: 3,
    title: t('progress.payment'),
    icon: CreditCard,
    status: applicationStatus?.payment ? "completed" : activeSection === 3 ? "active" : "pending",
    statusText: applicationStatus?.payment ? t('progress.completed') : activeSection === 3 ? t('progress.inProgress') : t('progress.pending'),
    isEnabled: !applicationStatus?.payment, // Lock if submitted
  },
  {
    id: 4,
    title: t('progress.print'),
    icon: Printer,
    status: (applicationStatus?.preferences && applicationStatus?.documents && applicationStatus?.payment) ? "completed" : activeSection === 4 ? "active" : "pending",
    statusText: (applicationStatus?.preferences && applicationStatus?.documents && applicationStatus?.payment) ? t('print.ready') : activeSection === 4 ? t('progress.inProgress') : t('progress.pending'),
    isEnabled: !(applicationStatus?.preferences && applicationStatus?.documents && applicationStatus?.payment), // Lock if all completed
  },
], [language, t, applicationStatus, activeSection]);

  const handleSectionClick = (sectionId) => {
    const target = sections.find(s => s.id === sectionId);
    if (!target?.isEnabled) return; // Block navigation to locked/submitted tabs
    onSectionChange(sectionId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const completedSteps = sections.filter(s => s.status === "completed").length;
  const totalSteps = sections.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0  bg-opacity-50 z-40 lg:hidden ",
          isOpen ? "block" : "hidden"
        )}
        onClick={onClose}
        data-testid="sidebar-overlay"
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed  lg:relative inset-y-0 left-0 z-50 w-80 bg-card  bg-white border  transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 "
        )}
        data-testid="sidebar-main"
      >
        <div className="p-6">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end mb-4  rounded">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-sidebar-close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4" data-testid="text-progress-title">
              {t('progress.title')}
            </h2>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{t('progress.title')}</span>
                <span>{completedSteps}/{totalSteps} {t('progress.completed')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#050C9C] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Card
                    key={section.id}
                    className={cn(
                      "progress-step flex items-center p-3 transition-all duration-200",
                      section.isEnabled ? "cursor-pointer hover:shadow-md" : "cursor-not-allowed opacity-60 bg-gray-100",
                      section.status === "completed" && "bg-[#050C9C] text-white",
                      section.status === "active" && "bg-[#3ABEF9] text-white",
                      section.status === "pending" && "bg-background hover:bg-muted"
                    )}
                    onClick={() => handleSectionClick(section.id)}
                    data-testid={`progress-step-${section.id}`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      {section.status === "completed" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{section.id}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium" data-testid={`text-section-title-${section.id}`}>
                        {section.title}
                      </div>
                      <div className="text-sm opacity-75" data-testid={`text-section-status-${section.id}`}>
                        {section.statusText}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2" data-testid="nav-main">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start p-3 h-auto",
                    activeSection === section.id && "bg-[#3ABEF9] text-white hover:bg-[#3ABEF9]/90",
                    !section.isEnabled && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => handleSectionClick(section.id)}
                  disabled={!section.isEnabled}
                  data-testid={`nav-item-${section.id}`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{section.title}</span>
                </Button>
              );
            })}
          </nav>

          {/* Important Notice */}
          <Card className="mt-8 p-4 bg-destructive/10 border-destructive/20" data-testid="card-warning">
            <div className="flex items-start">
              <AlertTriangle className="text-destructive mr-2 mt-1 h-4 w-4" />
              <div className="text-sm">
                <div className="font-medium text-destructive mb-1" data-testid="text-warning-title">
                  {t('common.important')}
                </div>
                <div className="text-muted-foreground" data-testid="text-warning-message">
                  {t('common.warningText')}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </aside>
    </>
  );
}