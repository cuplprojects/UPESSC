import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, X } from "lucide-react";

const Verification = () => {
    const [rollNumber, setRollNumber] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
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
        alert("Verification submitted successfully!");
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
        <div className="min-h-screen bg-[#FBFBFB] font-inter">
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="font-playfair font-medium text-3xl md:text-4xl text-black leading-tight mb-2">
                        Certificate Verification
                    </h1>
                    <div className="w-16 h-px bg-black mb-6"></div>
                    <p className="font-inter text-sm text-[#4D4D4D] leading-6 max-w-2xl">
                        Enter the candidate's roll number to view and verify their submitted
                        certificates and documents.
                    </p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-sm border border-[#E8E8E8] p-6 mb-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="font-inter font-semibold text-sm text-black mb-2 block">
                                Candidate Roll Number
                            </label>
                            <input
                                type="text"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter roll number (e.g., 2024001)"
                                className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={!rollNumber.trim()}
                            className="bg-black text-white font-inter font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </button>
                    </div>
                </div>

                {/* Verification Table */}
                {isLoaded && (
                    <div className="bg-white rounded-sm border border-[#E8E8E8] shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-[#F5F5F5] px-6 py-4 border-b border-[#E8E8E8]">
                            <h2 className="font-inter font-semibold text-lg text-black">
                                Verification for Roll Number: {rollNumber}
                            </h2>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#FBFBFB] border-b border-[#E8E8E8]">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-inter font-semibold text-sm text-black w-20">
                                            Sr. No.
                                        </th>
                                        <th className="px-6 py-4 text-left font-inter font-semibold text-sm text-black">
                                            Certificate
                                        </th>
                                        <th className="px-6 py-4 text-center font-inter font-semibold text-sm text-black w-32">
                                            View
                                        </th>
                                        <th className="px-6 py-4 text-center font-inter font-semibold text-sm text-black w-48">
                                            Verification
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificates.map((cert, index) => (
                                        <React.Fragment key={cert.sn}>
                                            <tr className="border-b border-[#E8E8E8] hover:bg-[#FBFBFB] transition-colors">
                                                <td className="px-6 py-4 font-inter text-sm text-black">
                                                    {cert.sn}
                                                </td>
                                                <td className="px-6 py-4 font-inter text-sm text-[#4D4D4D] leading-6">
                                                    {cert.certificate}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleViewDocument(cert)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-sm transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(index, true)}
                                                            className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors ${cert.status === true
                                                                ? "bg-green-500 text-white"
                                                                : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
                                                                }`}
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(index, false)}
                                                            className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors ${cert.status === false
                                                                ? "bg-red-500 text-white"
                                                                : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                                                                }`}
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Rejection Reason Row */}
                                            {cert.status === false && (
                                                <tr className="border-b border-[#E8E8E8] bg-red-50">
                                                    <td className="px-6 py-4"></td>
                                                    <td className="px-6 py-4" colSpan={3}>
                                                        <div className="flex flex-col gap-2">
                                                            <label className="font-inter font-medium text-xs text-red-700">
                                                                Reason for Rejection (Required)
                                                            </label>
                                                            <textarea
                                                                value={cert.rejectionReason}
                                                                onChange={(e) =>
                                                                    handleRejectionReasonChange(
                                                                        index,
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                placeholder="Please provide a reason for rejecting this certificate..."
                                                                className="w-full px-3 bg-white py-2 border border-red-200 rounded-sm font-inter text-sm text-black placeholder-red-400 focus:outline-none focus:border-red-400 transition-colors resize-none"
                                                                rows={2}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Section */}
                        <div className="px-6 py-6 bg-[#F5F5F5] border-t border-[#E8E8E8]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                {/* Status Info */}
                                <div className="text-sm text-gray-600">
                                    {allCertificatesVerified ? (
                                        rejectedCertificatesHaveReasons ? (
                                            <span className="text-green-600 font-medium">
                                                ✓ All certificates verified and ready to submit
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-medium">
                                                ⚠ Please provide rejection reasons for all rejected
                                                certificates
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-orange-600 font-medium">
                                            ⚠ Please verify all certificates before submitting
                                        </span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitDisabled}
                                    className={`font-inter font-semibold text-xs uppercase tracking-widest px-8 py-3 rounded-sm transition-colors duration-200 ${isSubmitDisabled
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
                                        }`}
                                >
                                    Submit Verification
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoaded && (
                    <div className="bg-white rounded-sm border border-[#E8E8E8] p-12 text-center shadow-sm">
                        <div className="max-w-md mx-auto">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="font-inter font-semibold text-lg text-black mb-2">
                                Enter Roll Number to Begin
                            </h3>
                            <p className="font-inter text-sm text-[#4D4D4D] leading-6">
                                Please enter a candidate's roll number in the search field above
                                to view their certificates for verification.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Document Preview Modal */}
            {selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="font-inter font-semibold text-lg text-black">
                                Document Preview - {selectedDocument.certificate}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                            <div className="flex justify-center">
                                <img
                                    src={selectedDocument.documentUrl}
                                    alt={selectedDocument.certificate}
                                    className="max-w-full h-auto border border-gray-200 rounded-sm shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        .font-playfair {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
        </div>
    );
}


export default Verification