import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import { AcademicInfoForm } from "@/components/forms/AcademicInfoForm";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, User, GraduationCap, FileText, CreditCard, Download } from "lucide-react";

export default function StepwiseForm() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [completionStatus, setCompletionStatus] = useState({
    personalInfo: false,
    academicInfo: false,
    preferences: false,
    documents: false,
    payment: false
  });

  useEffect(() => {
    // Load completion status from user data or API
    if (user) {
      setCompletionStatus({
        personalInfo: user.personalInfoCompleted || false,
        academicInfo: user.academicInfoCompleted || false,
        preferences: user.preferencesCompleted || false,
        documents: user.documentsCompleted || false,
        payment: user.paymentCompleted || false
      });

      // Set current step based on completion
      if (!user.personalInfoCompleted) {
        setCurrentStep(1);
      } else if (!user.academicInfoCompleted) {
        setCurrentStep(2);
      } else if (!user.preferencesCompleted) {
        setCurrentStep(3);
      } else if (!user.documentsCompleted) {
        setCurrentStep(4);
      } else if (!user.paymentCompleted) {
        setCurrentStep(5);
      } else {
        setCurrentStep(6); // All completed
      }
    }
  }, [user]);

  const steps = [
    { 
      id: 1, 
      title: "Personal Information", 
      icon: User, 
      completed: completionStatus.personalInfo 
    },
    { 
      id: 2, 
      title: "Academic Information", 
      icon: GraduationCap, 
      completed: completionStatus.academicInfo 
    },
    { 
      id: 3, 
      title: "Institute Preferences", 
      icon: FileText, 
      completed: completionStatus.preferences 
    },
    { 
      id: 4, 
      title: "Document Upload", 
      icon: FileText, 
      completed: completionStatus.documents 
    },
    { 
      id: 5, 
      title: "Fee Payment", 
      icon: CreditCard, 
      completed: completionStatus.payment 
    }
  ];

  const handleStepComplete = (data) => {
    if (currentStep === 1) {
      setCompletionStatus(prev => ({ ...prev, personalInfo: true }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCompletionStatus(prev => ({ ...prev, academicInfo: true }));
      setCurrentStep(3);
    }
    // Add more step handlers as needed
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm user={user} onSuccess={handleStepComplete} />;
      case 2:
        return <AcademicInfoForm user={user} onSuccess={handleStepComplete} />;
      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-[#050C9C] mb-4">Institute Preferences</h2>
              <p className="text-gray-600">This section is coming soon...</p>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-[#050C9C] mb-4">Document Upload</h2>
              <p className="text-gray-600">This section is coming soon...</p>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-[#050C9C] mb-4">Fee Payment</h2>
              <p className="text-gray-600">This section is coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#050C9C] mb-4">Application Complete!</h2>
              <p className="text-gray-600">You have successfully completed all steps.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A7E6FF] via-[#3ABEF9] to-[#3572EF] p-4">
      {/* Header */}
      <header className="bg-[#050C9C] text-white shadow-lg mb-8">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-center">
            Student Application Portal
          </h1>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl">
        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.completed;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 
                        ${isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : isActive 
                            ? 'bg-[#050C9C] border-[#050C9C] text-white' 
                            : 'bg-gray-200 border-gray-300 text-gray-500'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span className={`
                        text-xs mt-2 text-center max-w-20
                        ${isActive ? 'text-[#050C9C] font-semibold' : 'text-gray-600'}
                      `}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`
                        flex-1 h-0.5 mx-4 
                        ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}