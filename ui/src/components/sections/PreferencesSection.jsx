import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Captcha } from "@/components/ui/captcha";
import { useToast } from "@/hooks/use-toast";
import { GripVertical, X, Check, MapPin, RotateCcw, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreferencesSection() {
  const { toast } = useToast();

  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [userSubject, setUserSubject] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isLockCaptchaVerified, setIsLockCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Fetch institutes and preferences on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // First, fetch user profile to get subject
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const profileData = await profileResponse.json();

      if (profileData.success) {
        setUserSubject(profileData.data.user.subject);
        setUserGender(profileData.data.user.gender);
      } else {
        throw new Error('Failed to fetch user profile');
      }

      // Fetch institutes
      const institutesResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/institutes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const institutesData = await institutesResponse.json();

      if (institutesData.success) {
        // Filter institutes based on user's subject and gender
        const filteredInstitutes = institutesData.data.filter(institute => {
          const matchesSubject = institute.Subject === profileData.data.user.subject;
          const matchesGender = profileData.data.user.gender === 'female' ||
                                !institute.isFemaleInstitute;
          return matchesSubject && matchesGender;
        });
        setInstitutes(filteredInstitutes);
      }

      // Fetch existing preferences
      const preferencesResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const preferencesData = await preferencesResponse.json();

      if (preferencesData.success && preferencesData.data.length > 0) {
        const orderedInstitutes = preferencesData.data.map(pref => pref.institute);
        setSelectedInstitutes(orderedInstitutes);
        setIsSubmitted(true);
        setIsLocked(preferencesData.data[0]?.isLocked || false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstituteToggle = (institute) => {
    if (isLocked) return;

    const isSelected = selectedInstitutes.some((inst) => inst.id === institute.id);

    if (isSelected) {
      setSelectedInstitutes((prev) =>
        prev.filter((inst) => inst.id !== institute.id)
      );
    } else if (selectedInstitutes.length < 5) {
      setSelectedInstitutes((prev) => [...prev, institute]);
    } else {
      toast({
        title: "Maximum Limit Reached",
        description: "You must select exactly 5 institutes. Remove one to add another.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveInstitute = (instituteId) => {
    if (isLocked) return;
    setSelectedInstitutes((prev) =>
      prev.filter((inst) => inst.id !== instituteId)
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    if (isLocked) return;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    if (isLocked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    if (isLocked) return;
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== dropIndex) {
      const newOrder = [...selectedInstitutes];
      const [movedItem] = newOrder.splice(draggedItem, 1);
      newOrder.splice(dropIndex, 0, movedItem);
      setSelectedInstitutes(newOrder);
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleReset = () => {
    if (isLocked) return;
    setSelectedInstitutes([]);
    setIsSubmitted(false);
    setIsCaptchaVerified(false);
    setIsLockCaptchaVerified(false);
  };

  const handleSubmit = async () => {
    if (selectedInstitutes.length !== 5) {
      toast({
        title: "Validation Error",
        description: "You must select exactly 5 institutes to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!isCaptchaVerified) {
      toast({
        title: "Validation Error",
        description: "Please verify captcha before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const preferences = selectedInstitutes.map((institute, index) => ({
        instituteId: institute.id,
        preferenceOrder: index + 1
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        toast({
          title: "Success",
          description: "Preferences submitted successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit preferences",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLock = async () => {
    if (!isLockCaptchaVerified || !isSubmitted) {
      toast({
        title: "Validation Error",
        description: "Please verify captcha before locking preferences.",
        variant: "destructive",
      });
      return;
    }

    setIsLocking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/preferences/lock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsLocked(true);
        toast({
          title: "Success",
          description: "Preferences locked successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to lock preferences",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Lock error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg" data-testid="text-loading">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" data-testid="text-section-title">
            Institute Preferences
          </h2>
          <p className="text-muted-foreground" data-testid="text-section-subtitle">
            You must select exactly 5 institutes in order of your preference. You can reorder them by dragging.
          </p>
          {isLocked && (
            <Badge variant="destructive" className="mt-2" data-testid="badge-locked">
              <Lock className="h-3 w-3 mr-1" />
              Preferences Locked
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Institutes */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-available-institutes">
                Available Institutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {institutes.map((institute) => {
                  const isSelected = selectedInstitutes.some(
                    (inst) => inst.id === institute.id
                  );
                  return (
                    <Card
                      key={institute.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                        isSelected && "border-[#050C9C] bg-[#050C9C]/5",
                        isLocked && "cursor-not-allowed opacity-50"
                      )}
                      onClick={() => handleInstituteToggle(institute)}
                      data-testid={`institute-card-${institute.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium" data-testid={`text-institute-name-${institute.id}`}>
                            {institute.InstituteName}
                          </h4>
                          <p className="text-sm text-muted-foreground" data-testid={`text-institute-category-${institute.id}`}>
                            Category: {institute.Category}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {institute.isFemaleInstitute && (
                              <Badge variant="secondary" className="text-xs" data-testid={`badge-female-${institute.id}`}>
                                Female Institute
                              </Badge>
                            )}
                            {institute.Subject && (
                              <Badge variant="outline" className="text-xs" data-testid={`badge-subject-${institute.id}`}>
                                {institute.Subject}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="w-6 h-6 border-2 border-border rounded flex items-center justify-center">
                          {isSelected && <Check className="h-4 w-4 text-[#050C9C]" />}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Preferences */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-selected-preferences">
                Selected Preferences ({selectedInstitutes.length}/5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedInstitutes.map((institute, index) => (
                  <Card
                    key={institute.id}
                    className={cn(
                      "p-4 border-[#050C9C] bg-[#050C9C]/5 transition-all duration-200",
                      !isLocked && "cursor-move",
                      dragOverIndex === index && "border-2 border-dashed border-blue-400 bg-blue-50"
                    )}
                    data-testid={`selected-institute-${institute.id}`}
                    draggable={!isLocked}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center">
                      {!isLocked && (
                        <div className="drag-handle mr-3 text-muted-foreground cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-4 w-4" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Badge className="bg-[#050C9C] text-white mr-3" data-testid={`badge-preference-${index + 1}`}>
                            {index + 1}
                          </Badge>
                          <div>
                            <h4 className="font-medium" data-testid={`text-selected-name-${institute.id}`}>
                              {institute.InstituteName}
                            </h4>
                            <p className="text-sm text-muted-foreground" data-testid={`text-selected-category-${institute.id}`}>
                              Category: {institute.Category}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {institute.isFemaleInstitute && (
                                <Badge variant="secondary" className="text-xs" data-testid={`badge-selected-female-${institute.id}`}>
                                  Female Institute
                                </Badge>
                              )}
                              {institute.Subject && (
                                <Badge variant="outline" className="text-xs" data-testid={`badge-selected-subject-${institute.id}`}>
                                  {institute.Subject}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {!isLocked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveInstitute(institute.id)}
                          data-testid={`button-remove-${institute.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {selectedInstitutes.length === 0 && (
                  <div className="text-center py-8" data-testid="text-no-preferences">
                    <div className="text-muted-foreground mb-2">No institutes selected</div>
                    <div className="text-sm text-orange-600 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Please select exactly 5 institutes
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isLocked && (
                <div className="space-y-4 mt-8">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                    disabled={selectedInstitutes.length === 0}
                    data-testid="button-reset"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Preferences
                  </Button>

                  {/* Warning message for incomplete selection */}
                  {selectedInstitutes.length !== 5 && (
                    <Card className="p-3 bg-orange-50 border-orange-200" data-testid="card-selection-warning">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <p className="text-sm text-orange-800" data-testid="text-selection-warning">
                          You must select exactly 5 institutes to proceed. Currently selected: {selectedInstitutes.length}/5
                        </p>
                      </div>
                    </Card>
                  )}

                  <div className="space-y-3">
                    <Captcha 
                      onVerify={setIsCaptchaVerified}
                      className="w-full"
                    />
                    <Button
                      className="w-full bg-[#050C9C] hover:bg-[#050C9C]/90"
                      onClick={handleSubmit}
                      disabled={
                        !isCaptchaVerified ||
                        selectedInstitutes.length !== 5 ||
                        isSubmitting
                      }
                      data-testid="button-submit-preferences"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Preferences"}
                    </Button>
                  </div>

                  {isSubmitted && (
                    <Card className="p-4 bg-muted" data-testid="card-lock-section">
                      <p className="text-sm text-muted-foreground mb-3" data-testid="text-lock-warning">
                        Warning: Once locked, preferences cannot be modified. Please verify with captcha to confirm.
                      </p>
                      <div className="space-y-3">
                        <Captcha 
                          onVerify={setIsLockCaptchaVerified}
                          className="w-full"
                        />
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleLock}
                          disabled={!isLockCaptchaVerified || isLocking}
                          data-testid="button-lock-preferences"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          {isLocking ? "Locking..." : "Lock Preferences"}
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}