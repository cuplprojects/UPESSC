import React, { useState } from "react";
import { Search, Eye, Check, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Verification = () => {
    const [rollNumber, setRollNumber] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const { toast } = useToast();
    const [certificates, setCertificates] = useState([
        {
            sn: 1,
            certificate: "Two self attested copies of application form",
            status: null, // null = not decided, true = yes, false = no
            rejectionReason: "",
            documentUrl:
                "https://via.placeholder.com/600x800/f0f0f0/666?text=Application+Form",
        },
        {
            sn: 2,
            certificate:
                "Two self attested copies of college preference in Anx-3 Format",
            status: null,
            rejectionReason: "",
            documentUrl:
                "https://via.placeholder.com/600x800/f0f0f0/666?text=College+Preference",
        },
        {
            sn: 3,
            certificate: "Original mark sheet of qualifying examination",
            status: null,
            rejectionReason: "",
            documentUrl:
                "https://via.placeholder.com/600x800/f0f0f0/666?text=Mark+Sheet",
        },
        {
            sn: 4,
            certificate: "Character certificate from head of institution",
            status: null,
            rejectionReason: "",
            documentUrl:
                "https://via.placeholder.com/600x800/f0f0f0/666?text=Character+Certificate",
        },
        {
            sn: 5,
            certificate: "Migration certificate (if applicable)",
            status: null,
            rejectionReason: "",
            documentUrl:
                "https://via.placeholder.com/600x800/f0f0f0/666?text=Migration+Certificate",
        },
    ]);

    const handleSearch = () => {
        if (rollNumber.trim()) {
            setIsLoaded(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleStatusChange = (index, newStatus) => {
        const updatedCertificates = certificates.map((cert, i) =>
            i === index
                ? {
                    ...cert,
                    status: newStatus,
                    rejectionReason: newStatus === false ? cert.rejectionReason : "",
                }
                : cert,
        );
        setCertificates(updatedCertificates);
    };

    const handleRejectionReasonChange = (index, reason) => {
        const updatedCertificates = certificates.map((cert, i) =>
            i === index ? { ...cert, rejectionReason: reason } : cert,
        );
        setCertificates(updatedCertificates);
    };

    const handleViewDocument = (cert) => {
        setSelectedDocument(cert);
    };

    const closeModal = () => {
        setSelectedDocument(null);
    };

    const handleSubmit = () => {
        toast({
            title: "Verification Submitted",
            description: "Certificate verification has been submitted successfully.",
            variant: "default",
        });
        // Reset form
        setRollNumber("");
        setIsLoaded(false);
        setCertificates(
            certificates.map((cert) => ({
                ...cert,
                status: null,
                rejectionReason: "",
            })),
        );
    };

    // Check if all certificates have been verified (have a status)
    const allCertificatesVerified = certificates.every(
        (cert) => cert.status !== null,
    );
    // Check if rejected certificates have reasons
    const rejectedCertificatesHaveReasons = certificates
        .filter((cert) => cert.status === false)
        .every((cert) => cert.rejectionReason.trim() !== "");

    const isSubmitDisabled =
        !allCertificatesVerified || !rejectedCertificatesHaveReasons;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                        Certificate Verification
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Enter the candidate's roll number to view and verify their submitted
                        certificates and documents.
                    </p>
                </div>

                {/* Search Section */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="rollNumber" className="text-sm font-medium mb-2 block">
                                    Candidate Roll Number
                                </Label>
                                <Input
                                    id="rollNumber"
                                    type="text"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter roll number (e.g., 2024001)"
                                    className="w-full"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={!rollNumber.trim()}
                                className="bg-[#050C9C] hover:bg-[#050C9C]/90 text-white"
                            >
                                <Search className="w-4 h-4 mr-2 " />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Table */}
                {isLoaded && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Verification for Roll Number: {rollNumber}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-20">Sr. No.</TableHead>
                                            <TableHead>Certificate</TableHead>
                                            <TableHead className="text-center w-32">View</TableHead>
                                            <TableHead className="text-center w-48">Verification</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {certificates.map((cert, index) => (
                                            <React.Fragment key={cert.sn}>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        {cert.sn}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {cert.certificate}
                                                            {cert.status === true && (
                                                                <Badge variant="default" className="bg-green-500">
                                                                    <Check className="w-3 h-3 mr-1" />
                                                                    Approved
                                                                </Badge>
                                                            )}
                                                            {cert.status === false && (
                                                                <Badge variant="destructive" className={"bg-red-500 text-white"}>
                                                                    <X className="w-3 h-3 mr-1" />
                                                                    Rejected
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDocument(cert)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                variant={cert.status === true ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handleStatusChange(index, true)}
                                                                className={cert.status === true ? "bg-green-500 hover:bg-green-600" : ""}
                                                            >
                                                                <Check className="w-4 h-4 mr-1" />
                                                                Yes
                                                            </Button>
                                                            <Button
                                                                variant={cert.status === false ? "destructive" : "outline"}
                                                                size="sm"
                                                                onClick={() => handleStatusChange(index, false)}
                                                            >
                                                                <X className="w-4 h-4 mr-1" />
                                                                No
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {/* Rejection Reason Row */}
                                                {cert.status === false && (
                                                    <TableRow className="bg-destructive/5">
                                                        <TableCell></TableCell>
                                                        <TableCell colSpan={3}>
                                                            <div className="flex flex-col gap-2">
                                                                <Label className="text-xs text-destructive font-medium">
                                                                    Reason for Rejection (Required)
                                                                </Label>
                                                                <Textarea
                                                                    value={cert.rejectionReason}
                                                                    onChange={(e) =>
                                                                        handleRejectionReasonChange(
                                                                            index,
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                    placeholder="Please provide a reason for rejecting this certificate..."
                                                                    className="resize-none"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Footer Section */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    {/* Status Info */}
                                    <div className="flex items-center gap-2 text-sm">
                                        {allCertificatesVerified ? (
                                            rejectedCertificatesHaveReasons ? (
                                                <>
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    <span className="text-green-600 font-medium">
                                                        All certificates verified and ready to submit
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="w-4 h-4 text-destructive" />
                                                    <span className="text-destructive font-medium">
                                                        Please provide rejection reasons for all rejected certificates
                                                    </span>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                                                <span className="text-orange-600 font-medium">
                                                    Please verify all certificates before submitting
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitDisabled}
                                        className="bg-[#050C9C] hover:bg-[#050C9C]/90 text-white"
                                    >
                                        Submit Verification
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!isLoaded && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    Enter Roll Number to Begin
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Please enter a candidate's roll number in the search field above
                                    to view their certificates for verification.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Document Preview Modal */}
            <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            Document Preview - {selectedDocument?.certificate}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto max-h-[calc(90vh-120px)]">
                        <div className="flex justify-center">
                            <img
                                src={selectedDocument?.documentUrl}
                                alt={selectedDocument?.certificate}
                                className="max-w-full h-auto border rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


export default Verification