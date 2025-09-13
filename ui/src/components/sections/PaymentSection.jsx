import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Building,
  Smartphone,
  Wallet,
  ArrowRight,
  Check,
  FileText,
  MapPin,
  AlertCircle
} from "lucide-react";

export function PaymentSection() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [userPreferences, setUserPreferences] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock payment data for now
  const payment = null;
  const paymentLoading = false;
  const isPaid = false;

  // Fetch user preferences and documents
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user preferences
      const preferencesResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/preferences`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const preferencesData = await preferencesResponse.json();
      
      if (preferencesData.success) {
        setUserPreferences(preferencesData.data);
      }

      // Fetch user documents
      const documentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const documentsData = await documentsResponse.json();
      
      if (documentsData.success) {
        setUserDocuments(documentsData.data);
      }

      // Fetch document types
      const docTypesResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/document-types`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const docTypesData = await docTypesResponse.json();
      
      if (docTypesData.success) {
        setDocumentTypes(docTypesData.data);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock payment mutation
  const paymentMutation = {
    mutate: ({ category, paymentMethod }) => {
      toast({
        title: "Payment Initiated",
        description: `Payment of ₹${getFeeAmount(category)} via ${paymentMethod} initiated successfully`,
      });
    },
    isPending: false
  };

  const getFeeAmount = (category) => {
    return category === "scst" ? 400 : 800;
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "scst":
        return "SC/ST";
      default:
        return "General/EWS/OBC";
    }
  };

  const handleProceedToPayment = () => {
    // Check if preferences are completed
    if (userPreferences.length !== 5) {
      toast({
        title: "Incomplete Preferences",
        description: "Please complete your institute preferences (select 5 institutes) before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }

    // Check if required documents are uploaded
    const requiredDocTypes = documentTypes.filter(dt => dt.isRequired);
    const uploadedRequiredDocs = userDocuments.filter(doc =>
      requiredDocTypes.some(dt => dt.id === doc.documentTypeId)
    );
    if (uploadedRequiredDocs.length !== requiredDocTypes.length) {
      toast({
        title: "Incomplete Documents",
        description: "Please upload all required documents before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: t("common.error"),
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    if (!declarationAccepted) {
      toast({
        title: t("common.error"),
        description: "Please accept the declaration to proceed with payment",
        variant: "destructive",
      });
      return;
    }

    paymentMutation.mutate({
      category: selectedCategory,
      paymentMethod: selectedPaymentMethod,
    });
  };

  const cleanFileName = (fileName) => {
    if (!fileName) return '';
    return fileName.replace(/^(optional_|undefined_\d+_|\d+_)/, '');
  };

  const paymentMethods = [
    { id: "card", label: t("payment.creditCard"), icon: CreditCard },
    { id: "netbanking", label: t("payment.netBanking"), icon: Building },
    { id: "upi", label: t("payment.upi"), icon: Smartphone },
    { id: "wallet", label: t("payment.wallet"), icon: Wallet },
  ];

  if (paymentLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg" data-testid="text-loading">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2" data-testid="text-section-title">
            {t("payment.title")}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base" data-testid="text-section-subtitle">
            {t("payment.subtitle")}
          </p>
          {isPaid && (
            <Badge className="bg-green-500 hover:bg-green-600 mt-3" data-testid="badge-paid">
              <Check className="h-4 w-4 mr-1" />
              Payment Completed
            </Badge>
          )}
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

          {/* Left Column - Preferences, Documents, Declaration, Fee Structure */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">

            {/* Combined User Summary Section */}
            <Card className="border-2 border-[#050C9C] max-h-[600px] overflow-y-auto" data-testid="card-user-summary">
              <CardContent className="p-4">
                {/* User Preferences Summary */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-[#050C9C]" />
                    <h3 className="text-lg font-semibold text-[#050C9C]" data-testid="text-preferences-title">
                      Selected Preferences
                    </h3>
                  </div>
                  {userPreferences.length > 0 ? (
                    <div className="space-y-2">
                      {userPreferences.slice(0, 5).map((pref, index) => (
                        <div key={pref.id} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <Badge className="bg-[#050C9C] text-white text-xs px-1 py-0">
                            {index + 1}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{pref.institute?.InstituteName}</div>
                            <div className="text-xs text-gray-600 truncate">{pref.institute?.Category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No preferences selected</p>
                    </div>
                  )}
                </div>

                {/* Divider Line */}
                <hr className="border-gray-300 my-6" />

                {/* User Documents Summary */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 mr-2 text-[#050C9C]" />
                    <h3 className="text-lg font-semibold text-[#050C9C]" data-testid="text-documents-title">
                      Uploaded Documents
                    </h3>
                  </div>
                  {userDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {userDocuments.map((doc) => {
                        const docType = documentTypes.find(dt => dt.id === doc.documentTypeId);
                        return (
                          <div key={doc.id} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-100">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {docType?.name || 'Optional Document'}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {cleanFileName(doc.fileName)}
                              </div>
                            </div>
                            {doc.isLocked && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No documents uploaded</p>
                    </div>
                  )}
                </div>

                {/* Divider Line */}
                <hr className="border-gray-300 my-6" />

                {/* Declaration/Confirmation Section */}
                {!isPaid && (
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-4" data-testid="text-declaration-title">
                      Confirmation & Declaration
                    </h3>
                    <div className="space-y-4">
                      <div className="text-sm text-amber-700 space-y-2">
                        <p>I hereby declare that:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>All information provided is true and accurate</li>
                          <li>All uploaded documents are genuine and valid</li>
                          <li>I understand that any false information may lead to rejection</li>
                          <li>I agree to the terms and conditions of the application process</li>
                          <li>The payment made is non-refundable except as per policy</li>
                        </ul>
                      </div>
                      <div className="flex items-start space-x-3 p-3 border border-amber-200 rounded-lg bg-white">
                        <Checkbox
                          id="declaration"
                          checked={declarationAccepted}
                          onCheckedChange={setDeclarationAccepted}
                          data-testid="checkbox-declaration"
                        />
                        <Label htmlFor="declaration" className="text-sm font-medium cursor-pointer flex-1" data-testid="label-declaration">
                          I accept the above declaration and agree to proceed with the payment
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>


           

            
          </div>

          {/* Right Column - Payment Summary & Methods */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">

            {/* Payment Summary */}
            <Card className="border-[#050C9C]" data-testid="card-payment-summary">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg font-semibold text-[#050C9C]" data-testid="text-payment-summary">
                  {t("payment.summary")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#050C9C]/5 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                    <span className="text-base sm:text-lg font-medium" data-testid="text-total-amount">
                      {t("payment.totalAmount")}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#050C9C]" data-testid="text-amount-value">
                      ₹{isPaid ? payment.amount / 100 : getFeeAmount(selectedCategory)}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600" data-testid="text-category-info">
                    <Badge variant="secondary" className="bg-[#050C9C]/10 text-[#050C9C] border-0">
                      {t("payment.category")}: {isPaid ? getCategoryLabel(payment.category) : getCategoryLabel(selectedCategory)}
                    </Badge>
                  </div>
                  
                </div>
                
              </CardContent>
              {/* Category Selection */}
            {!isPaid && (
              <Card data-testid="card-category-selection">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg font-semibold" data-testid="text-select-category">
                    {t("payment.selectCategory")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    data-testid="radio-category"
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                      <RadioGroupItem value="general" id="general" data-testid="radio-general" />
                      <Label htmlFor="general" className="flex-1 cursor-pointer text-sm sm:text-base" data-testid="label-general">
                        General/EWS/OBC
                      </Label>
                      <span className="text-xs sm:text-sm font-semibold text-[#050C9C]">₹800</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50 transition-colors">
                      <RadioGroupItem value="scst" id="scst" data-testid="radio-scst" />
                      <Label htmlFor="scst" className="flex-1 cursor-pointer text-sm sm:text-base" data-testid="label-scst">
                        SC/ST
                      </Label>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">₹400</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
            </Card>

            {/* Payment Methods */}
            {!isPaid && (
              <Card data-testid="card-payment-methods">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg font-semibold" data-testid="text-payment-method">
                    {t("payment.methods")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = selectedPaymentMethod === method.id;
                      return (
                        <Button
                          key={method.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`p-3 sm:p-4 h-auto flex-col transition-all ${isSelected
                            ? "bg-[#050C9C] hover:bg-[#050C9C]/90 scale-105"
                            : "hover:border-[#050C9C] hover:scale-102"
                            }`}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          data-testid={`button-payment-${method.id}`}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-2" />
                          <div className="text-xs sm:text-sm font-medium text-center leading-tight">
                            {method.label}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

          

            {/* Payment Status or Proceed Button */}
            {isPaid ? (
              <Card className="bg-green-50 border-green-200" data-testid="card-payment-complete">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4">
                    <Check className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800 text-sm sm:text-base" data-testid="text-payment-completed">
                        Payment Completed Successfully
                      </div>
                      <div className="text-xs sm:text-sm text-green-600 mt-1" data-testid="text-transaction-id">
                        Transaction ID: {payment.transactionId}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex justify-center">
                <Button
                  className="bg-[#050C9C] hover:bg-[#050C9C]/90 text-sm sm:text-base py-2 sm:py-3 px-8 sm:px-12"
                  onClick={handleProceedToPayment}
                  disabled={!selectedPaymentMethod || !declarationAccepted || paymentMutation.isPending}
                  data-testid="button-proceed-payment"
                >
                  {paymentMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("common.loading")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {t("payment.proceed")}
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}