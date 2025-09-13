import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Upload, Check, AlertCircle, Download, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

export function DocumentsSection({ onStepComplete }) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [documentsLocked, setDocumentsLocked] = useState(false);
  const [optionalDocuments, setOptionalDocuments] = useState([]);
  const [uploadingOptionalDoc, setUploadingOptionalDoc] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRefs = useRef({});
  const optionalFileInputRef = useRef(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  // Check document completion status and update user accordingly
  useEffect(() => {
    if (documentTypes.length > 0 && userDocuments.length >= 0) {
      const requiredDocTypes = documentTypes.filter(dt => dt.isRequired);
      const uploadedRequiredDocs = userDocuments.filter(doc => 
        doc.documentTypeId && requiredDocTypes.some(dt => dt.id === doc.documentTypeId)
      );
      
      const allRequiredUploaded = requiredDocTypes.length > 0 && 
        requiredDocTypes.every(dt => uploadedRequiredDocs.some(doc => doc.documentTypeId === dt.id));
      
      // Update user completion status if it doesn't match current state
      if (user && user.documentsCompleted !== allRequiredUploaded) {
        updateUser({ ...user, documentsCompleted: allRequiredUploaded });
      }
    }
  }, [documentTypes, userDocuments, user, updateUser]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch document types
      const docTypesResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/document-types`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const docTypesData = await docTypesResponse.json();

      if (docTypesData.success) {
        setDocumentTypes(docTypesData.data);
      }

      // Fetch user documents
      const userDocsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userDocsData = await userDocsResponse.json();

      if (userDocsData.success) {
        // Clean filenames when setting user documents
        const cleanedDocuments = userDocsData.data.map(doc => ({
          ...doc,
          fileName: cleanFileName(doc.fileName)
        }));
        setUserDocuments(cleanedDocuments);
        
        // Separate optional documents (documents without a documentTypeId - truly optional uploads)
        const optionalDocs = cleanedDocuments.filter(doc => 
          doc.documentTypeId === null
        );
        setOptionalDocuments(optionalDocs);
        
        // Check if documents are locked
        const hasLockedDocs = cleanedDocuments.some(doc => doc.isLocked);
        setDocumentsLocked(hasLockedDocs);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDocumentUploaded = (docTypeId) => {
    return userDocuments.some(doc => doc.documentTypeId === docTypeId);
  };

  const getUploadedDocument = (docTypeId) => {
    return userDocuments.find(doc => doc.documentTypeId === docTypeId);
  };

  const handleFileUpload = async (docTypeId, file) => {
    if (!file) return;

    // Check if documents are locked
    if (documentsLocked) {
      toast({
        title: "Documents Locked",
        description: "Documents have been verified and cannot be modified.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type - Only PDF allowed
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (25KB minimum, 500KB maximum)
    const minSize = 25 * 1024; // 25KB
    const maxSize = 500 * 1024; // 500KB

    if (file.size < minSize) {
      toast({
        title: "File Too Small",
        description: "File size must be at least 25KB",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must not exceed 500KB",
        variant: "destructive",
      });
      return;
    }

    setUploadingDocId(docTypeId);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentTypeId', docTypeId);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Upload Successful",
          description: "Document uploaded successfully!",
        });
        await fetchData(); // Refresh the data first

        // Re-fetch user documents to get the latest state
        const token = localStorage.getItem('token');
        const userDocsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/documents`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userDocsData = await userDocsResponse.json();

        if (userDocsData.success) {
          const updatedUserDocuments = userDocsData.data;
          
          // Check if all required docs are now uploaded using the fresh data
          const requiredDocTypes = documentTypes.filter(dt => dt.isRequired);
          const missingDocs = requiredDocTypes.filter(dt => 
            !updatedUserDocuments.some(doc => doc.documentTypeId === dt.id)
          );
          
          if (missingDocs.length === 0 && user) {
            updateUser({ ...user, documentsCompleted: true });
            // Show verification option when all documents are uploaded
            if (!documentsLocked) {
              setShowVerification(true);
            }
          }
        }
      } else {
        toast({
          title: "Upload Failed",
          description: data.message || "Failed to upload document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    // Check if documents are locked
    if (documentsLocked) {
      toast({
        title: "Documents Locked",
        description: "Documents have been verified and cannot be modified.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Document Deleted",
          description: "Document deleted successfully!",
        });
        await fetchData();
        
        // Re-fetch user documents to get the latest state after deletion
        const token = localStorage.getItem('token');
        const userDocsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/documents`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userDocsData = await userDocsResponse.json();

        if (userDocsData.success && user) {
          const updatedUserDocuments = userDocsData.data;
          
          // Check if any required docs are now missing using the fresh data
          const requiredDocTypes = documentTypes.filter(dt => dt.isRequired);
          const missingDocs = requiredDocTypes.filter(dt => 
            !updatedUserDocuments.some(doc => doc.documentTypeId === dt.id)
          );
          
          // If any required docs are missing, mark as incomplete
          if (missingDocs.length > 0) {
            updateUser({ ...user, documentsCompleted: false });
          }
        }
      } else {
        toast({
          title: "Delete Failed",
          description: data.message || "Failed to delete document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast({
          title: "Download Failed",
          description: "Failed to download document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreviewDocument = async (document) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/documents/${document.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPreviewDocument(document);
        setPreviewUrl(url);
      } else {
        toast({
          title: "Preview Failed",
          description: "Failed to load document preview",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Preview Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }
    setPreviewDocument(null);
    setPreviewUrl(null);
  };

  const cleanFileName = (fileName) => {
    if (!fileName) return '';
    // Remove all prefixes including optional_, undefined_, and timestamp patterns
    return fileName.replace(/^(optional_|undefined_\d+_|\d+_)/, '');
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'document';
  };

  const handleVerifyDocuments = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/verify-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ verificationCode })
      });

      const data = await response.json();

      if (data.success) {
        setDocumentsLocked(true);
        setShowVerification(false);
        updateUser({ ...user, documentsVerified: true });
        await fetchData(); // Refresh to get updated lock status
        
        // Notify parent component that documents are verified
        if (onStepComplete) {
          onStepComplete({ documentsVerified: true });
        }
        
        toast({
          title: "Documents Verified!",
          description: "Your documents have been verified and locked. You can now proceed to payment.",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid verification code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOptionalFileUpload = async (file) => {
    if (!file) return;

    // Check if documents are locked
    if (documentsLocked) {
      toast({
        title: "Documents Locked",
        description: "Documents have been verified and cannot be modified.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type - Only PDF allowed
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (25KB minimum, 500KB maximum)
    const minSize = 25 * 1024; // 25KB
    const maxSize = 500 * 1024; // 500KB

    if (file.size < minSize) {
      toast({
        title: "File Too Small",
        description: "File size must be at least 25KB",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must not exceed 500KB",
        variant: "destructive",
      });
      return;
    }

    setUploadingOptionalDoc(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isOptional', 'true');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Upload Successful",
          description: "Optional document uploaded successfully!",
        });
        await fetchData(); // Refresh the data
      } else {
        toast({
          title: "Upload Failed",
          description: data.message || "Failed to upload document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingOptionalDoc(false);
      // Clear the file input
      if (optionalFileInputRef.current) {
        optionalFileInputRef.current.value = '';
      }
    }
  };

  const handlePreviousStep = () => {
    setLocation('/preferences');
  };

  const handleContinueToPayment = () => {
    // Check if all required documents are uploaded
    const requiredDocTypes = documentTypes.filter(dt => dt.isRequired);
    const missingDocs = requiredDocTypes.filter(dt => !isDocumentUploaded(dt.id));

    if (missingDocs.length > 0) {
      toast({
        title: "Missing Required Documents",
        description: `Please upload: ${missingDocs.map(doc => doc.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    if (!documentsLocked) {
      toast({
        title: "Documents Not Verified",
        description: "Please verify your documents before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to payment section
    setLocation('/payment');

    toast({
      title: "Documents Complete!",
      description: "All required documents uploaded and verified. Proceeding to payment.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#050C9C] mb-2">Document Upload</h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Upload all required documents in PDF format only. File size: 25KB - 500KB
          </p>
        </div>

        {/* File Requirements Warning */}
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important File Requirements</h3>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• <strong>Format:</strong> PDF files only</p>
                  <p>• <strong>Size:</strong> Minimum 25KB, Maximum 500KB</p>
                  <p>• <strong>Quality:</strong> Ensure documents are clear and readable</p>
                  <p>• <strong>Content:</strong> Upload original or certified copies only</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Upload Progress</h3>
                  <p className="text-sm text-blue-600">
                    {documentTypes.filter(dt => dt.isRequired && isDocumentUploaded(dt.id)).length} of {documentTypes.filter(dt => dt.isRequired).length} required documents uploaded
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-800">
                  {Math.round((documentTypes.filter(dt => dt.isRequired && isDocumentUploaded(dt.id)).length / Math.max(documentTypes.filter(dt => dt.isRequired).length, 1)) * 100)}%
                </div>
                <div className="text-xs text-blue-600">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Section */}
        {showVerification && !documentsLocked && (
          <Card className="mb-6 bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">Verify Your Documents</h3>
                <p className="text-amber-700 mb-6">
                  All required documents have been uploaded. Please enter the verification code to lock your documents and proceed.
                </p>
                
                <div className="max-w-sm mx-auto space-y-4">
                  <div>
                    <Label htmlFor="verificationCode" className="text-amber-800 font-medium">
                      Verification Code
                    </Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-lg font-mono mt-2"
                    />
                  </div>
                  
                  <Button
                    onClick={handleVerifyDocuments}
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    {isVerifying ? "Verifying..." : "Verify Documents"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verified Status */}
        {documentsLocked && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Documents Verified & Locked</h3>
                  <p className="text-sm text-green-600">
                    Your documents have been verified and are now locked. No further changes can be made.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {documentTypes.map((docType) => {
            const isUploaded = isDocumentUploaded(docType.id);
            const uploadedDoc = getUploadedDocument(docType.id);
            const isUploading = uploadingDocId === docType.id;

            return (
              <Card key={docType.id} className={`border-2 transition-all duration-200 hover:shadow-md ${
                documentsLocked ? 'border-gray-300 bg-gray-50 opacity-75' : 
                isUploaded ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}>
                <CardContent className="p-4">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                      `}>
                        {isUploaded ? <Check className="h-4 w-4" /> : <FileUp className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm lg:text-base truncate">{docType.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {docType.isRequired ? (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs px-1 py-0">Optional</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{docType.description}</p>

                  

                  {/* Upload Status */}
                  {isUploaded && (
                    <div className="mb-3 p-2 bg-green-100 rounded text-xs">
                      <div className="flex items-center text-green-700">
                        <Check className="h-3 w-3 mr-1" />
                        <span className="font-medium">Uploaded</span>
                      </div>
                      <div className="text-green-600 truncate mt-1" title={cleanFileName(uploadedDoc.fileName)}>
                        {cleanFileName(uploadedDoc.fileName)}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {isUploaded ? (
                      <div className="space-y-2">
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handlePreviewDocument(uploadedDoc)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleDownloadDocument(uploadedDoc.id, cleanFileName(uploadedDoc.fileName))}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          {!documentsLocked && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 px-2"
                              onClick={() => handleDeleteDocument(uploadedDoc.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {documentsLocked && (
                          <div className="text-xs text-gray-500 text-center mt-2">
                            🔒 Document locked after verification
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {!documentsLocked ? (
                          <>
                            <input
                              type="file"
                              ref={el => fileInputRefs.current[docType.id] = el}
                              onChange={(e) => handleFileUpload(docType.id, e.target.files[0])}
                              accept=".pdf"
                              className="hidden"
                            />
                            <Button
                              className="w-full bg-[#050C9C] hover:bg-[#050C9C]/90 text-xs"
                              size="sm"
                              onClick={() => fileInputRefs.current[docType.id]?.click()}
                              disabled={isUploading}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              {isUploading ? "Uploading..." : "Upload File"}
                            </Button>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-xs text-gray-500 mb-2">🔒 Upload locked</div>
                            <div className="text-xs text-gray-400">Documents verified</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Optional Documents Section */}
        <div className="mt-8">
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center">
                <FileUp className="h-5 w-5 mr-2" />
                Additional Documents (Optional)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Upload any additional documents you'd like to include with your application. 
              </p>
            </CardHeader>
            <CardContent>
              {!documentsLocked ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      type="file"
                      ref={optionalFileInputRef}
                      onChange={(e) => handleOptionalFileUpload(e.target.files[0])}
                      accept=".pdf"
                      className="hidden"
                    />
                    <Button
                      onClick={() => optionalFileInputRef.current?.click()}
                      disabled={uploadingOptionalDoc}
                      className="bg-gray-600 hover:bg-gray-700 w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingOptionalDoc ? "Uploading..." : "Upload Optional Document"}
                    </Button>
                    <div className="text-sm text-gray-500">
                      PDF only • 25KB - 500KB
                    </div>
                  </div>
                  
                  {/* Display uploaded optional documents */}
                  {optionalDocuments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-3">Uploaded Optional Documents:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {optionalDocuments.map((doc) => (
                          <div key={doc.id} className="bg-white border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate" title={cleanFileName(doc.fileName)}>
                                  {cleanFileName(doc.fileName)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-1 ml-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="p-1 h-7 w-7"
                                  onClick={() => handlePreviewDocument(doc)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="p-1 h-7 w-7"
                                  onClick={() => handleDownloadDocument(doc.id, cleanFileName(doc.fileName))}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="p-1 h-7 w-7 text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">🔒 Upload locked</div>
                  <div className="text-sm text-gray-400">Documents have been verified and locked</div>
                  {optionalDocuments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-3">Your Optional Documents:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {optionalDocuments.map((doc) => (
                          <div key={doc.id} className="bg-white border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate" title={cleanFileName(doc.fileName)}>
                                  {cleanFileName(doc.fileName)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-1 ml-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="p-1 h-7 w-7"
                                  onClick={() => handlePreviewDocument(doc)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="p-1 h-7 w-7"
                                  onClick={() => handleDownloadDocument(doc.id, cleanFileName(doc.fileName))}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            className="order-2 sm:order-1"
            onClick={handlePreviousStep}
          >
            Previous Step
          </Button>
          <Button
            className="bg-[#050C9C] hover:bg-[#050C9C]/90 order-1 sm:order-2"
            onClick={handleContinueToPayment}
            disabled={
              documentTypes.filter(dt => dt.isRequired).some(dt => !isDocumentUploaded(dt.id)) ||
              !documentsLocked
            }
          >
            Continue to Payment
          </Button>
        </div>

        {/* Document Preview Modal */}
        {previewDocument && previewUrl && (
          <Dialog open={!!previewDocument} onOpenChange={closePreview}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <DialogHeader className="p-4 pb-2">
                <DialogTitle className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold">{previewDocument.documentType?.name}</span>
                    <p className="text-sm text-gray-600 mt-1">{cleanFileName(previewDocument.fileName)}</p>
                  </div>
                 
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-auto p-4 pt-0">
                {getFileType(cleanFileName(previewDocument.fileName)) === 'image' ? (
                  <div className="flex justify-center">
                    <img
                      src={previewUrl}
                      alt={cleanFileName(previewDocument.fileName)}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : getFileType(cleanFileName(previewDocument.fileName)) === 'pdf' ? (
                  <div className="w-full h-[70vh]">
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border rounded-lg"
                      title={cleanFileName(previewDocument.fileName)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <FileUp className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Preview not available for this file type</p>
                    <p className="text-sm text-gray-500 mb-4">{cleanFileName(previewDocument.fileName)}</p>
                    <Button
                      onClick={() => handleDownloadDocument(previewDocument.id, cleanFileName(previewDocument.fileName))}
                      className="bg-[#050C9C] hover:bg-[#050C9C]/90"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}