import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import API from "@/services/api/API";

export function DocumentsSection({ onStepComplete }) {
  const [qualifications, setQualifications] = useState([]);
  const [examinationOptions, setExaminationOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    Examination: "",
    BoardOrUniversity: "",
    YearOfPassing: "",
    RollNumber: "",
    MarksObtained: "",
    TotalMarks: "",
    Percentage: "",
    Grade: "",
    Subject: "",
  });
  const [markSheetFile, setMarkSheetFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [editingQualification, setEditingQualification] = useState(null);

  useEffect(() => {
    fetchQualifications();
    fetchExaminationOptions();
  }, []);

  const fetchExaminationOptions = async () => {
    try {
      const response = await API.get("/api/ExaminationMasters");
      if (response.data) {
        setExaminationOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching examination options:", error);
      // Fallback to hardcoded options if API fails
      setExaminationOptions([
        { examinationID: 1, examName: "High School" },
        { examinationID: 2, examName: "Intermediate" },
        { examinationID: 3, examName: "Graduation" },
        { examinationID: 4, examName: "Post Graduate" },
        { examinationID: 5, examName: "NET/SET/JRF" },
        { examinationID: 6, examName: "Ph.D/D.Phil" },
        { examinationID: 7, examName: "Other" }
      ]);
    }
  };

  const fetchQualifications = async () => {
    try {
      const response = await API.get("/api/CandidateEducationalQualifications");
      if (response.data) {
        // For testing, show all qualifications when not logged in
        const userId = user?.id || 1;
        const userQualifications = response.data.filter((q) => q.cid === userId);
        setQualifications(userQualifications);
      }
    } catch (error) {
      console.error("Error fetching qualifications:", error);
      toast({
        title: "Error",
        description: "Failed to load qualifications. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (fileType, file) => {
    console.log("handleFileChange called:", fileType, "file:", file);
    if (fileType === "markSheet") {
      setMarkSheetFile(file);
      console.log("markSheetFile set to:", file?.name, "size:", file?.size);
    } else if (fileType === "certificate") {
      setCertificateFile(file);
      console.log("certificateFile set to:", file?.name, "size:", file?.size);
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called, editingQualification:", editingQualification);
    // Use user ID or default to 1 for testing when not logged in
    const userId = user?.id || 1;

    // Validate required fields
    const requiredFields = ["Examination", "BoardOrUniversity", "YearOfPassing", "RollNumber"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setValidationErrors(newErrors);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare query parameters (text fields)
      const queryParams = {
        CID: userId,
        Examination: formData.Examination,
        BoardOrUniversity: formData.BoardOrUniversity,
        YearOfPassing: formData.YearOfPassing,
        RollNumber: formData.RollNumber,
        MarksObtained: formData.MarksObtained || "",
        TotalMarks: formData.TotalMarks || "",
        Percentage: formData.Percentage || "",
        Grade: formData.Grade || "",
        Subject: formData.Subject || "",
      };

      // Prepare FormData (only files)
      const formDataToSend = new FormData();
      if (markSheetFile) {
        formDataToSend.append("MarkSheetFile", markSheetFile);
      }
      if (certificateFile) {
        formDataToSend.append("CertificateFile", certificateFile);
      }

      console.log("Query params:", queryParams);
      console.log("FormData files:", markSheetFile, certificateFile);

      const response = await API.post("/api/CandidateEducationalQualifications", formDataToSend, {
        params: queryParams,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("POST response:", response);

      if (response.data) {
        if (editingQualification) {
          toast({
            title: "✅ Update Successful",
            description: "Educational qualification has been updated successfully!",
          });
          handleCancelEdit();
        } else {
          toast({
            title: "Success",
            description: "Educational qualification submitted successfully!",
          });

          // Reset form
          setFormData({
            Examination: "",
            BoardOrUniversity: "",
            YearOfPassing: "",
            RollNumber: "",
            MarksObtained: "",
            TotalMarks: "",
            Percentage: "",
            Grade: "",
            Subject: "",
          });
          setMarkSheetFile(null);
          setCertificateFile(null);
          setValidationErrors({});
        }

        // Refresh qualifications
        await fetchQualifications();
      }
    } catch (error) {
      console.error("Error submitting qualification:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Failed to submit qualification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = () => {
    setLocation("/preferences");
  };

  const handleEditQualification = (qualification) => {
    console.log("Starting edit for qualification:", qualification);
    setEditingQualification(qualification);
    setFormData({
      Examination: qualification.examination || "",
      BoardOrUniversity: qualification.boardOrUniversity || "",
      YearOfPassing: qualification.yearOfPassing || "",
      RollNumber: qualification.rollNumber || "",
      MarksObtained: qualification.marksObtained || "",
      TotalMarks: qualification.totalMarks || "",
      Percentage: qualification.percentage || "",
      Grade: qualification.grade || "",
      Subject: qualification.subject || "",
    });
    // Clear any previously selected files for edit
    setMarkSheetFile(null);
    setCertificateFile(null);
    setValidationErrors({});
    console.log("Edit form initialized, files cleared");

    // Clear file input values manually
    setTimeout(() => {
      const markSheetInput = document.getElementById('markSheetFile');
      const certificateInput = document.getElementById('certificateFile');
      if (markSheetInput) markSheetInput.value = '';
      if (certificateInput) certificateInput.value = '';
      console.log("File input values cleared manually");
    }, 100);

    // Scroll to form
    document.querySelector('.space-y-4')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteQualification = async (qualificationId) => {
    if (!confirm("Are you sure you want to delete this qualification?")) {
      return;
    }

    try {
      await API.delete(`/api/CandidateEducationalQualifications/${qualificationId}`);
      toast({
        title: "Success",
        description: "Qualification deleted successfully!",
      });
      await fetchQualifications();
    } catch (error) {
      console.error("Error deleting qualification:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete qualification",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingQualification(null);
    setFormData({
      Examination: "",
      BoardOrUniversity: "",
      YearOfPassing: "",
      RollNumber: "",
      MarksObtained: "",
      TotalMarks: "",
      Percentage: "",
      Grade: "",
      Subject: "",
    });
    setMarkSheetFile(null);
    setCertificateFile(null);
    setValidationErrors({});
  };

  const handleFilePreview = async (filePath, fileName) => {
    if (!filePath) return;

    try {
      // Construct the full URL for the file
      // Use the same base URL as API calls
      const baseUrl = import.meta.env.VITE_API_BASE_URL_LOCAL ||
                     import.meta.env.VITE_API_BASE_URL_LIVE ||
                     'https://localhost:7036';

      // Remove trailing slash from base URL
      const cleanBaseUrl = baseUrl.replace(/\/$/, '');

      // File paths are stored as relative paths like "uploads/marksheets/filename.pdf"
      // So we need to add the base URL
      const fileUrl = `${cleanBaseUrl}/${filePath}`;

      console.log('Opening file:', fileUrl);

      // Open in new tab for preview/download
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error opening file:', error);
      toast({
        title: "Preview Failed",
        description: "Unable to open file preview",
        variant: "destructive",
      });
    }
  };

  const handleContinueToPayment = () => {
    if (qualifications.length === 0) {
      toast({
        title: "No Qualifications",
        description: "Please submit at least one educational qualification.",
        variant: "destructive",
      });
      return;
    }

    setLocation("/payment");

    toast({
      title: "Qualifications Complete!",
      description: "Educational qualifications submitted. Proceeding to payment.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading qualifications...</div>
      </div>
    );
  }

  return (
    
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#050C9C] mb-2">Educational Qualifications</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Submit your educational qualifications with supporting documents.
          </p>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingQualification ? "Edit Educational Qualification" : "Add Educational Qualification"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="Examination" className={validationErrors.Examination ? "text-red-600" : ""}>
                    Examination * {validationErrors.Examination && <span className="text-red-600 text-sm">({validationErrors.Examination})</span>}
                    {editingQualification && <span className="text-xs text-gray-500 ml-1">(Cannot be changed during edit)</span>}
                  </Label>
                  <Select
                    value={formData.Examination}
                    onValueChange={(value) => handleInputChange("Examination", value)}
                    disabled={editingQualification}
                  >
                    <SelectTrigger className={`w-full ${validationErrors.Examination ? "border-red-500" : ""} ${editingQualification ? "bg-gray-100" : ""}`}>
                      <SelectValue placeholder="Select examination type" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-white border border-gray-200 shadow-lg">
                      {examinationOptions.map((exam) => (
                        <SelectItem key={exam.examinationID} value={exam.examName}>
                          {exam.examName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="BoardOrUniversity" className={validationErrors.BoardOrUniversity ? "text-red-600" : ""}>
                    Board/University * {validationErrors.BoardOrUniversity && <span className="text-red-600 text-sm">({validationErrors.BoardOrUniversity})</span>}
                  </Label>
                  <Input
                    id="BoardOrUniversity"
                    value={formData.BoardOrUniversity}
                    onChange={(e) => handleInputChange("BoardOrUniversity", e.target.value)}
                    placeholder="e.g., CBSE, UPES"
                    className={validationErrors.BoardOrUniversity ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="YearOfPassing" className={validationErrors.YearOfPassing ? "text-red-600" : ""}>
                    Year of Passing * {validationErrors.YearOfPassing && <span className="text-red-600 text-sm">({validationErrors.YearOfPassing})</span>}
                  </Label>
                  <Input
                    id="YearOfPassing"
                    value={formData.YearOfPassing}
                    onChange={(e) => handleInputChange("YearOfPassing", e.target.value)}
                    placeholder="e.g., 2020"
                    className={validationErrors.YearOfPassing ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="RollNumber" className={validationErrors.RollNumber ? "text-red-600" : ""}>
                    Roll Number * {validationErrors.RollNumber && <span className="text-red-600 text-sm">({validationErrors.RollNumber})</span>}
                  </Label>
                  <Input
                    id="RollNumber"
                    value={formData.RollNumber}
                    onChange={(e) => handleInputChange("RollNumber", e.target.value)}
                    placeholder="Roll number"
                    className={validationErrors.RollNumber ? "border-red-500" : ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="MarksObtained">Marks Obtained</Label>
                  <Input
                    id="MarksObtained"
                    value={formData.MarksObtained}
                    onChange={(e) => handleInputChange("MarksObtained", e.target.value)}
                    placeholder="e.g., 450"
                  />
                </div>
                <div>
                  <Label htmlFor="TotalMarks">Total Marks</Label>
                  <Input
                    id="TotalMarks"
                    value={formData.TotalMarks}
                    onChange={(e) => handleInputChange("TotalMarks", e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>
                <div>
                  <Label htmlFor="Percentage">Percentage</Label>
                  <Input
                    id="Percentage"
                    value={formData.Percentage}
                    onChange={(e) => {
                      // Only allow numeric characters and decimal point
                      let value = e.target.value.replace(/[^0-9.]/g, '');

                      // Prevent multiple decimal points
                      const parts = value.split('.');
                      if (parts.length > 2) {
                        value = parts[0] + '.' + parts.slice(1).join('');
                      }

                      // Limit to 100 and 2 decimal places
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        if (numValue > 100) {
                          value = '100';
                        } else if (parts[1] && parts[1].length > 2) {
                          value = parts[0] + '.' + parts[1].substring(0, 2);
                        }
                      }

                      handleInputChange("Percentage", value);
                    }}
                    placeholder="e.g., 90.5"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="Grade">Grade</Label>
                  <Input
                    id="Grade"
                    value={formData.Grade}
                    onChange={(e) => {
                      // Only allow alphabetic characters and common grade symbols
                      const value = e.target.value.replace(/[^a-zA-Z+\-]/g, '');
                      handleInputChange("Grade", value);
                    }}
                    placeholder="e.g., A+"
                    pattern="[a-zA-Z+\-]*"
                    title="Only letters and grade symbols (+, -) allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="Subject">Subject</Label>
                  <Input
                    id="Subject"
                    value={formData.Subject}
                    onChange={(e) => handleInputChange("Subject", e.target.value)}
                    placeholder="e.g., Science, Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="markSheetFile">
                    Mark Sheet File {editingQualification && <span className="text-xs text-gray-500">(Optional - leave empty to keep current)</span>}
                  </Label>
                  <Input
                    id="markSheetFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("markSheet", e.target.files[0])}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG up to 5MB
                    {markSheetFile && <span className="text-green-600 ml-1">✓ {markSheetFile.name}</span>}
                  </p>
                  {markSheetFile && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border">
                      <p className="text-xs text-gray-600">Selected: {markSheetFile.name}</p>
                      <p className="text-xs text-gray-500">Size: {(markSheetFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="certificateFile">
                    Certificate File {editingQualification && <span className="text-xs text-gray-500">(Optional - leave empty to keep current)</span>}
                  </Label>
                  <Input
                    id="certificateFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("certificate", e.target.files[0])}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG up to 5MB
                    {certificateFile && <span className="text-green-600 ml-1">✓ {certificateFile.name}</span>}
                  </p>
                  {certificateFile && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border">
                      <p className="text-xs text-gray-600">Selected: {certificateFile.name}</p>
                      <p className="text-xs text-gray-500">Size: {(certificateFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
              {editingQualification && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Current Files:</strong>
                  </p>
                  <div className="mt-1 text-xs text-blue-600">
                    • Mark Sheet: {editingQualification.markSheetpath ? 'Uploaded' : 'Not uploaded'}
                    {markSheetFile && <span className="text-green-600 font-medium"> → Will be replaced</span>}
                  </div>
                  <div className="text-xs text-blue-600">
                    • Certificate: {editingQualification.certificatePath ? 'Uploaded' : 'Not uploaded'}
                    {certificateFile && <span className="text-green-600 font-medium"> → Will be replaced</span>}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button onClick={handleSubmit} className="bg-[#050C9C] hover:bg-[#050C9C]/90 text-white font-semibold w-full sm:w-auto">
                  {isSubmitting ? (editingQualification ? "Updating..." : "Submitting...") : (editingQualification ? "Update Qualification" : "Submit Qualification")}
                </Button>
                {editingQualification && (
                  <Button onClick={handleCancelEdit} variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            {qualifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No qualifications submitted yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-xs">SN.</TableHead>
                    <TableHead className="text-xs">Examination</TableHead>
                    <TableHead className="text-xs">Board/University</TableHead>
                    <TableHead className="text-xs">Year</TableHead>
                    <TableHead className="text-xs">Roll No.</TableHead>
                    <TableHead className="text-xs">Marks</TableHead>
                    <TableHead className="text-xs">%</TableHead>
                    <TableHead className="text-xs">Grade</TableHead>
                    <TableHead className="text-xs">Subject</TableHead>
                    <TableHead className="text-xs">Mark Sheet</TableHead>
                    <TableHead className="text-xs">Certificate</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualifications.map((qual, index) => (
                    <TableRow key={qual.ceqid} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <TableCell className="font-medium text-xs">{index + 1}</TableCell>
                      <TableCell className="font-medium text-xs">{qual.examination}</TableCell>
                      <TableCell className="text-xs">{qual.boardOrUniversity}</TableCell>
                      <TableCell className="text-xs">{qual.yearOfPassing}</TableCell>
                      <TableCell className="text-xs">{qual.rollNumber}</TableCell>
                      <TableCell className="text-xs">
                        {qual.marksObtained && qual.totalMarks
                          ? `${qual.marksObtained}/${qual.totalMarks}`
                          : qual.marksObtained || "-"}
                      </TableCell>
                      <TableCell className="text-xs">{qual.percentage || "-"}</TableCell>
                      <TableCell className="text-xs">{qual.grade || "-"}</TableCell>
                      <TableCell className="text-xs">{qual.subject || "-"}</TableCell>
                      <TableCell className="text-xs">
                        {qual.markSheetpath ? (
                          <Badge variant="outline" className="text-green-600 text-xs px-2 py-1 bg-green-50 border-green-200">
                            {qual.markSheetpath.split(/[/\\]/).pop()}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs px-2 py-1">No File</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {qual.certificatePath ? (
                          <Badge variant="outline" className="text-green-600 text-xs px-2 py-1 bg-green-50 border-green-200">
                            {qual.certificatePath.split(/[/\\]/).pop()}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs px-2 py-1">No File</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQualification(qual)}
                            className="text-blue-600 hover:text-blue-700 text-xs px-1 py-0 h-6"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQualification(qual.ceqid)}
                            className="text-red-600 hover:text-red-700 text-xs px-1 py-0 h-6"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" className="order-2 sm:order-1" onClick={handlePreviousStep}>
            Previous Step
          </Button>
          <Button
            className="bg-[#050C9C] hover:bg-[#050C9C]/90 order-1 sm:order-2"
            onClick={handleContinueToPayment}
            disabled={qualifications.length === 0}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    
  );
}
