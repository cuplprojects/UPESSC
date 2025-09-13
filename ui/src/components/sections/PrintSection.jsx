import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Check,
  AlertCircle,
  Printer,
  GraduationCap,
  CreditCard,
} from "lucide-react";

export function PrintSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applicationData, setApplicationData] = useState({
    preferences: [],
    documents: [],
    payment: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationData();
  }, []);

  const fetchApplicationData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [preferencesRes, documentsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/users/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/users/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const preferencesData = await preferencesRes.json();
      const documentsData = await documentsRes.json();

      setApplicationData({
        preferences: preferencesData.success ? preferencesData.data : [],
        documents: documentsData.success ? documentsData.data : [],
        payment: {
          status: "completed",
          amount: 800,
          transactionId: "TXN123456789",
        },
      });
    } catch (error) {
      console.error("Error fetching application data:", error);
      toast({
        title: "Error",
        description: "Failed to load application data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isApplicationComplete =
    applicationData.preferences.length > 0 &&
    applicationData.documents.length > 0 &&
    applicationData.payment?.status === "completed";

  const printableDocuments = [
    {
      id: 1,
      name: "Application Summary",
      available: isApplicationComplete,
      description: "Complete application with all details",
      type: "summary",
    },
    {
      id: 2,
      name: "Admit Card",
      available: isApplicationComplete,
      description: "Interview admit card",
      type: "admit",
    },
    {
      id: 3,
      name: "Payment Receipt",
      available: applicationData.payment?.status === "completed",
      description: "Fee payment receipt",
      type: "receipt",
    },
  ];

  const handlePrint = (docType) => {
    if (!isApplicationComplete && docType !== "receipt") {
      toast({
        title: "Application Incomplete",
        description: "Please complete all sections before printing documents.",
        variant: "destructive",
      });
      return;
    }

    if (docType === "admit") {
      navigate("/interview-admit-card");
    } else {
      generateDocument(docType);
    }
  };

  const generateDocument = (docType) => {
    let content = "";

    switch (docType) {
      case "summary":
        content = generatePrintableHTML();
        break;
      case "admit":
        content = generateAdmitCard();
        break;
      case "receipt":
        content = generatePaymentReceipt();
        break;
      default:
        content = generatePrintableHTML();
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(content);
    iframe.contentDocument.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  // --------------------------
  // COMMON STYLES FOR PRINT
  // --------------------------
  const printStyles = `
    body { font-family: 'Times New Roman', serif; margin: 2cm; line-height: 1.6; background: #fff; color: #000; }
    .header { text-align: center; border-bottom: 2px solid #050C9C; padding-bottom: 15px; margin-bottom: 25px; }
    .header h1 { margin: 0; font-size: 22px; color: #050C9C; }
    .section { margin-bottom: 25px; }
    .section h2 { font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ccc; color: #050C9C; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item { padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; }
    .label { font-weight: bold; display: block; }
    table { border-collapse: collapse; width: 100%; font-size: 14px; }
    th, td { border: 1px solid #333; padding: 6px; text-align: left; }
    th { background: #f2f2f2; }
    .footer { text-align: right; margin-top: 40px; font-size: 14px; }
    @page { size: A4; margin: 1.5cm; }
  `;

  // --------------------------
  // APPLICATION SUMMARY
  // --------------------------
  const generatePrintableHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Application Summary - ${user?.firstName} ${user?.lastName}</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <div class="header">
          <h1>Application Summary</h1>
          <p><strong>Application ID:</strong> APP${user?.id || "N/A"}</p>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>Personal Information</h2>
          <div class="info-grid">
            <div class="info-item"><span class="label">Name:</span> ${user?.firstName || ""} ${user?.lastName || ""}</div>
            <div class="info-item"><span class="label">Email:</span> ${user?.email || "N/A"}</div>
            <div class="info-item"><span class="label">Phone:</span> ${user?.phone || "N/A"}</div>
            <div class="info-item"><span class="label">Category:</span> ${user?.category || "N/A"}</div>
          </div>
        </div>

        <div class="section">
          <h2>Institute Preferences</h2>
          <table>
            <tr><th>#</th><th>Institute</th><th>Location</th></tr>
            ${applicationData.preferences
              .map(
                (pref, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${pref.institute?.name || "N/A"}</td>
                <td>${pref.institute?.location || "N/A"}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </div>

        <div class="section">
          <h2>Uploaded Documents</h2>
          <table>
            <tr><th>Document</th><th>Status</th></tr>
            ${applicationData.documents
              .map(
                (doc) => `
              <tr>
                <td>${doc.documentType?.name || "N/A"}</td>
                <td>✓ Uploaded</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </div>

        <div class="section">
          <h2>Payment Information</h2>
          <div class="info-grid">
            <div class="info-item"><span class="label">Status:</span> Completed</div>
            <div class="info-item"><span class="label">Amount:</span> ₹${applicationData.payment?.amount || "N/A"}</div>
            <div class="info-item"><span class="label">Transaction ID:</span> ${applicationData.payment?.transactionId || "N/A"}</div>
            <div class="info-item"><span class="label">Date:</span> ${new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // --------------------------
  // ADMIT CARD
  // --------------------------
  const generateAdmitCard = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admit Card - ${user?.firstName} ${user?.lastName}</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <div class="header">
          <h1>Interview Admit Card</h1>
          <p><strong>Application ID:</strong> APP${user?.id || "N/A"}</p>
        </div>

        <div class="section">
          <h2>Candidate Details</h2>
          <table>
            <tr><td><strong>Name:</strong></td><td>${user?.firstName || ""} ${user?.lastName || ""}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${user?.email || "N/A"}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${user?.phone || "N/A"}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Interview Details</h2>
          <table>
            <tr><td><strong>Date:</strong></td><td>To be announced</td></tr>
            <tr><td><strong>Time:</strong></td><td>To be announced</td></tr>
            <tr><td><strong>Venue:</strong></td><td>To be announced</td></tr>
          </table>
        </div>

        <div class="footer">
          <p><strong>Authorized Signatory</strong></p>
        </div>
      </body>
      </html>
    `;
  };

  // --------------------------
  // PAYMENT RECEIPT
  // --------------------------
  const generatePaymentReceipt = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${user?.firstName} ${user?.lastName}</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <div class="header">
          <h1>Payment Receipt</h1>
          <p><strong>Application ID:</strong> APP${user?.id || "N/A"}</p>
        </div>

        <div class="section">
          <table>
            <tr><td><strong>Candidate Name:</strong></td><td>${user?.firstName || ""} ${user?.lastName || ""}</td></tr>
            <tr><td><strong>Transaction ID:</strong></td><td>${applicationData.payment?.transactionId || "N/A"}</td></tr>
            <tr><td><strong>Amount:</strong></td><td>₹${applicationData.payment?.amount || "N/A"}</td></tr>
            <tr><td><strong>Status:</strong></td><td>Completed</td></tr>
            <tr><td><strong>Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
          </table>
        </div>

        <div class="footer">
          <p><strong>Finance Department</strong></p>
        </div>
      </body>
      </html>
    `;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading application data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#050C9C] mb-2">
            Print & Download
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            {isApplicationComplete
              ? "Your application is complete! Print your documents below."
              : "Complete all sections to access printable documents."}
          </p>
        </div>

        {/* Application Status */}
        <Card
          className={`mb-6 ${
            isApplicationComplete
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isApplicationComplete ? "bg-green-100" : "bg-orange-100"
                }`}
              >
                {isApplicationComplete ? (
                  <Check className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                )}
              </div>
              <div>
                <h2
                  className={`text-lg font-bold ${
                    isApplicationComplete
                      ? "text-green-800"
                      : "text-orange-800"
                  }`}
                >
                  {isApplicationComplete
                    ? "Application Complete!"
                    : "Application In Progress"}
                </h2>
                <p
                  className={`text-sm ${
                    isApplicationComplete
                      ? "text-green-700"
                      : "text-orange-700"
                  }`}
                >
                  {isApplicationComplete
                    ? "All sections completed successfully."
                    : "Please complete all sections to print documents."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 text-[#050C9C]" />
              <h3 className="font-semibold text-sm">Preferences</h3>
              <Badge
                variant={
                  applicationData.preferences.length > 0 ? "default" : "secondary"
                }
                className="text-xs"
              >
                {applicationData.preferences.length} Selected
              </Badge>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-[#050C9C]" />
              <h3 className="font-semibold text-sm">Documents</h3>
              <Badge
                variant={
                  applicationData.documents.length > 0 ? "default" : "secondary"
                }
                className="text-xs"
              >
                {applicationData.documents.length} Uploaded
              </Badge>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-[#050C9C]" />
              <h3 className="font-semibold text-sm">Payment</h3>
              <Badge
                variant={
                  applicationData.payment?.status === "completed"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {applicationData.payment?.status === "completed"
                  ? "Completed"
                  : "Pending"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#050C9C] mb-4">
            Available Documents
          </h2>
          {printableDocuments.map((doc) => (
            <Card key={doc.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${
                          doc.available
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }
                      `}
                    >
                      {doc.available ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-gray-600 text-sm">{doc.description}</p>
                    </div>
                  </div>
                  <Button
                    className={
                      doc.available ? "bg-[#050C9C] hover:bg-[#050C9C]/90" : ""
                    }
                    onClick={() => handlePrint(doc.type)}
                    disabled={!doc.available}
                    variant={doc.available ? "default" : "outline"}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    {doc.available ? "Print" : "Not Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        {isApplicationComplete && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-[#050C9C] mb-2">
                Printing Instructions
              </h3>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Print documents on A4 size paper</li>
                <li>Keep multiple copies of your admit card</li>
                <li>Bring original documents to the interview</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
