import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Captcha } from "@/components/ui/captcha";
import { useToast } from "@/hooks/use-toast";
import { GripVertical, X, Check, MapPin, RotateCcw, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import API from "@/services/api/API";

export function PreferencesSection() {
  const { toast } = useToast();

  const [selectedInstitutes, setSelectedInstitutes] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [submittedPreferences, setSubmittedPreferences] = useState([]);
  const [userSubject, setUserSubject] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Fetch institutes and preferences on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get user ID for fetching preferences
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || 1;

      // Fetch institutes via API service
      const { data: institutesRaw } = await API.get('/api/Institutes');

      if (Array.isArray(institutesRaw)) {
        // Normalize fields from backend to UI shape
        const normalized = institutesRaw.map((i) => ({
          id: i.iid,
          InstituteName: i.instituteName,
          isFemaleInstitute: i.isFemaleInstitute,
          Subject: i.subjectCode,
          Category: i.category,
        }));

        setInstitutes(normalized);
      }

      // Fetch existing preferences
      try {
        const { data: preferencesRaw } = await API.get('/api/CandidateInstitutePreferences');

        if (Array.isArray(preferencesRaw)) {
          // Filter preferences for current user and sort by preference order
          const userPreferences = preferencesRaw
            .filter(pref => pref.cid === userId)
            .sort((a, b) => a.preferenceOrder - b.preferenceOrder);

          // Join with institute data
          const preferencesWithInstitutes = userPreferences.map(pref => {
            const institute = institutesRaw?.find(inst => inst.iid === pref.iid);
            return {
              ...pref,
              institute: institute ? {
                id: institute.iid,
                InstituteName: institute.instituteName,
                isFemaleInstitute: institute.isFemaleInstitute,
                Subject: institute.subjectCode,
                Category: institute.category,
              } : null
            };
          }).filter(pref => pref.institute); // Only include preferences with valid institutes

          setSubmittedPreferences(preferencesWithInstitutes);

          // If user has submitted preferences, mark as submitted
          if (preferencesWithInstitutes.length > 0) {
            setIsSubmitted(true);
            // Populate selectedInstitutes for display
            setSelectedInstitutes(preferencesWithInstitutes.map(pref => pref.institute));
          }
        }
      } catch (prefError) {
        console.log('No existing preferences found or error fetching:', prefError);
        // Don't show error for preferences - they might not exist yet
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
    if (isSubmitted) return;

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
    if (isSubmitted) return;
    setSelectedInstitutes((prev) =>
      prev.filter((inst) => inst.id !== instituteId)
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    if (isSubmitted) return;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    if (isSubmitted) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    if (isSubmitted) return;
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
    if (isSubmitted) return; // Don't allow reset after submission
    setSelectedInstitutes([]);
    setIsCaptchaVerified(false);
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
      // Get user ID (assuming it's stored in localStorage or available via auth)
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || 1; // Fallback to 1 for testing

      // Submit each preference individually using the correct API
      const submitPromises = selectedInstitutes.map((institute, index) => {
        const preferenceData = {
          cipid: 0, // Will be auto-generated by backend
          cid: userId,
          iid: institute.id,
          preferenceOrder: index + 1
        };

        return API.post('/api/CandidateInstitutePreferences', preferenceData);
      });

      // Wait for all submissions to complete
      const results = await Promise.all(submitPromises);

      // Check if all submissions were successful
      const allSuccessful = results.every(response => response.status === 200 || response.status === 201);

      if (allSuccessful) {
        setIsSubmitted(true);
        toast({
          title: "Success",
          description: "Institute preferences submitted successfully!",
        });
      } else {
        throw new Error('Some preferences failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            Select exactly 5 institutes in order of your preference. Drag to reorder them.
          </p>
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
                        isSubmitted && "cursor-not-allowed opacity-50"
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
                {isSubmitted && submittedPreferences.length > 0 ? (
                  // Show submitted preferences (read-only)
                  submittedPreferences.map((preference) => (
                    <Card
                      key={preference.cipid}
                      className="p-4 border-green-200 bg-green-50/50"
                      data-testid={`submitted-preference-${preference.cipid}`}
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Badge className="bg-green-600 text-white mr-3" data-testid={`badge-submitted-preference-${preference.preferenceOrder}`}>
                              {preference.preferenceOrder}
                            </Badge>
                            <div>
                              <h4 className="font-medium" data-testid={`text-submitted-name-${preference.iid}`}>
                                {preference.institute?.InstituteName}
                              </h4>
                              <p className="text-sm text-muted-foreground" data-testid={`text-submitted-category-${preference.iid}`}>
                                Category: {preference.institute?.Category}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {preference.institute?.isFemaleInstitute && (
                                  <Badge variant="secondary" className="text-xs" data-testid={`badge-submitted-female-${preference.iid}`}>
                                    Female Institute
                                  </Badge>
                                )}
                                {preference.institute?.Subject && (
                                  <Badge variant="outline" className="text-xs" data-testid={`badge-submitted-subject-${preference.iid}`}>
                                    {preference.institute.Subject}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          Submitted
                        </Badge>
                      </div>
                    </Card>
                  ))
                ) : (
                  // Show editable selected institutes
                  selectedInstitutes.map((institute, index) => (
                    <Card
                      key={institute.id}
                      className={cn(
                        "p-4 border-[#050C9C] bg-[#050C9C]/5 transition-all duration-200",
                        !isSubmitted && "cursor-move",
                        dragOverIndex === index && "border-2 border-dashed border-blue-400 bg-blue-50"
                      )}
                      data-testid={`selected-institute-${institute.id}`}
                      draggable={!isSubmitted}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-center">
                        {!isSubmitted && (
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
                                  <Badge  className="text-sm" data-testid={`badge-selected-female-${institute.id}`}>
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
                        {!isSubmitted && (
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
                  ))
                )}

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
              {!isSubmitted && (
                <div className="space-y-4 mt-8">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                    disabled={selectedInstitutes.length === 0 || isSubmitted}
                    data-testid="button-reset"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {isSubmitted ? "Preferences Submitted" : "Reset Selections"}
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

                  {isCaptchaVerified && (
                    <Card className="p-4 bg-blue-50 border-blue-200" data-testid="card-submit-instructions">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-800" data-testid="text-submit-ready">
                              Ready to submit your institute preferences!
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              Your selections will be saved and you can proceed to the next step.
                              {selectedInstitutes.length === 0 && " You haven't selected any institutes yet."}
                            </p>
                          </div>
                        </div>

                        {selectedInstitutes.length === 0 && (
                          <div className="bg-amber-50 border border-amber-200 rounded p-3">
                            <p className="text-sm text-amber-800">
                              <strong>Tip:</strong> Select institutes from the left panel by clicking on them.
                              You need exactly 5 institutes in your preferred order.
                            </p>
                          </div>
                        )}

                        {selectedInstitutes.length > 0 && selectedInstitutes.length < 5 && (
                          <div className="bg-orange-50 border border-orange-200 rounded p-3">
                            <p className="text-sm text-orange-800">
                              <strong>Note:</strong> You have selected {selectedInstitutes.length} institute(s).
                              You need exactly 5 institutes to proceed.
                            </p>
                          </div>
                        )}
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