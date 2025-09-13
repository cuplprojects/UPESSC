import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Header
    'header.collegeName': 'UTTAR PRADESH EDUCATION SERVICES SELECTION COMMISSION PRAYAGRAJ',
    'header.subtitle': 'Student Preference Portal',
    'header.logout': 'Logout',
    // Navigation
    'nav.preferences': 'Submit Preferences',
    'nav.documents': 'Upload Documents',
    'nav.payment': 'Pay Interview Fee',
    'nav.print': 'Print Documents',
    // Progress
    'progress.title': 'Application Progress',
    'progress.preferences': 'Institute Preferences',
    'progress.documents': 'Document Upload',
    'progress.payment': 'Fee Payment',
    'progress.print': 'Print Documents',
    'progress.locked': 'Locked',
    'progress.inProgress': 'In Progress',
    'progress.pending': 'Pending',
    'progress.completed': 'Completed',
    // Preferences Section
    'preferences.title': 'Submit Your Institute Preferences',
    'preferences.subtitle': 'Select up to 5 institutes in order of your preference. You can reorder them by dragging.',
    'preferences.available': 'Available Institutes',
    'preferences.selected': 'Your Preferences',
    'preferences.reset': 'Reset Preferences',
    'preferences.verification': 'Verification Code',
    'preferences.submit': 'Submit Your Choice',
    'preferences.lock': 'Lock Your Choice',
    'preferences.lockWarning': 'After submission, enter verification code again to lock your preferences:',
    // Documents Section
    'documents.title': 'Upload Required Documents',
    'documents.subtitle': 'Upload all mandatory documents in PDF format (25KB - 500KB). Merge multiple files into single PDF if needed.',
    'documents.issuingAuthority': 'Issuing Authority',
    'documents.issueDate': 'Date of Issue',
    'documents.certificateNumber': 'Certificate Number',
    'documents.upload': 'Choose File',
    'documents.dragDrop': 'Drag and drop your PDF here',
    'documents.or': 'or',
    'documents.formatInfo': 'PDF format only • 25KB - 500KB',
    'documents.uploaded': 'Uploaded',
    'documents.pending': 'Pending',
    'documents.lock': 'Lock Your Uploaded Documents',
    'documents.lockTitle': 'Lock Your Documents',
    'documents.lockSubtitle': 'Once all documents are uploaded, enter verification code to lock your submissions.',
    // Payment Section
    'payment.title': 'Pay Interview Fee',
    'payment.subtitle': 'Complete the fee payment to proceed with your application.',
    'payment.feeStructure': 'Fee Structure',
    'payment.general': 'General/EWS/OBC Candidates',
    'payment.scst': 'SC/ST Candidates',
    'payment.selectCategory': 'Select Your Category',
    'payment.summary': 'Payment Summary',
    'payment.totalAmount': 'Total Amount:',
    'payment.category': 'Category:',
    'payment.methods': 'Payment Method',
    'payment.creditCard': 'Credit/Debit Card',
    'payment.netBanking': 'Net Banking',
    'payment.upi': 'UPI',
    'payment.wallet': 'Wallet',
    'payment.proceed': 'Proceed to Payment',
    // Print Section
    'print.title': 'Download & Print Documents',
    'print.subtitle': 'Download all required documents for your interview. Bring printed copies along with original documents.',
    'print.interviewLetter': 'Interview Letter',
    'print.interviewLetterDesc': 'Official interview letter with date, time, and venue details',
    'print.preferenceList': 'Preference List',
    'print.preferenceListDesc': 'Your submitted institute preferences in order',
    'print.feeReceipt': 'Fee Receipt',
    'print.feeReceiptDesc': 'Payment confirmation and receipt',
    'print.documentList': 'Document List',
    'print.documentListDesc': 'List of all uploaded documents with verification status',
    'print.ready': 'Ready for download',
    'print.download': 'Download PDF',
    'print.downloadAll': 'Download All Documents',
    'print.instructions': 'Important Instructions',
    'print.instruction1': 'Print all documents and bring them to the interview venue',
    'print.instruction2': 'Carry original documents for verification',
    'print.instruction3': 'Arrive at the venue 30 minutes before your scheduled time',
    'print.instruction4': 'Bring a valid photo ID for identification',
    // Common
    'common.important': 'Important',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.warningText': 'Once preferences are locked, no modifications will be possible. Please review carefully.',
  },
  hi: {
    // Header
    'header.collegeName': 'उत्तर प्रदेश शिक्षा सेवा चयन आयोग प्रयागराज',
    'header.subtitle': 'छात्र प्राथमिकता पोर्टल',
    'header.logout': 'लॉग आउट',
    // Navigation
    'nav.preferences': 'प्राथमिकताएं जमा करें',
    'nav.documents': 'दस्तावेज़ अपलोड करें',
    'nav.payment': 'साक्षात्कार शुल्क भुगतान',
    'nav.print': 'दस्तावेज़ प्रिंट करें',
    // Progress
    'progress.title': 'आवेदन प्रगति',
    'progress.preferences': 'संस्थान प्राथमिकताएं',
    'progress.documents': 'दस्तावेज़ अपलोड',
    'progress.payment': 'शुल्क भुगतान',
    'progress.print': 'दस्तावेज़ प्रिंट',
    'progress.locked': 'लॉक किया गया',
    'progress.inProgress': 'प्रगति में',
    'progress.pending': 'लंबित',
    'progress.completed': 'पूर्ण',
    // Preferences Section
    'preferences.title': 'अपनी संस्थान प्राथमिकताएं जमा करें',
    'preferences.subtitle': 'अपनी प्राथमिकता के क्रम में अधिकतम 5 संस्थान चुनें। आप उन्हें खींचकर पुनः क्रमबद्ध कर सकते हैं।',
    'preferences.available': 'उपलब्ध संस्थान',
    'preferences.selected': 'आपकी प्राथमिकताएं',
    'preferences.reset': 'प्राथमिकताएं रीसेट करें',
    'preferences.verification': 'सत्यापन कोड',
    'preferences.submit': 'अपनी पसंद जमा करें',
    'preferences.lock': 'अपनी पसंद लॉक करें',
    'preferences.lockWarning': 'जमा करने के बाद, अपनी प्राथमिकताओं को लॉक करने के लिए फिर से सत्यापन कोड दर्ज करें:',
    // Documents Section
    'documents.title': 'आवश्यक दस्तावेज़ अपलोड करें',
    'documents.subtitle': 'PDF प्रारूप में सभी अनिवार्य दस्तावेज़ अपलोड करें (25KB - 500KB)। यदि आवश्यक हो तो कई फाइलों को एक PDF में मर्ज करें।',
    'documents.issuingAuthority': 'जारी करने वाली प्राधिकरण',
    'documents.issueDate': 'जारी करने की तारीख',
    'documents.certificateNumber': 'प्रमाणपत्र संख्या',
    'documents.upload': 'फाइल चुनें',
    'documents.dragDrop': 'अपनी PDF यहाँ खींचें और छोड़ें',
    'documents.or': 'या',
    'documents.formatInfo': 'केवल PDF प्रारूप • 25KB - 500KB',
    'documents.uploaded': 'अपलोड किया गया',
    'documents.pending': 'लंबित',
    'documents.lock': 'अपने अपलोड किए गए दस्तावेज़ लॉक करें',
    'documents.lockTitle': 'अपने दस्तावेज़ लॉक करें',
    'documents.lockSubtitle': 'एक बार सभी दस्तावेज़ अपलोड हो जाने पर, अपनी जमा राशि को लॉक करने के लिए सत्यापन कोड दर्ज करें।',
    // Payment Section
    'payment.title': 'साक्षात्कार शुल्क का भुगतान करें',
    'payment.subtitle': 'अपने आवेदन के साथ आगे बढ़ने के लिए शुल्क भुगतान पूरा करें।',
    'payment.feeStructure': 'शुल्क संरचना',
    'payment.general': 'सामान्य/EWS/OBC उम्मीदवार',
    'payment.scst': 'SC/ST उम्मीदवार',
    'payment.selectCategory': 'अपनी श्रेणी चुनें',
    'payment.summary': 'भुगतान सारांश',
    'payment.totalAmount': 'कुल राशि:',
    'payment.category': 'श्रेणी:',
    'payment.methods': 'भुगतान विधि',
    'payment.creditCard': 'क्रेडिट/डेबिट कार्ड',
    'payment.netBanking': 'नेट बैंकिंग',
    'payment.upi': 'UPI',
    'payment.wallet': 'वॉलेट',
    'payment.proceed': 'भुगतान के लिए आगे बढ़ें',
    // Print Section
    'print.title': 'दस्तावेज़ डाउनलोड और प्रिंट करें',
    'print.subtitle': 'अपने साक्षात्कार के लिए सभी आवश्यक दस्तावेज़ डाउनलोड करें। मूल दस्तावेजों के साथ प्रिंटेड कॉपी भी लाएं।',
    'print.interviewLetter': 'साक्षात्कार पत्र',
    'print.interviewLetterDesc': 'दिनांक, समय और स्थान विवरण के साथ आधिकारिक साक्षात्कार पत्र',
    'print.preferenceList': 'प्राथमिकता सूची',
    'print.preferenceListDesc': 'क्रम में आपकी जमा की गई संस्थान प्राथमिकताएं',
    'print.feeReceipt': 'शुल्क रसीद',
    'print.feeReceiptDesc': 'भुगतान पुष्टि और रसीद',
    'print.documentList': 'दस्तावेज़ सूची',
    'print.documentListDesc': 'सत्यापन स्थिति के साथ सभी अपलोड किए गए दस्तावेजों की सूची',
    'print.ready': 'डाउनलोड के लिए तैयार',
    'print.download': 'PDF डाउनलोड करें',
    'print.downloadAll': 'सभी दस्तावेज़ डाउनलोड करें',
    'print.instructions': 'महत्वपूर्ण निर्देश',
    'print.instruction1': 'सभी दस्तावेज़ प्रिंट करें और साक्षात्कार स्थल पर लाएं',
    'print.instruction2': 'सत्यापन के लिए मूल दस्तावेज़ साथ लाएं',
    'print.instruction3': 'अपने निर्धारित समय से 30 मिनट पहले स्थल पर पहुंचें',
    'print.instruction4': 'पहचान के लिए एक वैध फोटो आईडी लाएं',
    // Common
    'common.important': 'महत्वपूर्ण',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.continue': 'जारी रखें',
    'common.back': 'वापस',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.warning': 'चेतावनी',
    'common.warningText': 'एक बार प्राथमिकताएं लॉक हो जाने पर, कोई संशोधन संभव नहीं होगा। कृपया सावधानी से समीक्षा करें।',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'hi') ? savedLanguage : 'en';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'hi') {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
